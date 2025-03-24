import React, { useEffect } from "react"

import AOS from "aos"
import "aos/dist/aos.css"
import Header from "/frontend/components/ui/Header"
import Hero from "/frontend/components/Hero"
import Pricing from "/frontend/components/Pricing"
import Features from "/frontend/components/Features"
import Features02 from "/frontend/components/Features02"
import Cta from "/frontend/components/Cta"
import Footer from "/frontend/components/ui/Footer"

export default function Home() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 1000,
      easing: "ease-out-cubic",
    })
  })

  return (
    <div className="antialiased bg-slate-100 text-slate-900 tracking-tight">
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="grow">
          <Hero />
          {/*  <Pricing />
                    <Features />
                    <Features02 />
    <Cta />*/}
        </main>
        {/*<Footer />*/}
      </div>
    </div>
  )
}
