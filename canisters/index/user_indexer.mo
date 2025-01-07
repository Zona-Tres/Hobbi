import Map "mo:map/Map";
import { phash } "mo:map/Map";
import GlobalTypes "../types";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Array "mo:base/Array";

shared ({ caller }) actor class UserIndexerCanister() = This {

    type UserPreviewInfo = GlobalTypes.UserPreviewInfo;
    type CanisterId = Principal;

    stable let HOBBI_CANISTER_ID = caller;

    let canisterIdsUser = Map.new<Principal, CanisterId>();

    let userPreviews = Map.new<CanisterId, UserPreviewInfo>();

    let communitiesInfo = Map.new<CanisterId, GlobalTypes.CommunityPreviewInfo>();

    // Los followers se identifican por su Canister Id
    // Los followeds se identifican por su Principal Id

    public shared ({ caller }) func putUser(p: Principal, c: CanisterId, u: UserPreviewInfo): async {#Ok; #Err: Text} {
        if(caller != HOBBI_CANISTER_ID){
            return #Err("Acción no permitida");
        };
        ignore Map.put<Principal, CanisterId>(canisterIdsUser, phash, p, c);
        ignore Map.put<CanisterId, UserPreviewInfo>(userPreviews, phash, c, u);
        #Ok
    };

    public query func getFollowersPreview(usersPIDs: [Principal]): async [UserPreviewInfo]{
        let bufferPreviews = Buffer.fromArray<UserPreviewInfo>([]);
        for(userPID in usersPIDs.vals()){
            let canisterId = Map.get<Principal, CanisterId>(canisterIdsUser, phash, userPID);
            switch canisterId {
                case null { };
                case (?canisterId) {
                    switch ( getUserPreview(canisterId) ) {
                        case null { };
                        case (?user) {
                            bufferPreviews.add(user);
                        }
                    }   
                }
            };
        };
        Buffer.toArray<UserPreviewInfo>(bufferPreviews);
    };

    public shared ({ caller }) func updateFollowers(followers: Nat): async Bool{
        let userPreview = Map.get<CanisterId, UserPreviewInfo>(userPreviews, phash, caller);
        switch userPreview {
            case null { false };
            case (?userPreview) {
                ignore Map.put<CanisterId, UserPreviewInfo>(
                    userPreviews, 
                    phash, 
                    caller, 
                    { userPreview with followers});
                true
            }
        }
    };

    public query func getFollowedsPreview(usersCIDs: [CanisterId]): async [UserPreviewInfo] {
        // TODO devolver una paginacion: 20 previsualizaciones mas un booleano que indique si hay mas
        let bufferPreviews = Buffer.fromArray<UserPreviewInfo>([]);
        for(usersCID in usersCIDs.vals()){
            let user = getUserPreview(usersCID);
            switch user {
                case null { };
                case (?user) {
                    bufferPreviews.add(user);  
                }
            };
        };
        Buffer.toArray<UserPreviewInfo>(bufferPreviews);
    };

    func getUserPreview(u: CanisterId): ?UserPreviewInfo{
        Map.get<CanisterId, UserPreviewInfo>(userPreviews, phash, u)
    };

    public shared query ({ caller }) func getPublicDataUser(p: Principal): async ?{name: Text; photo: Blob}{
        let canisterId = Map.get<Principal, CanisterId>(canisterIdsUser, phash, p);
        switch (canisterId) {
            case null {null};
            case ( ?canisterId ) {
                let user = getUserPreview(canisterId);
                switch user {
                    case null { null };
                    case ( ?user ){
                        ?{name = user.name;
                        photo = switch (user.thumbnail) {
                            case null {"00/00"};
                            case (?photo) { photo}
                        }} 
                    }
                } 
            }
        }
    };

  ///////////////////// Communities ///////////////////////////////
    
    public shared ({ caller }) func putCommunity(community: GlobalTypes.CommunityPreviewInfo): async {#Ok; #Err: Text}{
        if(caller != HOBBI_CANISTER_ID){ return #Err("Caller is not Hobbi Canister") };
        ignore Map.put<CanisterId, GlobalTypes.CommunityPreviewInfo>(communitiesInfo, phash, community.canisterId, community);
        #Ok
    };

    public shared ({ caller }) func updateCommunity(community: GlobalTypes.CommunityPreviewInfo): async {#Ok; #Err: Text}{
        if(caller != community.canisterId){ return #Err("Caller is not comunity canister id") };
        ignore Map.put<CanisterId, GlobalTypes.CommunityPreviewInfo>(communitiesInfo, phash, community.canisterId, community);
        #Ok
    };

    public shared query ({ caller }) func getPaginateCommunitiesPreview({page: Nat; qtyPerPage: Nat}): async GlobalTypes.ResponsePaginateCommunities{
        let startSubArray = page * qtyPerPage;
        let communitiesArray = Array.filter<GlobalTypes.CommunityPreviewInfo>(
            Iter.toArray<GlobalTypes.CommunityPreviewInfo>(Map.vals(communitiesInfo)),
            func x = x.visibility
        );
        let size = communitiesArray.size();
        if (size <= startSubArray) { return #Err("Error. Number of Page") };

        let sizeSubArray = if(size >= startSubArray + qtyPerPage) { qtyPerPage }  else { size % qtyPerPage };
        let arr = Array.subArray(
            communitiesArray,
            startSubArray,
            sizeSubArray
        );
        #Ok({arr; hasNext = size > startSubArray + qtyPerPage});
    };

    public shared query({ caller }) func getCommunityInfo(p: Principal): async ?GlobalTypes.CommunityPreviewInfo{
        Map.get<Principal, GlobalTypes.CommunityPreviewInfo>(communitiesInfo, phash, p)
    };
}