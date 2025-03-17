import React, { useEffect, useRef, useState, useCallback } from "react"
import createBucketActor from "../hooks/createBucketActor"
import Hashtag from "./hashtag";
import { blobToImageUrl } from "../utils/imageManager";
import { formatBigIntToDate } from "../utils/utils";

const PostPreview = ({ caller, innerRef, post, setSelectedPostDetails, setSelectedPostAuthor }) => {
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
        if (isLoading || selectedPostId) return;
        try {
            setIsLoading(true);
            console.log(postId)
            console.log(author)
            setSelectedPostAuthor(author)
            const user = await createBucketActor(author)
            const response = await user.readPost(postId);

            setSelectedPostDetails(response.Ok? response.Ok: null );
            
            setSelectedPostId(postId);
        } catch (e) {
            console.error("Error fetching post details:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !selectedPostId) return;

        try {
            setIsCommentLoading(true);

            const user = await createBucketActor(author)
            await user.commentPost(selectedPostId, newComment);
            const updatedPost = await user.readPost(selectedPostId);

            setSelectedPostDetails(updatedPost);
            setNewComment("");
        } catch (e) {
            console.error("Error submitting comment:", e);
        } finally {
            setIsCommentLoading(false);
        }
    };

    return (
        <div
            ref={innerRef}
            className="flex flex-col bg-[#0E1425] rounded-2xl px-5 pt-5 pb-3 ml-3 mt-4 w-full
                 hover:scale-[1.02] hover:opacity-90 transition-transform duration-200"
            onClick={(e) => {
                // Solo activar si no hay post seleccionado y es clic directo en el contenedor
                if (!selectedPostId && e.target === e.currentTarget) {
                    handlePostClick(post.postId);
                }
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
            
        </div>
    );
};

export default PostPreview;

// {selectedPostDetails && (
//     <>
//         <div
//             className="fixed inset-0 bg-black bg-opacity-20 z-40"
//             onClick={() => {
//                 setSelectedPostDetails(null);
//                 setSelectedPostId(null);
//             }}
//         ></div>

//         <div
//             className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
//             onClick={() => {
//                 setSelectedPostDetails(null);
//                 setSelectedPostId(null);
//             }}
//         >
//             <div className="bg-[#0E1425] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//                 {/* Encabezado del modal */}
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-bold text-white">
//                         {selectedPostDetails?.Ok?.metadata.title}
//                     </h2>
//                     <button
//                         onClick={() => {
//                             setSelectedPostDetails(null);
//                             setSelectedPostId(null);
//                         }}
//                         className="text-[#B577F7] hover:text-purple-400"
//                     >
//                         ✕
//                     </button>
//                 </div>

//                 {/* Contenido del post */}
//                 <div className="mb-4">
//                     {selectedPostDetails?.Ok.image?.length > 0 ? (
//                         <img
//                             className="mt-3 rounded-md"
//                             src={blobToImageUrl(selectedPostDetails.Ok.image[0])}
//                             width="100px"
//                             alt="Post content"
//                         />
//                     ) : selectedPostDetails.image_url?.length > 0 ? (
//                         <img
//                             className="mt-3 rounded-md"
//                             src={item.image_url[0]}
//                             width="100px"
//                             alt="Media reference"
//                         />
//                     ) : null}
//                     <p className="text-white mb-4">{selectedPostDetails?.Ok.metadata.body}</p>
//                     {/* <div className="flex gap-2 flex-wrap mb-4">
//                                 {selectedPostDetails.metadata.hashTags.map((tag, index) => (
//                                     <Hashtag key={index} name={tag} />
//                                     ))}
//                                     </div> */}

//                     {/* Sección de comentarios */}
//                     {caller && <div className="border-t border-[#B577F7] pt-4">
//                         <h3 className="text-lg font-bold text-white mb-4">Comments</h3>

//                         {/* Lista de comentarios */}
//                         <div className="space-y-4 mb-6">
//                             {Array.isArray(selectedPostDetails?.Ok?.comments)
//                                 ? selectedPostDetails.Ok.comments.map((comment) => (
//                                     <div key={comment.commentId} className="bg-[#0D1117] border border-[#161B22] p-4 rounded-lg shadow-md">
//                                         {/* Header: Autor + Fecha */}
//                                         <div className="flex items-center gap-3 mb-2">
//                                             {/* Avatar del usuario (inicial del nombre) */}
//                                             {/* <div className="w-8 h-8 bg-[#B577F7] flex items-center justify-center rounded-full text-white font-bold">
//                                                         {comment.author?.charAt(0).toUpperCase()}
//                                                         </div> */}

//                                             <div>
//                                                 {/* Convertir Principal a String */}
//                                                 {/* <span className="block text-sm font-semibold text-[#B577F7]">
//                                                             @{_principal.toText(comment.autor)}
//                                                         </span> */}

//                                                 {/* Fecha formateada */}
//                                                 <span className="text-xs text-gray-400">
//                                                     {new Date(Number(comment.date) / 1000000).toLocaleDateString()}
//                                                 </span>
//                                             </div>
//                                         </div>

//                                         {/* Mensaje del comentario */}
//                                         <p className="text-white text-sm leading-relaxed mb-2">{comment.msg}</p>

//                                         {/* Botones de Like y Dislike */}
//                                         <div className="flex gap-4">
//                                             <button
//                                                 className="text-green-400 hover:text-green-500 flex items-center gap-1"
//                                                 onClick={() => handleLikeComments(comment.commentId)}
//                                             >
//                                                 👍 Like
//                                             </button>

//                                             <button
//                                                 className="text-red-400 hover:text-red-500 flex items-center gap-1"
//                                                 onClick={() => handleDislikeComments(comment.commentId)}
//                                             >
//                                                 👎 Dislike
//                                             </button>
//                                         </div>
//                                     </div>

//                                 ))
//                                 : null
//                             }
//                         </div>

//                         {/* Formulario para nuevo comentario */}
//                         <div className="flex gap-2">
//                             <input
//                                 type="text"
//                                 value={newComment}
//                                 onChange={(e) => setNewComment(e.target.value)}
//                                 placeholder="Write a comment..."
//                                 className="flex-1 bg-[#070A10] text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#B577F7]"
//                             // onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
//                             />
//                             <button
//                                 onClick={handleCommentSubmit}
//                                 disabled={isCommentLoading}
//                                 className="bg-[#B577F7] text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
//                             >
//                                 {isCommentLoading ? (
//                                     <div className="w-4 h-4 border-2 border-t-white border-[#f3f3f3] rounded-full animate-spin"></div>
//                                 ) : (
//                                     "Send"
//                                 )}
//                             </button>
//                         </div>
//                     </div>}
//                 </div>
//             </div>
//         </div>
//     </>
// )}