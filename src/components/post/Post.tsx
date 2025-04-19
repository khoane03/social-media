import { CheckCircle } from "@mui/icons-material";
import ImagePost from "./ImagePost";
import { Link } from "react-router-dom";
import React, { useMemo } from "react";
import { PostActions } from "./PostAction";

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

// Tách thành pure function để có thể test độc lập
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

// Tách thành component con để tối ưu re-render
const PostItem = React.memo(({ post }: { post: Post }) => (
    <div className="bg-white w-full h-auto rounded-xl shadow-md py-3 mb-4">
    <div className="flex items-center px-4">
        {/* Avatar và tên là Link đến profile */}
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

    {/* Nội dung bài viết là Link đến post */}
    <Link to={`/post/${post.postId}`}>
        <div className="my-3 px-4">
            <p className="text-gray-600">{post.postContent}</p>
        </div>

        <div className="flex items-center justify-between pb-3">
            <div className="flex items-center border-none">
                <ImagePost images={post.images} />
            </div>
        </div>
    </Link>

    <PostActions postId={post.postId} />
</div>


));

const Post: React.FC<PostProps> = ({ posts }) => {
    // Memoize posts nếu cần xử lý trước khi render
    const memoizedPosts = useMemo(() => posts, [posts]);
    return (
        <>
            {memoizedPosts.map((post) => (
                <PostItem key={post.postId} post={post} />
            ))}
        </>
    );
};

export default React.memo(Post);