

module {

    
    public type Notification = {
        #NewPost: Principal; // Nuevo post de UserClass seguido
        #NewFollower: Principal; // Puede ser UserClass o User ID
        #NewReaction: Nat; //Nueva reacción a un postID
        #NewComment: Nat;  //
    };
    
    public type Reaction = {
        #Like;
        #Dislike;
        #Custom: Text //Emogi
    };

    public type Event = {
        #Pub: Nat;
        #Sub: Principal;
        #React: Reaction;
    };

    public type UserInfo = {
        name: Text;
        avatar: ?Blob;
        notifications: [Notification];
    };
    public type SignInResult = {
        #Ok: UserInfo;
        #Err;
    };
}