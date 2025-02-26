import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory as bucket_idlFactory } from "../../src/declarations/user_no_deploy/user_no_deploy.did.js"; 

const crearActorParaBucket = async (canisterId) => {
  let authClient = await AuthClient.create();
  const currentIdentity = authClient.getIdentity();

  if (!currentIdentity) {
    throw new Error("Identidad no disponible. Asegúrate de estar autenticado.");
  }

  const agent = new HttpAgent({
    host: import.meta.env.VITE_HOST_URL,  
    identity: currentIdentity,
  });

  await agent.fetchRootKey();

  const actor = Actor.createActor(bucket_idlFactory, {
    agent,
    canisterId,
  });

  return actor;
};

export default crearActorParaBucket;
