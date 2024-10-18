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

    public type PostDataInit = {
        access: Access;
        title : Text;
        body: Text; //Eventulmente puede ser en formato MD
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
        msg: Text;
        autor: Principal; // Canister ID del user actor class del comentarista
        date: Int;
        subComments: [Comment];
    };

    public type Post = {  
        id : Nat; 
        metadata : PostMetadata;
        likes: Set.Set<Principal>;
        disLikes: Set.Set<Principal>;
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
        name : Text;
        bio : Text;
        avatar : ?Blob;
        verified : Bool
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
