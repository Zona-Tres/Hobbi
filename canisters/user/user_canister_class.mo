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
  

shared ({ caller }) actor class User (_owner: Principal, _name: Text, _email: ?Text,  _bio: Text, _avatar: ?Blob) = this {

    type FullDataUser = Types.FullDataUser;
    type PublicDataUser = Types.PublicDataUser;
    type PostID = Types.PostID;
    type Post = Types.Post;
    type PostResponse = Types.PostResponse;
    type PostDataInit = Types.PostDataInit;
    type Comment = Types.Comment;
    type Access = Types.Access;
    type Notification = GlobalTypes.Notification;
    type Event = GlobalTypes.Event;
    type Reaction = GlobalTypes.Reaction;
    type UserClassCanisterId = Principal;
    stable let HOBBI = caller; // para validar llamadas desde el canister factory
    stable let OWNER = _owner;

  ///////////////////////// Datos relacionados al usuario usuario //////////////////////////////////
    stable var name: Text = _name;
    stable var email: ?Text = _email;
    stable var bio: Text = _bio;
    stable var avatar: ?Blob = _avatar;
    stable var coverImage: ?Blob = null;
    stable var verified = false; // Para verificacion de email mediante el envio de un código

  //////////////////// Datos relacionados a la actividad del usuario ///////////////////////////////
    stable let posts = Map.new<PostID, Post>();
    stable let followers = Set.new<Principal>(); //los follower se identifican por su Principal id
    stable let followeds = Set.new<UserClassCanisterId>(); //Los seguidos se identifican por su canister id
    stable let blockedUsers = Set.new<Principal>();
    stable let hiddenUsers = Set.new<Principal>();

    // stable let postReacteds = Map.new<PostID, Reaction>();


  /////////////////////////// Variables y objetos auxiliares ///////////////////////////////////////

    let rand = Rand.Rand();
    stable var lastPostID = 0;
    private var verificationCodes = {email = 0; phone = 0}; //Agregar o quitar a gusto

    let HOBBI_CANISTER = actor(Principal.toText(HOBBI)) : actor {
        getUserCanisterId: shared (Principal) -> async ?Principal;
        isUserActorClass: shared (Principal) -> async Bool;
        removeEvent: shared (Int) -> async ();
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
            followers =  Set.size(followers);
            followeds = Set.size(followeds);
        };
    };
    func isBlockedUser(p: Principal): Bool {
        Set.has<Principal>(blockedUsers, phash, p)   
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
            canisterID =  Principal.fromActor(this);
            followers = Set.size(followers);
            followeds = Set.size(followeds);
            }
    };

    public shared query ({ caller }) func getFolloweds(): async [UserClassCanisterId] {
        assert(isOwner(caller) or isHobbi(caller));
        Set.toArray<UserClassCanisterId>(followeds)
    };

    public shared ({ caller }) func getFollowers(): async [Principal]{
        assert(isOwner(caller) or isHobbi(caller));
        Set.toArray<Principal>(followers);
    };

    public shared ({ caller }) func getHiddenUsers():async [Principal] {
        assert(isOwner(caller) or isHobbi(caller));
        Set.toArray<Principal>(hiddenUsers);
    };

  //////////////////////// Blocking and unblocking users, hiding user //////////////////////////////

    public shared ({ caller }) func blockUser( u: Principal): async {#Ok; #Err: Text} {
        assert(isOwner(caller));
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
        #Ok
    };

    public shared ({ caller }) func unBlockUser( u: Principal): async {#Err; #Ok} {
        if(not isOwner(caller)) {return #Err};
        ignore Set.remove<Principal>(blockedUsers, phash, u);
        #Ok
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

    public shared ({ caller }) func loadAvatar(_avatar: Blob): async {#Err; #Ok} {
        if(not isOwner(caller)) { return #Err};
        avatar := ?_avatar;
        #Ok;
    };

    public shared ({ caller }) func removeAvatar(): async {#Err; #Ok} {
        if(not isOwner(caller)) { return #Err};
        avatar := null;
        #Ok;
    };
    public shared ({ caller }) func loadCoverImage(image: Blob): async {#Err; #Ok} {
        if(not isOwner(caller)) { return #Err};
        coverImage := ?image;
        #Ok
    };

    public shared ({ caller }) func editProfile(_name: Text, _bio: Text, _email: ?Text): async FullDataUser {
        assert(isOwner(caller));
        if(email != _email) { verified := false}; // Si se cambia el email se requiere nueva verificacion
        email := _email;
        bio := _bio;
        name := _name;

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
            postId = newPost.id;
            access = init.access;
            hashTags = init.hashTags;
            title = newPost.metadata.title;
            photoPreview = newPost.metadata.imagePreview;
            date;
        };
        
        ignore emitEvent(#NewPost(newPostEvent));
        lastPostID;     
    };

    public shared ({ caller }) func readPost(id: PostID): async {#Ok: PostResponse; #Err: Text} {
        let post = Map.get<PostID, Post>(posts, nhash, id);
        if(isBlockedUser(caller)){
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
        if(not isOwner(caller)) { return #Err("The caller is not the owner")};
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

    func emitEvent(event: Event): async Bool {
        let remoteMainCanister = actor(Principal.toText(HOBBI)): actor{
            putEvent: shared (Event) -> async Bool
        };
        await remoteMainCanister.putEvent(event);
    };

  ////////////////////////// Intercomunicacion con otros usuarios //////////////////////////////////
    ////////////////////////// Follow ////////////////////////////////////////////////////////////////
    public shared ({ caller }) func followMe(): async Bool {
        let callerActorClassId = await HOBBI_CANISTER.getUserCanisterId(caller);
        switch callerActorClassId {
            case null { false };
            case (?callerActorClassId) {
                let remoteCaller = actor(Principal.toText(callerActorClassId)): actor {
                    followBack: shared () -> async Bool
                };
                ignore Set.put<Principal>(followers, phash, caller);
                await remoteCaller.followBack();
            }
        }
    };

    public shared ({ caller }) func followBack(): async Bool {
        assert(await HOBBI_CANISTER.isUserActorClass(caller));
        ignore Set.put<Principal>(followeds, phash, caller);
        true
    };

    /// Esta función conecta con el canister del usuario publicador para enviarle la reaccion a su post,
    /// y conecta con el canister hobbi principal para emitir el evento relacionado ///
    public shared ({caller}) func sendReaction(postId: PostID, userClass: Principal, r: Reaction):async Bool {
        // ignore Map.put<PostID, Reaction>(postReacteds, nhash, postId, r);
        // Registrar el like en el canister del otro usuario
        let remoteUserCanister = actor(Principal.toText(userClass)): actor{
            receiveReaction: shared (PostID, Reaction )-> async Bool;
        };
        let response = await remoteUserCanister.receiveReaction(postId, r);
        ignore emitEvent(#React({reaction = r; postId; user = userClass})); //Mis seguidores sabran de mis reacciones sobre otros post :D
        response;
    };

    public shared ({caller}) func receiveReaction(id: PostID, r: Reaction):async Bool {

        let post = Map.get<PostID, Post>(posts, nhash, id);
        switch post{
            case null { return false};
            case (?post){              
                switch r {
                    case (#Like) {
                        ignore Set.put<Principal>(post.likes, phash, caller);
                        ignore Set.remove<Principal>(post.disLikes, phash, caller);
                        return true;
                    };
                    case (#Dislike) {
                        ignore Set.put<Principal>(post.disLikes, phash, caller);
                        ignore Set.remove<Principal>(post.likes, phash, caller);
                        return true;
                    };
                    case (#Custom(_customReact)) {
                        //TODO Ver qué hacer con las reacciones custom
                        return true
                    }
                };
                
            }
        }      
    };

    //////////////////// Crud Comments Post ///////////////////////
    public shared ({ caller }) func commentPost(id: PostID, msg: Text):async  {#Ok; #Err: Text} {
        
        let userCanister = await HOBBI_CANISTER.getUserCanisterId(caller);
        switch userCanister{
            case null { #Err("No eres usuario")};
            case (?userCanister){
                let post = Map.get<PostID, Post>(posts, nhash, id);
                switch post {
                    case null { #Err("Post no encontrado")};
                    case (?post) {
                        let date = Time.now();
                        let comment: Comment = {
                            date;
                            msg;
                            autor = userCanister;
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

    public shared ({ caller }) func updateComment() {
        //TODO Establecer un identificador de comentarios
    };

    public shared ({ caller }) func deleteComment() {
        //TODO
    };

    /////////////////////////////////////////////////////////////////////

    // public shared query ({ caller }) func getFood(): async [Types.FeedPart] {

    // }

}