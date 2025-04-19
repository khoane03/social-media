import { EmergencyRecording, Mood, PhotoLibrary } from "@mui/icons-material";
import AddPost from "./ModalPost";
import { useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";

const NewPost = () => {
    const [displayPost, setDisplayPost] = useState(false);
    const { user } = useUserContext();
    return (
        <>
            <AddPost isOpen={displayPost} setOpen={setDisplayPost} />

            <div className="bg-white w-full h-32 rounded-xl shadow-md px-4 py-3">
                <div className="flex justify-between items-center border-b-[1px] pb-3 ">
                    <Link to={`/profile/${user?.id}`} className="flex items-center">
                        <img
                            src={user?.avatarUrl || 'default.png'}
                            alt="Avatar"
                            className="mr-2 w-10 h-10 rounded-full border border-gray-400"
                        />
                    </Link>
                    <span
                        className="flex-[10] w-80 h-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500 cursor-pointer"
                        onClick={() => setDisplayPost(true)}
                    >
                        {user?.name} ơi, bạn đang nghĩ gì thế?
                    </span>
                </div>
                <div className="flex justify-between items-center px-2 my-2">
                    <div className="inline-block items-center hover:bg-gray-200 px-2 py-3 rounded-lg cursor-pointer sm:text-base text-sm">
                        <EmergencyRecording className="text-red-600" />
                        <span className="ml-2 text-gray-500 ">Video trực tiếp</span>
                    </div>
                    <div className="inline-block items-center hover:bg-gray-200 px-2 py-3 rounded-lg cursor-pointer">
                        <PhotoLibrary className="text-emerald-500" />
                        <span className="ml-2 text-gray-500 sm:text-base text-sm">Ảnh/Video</span>
                    </div>
                    <div className="hidden items-center hover:bg-gray-200 px-2 py-3 rounded-lg cursor-pointer sm:text-base text-sm xl:inline-block">
                        <Mood className="text-orange-300" />
                        <span className="ml-2 text-gray-500 ">Cảm xúc/Hoạt động</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewPost;
