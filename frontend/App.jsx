import React from "react"

import { createClient } from "@connect2ic/core"
import { InternetIdentity } from "@connect2ic/core/providers/internet-identity"
import { Connect2ICProvider } from "@connect2ic/react"
import "@connect2ic/core/style.css"

//Import canister definitions like this:
import * as nft from "../src/declarations/nft"
import * as outcall from "../src/declarations/outcall"
import * as post from "../src/declarations/post"
import { Route, Routes } from "react-router-dom"

import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import ErrorBoundary from "./pages/ErrorBoundary"
import CreateProfile from "./pages/CreateProfile"
import Connect2Hobbi from "./pages/Connect"
import RequireAuth from "./components/utils/require-auth"

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/connect" element={<Connect2Hobbi />} />
      
      {/* Protected Routes */}
      <Route element={<RequireAuth />} >
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Error routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const client = createClient({
  canisters: {
    nft,
    outcall,
    post,
  },
  providers: [
    new InternetIdentity({ providerUrl: "http://127.0.0.1:8000/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai" })
  ],
  globalProviderConfig: {
    dev: true,
  },
})

export default () => (
  <ErrorBoundary>
    <Connect2ICProvider client={client}>
      <App />
    </Connect2ICProvider>
  </ErrorBoundary>
)
