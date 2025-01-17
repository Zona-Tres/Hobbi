import Set "mo:map/Set";
module {

    public type Progress = {
        #Started;
        #Interested;
        #Finished
    };

    public type MediaType =  {
        #Book;
        #Tv;
        #Music;
        #Game
    };

    public type UpdatableDataPost = {
        access: Access;
        title : Text;
        body: Text; //Eventulmente puede ser en formato MD
        hashTags: [Text];

    };


    public type PostDataInit = UpdatableDataPost and {
        image : ?Blob; //Imagen preferentemente menor a 1 MB
        imagePreview : ?Blob; //Imagen para previsualización. Reducción de la original a 64 KB aprox  
        image_url : ?Text;
        media_type : MediaType
    };
    
    public type PostMetadata = PostDataInit and {   
        progress : Progress;
        date : Int;
    };

    public type PostID = Nat;

    public type Access = {
        #Public;
        #Private;
        #Followers
    };

    public type UserID = Nat;

    public type Comment = {
        commentId: Nat;
        msg: Text;
        autor: Principal; // Principal ID del usuario que comenta
        date: Int;
        subComments: [Comment];
        // likes: Nat;
        // disLikes: Nat;
    };

    public type Post = {  
        id : Nat; 
        metadata : PostMetadata;
        likes: Set.Set<Principal>;
        disLikes: Set.Set<Principal>;
        hashTags: [Text];
        comments: [Comment];
    };

    
    public type PostResponse = {  
        id : Nat; 
        metadata : PostMetadata;
        likes: Nat;
        disLikes: Nat;
        comments: [Comment];
    };


    public type PublicDataUser = {
        // TODO cantidad de posteos del mes.
        name : Text;
        bio : Text;
        avatar : ?Blob;
        verified : Bool;
        canisterID:  Principal;
        coverImage: ?Blob;
        followers: Nat;
        followeds: Nat;
        interests: [Text];
        callerIsFollower: Bool;
    };
    
    public type FullDataUser = PublicDataUser and {
        canisterID : Principal;
        owner : Principal;
        email : ?Text
    };

    public type FeedPart = {
        title: Text;
        photo: ?Blob;
        autor: Principal;
        postId: Nat;
    }

}
