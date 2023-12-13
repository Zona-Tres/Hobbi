import React, { useEffect, useRef, useState } from "react";
import { useCanister, useConnect } from "@connect2ic/react";
import { Principal } from "@dfinity/principal";
import { arrayBufferToImgSrc } from "../utils/image";

import Illustration from '/images/glow-top.svg'
import Logo from "../components/ui/Logo";
import LogoImg from '../../public/logo.png'
import Particles from "../components/Particles";
import SearchAndPost from "../components/SearchAndPost";
import PostList from "../components/PostList";
import CustomConnectButton from "../components/ui/CustomConnectButton";
import { useNavigate, useParams } from "react-router-dom";
import { Seo } from "../components/utils/seo";

export default function Dashboard() {
	// Navigation
	const { id } = useParams()
	const navigate = useNavigate()

	// Canister
	const [nft] = useCanister("nft")
	const [post] = useCanister("post")
	const {principal} = useConnect()
	
	// Component's state
	const firstLoad = useRef(true)
	const [nftMetadata, setNftMetadata] = useState({})
	const [loading, setLoading] = useState(false)
	const [postList, setPostList] = useState([])

	useEffect(() => {
		setLoading(true)
		const checkProfile = async () => {
			try {
				console.log(id)
				nft.getTokenIdsForUserDip721(Principal.fromText(id)).then((vec) => {
					const arr = Array.from(vec)

					if (arr.length == 0 ) navigate('/error')
					return nft.getMetadataDip721(arr[0])
				})
				.then((metadata) => {
					setNftMetadata(metadata.Ok[0])
				})

				post.getUserPosts(id).then((vec) => {
					setPostList(vec)
				})
			} catch (error) {
				console.error('Error checking profile', error)
				navigate('/error')
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
		<Seo
			title={`Hobbi.me | ${`Cargando perfil`}`}
			description={"Reinventa la forma de socializar y se el dueño de tú información en internet."}
			type={"webapp"}
			name={"Hobbi"}
			rel={"https://hobbi.me/profile"}
		/>
		{Object.keys(nftMetadata).length == 0 ? <div className="flex items-center justify-center w-full min-h-screen space-x-4">
			<img src={LogoImg} width={40} height={40} className="animate-spin"/>
			<p className="font-bold text-slate-900 text-2xl">Cargando...</p>
		</div> 
		
		: 
		<>
		<Seo
        title={`Hobbi.me | ${nftMetadata.key_val_data[0].val.TextContent}`}
        description={"Reinventa la forma de socializar y se el dueño de tú información en internet."}
        type={"webapp"}
        name={"Hobbi"}
        rel={"https://hobbi.me/profile"}
      />
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
						{principal == id && <SearchAndPost setPostList={setPostList}/>}						
						<PostList postList={postList} user={nftMetadata.key_val_data[0].val.TextContent}/>
					</div>
				</div>
			</section>
		</div>
		</>
		}
		</>
	)
}