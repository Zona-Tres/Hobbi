import React, { useEffect, useRef, useState } from "react"
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from "@dfinity/principal"
import { arrayBufferToImgSrc } from "../utils/image"
import LogoDark from "../components/ui/LogoDark"
import portada from "/images/portada.svg"
import CustomConnectButton from "../components/ui/CustomConnectButton"
import { useNavigate, useParams } from "react-router-dom"
import { Seo } from "../components/utils/seo"
import useStore from "../store/useStore"
import crearActorParaBucket from "../hooks/crearActorParaBucket"

export default function Friends() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [nft] = useCanister("nft")
  const [post] = useCanister("post")
  const { principal } = useConnect()
  const setCanisterId = useStore((state) => state.setCanisterId)
    const setUsername = useStore((state) => state.setUsername)
    const setMyInfo = useStore((state) => state.setMyInfo)
    const canisterId = useStore((state) => state.canisterId)
    const username = useStore((state) => state.username)
    const myinfo = useStore((state) => state.myinfo)
  const firstLoad = useRef(true);
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
  const handleFollowers = async (actor) => {
    try {
        const response = await actor.getFollowersPreview()
        if (response) {
            setMyInfo(response)
        }
    } catch (e) {
        console.error(e)
    }
}
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);

        try {
            const actor = await crearActorParaBucket(canisterId);
            handleFollowers(actor);

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (firstLoad.current) {
        fetchData()
        firstLoad.current = false
    }
}, [ setCanisterId, setUsername, username, canisterId])
console.log(username,myinfo,canisterId)
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
              @{username}
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
              onClick={() => handleClick("/amigos", 3)}
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
        <div className="flex flex-col px-7 py-11 ">
          <span className="text-xl font-bold text-[#FDFCFF]">Contactos</span>
          <div className="flex flex-wrap p-5 gap-7 ">
            <div className="flex flex-col w-40 h-52 bg-[#0E1425] rounded-2xl items-center">
              <span className="text-base font-bold text-[#E1C9FB] mt-6">
                @user_name
              </span>
              <span className="text-sm font-medium text-[#B577F7] mt-1">
                124K Followers
              </span>
              <span className="text-xs font-medium text-[#FE8F28] mt-4">
                2 publicaciones nuevas
              </span>
              <button
                type="submit"
                className="h-7 w-16 flex items-center justify-center rounded-[4px] bg-[#B577F7] hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out mt-4"
              >
                <span className="text-sm font-medium text-[#FDFCFF]">
                  Ver perfil
                </span>
              </button>
            </div>
            <div className="flex flex-col w-40 h-52 bg-[#0E1425] rounded-2xl items-center">
              <span className="text-base font-bold text-[#E1C9FB] mt-6">
                @user_name
              </span>
              <span className="text-sm font-medium text-[#B577F7] mt-1">
                124K Followers
              </span>
              <span className="text-xs font-medium text-[#FE8F28] mt-4">
                2 publicaciones nuevas
              </span>
              <button
                type="submit"
                className="h-7 w-16 flex items-center justify-center rounded-[4px] bg-[#B577F7] hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out mt-4"
              >
                <span className="text-sm font-medium text-[#FDFCFF]">
                  Ver perfil
                </span>
              </button>
            </div>
            <div className="flex flex-col w-40 h-52 bg-[#0E1425] rounded-2xl items-center">
              <span className="text-base font-bold text-[#E1C9FB] mt-6">
                @user_name
              </span>
              <span className="text-sm font-medium text-[#B577F7] mt-1">
                124K Followers
              </span>
              <span className="text-xs font-medium text-[#FE8F28] mt-4">
                2 publicaciones nuevas
              </span>
              <button
                type="submit"
                className="h-7 w-16 flex items-center justify-center rounded-[4px] bg-[#B577F7] hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out mt-4"
              >
                <span className="text-sm font-medium text-[#FDFCFF]">
                  Ver perfil
                </span>
              </button>
            </div>
            <div className="flex flex-col w-40 h-52 bg-[#0E1425] rounded-2xl items-center">
              <span className="text-base font-bold text-[#E1C9FB] mt-6">
                @user_name
              </span>
              <span className="text-sm font-medium text-[#B577F7] mt-1">
                124K Followers
              </span>
              <span className="text-xs font-medium text-[#FE8F28] mt-4">
                2 publicaciones nuevas
              </span>
              <button
                type="submit"
                className="h-7 w-16 flex items-center justify-center rounded-[4px] bg-[#B577F7] hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out mt-4"
              >
                <span className="text-sm font-medium text-[#FDFCFF]">
                  Ver perfil
                </span>
              </button>
            </div>
            <div className="flex flex-col w-40 h-52 bg-[#0E1425] rounded-2xl items-center">
              <span className="text-base font-bold text-[#E1C9FB] mt-6">
                @user_name
              </span>
              <span className="text-sm font-medium text-[#B577F7] mt-1">
                124K Followers
              </span>
              <span className="text-xs font-medium text-[#FE8F28] mt-4">
                2 publicaciones nuevas
              </span>
              <button
                type="submit"
                className="h-7 w-16 flex items-center justify-center rounded-[4px] bg-[#B577F7] hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out mt-4"
              >
                <span className="text-sm font-medium text-[#FDFCFF]">
                  Ver perfil
                </span>
              </button>
            </div>
            <div className="flex flex-col w-40 h-52 bg-[#0E1425] rounded-2xl items-center">
              <span className="text-base font-bold text-[#E1C9FB] mt-6">
                @user_name
              </span>
              <span className="text-sm font-medium text-[#B577F7] mt-1">
                124K Followers
              </span>
              <span className="text-xs font-medium text-[#FE8F28] mt-4">
                2 publicaciones nuevas
              </span>
              <button
                type="submit"
                className="h-7 w-16 flex items-center justify-center rounded-[4px] bg-[#B577F7] hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out mt-4"
              >
                <span className="text-sm font-medium text-[#FDFCFF]">
                  Ver perfil
                </span>
              </button>
            </div>
            <div className="flex flex-col w-40 h-52 bg-[#0E1425] rounded-2xl items-center">
              <span className="text-base font-bold text-[#E1C9FB] mt-6">
                @user_name
              </span>
              <span className="text-sm font-medium text-[#B577F7] mt-1">
                124K Followers
              </span>
              <span className="text-xs font-medium text-[#FE8F28] mt-4">
                2 publicaciones nuevas
              </span>
              <button
                type="submit"
                className="h-7 w-16 flex items-center justify-center rounded-[4px] bg-[#B577F7] hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out mt-4"
              >
                <span className="text-sm font-medium text-[#FDFCFF]">
                  Ver perfil
                </span>
              </button>
            </div>
            <div className="flex flex-col w-40 h-52 bg-[#0E1425] rounded-2xl items-center">
              <span className="text-base font-bold text-[#E1C9FB] mt-6">
                @user_name
              </span>
              <span className="text-sm font-medium text-[#B577F7] mt-1">
                124K Followers
              </span>
              <span className="text-xs font-medium text-[#FE8F28] mt-4">
                2 publicaciones nuevas
              </span>
              <button
                type="submit"
                className="h-7 w-16 flex items-center justify-center rounded-[4px] bg-[#B577F7] hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out mt-4"
              >
                <span className="text-sm font-medium text-[#FDFCFF]">
                  Ver perfil
                </span>
              </button>
            </div>
            <div className="flex flex-col w-40 h-52 bg-[#0E1425] rounded-2xl items-center">
              <span className="text-base font-bold text-[#E1C9FB] mt-6">
                @user_name
              </span>
              <span className="text-sm font-medium text-[#B577F7] mt-1">
                124K Followers
              </span>
              <span className="text-xs font-medium text-[#FE8F28] mt-4">
                2 publicaciones nuevas
              </span>
              <button
                type="submit"
                className="h-7 w-16 flex items-center justify-center rounded-[4px] bg-[#B577F7] hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out mt-4"
              >
                <span className="text-sm font-medium text-[#FDFCFF]">
                  Ver perfil
                </span>
              </button>
            </div>
            <div className="flex flex-col w-40 h-52 bg-[#0E1425] rounded-2xl items-center">
              <span className="text-base font-bold text-[#E1C9FB] mt-6">
                @user_name
              </span>
              <span className="text-sm font-medium text-[#B577F7] mt-1">
                124K Followers
              </span>
              <span className="text-xs font-medium text-[#FE8F28] mt-4">
                2 publicaciones nuevas
              </span>
              <button
                type="submit"
                className="h-7 w-16 flex items-center justify-center rounded-[4px] bg-[#B577F7] hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out mt-4"
              >
                <span className="text-sm font-medium text-[#FDFCFF]">
                  Ver perfil
                </span>
              </button>
            </div>
          </div>
          <CustomConnectButton />
        </div>
      </div>
    </>
  )
}
