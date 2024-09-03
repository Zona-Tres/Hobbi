import Types "types";
import Rand "mo:random/Rand";
import Set "mo:map/Set";
import {nhash} "mo:map/Map";
import Principal "mo:base/Principal";

shared ({ caller }) actor class User (owner: Principal, name: Text, bio: Text, avatar: ?Blob) = this {

    type PrivateInfoUser = Types.PrivateInfoUser;
    type PublicInfoUser = Types.PublicInfoUser;
    type PostID = Types.PostID;

    // stable var name: Text = name;
    // stable var avatar: ?Blob = avatar;

    let rand = Rand.Rand();

    stable var email: ?Text = null;
    stable let deployer = caller; // para validar llamadas desde el canister factory 
    stable var verified = false; // Para verificacion de email mediante el envio de un código
    stable let postLiked = Set.new<PostID>();

    private var code = 0;

    public shared query ({caller}) func getMyInfo():async  PrivateInfoUser { //Se llama desde el front para cargar los datos en el dashboard
        assert (caller == owner);
        {   name;
            bio;
            avatar;
            canisterID = Principal.fromActor(this);
            owner;
            email;
            verified;
        };
    };
    public query func getInfo(): async PublicInfoUser {{name; bio; avatar; verified}};

    public shared ({caller}) func getCode(): async {#Err: Text; #Ok: Text}{
        assert (caller == owner);
        switch email{
            case null {return #Err("Email not provided")};
            case (?email){
                rand.setRange(100000, 999999);
                code := await rand.next();
                //TODO Enviar email con el codigo //Codigo de ejemplo: https://github.com/domwoe/email-verification/tree/main
                #Ok("Se ha enviado un email con el codigo de verificacion a " # email);
            };
        }  
    };

    public shared ({caller}) func verifyCode(_code: Nat): async Bool {
        assert (caller == owner);
        if(_code == code and code != 0) {verified := true};
        verified
    };

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