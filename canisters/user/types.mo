module {

    public type Progress = {
        #Started;
        #Interested;
        #Finished
    };

    public type MediaType = {
        #Book;
        #Tv;
        #Music;
        #Game
    };

    public type PostDataInit = {
        access: Access;
        title : Text;
        image_url : Text;
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
        autor: UserID; // ID del usuario en el backend principal
        date: Int;
        subComments: [Comment];
    };

    public type Post = {  
        id : Nat; 
        metadata : PostMetadata;
        likes: [Principal];
        disLikes: [Principal];
        comments: [Comment];
    };

    public type Reaction = {
        #Like;
        #Dislike;
        #Custom: Text //Emogi
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

}
