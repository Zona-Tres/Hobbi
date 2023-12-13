import React from 'react'
import Particles from './Particles'
import Illustration from '/images/glow-bottom.svg'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

        { /* Particles animation */}
        <Particles className="absolute inset-0 z-10" />

        { /* Illustration */}
        <div className="absolute inset-0 -mx-28 rounded-b-[3rem] pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
            <img src={Illustration} className="max-w-none" width={2146} alt="Hero Illustration" />
            {/* <div className='bg-slate-900 w-full h-64'></div> */}
          </div>
        </div>

        <div className="pt-32 pb-16 md:pt-52 md:pb-32">

          { /* Hero content */}
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 bg-clip-text text-transparent bg-gradient-to-r from-slate-900/60 via-slate-800 to-slate-700/60 pb-4" data-aos="fade-down">Hobbi, la plataforma <br /> social web3</h1>
            <h4 className="h4 font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900/60 via-slate-800 to-slate-700/60 mb-8" data-aos="fade-down" data-aos-delay="200">Reinventa la forma de socializar <br /> y se el dueño de tú información en internet.</h4>
            <div className="mb-6 mt-14" data-aos="fade-down">
              <div className="inline-flex relative before:absolute before:inset-0 before:bg-purple-500 before:blur-md">
                {/* <a className="btn-sm p-4 w-56 text-slate-300 hover:text-white transition duration-150 ease-in-out group [background:linear-gradient(theme(colors.purple.500),_theme(colors.purple.500))_padding-box,_linear-gradient(theme(colors.purple.500),_theme(colors.purple.200)_75%,_theme(colors.transparent)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/50 before:rounded-full before:pointer-events-none shadow" href="#0">
                  <span className="relative inline-flex items-center text-xl">
                    Coming soon!
                  </span>
                </a> */}
                <Link to={'/connect'}>
                <div className="btn-sm px-4 py-2 w-56 cursor-pointer text-slate-300 hover:text-white transition duration-150 ease-in-out group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none">
                  <span className="relative inline-flex items-center text-xl">
                    <svg className="shrink-0 fill-slate-300 mr-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                      <path d="m1.999 0 1 2-1 2 2-1 2 1-1-2 1-2-2 1zM11.999 0l1 2-1 2 2-1 2 1-1-2 1-2-2 1zM11.999 10l1 2-1 2 2-1 2 1-1-2 1-2-2 1zM6.292 7.586l2.646-2.647L11.06 7.06 8.413 9.707zM0 13.878l5.586-5.586 2.122 2.121L2.12 16z" />
                    </svg>
                    Conectáte!
                  </span>
                </div>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}