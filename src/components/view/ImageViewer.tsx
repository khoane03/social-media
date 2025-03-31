import { useEffect } from "react";
import { Close } from "@mui/icons-material"; // Import icon nút tắt từ MUI

const ImageViewer = ({ image, onClose }: { image: string; onClose: () => void }) => {
    useEffect(() => {
        if (image) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [image]);

    return (
            <div className="fixed inset-0 bg-black/80 bg-opacity-80 flex items-center justify-center z-50 p-4">
                <div className="relative max-w-full max-h-full">
                    <img
                        src={image}
                        alt="Full view"
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                    />
                    <button
                        className="absolute top-4 right-4 w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => onClose()}
                    >
                        <Close className="w-6 h-6" />
                    </button>
                </div>
            </div>
    );
};

export default ImageViewer;