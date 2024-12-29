module {

    public type InitCommunityParams = {
        admins: [Principal];
        dateCreation: Int;
        name: Text;
    };

    public type CommunityConfig = {
        seo: [Text]; // Para indexar en motores de busqueda del canister Hobbi
        visibility: Bool; 
        visibilityContent: Bool;
        accessUnderApprobal: Bool;    
    };

    public type CommunityVisualSettings = {
        logo: ?Blob;
        coverImage: ?Blob;
        // css: ?Text;
    };

    public type CommunityInfo = CommunityVisualSettings  and {
        name: Text;
        dateCreation: Int;
        manifest: Text;
        membersQty: Nat;
        postsLastWeek: Nat;
    };


}