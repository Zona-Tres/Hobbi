import React from "react"
import { useNavigate } from "react-router-dom"
import { ConnectButton, ConnectDialog, useConnect } from "@connect2ic/react"

export default function CustomConnectButton() {
  const navigate = useNavigate()

  return (
    <>
      <ConnectButton
        style={{
          paddingLeft: "1rem",
          paddingRight: "1rem",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          width: "8rem",
          color: "white",
          transitionProperty: "all",
          transitionDuration: "150ms",
          transitionTimingFunction: "ease-in-out",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "#0F172A",
        }}
        onConnect={() => {
          navigate("/create-profile")
        }}
        onDisconnect={() => {
          navigate("/")
        }}
      />
      <ConnectDialog />
    </>
  )
}
