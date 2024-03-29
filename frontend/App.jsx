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
import { HelmetProvider } from "react-helmet-async"
import { SeoMarkup } from "./components/utils/seo-markup"

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/connect" element={<Connect2Hobbi />} />
      <Route path="/profile/:id" element={<Dashboard />} />
      
      {/* Protected Routes */}
      <Route element={<RequireAuth />} >
        <Route path="/create-profile" element={<CreateProfile />} />
      </Route>

      {/* Error routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const helmetContext = {}
const client = createClient({
  canisters: {
    nft,
    outcall,
    post,
  },
  providers: [
    new InternetIdentity({ providerUrl: "https://identity.ic0.app/" })
  ],
  globalProviderConfig: {
    dev: false,
  },
})

export default () => (
  <ErrorBoundary>
    <HelmetProvider context={helmetContext}>
      <SeoMarkup />
      <Connect2ICProvider client={client}>
        <App />
      </Connect2ICProvider>
    </HelmetProvider>
  </ErrorBoundary>
)
