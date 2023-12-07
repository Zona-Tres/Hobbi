import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Int "mo:base/Int";

actor PostCanister {
  public type Progress = {
    #Started;
    #Interested;
    #Finished;
  };

  public type MediaType = {
    #Book;
    #Tv;
    #Music;
    #Game;
  };

  public type PostMetadata = {
    title: Text;
    autor: Text;
    image_url: Text;
    progress: Progress;
    media_type: MediaType;
  };

  public type Post = {
    id: Text;
    date: Int;
    message: Text;
    metadata: PostMetadata;
  };

  type PostList = HashMap.HashMap<Text, Post>;
  let Posts = HashMap.HashMap<Principal, PostList>(0, Principal.equal, Principal.hash);

  public shared (msg) func createPost(postId: Text, message: Text, metadata: PostMetadata): async Post {
    let user : Principal = msg.caller;
    var newPost: Post = {id= postId; date= Time.now(); message= message; metadata= metadata};
    let userPosts = Posts.get(user);

    var userPostsChecked: PostList = switch userPosts {
      case (null) {
        HashMap.HashMap(0, Text.equal, Text.hash);
      };
      case (?userPosts) userPosts;
    };

    userPostsChecked.put(postId, newPost);
    Posts.put(user, userPostsChecked);

    Debug.print("New post created! " # Principal.toText(user));
    return newPost;
  };

  public query (msg) func getUserPosts(user: Text) : async [(Text, Post)] {
    let userPrincipal: Principal = Principal.fromText(user);
    let userPosts = Posts.get(userPrincipal);

    var userPostsChecked: PostList = switch userPosts {
      case (null) {
        HashMap.HashMap(0, Text.equal, Text.hash);
      };
      case (?userPosts) userPosts;
    };

    return Iter.toArray<(Text, Post)>(userPostsChecked.entries());
  };

}