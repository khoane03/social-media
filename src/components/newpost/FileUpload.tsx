import { useState } from "react";
import { CloseOutlined } from "@mui/icons-material";

type FileUploadProps = {
    onFileChange: (files: File[]) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
    const [previews, setPreviews] = useState<string[]>([]);
    const [storedFiles, setStoredFiles] = useState<File[]>([]); // rename cho dễ hiểu hơn

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (!selectedFiles) return;

        const fileArray = Array.from(selectedFiles);
        const previewUrls = await Promise.all(fileArray.map(readFileAsDataURL));

        const updatedFiles = [...storedFiles, ...fileArray];
        setStoredFiles(updatedFiles);
        setPreviews((prev) => [...prev, ...previewUrls]);
        onFileChange(updatedFiles);
    };

    const handleRemoveImage = (index: number) => {
        const updatedFiles = storedFiles.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setStoredFiles(updatedFiles);
        setPreviews(updatedPreviews);
        onFileChange(updatedFiles);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previews.map((preview, index) => (
                    <div key={index} className="relative">
                        <img
                            src={preview}
                            alt={`Preview ${index}`}
                            className="w-64 h-64 object-cover rounded-lg shadow-md"
                        />
                        <CloseOutlined
                            fontSize="large"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-gray-200 text-black rounded-full p-2 hover:bg-gray-300"
                        />
                    </div>
                ))}
            </div>

            <label
                htmlFor="file-upload"
                className="cursor-pointer mt-2 bg-violet-50 px-4 py-2 rounded-full text-violet-700 shadow-md hover:bg-violet-100 transition duration-200"
            >
                Chọn Ảnh
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
            </label>
        </div>
    );
};

export default FileUpload;
