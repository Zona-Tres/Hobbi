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

  public func searchTv(queryString : [Text]): async Text { 
    var url = "https://api.themoviedb.org/3/search/multi?query=";

    for (word in queryString.vals()) {
      url := url # word #"%20";
    };
    url := Text.trimEnd(url, #char '0');
    url := Text.trimEnd(url, #char '2');
    url := Text.trimEnd(url, #char '%');

    url := url # "&include_adult=false&language=en-US&page=1";

    let response: Types.CanisterHttpResponsePayload = await proxyAuth(url);
    let decodedResponse : Text = await decodeResponse(response.body);

    return decodedResponse;
  };

  public func searchGame(queryString : [Text]): async Text {
    var url = "https://rawg.io/api/search?search=";

    for (word in queryString.vals()) {
      url := url # word #"%20";
    };
    url := Text.trimEnd(url, #char '0');
    url := Text.trimEnd(url, #char '2');
    url := Text.trimEnd(url, #char '%');

    url := url # "&page_size=10&page=1&key=c542e67aec3a4340908f9de9e86038af";

    let response: Types.CanisterHttpResponsePayload = await proxy(url);
    let decodedResponse : Text = await decodeResponse(response.body);

    return decodedResponse;
  };

  public func searchBook(queryString : [Text]): async Text {
    var url = "https://openlibrary.org/search.json?q=";
    
    for (word in queryString.vals()) {
      url := url # word #"%20";
    };
    url := Text.trimEnd(url, #char '0');
    url := Text.trimEnd(url, #char '2');
    url := Text.trimEnd(url, #char '%');

    url := url # "&_spellcheck_count=0&limit=10&fields=key,cover_i,title,subtitle,author_name,name&mode=everything";

    let response: Types.CanisterHttpResponsePayload = await proxy(url);
    let decodedResponse : Text = await decodeResponse(response.body);

    return decodedResponse;
  };

  public func decodeResponse(body : [Nat8]) : async Text {
    let text_decoded: ?Text = Text.decodeUtf8(Blob.fromArray(body));

    let checked_text : Text = switch text_decoded {
      case null "";
      case (?Text) Text;
    };

    checked_text;
  };

  public func getMetadata(account : Principal): async ?Text {
    return metadata_list.get(account);
  };

  public func proxy(url : Text) : async Types.CanisterHttpResponsePayload {

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
    return response;
  };

  public func proxyAuth(url : Text) : async Types.CanisterHttpResponsePayload {

    let transform_context : Types.TransformContext = {
      function = transform;
      context = Blob.fromArray([]);
    };

    // Construct canister request
    let request : Types.CanisterHttpRequestArgs = {
      url = url;
      max_response_bytes = null;
      headers = [
        {
          name = "Authorization";
          value = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwN2M3MjJiZTYwODM1MTMyNmNkNzgyMGM4ZTRhNjU1MSIsInN1YiI6IjY1NzEzYjkyZGZlMzFkMDBlMGRhNDkxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6TkvC97Gbfl8tzXA3Krv44GzHkE8BkovbGKaY_jcVIA";
        },
      ];
      body = null;
      method = #get;
      transform = ?transform_context;
    };

    Cycles.add(220_000_000_000);
    let ic : Types.IC = actor ("aaaaa-aa");
    let response : Types.CanisterHttpResponsePayload = await ic.http_request(request);
    return response;
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