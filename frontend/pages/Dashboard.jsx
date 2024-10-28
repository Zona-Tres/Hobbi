import React, { useEffect, useRef, useState } from "react"
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from "@dfinity/principal"
import { arrayBufferToImgSrc } from "../utils/image"
import LogoDark from "../components/ui/LogoDark"
import portada from "/images/portada.svg"
import CustomConnectButton from "../components/ui/CustomConnectButton"
import { useNavigate, useParams } from "react-router-dom"
import { Seo } from "../components/utils/seo"

export default function Dashboard() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [nft] = useCanister("nft")
  const [post] = useCanister("post")
  const { principal } = useConnect()

  const firstLoad = useRef(true)
  const [nftMetadata, setNftMetadata] = useState({})
  const [loading, setLoading] = useState(false)
  const [postList, setPostList] = useState([])
  const [selected, setSelected] = useState(1)

  useEffect(() => {
    setLoading(true)
  }, [])

  const handleClick = (url, index) => {
    setSelected(index)
    navigate(url)
  }

  return (
    <>
      <Seo
        title={`Hobbi.me | Cargando perfil`}
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
          <div className="w-[266px] h-[148px] rounded-[16px] bg-[#0E1425] mt-5 ml-5 p-8">
            <span className="text-md font-bold text-[#B577F7]">
              @Corpuzville
            </span>
            <div className="flex gap-3 mt-3">
              <div className="flex flex-col gap-1">
                <span className="text-[16px] font-bold text-[#E1C9FB]">
                  123K
                </span>
                <span className="text-[10px] font-normal text-[#E1C9FB]">
                  Follower
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[16px] font-bold text-[#E1C9FB]">
                  5.5M
                </span>
                <span className="text-[10px] font-normal text-[#E1C9FB]">
                  Following
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[16px] font-bold text-[#E1C9FB]">
                  12K
                </span>
                <span className="text-[10px] font-normal text-[#E1C9FB]">
                  Post
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 ml-5 mt-8">
            <div
              className="flex gap-4 hover:cursor-pointer"
              onClick={() => handleClick("/inicio", 1)}
            >
              <div
                className={`flex items-center justify-center h-6 w-6 rounded-md ${
                  selected === 1 ? "bg-[#B577F7]" : "bg-[#0E1425]"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.6875 8.00012L7.40338 1.28424C7.73288 0.954733 8.26712 0.954733 8.59662 1.28424L15.3125 8.00012M2.375 6.31262V13.9064C2.375 14.3724 2.75276 14.7501 3.21875 14.7501H6.3125V11.0939C6.3125 10.6279 6.69026 10.2501 7.15625 10.2501H8.84375C9.30974 10.2501 9.6875 10.6279 9.6875 11.0939V14.7501H12.7812C13.2472 14.7501 13.625 14.3724 13.625 13.9064V6.31262M5.1875 14.7501H11.375"
                    stroke={selected === 1 ? "#F7EFFF" : "#505CE6"}
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                className={`text-base font-bold ${
                  selected === 1 ? "text-[#B577F7]" : "text-[#505CE6]"
                }`}
              >
                Inicio
              </span>
            </div>

            <div
              className="flex gap-4 hover:cursor-pointer"
              onClick={() => handleClick("/comunidades", 2)}
            >
              <div
                className={`flex items-center justify-center h-6 w-6 rounded-md ${
                  selected === 2 ? "bg-[#B577F7]" : "bg-[#0E1425]"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.6875 8.00012L7.40338 1.28424C7.73288 0.954733 8.26712 0.954733 8.59662 1.28424L15.3125 8.00012M2.375 6.31262V13.9064C2.375 14.3724 2.75276 14.7501 3.21875 14.7501H6.3125V11.0939C6.3125 10.6279 6.69026 10.2501 7.15625 10.2501H8.84375C9.30974 10.2501 9.6875 10.6279 9.6875 11.0939V14.7501H12.7812C13.2472 14.7501 13.625 14.3724 13.625 13.9064V6.31262M5.1875 14.7501H11.375"
                    stroke={selected === 2 ? "#B577F7" : "#505CE6"}
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                className={`text-base font-bold ${
                  selected === 2 ? "text-[#B577F7]" : "text-[#505CE6]"
                }`}
              >
                Comunidades
              </span>
            </div>

            <div
              className="flex gap-4 hover:cursor-pointer"
              onClick={() => handleClick("/friends", 3)}
            >
              <div
                className={`flex items-center justify-center h-6 w-6 rounded-md ${
                  selected === 3 ? "bg-[#B577F7]" : "bg-[#0E1425]"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.6875 8.00012L7.40338 1.28424C7.73288 0.954733 8.26712 0.954733 8.59662 1.28424L15.3125 8.00012M2.375 6.31262V13.9064C2.375 14.3724 2.75276 14.7501 3.21875 14.7501H6.3125V11.0939C6.3125 10.6279 6.69026 10.2501 7.15625 10.2501H8.84375C9.30974 10.2501 9.6875 10.6279 9.6875 11.0939V14.7501H12.7812C13.2472 14.7501 13.625 14.3724 13.625 13.9064V6.31262M5.1875 14.7501H11.375"
                    stroke={selected === 3 ? "#B577F7" : "#505CE6"}
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                className={`text-base font-bold ${
                  selected === 3 ? "text-[#B577F7]" : "text-[#505CE6]"
                }`}
              >
                Amigos
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col py-24 px-8">
          <div className="h-[214px] rounded-3xl w-full">
            <img src={portada} alt="Portada" />
          </div>
          <div className="flex py-7 pl-36">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#36115E]">
                Corpuzville
              </span>
              <span className="text-sm font-medium text-[#B577F7] mt-2">
                120 Seguidos
                <span className="text-sm font-medium text-[#B577F7] ml-4">
                  234 Seguidores
                </span>
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-[#FDFCFF] w-1/2">
            🎮 Estilo de juego: Estratega nato, me encanta liderar escuadrones y
            crear tácticas de equipo. Siempre buscando mejorar y aprender nuevas
            estrategias. 💬 Disponibilidad: Juego todas las noches y el fin de
            semana. 📡 Conéctate: Sígueme en Twitch para ver gameplays épicos y
            análisis en vivo.
          </p>
          <div className="flex h-20 items-center bg-[#B577F7] rounded-2xl px-3 w-1/2 mt-5">
            <div className="flex items-center bg-[#FDFCFF] rounded-lg px-2 py-1 h-12  w-full">
              <div
                className="h-6 w-6 rounded-full bg-gray-300 mr-2"
                style={{ width: "24px", height: "24px" }}
              ></div>

              <input
                type="text"
                placeholder="Comparte con nosotros"
                className="flex-grow bg-transparent focus:outline-none text-gray-700"
              />

              <div className="ml-2 hover:cursor-pointer">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.47779 2.40479C3.21306 2.32789 2.92747 2.40242 2.73407 2.59889C2.54068 2.79536 2.47066 3.08209 2.55174 3.34558L4.98402 11.2505H13.4998C13.914 11.2505 14.2498 11.5863 14.2498 12.0005C14.2498 12.4147 13.914 12.7505 13.4998 12.7505H4.98403L2.55183 20.6551C2.47076 20.9186 2.54077 21.2054 2.73417 21.4018C2.92756 21.5983 3.21315 21.6728 3.47789 21.5959C10.1765 19.6499 16.3972 16.5819 21.923 12.6092C22.119 12.4683 22.2352 12.2416 22.2352 12.0002C22.2352 11.7588 22.119 11.5322 21.923 11.3913C16.3971 7.41866 10.1764 4.3507 3.47779 2.40479Z"
                    fill="#B577F7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <CustomConnectButton />
        </div>
      </div>
    </>
  )
}