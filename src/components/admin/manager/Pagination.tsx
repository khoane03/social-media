import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-6 p-4 border-t">
      <button
        className="px-4 py-2 border rounded-md disabled:opacity-50 cursor-pointer"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ❮
      </button>

      {pageNumbers.map((num) => (
        <button
          key={num}
          className={`px-4 py-2 border rounded-md cursor-pointer ${
            currentPage === num ? "bg-green-300 text-black" : "hover:bg-gray-300"
          }`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}

      <button
        className="px-4 py-2 border rounded-md disabled:opacity-50 cursor-pointer"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ❯
      </button>
    </div>
  );
};

export default Pagination;
