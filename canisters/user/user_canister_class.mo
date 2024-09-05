import Types "types";
import Rand "mo:random/Rand";
import Set "mo:map/Set";
import Map "mo:map/Map";
import {nhash; phash} "mo:map/Map";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
 

shared ({ caller }) actor class User (_owner: Principal, _name: Text, _bio: Text, _avatar: ?Blob) = this {

    type FullDataUser = Types.FullDataUser;
    type PublicDataUser = Types.PublicDataUser;
    type PostID = Types.PostID;
    type Post = Types.Post;
    type PostDataInit = Types.PostDataInit;
    type Comment = Types.Comment;
    type Access = Types.Access;

    stable let DEPLOYER = caller; // para validar llamadas desde el canister factory
    stable let OWNER = _owner;

  //////////////////////// Datos relacionados al usuario usuario ///////////////////////////////////
    stable var name: Text = _name;
    stable var bio: Text = _bio;
    stable var avatar: ?Blob = _avatar;
    stable var email: ?Text = null;
    stable var verified = false; // Para verificacion de email mediante el envio de un código

  //////////////////// Datos relacionados a la actividad del usuario ///////////////////////////////
    stable let posts = Map.new<PostID, Post>();
    stable let followers = Set.new<Principal>();
    stable let followeds = Set.new<Principal>(); 
    stable let postLiked = Set.new<PostID>();

  /////////////////////////// Variables y objetos auxiliares ///////////////////////////////////////

    let rand = Rand.Rand();
    stable var nextPostID = 0;
    private var verificationCodes = {email = 0; phone = 0}; //Agregar o quitar a gusto

  //////////////////////////////// Funciones privadas //////////////////////////////////////////////
    func onlyOwner(p: Principal): () { assert( p == OWNER) };
    func dataUser(): FullDataUser {
        {   name;
            bio;
            avatar;
            canisterID = Principal.fromActor(this);
            owner = OWNER;
            email;
            verified;
        };
    };
  ////////////////////////// Verificaciones opcionales de usuario //////////////////////////////////
    // Posible caso de uso: cuando un usuario pierde el acceso a su identidad en ICP 

    public shared ({caller}) func sendEmailCode(): async {#Err: Text; #Ok: Text}{
        onlyOwner(caller);
        switch email{
            case null {return #Err("Email not provided")};
            case (?email){
                rand.setRange(100000, 999999); 
                let code = await rand.next();
                verificationCodes := { verificationCodes with email = code};
                //TODO Enviar email con el codigo code //Codigo de ejemplo: https://github.com/domwoe/email-verification/tree/main
                #Ok("Se ha enviado un email con el codigo de verificacion a " # email);
            };
        }  
    };

    public shared ({caller}) func putCodeVerifyEmail(_code: Nat): async Bool {
        onlyOwner(caller);
        if(_code == verificationCodes.email and _code != 0) {
            verified := true;
        };
        verificationCodes := {verificationCodes with email = 0};
        verified
    };

  ////////////////////////////////////// Getters ///////////////////////////////////////////////////
    public shared query ({caller}) func getMyInfo():async  FullDataUser { //Se llama desde el front para cargar los datos en el dashboard
        onlyOwner(caller);
        dataUser()
    };
    public query func getPublicInfo(): async PublicDataUser {{name; bio; avatar; verified}};


  ////////////////////////////////////// Setters ///////////////////////////////////////////////////

    public shared ({ caller }) func loadAvatar(_avatar: Blob): async (){
        onlyOwner(caller);
        avatar := ?_avatar;
    };

    public shared ({ caller }) func removeAvatar(): async (){
        onlyOwner(caller);
        avatar := null;
    };

    public shared ({ caller }) func editProfile(_name: Text, _bio: Text, _email: ?Text): async FullDataUser {
        onlyOwner(caller);
        if(email != _email) { verified := false}; // Si se cambia el email se requiere nueva verificacion
        email := _email;
        bio := _bio;
        name := _name;

        dataUser();
    };

  //////////////////////////////////// CRUD Post ///////////////////////////////////////////////////

    public shared ({ caller }) func createPost(init: PostDataInit):async  PostID {
        onlyOwner(caller);
        let date = Time.now();
        let metadata = { init with date; progress = #Started };
        let newPost: Post = {
            metadata;
            comments = [];
            id = nextPostID;
            likes = 0;
            disLikes = 0;
        };
        ignore Map.put<PostID, Post>(posts, nhash, nextPostID, newPost);
        nextPostID += 1;
        nextPostID - 1;     
    };

    public shared ({ caller }) func readPost(id: PostID): async {#Ok: Post; #Err: Text} {
        let post = Map.get<PostID, Post>(posts, nhash, id);
        switch post {
            case null { return #Err("PostID not Found")};
            case (?post){
                return switch (post.metadata.access){
                    case(#Private){
                        if(caller == OWNER){ #Ok(post) } 
                        else{ #Err("Private access") };
                    };
                    case(#Followers) {
                        if(Set.has(followers, phash, caller)) { #Ok(post) } 
                        else{ #Err("Only followers access") };
                    };
                    case(#Public){ #Ok(post) }
                }  
            }
        }
    };

    public shared ({ caller }) func updatePost(id: PostID, updatedData: PostDataInit): async {#Ok: Post; #Err: Text} {
        onlyOwner(caller);
        let post = Map.get<PostID, Post>(posts, nhash, id);
        switch post {
            case null { #Err("Incorrect PostID")};
            case (?post) {
                let metadata = {post.metadata with updatedData};
                let updatedPost = { post with metadata };
                ignore Map.put<PostID, Post>(posts, nhash, id,updatedPost );
                #Ok(updatedPost);
            }
        }
    };

    public shared ({ caller }) func modifyAccess(id: PostID, access: Access): async Bool{
        onlyOwner(caller);
        let post = Map.get<PostID, Post>(posts, nhash, id);
        switch post {
            case null { false };
            case (?post) {
                let metadata = {post.metadata with access};
                let updatedPost = { post with metadata };
                ignore Map.put<PostID, Post>(posts, nhash, id,updatedPost );
                true;
            }
        }
    };

    public shared ({ caller }) func deletePost(id: PostID): async {#Ok: Post; #Err: Text} {
        onlyOwner(caller);
        let post = Map.remove<PostID, Post>(posts, nhash, id);
        switch post {
            case null { #Err("Incorrect PostID")};
            case (?post) { #Ok(post) }
        }
    };


  //////////////////////// Intercomunicacion con otros usuarios ////////////////////////////////////

    public shared ({caller}) func sendLike(id: PostID, userClass: Principal):async Bool {
        assert(not Set.has(postLiked, nhash, id));
        // Registrar el like en el canister del otro usuario
        let remoteUserCanister = actor(Principal.toText(userClass)): actor{
            receiveLike: shared PostID -> async Bool;
        };
        let response = await remoteUserCanister.receiveLike(id);
        ignore Set.put(postLiked, nhash, id);
        response;
    };

    public shared ({caller}) func receiveLike(id: PostID):async Bool {
        
        false;
    };





}