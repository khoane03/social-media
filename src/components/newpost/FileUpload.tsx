import { useState } from "react";
import { CloseOutlined } from "@mui/icons-material";

type FileUploadProps = {
    onFileChange: (files: File[]) => void; 
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
    const [previews, setPreviews] = useState<string[]>([]); 
    const [files, setFiles] = useState<File[]>([]); 

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const fileArray = Array.from(selectedFiles); 
            const newPreviews: string[] = [];

            fileArray.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.result) {
                        newPreviews.push(reader.result as string);
                        if (newPreviews.length === fileArray.length) {
                            setPreviews((prev) => [...prev, ...newPreviews]); 
                        }
                    }
                };
                reader.readAsDataURL(file);
            });

            setFiles((prev) => {
                const updatedFiles = [...prev, ...fileArray];
                onFileChange(updatedFiles); 
                return updatedFiles;
            });
        }
    };

    const handleRemoveImage = (index: number) => {
        setFiles((prev) => {
            const updatedFiles = prev.filter((_, i) => i !== index);
            onFileChange(updatedFiles);
            return updatedFiles;
        });
        setPreviews((prev) => prev.filter((_, i) => i !== index)); 
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
                        <CloseOutlined fontSize="large"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-gray-200 text-black rounded-full p-2 hover:bg-gray-300" />
                    </div>
                ))}
            </div>

           
            <label
                htmlFor="file-upload"
                className="cursor-pointer mt-2 bg-violet-50 px-4 py-2 rounded-full text-violet-700 shadow-md hover:bg-violet-100 transition duration-200"
            >
                Chọn Ảnh/Video
            
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
