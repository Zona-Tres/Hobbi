import Map "mo:map/Map";
import Set "mo:map/Set";

import { phash } "mo:map/Map";
import User "./user/user_canister_class";
import Prim "mo:⛔";
import Principal "mo:base/Principal";
import Types "types"

actor {
    type User = {
        actorClass: User.User;
        name: Text;
        avatar: ?Blob;
        notifications: [Types.Notification]; // Ver si es mejor una lista de id de notificaciones
    };

    type Event = Types.Event;

    stable let users = Map.new<Principal, User>();     //PrincipalID =>  User actorClass
    stable let usersCanister = Set.new<Principal>();   //Control y verificacion de procedencia de llamadas
    let events = Map.new<Principal, [var ?Event]>();


    func isUserActorClass(p: Principal): Bool {
        Set.has<Principal>(usersCanister, phash, p);
    };

    func isUser(p: Principal): Bool{
        Map.has<Principal, User>(users, phash, p);
    };

    public shared ({ caller }) func putEvent(event: Event):async Bool {
        assert(isUserActorClass(caller));
        let myEvents = Map.get(events, phash, caller);
        switch myEvents {
            case null {
                let eventsList = Prim.Array_init<?Event>(20, null);
                eventsList[0] := ?event;
                true;
            };
            case (?eventList) {
                var i = 0;
                while(i < 19) {
                    eventList[i] := eventList[i + 1];
                    i += 1;
                };
                eventList[19] := ?event;
                true
            }
        }   
    };

    public shared ({ caller }) func signUp(name: Text, email: ?Text, bio: Text, avatar: ?Blob, fee: Nat):async Principal {
        assert(not isUser(caller));
        Prim.cyclesAdd<system>(fee);
        let actorClass = await User.User(caller, name, email, bio, avatar);
        let newUser: User = {actorClass; name; avatar; notifications = []};
        ignore Map.put(users, phash, caller, newUser);
        ignore Set.put(usersCanister, phash, Principal.fromActor(actorClass));
        Principal.fromActor(actorClass);
    };

    public shared ({ caller }) func signIn(): async Types.SignInResult{
        let user = Map.get<Principal, User>(users, phash, caller);
        switch user {
            case null { #Err };
            case (?user) {
                #Ok({
                    name = user.name; 
                    avatar = user.avatar; 
                    notifications = user.notifications
                    }
                )
            }
        }
    };





}