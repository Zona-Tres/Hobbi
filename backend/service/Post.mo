import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Nat64 "mo:base/Nat64";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

actor PostManager {
  type PostId = Text;
  type Timestamp = Text;
  type Post = {
    id: PostId;
    message: Text;
    created: Timestamp;
    reactions: Nat64;
    pinned: Bool;
    comments: [(Principal,Text,Timestamp)];
  };

  type PostList = HashMap.HashMap<Text, Post>;
  let UserPostList = HashMap.HashMap<Principal, PostList>(0, Principal.equal, Principal.hash);

  public shared (msg) func createPost(id: Text, message: Text) : async Post {
    let user : Principal = msg.caller;
    var new_post: Post = {id= id; message=message; created = debug_show(Time.now()); reactions= 0; pinned = false; comments = []};
    
    let user_posts = UserPostList.get(user);
    
    var check_user_posts: PostList = switch user_posts {
      case (null) HashMap.HashMap(0, Text.equal, Text.hash);
      case (?user_posts) user_posts;
    };

    check_user_posts.put(id, new_post);
    UserPostList.put(user, check_user_posts);

    return new_post;
  };

  public query (msg) func getPostById(id: PostId) : async Post {
    let user : Principal = msg.caller;
    let user_posts = UserPostList.get(user);

    var check_user_posts: PostList = switch user_posts {
      case (null) HashMap.HashMap(0, Text.equal, Text.hash);
      case (?user_posts) user_posts;
    };

    let post = check_user_posts.get(id);

    var checked_post : Post = switch post {
      case (null) {{id="null"; message = "Not found"; created=debug_show(Time.now()); reactions=0; pinned=false; comments= []}};
      case (?post) post;
    };

    return checked_post;
  };

  public query (msg) func getUserPosts() : async [(Text, Post)] {
    let user : Principal = msg.caller;
    let user_posts = UserPostList.get(user);

    var check_user_posts: PostList = switch user_posts {
      case (null) HashMap.HashMap(0, Text.equal, Text.hash);
      case (?user_posts) user_posts;
    };

    return Iter.toArray<(Text, Post)>(check_user_posts.entries());
  };
}