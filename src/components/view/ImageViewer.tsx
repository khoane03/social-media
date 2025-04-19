import { useEffect, useState } from "react";
import { Close, ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

interface ImageViewerProps {
  image?: string | null;
  images?: string[];
  onClose: () => void;
}

const ImageViewer = ({ image, images = [], onClose }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    // Nếu mở bằng 1 ảnh đơn lẻ thì reset currentIndex về 0
    if (image) {
      const index = images.indexOf(image);
      setCurrentIndex(index !== -1 ? index : 0);
    }
  }, [image, images]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const displayImage = image || images[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-full max-h-full">
        <img
          src={displayImage}
          alt="Preview"
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        />

        {/* Nút tắt */}
        <button
          className="absolute top-4 right-4 w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700"
          onClick={onClose}
        >
          <Close className="w-6 h-6" />
        </button>

        {/* Nút chuyển trái/phải nếu nhiều ảnh */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <ArrowBackIos />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <ArrowForwardIos />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
