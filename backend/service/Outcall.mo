import Blob "mo:base/Blob";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Types "../model/OutcallType";
import Principal "mo:base/Principal";
import Cycles "mo:base/ExperimentalCycles";

actor {
  type User = Principal;
  type BookList = HashMap.HashMap<Text, Text>;

  var favoritebook = HashMap.HashMap<Principal, Text>(0, Principal.equal, Principal.hash);

  public shared(msg) func getUser() : async Principal {
    let currentUser = msg.caller;
    return currentUser;
  };

  public shared(msg) func addBook(url: Text) : async Text {
    let book: Text = await proxy(url);
    let owner: Principal = msg.caller;

    favoritebook.put(owner, book);
    Debug.print("Your favorite book has been saved! " # Principal.toText(owner) # ". Thanks!");

    return book;
  };

  public func getBook(account : Principal): async ?Text {
    return favoritebook.get(account);
  };

  public func proxy(url : Text) : async Text {

    let transform_context : Types.TransformContext = {
      function = transform;
      context = Blob.fromArray([]);
    };

    // Construct canister request
    let request : Types.CanisterHttpRequestArgs = {
      url = url;
      max_response_bytes = null;
      headers = [];
      body = null;
      method = #get;
      transform = ?transform_context;
    };

    Cycles.add(220_000_000_000);
    let ic : Types.IC = actor ("aaaaa-aa");
    let response : Types.CanisterHttpResponsePayload = await ic.http_request(request);
    
    let text_decoded: ?Text = Text.decodeUtf8(Blob.fromArray(response.body));

    let textOrNot : Text = switch text_decoded {
      case null "";
      case (?Text) Text;
    };

    textOrNot;
  };

  public query func transform(raw : Types.TransformArgs) : async Types.CanisterHttpResponsePayload {
    let transformed : Types.CanisterHttpResponsePayload = {
      status = raw.response.status;
      body = raw.response.body;
      headers = [
        {
          name = "Content-Security-Policy";
          value = "default-src 'self'";
        },
        { name = "Referrer-Policy"; value = "strict-origin" },
        { name = "Permissions-Policy"; value = "geolocation=(self)" },
        {
          name = "Strict-Transport-Security";
          value = "max-age=63072000";
        },
        { name = "X-Frame-Options"; value = "DENY" },
        { name = "X-Content-Type-Options"; value = "nosniff" },
      ];
    };
    transformed;
  };
};