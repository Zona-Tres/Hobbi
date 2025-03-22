import React from "react"
import { Helmet } from "react-helmet-async"

export const SeoMarkup = () => {
  const structuredJSON = JSON.stringify({
    "@context": "http://schema.org",
    "@type": "Organization",
    name: "Hobbi",
    description: "Hobbi.me | La plataforma social Web3",
    url: "https://hobbi.me",
    logo: "https://hobbi.me/logo.png",
    address: {},
    sameAs: [],
  })

  return (
    <Helmet>
      <title>{`Hobbi.me | La plataforma social Web3`}</title>
      <link rel="canonical" href={`https://hobbi.me/`} />
      <meta
        name="description"
        content={`Hobbi.me | La plataforma social Web3`}
      />
      <meta property="og:type" content={`webapp`} />
      <meta property="og:title" content={`Hobbi`} />
      <meta
        property="og:description"
        content={`Hobbi.me | La plataforma social Web3`}
      />
      <meta name="twitter:creator" content={`DubSmart`} />
      <meta name="twitter:card" content={`webapp`} />
      <meta name="twitter:title" content={`Hobbi`} />
      <meta
        name="twitter:description"
        content={`Hobbi.me | La plataforma social Web3`}
      />
      <script className="structured-data-list" type="application/ld+json">
        {structuredJSON}
      </script>
    </Helmet>
  )
}
