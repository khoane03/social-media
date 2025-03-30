interface PhotoProps {
    images: string[];
} 
const Photo = () => {
    return (
        <div>
            {/* {images.map((image, index) => (
                <img key={index} src={image} alt={`Photo ${index}`} />
            ))} */}
        </div>
    );
}
export default Photo;