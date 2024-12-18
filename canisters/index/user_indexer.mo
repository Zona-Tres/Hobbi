import Map "mo:map/Map";
import { phash } "mo:map/Map";
import GlobalTypes "../types";
import Buffer "mo:base/Buffer";


shared ({ caller }) actor class UserIndexerCanister() = This {

    type UserPreviewInfo = GlobalTypes.UserPreviewInfo;
    type CanisterId = Principal;

    stable let HOBBI_CANISTER_ID = caller;

    let canisterIdsUser = Map.new<Principal, CanisterId>();

    let userPreviews = Map.new<CanisterId, UserPreviewInfo>();

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
    }
}