import React, { useEffect, useRef, useState, useCallback } from "react"
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from "@dfinity/principal"
import LogoDark from "/frontend/components/ui/LogoDark"
import portada from "/images/portada.svg"
import CustomConnectButton from "/frontend/components/ui/CustomConnectButton"
import { useNavigate, useParams } from "react-router-dom"
import { Seo } from "/frontend/components/utils/seo"
import useStore from "/frontend/store/useStore"
import Avatar from "/frontend/components/Avatar"
import SearchAndPost from "/frontend/components/SearchAndPost"
import SearchDialog from "/frontend/components/SearchDialog"
import Hashtag from "/frontend/components/hashtag"
import Navigation from "/frontend/components/Navigation"
import createBucketActor from "/frontend/hooks/createBucketActor"
import { Principal as _principal } from "@dfinity/principal"
import { blobToImageUrl } from "/frontend/utils/imageManager"
import { withDataRefresh } from "/frontend/components/utils/withDataRefresh"
import PostPreview from "/frontend/components/PostPreview"
import PostExpand from "/frontend/components/PostExpand"

export default withDataRefresh(function ProfileInfo() {
  const { id } = useParams()
  const navigate = useNavigate()

  const setCanisterId = useStore((state) => state.setCanisterId)
  const setUsername = useStore((state) => state.setUsername)
  const setMyInfo = useStore((state) => state.setMyInfo)
  const canisterId = useStore((state) => state.canisterId)
  const username = useStore((state) => state.username)
  const myinfo = useStore((state) => state.myinfo)
  const [hobbi] = useCanister("hobbi")
  const { principal } = useConnect()
  const [media, setMedia] = useState(null)
  const [mediaType, setMediaType] = useState(1)
  const firstLoad = useRef(true)
  const [loading, setLoading] = useState(false)
  const [postList, setPostList] = useState([])
  const [bucketActor, setBucketActor] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState(1)
  const [textArea, setTextArea] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasNext, setHasNext] = useState(false)

  const [selectedPostDetails, setSelectedPostDetails] = useState(null)
  const [selectedPostAuthor, setSelectedPostAuthor ] = useState(null)

  const observer = useRef()

  const loadMorePosts = async () => {
    console.log("solicitando mas post")
    if (!hasNext || loading) return
    setLoading(true)
    try {
      const authorCanister = await createBucketActor(id);
      const nextPage = currentPage + 1
      const response = await authorCanister.getPaginatePost({
        qtyPerPage: 25,
        page: nextPage,
      })
      if (response) {
        setPostList((prev) => [...prev, ...response.arr])
        setHasNext(response.hasNext)
        setCurrentPage(nextPage)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          loadMorePosts()
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasNext],
  )

  const handlePublicInfo = async (actor) => {
    try {
      setIsLoading(true)
      const response = await actor.getPublicInfo()
      if (response) {
        const responsePost = await actor.getPaginatePost({
          qtyPerPage: 25,
          page: currentPage,
        })
        setPostList(responsePost.arr)
        setHasNext(responsePost.hasNext)
        setMyInfo(response.Ok)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }
  const handleFollowme = async () => {
    try {
      setIsLoading(true)
      const actor = await createBucketActor(id)
      const response = await actor.followMe()
      if (response) {
        setIsLoading(true)
        handlePublicInfo(actor)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }
  const handleUnFollowme = async () => {
    try {
      setIsLoading(true)
      const actor = await createBucketActor(id)
      const response = await actor.unFollowMe()
      if (response) {
        setIsLoading(true)
        handlePublicInfo(actor)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const actor = await createBucketActor(id)
        handlePublicInfo(actor)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    if (firstLoad.current) {
      fetchData()
      firstLoad.current = false
    }
  }, [hobbi, setCanisterId, setUsername, username, canisterId])

  const handleClick = (url, index) => {
    setSelected(index)
    navigate(url)
  }
  const mediaTypeMap = {
    1: "Book",
    2: "Tv",
    3: "Game",
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

      <div className="flex w-full bg-[#070A10] max-h-full min-h-screen">
        <div className="flex flex-col w-[300px] h-full border border-[#0E1425]">
          <div className="h-[86px] flex items-center justify-start pl-10">
            <LogoDark />
          </div>
          <CustomConnectButton />
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

        <div className="flex flex-col py-24 px-8">
          <div className="h-[214px] rounded-3xl w-full">
            {/* <img src={portada} alt="Portada" /> */}
            {myinfo.coverImage?.length > 0 ? (
              <img src={blobToImageUrl(myinfo.coverImage[0])} alt="Portada" />
            ) : (
              <img src={portada} alt="Portada" />
            )}
          </div>
          <div className="flex pt-7 pl-3 h-24">
            <div className="relative -top-14">
              <Avatar
                avatarData={myinfo.avatar}
                version="square"
                size="large"
              />
            </div>
            <div className="flex flex-col pl-5">
              <div className="flex justify-between">
                <span className="text-xl font-bold text-[#FFFFFF]">
                  {myinfo.name}
                </span>
                {myinfo.callerIsFollower ? (
                  <div
                    className={`flex justify-center items-center text-[#B577F7] border border-[#B577F7] h-8 w-20 rounded-lg ml-60 cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={!isLoading ? handleUnFollowme : null} // Deshabilita el clic si está cargando
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-t-[#B577F7] border-[#f3f3f3] rounded-full animate-spin"></div>
                    ) : (
                      "Following"
                    )}
                  </div>
                ) : (
                  <div
                    className={`flex justify-center items-center text-[#B577F7] border border-[#B577F7] h-8 w-20 rounded-lg ml-60 cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={!isLoading ? handleFollowme : null} // Deshabilita el clic si está cargando
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-t-[#B577F7] border-[#f3f3f3] rounded-full animate-spin"></div>
                    ) : (
                      "Follow"
                    )}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-[#B577F7] mt-2">
                {Number(myinfo.followeds)} Following
                <span className="text-sm font-medium text-[#B577F7] ml-4">
                  {Number(myinfo.followers)} Followers
                </span>
              </span>
            </div>
          </div>
          <span className="text-sm font-medium text-[#FDFCFF] w-1/2 ml-3 mb-3 ">
            {myinfo.bio}
          </span>
          {postList.length > 0 && (
            <div className={`relative ${selectedPostAuthor ? "pointer-events-none" : ""}`}>
              {postList.slice().reverse().map((post, index) => (
                <div
                  key={index}
                  ref={index === postList.length - 5 ? lastPostRef : null}
                  className="flex flex-col  bg-[#0E1425] rounded-2xl w-[70%] px-8 py-4 ml-3 mt-4 w-full"
                >
                  <PostPreview caller={canisterId}
                    key={index}
                    post={post}
                    setSelectedPostDetails={setSelectedPostDetails}
                    setSelectedPostAuthor={setSelectedPostAuthor}
                    community={null}
                  />
                </div>
              ))}
            </div>
          )}
          {selectedPostDetails &&
            <PostExpand
              caller={canisterId}
              postDetails={selectedPostDetails}
              postAuthor={selectedPostAuthor}
              onClose={() => {
                setSelectedPostDetails(null);
                setSelectedPostAuthor(null);
              }}
            />
          }
        </div>
      </div>
    </>
  )
})
