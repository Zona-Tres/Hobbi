import React, { useEffect, useRef, useState } from "react"
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from "@dfinity/principal"
import { blobToImageUrl } from "../utils/imageManager"
import LogoDark from "../components/ui/LogoDark"
import portada from "/images/portada.svg"
import CustomConnectButton from "../components/ui/CustomConnectButton"
import { useNavigate, useParams } from "react-router-dom"
import { Seo } from "../components/utils/seo"
import useStore from "../store/useStore"
import Avatar from "../components/Avatar"
import SearchAndPost from "../components/SearchAndPost"
import SearchDialog from "../components/SearchDialog"
import Hashtag from "../components/hashtag"
import Navigation from "../components/Navigation"
import createBucketActor from "../hooks/createBucketActor"
import { withDataRefresh } from "../components/utils/withDataRefresh"
import { toast } from "react-toastify"

function Friends() {
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
  const firstLoad = useRef(true)
  const [nftMetadata, setNftMetadata] = useState({})
  const [hobbi] = useCanister("hobbi")
  const [loading, setLoading] = useState(false)
  const [followers, setFollowers] = useState([])
  const [followeds, setFolloweds] = useState([])
  const [selected, setSelected] = useState(1)
  const [activeTab, setActiveTab] = useState("followers")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (hobbi && canisterId) {
          const actor = await createBucketActor(canisterId)
          await Promise.all([
            handleFollowers(actor),
            handleFolloweds(actor)
          ])
        }
      } catch (error) {
        toast.error("An error occurred while loading friends data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [hobbi, canisterId])

  const handleClick = (url, index) => {
    setSelected(index)
    navigate(url)
  }
  const handleFollowers = async (actor) => {
    try {
      const response = await actor.getFollowersPreview()
      if (response) {
        setFollowers(response)
      }
    } catch {
      // Error silencioso
    }
  }
  const handleFolloweds = async (actor) => {
    try {
      const response = await actor.getFollowedsPreview()
      if (response) {
        setFolloweds(response)
      }
    } catch {
      // Error silencioso
    }
  }
  const handlePublicInfo = async (actor) => {
    try {
      const response = await actor.getMyInfo()
      if (response) {
        setMyInfo(response)
      }
    } catch {
      // Error silencioso
    }
  }

  return (
    <>
      <Seo
        title={`Hobbi.me | Profile`}
        description={
          "Reinvent the way you socialize and own your information on the internet."
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
          <div className="w-[266px] h-[148px] rounded-[16px] bg-[#0E1425] mt-5 ml-5 px-8 py-5">
            <div className="flex justify-start gap-4 items-center">
              <Avatar avatarData={myinfo.avatar} />
              <span className="text-md font-bold text-[#B577F7]">
                @{myinfo.name}
              </span>
            </div>
            <div className="flex gap-3 mt-3">
              <div className="flex flex-col gap-1">
                <span className="text-[16px] font-bold text-[#E1C9FB]">
                  {Number(myinfo.followers)}
                </span>
                <span className="text-[10px] font-normal text-[#E1C9FB]">
                  Follower
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[16px] font-bold text-[#E1C9FB]">
                  {Number(myinfo.followeds)}
                </span>
                <span className="text-[10px] font-normal text-[#E1C9FB]">
                  Following
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[16px] font-bold text-[#E1C9FB]">
                  {Number(myinfo.postQty)}
                </span>
                <span className="text-[10px] font-normal text-[#E1C9FB]">
                  Post
                </span>
              </div>
            </div>
          </div>
          <Navigation />
        </div>
        <div className="flex flex-col px-7 py-11 w-full ">
          <span className="text-xl font-bold text-[#FDFCFF]">Friends</span>
          <div className="flex justify-center w-full flex-col items-center">
            {/* Tabs */}
            <div className=" w-60 flex gap-5 mb-5 mt-5 bg-[#121D2F] h-14 rounded-md px-5 items-center justify-center">
              <div
                className={`w-24 h-8 text-center cursor-pointer ${activeTab === "followers"
                    ? "bg-[#B577F7] text-white"
                    : "bg-[#121D2F] text-white"
                  } rounded-md`}
                onClick={() => setActiveTab("followers")}
              >
                Followers
              </div>
              <div
                className={`w-24 h-8 text-center cursor-pointer ${activeTab === "followeds"
                    ? "bg-[#B577F7] text-white"
                    : "bg-[#121D2F] text-white"
                  } rounded-md`}
                onClick={() => setActiveTab("followeds")}
              >
                Following
              </div>
            </div>

            <div className="flex flex-wrap gap-7">
              {activeTab === "followers" &&
                followers.length > 0 &&
                followers.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col w-40 h-52 bg-[#0E1425] rounded-2xl items-center"
                  >
                    <Avatar avatarData={item.thumbnail} />
                    <span className="text-base font-bold text-[#E1C9FB] mt-6">
                      @{item.name}
                    </span>
                    <span className="text-sm font-medium text-[#B577F7] mt-1">
                      {Number(item.followers)} Followers
                    </span>
                    <span className="text-xs font-medium text-[#FE8F28] mt-4">
                      {Number(item.recentPosts)} new posts
                    </span>
                    <button
                      onClick={() =>
                        (window.location.href = `/profile/${item.userCanisterId.toText()}`)
                      }
                      className="cursor-pointer h-7 w-30 flex items-center justify-center rounded-[4px] bg-[#B577F7] hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out mt-4 px-2"
                    >
                      <span className="text-sm font-medium text-[#FDFCFF]">
                        View profile
                      </span>
                    </button>
                  </div>
                ))}

              {activeTab === "followeds" &&
                followeds.length > 0 &&
                followeds.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col w-40 h-60 bg-[#0E1425] rounded-2xl items-center"
                  >

                    <div className="h-30 mt-2">
                      {/* <Avatar avatarData={item.thumbnail}/> */}
                      {item.thumbnail.length > 0 ?
                        <img src={blobToImageUrl(item.thumbnail[0])} className="h-[60px] w-[60px] rounded-full"></img> :
                        <svg width="60px" height="60px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#494c4e" d="M9 0a9 9 0 0 0-9 9 8.654 8.654 0 0 0 .05.92 9 9 0 0 0 17.9 0A8.654 8.654 0 0 0 18 9a9 9 0 0 0-9-9zm5.42 13.42c-.01 0-.06.08-.07.08a6.975 6.975 0 0 1-10.7 0c-.01 0-.06-.08-.07-.08a.512.512 0 0 1-.09-.27.522.522 0 0 1 .34-.48c.74-.25 1.45-.49 1.65-.54a.16.16 0 0 1 .03-.13.49.49 0 0 1 .43-.36l1.27-.1a2.077 2.077 0 0 0-.19-.79v-.01a2.814 2.814 0 0 0-.45-.78 3.83 3.83 0 0 1-.79-2.38A3.38 3.38 0 0 1 8.88 4h.24a3.38 3.38 0 0 1 3.1 3.58 3.83 3.83 0 0 1-.79 2.38 2.814 2.814 0 0 0-.45.78v.01a2.077 2.077 0 0 0-.19.79l1.27.1a.49.49 0 0 1 .43.36.16.16 0 0 1 .03.13c.2.05.91.29 1.65.54a.49.49 0 0 1 .25.75z" />
                        </svg>
                      }
                    </div>
                    <span className="text-base font-bold text-[#E1C9FB] mt-10">
                      @{item.name}
                    </span>
                    <span className="text-sm font-medium text-[#B577F7] mt-1">
                      {Number(item.followers)} Followers
                    </span>
                    <span className="text-xs font-medium text-[#FE8F28] mt-4">
                      {Number(item.recentPosts)} new posts
                    </span>
                    <button
                      onClick={() =>
                        (window.location.href = `/profile/${item.userCanisterId.toText()}`)
                      }
                      className="cursor-pointer h-7 w-24 flex items-center justify-center rounded-[4px] bg-[#B577F7] hover:bg-[#9D5FE0] transition-colors duration-150 ease-in-out mt-4 px-2"
                    >
                      <span className="text-sm font-medium text-[#FDFCFF]">
                        View profile
                      </span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <CustomConnectButton />
        </div>
      </div>
    </>
  )
}

export default withDataRefresh(Friends)
