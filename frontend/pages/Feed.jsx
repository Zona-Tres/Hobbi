import React, { useEffect, useRef, useState } from "react"
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from "@dfinity/principal"
import { arrayBufferToImgSrc } from "../utils/image"

import Illustration from "/images/glow-top.svg"
import Logo from "../components/ui/Logo"
import LogoImg from "/logo.png"
import Particles from "../components/Particles"
import SearchAndPost from "../components/SearchAndPost"
import PostList from "../components/PostList"
import CustomConnectButton from "../components/ui/CustomConnectButton"
import { useNavigate, useParams } from "react-router-dom"
import { Seo } from "../components/utils/seo"

export default function Feed() {
  // Navigation
  const navigate = useNavigate()

  // Component's state
  const firstLoad = useRef(true)
  const [nftMetadata, setNftMetadata] = useState({})
  const [loading, setLoading] = useState(false)
  const [postList, setPostList] = useState([])

  return (
    <>
      <Seo
        title={`Hobbi.me | ${`Cargando perfil`}`}
        description={
          "Reinventa la forma de socializar y se el dueño de tú información en internet."
        }
        type={"webapp"}
        name={"Hobbi"}
        rel={"https://hobbi.me/profile"}
      />

      <>
        <Seo
          title={`Hobbi.me`}
          description={
            "Reinventa la forma de socializar y se el dueño de tú información en internet."
          }
          type={"webapp"}
          name={"Hobbi"}
          rel={"https://hobbi.me/profile"}
        />
        <div className="flex w-full bg-white p-6 box-border">
          {/* Background Image */}
          <div className="flex flex-col w-72 h-full">
            <Logo />
            <div className="w-[266px] h-[148px] rounded-[16px] bg-[#F7EFFF] my-2 p-2">
                <span className="text-sm">@Corpuzville</span>
                <div className="flex gap-3 mt-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-[16px] font-bold color-[#121D2F]">123K</span>
                        <span className="text-[10px] font-normal color-[#121D2F]">Follower</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[16px] font-bold color-[#121D2F]">5.5M</span>
                        <span className="text-[10px] font-normal color-[#121D2F]">Following</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[16px] font-bold color-[#121D2F]">12K</span>
                        <span className="text-[10px] font-normal color-[#121D2F]">Post</span>
                    </div>
                </div>

            </div>
          </div>

          <section className="flex-grow">
            <div className="relative flex flex-row items-center justify-between w-full h-20 px-4 bg-gradient-to-br from-slate-200 via-slate-200/60 to-slate-200/20">
              <div className="flex flex-row space-x-4 items-center">
                <h1 className="font-bold text-2xl text-slate-900"> profile</h1>
              </div>
              <CustomConnectButton />
            </div>
            <div className="relative flex flex-row p-4 space-x-8">
              {/* Left side */}
              <div className="space-y-4">
                <div className="text-center w-56 bg-slate-900 rounded-2xl p-4 flex-grow">
                  <p className="text-white font-medium">hola</p>
                  <p className="text-white font-light">adios</p>
                </div>
              </div>
            </div>
          </section>
          <div className="flex flex-column w-72 h-full p-6 box-border">
            <Logo />
          </div>
        </div>
      </>
    </>
  )
}
