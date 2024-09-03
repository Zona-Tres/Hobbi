import Types "types";
import Principal "mo:base/Principal";

actor class User (owner: Principal, name: Text, avatar: ?Blob) = this {

    type PrivateInfoUser = Types.PrivateInfoUser;
    type PublicInfoUser = Types.PublicInfoUser;
    type PostID = Types.PostID;

    // stable var name: Text = name;
    // stable var avatar: ?Blob = avatar;

    stable var email: ?Text = null;
    stable var verified = false; // Para verificacion de email mediante el envio de código
    stable var postLiked: [PostID] = [];

    public shared query ({caller}) func getMyInfo():async  PrivateInfoUser { //Se llama desde el front para cargar los datos en el dashboard
        assert (caller == owner);
        {   name;
            avatar;
            canisterID = Principal.fromActor(this);
            owner;
            email;
            postLiked;
            verified;
        };
    };
    public query func getInfo(): async PublicInfoUser {{name; avatar; verified}}; 




}