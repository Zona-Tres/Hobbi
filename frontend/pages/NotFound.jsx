import React from "react";
import Illustration from '/images/glow-bottom.svg'
import Logo from "../components/ui/Logo";

export default function NotFound() {
	return(
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
	)
}