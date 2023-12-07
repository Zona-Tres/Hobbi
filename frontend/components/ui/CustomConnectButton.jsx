import React from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton, ConnectDialog } from "@connect2ic/react";

export default function CustomConnectButton() {
	const navigate = useNavigate()

	return(
		<>
			<ConnectButton onConnect={() => {
				navigate("/dashboard")
			}} 
			onDisconnect={() => {
				navigate("/")
			}}/>
			<ConnectDialog />
		</>
	)
}