import Prim "mo:⛔";
import { now } "mo:base/Time";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Types "./types";
import UserTypes  "../user/types";
import GlobalTypes "../types";
import Set "mo:map/Set";
import { phash; nhash } "mo:map/Map";
import Map "mo:map/Map";

// Los Canister de comunidades se despliegan desde el canister HOBBI
shared ({ caller = HOBBI }) actor class Community(params: Types.InitCommunityParams) { 

  //////////////////////////////////////////         Types         ////////////////////////////////////

    public type Post = UserTypes.Post and {publisher: {principal: Principal; name: Text}};
    public type PostDataInit = UserTypes. PostDataInit;
    type UpdatableDataPost = UserTypes.UpdatableDataPost;
    public type PostPreview = GlobalTypes.PostPreview;
    public type PostResponse = UserTypes.PostResponse;
    type Feed = GlobalTypes.Feed;

  /////////////////////////////////////////  Variables generales  /////////////////////////////////////

    stable var name = params.name;
    stable let dateCreation = params.dateCreation;
    stable var manifest = "";
    stable var logo: ?Blob = null;
    stable var coverImage: ?Blob = null;
    
  ////////////////////////////////////////  Variables operativas //////////////////////////////////////

    stable let admins = Set.fromIter<Principal>(params.admins.vals(), phash);
    stable let membersRequsts = Map.new<Principal, Text>();
    stable let members = Map.new<Principal, Text>();
    stable let posts = Map.new<Nat, Post>();
    stable var lastPostId = 0;
    stable var visibility = true; // Revisar junto con visibilityContent
    stable var visibilityContent = true; 
    stable var accessUnderApprobal = false;
    stable var seo: [Text] = [];
    stable var postPreviewArray: [PostPreview] = []; 

  ///////////////////////////////////////  Private functions    ///////////////////////////////////////
    
    func getPostQtyfromRange(start: Int, end: Int): Nat { // Probar
        var qty = 0;
        var index = 0;
        while (index < postPreviewArray.size() and postPreviewArray[index].date > start) {
            if(postPreviewArray[index].date < end) { qty += 1 };
            index += 1;
        };
        return qty
    };

    func isAdmin(p: Principal): Bool {
        return Set.has<Principal>(admins, phash, p);
    };

    func accessAllowed(p: Principal): Bool {
        visibility 
        or Map.has<Principal, Text>(members, phash, p) 
        or isAdmin(p);  
    };

    func getPostPreview(post: Post): PostPreview {
        return {
            hashTags = post.hashTags;
            access = #Public;
            autor = post.publisher.principal;
            userName = post.publisher.name;
            postId = post.id;
            title = post.metadata.title;
            photoPreview = post.metadata.imagePreview;
            image_url = post.metadata.image_url;
            body = post.metadata.body;
            date = post.metadata.date;
            likes = Set.size<Principal>(post.likes);
            disLikes = Set.size<Principal>(post.disLikes);
        };
    };

  //////////////////////////////////////   Setters Only Admin  ////////////////////////////////////////

    public shared ({ caller }) func setName(name_: Text): async {#Ok; #Err: Text}{
        if(not isAdmin(caller)) { return #Err("You are not an admin") };
        name := name_;
        #Ok
    };

    public shared ({ caller }) func setManifest(manifest_: Text): async {#Ok; #Err: Text} {
        if(not isAdmin(caller)) { return #Err("You are not an admin") };
        manifest := manifest_;
        #Ok
    };

    public shared ({ caller }) func setCoverImage(coverImage_ : Blob): async {#Ok; #Err: Text}{
        if(not isAdmin(caller)) { return #Err("You are not an admin") };
        coverImage := ?coverImage_;
        #Ok
    };

    public shared ({ caller }) func setLogo(logo_: Blob): async {#Ok; #Err: Text} {
        if(not isAdmin(caller)) { return #Err("You are not an admin") };
        logo := ?logo_;
        #Ok
    };

    public shared ({ caller }) func config(config_: Types.CommunityConfig): async {#Ok; #Err: Text}{
        if(not isAdmin(caller)) { return #Err("You are not an admin") };
        visibility := config_.visibility;
        visibilityContent := config_.visibilityContent;
        accessUnderApprobal := config_.accessUnderApprobal;
        seo := config_.seo;
        #Ok
    };

  /////////////////////////////////////        Getters        /////////////////////////////////////////

    public shared query ({ caller }) func getUsers(): async [(Principal, Text)]{
        assert(isAdmin(caller));
        Map.toArray<Principal, Text>(members);
    };

    public shared query ({ caller }) func getAdmins(): async [Principal] {
        assert(isAdmin(caller));
        Set.toArray<Principal>(admins);
    };
    
    public query func getCommunityInfo(): async Types.CommunityInfo {
        return {
            logo;
            coverImage;
            name;
            manifest;
            dateCreation;
            membersQty = Map.size(members);
            postsLastWeek = getPostQtyfromRange(now() - 7*24*60*60*1000000000, now() );
        };
    };

    public shared query({ caller }) func getPaginatePosts({page: Nat; qtyPerPage: Nat}): async {#Ok: Feed; #Err: Text}{
        if(not accessAllowed(caller)) { return #Err("You are not allowed to see this content") };
        if(page * qtyPerPage > postPreviewArray.size()) { return #Err("No more posts") };
        let sizePage = if((page + 1) * qtyPerPage > postPreviewArray.size()) {postPreviewArray.size() % qtyPerPage} else {qtyPerPage}; 
        #Ok({
            arr = Array.subArray<PostPreview>(postPreviewArray, page * qtyPerPage, sizePage);
            hasNext = postPreviewArray.size() > (page + 1) * qtyPerPage;
        });
    };

  ////////////////////////////////////   Users Management    //////////////////////////////////////////

    public shared ({ caller }) func joinCommunity(): async {#Ok: Text; #Err: Text} {
        let hobbiCanister = actor(Principal.toText(HOBBI)): actor { 
            getNameUser: shared (Principal) -> async ?Text
        };
        let name = await hobbiCanister.getNameUser(caller);
        switch name {
            case null { return #Err("User not found") };
            case (?name) {
                if(accessUnderApprobal) {
                    ignore Map.put<Principal, Text>(membersRequsts, phash, caller, name);
                    return #Ok("Application for admission received")
                } else {
                    ignore Map.put<Principal, Text>(members, phash, caller, name);
                    return #Ok("Welcome to the community")
                };
            }
        }    
    };

    public shared ({ caller }) func getIncomingMembers(): async [(Principal, Text)]{
        Map.toArray<Principal, Text>(membersRequsts)
    };

    public shared ({ caller }) func approveMember(u: Principal): async {#Ok; #Err: Text} {
        if(not isAdmin(caller)) { return #Err("You are not an admin") };
        let name = Map.remove<Principal, Text>(membersRequsts, phash, u);
        switch name {
            case null { return #Err("User not found") };
            case (?name) {
                ignore Map.remove<Principal, Text>(membersRequsts, phash, u);
                ignore Map.put<Principal, Text>(members, phash, u, name);
                #Ok
            }
        }
    };

    public shared ({ caller }) func leaveCommunity(): async {#Ok; #Err: Text} {
        ignore Map.remove<Principal, Text>(members, phash, caller);
        #Ok
    };

    public shared ({ caller }) func removeUser(user: Principal): async {#Ok; #Err: Text} {
        if(not isAdmin(caller)) { return #Err("You are not an admin") };
        ignore Map.remove<Principal, Text>(members, phash, user);
        #Ok
    };
  ///////////////////////////////////       CRUD Post       ///////////////////////////////////////////

    public shared ({ caller }) func createPost(init: PostDataInit): async {#Ok: Nat; #Err: Text} {
        let userName = Map.get<Principal, Text>(members, phash, caller);
        switch userName {
            case null { #Err("Caller is not member") };
            case (?name) {
                lastPostId += 1;
                let post: Post = {
                    publisher = {principal = caller; name};
                    id = lastPostId;
                    metadata = {init with date = now(); progress = #Started};
                    likes = Set.new<Principal>();
                    disLikes = Set.new<Principal>();
                    hashTags = init.hashTags;
                    comments = [];
                };    
                
                ignore Map.put<Nat, Post>(posts, nhash, lastPostId, post);
                let postPreview = getPostPreview(post);
                postPreviewArray := Prim.Array_tabulate<PostPreview>(
                    postPreviewArray.size() + 1, 
                    func i = if(i == postPreviewArray.size()) {postPreview} else {postPreviewArray[i]}
                );
                #Ok(lastPostId)
            }
        };
    };

    public shared query ({ caller }) func readPost(postId: Nat): async {#Ok: PostResponse; #Err: Text} {
        if(not accessAllowed(caller)) { return #Err("You are not allowed to see this content") };
        let post = Map.get<Nat, Post>(posts, nhash, postId);
        switch post {
            case null { return #Err("Post not found") };
            case (?post) {
                #Ok({
                    id = post.id;
                    metadata = post.metadata;
                    likes = Set.size<Principal>(post.likes);
                    disLikes = Set.size<Principal>(post.disLikes);
                    comments = post.comments;
                });
            }
        }
    };

    public shared ({ caller }) func updatePost(postId: Nat, postUpdated: UpdatableDataPost): async {#Ok: PostResponse; #Err: Text}{
        let post = Map.get<Nat, Post>(posts, nhash, postId);
        switch post {
            case null { return #Err("Post not found") };
            case (?post) {
                if(post.publisher.principal != caller) {
                    return #Err("You are not the autor of this post");
                };
                let updatedPost = {post with metadata = {post.metadata with postUpdated}};
                ignore Map.put<Nat, Post>(
                    posts,
                    nhash,
                    postId,
                    updatedPost
                );
                #Ok({
                    id = updatedPost.id;
                    metadata = updatedPost.metadata;
                    likes = Set.size<Principal>(updatedPost.likes);
                    disLikes = Set.size<Principal>(updatedPost.disLikes);
                    comments = updatedPost.comments;
                }); 
            }
        }
    };

    public shared ({ caller }) func deletePost(postId: Nat): async {#Ok; #Err: Text} {
        let post = Map.remove<Nat, Post>(posts, nhash, postId);
        switch post {
            case null { #Err("Post not found") };
            case (?post) {
                if(post.publisher.principal != caller) {
                    ignore Map.put<Nat, Post>(posts, nhash, postId, post);
                    return #Err("You are not the autor of this post");
                };
                postPreviewArray := Array.filter<PostPreview>(
                    postPreviewArray,
                    func p = p.postId != postId
                );
                #Ok
            }
        }
    };

  /////////////////////////////////////////////////////////////////////////////////////////////////////

    
}