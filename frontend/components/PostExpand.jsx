import React, { useState } from "react"
import { blobToImageUrl } from "../utils/imageManager";
import createBucketActor from "../hooks/createBucketActor"

const PostExpand = ({ caller, postDetails, postAuthor, onClose }) => {
    const [newComment, setNewComment] = useState("");
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [postData, setPostData] = useState(postDetails);

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
        console.log("Comments Reactions non implemented yet")
    }

    const handleDislikeComments = async (commentId) => {
        console.log("Comments Reactions non implemented yet")
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
            console.log(resutl)

        } catch {
            console.log("Error en llamada al backend")
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
        } catch (e) {
            console.error("Error submitting comment:", e);
        } finally {
            setIsCommentLoading(false);
        }
    };

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
                        className="mt-3 rounded-md"
                        src={imageSrc}
                        width="800px"
                        alt={postDetails.photoPreview ? "Post content" : "Media reference"}
                    />
                )}


                <p className="text-white mb-4">{postData.metadata.body}</p>
                <div className="flex gap-4">
                    <button
                        className="text-green-400 hover:text-green-500 flex items-center gap-1"
                        onClick={() => handleReaction({Like: null})}
                    >
                        👍 {postData.likes.toString()}
                    </button>

                    <button
                        className="text-red-400 hover:text-red-500 flex items-center gap-1"
                        onClick={() => handleReaction({Dislike: null})}
                    >
                        👎 {postData.disLikes.toString()}
                    </button>
                </div>

                {/* Comentarios */}
                <div className="border-t border-[#B577F7] pt-4">
                    <h3 className="text-lg font-bold text-white mb-4">Comments</h3>

                    {/* Lista de comentarios */}
                    <div className="space-y-4 mb-6">
                        {postData.comments?.map((comment) => (
                            <div key={comment.commentId} className="bg-[#0D1117] border border-[#161B22] p-4 rounded-lg">
                                {/* Fecha y autor */}
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs text-gray-400">
                                        {new Date(Number(comment.date) / 1000000).toLocaleDateString()}
                                    </span>
                                </div>
                                {/* Mensaje */}
                                <p className="text-white text-sm mb-2">{comment.msg}</p>
                                <div className="flex gap-4">
                                    <button
                                        className="text-green-400 hover:text-green-500 flex items-center gap-1"
                                        onClick={() => handleLikeComments(comment.commentId)}
                                    >
                                        👍
                                    </button>

                                    <button
                                        className="text-red-400 hover:text-red-500 flex items-center gap-1"
                                        onClick={() => handleDislikeComments(comment.commentId)}
                                    >
                                        👎
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input para comentar */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 bg-[#070A10] text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#B577F7]"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            disabled={isCommentLoading}
                            className="bg-[#B577F7] text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
                        >
                            {isCommentLoading ? "Loading..." : "Send"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostExpand;
