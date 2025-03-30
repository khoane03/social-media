import {
    CheckCircle,
} from "@mui/icons-material";
import ImagePost from "./ImagePost";
import { Link } from "react-router-dom";
import React from "react";
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

const calculateTimeDifference = (apiTime: string): string => {
    const apiDate = new Date(apiTime);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - apiDate.getTime();

    const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);

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
   
    const differenceInWeeks = Math.floor(differenceInDays / 7);
    return `${differenceInWeeks} tuần trước`;
};


const Post: React.FC<PostProps> = ({ posts }) => {

    return (
        <>
            {posts.map((post: Post) => (
                <div key={post.postId} className="bg-white w-full h-auto rounded-xl shadow-md py-3 mb-4">
                    <div className="flex items-center px-4">
                        <div className="w-10 h-10 mr-2 ">
                            <img
                                src={post?.avatarUrl || "https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2024/01/c39af4399a87bc3d7701101b728cddc9.jpg"}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full border border-gray-400"
                            />
                        </div>
                        <div>
                            <div className="flex items-center">
                                <Link to={`/profile/${post?.userId}`} className="font-bold hover:underline ">{post?.name}
                                </Link>
                                {post?.isVerified && <CheckCircle className="text-blue-500 ml-1" fontSize="small" />}
                            </div>
                            <div className="flex items-center">
                                <a className=" text-gray-500 text-sm cursor-pointer hover:underline">
                                    {calculateTimeDifference(post?.createdAt)}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="my-3 pointer-events-auto px-4">
                        <p className="text-gray-600">
                            {post?.postContent}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pb-3 ">
                        <div className="flex items-center border-none">
                            <ImagePost images={post?.images} />
                        </div>
                    </div>
                    <PostActions postId={post.postId} />

                </div>
            ))}
        </>
    );
}
export default Post;