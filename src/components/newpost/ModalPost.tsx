import { useState } from "react";
import { Close } from "@mui/icons-material";
import FileUpload from "./FileUpload";
import PostService from "../../../service/PostService";

type AddPostProps = {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
};

const ModalPost = ({ isOpen, setOpen }: AddPostProps) => {
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handlePost = async () => {
        if (!content.trim() && files.length === 0) {
            setError(true);
            setMessage("Vui lòng nhập nội dung hoặc thêm ít nhất một tệp!");
            return;
        }

        const formData = new FormData();
        formData.append("content", content);
        files.forEach((file) => {

            formData.append("files", file);
        });
        console.log("formData", formData);

        try {
            setLoading(true);
            await PostService.addPost(formData);
            setOpen(false);
            setError(false);
            setContent("");
            setFiles([]);
        } catch (error: any) {
            setError(true);
            if (error.response) {
                setMessage("Lỗi từ server: " + error.response.data.errMess);
            } else if (error.request) {
                setMessage("Không có phản hồi từ server: " + error.request);
            } else {
                setMessage("Lỗi không xác định");
            }
        } finally {
            setLoading(false);
            setError(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-30 h-screen w-screen">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-[90%] max-w-md max-h-screen p-6 flex flex-col">
                    <div className="flex justify-between items-center border-b pb-2">
                        <p className="text-xl font-bold flex-1 text-center">Tạo bài viết</p>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-gray-600 bg-gray-200 border rounded-full hover:text-gray-900 hover:bg-gray-300 w-8 h-8 flex items-center justify-center"
                        >
                            <Close />
                        </button>
                    </div>

                    <div className="flex-grow mt-4">
                        <textarea
                            className="resize-none w-full h-full py-2 outline-none"
                            placeholder="Cậu đang nghĩ gì thế?"
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                setError(false);
                            }}
                        />
                    </div>
                    {error &&
                        <p className="text-red-500 mt-4 text-sm">
                            {message}
                        </p>}
                    <div className="mt-4 items-center cursor-pointer">
                        <FileUpload onFileChange={(selectedFiles) => setFiles(selectedFiles)} />
                    </div>

                    <div className="mt-4">

                        <button
                            onClick={handlePost}
                            disabled={loading}
                            className={`px-4 w-full py-2 ${loading ? "bg-green-400" : "bg-purple-500 hover:bg-purple-600"} text-white font-bold rounded-lg `}
                        >
                            {!loading ? "Đăng bài" : "Đang xử lý..."}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalPost;
