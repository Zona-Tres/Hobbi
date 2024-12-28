import Prim "mo:⛔";
import { now } "mo:base/Time";
import Array "mo:base/Array";
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
    stable var coverImage: ?Blob = null;
    
  ////////////////////////////////////////  Variables operativas //////////////////////////////////////

    stable let admins = Set.fromIter<Principal>(params.admins.vals(), phash);
    stable let members = Map.new<Principal, Text>();
    stable let posts = Map.new<Nat, Post>();
    stable var lastPostId = 0;
    stable var visibility = false; // Revisar junto con visibilityContent
    stable var visibilityContent = false; 
    stable var accessUnderAprobal = false;
    stable var seo: [Text] = [];
    stable var postPreviewArray: [PostPreview] = []; 

  ///////////////////////////////////////  Private functions    ///////////////////////////////////////
    
    func getPostQtyfromRange(start: Int, end: Int): Nat { // Probar
        var qty = 0;
        var index = 0;
        while (index < postPreviewArray.size() or postPreviewArray[index].date > start) {
            if(postPreviewArray[index].date < end) { qty += 1 };
            index += 1;
        };
        return qty
    };

    func isAdmin(caller: Principal): Bool {
        return Set.has<Principal>(admins, phash, caller);
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

    public shared ({ caller }) func settings(setings_: Types.CommunitySettings): async {#Ok; #Err: Text}{
        if(not isAdmin(caller)) { return #Err("You are not an admin") };
        visibility := setings_.visibility;
        visibilityContent := setings_.visibilityContent;
        accessUnderAprobal := setings_.accessUnderAprobal;
        seo := setings_.seo;
        #Ok
    };

  /////////////////////////////////////        Getters        /////////////////////////////////////////
    
    public func getCommunityInfo(): async Types.CommunityInfo {
        return {
            name;
            manifest;
            dateCreation;
            membersQty = Map.size(members);
            postsLastWeek = getPostQtyfromRange(now() - 7*24*60*60*1000000000, now() );
        };
    };

    public shared ({ caller }) func getPaginatePosts({page: Nat; qtyPerPage: Nat}): async {#Ok: Feed; #Err: Text}{
        if(accessAllowed(caller)) { return #Err("You are not allowed to see this content") };
        if(page * qtyPerPage > postPreviewArray.size()) { return #Err("No more posts") };
        let sizePage = if((page + 1) * qtyPerPage > postPreviewArray.size()) {postPreviewArray.size() % qtyPerPage} else {qtyPerPage}; 
        #Ok({
            arr = Array.subArray<PostPreview>(postPreviewArray, page * qtyPerPage, sizePage);
            hasNext = postPreviewArray.size() > (page + 1) * qtyPerPage;
        });
    };

  ////////////////////////////////////      CRUD Post      //////////////////////////////////////////

    public shared ({ caller }) func createPost(init: PostDataInit): async (){
        let userName = Map.get<Principal, Text>(members, phash, caller);
        switch userName {
            case null { return };
            case (?name) {
                let post: Post = {
                    publisher = {principal = caller; name};
                    id = Map.size(posts);
                    metadata = {init with date = now(); progress = #Started};
                    likes = Set.new<Principal>();
                    disLikes = Set.new<Principal>();
                    hashTags = init.hashTags;
                    comments = [];
                };    
                lastPostId += 1;
                ignore Map.put<Nat, Post>(posts, nhash, lastPostId, post);
                let postPreview = getPostPreview(post);
                postPreviewArray := Prim.Array_tabulate<PostPreview>(
                    postPreviewArray.size() + 1, 
                    func i = if(i == postPreviewArray.size()) {postPreview} else {postPreviewArray[i]}
                );   
            }
        };
    };

    public shared ({ caller }) func readPost(postId: Nat): async {#Ok: PostResponse; #Err: Text} {
        if(accessAllowed(caller)) { return #Err("You are not allowed to see this content") };
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

    
}