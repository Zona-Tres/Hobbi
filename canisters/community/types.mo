module {

    public type InitCommunityParams = {
        admins: [Principal];
        dateCreation: Int;
        name: Text;
    };

    public type CommunitySettings = {
        seo: [Text]; // Para indexar en motores de busqueda del canister Hobbi
        visibility: Bool; 
        visibilityContent: Bool;
        accessUnderAprobal: Bool;    
    };

    public type CommunityInfo = {
        name: Text;
        dateCreation: Int;
        manifest: Text;
        membersQty: Nat;
        postsLastWeek: Nat;
    };


}