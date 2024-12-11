#### Deploy instructions:
Instalar el gestor de paquetes mops:
``` npm i -g ic-mops ```

posiblemente se requiera activar los permisos
```chmod +x /home/ariel/.nvm/versions/node/v20.12.2/bin/mops```

```bash
npm install
mops init 
mops install
dfx start --background --clean
# Generate declarations
dfx generate hobbi
dfx generate outcall
dfx generate post
dfx generate user_no_deploy
dfx generate internet_identity
# Deploy canisters
dfx deploy hobbi
dfx deploy outcall
dfx deploy post
dfx deploy user_no_deploy
dfx deploy internet_identity
npm run dev
```

[![Logo](https://github.com/Zona-Tres/Hobbi/assets/54418646/9ca31b21-3bcb-43ed-b12b-8278bec83c38)](https://hobbi.me)
# Hobbi, the web3 social platform

Reinvent the way you socialize and be the owner of your information on the internet.

With Hobbi, you can create a profile and record all the multimedia content you consume. Whether it's a movie, a book, or even a video game, register and share your profile with whomever you want.

## Using the Canisters

Hobbi is composed of 3 different canisters:
* NFT
* Post
* Outcall

Each of them controls a different functionality within the platform.

### NFT

![CreateProfile](https://github.com/Zona-Tres/Hobbi/assets/54418646/76e92725-4df9-433c-a1e3-446ff2eebbf0)

The start of your interaction within Hobbi. When you enter the site, you are asked to connect using **Internet Identity** for the creation of your profile. In it, you can register a username or nickname, a short biography, and a picture as an avatar. This profile is created as a non-fungible token (NFT) compatible with DIP-721, so you can view your profile in any application compatible with these tokens.

### Post

![PostOptions](https://github.com/Zona-Tres/Hobbi/assets/54418646/b01d6d68-b9ee-42b3-9d3f-db954ffd1c47)


Once your profile is created, you can start posting content. This is very simple, just choose the type of multimedia (**Book**, **TV**, or **Video Game**) and search for your favorites. From there, you can select if you are interested, if you just started, or if you have finished this content, and voila, pressing Post will save it to your profile.

![ProfilePost](https://github.com/Zona-Tres/Hobbi/assets/54418646/7752838f-3a12-40ef-8563-622181c77209)

### Outcall

![SearchMetadata](https://github.com/Zona-Tres/Hobbi/assets/54418646/af544cf8-d47a-4df1-a61c-da2927ed8e3d)

When searching for content to post, you will notice that the page shows you metadata about your search. This is achieved through **HTTPS Outcalls**, which are essentially a way for the **ICP** blockchain to communicate with the outside world. In broad terms, they are a call to an external **API** endpoints, and the list of ones we use is as follows:

* [OpenLibrary](https://openlibrary.org/dev/docs/api/books)
* [TheMovieDB](https://developer.themoviedb.org/docs)
* [RAWG](https://rawg.io/apidocs)

Inside the canister, you can find examples of calls to each of the APIs. Check the documentation of each one to see specific cases.