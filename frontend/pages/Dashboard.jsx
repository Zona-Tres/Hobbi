import React, { useEffect, useRef, useState, useCallback } from "react"
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from "@dfinity/principal"
import LogoDark from "/frontend/components/ui/LogoDark"
import portada from "/images/portada.svg"
import CustomConnectButton from "/frontend/components/ui/CustomConnectButton"
import { useNavigate, useParams } from "react-router-dom"
import { Seo } from "/frontend/components/utils/seo"
import useStore from "/frontend/store/useStore"
import createBucketActor from "/frontend/hooks/createBucketActor"
import Avatar from "/frontend/components/Avatar"
import SearchAndPost from "/frontend/components/SearchAndPost"
import SearchDialog from "/frontend/components/SearchDialog"
import Hashtag from "/frontend/components/hashtag"
import Navigation from "/frontend/components/Navigation"
import { compressAndConvertImage, blobToImageUrl } from "/frontend/utils/imageManager"
import { withDataRefresh } from "/frontend/components/utils/withDataRefresh"
import PostPreview from "/frontend/components/PostPreview"
import PostExpand from "/frontend/components/PostExpand"

export default withDataRefresh(function Dashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const observer = useRef()

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
  const [selected, setSelected] = useState(1)
  const [bucketActor, setBucketActor] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState(1)
  const [textArea, setTextArea] = useState("")
  const [uploadedImageData, setUploadedImageData] = useState({
    preview: null,
    full: null,
  })
  const [currentPage, setCurrentPage] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [isloading, setIsloading] = useState(false)

  const [selectedPostDetails, setSelectedPostDetails] = useState(null)
  const [selectedPostAuthor, setSelectedPostAuthor] = useState(null)

  const handlePublicInfo = async (actor) => {
    try {
      const response = await actor.getMyInfo()
      if (response) {
        setCurrentPage(0)
        const responsePost = await actor.getPaginatePost({
          qtyPerPage: 25,
          page: currentPage,
        })
        setPostList(responsePost.arr)

        setHasNext(responsePost.hasNext)
        setMyInfo(response)
      }
    } catch {
      // Error silencioso
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const result = await hobbi.signIn()
        if (result.Ok) {
          if (result.Ok.name !== username) {
            setUsername(result.Ok.name)
          }

          const newCanisterId = result.Ok.userCanisterId.toText()
          setCanisterId(newCanisterId)

          const actor = await createBucketActor(newCanisterId)
          handlePublicInfo(actor)
        }
      } catch {
        // Error silencioso
      } finally {
        setLoading(false)
      }
    }

    if (firstLoad.current) {
      fetchData()
      firstLoad.current = false
    }
  }, [hobbi, setCanisterId, setUsername, username, canisterId])

  const loadMorePosts = async () => {
    if (!hasNext || loading) return
    setLoading(true)
    try {
      const userCanister = await createBucketActor(canisterId);
      const nextPage = currentPage + 1
      const response = await userCanister.getPaginatePost({
        qtyPerPage: 25,
        page: nextPage,
      })
      if (response) {
        setPostList((prev) => [...prev, ...response.arr])
        setHasNext(response.hasNext)
        setCurrentPage(nextPage)
      }
    } catch {
      // Error silencioso
    } finally {
      setLoading(false)
    }
  }

  const handleClick = (url, index) => {
    setSelected(index)
    navigate(url)
  }
  const mediaTypeMap = {
    1: "Book",
    2: "Tv",
    3: "Game",
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    setMedia(null)
    try {
      const imagePreview = await compressAndConvertImage(file, 8)
      const imageFull = await compressAndConvertImage(file, 600)
      setUploadedImageData({ preview: imagePreview, full: imageFull })
    } catch {
      // Error silencioso
    }
  }

  const handleCreatePost = async () => {
    const actor = await createBucketActor(canisterId)
    try {
      setIsloading(true)
      const hashtagRegex = /#(\w+)/g
      const hashtags = []
      let match
      let cleanedText = textArea

      while ((match = hashtagRegex.exec(textArea)) !== null) {
        hashtags.push(match[1])
      }
      cleanedText = textArea.replace(hashtagRegex, "").trim()
      setTextArea("")
      const json = {
        access: { Public: null },
        title: media ? media.title : "",
        body: cleanedText,
        image: uploadedImageData.full ? [uploadedImageData.full] : [],
        imagePreview: uploadedImageData.preview
        ? [uploadedImageData.preview]
        : [],
        hashTags: hashtags,
        image_url: media ? [media.image] : [],
        media_type: { [mediaTypeMap[selectedTheme]]: null },
      }
      
      const response = await actor.createPost(json)
      const responsePost = await actor.getPaginatePost({
        qtyPerPage: 25,
        page: 0,
      })
      setMedia(null)
      setPostList(responsePost.arr)
    } catch {
      // Error silencioso
    }
    finally{
      setIsloading(false)
    }
  }
  return (
    <>
      <Seo
        title={`Hobbi.me | Loading profile`}
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
            <img src={portada} alt="Portada" />
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
              <span className="text-xl font-bold text-[#FFFFFF]">
                {myinfo.name}
              </span>
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
          <div className="flex gap-3 items-center">
            <span className=" text-xl font-medium text-[#FDFCFF] ml-3">
              Topics
            </span>
            <div className="flex gap-4 mt-3 ml-3">
              <div
                onClick={() => setSelectedTheme(1)}
                className={`flex gap-4 items-center justify-center w-20 h-7 rounded-3xl cursor-pointer ${selectedTheme === 1
                    ? "bg-[#4F239E] text-[#FDFCFF]"
                    : "bg-[#FDFCFF] text-[#4F239E]"
                  }`}
              >
                Books
              </div>
              <div
                onClick={() => setSelectedTheme(2)}
                className={`flex gap-4 items-center justify-center w-24 h-7 rounded-3xl cursor-pointer ${selectedTheme === 2
                    ? "bg-[#4F239E] text-[#FDFCFF]"
                    : "bg-[#FDFCFF] text-[#4F239E]"
                  }`}
              >
                TV Shows
              </div>
              <div
                onClick={() => setSelectedTheme(3)}
                className={`flex gap-4 items-center justify-center w-28 h-7 rounded-3xl cursor-pointer ${selectedTheme === 3
                    ? "bg-[#4F239E] text-[#FDFCFF]"
                    : "bg-[#FDFCFF] text-[#4F239E]"
                  }`}
              >
                Video Games
              </div>
            </div>
          </div>
          <div className="flex flex-col min-h-20 gap-6 py-4 items-center bg-[#B577F7] rounded-2xl px-3 w-full mt-5 ml-3">
            <SearchDialog
              isOpened={true}
              setMedia={setMedia}
              mediaType={selectedTheme}
            />
            {media && (
              <div className="flex justify-start w-full gap-3">
                <div className="rounded-xl">
                  <img src={media.image} width="30px" />
                </div>
                <div className="flex flex-col justify-start items-start gap-3">
                  <span className="text-xl font-bold text-[#FFFFFF]">
                    {media.title}
                  </span>
                  <span className="text-lg font-medium text-[#FFFFFF]">
                    {media.sub}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center bg-[#FDFCFF] rounded-lg px-2 py-1 h-12  w-full">
              <Avatar avatarData={myinfo.avatar} size="small" />
              <label className="ml-2 p-2 rounded-full hover:bg-gray-100 cursor-pointer hover:opacity-80 transition-transform duration-200">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                />
                <svg
                  width="40"
                  height="22"
                  viewBox="0 0 32 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1"
                    y="1"
                    width="36"
                    height="24"
                    rx="3"
                    ry="3"
                    fill="#aa60aa"
                  />
                  <circle cx="22" cy="6" r="3.5" fill="#ffffff" />
                  <path d="M2 22h28L21 8l-5 6-4-5-10 13z" fill="#ffffff" />
                </svg>
              </label>

              <textArea
                type="text"
                value={textArea}
                onChange={(e) => setTextArea(e.target.value)}
                placeholder="Share with us"
                className="flex-grow bg-transparent focus:outline-none text-gray-700 pl-2"
              />
              {textArea !== "" && (
                <div
                  className="ml-2 hover:cursor-pointer"
                  onClick={() => !isloading && handleCreatePost()}
                >
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
              )}
            </div>
          </div>
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
