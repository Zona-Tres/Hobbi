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
import Rand "mo:random/Rand";
import ManagerCanister "./interfaces/ic-management-interface";

shared ({caller = DEPLOYER_HOBBI}) actor class Hobbi() = Hobbi  {
  ///////////////////////////////////////////////        Tipoos              //////////////////////////////////////
    type Profile = {
        principal: Principal;
        actorClass: User.User;
        name: Text;
        avatar: ?Blob;
        openCauses: [Nat];
        globalNotifications: [Types.Notification]; // Ver si es mejor una lista de id de notificaciones
    };

    type PaginateFeed = Types.Feed;
    type PostPreview = Types.PostPreview;
    type Feed = {arr: [PostPreview]; lastUpdateFeed: Int};

    type CanisterID = Principal;
    type UserPreviewInfo = Types.UserPreviewInfo;
    type Event = Types.Event;
    type UserClassCanisterId = Principal;
    type Report  = Types.Report;
    type Cause = Types.Cause;
  //////////////////////////////////////////////   Variables generales      ///////////////////////////////////////

    let NULL_ADDRESS = Principal.fromText("aaaaa-aa");
    var maxFeedGeneralPost = 200;
    var feedUpdateRefreshTime = 25; // En seundos
    var rankingUpdateRefresh = 25; //en segundos
    var maxEventsPerUser = 20;
    // var lastUpdateFeed = 0;

    let feeUserCanisterDeploy = 200_000_000_000; // cantidad mínimo 13_846_202_568

    stable let users = Map.new<Principal, Profile>();     //PrincipalID =>  User actorClass PROBAR
    stable let principalByCID = Map.new<Principal, Principal>();   //Control y verificacion de procedencia de llamadas
    stable let admins = Set.new<Principal>();

    
    stable let events = Map.new<UserClassCanisterId, [Event]>(); //TODO enviar este map de eventos a canister dedicado

    // public func getEvents():async [Event]{
    //     let b = Buffer.fromArray<Event>([]);
    //     for (el in Map.vals<UserClassCanisterId, [Event]>(events)){
    //         for(e in el.vals()){
    //             b.add(e)
    //         }
    //     };
    //     Buffer.toArray(b) 
    // };

    stable var rankingQtyHahsTags = 10;
    stable let hashTagsMap = Map.new<Text, Nat>();
    stable var rankingHashTag: {arr: [Text]; lastUpdate: Int }= {arr = []; lastUpdate = 0};
    stable var generalFeed: Feed = {arr = []; lastUpdateFeed = 0};
    stable let personlizedFeeds = Map.new<Principal, Feed>();

    

    stable let causes = Map.new<Nat, Cause>();
    stable var lastReportId = 0;

    // canister de indexación para guardar previsualizaciones de usuario
    stable var indexerUserCanister: UserIndexerCanister.UserIndexerCanister = actor("aaaaa-aa");

    let random = Rand.Rand();

  /////////////////////////////////////////////   canisters auxiliares     ////////////////////////////////////////
    type InitResponse = {
        indexerUserCanister: Principal;
    };

    func hobbiInit(): async () {
        print("Desplegando el canister indexer");
        // Prim.cyclesAdd<system>(200_000_000_000); // 0.24.1 dfx version
        Prim.cyclesAdd(200_000_000_000); // 0.17.0 dfx version
        indexerUserCanister := await UserIndexerCanister.UserIndexerCanister();
        print("Canister indexer desplegado en " # Principal.toText(Principal.fromActor(indexerUserCanister)))
    };

  ////////////////////////////////////////////    Funciones privadas      /////////////////////////////////////////

    public query func isUserActorClass(p: Principal):async Bool {
        Map.has<Principal, Principal>(principalByCID, phash, p);
    };

    func isUser(p: Principal): Bool{
        Map.has<Principal, Profile>(users, phash, p);
    };

    func isAdmin(p: Principal): Bool {
        Set.has<Principal>(admins, phash, p);
    };

    func updateGeneralFeed() {
        if ( not (now() > generalFeed.lastUpdateFeed + feedUpdateRefreshTime * 1_000_000_000)) {
            return
        };
        print("Actualizando el feed general");
        let feedBuffer = Buffer.fromArray<PostPreview>([]);
        for(eventList in Map.vals<UserClassCanisterId, [Event]>(events)){
            for(event in eventList.vals()){
                switch event {
                    case(#NewPost(post)){
                        if(post.access != #Private){
                            feedBuffer.add(post);
                        };
                        if (feedBuffer.size() >= maxFeedGeneralPost){
                            generalFeed := {arr = Buffer.toArray(feedBuffer); lastUpdateFeed = now()};
                            return 
                        }
                    };
                    case _ { };
                }
            } 
        };
        generalFeed := {arr = Buffer.toArray(feedBuffer); lastUpdateFeed = now()};
    };

  ///////////////////////////////////////////    HashTags managment      //////////////////////////////////////////

    func pushHashTagToMapCounter(ht: Text): Nat {
        switch (Map.get<Text, Nat>(hashTagsMap, thash, ht)){
            case null { 
                ignore Map.put<Text, Nat>(hashTagsMap, thash, ht, 1);
                1;
            };
            case (?n) {
                ignore Map.put<Text, Nat>(hashTagsMap, thash, ht, n + 1);
                n + 1 
            };
        }
    };

    func normalizeHashTag(hashtag: Text): Text {
        var result: Text = "";
        for(c in Text.toIter(hashtag)){ 
            result #= Char.toText((Prim.charToUpper(c)));
        };
        result   
    };

    func updateRankingHashTags() {  //TODO revisar otras opciones menos costosas computacionalmente
        if(not (now() > rankingHashTag.lastUpdate + rankingUpdateRefresh * 10_000_000_000)){
            return
        };

        print("In updateRankingHashTags Function");
        var arrayHashTagsCounter = Map.toArray(hashTagsMap);
             
        arrayHashTagsCounter := Array.sort<(Text,Nat)>(
            arrayHashTagsCounter, 
            func (a, b) = if (a.1 < b.1){#greater} else {#less}
        );
        print("HashTagsMap" # debug_show(arrayHashTagsCounter));
        let size = if (rankingQtyHahsTags >= arrayHashTagsCounter.size()){
            arrayHashTagsCounter.size()
        } else {
            rankingQtyHahsTags;
        };
        let arr = Prim.Array_tabulate<Text>(size, func i = arrayHashTagsCounter[i].0 );
        rankingHashTag := {
            arr; 
            lastUpdate = now()
        };
        print("Out updateRankingHashTags Function");
    };

    func putHashTags(event: Event) {
        print("In putHashTags Function");
        print("HashTagMap size: " # Nat.toText((Map.size<Text, Nat>(hashTagsMap))));
        if (Map.size<Text, Nat>(hashTagsMap) > 2){ 
            updateRankingHashTags() 
        };

        switch event {
            case (#NewPost(post)) {
                print("Extrayendo hashtags del post");
                for(hashtag in post.hashTags.vals()){
                    let normalizedHashTag = normalizeHashTag(hashtag);
                    let updateCounter: Nat = pushHashTagToMapCounter(normalizedHashTag);
                    print("\tHashTag: " # normalizedHashTag # "\tContador -> " # Nat.toText(updateCounter));
                    var index = 0;
                    var inserted = false;
                };
            };
            case (_) { }
        };
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
        print("In putEvetFunction");
        

        let myEvents = Map.get<UserClassCanisterId, [Event]>(events, phash, caller);
        switch myEvents {
            case null {
                print("Inicializando mi lista de eventos y registrando evento");
                ignore Map.put<UserClassCanisterId, [Event]>(events, phash, caller, [event]);
                true;
            };
            case (?eventsList) {
                print("Actualizando mi lista de eventos");
                var updteEventList: [Event] = []; 
                if(eventsList.size() == maxEventsPerUser){
                    updteEventList := Prim.Array_tabulate<Event>(
                        maxEventsPerUser, func x = if(x == 0){event} else { eventsList[x - 1]}
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
   
    // public shared ({ caller }) func pushReactionToPostPreview(): async Bool{
    //     assert(Set.has<Principal>(usersCanister, phash, caller));
    //     let eventOfUser = switch (Map.get<Principal, [Event]>(events, phash, caller)) {
    //         case null {

    //         }
    //     }
    // };

    public shared ({ caller }) func removeEvent(_date: Int) {
        let myEvents = Map.get<UserClassCanisterId, [Event]>(events, phash, caller);   
        switch myEvents {
            case null{  };
            case (?myEvents){
                let eventBuffer = Buffer.fromArray<Event>([]);
                for(e in myEvents.vals()){
                    switch e {
                        case (#NewPost(data)){
                            if(data.date != _date){
                                eventBuffer.add(#NewPost(data));
                            } else {
                                decrementHashTags(data.hashTags);
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
        // Prim.cyclesAdd<system>(feeUserCanisterDeploy);  // 0.24.1 dfx version
        Prim.cyclesAdd(feeUserCanisterDeploy);  // 0.17.0 dfx version
        let actorClass = await User.User({
            data with 
            owner = caller; 
            indexerUserCanister = Principal.fromActor(indexerUserCanister)
        });
        // Add dfx deployer hobby as a controller for the actor class to facilitate future updates
        await ManagerCanister.addController(Principal.fromActor(actorClass), DEPLOYER_HOBBI);
        let newUser: Profile = {
            principal = caller;
            actorClass; 
            name = data.name; 
            avatar = data.avatar;
            globalNotifications = [];
            openCauses = [];
        };
        ignore Map.put(users, phash, caller, newUser); //TODO Creo que con la implementación del indexerUser ya no es necesario
        ignore Map.put(principalByCID, phash, Principal.fromActor(actorClass), caller);
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

    public query func getPrincipalFromCanisterId(cID: CanisterID): async ?Principal {
        Map.get<Principal, Principal>(principalByCID, phash, cID)
    };

    func updateFeedForUser(u: Principal, followeds: [Principal]) {
        let bufferPreviews = Buffer.fromArray<PostPreview>([]);
        for(f in followeds.vals()){
            for(event in getEventsFromUser(f).vals()){
                switch event {
                    case ( #NewPost(post) ) {
                        if (post.access != #Private){
                            bufferPreviews.add(post)
                        };
                    };
                    case (_) {}
                };
            }
        };
        let feedUpdate = {arr = Buffer.toArray(bufferPreviews); lastUpdateFeed = now()};
        ignore Map.put<Principal, Feed>(personlizedFeeds, phash, u, feedUpdate)
    };


    public shared ({ caller }) func getMyFeed({page: Nat; qtyPerPage: Nat}): async PaginateFeed {
        updateGeneralFeed();
        let user = Map.get<Principal, Profile>(users, phash, caller);
        switch user {
            case (?user) {
                let followeds = await user.actorClass.getFolloweds();
                var myRawFeed = Map.get<Principal, Feed>(personlizedFeeds, phash, caller); 
                if(followeds.size() > 0) {
                    switch myRawFeed {
                        case null { 
                            updateFeedForUser(caller, followeds);
                            print("Inicializando el feed Personalizado")
                        };
                        case (?myRawFeed) {
                            if( now() >= myRawFeed.lastUpdateFeed + feedUpdateRefreshTime * 60 * 1_000_000_000){ 
                                updateFeedForUser(caller, followeds);
                                print("Actualizando el feed Personalizado")
                            } 
                        }
                    };
                };
                myRawFeed := Map.get<Principal, Feed>(personlizedFeeds, phash, caller);

                switch myRawFeed {
                    case null { getPaginateElements<PostPreview>(generalFeed.arr, page, qtyPerPage)};
                    case (?myRawFeed) {

                        if (myRawFeed.arr.size() > page * qtyPerPage){
                            {getPaginateElements<PostPreview>(myRawFeed.arr, page, qtyPerPage)
                            with hasNext = true};
                        } else {
                            let bias = myRawFeed.arr.size()/qtyPerPage;
                            print("Get My Feed: " # Nat.toText(page - bias));
                            getPaginateElements<PostPreview>(generalFeed.arr, page - bias, qtyPerPage)  
                        };
                    }
                };     
            };
            case _ {
                getPaginateElements<PostPreview>(generalFeed.arr, page, qtyPerPage)
            }
        }
    };

    func getPaginateElements<T>(arr: [T], page: Nat, qtyPerPage: Nat ): {arr: [T]; hasNext: Bool}{
        if(arr.size() > page * qtyPerPage ){ 
            let end = if(arr.size() / qtyPerPage > page ) {
                qtyPerPage
            } else {
                arr.size()  %  qtyPerPage
            };
            let hasNext = (page + 1)  * qtyPerPage < arr.size();
            {arr = Array.subArray(arr, page * qtyPerPage, end); hasNext}
        } else {
            {arr = []; hasNext = false}
        }
    };

    public query func getPostByHashTag(h: Text):async [PostPreview]{
        let postPreviewBuffer = Buffer.fromArray<PostPreview>([]);
        for(eventList in Map.vals<UserClassCanisterId, [Event]>(events)){
            for(event in eventList.vals()){
                switch event {
                    case(#NewPost(post)){
                        switch (Array.find<Text>(post.hashTags , func x = normalizeHashTag(x) == normalizeHashTag(h))){
                            case null {};
                            case _ { postPreviewBuffer.add(post)}
                        }
                    };
                    case _ { };
                }
            };
        };
        Buffer.toArray<PostPreview>(postPreviewBuffer);
    };
    
    public shared query func getRankingHashTags(): async [Text]{
        updateRankingHashTags();
        rankingHashTag.arr
    };
  
  /////////////////////////////////////// Reportar Post o Comentario //////////////////////////////////////////////
 
    public shared ({ caller }) func report(report: Report): async {#Ok: Text; #Err}{
        let informer = Map.get<Principal, Profile>(users, phash, caller);
        let accused = Map.get<CanisterID, Profile>(users, phash, report.accused);
        switch informer {
            case null #Err;
            case ( ?informer ) {
                switch accused {
                    case null #Err;
                    case ( ?accused ) {
                        lastReportId += 1;
                        let cause: Cause = {
                            report with
                            id = lastReportId;
                            date = now();
                            informer = caller;
                            defender = accused.principal;
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
                        if( admin ) { 
                            #Ok(cause) 
                        } 
                        else { 
                            #Err 
                        }
                    };
                    case (?user) {
                        if(caller == cause.informer) {
                            return #Ok({ 
                                cause with 
                                speechInDefense = {date = 0; msg = ""};
                            })
                        } else if (caller == cause.accused){
                            return #Ok({ 
                                cause with 
                                informer = NULL_ADDRESS;
                                msg = "" 
                            })
                        } else {
                            #Err;
                        }
                    }
                }
            }
        }  
    };

    // public shared ({ caller }) func makeDefense({causeId: Nat; msg: Text}): async {#Ok: Text; #Err: Text}{
    //     let cause = Map.get<Nat, Cause>(causes, nhash, causeId); // Buscamos la causa
    //     switch cause {
    //         case null { return #Err("The cause was not found") };
    //         case  (?cause) {    // La causa existe
    //             let profile = Map.get<Principal, Profile>(users, phash, caller); // Buscamos al caller
    //             switch profile {
    //                 case null { return #Err("Caller error") };
    //                 case (?profile) {   // El caller tiene un perfil
    //                     switch (cause.conflictFocus){   // Comprobamos el foco del conflicto
    //                         case (#PostReport(_)){ // Si es un posteo el acusado es el caller
    //                             if(cause.accused == Principal.fromActor(profile.actorClass)){
    //                                 let speechInDefense = {
    //                                     date = now();
    //                                     msg
    //                                 };
    //                                 ignore Map.put<Nat, Cause>(causes, nhash, causeId, {cause with speechInDefense});
    //                                 return #Ok("defense discharge entered")
    //                             } else {
    //                                 return #Err "Caller Error";
    //                             };
                                
    //                         };
    //                         case (#CommentReport(postReportData)) {
    //                             if(caller)

    //                         };
    //                     }
    //                 };
    //             };              
    //         }
    //     };
    // };
    // TODO. Aceptar o rechazar acusación y finalmente informar resolución
}

    




