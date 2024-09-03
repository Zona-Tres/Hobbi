
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

    public type PostMetadata = {
        title : Text;
        autor : Text;
        image_url : Text;
        progress : Progress;
        media_type : MediaType
    };

    public type PostID = Nat;

    public type Post = {
        id : Text;
        date : Int;
        message : Text;
        metadata : PostMetadata
    };
    public type PublicInfoUser = {
        name : Text;
        avatar : ?Blob;
        verified: Bool;
    };

    public type PrivateInfoUser = PublicInfoUser and {
        canisterID : Principal;
        owner : Principal;
        email : ?Text;
        postLiked : [PostID];
    };

    
}
