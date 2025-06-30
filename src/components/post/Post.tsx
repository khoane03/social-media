import { CheckCircle, MoreHoriz } from "@mui/icons-material";
import ImagePost from "./ImagePost";
import { Link } from "react-router-dom";
import React, { useEffect, useMemo } from "react";
import { PostActions } from "./PostAction";
import PostService from "../../service/PostService";
import Accept from "../popup/Accept";
import { useState } from "react"; 
import Alert from "../alert/Alert";
import UserService from "../../service/UserService";
import ViewPost from "./ShowPost";

interface Post {
    postId: string;
    userId: string;
    name: string;
    avatarUrl: string;
    isVerified: boolean;
    postContent: string;
    createdAt: string;
    images: string[];
}

interface PostProps {
    posts: Post[];
}

const calculateTimeDifference = (apiTime: string): string => {
    const apiDate = new Date(apiTime);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - apiDate.getTime();
    const differenceInMinutes = Math.floor(differenceInMilliseconds / 60000);

    if (differenceInMinutes < 60) {
        return `${differenceInMinutes} phút trước`;
    }

    const differenceInHours = Math.floor(differenceInMinutes / 60);
    if (differenceInHours < 24) {
        return `${differenceInHours} giờ trước`;
    }

    const differenceInDays = Math.floor(differenceInHours / 24);
    if (differenceInDays < 7) {
        return `${differenceInDays} ngày trước`;
    }

    return `${Math.floor(differenceInDays / 7)} tuần trước`;
};

interface PostItemProps {
    post: Post;
    onDelete: (postId: string) => void; // <-- thêm prop onDelete
}

const PostItem = React.memo(({ post, onDelete }: PostItemProps) => {
    const [openAccept, setOpenAccept] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleDeletePost = async () => {
        try {
            await PostService.deletePostById(post.postId);
            setIsError(false);  
            setMessage("Xóa bài viết thành công");
            onDelete(post.postId); // <-- thông báo cho component cha xoá bài
        } catch (error) {
            setIsError(true);
            setMessage("Lỗi không xác định");
        }
    };

    const handleAccept = async () => {
        await handleDeletePost();
        setOpenAccept(false);
    };

    const handleReject = () => {
        setOpenAccept(false);
    };

    useEffect(() => {
        const checkOwnership = async () => {
            try {
                const user = await UserService.getInfo();
                setIsOwner(user.data.id === post.userId);
            } catch (error) {
                console.error("Error checking ownership:", error);
            }
        };

        checkOwnership();
    },[]);

    return (
        <div className="bg-white w-full h-auto rounded-xl shadow-md py-3 mb-4 relative">
            {openAccept && (
                <Accept
                    action="xoá"
                    isAccept={handleAccept}
                    isReject={handleReject}
                />
            )}

            {message && (
                <Alert
                    type={isError ? "error" : "success"}
                    message={message}
                    onClose={() => setMessage("")}
                />
            )}

            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setOpenAccept(true)}
                disabled={!isOwner} // Disable if not the owner
                title={isOwner ? "Xoá bài viết" : "Bạn không có quyền xoá bài viết này"}
            >
                <MoreHoriz className="w-6 h-6" />
            </button>

            {/* Avatar và tên người dùng */}
            <div className="flex items-center px-4">
                <Link to={`/profile/${post.userId}`} className="w-10 h-10 mr-2">
                    <img
                        src={post.avatarUrl || 'default.png'}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full border border-gray-400"
                        loading="lazy"
                        decoding="async"
                    />
                </Link>
                <div>
                    <div className="flex items-center">
                        <Link to={`/profile/${post.userId}`} className="font-bold hover:underline">
                            {post.name}
                        </Link>
                        {post.isVerified && (
                            <CheckCircle className="text-blue-500 ml-1" fontSize="small" />
                        )}
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-500 text-sm hover:underline">
                            {calculateTimeDifference(post.createdAt)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Nội dung bài viết */}
            <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                <div className="my-3 px-4">
                    <p className="text-gray-600">{post.postContent}</p>
                </div>

                <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center border-none">
                        <ImagePost images={post.images} />
                    </div>
                </div>
            </div>

            <PostActions postId={post.postId} />
            <ViewPost isOpen={isOpen} postId={post.postId} onClose={() => setIsOpen(false)} />
        </div>
    );
});


const Post: React.FC<PostProps> = ({ posts }) => {
    const [postList, setPostList] = useState<Post[]>(posts); // <-- local state danh sách bài viết

    const handleDeletePost = (postId: string) => {
        setPostList((prev) => prev.filter((post) => post.postId !== postId)); // <-- xóa bài
    };

    const memoizedPosts = useMemo(() => postList, [postList]);

    return (
        <>
            {memoizedPosts.map((post) => (
                <PostItem key={post.postId} post={post} onDelete={handleDeletePost} />
            ))}
        </>
    );
};


export default React.memo(Post);