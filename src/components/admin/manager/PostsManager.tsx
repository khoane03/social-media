import { useEffect, useState } from "react";
import PostService from "../../../service/PostService";
import Accept from "../../popup/Accept";
import Alert from "../../alert/Alert";

interface Post {
    postId: string;
    name: string;
    postContent: string;
    images: string[];
    createdAt: string;
}

function PostsManager() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);

    const fetchPosts = async () => {
        try {
            setError(false);
            const res = await PostService.getAllPosts();
            setPosts(res.data);
        } catch (err: any) {
            setError(true);
            setMessage(err?.response?.data?.message || "Lỗi khi tải danh sách bài viết.");
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            setError(false);
            const res = await PostService.deletePostById(postId);
            setMessage(res.data.message || "Xoá bài viết thành công.");
            setPostToDelete(null);
            await fetchPosts();
        } catch (err: any) {
            setError(true);
            setMessage(err?.response?.data?.message || "Không thể xoá bài viết.");
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <>
            {message && (
                <Alert
                    type={error ? "error" : "success"}
                    message={message}
                    onClose={() => setMessage("")}
                />
            )}

            {postToDelete && (
                <Accept
                    action="Xoá bài viết"
                    isAccept={() => handleDeletePost(postToDelete.postId)}
                    isReject={() => setPostToDelete(null)}
                />
            )}

            <div className="flex flex-col min-h-screen w-full justify-between p-4">
                <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                        <tr>
                            <th className="text-center p-3">ID bài viết</th>
                            <th className="text-center p-3">Tên</th>
                            <th className="text-center p-3">Nội dung</th>
                            <th className="text-center p-3">Ảnh</th>
                            <th className="text-center p-3">Ngày tạo</th>
                            <th className="text-center p-3">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.postId} className="hover:bg-gray-50 border-t border-gray-100 text-center">
                                <td className="p-3 text-gray-600">{post.postId.slice(0,10)}...</td>
                                <td className="p-3 font-medium text-gray-800">{post.name}</td>
                                <td className="p-3 text-gray-600">{post.postContent}</td>
                                <td className="p-3 text-gray-600">
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {post.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Post ${index}`}
                                                className="w-10 h-10 rounded-xl object-cover border"
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="p-3 text-gray-600">{new Date(post.createdAt).toLocaleDateString("vi-VN")}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => setPostToDelete(post)}
                                        className="text-red-500 hover:text-red-700 bg-red-200 rounded-2xl px-3 py-1 hover:bg-red-300"
                                    >
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default PostsManager;
