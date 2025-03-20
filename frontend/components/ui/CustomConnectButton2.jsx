import React from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton, ConnectDialog, useCanister, useConnect } from "@connect2ic/react";
import useStore from "../../store/useStore"
import createBucketActor from "../../hooks/createBucketActor"


export default function CustomConnectButton() {
	const navigate = useNavigate()
	const myinfo = useStore((state) => state.myinfo)
	const setMyInfo = useStore((state) => state.setMyInfo)
	const [hobbi] = useCanister("hobbi")
	const { isConnected } = useConnect()

	const handleConnect = async () => {
		navigate("/")
		const loginResult = await hobbi.signIn();
		console.log("loginResult", loginResult);
		if ("Ok" in loginResult) {
			const userActorClass = await createBucketActor(loginResult.Ok.userCanisterId);
			const info = await userActorClass.getMyInfo()
			console.log(info)
			setMyInfo(info)
			navigate("/feed/")
		} else {
			navigate("/create-profile/")
		}
	}

	const handleDisConnect = () => {
		setMyInfo({})
		navigate("/")
	}

	return(
		<>
			<ConnectButton style={{
				paddingLeft: '1rem',
				paddingRight: '1rem',
				paddingTop: '0.5rem',
				paddingBottom: '0.5rem',
				width: '8rem',
				color: 'white',
				transitionProperty: 'all',
				transitionDuration: '150ms',
				transitionTimingFunction: 'ease-in-out',
				textAlign: 'center',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				background: '#0F172A',
			}} onConnect={async () => {
				if (isConnected) await handleConnect();
				// navigate("/feed/")
			}} 
			onDisconnect={() => {
				handleDisConnect
			}}/>
			<ConnectDialog />
		</>
	)
}