import { Close, CloseOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import UserService from "../../../service/UserService";
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpdateImg: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [type, setType] = useState<string>("Avatar");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const formdata = new FormData();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreview("");
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            formdata.append("type", type);
            if (image) formdata.append("file", image);
            await UserService.updateImage(formdata);
            handleRemoveImage();
            onClose();
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
            handleRemoveImage();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[110]">
            <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
                <div className="flex justify-between items-center border-b pb-2">
                    <p className="text-xl font-bold flex-1 text-center">Cập nhật ảnh</p>
                    <button
                        onClick={onClose}
                        className="text-gray-600 bg-gray-200 border rounded-full hover:text-gray-900 hover:bg-gray-300 w-8 h-8 flex items-center justify-center"
                    >
                        <Close />
                    </button>
                </div>
                <div className="mt-4">
                    <label htmlFor="type" className="block text-sm font-medium mb-1">
                        Loại ảnh
                    </label>
                    <select
                        id="type"
                        className="w-full border rounded p-2"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="Avatar">Ảnh đại diện</option>
                        <option value="Cover">Ảnh bìa</option>
                    </select>
                </div>
                {error && (
                    <p className="text-red-500 mt-4 text-sm">
                        {message}
                    </p>
                )}
                <div className="mt-4 items-center flex flex-col justify-center">
                    <label
                        htmlFor="image"
                        className="cursor-pointer mt-2 bg-violet-50 px-4 py-2 rounded-full text-violet-700 shadow-md hover:bg-violet-100 transition duration-200">
                        Chọn Ảnh
                        <input
                            type="file"
                            id="image"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />
                    </label>
                    {preview && (
                        <div className="relative mt-4 w-full">
                            <img
                                src={preview}
                                alt="Preview"
                                className="mt-4 rounded border w-full h-40 object-cover"
                            />
                            <CloseOutlined onClick={handleRemoveImage}
                                className="absolute top-6 right-2 bg-gray-200 text-black rounded-full p-2 hover:bg-gray-300" />
                        </div>
                    )}
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={handleSubmit}
                        disabled={image === null || loading}
                        className={`px-4 w-full py-2 ${loading ? "bg-green-400" : "bg-purple-500 hover:bg-purple-600"} text-white font-bold rounded-lg `}
                    >
                        {!loading ? "Cập nhật" : "Đang xử lý..."}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateImg;
