import { Comment, MoreHoriz, Send } from "@mui/icons-material";
import React, { useState } from "react";
import CommentService from "../../service/CommentService";

interface CommentsProps {
    postId: string;
}
interface Comment {
    avatarUrl: string;
    userId: string;
    name: string;
    contents: string;
    createdAt: string;
}

export const Comments: React.FC<CommentsProps> = ({ postId }) => {

    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [contents, setContents] = useState("");

    const getComments = async () => {
        const resp = await CommentService.getAllComments(postId);
        setComments(resp.data);
        console.log(resp.data);
    };

    const handleComment = async () => {
        setOpen(true)
        getComments();
    }

    const createComment = async () => {
        const data = {
            postId,
            content: contents
        }
        await CommentService.createComment(data);
        getComments();
        setContents("");
    }

    // const deleteComment = async (commentId: string) => {
    //     try {
    //         await CommentService.deleteComment(commentId);
    //     } catch (error) {
    //         console.error("Error deleting comment:", error);
    //     }
    // };

    return (
        <>
            <button
                onClick={handleComment}
                className="text-gray-500 hover:text-blue-500 transition duration-200">
                <Comment />
                <span className="text-gray-500 ml-2 font-bold">Bình luận</span>
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setOpen(false)}>
                    <div className="bg-[#F2F4F7] rounded-lg shadow-lg w-96 p-6 relative flex flex-col justify-start"
                        onClick={(e) => e.stopPropagation()} >
                        <h2 className="font-bold text-2xl py-2 border-b-2  ">Bình luận </h2>
                        <div className="border-b-2">
                            {comments.map((comment: Comment, index) => (
                                <div key={index} className="my-4 bg-white shadow-lg p-2 rounded-lg flex items-center">
                                    <img
                                        className="w-10 h-10 rounded-full object-cover border border-gray-400"
                                        src={comment.avatarUrl}
                                    />
                                    <div className="ml-2 w-full">
                                        <h3 className="font-bold">{comment.name}</h3>
                                        <p className="text-gray-400">{comment.contents}</p>
                                    </div>
                                    <MoreHoriz className="text-gray-400 hover:text-gray-600 cursor-pointer mr-2" />
                                </div>
                            ))}
                        </div>

                        <div className="border border-gray-400 rounded-lg bg-gray-300 flex items-center justify-between px-2 mt-4">
                            <input className="outline-none p-2 bg-transparent  "
                                type="text"
                                value={contents}
                                onChange={(e) => setContents(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        createComment();
                                    }
                                }}
                                placeholder="Nhập bình luận của bạn." />

                            <button>
                                <Send className="text-purple-500 hover:text-purple-600"
                                    onClick={createComment}

                                />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};