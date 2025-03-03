import React from "react"

import { createClient } from "@connect2ic/core"
import { InternetIdentity, NFID } from "@connect2ic/core/providers"
import { Connect2ICProvider } from "@connect2ic/react"
import "@connect2ic/core/style.css"

import * as hobbi from "../src/declarations/hobbi"
import { Route, Routes } from "react-router-dom"

import Feed from "./pages/Feed"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Friends from './pages/Friends'
import Communities from './pages/Communities'
import NotFound from "./pages/NotFound"
import ErrorBoundary from "./pages/ErrorBoundary"
import CreateProfile from "./pages/CreateProfile"
import Connect2Hobbi from "./pages/Connect"
import RequireAuth from "./components/utils/require-auth"
import { HelmetProvider } from "react-helmet-async"
import { SeoMarkup } from "./components/utils/seo-markup"
import ProfileInfo from "./pages/ProfileInfo"

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/connect" element={<Connect2Hobbi />} />
      <Route path="/myprofile" element={<Dashboard />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/communities" element={<Communities />} />
      <Route path="/profile/:id" element={<ProfileInfo />} />
      <Route path="/feed" element={<Feed />} />
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
    hobbi
  },
  providers: [
    new InternetIdentity({ providerUrl: "http://127.0.0.1:8000/?canisterId=be2us-64aaa-aaaaa-qaabq-cai" }),
    new NFID(),
  ],
  globalProviderConfig: {
    dev: true,
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
