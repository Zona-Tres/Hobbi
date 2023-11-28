import React from "react"

import { createClient } from "@connect2ic/core"
import { InternetIdentity } from "@connect2ic/core/providers/internet-identity"
import { Connect2ICProvider } from "@connect2ic/react"
import "@connect2ic/core/style.css"

//Import canister definitions like this:
import * as nft from "../src/declarations/nft"
import { Route, Routes } from "react-router-dom"

import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import CreateProfile from "./pages/CreateProfile"
import Connect2Hobbi from "./pages/Connect"
import RequireAuth from "./components/utils/require-auth"

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/connect" element={<Connect2Hobbi />} />
      
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      {/* Protected Routes */}
      <Route element={<RequireAuth />} >
      </Route>
    </Routes>
  )
}

const client = createClient({
  canisters: {
    nft,
  },
  providers: [
    new InternetIdentity({ providerUrl: "http://127.0.0.1:8000/?canisterId=bkyz2-fmaaa-aaaaa-qaaaq-cai" })
  ],
  globalProviderConfig: {
    dev: true,
  },
})

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
)
