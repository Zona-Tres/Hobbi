import Map "mo:map/Map";
import Set "mo:map/Set";

import { phash; thash } "mo:map/Map";
import User "./user/user_canister_class";
import UserIndexerCanister "./index/user_indexer";
import Prim "mo:⛔";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Types "types";
import { print } "mo:base/Debug";
import Array "mo:base/Array";

actor {
    type Profile = {
        actorClass: User.User;
        name: Text;
        avatar: ?Blob;
        globalNotifications: [Types.Notification]; // Ver si es mejor una lista de id de notificaciones
    };

    type UserPreviewInfo = Types.UserPreviewInfo;

    type Event = Types.Event;
    type UserClassCanisterId = Principal;

    let NULL_ADDRESS = Principal.fromText("aaaaa-aa");
    let feeUserCanisterDeploy = 200_000_000_000; // cantidad mínimo 13_846_202_568
    stable let users = Map.new<Principal, Profile>();     //PrincipalID =>  User actorClass
    stable let usersCanister = Set.new<Principal>();   //Control y verificacion de procedencia de llamadas

    //TODO enviar map de eventos a canister dedicado
    stable let events = Map.new<UserClassCanisterId, [Event]>();

    stable let rankingHashTag = Map.new<Text, Nat>();

  // canister de indexación para guardar previsualizaciones de usuario
    stable var indexerUserCanister: UserIndexerCanister.UserIndexerCanister = actor("aaaaa-aa");

  //////////////////////////// Despliegue de canisters auxiliares ///////////////////////////////
    type InitResponse = {
        indexerUserCanister: Principal;
    };

    func hobbiInit(): async () {
        print("Desplegando el canister indexer");
        Prim.cyclesAdd<system>(200_000_000_000);
        indexerUserCanister := await UserIndexerCanister.UserIndexerCanister();
    };

  ///////////////////////////////////////////////////////////////////////////////////////////////

    public query func isUserActorClass(p: Principal):async Bool {
        Set.has<Principal>(usersCanister, phash, p);
    };

    func isUser(p: Principal): Bool{
        Map.has<Principal, Profile>(users, phash, p);
    };

    public shared query ({ caller }) func getMyUserCanisterId(): async Principal{
        assert(isUser(caller));
        let user = Map.get<Principal, Profile>(users, phash, caller);
        switch user {
            case null { assert false; NULL_ADDRESS};
            case (?user){
                Principal.fromActor(user.actorClass);
            }
        }
    };

    func putHashTags(event: Event) {
        switch event {
            case (#NewPost(post)) {
                for(hashtag in post.hashTags.vals()){
                    let previousValue = Map.get<Text, Nat>(rankingHashTag, thash, hashtag);
                    let updtaeValue = switch previousValue {
                        case null { 0 };
                        case( ?qty ) { qty + 1 };
                    };
                    ignore Map.put<Text, Nat>(rankingHashTag, thash, hashtag, updtaeValue )
                };
            };
            case (_) { }
        }
    };

    func decrementHashTags(_hashTags: [Text]) {
        for(hashTag in _hashTags.vals()){
            let oldValue = Map.get<Text, Nat>(rankingHashTag, thash, hashTag);
            switch oldValue{
                case(?value){
                    if (value == 1) {
                        ignore Map.remove<Text, Nat>(rankingHashTag, thash, hashTag)
                    } else {
                        ignore Map.put<Text, Nat>(rankingHashTag, thash, hashTag, value -1)
                    };
                };
                case null {};
            }
        }
    };

    public shared ({ caller }) func putEvent(event: Event):async Bool {
        assert(await isUserActorClass(caller));
        putHashTags(event);
        let myEvents = Map.get<UserClassCanisterId, [Event]>(events, phash, caller);
        switch myEvents {
            case null {
                let eventsList: [Event] = [event];
                ignore Map.put<UserClassCanisterId, [Event]>(events, phash, caller, eventsList);
                true;
            };
            case (?eventsList) {
                var updteEventList: [Event] = []; 
                if(eventsList.size() == 20){
                    updteEventList := Prim.Array_tabulate<Event>(
                        20, func x = if(x == 0){event} else { eventsList[x - 1]}
                    );
                    
                } else {
                    updteEventList := Prim.Array_tabulate<Event>(
                        eventsList.size() + 1, func x = if(x == 0){event} else { eventsList[x - 1]}
                    );
                };
                ignore Map.put<UserClassCanisterId, [Event]>(events, phash, caller, updteEventList);
                true;
            }
        }
    };

    public shared ({ caller }) func removeEvent(_date: Int): async () {
        let myEvents = Map.get<UserClassCanisterId, [Event]>(events, phash, caller);   
        switch myEvents {
            case null{  };
            case (?myEvents){
                let eventBuffer = Buffer.fromArray<Event>([]);
                for(e in myEvents.vals()){
                    switch e {
                        case (#NewPost(data)){
                            if(data.date != _date){
                                decrementHashTags(data.hashTags);
                                eventBuffer.add(#NewPost(data));
                            } else {
                                print("Post encontrado")
                            }
                        };
                        case (event){
                            eventBuffer.add(event);
                        }
                    }
                };
                ignore Map.put<UserClassCanisterId, [Event]>(events, phash, caller, Buffer.toArray(eventBuffer));
            }
        }   
    };

    func getEventsFromUser(user: UserClassCanisterId): [Event]{
        let eventList = Map.get<UserClassCanisterId, [Event]>(events, phash, user); 
        switch eventList {
            case null {[]};
            case (?list) { list }
        }
    };

    public shared ({ caller }) func signUp(data: Types.SignUpData):async Principal {
        if(Principal.fromActor(indexerUserCanister) == NULL_ADDRESS){
            await hobbiInit();
        };
        assert(not isUser(caller));    
        Prim.cyclesAdd<system>(feeUserCanisterDeploy);
        let actorClass = await User.User({
            data with 
            owner = caller; 
            indexerUserCanister = Principal.fromActor(indexerUserCanister)
        });
        let newUser: Profile = {actorClass; name = data.name; avatar = data.avatar; globalNotifications = []};
        ignore Map.put(users, phash, caller, newUser); //TODO Creo que con la implementación del indexerUser ya no es necesario
        ignore Set.put(usersCanister, phash, Principal.fromActor(actorClass));
        let userDataPreview: UserPreviewInfo = {
            name = data.name;
            thumbnail = data.thumbnail;
            userCanisterId = Principal.fromActor(actorClass);
            followers = 0;
            recentPosts = 0;
        };
        ignore await indexerUserCanister.putUser(caller, Principal.fromActor(actorClass), userDataPreview);
        Principal.fromActor(actorClass);
    };

    public shared ({ caller }) func signIn(): async Types.SignInResult{
        let user = Map.get<Principal, Profile>(users, phash, caller);
        switch user {
            case null { #Err };
            case (?user) {
                #Ok({
                    name = user.name; 
                    avatar = user.avatar;
                    userCanisterId = Principal.fromActor(user.actorClass);
                    notifications = user.globalNotifications
                    }
                )
            }
        }
    };

    public query func getUserCanisterId(u: Principal): async ?Principal {
        let user = Map.get<Principal, Profile>(users, phash, u);
        switch user {
            case null { null };
            case (?user) {
                ?Principal.fromActor(user.actorClass)
            }
        } 
    };

    // public func getEvents(): async [Types.FeedPart]{
    //     let eventLists = Map.vals<UserClassCanisterId, [var ?Event]>(events);
    //     let tempBufferEvents = Buffer.fromArray<Types.FeedPart>([]);
    //     for(eList in eventLists){
    //         for (e in eList.vals()){
    //             switch e {
    //                 case(?#NewPost(post)){
    //                     tempBufferEvents.add(post);
    //                 };
    //                 case _ {}
    //             }
    //         }
    //     };
    //     Buffer.toArray<Types.FeedPart>(tempBufferEvents)
    // };

    public shared ({ caller }) func getMyFeed(): async [Types.FeedPart] {
        let user = Map.get<Principal, Profile>(users, phash, caller);
        
        switch user {
            case null { [] };
            case (?user) {
                let feedBuffer = Buffer.fromArray<Types.FeedPart>([]);
                for(followed in (await user.actorClass.getFolloweds()).vals()){
                    for(event in getEventsFromUser(followed).vals()){
                        switch event {
                            case(#NewPost(post)){
                                if(post.access != #Private){
                                    feedBuffer.add(post);   
                                };
                                
                                if (feedBuffer.size() >= 5){
                                    return Buffer.toArray(feedBuffer);
                                }
                            };
                            case _ {
                                //TODO Establecer acciones para otros tipos de evento, por ejemplo cuando hay un nuevo seguidor
                            };
                        };
                    }
                };
                if(feedBuffer.size() < 5) {
                    for(eventList in Map.vals<UserClassCanisterId, [Event]>(events)){
                        for(event in eventList.vals()){
                            switch event {
                                case(#NewPost(post)){
                                    if(post.access != #Private){
                                        feedBuffer.add(post);   
                                    };
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

    public query func getPostByHashTag(h: Text):async [Types.FeedPart]{
        let postPreviewBuffer = Buffer.fromArray<Types.FeedPart>([]);
        for(eventList in Map.vals<UserClassCanisterId, [Event]>(events)){
            for(event in eventList.vals()){
                switch event {
                    case(#NewPost(post)){
                        switch (Array.find<Text>(post.hashTags , func x = x == h)){
                            case null {};
                            case _ { postPreviewBuffer.add(post)}
                        }
                    };
                    case _ { };
                }
            };

        };
        Buffer.toArray<Types.FeedPart>(postPreviewBuffer);
    };
    

}