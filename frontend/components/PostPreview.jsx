import React, { useEffect, useRef, useState, useCallback } from "react"
import { toast } from "react-toastify"
import createBucketActor from "../hooks/createBucketActor"
import Hashtag from "./hashtag"
import { blobToImageUrl } from "../utils/imageManager"
import { formatBigIntToDate } from "../utils/utils"

const PostPreview = ({
  innerRef,
  post,
  setSelectedPostDetails,
  setSelectedPostAuthor,
}) => {
  const [selectedPostId, setSelectedPostId] = useState(null)
  // const [selectedPostDetails, setSelectedPostDetails] = useState(null);
  const [newComment, setNewComment] = useState("")
  const [isCommentLoading, setIsCommentLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const author = post.autor

  const getImageSrc = () => {
    if (post.photoPreview?.length > 0) {
      return blobToImageUrl(post.photoPreview[0])
    }
    if (post.image_url?.length > 0) {
      return post.image_url[0]
    }
    return null
  }

  const imageSrc = getImageSrc()

  const handlePostClick = async (postId) => {
    if (isLoading) return
    try {
      setIsLoading(true)
      setSelectedPostAuthor(author)
      const user = await createBucketActor(author)
      const response = await user.readPost(postId)
      setSelectedPostDetails(response.Ok ? response.Ok : null)
    } catch {
      toast.error("An error occurred while loading the post")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div ref={innerRef}>
      <div className="flex justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-[#FDFCFF] cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            window.location.href = `/profile/${post.autor.toText()}`
          }}
        >
          {post.autorPhoto.length > 0 && <img src={blobToImageUrl(post.autorPhoto[0])} className="h-[25px] w-[25px] rounded-full"></img>}
          <span className="text-[#B8A5BD] hover:text-[#E6E0E9] transition-colors duration-300">
            @{post.userName}
          </span>
        </div>
        <span className="text-sm font-medium text-[#BCBCBC]">
          {formatBigIntToDate(post.date)}
        </span>
      </div>

      <h2 className="mb-2 font-bold text-[#FDFCFF]">{post.title}</h2>
      <p className="text-sm font-medium text-[#FDFCFF]">{post.body.slice(0, 100)}{post.body.length > 100 && "..."}</p>

      <div className="flex gap-3 mt-2">
        {post.hashTags?.length > 0 &&
          post.hashTags.map((tag, index) => <Hashtag key={index} name={tag} />)}
      </div>

      {imageSrc && (
        <img
          className="mt-3 rounded-md"
          src={imageSrc}
          width="100px"
          alt={post.photoPreview ? "Post content" : "Media reference"}
        />
      )}

      <div className="flex gap-4 pt-2">
        <div
          className="text-white hover:text-white/80 flex items-center gap-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            handlePostClick(post.postId)
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
          <span>Comment</span>
        </div>

        <div className="flex gap-4 ml-auto">
          <div className="text-[#4f239e] hover:text-[#4f239e]/80 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
            </svg>
            {post.likes.toString()}
          </div>

          <div className="text-[#505CE6] hover:text-[#505CE6]/80 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
            </svg>
            {post.disLikes.toString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostPreview
