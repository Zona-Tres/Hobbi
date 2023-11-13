import React from 'react'
import LogoImg from '/images/hobbi-logo.png'
import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to="/" className="block" aria-label="LZ3">
      <img src={LogoImg} width={50} height={50} alt="Hobbi" />
    </Link>
  )
}