import NewPost from "../../components/newpost/NewPost";
import Post from "../../components/post/Post";
import UserService from "../../../service/UserService";
import PostService from "../../../service/PostService";
import { DateRange, FmdGoodOutlined, Info, Phone, Transgender } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import ImageViewer from "../../components/view/ImageViewer";
import Alert from "../../components/alert/Alert";

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
    const [showImg, setShowImg] = useState(false);
    const [selectImg, setSelectImg] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            setError("Failed to fetch data");
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
                await UserService.updateInfo(editInfo);
                setSuccess("Cập nhật thông tin thành công!");
                fetchData();
            } catch (error: any) {
                setError(error.response?.data?.message || "Cập nhật thông tin thất bại!");
            }
        }
        setIsEdit(!isEdit);
    };

    return (
        <>
            {error && <Alert message={error} onClose={() => setError('')} />}
            {success && <Alert type={'success'} message={success} onClose={() => setSuccess('')} />}
            {showImg && <ImageViewer image={selectImg} onClose={() => setShowImg(false)} />}
            <div className="md:mx-40 px-4 flex">
                <div className="md:inline-block hidden flex-[4] h-auto">
                    <div className="w-full max-w-[450px]">
                        <div className="bg-white shadow-lg rounded-lg p-4">
                            <div className="font-bold text-xl border-b pb-4">Giới thiệu</div>
                            {info ? (
                                <>
                                    {editInfo.address && (
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
                                    )}

                                    {editInfo.dob && (
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
                                    )}

                                    {editInfo.gender && (
                                        <div className="my-3 flex items-center">
                                            <Transgender />
                                            <select
                                                id="gender"
                                                value={editInfo.gender}
                                                onChange={(e) => setEditInfo(prev => ({ ...prev, gender: e.target.value }))}
                                                className={`ml-2 w-auto text-sm ${!isEdit ? 'bg-white ' : 'border border-gray-300 rounded-lg px-4 py-2'}`}
                                                disabled={!isEdit}
                                            >
                                                <option value=""></option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                                <option value="Khác">Khác</option>
                                            </select>
                                        </div>
                                    )}

                                    {info?.age !== 0 && (
                                        <div className="my-3 flex items-center">
                                            <Info />
                                            <span className="text-gray-500 text-sm pl-2">Tuổi: {info?.age}</span>
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
                                </>
                            ) : (
                                <div className="mt-3 text-center">
                                    <span className="text-gray-500 text-sm">Chưa có thông tin nào</span>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Ảnh */}
                    {visibleImages.length > 0 ? (
                        <div className="w-full max-w-[450px] mt-5">
                            <div className="bg-white shadow-lg rounded-lg p-4 sticky top-16">
                                <div>
                                    <div className="font-bold text-xl border-b pb-4">Ảnh</div>
                                    <div className="grid grid-cols-3 grid-rows-3 gap-2 min-w-[395px] min-h-[395px] bg-gray-200 rounded-lg mt-3 p-1">
                                        {visibleImages.map((image: string, index: number) => (
                                            <div onClick={() => { setSelectImg(image); setShowImg(true) }} key={index} className="bg-white shadow-md flex items-center justify-center rounded-lg border border-gray-300 cursor-pointer">
                                                <img src={image} alt="Ảnh" className="w-full h-full object-cover rounded-lg" />
                                            </div>
                                        ))}
                                    </div>
                                    {allImages.length > 9 && (
                                        <div className="mt-3 text-center">
                                            <Link to={'photos'} className="text-gray-500 text-sm cursor-pointer p-2 hover:bg-gray-400 rounded-lg border hover:underline">Xem thêm</Link>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    ) :
                        <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-[450px] mt-5">
                            <div className="font-bold text-xl border-b pb-4">Ảnh</div>
                            <div className="mt-3 text-center">
                                <span className="text-gray-500 text-sm">Chưa có ảnh nào</span>
                            </div>
                        </div>
                    }
                </div>

                {/* Main content */}
                <div className="max-w-[592px] flex-[6]">
                    {posts.length <= 0 && <>
                        <div className="bg-white shadow-lg rounded-lg p-4">
                            <div className="font-bold text-xl border-b pb-4">Bài viết</div>
                            <div className="mt-3 text-center">
                                <span className="text-gray-500 text-sm">Chưa có bài viết nào</span>
                            </div>
                        </div>
                    </>}
                    {!onlyView && <NewPost />}
                    <div className={`${onlyView ? 'mt-0' : 'mt-5'}`}>
                        <Post posts={posts} />
                    </div>
                </div>
            </div>
        </>
    );
}
