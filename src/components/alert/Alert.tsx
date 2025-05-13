import { useEffect } from "react";

interface AlertProps {
  message: string;
  type?: "error" | "success" | "warning";
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type = "error", onClose }) => {
  const typeStyles = {
    error: "bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800",
    success: "bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800 ",
    warning: "bg-yellow-100 dark:bg-yellow-900 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-800",
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }
    , [onClose]);

  return (
    <div className="fixed animate-slide-left top-5 right-2 z-[1000]">
      <div role="alert"
        className={`border-l-4 rounded-lg flex items-center p-2 ${typeStyles[type]}`} >
        <svg stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          className={`h-5 w-5 flex-shrink-0 mr-2 ${type === "error" && "text-red-600"} ${type === "warning" && "text-yellow-600"}`}
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path> </svg>
        <p className="text-xs font-semibold">{type === "error" && "Lỗi:"}{type === "success" && "Thành công:"}{type === "warning" && "Cảnh báo:"} - {message}!</p>
        {onClose && (
          <button onClick={onClose}
            className="ml-2 text-white hover:text-gray-900 focus:outline-none">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

