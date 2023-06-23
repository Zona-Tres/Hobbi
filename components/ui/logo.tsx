import Link from 'next/link'
import Image from 'next/image'
import LogoImg from '@/public/images/hobbi-logo.png'

export default function Logo() {
  return (
    <Link className="block" href="/" aria-label="LZ3">
      <Image src={LogoImg} width={50} height={50} priority alt="Hobbi" />
    </Link>
  )
}