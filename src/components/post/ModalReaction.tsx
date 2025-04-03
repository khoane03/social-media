import { 
    FavoriteBorder, 
    SentimentDissatisfied, 
    SentimentSatisfiedAlt, 
    ThumbUpOffAlt 
} from "@mui/icons-material";
import { JSX } from "react";

const reactions: { type: "LIKE" | "LOVE" | "HAHA" | "ANGRY"; label: string; icon: JSX.Element; hoverClass: string }[] = [
    { type: "LIKE", label: "Thích", icon: <ThumbUpOffAlt className="text-blue-500" />, hoverClass: "hover:text-blue-600" },
    { type: "LOVE", label: "Yêu thích", icon: <FavoriteBorder className="text-pink-500" />, hoverClass: "hover:text-pink-600" },
    { type: "HAHA", label: "Vui vẻ", icon: <SentimentSatisfiedAlt className="text-orange-500" />, hoverClass: "hover:text-orange-600" },
    { type: "ANGRY", label: "Buồn", icon: <SentimentDissatisfied className="text-red-500" />, hoverClass: "hover:text-red-600" }
];
interface ModalReactionProps {
    handleReaction: (reactionType: "LIKE" | "LOVE" | "HAHA" | "ANGRY") => void;
}

const ModalReaction: React.FC<ModalReactionProps> = ({ handleReaction }) => {
    return (
        <div className="bg-white rounded-4xl border border-gray-300 shadow-lg p-2 flex justify-center">
            <div className="flex space-x-6">
                {reactions.map(({ type, label, icon, hoverClass }) => (
                    <div key={type} 
                        onClick={() => handleReaction(type)} 
                        className={`relative flex flex-col items-center gap-1 cursor-pointer transition-transform duration-200 group ${hoverClass}`}>
                        {icon}
                        <span className="absolute -top-10 text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModalReaction;
