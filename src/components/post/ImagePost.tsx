import React from "react";

interface ImageGridProps {
  images: string[]; 
}

const ImagePost: React.FC<ImageGridProps> = ({ images }) => {
  
  const displayedImages = images.slice(0, 4);

  return (
    <div className="flex flex-wrap w-full">
      {images.length === 1 && (
        <div className="w-full h-auto">
          <img src={images[0]} alt="Single" className="w-full h-auto object-cover" />
        </div>
      )}
      {images.length === 2 && (
        <>
          {displayedImages.map((image, index) => (
            <div key={index} className="w-1/2">
              <img src={image} alt={`Image ${index + 1}`} className="w-full h-auto object-cover" />
            </div>
          ))}
        </>
      )}
      {images.length === 3 && (
        <>
          <div className="w-1/2">
            {displayedImages.slice(0, 2).map((image, index) => (
              <div key={index} className="w-full h-auto mb-2">
                <img src={image} alt={`Image ${index + 1}`} className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>
          <div className="w-1/2">
            <img src={displayedImages[2]} alt="Image 3" className="w-full h-auto object-cover" />
          </div>
        </>
      )}
      {images.length === 4 && (
        <>
          {displayedImages.map((image, index) => (
            <div key={index} className="w-1/2">
              <img src={image} alt={`Image ${index + 1}`} className="w-full h-auto object-cover" />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ImagePost;
