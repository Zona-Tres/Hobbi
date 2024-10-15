import Map "mo:map/Map";
import Set "mo:map/Set";

import { phash } "mo:map/Map";
import User "./user/user_canister_class";
import Prim "mo:⛔";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Types "types"

actor {
    type User = {
        actorClass: User.User;
        name: Text;
        avatar: ?Blob;
        notifications: [Types.Notification]; // Ver si es mejor una lista de id de notificaciones
    };

    type Event = Types.Event;
    type UserClassCanisterId = Principal;

    let NULL_ADDRESS = Principal.fromText("aaaaa-aa");
    let feeUserCanisterDeploy = 13846202380;
    stable let users = Map.new<Principal, User>();     //PrincipalID =>  User actorClass
    stable let usersCanister = Set.new<Principal>();   //Control y verificacion de procedencia de llamadas
    let events = Map.new<UserClassCanisterId, [var ?Event]>();


    public query func isUserActorClass(p: Principal):async Bool {
        Set.has<Principal>(usersCanister, phash, p);
    };

    func isUser(p: Principal): Bool{
        Map.has<Principal, User>(users, phash, p);
    };

    public shared query ({ caller }) func getMyUserCanisterId(): async Principal{
        assert(isUser(caller));
        let user = Map.get<Principal, User>(users, phash, caller);
        switch user {
            case null { assert false; NULL_ADDRESS};
            case (?user){
                Principal.fromActor(user.actorClass);
            }
        }
    };

    public shared ({ caller }) func putEvent(event: Event):async Bool {
        assert(await isUserActorClass(caller));
        let myEvents = Map.get<UserClassCanisterId, [var ?Event]>(events, phash, caller);
        switch myEvents {
            case null {
                let eventsList = Prim.Array_init<?Event>(20, null);
                eventsList[0] := ?event;
                ignore Map.put<UserClassCanisterId, [var ?Event]>(events, phash, caller, eventsList);
                true;
            };
            case (?eventsList) {
                var i = 0;
                while(i < 19) {
                    eventsList[i] := eventsList[i + 1];
                    i += 1;
                };
                eventsList[19] := ?event;
                ignore Map.put<UserClassCanisterId, [var ?Event]>(events, phash, caller, eventsList);
                true
            }
        }   
    };

    func getEventsFromUser(user: UserClassCanisterId): [Event]{
        let eventList = Map.get<UserClassCanisterId, [var ?Event]>(events, phash, user); 
        switch eventList {
            case null {[]};
            case (?list) {
                let tempBuffer = Buffer.fromArray<Event>([]);
                for (e in list.vals()){
                    switch e {
                        case (?e) {tempBuffer.add(e)};
                        case _{}
                    };
                };
                Buffer.toArray<Event>(tempBuffer);
            }
        }
    };

    public shared ({ caller }) func signUp(data: Types.SignUpData):async Principal {
        assert(not isUser(caller));     
        Prim.cyclesAdd<system>(feeUserCanisterDeploy);
        let actorClass = await User.User(caller, data.name, data.email, data.bio, data.avatar);
        let newUser: User = {actorClass; name = data.name; avatar = data.avatar; notifications = []};
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
                    userCanisterId = Principal.fromActor(user.actorClass);
                    notifications = user.notifications
                    }
                )
            }
        }
    };

    public query func getUserCanisterId(u: Principal): async ?Principal {
        let user = Map.get<Principal, User>(users, phash, u);
        switch user {
            case null { null };
            case (?user) {
                ?Principal.fromActor(user.actorClass)
            }
        } 
    };

    public func getEvents(): async [Types.FeedPart]{
        let eventLists = Map.vals<UserClassCanisterId, [var ?Event]>(events);
        let tempBufferEvents = Buffer.fromArray<Types.FeedPart>([]);
        for(eList in eventLists){
            for (e in eList.vals()){
                switch e {
                    case(?#NewPost(post)){
                        tempBufferEvents.add(post);
                    };
                    case _ {}
                }
            }
        };
        Buffer.toArray<Types.FeedPart>(tempBufferEvents)
    };

    public shared ({ caller }) func getMyFeed(): async [Types.FeedPart] {
        let user = Map.get<Principal, User>(users, phash, caller);
        switch user {
            case null { [] };
            case (?user) {
                let feedBuffer = Buffer.fromArray<Types.FeedPart>([]);
                for(followed in (await user.actorClass.getFolloweds()).vals()){
                    for(event in getEventsFromUser(followed).vals()){
                        switch event {
                            case(#NewPost(post)){
                               feedBuffer.add(post);
                            };
                            case _ {
                                //TODO Establecer acciones para otros tipos de evento, por ejemplo cuando hay un nuevo seguidor
                            };
                        };
                    }
                };
                if(feedBuffer.size() < 5) {
                    for(eventList in Map.vals<UserClassCanisterId, [var ?Event]>(events)){
                        for(event in eventList.vals()){
                            switch event {
                                case(?#NewPost(post)){
                                    feedBuffer.add(post);
                                    if (feedBuffer.size() >=5){
                                        return Buffer.toArray(feedBuffer);
                                    }
                                };
                                case _ { };
                            }
                        } 
                    };                  
                };
                return Buffer.toArray(feedBuffer);
            };
        };

    };
    

}