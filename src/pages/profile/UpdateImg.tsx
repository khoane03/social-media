import { Close, CloseOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import UserService from "../../../service/UserService";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    typeDefault?: string;
}

const UpdateImg: React.FC<ModalProps> = ({ isOpen, onClose, typeDefault }) => {
    const [type, setType] = useState<string>(typeDefault || "Avatar");
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
    };

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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[110] backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 text-center w-full">Cập nhật ảnh</h2>
                    <button onClick={() => {
                        onClose()
                        setType("")
                    }}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition" >
                        <Close />
                    </button>
                </div>

                {/* Select Type */}
                {/* Type Selection */}
                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Loại ảnh</p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setType("Avatar")}
                            className={`flex-1 py-2 rounded-lg border transition font-medium
                                         ${type === "Avatar"
                                    ? "bg-violet-600 text-white border-violet-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                        >
                            Ảnh đại diện
                        </button>
                        <button
                            onClick={() => setType("Cover")}
                            className={`flex-1 py-2 rounded-lg border transition font-medium
                                    ${type === "Cover"
                                    ? "bg-violet-600 text-white border-violet-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                        >
                            Ảnh bìa
                        </button>
                    </div>
                </div>


                {/* Error Message */}
                {error && (
                    <p className="text-red-500 mb-4 text-sm">
                        {message}
                    </p>
                )}

                {/* Image Upload */}
                <div className="flex flex-col items-center">
                    <label
                        htmlFor="image"
                        className="cursor-pointer bg-violet-100 px-4 py-2 rounded-full text-violet-700 font-medium shadow hover:bg-violet-200 transition"
                    >
                        Chọn Ảnh
                        <input
                            type="file"
                            id="image"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>

                    {preview && (
                        <div className="relative mt-4 w-full h-48 rounded-xl overflow-hidden shadow border border-gray-200">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-white/70 backdrop-blur-sm p-1 rounded-full hover:bg-white shadow"
                            >
                                <CloseOutlined fontSize="small" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={image === null || loading}
                        className={`w-full py-2 rounded-lg text-white font-semibold transition duration-200 ${image && !loading
                            ? "bg-violet-600 hover:bg-violet-700"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Đang xử lý..." : "Cập nhật"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateImg;
