import React, { useEffect, useRef, useState } from "react";
import { useCanister, useConnect } from "@connect2ic/react";
import { Principal } from "@dfinity/principal";
import { arrayBufferToImgSrc } from "../utils/image";

import Illustration from '/images/glow-top.svg'
import Header from "../components/ui/Header";
import Particles from "../components/Particles";

import { FaBookOpen, FaMusic, FaGamepad } from "react-icons/fa";
import { PiTelevisionSimpleFill } from "react-icons/pi";


export default function Dashboard() {
	const [nft] = useCanister("nft")
	const {principal} = useConnect()
	const firstLoad = useRef(true)

	const [nftMetadata, setNftMetadata] = useState({})
	const [loading, setLoading] = useState(false)

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
					console.log(metadata.Ok[0].key_val_data[0].val.TextContent)
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

	if(loading) {
		return(<div>Loading...</div>)
	}

	return(
		<div className="flex flex-col min-h-screen w-full overflow-hidden relative">
      {/* <Header /> */}
      <section className="grow relative">
        {/* Background Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
					<div className="absolute left-1/2 -translate-x-1/2 bottom-0">
						<img src={Illustration} className="max-w-none" width={2146} alt="Hero Illustration" />
					</div>
				</div>

				<div className="relative flex flex-row p-4 space-x-8 flex-grow">
					{/* Left side */}
					<div className="space-y-4">
						<div className="border-2 border-purple-800 rounded-2xl overflow-hidden w-56">
							<img width={300} src={arrayBufferToImgSrc(nftMetadata.data)} alt="NFT" />
						</div>
						<div className="text-center w-56 bg-slate-900 rounded-2xl p-4 flex-grow">
							<p className="text-white font-medium">User</p>
						</div>
					</div>

					{/* Right side */}
					<div className="w-full space-y-4">
						<div className="w-full border-2 border-purple-800 py-2 px-4 rounded-2xl space-y-2 bg-slate-200">
							<p className="text-slate-900 font-medium">¿Qué estás pensando?</p>
							<div className="border-b border-slate-900" />
							<div className="flex items-center justify-start w-full space-x-2">
								<button className="hover:text-purple-800">
									<FaBookOpen />
								</button>
								<button className="hover:text-purple-800">
									<PiTelevisionSimpleFill />
								</button>
								<button className="hover:text-purple-800">
									<FaMusic />
								</button>
								<button className="hover:text-purple-800">
									<FaGamepad />
								</button>
							</div>
						</div>
						<div className="flex flex-col space-y-4 w-full">
							{/* Post 1 */}
							<div className="flex flex-col w-full rounded-2xl bg-slate-200 py-3 px-4 space-y-2">
								<div className="flex flex-row space-x-2">
									<div className="w-36 h-20 bg-slate-900" />
									<div className="w-full space-y-1">
										<p className="font-medium"><strong>{`User`}</strong> terminó <strong>Squid Games</strong></p>
										<p className="text-xs">01-01-2024 20:43</p>
										
										<p className="mt-2">Está muy chida :D</p>
									</div>
								</div>
								<div className="border-b border-slate-400" />
								{/* Comentarios */}
								<div className="flex flex-row w-full space-x-2 ">
									<div className="h-12 w-12 bg-purple-600 rounded-lg"/>
									<div className="h-12 w-full text-slate-900">
										<p><strong>Cristina</strong></p>
										<p>Te dije que te iba a gustar!!</p>
									</div>
								</div>
								<div className="flex flex-row w-full space-x-2 ">
									<div className="h-12 w-12 bg-purple-600 rounded-lg"/>
									<div className="h-12 w-full text-slate-900">
										<p><strong>Cristian</strong></p>
										<p>Está equisona, deberías de ver mejor <strong>Something else</strong></p>
									</div>
								</div>
								<div className="border-b border-slate-400" />
								<div className="flex flex-row space-x-2">
									<div className="border border-purple-900 rounded-xl w-full p-2">Escribe un comentario...</div>
									<p className="flex items-center justify-center w-36 bg-slate-900 text-white rounded-xl">Comentar</p>
								</div>
							</div>

							{/* Post 2 */}
							<div className="flex flex-col w-full rounded-2xl bg-slate-200 py-3 px-4 space-y-2">
								<div className="flex flex-row space-x-2">
									<div className="w-36 h-20 bg-slate-900" />
									<div className="w-full space-y-1">
										<p className="font-medium"><strong>{`User`}</strong> empezó <strong>Octopath Traveler</strong></p>
										<p className="text-xs">01-01-2024 20:43</p>
										
										<p className="mt-2">A ver que tal...</p>
									</div>
								</div>
								<div className="border-b border-slate-400" />
								{/* Comentarios */}
								<div className="flex flex-row space-x-2">
									<div className="border border-purple-900 rounded-xl w-full p-2">Escribe un comentario...</div>
									<p className="flex items-center justify-center w-36 bg-slate-900 text-white rounded-xl">Comentar</p>
								</div>
							</div>

							{/* Post 3 */}
							<div className="flex flex-col w-full rounded-2xl bg-slate-200 py-3 px-4 space-y-2">
								<div className="flex flex-row space-x-2">
									<div className="w-36 h-20 bg-slate-900" />
									<div className="w-full space-y-1">
										<p className="font-medium"><strong>{`User`}</strong> quiere leer <strong>El temor de un hombre sabio</strong></p>
										<p className="text-xs">01-01-2024 20:43</p>
										
										<p className="mt-2">Me lo recomendaron!!!</p>
									</div>
								</div>
								<div className="border-b border-slate-400" />
								{/* Comentarios */}
								<div className="flex flex-row w-full space-x-2 ">
									<div className="h-12 w-12 bg-purple-600 rounded-lg"/>
									<div className="h-12 w-full text-slate-900">
										<p><strong>Cristina</strong></p>
										<p>De que se trata?</p>
									</div>
								</div>
								<div className="flex flex-row space-x-2">
									<div className="border border-purple-900 rounded-xl w-full p-2">Escribe un comentario...</div>
									<p className="flex items-center justify-center w-36 bg-slate-900 text-white rounded-xl">Comentar</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}