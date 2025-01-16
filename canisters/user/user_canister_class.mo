import Types "types";
import GlobalTypes "../types";
import Rand "mo:random/Rand";
import Set "mo:map/Set";
import Map "mo:map/Map";
import {nhash; phash} "mo:map/Map";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Prim "mo:⛔";
import { print } "mo:base/Debug";

// TODO usuarios favoritos
// TODO hashtags favoritos
// TODO usuarios sugeridos
  
shared ({ caller }) actor class User (init: GlobalTypes.DeployUserCanister) = this {

  ////////////////////////////////////// Tipos /////////////////////////////////////////////////////

    type FullDataUser = Types.FullDataUser;
    type PublicDataUser = Types.PublicDataUser;
    type EditableUserData = {
        name: Text;
        bio: Text; 
        email: ?Text;
        interests: [Text];
    };

    type PostID = Types.PostID;
    type Post = Types.Post;
    type PostResponse = Types.PostResponse;
    type PostDataInit = Types.PostDataInit;
    type PostPreview = GlobalTypes.PostPreview;
    type Comment = Types.Comment;
    type Access = Types.Access;
    type Notification = GlobalTypes.Notification;
    type Event = GlobalTypes.Event;
    type Reaction = GlobalTypes.Reaction;
    type UserClassCanisterId = Principal;
    type PaginateResponse<T> = {array: [T]; thereIsMore: Bool};

    stable let HOBBI = caller; // para validar llamadas desde el canister factory
    stable let OWNER = init.owner;

  ///////////////////////// Datos relacionados al usuario usuario //////////////////////////////////
    stable var name: Text = init.name;
    stable var email: ?Text = init.email;
    stable var bio: Text = init.bio;
    stable var avatar: ?Blob = init.avatar;
    stable var thumbnail = init.thumbnail;
    stable var coverImage: ?Blob = null;
    stable var interests: [Text] = [];
    stable var verified = false; // Para verificacion de email mediante el envio de un código

  //////////////////// Datos relacionados a la actividad del usuario ///////////////////////////////
    stable let posts = Map.new<PostID, Post>();
    stable let followers = Set.new<Principal>(); //los follower se identifican por su Principal id
    stable let followeds = Set.new<UserClassCanisterId>(); //Los seguidos se identifican por su canister id
    stable let favorites = Set.new<UserClassCanisterId>(); //Los favoritos se identifican por su canister id
    stable let blockedUsers = Set.new<Principal>();
    stable let blockerUsers = Set.new<Principal>();
    stable let hiddenUsers = Set.new<Principal>();
    stable var communities: [Principal] = [];

    // stable let postReacteds = Map.new<PostID, Reaction>();
    // TODO Implementar lista de actividad reciente, reacciones, posteos, comentarios.
    var tempPostPreviews: {lastUpdate: Int; previews: [PostPreview]} = {previews = []; lastUpdate = 0};
    var previewsRefreshTime = 1 * 60 * 1_000_000_000; // 1 minuto 
    // TODO implementar lista de notificaciones, likes dislikes comentarios, nuevo seguidor


  /////////////////////////// Variables y objetos auxiliares ///////////////////////////////////////

    let rand = Rand.Rand();
    stable var lastPostID = 0;
    stable var lastCommentId = 0;
    stable var counterPostLastWeek: [Int] = [0]; //timestamp de los posteos
    private var verificationCodes = {email = 0; phone = 0}; //Agregar o quitar a gusto

    let HOBBI_CANISTER = actor(Principal.toText(HOBBI)) : actor {
        getUserCanisterId: shared (Principal) -> async ?Principal;
        getPrincipalFromCanisterId: shared (Principal) -> async ?Principal;
        isUserActorClass: shared (Principal) -> async Bool;
        putEvent: shared (Event) -> async Bool;
        removeEvent: shared (Int) -> async ();
        pushReactionToPostPreview: shared (Nat, Reaction, Principal) -> async Bool;
        updateReactions: shared ({postId: Nat; likes: Nat; disLikes: Nat}) -> ();
        isCommunity: shared Principal -> async Bool;
        
    };

    let INDEXER_CANISTER = actor(Principal.toText(init.indexerUserCanister)): actor {
        updateFollowers: shared (Nat) -> ();
        updateFolloweds: shared (Nat) -> ();
        getFollowedsPreview: shared ([Principal]) -> async [GlobalTypes.UserPreviewInfo];
        getFollowersPreview: shared ([Principal]) -> async [GlobalTypes.UserPreviewInfo];
        updateUser: shared (GlobalTypes.UserPreviewInfo) -> ();
        // getUsersWithInterests: shared ([Text]) -> async [GlobalTypes.UserPreviewInfo];
        getUsersWithInterests: query ([Text]) -> async [GlobalTypes.UserPreviewInfo];
    };

  ///////////////////////////////// Funciones privadas /////////////////////////////////////////////
    func isOwner(p: Principal): Bool { p == OWNER };
    func isHobbi(p: Principal): Bool { p == HOBBI };

    func dataUser(): FullDataUser {
        {   name;
            bio;
            avatar;
            canisterID = Principal.fromActor(this);
            owner = OWNER;
            email;
            verified;
            coverImage;
            interests;
            followers =  Set.size(followers);
            followeds = Set.size(followeds);
        };
    };
    func isBlockedUser(p: Principal): Bool {
        Set.has<Principal>(blockedUsers, phash, p)   
    };

    func isBlokerUser(p: Principal): Bool {
        Set.has<Principal>(blockerUsers, phash, p);
    };

    func extractPostPreview(){
        let postArray = Map.toArray<PostID, Post>(posts);
        let previews = Prim.Array_tabulate<PostPreview>(
            postArray.size(),
            func i = {
                hashTags = postArray[i].1.hashTags;
                access = postArray[i].1.metadata.access;
                autor = Principal.fromActor(this); 
                postId = postArray[i].0;
                title = postArray[i].1.metadata.title;
                photoPreview = postArray[i].1.metadata.imagePreview;
                date = postArray[i].1.metadata.date;
                body = postArray[i].1.metadata.body;
                image_url = postArray[i].1.metadata.image_url;
                likes = Set.size(postArray[i].1.likes);
                disLikes = Set.size(postArray[i].1.disLikes);
                userName = name;
                autorPhoto = thumbnail;
            }
        );
        tempPostPreviews := {lastUpdate = Time.now(); previews}
    };

    func extractUserPreviewInfo(): GlobalTypes.UserPreviewInfo {
        counterPostLastWeek := Array.filter<Int>(counterPostLastWeek, func x = x < Time.now() + 7*26*60*60*1000000000);
        let userDataPreview: GlobalTypes.UserPreviewInfo = {
            name;
            thumbnail;
            userCanisterId = Principal.fromActor(this);
            followers = Set.size(followers);
            recentPosts = counterPostLastWeek.size();
            interests;
        };
    };
  ////////////////////////// Verificaciones opcionales de usuario //////////////////////////////////
    // Posible caso de uso: cuando un usuario pierde el acceso a su identidad en ICP 

    public shared ({caller}) func sendEmailCode(): async {#Err: Text; #Ok: Text}{
        assert(isOwner(caller));
        switch email{
            case null {return #Err("Email not provided")};
            case (?email){
                rand.setRange(100000, 999999); 
                let code = await rand.next();
                verificationCodes := { verificationCodes with email = code};
                //TODO Enviar email con el codigo code //Codigo de ejemplo: https://github.com/domwoe/email-verification/tree/main
                #Ok("Se ha enviado un email con el codigo de verificacion a " # email);
            };
        }  
    };

    public shared ({caller}) func putCodeVerifyEmail(_code: Nat): async Bool {
        assert(isOwner(caller));
        if(_code == verificationCodes.email and _code != 0) {
            verified := true;
        };
        verificationCodes := {verificationCodes with email = 0};
        verified
    };

  ////////////////////////////////////// Getters ///////////////////////////////////////////////////
    public shared query ({caller}) func getMyInfo():async  FullDataUser { //Se llama desde el front para cargar los datos en el dashboard
        assert(isOwner(caller));
        dataUser()
    };

    public shared query ({ caller }) func getPublicInfo(): async {#Ok: PublicDataUser; #Err: Text} {
        if(isBlockedUser(caller)){ return #Err("Access denied") };
        #Ok{
            name; 
            bio; 
            avatar; 
            verified;
            coverImage;
            interests;
            canisterID =  Principal.fromActor(this);
            followers = Set.size(followers);
            followeds = Set.size(followeds);
            }
    };

    public shared query ({ caller }) func getFolloweds(): async [UserClassCanisterId] {
        assert(isOwner(caller) or isHobbi(caller));
        Set.toArray<UserClassCanisterId>(followeds);
    };

    public shared query ({ caller }) func getFollowers(): async [Principal]{
        assert(isOwner(caller) or isHobbi(caller));
        Set.toArray<Principal>(followers);
    };

    public shared ({ caller }) func getFollowedsPreview(): async [GlobalTypes.UserPreviewInfo and {isFavorite: Bool}] {
        assert(isOwner(caller) or isHobbi(caller));
        let result = await INDEXER_CANISTER.getFollowedsPreview(Set.toArray(followeds));
        Prim.Array_tabulate<GlobalTypes.UserPreviewInfo and {isFavorite: Bool}>(
            result.size(),
            func x = {result[x] with isFavorite = _isFavorite(result[x].userCanisterId)}
        )
    };

    public shared ({ caller }) func getFollowersPreview(): async [GlobalTypes.UserPreviewInfo]{
        assert(isOwner(caller) or isHobbi(caller));
        await INDEXER_CANISTER.getFollowersPreview(Set.toArray(followers));
    };

    public shared ({ caller }) func getHiddenUsers():async [Principal] {
        assert(isOwner(caller) or isHobbi(caller));
        Set.toArray<Principal>(hiddenUsers);
    };

    public shared ({ caller }) func getRecommendedUsers(): async [GlobalTypes.UserPreviewInfo]{
        assert(isOwner(caller) or isHobbi(caller));
        await INDEXER_CANISTER.getUsersWithInterests(interests);
    };

    // type PostPreviewExtended = PostPreview and {body: Text; image_url: ?Text };

    public shared ({ caller }) func getPaginatePost({page: Nat; qtyPerPage: Nat}): async {arr: [PostPreview]; hasNext: Bool}{
        if( Time.now() > tempPostPreviews.lastUpdate + previewsRefreshTime ){
            extractPostPreview();
        };
        if(tempPostPreviews.previews.size() >= page * qtyPerPage) {
            let (length: Nat, hasNext: Bool) = if (tempPostPreviews.previews.size() >= (page + 1)  * qtyPerPage){
                (qtyPerPage, tempPostPreviews.previews.size() > (page + 1))
            } else {
                (tempPostPreviews.previews.size() % qtyPerPage, false)
            };

            let arr = Array.subArray<PostPreview>(
                tempPostPreviews.previews, page * qtyPerPage, length);
            {arr; hasNext}
        } else {
            {arr = []; hasNext = false}
        }   
    };

    public shared ({ caller }) func getPostQty(): async Nat{
        Map.size(posts)
    };

  //////////////////////// Blocking and unblocking users, hiding user //////////////////////////////

    public shared ({ caller }) func blockUser( u: Principal): async {#Ok; #Err: Text} {
        assert(isOwner(caller) and caller != u);
        let userToBlock = await HOBBI_CANISTER.getUserCanisterId(u);
        switch userToBlock{
            case null {return #Err("The principal provided is not associated with any registered user")};
            case (?userToBlock){
                let userToBlockActorClass = actor(Principal.toText(userToBlock)) : actor {
                    removeMe: shared (Principal) -> async {#Ok; #Err: Text};
                };
                ignore Set.remove<Principal>(followeds, phash, u);
                ignore Set.remove<Principal>(followers, phash, u);
                ignore Set.put<Principal>(blockedUsers, phash, u);
                INDEXER_CANISTER.updateFollowers(Set.size(followers));
                INDEXER_CANISTER.updateFolloweds(Set.size(followeds));
                await userToBlockActorClass.removeMe(caller);
            }
        };   
    };

    public shared ({ caller }) func removeMe(callerCanisterOwner: Principal): async {#Ok; #Err: Text}{
        if(?caller != (await HOBBI_CANISTER.getUserCanisterId(callerCanisterOwner))){
            return #Err("The caller is not a UserActorClass");
        };
        ignore Set.remove<Principal>(followeds, phash, callerCanisterOwner);
        ignore Set.remove<Principal>(followers, phash, callerCanisterOwner);
        INDEXER_CANISTER.updateFollowers(Set.size(followers));
        INDEXER_CANISTER.updateFolloweds(Set.size(followeds));
        ignore Set.put<Principal>(blockerUsers, phash, callerCanisterOwner);
        #Ok
    };

    public shared ({ caller }) func unBlockUser( callerCanisterOwner: Principal): async {#Err; #Ok} {
        let user = await HOBBI_CANISTER.getUserCanisterId(callerCanisterOwner);
        switch user {
            case null { };
            case (?remoteUser){
                let remoteActor = actor(Principal.toText(remoteUser)) : actor {
                    unBlockme: shared (Principal) -> async ();
                };
                await remoteActor.unBlockme(caller);
            }
        };
        ignore Set.remove<Principal>(blockedUsers, phash, callerCanisterOwner);
        #Ok
    };

    public shared ({ caller }) func unBlockme(owner: Principal): async (){
        if(?caller != (await HOBBI_CANISTER.getUserCanisterId(owner))){
            return;
        };
        ignore Set.remove<Principal>(blockerUsers, phash, owner);
    };

    public shared ({ caller }) func hideUser( u: Principal): async {#Err; #Ok} {
        if(not isOwner(caller)) {return #Err};
        ignore Set.put<Principal>(hiddenUsers, phash, u);
        #Ok
    };

    public shared ({ caller }) func unHideUser( u: Principal): async {#Err; #Ok} {
        if(not isOwner(caller)) {return #Err};
        ignore Set.put<Principal>(hiddenUsers, phash, u);
        #Ok
    };

  ////////////////////////////////////// Setters ///////////////////////////////////////////////////

    public shared ({ caller }) func loadAvatar({_avatar: Blob; _thumbnail: Blob}): async {#Err; #Ok} {
        if(not isOwner(caller)) { return #Err};
        avatar := ?_avatar;
        thumbnail := ?_thumbnail;
        INDEXER_CANISTER.updateUser(extractUserPreviewInfo());
        #Ok;
    };

    public shared ({ caller }) func removeAvatar(): async {#Err; #Ok} {
        if(not isOwner(caller)) { return #Err};
        avatar := null;
        thumbnail := null;
        INDEXER_CANISTER.updateUser(extractUserPreviewInfo());
        #Ok;
    };
    public shared ({ caller }) func loadCoverImage(image: Blob): async {#Err; #Ok} {
        if(not isOwner(caller)) { return #Err};
        coverImage := ?image;
        #Ok
    };

    public shared ({ caller }) func editProfile(data: EditableUserData): async FullDataUser {
        // TODO Agragar campo intereses
        assert(isOwner(caller));
        if(email != data.email) { verified := false }; // Si se cambia el email se requiere nueva verificacion
        email := data.email;
        bio := data.bio;
        name := data.name;
        interests := data.interests;
        INDEXER_CANISTER.updateUser(extractUserPreviewInfo());
        dataUser();
    };

  ///////////////////////////////////// CRUD Post //////////////////////////////////////////////////

    public shared ({ caller }) func createPost(init: PostDataInit):async  PostID {
        assert(isOwner(caller));
        let date = Time.now();
        let metadata: Types.PostMetadata = { init with date; progress = #Started };
        lastPostID += 1;
        let newPost: Post = {
            metadata;
            hashTags = init.hashTags;
            comments = [];
            id = lastPostID;
            likes = Set.new<Principal>();
            disLikes = Set.new<Principal>();
        };
        ignore Map.put<PostID, Post>(posts, nhash, lastPostID, newPost);
        let newPostEvent = {
            autor = Principal.fromActor(this);
            userName = name;
            postId = newPost.id;
            access = init.access;
            body = init.body;
            image_url = init.image_url;
            hashTags = init.hashTags;
            title = newPost.metadata.title;
            photoPreview = newPost.metadata.imagePreview;
            date;
            likes = 0;
            disLikes = 0;
            autorPhoto = thumbnail;
        };
        
        ignore HOBBI_CANISTER.putEvent(#NewPost(newPostEvent));
        lastPostID;     
    };

    public shared ({ caller }) func readPost(id: PostID): async {#Ok: PostResponse; #Err: Text} {
        let post = Map.get<PostID, Post>(posts, nhash, id);
        if(isBlockedUser(caller) or isBlokerUser(caller)){
            return #Err("Access denied");
        };
        switch post {
            case null { return #Err("PostID not Found")};
            case (?post){
                let likes = (Set.toArray<Principal>(post.likes)).size();
                let disLikes = (Set.toArray<Principal>(post.disLikes)).size();
                let postResponse: PostResponse = {post with likes; disLikes};
                return switch (post.metadata.access){
                    case(#Private){
                        if(caller == OWNER){ #Ok(postResponse) } 
                        else{ #Err("Private access") };
                    };
                    case(#Followers) {
                        if(Set.has(followers, phash, caller) or caller == OWNER) { #Ok(postResponse) } 
                        else{ #Err("Only followers access") };
                    };
                    case(#Public){ #Ok(postResponse) }
                }  
            }
        }
    };

    public shared ({ caller }) func updatePost(id: PostID, updatedData: PostDataInit): async {#Ok: PostResponse; #Err: Text} {
        if(not isOwner(caller)) { return #Err("The caller is not the owner")};
        let post = Map.get<PostID, Post>(posts, nhash, id);
        switch post {
            case null { #Err("Incorrect PostID")};
            case (?post) {
                let metadata = {post.metadata with updatedData};
                let updatedPost = { post with metadata };
                ignore Map.put<PostID, Post>(posts, nhash, id,updatedPost );
                #Ok({updatedPost with likes = updatedPost.likes.size(); disLikes = updatedPost.disLikes.size()});
            }
        }
    };

    public shared ({ caller }) func modifyPostAccess(id: PostID, access: Access): async {#Ok; #Err: Text}{
        if(not isOwner(caller)) { return #Err("The caller is not the owner")};
        let post = Map.get<PostID, Post>(posts, nhash, id);
        switch post {
            case null { #Err("Incorrect PostID") };
            case (?post) {
                let metadata = {post.metadata with access};
                let updatedPost = { post with metadata };
                ignore Map.put<PostID, Post>(posts, nhash, id,updatedPost );
                #Ok;
            }
        }
    };

    public shared ({ caller }) func deletePost(id: PostID): async {#Ok: PostResponse; #Err: Text} {
        if(not isOwner(caller) and caller != HOBBI) { return #Err("The caller is not the owner")};
        let post = Map.remove<PostID, Post>(posts, nhash, id);
        switch post {
            case null { #Err("Incorrect PostID")};
            case (?post) {
                print("Post encontrado");
                await HOBBI_CANISTER.removeEvent(post.metadata.date);
                #Ok({post with likes = post.likes.size(); disLikes = post.disLikes.size()}) }
        }
    };

  /////////////////////// Intercomunicacion con el canister principal //////////////////////////////

    // func emitEvent(event: Event): async Bool {
    //     let remoteMainCanister = actor(Principal.toText(HOBBI)): actor{
    //         putEvent: shared (Event) -> async Bool
    //     };
    //     await remoteMainCanister.putEvent(event);
    // };

  ////////////////////////// Intercomunicacion con otros usuarios //////////////////////////////////
  ////////////////////////////////// Follow & favorites ////////////////////////////////////////////

    func identifyCaller(p: Principal): async {userCID: ?Principal; userPrincipal: ?Principal }{
        if(Principal.toText(p).size() != 27){
            {userCID = await HOBBI_CANISTER.getUserCanisterId(p); userPrincipal= ?p}; 
        } else {
            {userCID = ?p; userPrincipal = await HOBBI_CANISTER.getPrincipalFromCanisterId(p)};        
        };
    };

    public shared ({ caller }) func followMe(): async Bool {
        let {userCID; userPrincipal} = await identifyCaller(caller);
        print(debug_show(userCID, userPrincipal));
        switch userCID {
            case null { false };
            case (?canisterID) {
                let remoteCaller = actor(Principal.toText(canisterID)): actor {
                    followBack: shared () -> async Bool
                };
                switch userPrincipal {
                    case null { false };
                    case (?userPrincipal) {
                        ignore Set.put<Principal>(followers, phash, userPrincipal);
                        INDEXER_CANISTER.updateFollowers(Set.size(followers));
                        await remoteCaller.followBack();
                    }
                }    
            }
        }
    };

    public shared ({ caller }) func unFollowMe(): async Bool{
        let {userCID; userPrincipal} = await identifyCaller(caller);
        switch userCID {
            case null { false };
            case (?userCID) {
                let remoteCaller = actor(Principal.toText(userCID)): actor {
                    unFollowBack: shared () -> async Bool
                };
                switch userPrincipal {
                    case null { false };
                    case (?userPrincipal) {
                        ignore Set.remove<Principal>(followers, phash, userPrincipal);
                        INDEXER_CANISTER.updateFollowers(Set.size(followers));
                        await remoteCaller.unFollowBack();
                    }
                }    
            }
        }
    };

    public shared ({ caller }) func followBack(): async Bool {
        assert(await HOBBI_CANISTER.isUserActorClass(caller));
        ignore Set.put<Principal>(followeds, phash, caller);
        INDEXER_CANISTER.updateFolloweds(Set.size(followeds));
        true
    };

    public shared ({ caller }) func unFollowBack(): async Bool {
        assert(await HOBBI_CANISTER.isUserActorClass(caller));
        ignore Set.remove<Principal>(followeds, phash, caller);
        INDEXER_CANISTER.updateFolloweds(Set.size(followeds));
        true
    };

    public shared ({ caller }) func isFollowed(p: Principal): async Bool {
        assert(isOwner(caller));
        Set.has<Principal>(followeds, phash, p)
    };

    public shared ({ caller }) func isFollower(p: Principal): async Bool {
        assert(isOwner(caller));
        Set.has<Principal>(followers, phash, p)
    };
    
    public shared ({ caller }) func addFavorite(p: Principal): async {#Ok; #Err: Text} {
        if(not isOwner(caller)) { return #Err("The caller is not the owner")};
        if(not (await HOBBI_CANISTER.isUserActorClass(p))){
            return #Err("The principal provided does not correspond to a User Actor Class")
        };
        let remoteUser = actor(Principal.toText(p)): actor {
            followMe: shared () -> async Bool
        };
        if(await remoteUser.followMe()){
           ignore Set.put<Principal>(favorites, phash, p);
            #Ok 
        } else {
            #Err("Unexpected error")
        }     
    };

    public shared ({ caller }) func removeFavorite(p: Principal): async {#Ok; #Err: Text}{
        if(not isOwner(caller)) { return #Err("The caller is not the owner")};
        Set.delete<Principal>(favorites, phash, p);
        #Ok
    };

    func _isFavorite(p: Principal): Bool {Set.has<Principal>(favorites, phash, p)};

    public shared query ({ caller }) func isFavorite(p: Principal): async Bool{
        if(not isOwner(caller)) { return false};
        _isFavorite(p)
    };
    
    public shared ({ caller }) func getFavoritesPreview(): async [GlobalTypes.UserPreviewInfo]{
        if(not isOwner(caller)) { return []};
        await INDEXER_CANISTER.getFollowedsPreview(Set.toArray(favorites));
    };

    public shared query ({ caller }) func getFavorites(): async [Principal]{
        if(not isOwner(caller)) { return []};
        Set.toArray(favorites);
    };

  
  ////////////////////////////////////////////// Reactions /////////////////////////////////////////

    public shared ({caller}) func sendReaction({postId: PostID; canisterId: Principal; reaction: Reaction}):async Bool {
        assert(isOwner(caller));
        let remoteUserCanister = actor(Principal.toText(canisterId)): actor{
            receiveReaction: shared (PostID, Reaction )-> async Bool;
        };
        print("enviado reaccion al UserCanisterClass remoto");
        let response = await remoteUserCanister.receiveReaction(postId, reaction);

        ignore HOBBI_CANISTER.putEvent(#React({reaction = reaction; postId; user = canisterId})); 
        response;
    };

    public shared ({caller}) func receiveReaction(postId: PostID, r: Reaction):async Bool {
        print("Recibiendo reaccion en el UserCanisterClass remoto");
        assert(await HOBBI_CANISTER.isUserActorClass(caller));
        print("El caller es un UserCanisterClass: Ok");
        let post = Map.get<PostID, Post>(posts, nhash, postId);
        switch post{
            case null { return false};
            case (?post){              
                switch r {
                    case (#Like) {
                        ignore Set.put<Principal>(post.likes, phash, caller);
                        ignore Set.remove<Principal>(post.disLikes, phash, caller);
                    };
                    case (#Dislike) {
                        ignore Set.put<Principal>(post.disLikes, phash, caller);
                        ignore Set.remove<Principal>(post.likes, phash, caller);  
                    };
                    case (#Clear) {
                        ignore Set.remove<Principal>(post.likes, phash, caller);
                        ignore Set.remove<Principal>(post.disLikes, phash, caller);
                    };
                    case (#Custom(_customReact)) {
                        //TODO Ver qué hacer con las reacciones custom
                    }
                };
                HOBBI_CANISTER.updateReactions(
                    {
                        postId;
                        likes = Set.size(post.likes); 
                        disLikes = Set.size(post.disLikes)
                    }
                );
                true
            }
        }      
    };

  ///////////////////////////////////// Crud Comments Post /////////////////////////////////////////
    public shared ({ caller }) func commentPost(id: PostID, msg: Text):async  {#Ok; #Err: Text} {
        if(isBlockedUser(caller) or isBlockedUser(caller)){
            return #Err("Access denied");
        };
        let userCanister = await HOBBI_CANISTER.getUserCanisterId(caller);
        switch userCanister{
            case null { #Err("No eres usuario")};
            case (?userCanister){
                let post = Map.get<PostID, Post>(posts, nhash, id);
                switch post {
                    case null { #Err("Post no encontrado")};
                    case (?post) {
                        let date = Time.now();
                        lastCommentId += 1;
                        //TODO agregar nombre del autor del comentario
                        let comment: Comment = {
                            commentId = lastCommentId;
                            date;
                            msg;
                            autor = caller;
                            subComments: [Comment] = [];
                        };
                        let commentsBuffer = Buffer.fromArray<Comment>(post.comments);
                        commentsBuffer.add(comment);
                        let updateComments = Buffer.toArray<Comment>(commentsBuffer);
                        ignore Map.put<PostID, Post>(posts, nhash, id, {post with comments = updateComments});

                        #Ok()
                    }
                }
            }
        }
    };

    public shared ({ caller }) func updateComment(postId: PostID, commentId: Nat, msg: Text):async {#Ok; #Err} {
        let post = Map.get<PostID, Post>(posts, nhash,postId);
        switch post {
            case null { #Err };
            case(?post) {
                var index = 0;
                while(index < post.comments.size()){
                    if(post.comments[index].commentId == commentId and post.comments[index].autor == caller){
                        let updateComments = Prim.Array_tabulate<Comment>(
                            post.comments.size(),
                            func x = if(x == index){{post.comments[x] with msg}} else {post.comments[x]}
                        );
                        ignore Map.put<PostID, Post>(posts, nhash, postId, {post with comments = updateComments});
                        return #Ok
                    };
                    index += 1;
                };
                #Err;
            }
        }
    };

    public shared ({ caller }) func deleteComment(postId: Nat, commentId: Nat): async {#Ok; #Err} {
        let post = Map.get<PostID, Post>(posts, nhash, postId);
        switch post {
            case null { #Err };
            case(?post) {
                let commentsBuffer = Buffer.fromArray<Comment>([]);
                for(comment in post.comments.vals()){
                    if(not (comment.commentId == commentId and comment.autor == caller)){   
                        commentsBuffer.add(comment);
                    };
                };
                let updateComments = Buffer.toArray(commentsBuffer);
                ignore Map.put<PostID, Post>(posts, nhash, postId, {post with comments = updateComments});
                #Err 
            }
        }
    };

  ///////////////////////////// Communities ////////////////////////////////////////////
    public shared ({ caller }) func addCommunity(): async (){
        assert ( await HOBBI_CANISTER.isCommunity(caller));
        communities := Prim.Array_tabulate<Principal>(
            communities.size(),
            func i = if(i == 0) {caller} else {communities[i - 1]}
        )
    };

    public shared ({ caller }) func getMyCommunities(): async {#Ok: [Principal]; #Err: Text}{
        if(not isOwner(caller)) {return #Err("Caller is not owner")};
        #Ok(communities);
    };

}