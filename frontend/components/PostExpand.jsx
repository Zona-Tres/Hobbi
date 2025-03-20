import React, { useState, useEffect, useRef } from "react"
import { toast } from 'react-toastify'
import { blobToImageUrl } from "../utils/imageManager";
import createBucketActor from "../hooks/createBucketActor"
import useStore from "../store/useStore"

const PostExpand = ({ caller, postDetails, postAuthor, onClose }) => {
    const [newComment, setNewComment] = useState("");
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [postData, setPostData] = useState(postDetails);
    const [selectedComment, setSelectedComment] = useState(0)
    const [menuComment, setMenuComment] = useState(false);
    const infoUser = useStore((state) => state.myinfo)

    const getImageSrc = () => {
        if (postData.metadata.image?.length > 0) {
            return blobToImageUrl(postData.metadata.image[0]);
        }
        if (postData.metadata.image_url?.length > 0) {
            return postData.metadata.image_url[0];
        }
        return null;
    };

    const imageSrc = getImageSrc();

    const handleLikeComments = async (commentId) => {
        // Reacciones no implementadas aún
    }

    const handleDislikeComments = async (commentId) => {
        // Reacciones no implementadas aún
    }

    const handleReaction = async (reaction) => {
        // TODO colorear la reaccion que ya se haya efectuado
        // sendReaction({postId: PostID; canisterId: Principal; reaction: Reaction}
        const user = await createBucketActor(caller);
        try {
            const resutl = await user.sendReaction(
                {
                    postId: postData.id,
                    canisterId: postAuthor, 
                    reaction: reaction
                }
            )
            // La siguiente llamada puede evitarse si desde el frontend se puede leer la reaccion actual del usuario en relacion
            // al post y efectuar los cambios necesarios en la vista de acuerdo a las subsiguietes acciones... ej quitar like o cambiar
            // Una reaccion por otra. 
            const author = await createBucketActor(postAuthor)
            const updatedPost = await author.readPost(postData.id);
            if (updatedPost.Ok) { setPostData(updatedPost.Ok) }

        } catch {
            toast.error("An error occurred while processing your reaction");
        }
    }

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !postData.id) return;

        try {
            setIsCommentLoading(true);
            const user = await createBucketActor(postAuthor);
            await user.commentPost(postData.id, newComment);
            const updatedPost = await user.readPost(postData.id);
            if (updatedPost.Ok) { setPostData(updatedPost.Ok) }

            setNewComment("");
        } catch {
            toast.error("An error occurred while posting your comment");
        } finally {
            setIsCommentLoading(false);
        }
    };

    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuComment(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!postData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            {/* Fondo oscuro para cerrar */}
            <div className="fixed inset-0 bg-black bg-opacity-20 z-40" onClick={onClose}></div>

            {/* Modal */}
            <div className="bg-[#0E1425] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50 relative">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{postData.metadata.title}</h2>
                    <button onClick={onClose} className="text-[#B577F7] hover:text-purple-400">✕</button>
                </div>


                {imageSrc && (
                    <img
                        className="mt-3 mb-3 rounded-md"
                        src={imageSrc}
                        width="800px"
                        alt={postDetails.photoPreview ? "Post content" : "Media reference"}
                    />
                )}


                <p className="text-white mb-4">{postData.metadata.body}</p>
                <div className="flex gap-4">
                    <button
                        className="text-[#4f239e] hover:text-[#4f239e]/80 flex items-center gap-1"
                        onClick={() => handleReaction({Like: null})}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-6 h-6"
                        >
                            <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                        </svg>
                        {postData.likes.toString()}
                    </button>

                    <button
                        className="text-[#505CE6] hover:text-[#505CE6]/80 flex items-center gap-1"
                        onClick={() => handleReaction({Dislike: null})}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-6 h-6"
                        >
                            <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
                        </svg>
                        {postData.disLikes.toString()}
                    </button>
                </div>

                {/* Comments */}
                <div className="border-t border-[#B577F7] pt-4">
                    <h3 className="text-lg font-bold text-white mb-4">Comments</h3>
                    {/* Input for new comment */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => infoUser.name? setNewComment(e.target.value): alert("Connect")}
                            placeholder={infoUser.name? "Write a comment..." : "Login to comment"}
                            className="flex-1 bg-[#070A10] text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#B577F7]"
                        />
                        {infoUser.name && <button
                            onClick={handleCommentSubmit}
                            disabled={isCommentLoading}
                            className="bg-[#B577F7] text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
                        >
                            {isCommentLoading ? "Loading..." : "Send"}
                        </button>}
                    </div>

                    {/* Comments list */}
                    <div className="mt-4 h-64 overflow-y-auto space-y-2 rounded-lg">
                        {postData.comments?.slice().reverse().map((comment) => (
                            <div key={comment.commentId} className="bg-[#0D1117] border border-[#161B22] p-4 rounded-lg">
                                {/* Date and author */}
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs text-gray-400">
                                        {new Date(Number(comment.date) / 1000000).toLocaleDateString()}
                                    </span>
                                    <div className="relative ml-auto">
                                        <button
                                            onClick={
                                                () => {
                                                    setMenuComment(!menuComment);
                                                    setSelectedComment(comment.commentId)
                                                }    
                                            }
                                        >
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                viewBox="0 0 24 24" 
                                                fill="#ffffff" 
                                                className="w-6 h-6"
                                            >
                                                <path d="M3.25 8C3.25 8.69 2.69 9.25 2 9.25C1.31 9.25 0.75 8.69 0.75 8C0.75 7.31 1.31 6.75 2 6.75C2.69 6.75 3.25 7.31 3.25 8ZM14 6.75C13.31 6.75 12.75 7.31 12.75 8C12.75 8.69 13.31 9.25 14 9.25C14.69 9.25 15.25 8.69 15.25 8C15.25 7.31 14.69 6.75 14 6.75ZM8 6.75C7.31 6.75 6.75 7.31 6.75 8C6.75 8.69 7.31 9.25 8 9.25C8.69 9.25 9.25 8.69 9.25 8C9.25 7.31 8.69 6.75 8 6.75Z"/> 
                                            </svg>
                                        </button>
                                        {menuComment && (comment.commentId === selectedComment) && (
                                            <div ref={menuRef} className="absolute right-0 mt-2 w-40 bg-[#161B22] text-white shadow-lg rounded-lg z-10">
                                                <button className="w-full text-left px-4 py-2 hover:bg-[#1E232A]"
                                                onClick={() => console.log("reportando comentatio id: ", selectedComment)}>Reportar</button>
                                                <button className="w-full text-left px-4 py-2 hover:bg-[#1E232A]">Bloquear Usuario</button>
                                                <button className="w-full text-left px-4 py-2 hover:bg-[#1E232A]">Ocultar</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Message */}
                                <p className="text-white text-sm mb-2">{comment.msg}</p>
                                <div className="flex gap-4">
                                    <button
                                        className="text-[#4f239e] hover:text-[#4f239e]/80 flex items-center gap-1"
                                        onClick={() => handleLikeComments(comment.commentId)}
                                    >
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24" 
                                            fill="currentColor" 
                                            className="w-6 h-6"
                                        >
                                            <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                                        </svg>
                                    </button>

                                    <button
                                        className="text-[#505CE6] hover:text-[#505CE6]/80 flex items-center gap-1"
                                        onClick={() => handleDislikeComments(comment.commentId)}
                                    >
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24" 
                                            fill="currentColor" 
                                            className="w-6 h-6"
                                        >
                                            <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PostExpand;
