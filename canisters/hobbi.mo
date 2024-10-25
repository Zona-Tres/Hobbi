import Map "mo:map/Map";
import Set "mo:map/Set";

import { phash; thash; nhash } "mo:map/Map";
import User "./user/user_canister_class";
import UserIndexerCanister "./index/user_indexer";
import Prim "mo:⛔";
import Principal "mo:base/Principal";
import { now } "mo:base/Time";
import Buffer "mo:base/Buffer";
import Types "types";
import { print } "mo:base/Debug";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Char "mo:base/Char";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";

actor {
  ///////////////////////////////////////////////        Tipoos              //////////////////////////////////////
    type Profile = {
        actorClass: User.User;
        name: Text;
        avatar: ?Blob;
        openCauses: [Nat];
        globalNotifications: [Types.Notification]; // Ver si es mejor una lista de id de notificaciones
    };

    type UserPreviewInfo = Types.UserPreviewInfo;
    type Event = Types.Event;
    type UserClassCanisterId = Principal;
    type Report  = Types.Report;
    type Cause = Types.Cause;
  //////////////////////////////////////////////   Variables generales      ///////////////////////////////////////

    let NULL_ADDRESS = Principal.fromText("aaaaa-aa");
    let feeUserCanisterDeploy = 200_000_000_000; // cantidad mínimo 13_846_202_568
    stable let users = Map.new<Principal, Profile>();     //PrincipalID =>  User actorClass
    stable let usersCanister = Set.new<Principal>();   //Control y verificacion de procedencia de llamadas
    stable let admins = Set.new<Principal>();

    
    stable let events = Map.new<UserClassCanisterId, [Event]>(); //TODO enviar este map de eventos a canister dedicado
    stable var rankingQtyHahsTags = 10;
    stable let hashTagsMap = Map.new<Text, Nat>();
    stable let rankingHashTag: [Text] = [];

    stable let causes = Map.new<Nat, Cause>();
    stable var lastReportId = 0;

    // canister de indexación para guardar previsualizaciones de usuario
    stable var indexerUserCanister: UserIndexerCanister.UserIndexerCanister = actor("aaaaa-aa");

  /////////////////////////////////////////////   canisters auxiliares     ////////////////////////////////////////
    type InitResponse = {
        indexerUserCanister: Principal;
    };

    func hobbiInit(): async () {
        print("Desplegando el canister indexer");
        Prim.cyclesAdd<system>(200_000_000_000);
        indexerUserCanister := await UserIndexerCanister.UserIndexerCanister();
    };

  ////////////////////////////////////////////    Funciones privadas      /////////////////////////////////////////

    public query func isUserActorClass(p: Principal):async Bool {
        Set.has<Principal>(usersCanister, phash, p);
    };

    func isUser(p: Principal): Bool{
        Map.has<Principal, Profile>(users, phash, p);
    };

    func isAdmin(p: Principal): Bool {
        Set.has<Principal>(admins, phash, p);
    };

  ///////////////////////////////////////////    HashTags managment      //////////////////////////////////////////

    func unWrapHashTagCount(ht: Text): Nat {
        switch (Map.get<Text, Nat>(hashTagsMap, thash, ht)){
            case null { 0 };
            case (?n) { n };
        }
    };

    func normalizeHashTag(hashtag: Text): Text {
        var result: Text = "";
        for(c in Text.toIter(hashtag)){ 
            result #= Char.toText((Prim.charToUpper(c)));
        };
        result   
    };

    func putHashTags(event: Event) {
        switch event {
            case (#NewPost(post)) {
                for(hashtag in post.hashTags.vals()){
                    let normHashTag = normalizeHashTag(hashtag);
                    let updateValue = unWrapHashTagCount(normHashTag) + 1;
                   
                    let tempBufferRanking = Buffer.fromArray<Text>([]);
                    var index = 0;
                    var inserted = false;
                    while(index < rankingQtyHahsTags){
                        let rValue = unWrapHashTagCount(rankingHashTag[index]);  
                        if(updateValue > rValue and not inserted){
                            tempBufferRanking.add(normHashTag);
                            index += 1
                        } else {
                            tempBufferRanking.add(normHashTag);
                        };
                        index += 1;
                    };
                    ignore Map.put<Text, Nat>(hashTagsMap, thash, normHashTag, updateValue )
                };
            };
            case (_) { }
        }
    };

    func decrementHashTags(_hashTags: [Text]) {
        for(hashtag in _hashTags.vals()){
            let normHashTag = normalizeHashTag(hashtag);
            let oldValue = Map.get<Text, Nat>(hashTagsMap, thash, normHashTag);
            switch oldValue{
                case(?value){
                    if (value == 1) {
                        ignore Map.remove<Text, Nat>(hashTagsMap, thash, normHashTag)
                    } else {
                        ignore Map.put<Text, Nat>(hashTagsMap, thash, normHashTag, value -1)
                    };
                };
                case null {};
            }
        }
    };
  //////////////////////////////////////////      Event Managment       ///////////////////////////////////////////

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
        let eventArray = Map.get<UserClassCanisterId, [Event]>(events, phash, user); 
        switch eventArray {
            case null {[]};
            case (?array) { array }
        }
    };

  /////////////////////////////////////////       SignUp SingIn        ////////////////////////////////////////////

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
        let newUser: Profile = {
            actorClass; 
            name = data.name; 
            avatar = data.avatar;
            globalNotifications = [];
            openCauses = [];
        };
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
    
  ////////////////////////////////////////    Getters functions       /////////////////////////////////////////////

    public shared query ({ caller }) func getMyCanisterId(): async Principal{
        let user = Map.get<Principal, Profile>(users, phash, caller);
        switch user {
            case null { assert false; NULL_ADDRESS};
            case (?user){
                Principal.fromActor(user.actorClass);
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
        let hNorm = normalizeHashTag(h);
        let postPreviewBuffer = Buffer.fromArray<Types.FeedPart>([]);
        for(eventList in Map.vals<UserClassCanisterId, [Event]>(events)){
            for(event in eventList.vals()){
                switch event {
                    case(#NewPost(post)){
                        switch (Array.find<Text>(post.hashTags , func x = x == hNorm)){
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
    
    public shared query func getRankingHashTags(): async [Text]{
        rankingHashTag
    };
  
  /////////////////////////////////////// Reportar Post o Comentario //////////////////////////////////////////////
    
    public shared ({ caller }) func report(denunciation: Report): async {#Ok: Text; #Err}{
        let informer = Map.get<Principal, Profile>(users, phash, caller);
        let accused = Map.get<Principal, Profile>(users, phash, caller);
        switch informer {
            case null #Err;
            case ( ?informer ) {
                switch accused {
                    case null #Err;
                    case ( ?accused ) {
                        lastReportId += 1;
                        let cause: Cause = {
                            denunciation with
                            id = lastReportId;
                            date = now();
                            informer = caller;
                            speechInDefense = {msg = ""; date = 0};
                            status = #Started;
                        };
                        // Guardamos el id de la denuncia para que el denunciante pueda consultar el estado
                        let updateCausesInformer = Prim.Array_tabulate<Nat>(
                            informer.openCauses.size() + 1,
                            func i = if(i == 0){lastReportId} else {informer.openCauses[i + 1]}
                        );
                        ignore Map.put<Principal, Profile>(users, phash, caller, {informer with causes = updateCausesInformer } );
                        // Guardamos el id de la denuncia para que el denunciado pueda consultar el estado
                        let updateCausesAccused = Prim.Array_tabulate<Nat>(
                            accused.openCauses.size(),
                            func i = if(i == 0){lastReportId} else {accused.openCauses[i + 1]}
                        );
                        ignore Map.put<Principal, Profile>(users, phash, caller, {accused with causes = updateCausesAccused } );
                        ignore Map.put<Nat, Cause>(causes, nhash, lastReportId, cause);
                        #Ok("Su denuncia será atendida a la brevedad. Gracias por colaborar")
                    }
                }
            }
        }
    };

    public shared ({ caller }) func getCauses(): async {#Ok: [Cause]; #Err}{
        if(isAdmin(caller)){
           return #Ok(Iter.toArray<Cause>(Map.vals<Nat, Cause>(causes)));
        };
        #Err
    };

    public shared ({ caller }) func getMyCauses(): async {#Ok: [Nat]; #Err} {
        let user = Map.get<Principal, Profile>(users, phash, caller);
        switch user {
            case null { #Err };
            case ( ?user ) {#Ok(user.openCauses)}
        };
    };

    public shared ({ caller }) func getCauseById(id: Nat): async {#Ok: Cause; #Err}{
        let user = Map.get<Principal, Profile>(users, phash, caller);
        let admin = isAdmin(caller);
        let cause = Map.get<Nat, Cause>(causes, nhash, id);
        switch cause{
            case null { #Err };
            case (?cause) {
                switch user {
                    case null { 
                        if( admin ) {  return #Ok({cause with speechInDefense = {date = 0; msg = ""}})} 
                        else { #Err }
                    };
                    case (?user) {
                        if (caller == cause.informer) {
                            return #Ok(cause)
                        } else {
                            return #Ok({ cause with informer = NULL_ADDRESS })
                        }
                    }
                }
            }
        }  
    };

    public shared ({ caller }) func makeDefense({causeId: Nat; msg: Text}): async {#Ok: Text; #Err: Text}{
        let cause = Map.get<Nat, Cause>(causes, nhash, causeId);
        switch cause {
            case null { return #Err("The cause was not found") };
            case  (?cause) {
                let accused = Map.get<Principal, Profile>(users, phash, caller);
                switch accused {
                    case null { return #Err("Caller error") };
                    case (?profile) {
                        if(Principal.fromActor(profile.actorClass) == cause.canisterId){
                            
                            ignore Map.put<Nat, Cause>(
                                causes,
                                nhash, 
                                causeId, 
                                {cause with speechInDefense = {date = now(); msg}}
                            );
                            return #Ok("defense entered")
                        };
                        return #Err("Caller error"); 
                    }
                }
            }
        }
    };
    
    



}