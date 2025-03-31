import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostService from "../../service/PostService";
import ImageViewer from "../../components/view/ImageViewer";


const Photo = () => {
    const { userId } = useParams<{ userId: string }>();
    const [images, setImages] = useState<string[]>([]); 
    const [selectedImage, setSelectedImage] = useState<string | null>(null); 

    useEffect(() => {
        document.title = "Ảnh của bạn";

        const getAllImages = async () => {
            try {
                if (userId) {
                    const response = await PostService.getPostById(userId);
                    const fetchedImages = response.data.flatMap((post: any) => post.images || []);
                    setImages(fetchedImages); 
                }
            } catch (error) {
                console.error("Failed to fetch images:", error);
            }
        };
        getAllImages();
    }, [userId]); 

    return (
        <div className="p-6 bg-gray-100 min-h-screen md:mx-40">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tất cả ảnh</h2>
            {images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                            onClick={() => setSelectedImage(image)}
                        >
                            <img
                                src={image}
                                alt={`Photo ${index}`}
                                className="w-full h-48 object-cover"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center">Chưa có ảnh nào.</p>
            )}
            {selectedImage && (
                <ImageViewer image={selectedImage} onClose={() => setSelectedImage(null)} />
            )}
        </div>
    );
};

export default Photo;