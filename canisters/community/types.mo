module {

    public type InitCommunityParams = {
        admins: [Principal];
        dateCreation: Int;
        name: Text;
        description: Text;
        logo: Blob;
        indexer_canister: Principal;
    };

    public type CommunityConfig = {
        hashTags: [Text]; 
        visibility: Bool; 
        visibilityContent: Bool;
        accessUnderApprobal: Bool;    
    };

    public type CommunityVisualSettings = {
        logo: Blob;
        coverImage: Blob;
        // css: ?Text;
    };

    public type CommunityInfo = CommunityVisualSettings  and {
        name: Text;
        description: Text;
        dateCreation: Int;
        manifest: Text;
        membersQty: Nat;
        postsLastWeek: Nat;
    };


}