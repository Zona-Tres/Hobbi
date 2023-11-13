import Blob "mo:base/Blob";
import Text "mo:base/Text";
import Error "mo:base/Error";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Cycles "mo:base/ExperimentalCycles";
import Types "./model";

actor {
  var metadata_list = HashMap.HashMap<Principal, Text>(0, Principal.equal, Principal.hash);

  public shared(msg) func addServiceMetadata(info_id: Text, service_type: Types.Service) : async Text {
    let metadata: Text = await proxy(info_id, service_type);
    let owner: Principal = msg.caller;

    metadata_list.put(owner, metadata);

    return metadata;
  };

  public func getMetadata(account : Principal): async ?Text {
    return metadata_list.get(account);
  };

  public func proxy(info_id: Text, service_type: Types.Service) : async Text {

    let transform_context : Types.TransformContext = {
      function = transform;
      context = Blob.fromArray([]);
    };

    let url = switch(service_type) {
      case (#Tv) "Placeholder, need to handle API KEY";
      case (#Music) "Placeholder, need to handle API KEY";
      case (#Book) "https://openlibrary.org/works/" # info_id # ".json";
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