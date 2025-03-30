import {
    FavoriteBorder,
    SentimentDissatisfied,
    SentimentSatisfiedAlt,
    ThumbUpOffAlt
} from "@mui/icons-material";
import { Comments } from "./Comment";
import React, { useEffect } from "react";
import CommentService from "../../../service/CommentService";

interface PostActionsProps {
    postId: string;
};

export const PostActions: React.FC<PostActionsProps> = ({ postId }) => {
    const [totalCmt, setTotalCmt] = React.useState(0);

    const getComments = async () => {
        const resp = await CommentService.getAllComments(postId);
        setTotalCmt(resp.data.length);
    };

    useEffect(() => {
        getComments();
    },[]);

    return (
        <>
            <div className="flex justify-between mx-4 border-b-[1px] pb-3">
                <div className="flex items-center">
                    <div className=" border border-white bg-blue-200 z-10  rounded-full items-center inline-flex justify-center w-6 h-6">
                        <ThumbUpOffAlt className="text-blue-500 cursor-pointer" fontSize="small" />
                    </div>
                    <div className="ml-[-2px] bg-pink-200 border-white border rounded-full items-center inline-flex justify-center w-6 h-6">
                        <FavoriteBorder className="text-pink-500 cursor-pointer" fontSize="small" />
                    </div>
                    <div className="ml-[-2px] bg-orange-200 border-white border rounded-full items-center inline-flex justify-center w-6 h-6">
                        <SentimentSatisfiedAlt className="text-orange-500 cursor-pointer" fontSize="small" />
                    </div>
                    <div className="ml-[-2px] bg-orange-200 border-white border rounded-full items-center inline-flex justify-center w-6 h-6">
                        <SentimentDissatisfied className="text-orange-500 cursor-pointer" fontSize="small" />
                    </div>
                    <a className="text-gray-500 ml-1 cursor-pointer">12 lượt thích</a>

                </div>

                <div>
                    <a className="text-gray-500 cursor-pointer">{totalCmt} bình luận</a>
                </div>

            </div>

            <div className="flex justify-around mx-4 pt-3">
                <div className="flex items-center px-3 py-1 rounded-lg hover:bg-gray-200">
                    <ThumbUpOffAlt />
                    <span className="text-gray-500 ml-2 font-bold">Thích</span>
                </div>
                <div className="flex items-center px-3 py-1 rounded-lg hover:bg-gray-200">
                    <Comments postId={postId}/>
                </div>
            </div>
        </>

    );
}
