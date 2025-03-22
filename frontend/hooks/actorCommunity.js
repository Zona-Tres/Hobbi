import { Actor, HttpAgent } from "@dfinity/agent"
import { AuthClient } from "@dfinity/auth-client"
import { idlFactory as bucket_idlFactory } from "../../src/declarations/community_no_deploy/community_no_deploy.did.js"

const actorCommunity = async (canisterId) => {
  let authClient = await AuthClient.create()
  const currentIdentity = authClient.getIdentity()

  if (!currentIdentity) {
    throw new Error("Identity not available. Make sure you are authenticated.")
  }

  const agent = new HttpAgent({
    host: import.meta.env.VITE_HOST_URL,
    identity: currentIdentity,
  })

  await agent.fetchRootKey()

  const actor = Actor.createActor(bucket_idlFactory, {
    agent,
    canisterId,
  })

  return actor
}

export default actorCommunity
