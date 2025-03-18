import React, { useEffect, useRef, useState, useCallback } from "react"
import createBucketActor from "../hooks/createBucketActor"
import Hashtag from "./hashtag";
import { blobToImageUrl } from "../utils/imageManager";
import { formatBigIntToDate } from "../utils/utils";

const PostPreview = ({ innerRef, post, setSelectedPostDetails, setSelectedPostAuthor }) => {
    const [selectedPostId, setSelectedPostId] = useState(null);
    // const [selectedPostDetails, setSelectedPostDetails] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const author = post.autor

    const getImageSrc = () => {
        if (post.photoPreview?.length > 0) {
            return blobToImageUrl(post.photoPreview[0]);
        }
        if (post.image_url?.length > 0) {
            return post.image_url[0];
        }
        return null;
    };

    const imageSrc = getImageSrc();

    const handlePostClick = async (postId) => {
        if (isLoading) return;
        try {
            setIsLoading(true);
            setSelectedPostAuthor(author)
            const user = await createBucketActor(author)
            const response = await user.readPost(postId);
            setSelectedPostDetails(response.Ok ? response.Ok : null);
        } catch (e) {
            console.error("Error fetching post details:", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            ref={innerRef}
            className="flex flex-col bg-[#0E1425] rounded-2xl px-5 pt-5 pb-3 ml-3 mt-4 w-full
                 hover:scale-[1.02] hover:opacity-90 transition-transform duration-200"
            onClick={() => {
                handlePostClick(post.postId)
            }}
        >
            <div className="flex justify-between">
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/profile/${post.autor.toText()}`;
                    }}
                    className="text-sm font-medium text-[#FDFCFF] cursor-pointer"
                >
                    @{post.userName}
                </span>
                <span className="text-sm font-medium text-[#BCBCBC]">
                    {formatBigIntToDate(post.date)}
                </span>
            </div>

            <span className="text-sm font-bold text-[#FDFCFF]">{post.title}</span>
            <span className="text-sm font-medium text-[#FDFCFF]">{post.body}</span>

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

            <div className="flex gap-4">
                <div
                    className="text-green-400 hover:text-green-500 flex items-center gap-1"
                    
                >
                    👍 {post.likes.toString()}
                </div>

                <div
                    className="text-red-400 hover:text-red-500 flex items-center gap-1"
                    
                >
                    👎 {post.disLikes.toString()}
                </div>
            </div>

        </div>
    );
};

export default PostPreview;