import React, { useEffect, useRef, useState } from "react"
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from "@dfinity/principal"
import { arrayBufferToImgSrc } from "../utils/image"

import Illustration from "/images/glow-top.svg"
import LogoDark from "../components/ui/LogoDark"
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
        <div className="flex w-full bg-[#070A10] h-screen">
          <div className="flex flex-col w-[300px] h-full border border-[#0E1425]">
            <div className="h-[86px] flex items-center justify-start pl-10">
              <LogoDark />
            </div>
            <div className="w-[266px] h-[148px] rounded-[16px] bg-[#0E1425] mt-5 ml-5">
              <span className="text-sm">@Corpuzville</span>
              <div className="flex gap-3 mt-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[16px] font-bold color-[#121D2F]">
                    123K
                  </span>
                  <span className="text-[10px] font-normal color-[#121D2F]">
                    Follower
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[16px] font-bold color-[#121D2F]">
                    5.5M
                  </span>
                  <span className="text-[10px] font-normal color-[#121D2F]">
                    Following
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[16px] font-bold color-[#121D2F]">
                    12K
                  </span>
                  <span className="text-[10px] font-normal color-[#121D2F]">
                    Post
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 ml-5 mt-8">
              <div className="flex gap-4">
                <div className="flex items-center justify-center h-6 w-6 bg-[#0E1425] rounded-md">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.6875 8.00012L7.40338 1.28424C7.73288 0.954733 8.26712 0.954733 8.59662 1.28424L15.3125 8.00012M2.375 6.31262V13.9064C2.375 14.3724 2.75276 14.7501 3.21875 14.7501H6.3125V11.0939C6.3125 10.6279 6.69026 10.2501 7.15625 10.2501H8.84375C9.30974 10.2501 9.6875 10.6279 9.6875 11.0939V14.7501H12.7812C13.2472 14.7501 13.625 14.3724 13.625 13.9064V6.31262M5.1875 14.7501H11.375"
                      stroke="#505CE6"
                      stroke-width="1.125"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <span className="text-base font-bold text-[#505CE6]">
                  Inicio
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center h-6 w-6 bg-[#0E1425] rounded-md">
                  <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.5004 12.0394C12.686 12.0547 12.8738 12.0625 13.0634 12.0625C13.8496 12.0625 14.6045 11.9281 15.3062 11.6809C15.3109 11.6213 15.3134 11.5609 15.3134 11.5C15.3134 10.2574 14.306 9.25 13.0634 9.25C12.5926 9.25 12.1557 9.39455 11.7945 9.64167M12.5004 12.0394C12.5004 12.0471 12.5004 12.0548 12.5004 12.0625C12.5004 12.2312 12.4911 12.3978 12.473 12.5617C11.1555 13.3177 9.62843 13.75 8.00043 13.75C6.37242 13.75 4.84538 13.3177 3.52781 12.5617C3.50971 12.3978 3.50043 12.2312 3.50043 12.0625C3.50043 12.0548 3.50045 12.0471 3.50049 12.0394M12.5004 12.0394C12.4959 11.1569 12.2375 10.3346 11.7945 9.64167M11.7945 9.64167C10.995 8.39139 9.59453 7.5625 8.00043 7.5625C6.40652 7.5625 5.00617 8.39118 4.2067 9.64121M4.2067 9.64121C3.8456 9.39437 3.4089 9.25 2.93848 9.25C1.69584 9.25 0.688477 10.2574 0.688477 11.5C0.688477 11.5609 0.690897 11.6213 0.695646 11.6809C1.39737 11.9281 2.15223 12.0625 2.93848 12.0625C3.12773 12.0625 3.31517 12.0547 3.50049 12.0394M4.2067 9.64121C3.76346 10.3342 3.50491 11.1568 3.50049 12.0394M10.2504 3.0625C10.2504 4.30514 9.24307 5.3125 8.00043 5.3125C6.75779 5.3125 5.75043 4.30514 5.75043 3.0625C5.75043 1.81986 6.75779 0.8125 8.00043 0.8125C9.24307 0.8125 10.2504 1.81986 10.2504 3.0625ZM14.7504 5.3125C14.7504 6.24448 13.9949 7 13.0629 7C12.1309 7 11.3754 6.24448 11.3754 5.3125C11.3754 4.38052 12.1309 3.625 13.0629 3.625C13.9949 3.625 14.7504 4.38052 14.7504 5.3125ZM4.62543 5.3125C4.62543 6.24448 3.86991 7 2.93793 7C2.00595 7 1.25043 6.24448 1.25043 5.3125C1.25043 4.38052 2.00595 3.625 2.93793 3.625C3.86991 3.625 4.62543 4.38052 4.62543 5.3125Z"
                      stroke="#505CE6"
                      stroke-width="1.125"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <span className="text-base font-bold text-[#505CE6]">
                  Comunidades
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center h-6 w-6 bg-[#0E1425] rounded-md">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.25 13.3457C10.8747 13.5275 11.5353 13.625 12.2187 13.625C13.3278 13.625 14.3769 13.3682 15.3098 12.9109C15.3116 12.8679 15.3125 12.8247 15.3125 12.7812C15.3125 11.0726 13.9273 9.6875 12.2187 9.6875C11.1552 9.6875 10.217 10.2241 9.66018 11.0414M10.25 13.3457V13.3438C10.25 12.5091 10.0361 11.7244 9.66018 11.0414M10.25 13.3457C10.25 13.3724 10.2498 13.3991 10.2493 13.4257C8.85302 14.2664 7.21735 14.75 5.46875 14.75C3.72014 14.75 2.08448 14.2664 0.68819 13.4257C0.687732 13.3985 0.6875 13.3711 0.6875 13.3438C0.6875 10.7031 2.82814 8.5625 5.46875 8.5625C7.27469 8.5625 8.84677 9.56374 9.66018 11.0414M8 3.78125C8 5.17922 6.86672 6.3125 5.46875 6.3125C4.07078 6.3125 2.9375 5.17922 2.9375 3.78125C2.9375 2.38328 4.07078 1.25 5.46875 1.25C6.86672 1.25 8 2.38328 8 3.78125ZM14.1875 5.46875C14.1875 6.55606 13.3061 7.4375 12.2187 7.4375C11.1314 7.4375 10.25 6.55606 10.25 5.46875C10.25 4.38144 11.1314 3.5 12.2187 3.5C13.3061 3.5 14.1875 4.38144 14.1875 5.46875Z"
                      stroke="#505CE6"
                      stroke-width="1.125"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-base font-bold text-[#505CE6]">
                  Amigos
                </span>
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
          <div className="flex flex-column w-72 h-full p-6 box-border"></div>
        </div>
      </>
    </>
  )
}
