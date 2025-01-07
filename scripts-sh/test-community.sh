# Es necesario ejecutar "npm run deploy-with-content" previamente
dfx identity use 0000TestUser1
c=$(dfx canister call hobbi createCommunity '(
    record {
        name = "Super Mario Bross"; 
        description = "Comunidad vintage relacionada a Super Mario Bross"
    }
)')

communityCID=$(echo "$c" | grep -oP '(?<=principal ")[^"]+')
echo "Nueva comunidad omunidad creada en $communityCID "


dfx identity use 0000TestUser1
dfx canister call $communityCID joinCommunity
dfx canister call $communityCID getCommunityInfo