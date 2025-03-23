import React, { useEffect, useRef, useState, useCallback } from "react"
import { useCanister, useConnect } from "@connect2ic/react"
import { Principal } from "@dfinity/principal"
import { toast } from "react-toastify"
import LogoDark from "/frontend/components/ui/LogoDark"
import CustomConnectButton from "/frontend/components/ui/CustomConnectButton"
import { useNavigate, useParams } from "react-router-dom"
import { Seo } from "/frontend/components/utils/seo"
import useStore from "/frontend/store/useStore"
import Avatar from "/frontend/components/Avatar"
import Navigation from "/frontend/components/Navigation"
import actorCommunity from "/frontend/hooks/actorCommunity"
import { blobToImageUrl, compressAndConvertImage } from "/frontend/utils/imageManager"
import SearchDialog from "/frontend/components/SearchDialog"
import PostPreview from "../components/PostPreview"
import PostExpand from "../components/PostExpand"

export default function CommunityInfo() {
  const { id } = useParams()
  const navigate = useNavigate()

  const setCanisterId = useStore((state) => state.setCanisterId)
  const setUsername = useStore((state) => state.setUsername)
  const setMyInfo = useStore((state) => state.setMyInfo)
  const canisterId = useStore((state) => state.canisterId)
  const username = useStore((state) => state.username)
  const myinfo = useStore((state) => state.myinfo)
  const [hobbi] = useCanister("hobbi")
  const firstLoad = useRef(true)
  const [loading, setLoading] = useState(false)
  const [communityInfo, setCommunityInfo] = useState(null)
  const [postList, setPostList] = useState([])
  const [selected, setSelected] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const [bucketActor, setBucketActor] = useState(null)
  const [media, setMedia] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState(1)
  const [textArea, setTextArea] = useState("")
  const [uploadedImageData, setUploadedImageData] = useState({
    preview: null,
    full: null,
  })

  const [selectedPostDetails, setSelectedPostDetails] = useState(null)
  const [selectedPostAuthor, setSelectedPostAuthor] = useState(null)

  const observer = useRef()

  const loadMorePosts = async () => {
    if (!hasNext || loading) return
    setLoading(true)
    try {
      const nextPage = currentPage + 1
      const actor = await actorCommunity(id)
      const response = await actor.getPaginatePosts({
        qtyPerPage: 25,
        page: nextPage,
      })
      if (response) {
        setPostList((prev) => [...prev, ...response.arr])
        setHasNext(response.hasNext)
        setCurrentPage(nextPage)
      }
    } catch (error) {
      toast.error("An error occurred while loading more posts")
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

  const handleCommunityInfo = async (actor) => {
    try {
      setIsLoading(true)
      const response = await actor.getCommunityInfo()
      if (response) {
        const responsePost = await actor.getPaginatePosts({
          qtyPerPage: 25,
          page: currentPage,
        })
        setPostList(responsePost.Ok.arr)
        setCommunityInfo(response.Ok)
        const memberStatus = await actor.iAmMember()
        setIsMember(memberStatus || false)
      }
    } catch (error) {
      toast.error("An error occurred while loading community information")
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinCommunity = async () => {
    try {
      setIsLoading(true)
      const actor = await actorCommunity(id)
      const response = await actor.joinCommunity()
      if (response.Ok) {
        setIsMember(true)
        await handleCommunityInfo(actor)
      }
    } catch {
      toast.error("An error occurred while joining the community")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeaveCommunity = async () => {
    try {
      setIsLoading(true)
      const actor = await actorCommunity(id)
      const response = await actor.leaveCommunity()
      if (response) {
        setIsMember(false)
        await handleCommunityInfo(actor)
      }
    } catch {
      toast.error("An error occurred while leaving the community")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    setMedia(null)
    try {
      const imagePreview = await compressAndConvertImage(file, 8)
      const imageFull = await compressAndConvertImage(file, 600, 1000, 1000)
      setUploadedImageData({ preview: imagePreview, full: imageFull })
    } catch {
      toast.error("An error occurred while processing the image")
    }
  }

  const mediaTypeMap = {
    1: "Book",
    2: "Tv",
    3: "Game",
  }

  const handleCreatePost = async () => {
    try {
      setIsLoading(true)
      const actor = await actorCommunity(id)
      const hashtagRegex = /#(\w+)/g
      const hashtags = []
      let match
      let cleanedText = textArea

      while ((match = hashtagRegex.exec(textArea)) !== null) {
        hashtags.push(match[1])
      }
      cleanedText = textArea.replace(hashtagRegex, "").trim()

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
      if (response.Ok) {
        setCurrentPage(0)
        const responsePost = await actor.getPaginatePosts({
          qtyPerPage: 25,
          page: currentPage,
        })
        setPostList(responsePost.Ok?.arr)
        setMedia(null)
        setTextArea("")
        toast.success("Post created successfully!")
      }
    } catch (error) {
      toast.error("An error occurred while creating the post")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actor = await actorCommunity(id)
        await handleCommunityInfo(actor)
      } catch (error) {
        toast.error("An error occurred while loading community data")
      } finally {
        setLoading(false)
      }
    }

    if (firstLoad.current) {
      fetchData()
      firstLoad.current = false
    }
  }, [id])

  return (
    <>
      <Seo
        title={`Hobbi.me | Community`}
        description="Join and participate in our vibrant communities"
        type="webapp"
        name="Hobbi"
        rel="https://hobbi.me/community"
      />

      <div className="flex w-full bg-[#070A10] h-screen">
        <div className="flex flex-col w-[300px] h-full border border-[#0E1425]">
          <div className="h-[86px] flex items-center justify-start pl-10">
            <LogoDark />
          </div>
          <CustomConnectButton />
          {myinfo.name && (
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
          )}
          <Navigation />
        </div>

        <div className="flex flex-col py-16 px-8 w-full">
          <div className="flex pt-7 pl-3 h-24">
            <div className="relative -top-14">
              <div className="w-32 h-32 rounded-2xl overflow-hidden">
                <img
                  src={blobToImageUrl(communityInfo?.logo)}
                  alt={communityInfo?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col pl-5">
              <div className="flex justify-between">
                <span className="text-xl font-bold text-[#FFFFFF]">
                  {communityInfo?.name}
                </span>
                <button
                  onClick={
                    isMember ? handleLeaveCommunity : handleJoinCommunity
                  }
                  className={`flex justify-center items-center text-[#B577F7] border border-[#B577F7] h-8 w-20 rounded-lg ml-60 cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-t-[#B577F7] border-[#f3f3f3] rounded-full animate-spin"></div>
                  ) : isMember ? (
                    "Leave"
                  ) : (
                    "Join"
                  )}
                </button>
              </div>
              <span className="text-sm font-medium text-[#B577F7] mt-2">
                {String(communityInfo?.membersQty).replace("n", "")} members
              </span>
            </div>
          </div>
          <span className="text-sm font-medium text-[#FDFCFF] w-1/2 ml-3 my-3">
            {communityInfo?.description}
          </span>

          <div className="flex gap-3 items-center">
            <span className="text-xl font-medium text-[#FDFCFF] ml-3">
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

          {isMember && (
            <div className="flex flex-col min-h-20 gap-6 py-4 items-center bg-[#B577F7] rounded-2xl px-3 w-full mt-5 ml-3">
              <SearchDialog
                isOpened={true}
                setMedia={setMedia}
                mediaType={selectedTheme}
              />
              {media && (
                <div className="flex justify-start w-full gap-3">
                  <div className="rounded-xl">
                    <img src={media.image} width="30px" alt="Media preview" />
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

              <div className="flex items-center bg-[#FDFCFF] rounded-lg px-2 py-1 h-12 w-full">
                <Avatar avatarData={myinfo.avatar} size="small" />
                <label className="ml-2 p-2 rounded-full hover:bg-gray-100 cursor-pointer hover:opacity-80 transition-transform duration-200">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                    />
                  </svg>
                </label>

                <input
                  type="text"
                  value={textArea}
                  onChange={(e) => setTextArea(e.target.value)}
                  placeholder="Share with us"
                  className="flex-grow bg-transparent focus:outline-none text-gray-700 pl-2"
                />
                {textArea !== "" && (
                  <div
                    className="ml-2 hover:cursor-pointer"
                    onClick={() => handleCreatePost()}
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
          )}

          <div className="space-y-4 ml-3 mt-3">
            {postList && (
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
                      community={id}
                    />
                  </div>
                ))}
              </div>
            )}
            {selectedPostDetails &&
              <PostExpand
                caller={canisterId}
                postDetails={selectedPostDetails}
                postAuthor={id}
                onClose={() => {
                  setSelectedPostDetails(null);
                  setSelectedPostAuthor(null);
                }}
              />
            }
            {/* {postList &&
              postList.map((post, index) => (
                <div
                  key={index}
                  ref={index === postList.length - 5 ? lastPostRef : null}
                  className="bg-[#0E1425] rounded-lg p-6"
                >
                  <div className="flex gap-3">
                    {post.photoPreview?.length > 0 ? (
                      <img
                        className="mt-3 rounded-md"
                        src={blobToImageUrl(post.photoPreview[0])}
                        width="100px"
                        alt="Post content"
                      />
                    ) : post.image_url?.length > 0 ? (
                      <img
                        className="mt-3 rounded-md"
                        src={post.image_url[0]}
                        width="100px"
                        alt="Media reference"
                      />
                    ) : null}
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-bold text-[#FDFCFF]">
                        {post.title}
                      </span>
                      <span className="text-sm font-medium text-[#FDFCFF]">
                        {post.body}
                      </span>
                      <div className="flex gap-2">
                        {post.hashTags &&
                          post.hashTags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-sm text-[#B577F7] bg-[#1A2137] px-2 py-1 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )} */}
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-[#B577F7] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
