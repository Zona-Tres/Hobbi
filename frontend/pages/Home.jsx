import React, { useEffect } from 'react'

import AOS from 'aos'
import 'aos/dist/aos.css'
import Header from '../components/ui/Header'
import Hero from '../components/Hero'
import Pricing from '../components/Pricing'
import Features from '../components/Features'
import Features02 from '../components/Features02'
import Cta from '../components/Cta'
import Footer from '../components/ui/Footer'

export default function Home() {
    useEffect(() => {
        AOS.init({
          once: true,
          disable: 'phone',
          duration: 1000,
          easing: 'ease-out-cubic',
        })
    })

    return (
        <div className='antialiased bg-slate-100 text-slate-900 tracking-tight'>
            <div className="flex flex-col min-h-screen overflow-hidden">
                <Header />
                <main className="grow">
                    <Hero />
                    <Pricing />
                    <Features />
                    <Features02 />
                    <Cta />
                </main>
                <Footer />
            </div>
        </div>
    )
}