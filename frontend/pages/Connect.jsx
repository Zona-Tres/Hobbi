import React from "react";
import Illustration from '/images/glow-bottom.svg'
import CustomConnectButton from "../components/ui/CustomConnectButton"
import Logo from "../components/ui/Logo";
import { Seo } from "../components/utils/seo";

export default function Connect2Hobbi() {
	return(
		<>
		<Seo
			title={`Hobbi.me | Conecta para continuar`}
			description={"Reinventa la forma de socializar y se el dueño de tú información en internet."}
			type={"webapp"}
			name={"Hobbi"}
			rel={"https://hobbi.me/connect"}
		/>
		<div className="flex flex-col w-full overflow-hidden relative">
			{/* Background Image */}
			<section className="flex-grow">
			<div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
				<div className="left-1/2 -translate-x-1/2 bottom-0">
					<img src={Illustration} className="max-w-none" width={2146} alt="Hero Illustration" />
				</div>
			</div>
			<div className="relative min-h-screen flex items-center justify-center flex-col">
				<div className="flex flex-col items-center justify-center space-y-4">
					<h1 className="h1 bg-clip-text text-transparent bg-gradient-to-r from-slate-900/60 via-slate-800 to-slate-700/60 pb-4">Conéctate para continuar</h1>
					<p className="font-light text-xl">Utilizando <strong className="text-purple-800">Internet Identity</strong> puedes acceder a esta y a todas las aplicaciones en el ecosistema de ICP.</p>
				</div>
				<div className="relative w-full flex items-center justify-center mt-10">
					<CustomConnectButton />
				</div>
			</div>
			</section>
		</div>
		</>
	)
}