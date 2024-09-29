deploy canister hobbi
```dfx deploy hobbi```
signUp usuario. Args: Nombre, opcional email, bio, opcional foto, provisoriamente fee
```dfx canister call hobbi signUp '("Alice", null, "Biografía de Alice", null, 23_846_202_380)'```
ver canisterId del ActorClass de Alice:
```dfx canister call hobbi getMyUserCanisterId```
ver info de Alice
```dfx canister call <canisterIdDeAlice> getMyInfo```

