import React, { useEffect } from "react"
import Particles from "./Particles"

import Client01 from "/images/lz3-logo.png"
import Client02 from "/images/icp-logo.png"
import Illustration from "/images/building.png"

// Import Swiper
import Swiper, { Autoplay } from "swiper"
import "swiper/swiper.min.css"
Swiper.use([Autoplay])

function Pricing() {
  useEffect(() => {
    const carousel = new Swiper(".clients-carousel", {
      slidesPerView: "auto",
      spaceBetween: 64,
      centeredSlides: true,
      loop: true,
      speed: 2000,
      noSwiping: true,
      noSwipingClass: "swiper-slide",
      autoplay: {
        delay: 0,
        disableOnInteraction: true,
      },
    })
  }, [])

  return (
    <section className="relative">
      <div className="absolute inset-0 max-w-6xl mx-auto px-4 sm:px-6">
        <Particles className="absolute inset-0 -z-10" quantity={20} />
      </div>
      {/* Radial gradient */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
        aria-hidden="true"
      >
        <div className="absolute flex items-center justify-center top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1/3 aspect-square">
          <div className="absolute inset-0 translate-z-0 bg-purple-500 rounded-full blur-[120px] opacity-50" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12">
          <div className="max-w-3xl mx-auto text-center pb-12">
            <div className="flex items-center justify-center my-10">
              <img src={Illustration} alt="building" />
            </div>
            <h2 className="h2 bg-clip-text text-transparent bg-gradient-to-r from-purple-800/90 via-slate-800 to-slate-900/80 pb-4">
              Apoyado por grandes proyectos
            </h2>
            <p className="text-xl font-bold mt-8 text-slate-700">
              Hobbi nace en Zona Tres, una comunidad de creadores en web3 en
              América Latina y está siendo construido con la tecnología y apoyo
              del ecosistema de Internet Computer.
            </p>
          </div>
        </div>
      </div>

      <div className="pb-16">
        <div className="overflow-hidden">
          {/* Carousel built with Swiper.js [https://swiperjs.com/] */}
          {/* * Custom styles in src/css/additional-styles/theme.scss */}
          <div className="clients-carousel swiper-container relative before:absolute before:inset-0 before:w-32 before:z-10 before:pointer-events-none before:bg-gradient-to-r before:from-purple-50 after:absolute after:inset-0 after:left-auto after:w-32 after:z-10 after:pointer-events-none after:bg-gradient-to-l after:from-purple-50">
            <div className="swiper-wrapper !ease-linear select-none items-center">
              {/* Carousel items */}
              <div className="swiper-slide w-auto">
                <img src={Client01} alt="Client 01" width={150} />
              </div>
              <div className="swiper-slide w-auto">
                <img src={Client02} alt="Client 02" width={450} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
