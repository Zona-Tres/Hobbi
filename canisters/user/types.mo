
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
    public type PublicDataUser = {
        name : Text;
        bio: Text;
        avatar : ?Blob;
        verified: Bool;
    };

    public type FullDataUser = PublicDataUser and {
        canisterID : Principal;
        owner : Principal;
        email : ?Text;
    };

    
}
