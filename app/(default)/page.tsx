export const metadata = {
  title: 'Hobbi | Home',
  description: 'Page description',
}

import Hero from '@/components/hero'
import Features from '@/components/features'
import Features02 from '@/components/features-02'
import Pricing from '@/components/pricing'
import Cta from '@/components/cta'

export default function Home() {
  return (
    <>
      <Hero />
      <Pricing />
      <Features />
      <Features02 />
      <Cta />
    </>
  )
}
