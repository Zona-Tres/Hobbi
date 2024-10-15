deploy canister hobbi
```dfx deploy hobbi```
signUp usuario. Args: Nombre, opcional email, bio, opcional foto, provisoriamente fee
```dfx canister call hobbi signUp '(record {name="Alice"; email=null; bio="Biografía de Alice"; avatar=null})'```
ver canisterId del ActorClass de Alice:
```dfx canister call hobbi getMyUserCanisterId```
ver info de Alice
```dfx canister call <canisterIdDeAlice> getMyInfo```

cear Post
```
dfx canister call <canisterIdDeAlice> createPost '(record {
            access = variant{Public};
            title ="Mi primer Posteo en Hobbi";
            image = null;
            image_ul = null;
            media_type = variant {Game}
        }
    )'

```

