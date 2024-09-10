import Map "mo:map/Map";
import { phash } "mo:map/Map";
import User "./user/user_canister_class";
import Prim "mo:⛔";
import Principal "mo:base/Principal";

actor {

    let users = Map.new<Principal, User.User>(); //PrincipalID =>  CanisterID of User actorClass

    func isUser(p: Principal): Bool{
        Map.has<Principal, User.User>(users, phash, p);
    };

    public shared ({ caller }) func signUp(name: Text, email: ?Text, bio: Text, avatar: ?Blob, fee: Nat):async Principal {
        assert(not isUser(caller));
        Prim.cyclesAdd<system>(fee);
        let newUserActorClass = await User.User(caller, name, email, bio, avatar);
        ignore Map.put(users, phash, caller,newUserActorClass);
        Principal.fromActor(newUserActorClass);
    };




}