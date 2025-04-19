import React, { useState } from "react";
import ImageViewer from "../view/ImageViewer";

interface ImageGridProps {
  images: string[];
}

const ImagePost: React.FC<ImageGridProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewAll, setViewAll] = useState(false); 

  const displayedImages = images.slice(0, 4);
  const remainingCount = images.length - 4;

  return (
    <div className="flex flex-wrap w-full relative">
      {images.length === 1 && (
        <div className="w-full h-auto">
          <img
            onClick={() => setSelectedImage(images[0])}
            src={images[0]}
            alt="Single"
            className="w-full h-auto object-cover cursor-pointer"
          />
        </div>
      )}

      {images.length === 2 && (
        <>
          {displayedImages.map((image, index) => (
            <div key={index} className="w-1/2">
              <img
                onClick={() => setSelectedImage(image)}
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover cursor-pointer"
              />
            </div>
          ))}
        </>
      )}

      {images.length === 3 && (
        <>
          <div className="w-1/2">
            {displayedImages.slice(0, 2).map((image, index) => (
              <div key={index} className="w-full h-auto mb-2">
                <img
                  onClick={() => setSelectedImage(image)}
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto object-cover cursor-pointer"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
          <div className="w-1/2">
            <img
              onClick={() => setSelectedImage(displayedImages[2])}
              src={displayedImages[2]}
              alt="Image 3"
              className="w-full h-auto object-cover cursor-pointer"
            />
          </div>
        </>
      )}

      {images.length >= 4 && (
        <>
          {displayedImages.map((image, index) => {
            const isLast = index === 3 && remainingCount > 0;

            return (
              <div key={index} className="w-1/2 relative">
                <img
                  onClick={() =>
                    isLast ? setViewAll(true) : setSelectedImage(image)
                  }
                  src={image}
                  alt={`Image ${index + 1}`}
                  className={`w-full h-auto object-cover cursor-pointer ${isLast ? "brightness-50" : ""}`}
                />
                {isLast && (
                  <div
                    onClick={() => setViewAll(true)}
                    className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold cursor-pointer bg-black/50 bg-opacity-40"
                  >
                    +{remainingCount}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* Mở ImageViewer theo từng ảnh hoặc toàn bộ */}
      {selectedImage && (
        <ImageViewer image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
      {viewAll && (
        <ImageViewer image={null} images={images} onClose={() => setViewAll(false)} />
      )}
    </div>
  );
};

export default ImagePost;
