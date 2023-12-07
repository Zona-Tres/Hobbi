import React, { useEffect, useRef, useState } from "react";
import { useCanister, useConnect } from "@connect2ic/react";
import { Principal } from "@dfinity/principal";
import { arrayBufferToImgSrc } from "../utils/image";

import Illustration from '/images/glow-top.svg'
import Logo from "../components/ui/Logo";
import Particles from "../components/Particles";
import SearchAndPost from "../components/SearchAndPost";
import PostList from "../components/PostList";
import CustomConnectButton from "../components/ui/CustomConnectButton";

export default function Dashboard() {
	const [nft] = useCanister("nft")
	const [post] = useCanister("post")
	const {principal} = useConnect()
	const firstLoad = useRef(true)

	const [nftMetadata, setNftMetadata] = useState({})
	const [loading, setLoading] = useState(false)

	const [postList, setPostList] = useState([])

	useEffect(() => {
		setLoading(true)
		const checkProfile = async () => {
			try {
				nft.getTokenIdsForUserDip721(Principal.fromText(principal)).then((vec) => {
					const arr = Array.from(vec)
					return nft.getMetadataDip721(arr[0])
				})
				.then((metadata) => {
					console.log(metadata.Ok[0])
					setNftMetadata(metadata.Ok[0])
				})

				post.getUserPosts(principal).then((vec) => {
					setPostList(vec)
				})
			} catch (error) {
				console.error('Error checking profile:', error)
			} finally {
				setLoading(false)
			}
		};

		if(firstLoad) {
			checkProfile()
			firstLoad.current = false
		}
	}, [])

	return(
		<>
		{Object.keys(nftMetadata).length == 0 ? <div>Loading...</div> : 
		<div className="flex flex-col min-h-screen w-full overflow-hidden relative">
			{/* Background Image */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
				<div className="left-1/2 -translate-x-1/2 bottom-0">
					<img src={Illustration} className="max-w-none" width={2146} alt="Hero Illustration" />
				</div>
			</div>
			
      <section className="flex-grow">
				<div className="relative flex flex-row items-center justify-between w-full h-20 px-4 bg-gradient-to-br from-slate-200 via-slate-200/60 to-slate-200/20">
					<div className="flex flex-row space-x-4 items-center">
						<Logo />
						<h1 className="font-bold text-2xl text-slate-900">{nftMetadata.key_val_data[0].val.TextContent}'s profile</h1>
					</div>
					<CustomConnectButton />
				</div>
				<div className="relative flex flex-row p-4 space-x-8">
					{/* Left side */}
					<div className="space-y-4">
						<div className="border-2 border-purple-800 rounded-2xl overflow-hidden w-56">
							<img width={300} src={arrayBufferToImgSrc(nftMetadata.data)} alt="NFT" />
						</div>
						<div className="text-center w-56 bg-slate-900 rounded-2xl p-4 flex-grow">
							<p className="text-white font-medium">{nftMetadata.key_val_data[0].val.TextContent}</p>
							<p className="text-white font-light">{nftMetadata.key_val_data[1].val.TextContent}</p>
						</div>
					</div>

					{/* Right side */}
					<div className="w-full space-y-4">
						<SearchAndPost setPostList={setPostList}/>
						<PostList postList={postList} user={nftMetadata.key_val_data[0].val.TextContent}/>
					</div>
				</div>
			</section>
		</div>}
		</>
	)
}