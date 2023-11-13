'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Particles from './particles'

import Client01 from '@/public/images/lz3-logo.png'
import Client02 from '@/public/images/icp-logo.png'

// Import Swiper
// import Swiper, { Autoplay } from 'swiper'
// import 'swiper/swiper.min.css'
// Swiper.use([Autoplay])

function Clients() {

  // useEffect(() => {
  //   const carousel = new Swiper('.clients-carousel', {
  //     slidesPerView: 'auto',
  //     spaceBetween: 64,
  //     centeredSlides: true,
  //     loop: true,
  //     speed: 500,
  //     noSwiping: true,
  //     noSwipingClass: 'swiper-slide',
  //     autoplay: {
  //       delay: 0,
  //       disableOnInteraction: true,
  //     },
  //   })
  // }, [])

  return (
    <section>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">

        { /* Particles animation */}
        <div className="absolute inset-0 max-w-6xl mx-auto px-4 sm:px-6">
          <Particles className="absolute inset-0 -z-10" quantity={5} />
        </div>

        <div className="py-12 md:py-16">
          <div className="flex items-center justify-center space-x-20">
            <Image src={Client01} alt="Client 01" width={150} />
            <Image src={Client02} alt="Client 02" width={450} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Clients;