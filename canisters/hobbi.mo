import Map "mo:map/Map";
import Set "mo:map/Set";

import { phash; thash; nhash } "mo:map/Map";
import User "./user/user_canister_class";
import Community "./community/community_canister_class";
// import CommunityTypes = "./community/types";
import UserIndexerCanister "./index/user_indexer";
import Prim "mo:⛔";
import Principal "mo:base/Principal";
import { now } "mo:base/Time";
import Buffer "mo:base/Buffer";
import Types "types";
import Utils "utils";
import { print } "mo:base/Debug";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Char "mo:base/Char";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Blob "mo:base/Blob";
import Rand "mo:random/Rand";
import ManagerCanister "./interfaces/ic-management-interface";

shared ({caller = DEPLOYER_HOBBI}) actor class Hobbi() = Hobbi  {
  ///////////////////////////////////////////////         Tipos              //////////////////////////////////////
    type Profile = {
        principal: Principal;
        actorClass: User.User;
        name: Text;
        avatar: ?Blob;
        openCauses: [Nat];
        globalNotifications: [Types.Notification]; // Ver si es mejor una lista de id de notificaciones
    };

    type Community = Community.Community;

    type PaginateFeed = Types.Feed;
    type PostPreview = Types.PostPreview;
    type Feed = {arr: [PostPreview]; lastUpdateFeed: Int};
    type Reaction = Types.Reaction;

    type CanisterID = Principal;
    type UserPreviewInfo = Types.UserPreviewInfo;
    type Event = Types.Event;
    type UserClassCanisterId = Principal;
    type Report  = Types.Report;
    type Cause = Types.Cause;
  //////////////////////////////////////////////   Variables generales      ///////////////////////////////////////

    let NULL_ADDRESS = Principal.fromText("aaaaa-aa");
    var maxFeedGeneralPost = 200;
    var feedUpdateRefreshTime = 25; // En segundos
    var rankingUpdateRefresh = 25; //en segundos
    var maxEventsPerUser = 20;
    // var lastUpdateFeed = 0;

    let feeUserCanisterDeploy = 800_006_000_000; // cantidad mínimo 13_846_202_568

    stable let users = Map.new<Principal, Profile>(); 
    stable let communities = Map.new<Principal, Community>(); 
    stable let principalByCID = Map.new<UserClassCanisterId, Principal>();   //Control y verificacion de procedencia de llamadas
    stable let admins = Set.new<Principal>();
    ignore Set.put<Principal>(admins, phash, DEPLOYER_HOBBI);

    
    stable let events = Map.new<UserClassCanisterId, [Event]>(); //TODO enviar este map de eventos a canister dedicado
    stable var rankingQtyHahsTags = 10;
    stable let hashTagsMap = Map.new<Text, Nat>();
    stable var rankingHashTag: {arr: [Text]; lastUpdate: Int }= {arr = []; lastUpdate = 0};
    stable var generalFeed: Feed = {arr = []; lastUpdateFeed = 0};
    stable let personlizedFeeds = Map.new<Principal, Feed>();
    

    stable let causes = Map.new<Nat, Cause>();
    stable var lastReportId = 0;

    // canister de indexación para guardar previsualizaciones de usuario
    stable var indexerUserCanister: UserIndexerCanister.UserIndexerCanister = actor("aaaaa-aa");

    public shared ({ caller }) func getCanisterIndexer(): async Principal {
        Principal.fromActor(indexerUserCanister);
    };

    let random = Rand.Rand();

  /////////////////////////////////////////////   canisters auxiliares     ////////////////////////////////////////
    type InitResponse = {
        indexerUserCanister: Principal;
    };

    func hobbiInit(): async () {
        print("Desplegando el canister indexer");
        // Prim.cyclesAdd<system>(200_000_000_000); // 0.24.1 dfx version
        Prim.cyclesAdd(feeUserCanisterDeploy); // 0.17.0 dfx version
        indexerUserCanister := await UserIndexerCanister.UserIndexerCanister();
        await ManagerCanister.addController(Principal.fromActor(indexerUserCanister), DEPLOYER_HOBBI);
        print("Canister indexer desplegado en " # Principal.toText(Principal.fromActor(indexerUserCanister)))
    };

  ////////////////////////////////////////////    Funciones privadas      /////////////////////////////////////////

    func _isUserActorClass(p: Principal): Bool {
        Map.has<UserClassCanisterId, Principal>(principalByCID, phash, p);
    };

    public query func isUserActorClass(p: CanisterID):async Bool {
        _isUserActorClass(p);
    };

    func isUser(p: Principal): Bool{
        Map.has<Principal, Profile>(users, phash, p);
    };

    func isAdmin(p: Principal): Bool {
        Set.has<Principal>(admins, phash, p);
    };

    func _isCommunity(p: Principal ): Bool {
        Map.has<Principal, Community>(communities, phash, p)
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

    func updateRankingHashTags() {  //TODO revisar otras opciones menos costosas computacionalmente
        if(not (now() > rankingHashTag.lastUpdate + rankingUpdateRefresh * 10_000_000_000)){
            return
        };
        var arrayHashTagsCounter = Map.toArray(hashTagsMap);    
        arrayHashTagsCounter := Array.sort<(Text,Nat)>(
            arrayHashTagsCounter, 
            func (a, b) = if (a.1 < b.1){#greater} else {#less}
        );
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
    };

    func putHashTags(event: Event) {
        if (Map.size<Text, Nat>(hashTagsMap) > 2){ updateRankingHashTags() };
        switch event {
            case (#NewPost(post)) {
                for(hashtag in post.hashTags.vals()){
                    let normalizedHashTag = Utils.normalizeText(hashtag);
                    let updateCounter: Nat = pushHashTagToMapCounter(normalizedHashTag);
                    var index = 0;
                    var inserted = false;
                };
            };
            case (_) { }
        };
    };

    func decrementHashTags(_hashTags: [Text]) {
        for(hashtag in _hashTags.vals()){
            let normHashTag = Utils.normalizeText(hashtag);
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

        let myEvents = Map.get<UserClassCanisterId, [Event]>(events, phash, caller);
        putHashTags(event);
        switch myEvents {
            case null {
                ignore Map.put<UserClassCanisterId, [Event]>(events, phash, caller, [event]);
                true;
            };
            case (?eventsList) {
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
        };
    };

    public shared ({ caller }) func updateReactions( {postId: Nat; likes: Nat; disLikes: Nat}): async () {
        print("Actualizando reacciones del PostPreview; Llamada desde canister " # Principal.toText(caller));
        assert(await isUserActorClass(caller));
        print(Principal.toText(caller) # " es un UserActorClass");
        let callerEvents = getEventsFromUser(caller);
        let tempBufferEvent = Buffer.fromArray<Event>([]);
        for (e in callerEvents.vals()){
            switch e {
                case (#NewPost(p)){
                    if(p.postId == postId) {
                        tempBufferEvent.add(#NewPost({p with likes; disLikes}))
                    } else {
                        tempBufferEvent.add(e)
                    };
                };
                case _ {tempBufferEvent.add(e)}
            }
        };
        ignore Map.put<Principal, [Event]>(events, phash, caller, Buffer.toArray(tempBufferEvent))
    };

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
        // Add dfx deployer hobby as a controller for the user actor class to facilitate future updates
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
            interests: [Text] = [];
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

    func getUserCanisterIdByPrincipal(p: Principal): ?Principal {
        switch (Map.get<Principal, Profile>(users, phash, p)) {
            case null { null };
            case (?user) {
                ?Principal.fromActor(user.actorClass)
            }
        } 
    };

    public shared query ({ caller }) func getMyCanisterId(): async Text{
        let user = getUserCanisterIdByPrincipal(caller);
        switch user {
            case null {""};
            case (?cid){Principal.toText(cid)}
        }
    };
 
    public shared query ({ caller }) func getUserCanisterId(u: Principal): async ?Principal {
        assert(isAdmin(caller) or _isUserActorClass(caller));
        getUserCanisterIdByPrincipal(u)
    };

    public shared query ({ caller }) func gerUserCanisterIdsForUpdate(): async [Principal] {
        assert(isAdmin(caller));
        Iter.toArray(Map.keys<UserClassCanisterId, Principal>(principalByCID))
    };

    public query func getPrincipalFromCanisterId(cID: CanisterID): async ?Principal {
        Map.get<Principal, Principal>(principalByCID, phash, cID)
    };

    public shared query ({ caller })  func getNameUser(u: Principal): async ?Text {
        if(not _isCommunity(caller)) { return null };
        switch (Map.get<Principal, Profile>(users, phash, u)){
            case null { null };
            case ( ?user ) { ?user.name}
        };
    };

    func updateFeedForUser(u: Principal, followeds: [Principal]): Feed {
        let feed = Map.get<Principal, Feed>(personlizedFeeds, phash, u);
        switch feed {
            case (?feed) {
                if ( not (now() > feed.lastUpdateFeed + feedUpdateRefreshTime * 1_000_000_000)) {
                    return feed;
                };
            };
            case _ { };
        };
        print("Actualizando feed personalizado");
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
        ignore Map.put<Principal, Feed>(personlizedFeeds, phash, u, feedUpdate);
        feedUpdate
    };

    public shared ({ caller }) func getMyFeed({page: Nat; qtyPerPage: Nat}): async PaginateFeed {
        updateGeneralFeed();
        let user = Map.get<Principal, Profile>(users, phash, caller);
        switch user {
            case (?user) {
                let followeds = await user.actorClass.getFolloweds();
                let followedsSet = Set.fromIter<UserClassCanisterId>(followeds.vals(), phash);
                let myRawFeed = updateFeedForUser(caller, followeds);
                if (myRawFeed.arr.size() > page * qtyPerPage){
                    {getPaginateElements<PostPreview>(myRawFeed.arr, page, qtyPerPage)
                    with hasNext = true};
                } else {
                    let bias = myRawFeed.arr.size()/qtyPerPage;
                    let generalFeedWithoutFollowedsContent = Array.filter<PostPreview>(
                        generalFeed.arr,
                        func x = not Set.has<UserClassCanisterId>(followedsSet, phash, x.autor)
                    );
                    getPaginateElements<PostPreview>(generalFeedWithoutFollowedsContent, page - bias - 1, qtyPerPage)  
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
                        switch (Array.find<Text>(post.hashTags , func x = Utils.normalizeText(x) == Utils.normalizeText(h))){
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
  
  ///////////////////////////////////////   Communities management   //////////////////////////////////////////////

    public shared ({ caller }) func createCommunity({name: Text; description: Text; logo: Blob}): async {#Ok: Principal; #Err: Text} {
        print("creando comunidad");
        switch (Map.get<Principal, Profile>(users, phash, caller)) {
            case null {return #Err("Caller is not User")};
            case ( ?user ) {
                //if( not verifiedTransaction(dataTransaction){ return #Err: "Transaction error"};
                let params = {
                    name;
                    description;
                    logo;
                    admins = [caller]; 
                    dateCreation = now();
                    indexer_canister = Principal.fromActor(indexerUserCanister);
                };
                // Prim.cyclesAdd<system>(200_000_000_000); // 0.24.1 dfx version
                Prim.cyclesAdd(feeUserCanisterDeploy); // 0.17.0 dfx version
                let community = await Community.Community(params);
                let communityPID = Principal.fromActor(community);
                ignore Map.put<Principal, Community>(communities, phash, communityPID, community);
                // TODO Agregar referencia a la comunidad en el user Actor class del admin

                //// Indexamos una vista previa inicial de la comunidad en el canister indexer ////
                let communityPreview: Types.CommunityPreviewInfo = {
                    params with
                    logo;
                    membersQty = 0;
                    postsLastWeek = 0;
                    canisterId = communityPID;
                    visibility = true;
                    lastActivity = now();
                };
                ignore await indexerUserCanister.putCommunity(communityPreview);
                // ignore user.actorClass.addCommunity(communityPID);
                //////////////////////////////////////////////////////////////////////////////////

                #Ok(communityPID);
            }            
        };     
    };

    public query func getCommunitiesCID(): async [CanisterID]{
        Iter.toArray(Map.keys<Principal, Community>(communities))
    };

    public shared ({ caller }) func getPaginateCommunities(args: {page: Nat; qtyPerPage: Nat}): async Types.ResponsePaginateCommunities{
        await indexerUserCanister.getPaginateCommunitiesPreview(args)
    };

    public query func isCommunity(c: Principal): async Bool {
        _isCommunity(c);
    };

    

  ////////////////////////////////////// Reportar Post o Comentario ///////////////////////////////////////////////
 
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

    




