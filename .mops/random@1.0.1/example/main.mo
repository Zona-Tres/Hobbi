import Rand "../src/Rand";

actor {
  let random = Rand.Rand();

  public func setRange(a : Nat, b : Nat) : async () {
    random.setRange(a, b);
  };

  public func randArray(n : Nat) : async [Nat] {
    await random.randArray(n);
  };

  public func next(): async Nat{
    await random.next();
  };
  
  public func randPrincipal() : async Principal {
    await random.principal();
  };

  public func randRange(a: Nat, b: Nat): async Nat{
    await random.randRange(a,b);
  };

  public func randString(s: Nat): async Text{
    await random.randString(s);
  };

};
