import React from "react";
import Illustration from '/images/glow-bottom.svg'
import Logo from "../components/ui/Logo";
import { Seo } from "../components/utils/seo";

export default function NotFound() {
	return(
		<>
		<Seo
			title={`Hobbi.me | No encontrado`}
			description={"Reinventa la forma de socializar y se el dueño de tú información en internet."}
			type={"webapp"}
			name={"Hobbi"}
			rel={"https://hobbi.me/error"}
		/>
		<div className="flex flex-col w-full overflow-hidden relative">
			{/* Background Image */}
			<section className="flex-grow">
			<div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
				<div className="left-1/2 -translate-x-1/2 bottom-0">
					<img src={Illustration} className="max-w-none" width={2146} alt="Hero Illustration" />
				</div>
			</div>
			<div className="m-4">
				<Logo />
			</div>
			<div className="relative min-h-screen flex items-center justify-center flex-col">
				<div className="flex flex-col items-center justify-center space-y-4">
					<h1 className="h1 bg-clip-text text-transparent bg-gradient-to-r from-slate-900/60 via-slate-800 to-slate-700/60 pb-4">404</h1>
					<p className="font-light text-xl">La página o perfil que estás intentando acceder no existe</p>
				</div>
			</div>
			</section>
		</div>
		</>
	)
}