deploy canister hobbi
```dfx deploy hobbi```
signUp usuario. Args: Nombre, opcional email, bio, opcional foto, provisoriamente fee
```
dfx canister call hobbi signUp '(record {
    name="Usuario Flic"; 
    email=null; 
    bio="Biografía de Usuario Flic"; 
    avatar=null
})'

```
ver canisterId del ActorClass de Alice:
```dfx canister call hobbi getMyUserCanisterId```
ver info de Alice
```dfx canister call <canisterIdDeAlice> getMyInfo```

cear Post
```
dfx canister call bw4dl-smaaa-aaaaa-qaacq-cai createPost '(record {
    access = variant{Public};
    title ="Mi primer Posteo en Hobbi. Soy Usuario FlicB";
    hashTags = vec {"Motoko"; "Kusanagui"};
    body = "Cuerpo del posteo";
    image = opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    imagePreview = opt blob "11/22/33/44";
    image_url = null;
    media_type = variant {Game}
    }
)'

```



//// Test ////
dfx stop
dfx start --clean --background
dfx identity new deployerPrueba
dfx identity use deployerPrueba
dfx deploy hobbi
dfx identity new identidadDePrueba1
dfx identity use identidadDePrueba1
actorClassPrueba1=$(dfx canister call hobbi signUp '(record {name="identidadDePrueba1"; email=opt "identidadDePrueba1@gmail.com"; bio="Biografía de identidadDePrueba1"; avatar=null})')

dfx canister call $actorClassPrueba1 createPost '(record {
        access = variant{Public};
        title ="Mi primer Posteo en Hobbi. Soy Prueba1";
        image = null;
        image_ul = null;
        media_type = variant {Game}
    }
)'


