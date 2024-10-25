

module {
    public type SignUpData = {
        // indexerUserCanister: Principal;
        // owner: Principal;
        name: Text;
        bio: Text;
        email: ?Text;
        avatar: ?Blob;
        thumbnail: ?Blob;
    };

    public type DeployUserCanister = SignUpData and {
        indexerUserCanister: Principal;
        owner: Principal;
    };

    public type Notification = {
        #NewPost: {
            autor: Principal; 
            id: Nat;
            title: Text;
            photo: ?Blob;
            date: Int;
        }; // Nuevo post de UserClass seguido
        #NewFollower: Principal; // Puede ser UserClass o User ID
        #NewReaction: Nat; //Nueva reacción a un postID
        #NewComment: Nat;  //
    };

    public type Reaction = {
        #Like;
        #Dislike;
        #Custom: Text //Emogi
    };

    public type Access = {
        #Public;
        #Private;
        #Followers
    };

    public type PostPreview = {
        hashTags: [Text];
        access: Access;
        autor: Principal; 
        postId: Nat;
        title: Text;
        photoPreview: ?Blob;
        date: Int;
    };

    public type Event = {
        #NewPost: PostPreview;
        #Pub: Nat;
        #Sub: Principal;
        #React: {reaction: Reaction; postId: Nat; user: Principal};
    };

    public type UserInfo = {
        name: Text;
        avatar: ?Blob;
        userCanisterId: Principal;
        notifications: [Notification];
    };

    public type UserPreviewInfo = {
        name: Text;
        thumbnail: ?Blob;
        userCanisterId: Principal;
        followers: Nat;
        recentPosts: Nat;
    };
    public type SignInResult = {
        #Ok: UserInfo;
        #Err;
    };

    public type FeedPart = {
        // likes: Nat;
        // disLikes: Nat;
        hashTags: [Text];
        title: Text;
        photoPreview: ?Blob;
        date: Int;
        autor: Principal;
        postId: Nat;
    };

    type PostID = Nat;
    public type ReportType = {
        #InboxReport; //Para cuando se implemente un modulo de mensajeria
        #PostReport: {post: PostID;};
        #CommentReport: {post: PostID; commentId: Nat}
    };

    public type ReportStatus = {
        #Started;
        #UnderReview;
        #EjectedArchived;
        #ApprovedArchived;
    };

    public type Report = { 
        canisterId: Principal;
        conflictFocus: ReportType; // Para la resolución de conflicto podria integrarse una IA
        msg: Text;      
    };

    public type Cause = Report and {
        id: Nat;
        date: Int;
        informer: Principal;
        speechInDefense: {msg: Text; date: Int};
        status: ReportStatus;
    }


}