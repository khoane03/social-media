import React from "react";

interface DescriptionProps {
    description: string;
}

const Description: React.FC<DescriptionProps> = ({ description }) => {
    return (
        <div className="absolute group-hover/edit:flex hidden bottom-[-3rem] bg-gray-950 opacity-75 items-center justify-center rounded-lg w-auto">
            <p className="text-white text-sm p-2">{description}</p>
        </div>
    );
}
export default Description;