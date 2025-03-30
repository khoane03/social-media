import NewPost from "../../components/newpost/NewPost";
import Post from "../../components/post/Post";
import UserService from "../../../service/UserService";
import PostService from "../../../service/PostService";
import { DateRange, FmdGoodOutlined, Info, Phone, Transgender } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

interface UserInfo {
    address?: string | null;
    age?: number;
    dob?: string | null;
    email: string;
    gender?: string | null;
    id: string;
    name: string;
    phone?: string | null;
    role: string[];
    avatarUrl?: string | null;
    coverUrl?: string | null;
    status: string;
    username: string;
    verifier: boolean;
}

export default function MainProfile() {
    const [info, setInfo] = useState<UserInfo | null>(null);
    const [posts, setPosts] = useState([]);
    const [onlyView, setOnlyView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editInfo, setEditInfo] = useState({ dob: "", address: "", gender: "" });
    const allImages = posts.flatMap((post: any) => post.images || []);
    const visibleImages = allImages.slice(0, 9);
    const { user } = useUserContext();
    const { userId } = useParams<{ userId: string }>();

    const fetchData = useCallback(async () => {
        try {
            let userData, postData;
            if (userId) {
                [userData, postData] = await Promise.all([
                    UserService.getInfoById(userId),
                    PostService.getPostById(userId)
                ]);
                setInfo(userData.data);
                setEditInfo({
                    address: userData.data.address || "",
                    dob: userData.data.dob || "",
                    gender: userData.data.gender || ""
                });
                setPosts(postData.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        if (user && user.id) {
            setOnlyView(userId !== user.id);
        }
    }, [userId, user]);

    useEffect(() => {
        document.title = "Trang cá nhân";
        fetchData();
    }, [fetchData]);

    const handleEdit = async () => {
        if (isEdit) {
            try {
                console.log("Cập nhật thông tin:", editInfo);
                await UserService.updateInfo(editInfo);
                fetchData();
            } catch (error: any) {
                console.error("Update error:", error.response?.data || error);
            }
        }
        setIsEdit(!isEdit);
    };

    return (
        <div className="md:mx-40 px-4 flex">
            <div className="md:inline-block hidden flex-[4] h-auto">
                <div className="w-full max-w-[450px]">
                    <div className="bg-white shadow-lg rounded-lg p-4">
                        <div className="font-bold text-xl border-b pb-4">Giới thiệu</div>

                        <div className="my-3 flex items-center">
                            <FmdGoodOutlined />
                            <input
                                type="text"
                                className={`text-sm pl-2 w-full ${isEdit ? 'border rounded-lg text-red-400 p-2' : 'text-gray-500 outline-none'}`}
                                readOnly={!isEdit}
                                value={editInfo.address}
                                onChange={(e) => setEditInfo({ ...editInfo, address: e.target.value })}
                            />
                        </div>

                        <div className="my-3 flex items-center">
                            <DateRange />
                            <input
                                type="date"
                                className={`text-sm pl-2 w-full ${isEdit ? 'border rounded-lg text-red-400 p-2' : 'text-gray-500 outline-none'}`}
                                readOnly={!isEdit}
                                value={editInfo.dob}
                                onChange={(e) => setEditInfo({ ...editInfo, dob: e.target.value })}
                            />
                        </div>

                        <div className="my-3 flex items-center">
                            <Transgender />
                            <select
                                id="gender"
                                value={editInfo.gender}
                                onChange={(e) => setEditInfo(prev => ({ ...prev, gender: e.target.value }))}
                                className={`ml-2 w-auto text-sm ${!isEdit ? 'bg-white ' : 'border border-gray-300 rounded-lg px-4 py-2'}`}
                                disabled={!isEdit}>
                                <option value=""></option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>

                        {info?.age !== 0 && (
                            <div className="my-3 flex items-center">
                                <Info />
                                <span className="text-gray-500 text-sm pl-2">Tuổi : {info?.age}</span>
                            </div>
                        )}

                        {info?.phone && (
                            <div className="my-3 flex items-center">
                                <Phone />
                                <span className="text-gray-500 text-sm pl-2">{info.phone}</span>
                            </div>
                        )}

                        {!onlyView && (
                            <div className="border-t pt-3">
                                <button className="bg-gray-200 hover:bg-gray-300 w-full p-2 rounded-lg mt-3" onClick={handleEdit}>
                                    {isEdit ? 'Lưu' : 'Chỉnh sửa'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ảnh */}
                <div className="w-full max-w-[450px] mt-5">
                    <div className="bg-white shadow-lg rounded-lg p-4 sticky top-16">
                        {visibleImages.length > 0 && (
                            <div>
                                <div className="font-bold text-xl border-b pb-4">Ảnh</div>
                                <div className="grid grid-cols-3 grid-rows-3 gap-1 min-w-[395px] min-h-[395px] bg-gray-200 rounded-lg mt-3 p-1">
                                    {visibleImages.map((image: string, index: number) => (
                                        <div key={index} className="bg-white shadow-md flex items-center justify-center rounded-lg">
                                            <img src={image} alt="Ảnh" className="w-full h-full object-cover rounded-lg" />
                                        </div>
                                    ))}
                                </div>
                                {allImages.length > 9 && (
                                    <div className="mt-3 text-center">
                                        <span className="text-gray-500 text-sm cursor-pointer hover:underline">Xem thêm</span>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-[592px] flex-[6]">
                {!onlyView && <NewPost />}
                <div className={`${onlyView ? 'mt-0' : 'mt-5'}`}>
                    <Post posts={posts} />
                </div>
            </div>
        </div>
    );
}
