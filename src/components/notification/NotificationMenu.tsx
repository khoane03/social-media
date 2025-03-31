// Component NotificationMenu
const NotificationMenu = ({ open }: { open: boolean }) => (
    <div
        className={`absolute right-0 top-[110%] w-72 bg-white shadow-xl border border-gray-200 rounded-lg p-4 transition-all duration-300 ease-in-out transform ${
            open
                ? "opacity-100 scale-100 visible"
                : "opacity-0 scale-95 invisible pointer-events-none"
        }`}
    >
        <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-1">
            Thông báo
        </h3>
        <ul className="space-y-1 text-sm text-gray-700">
            <li className="p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Bạn có 1 tin nhắn mới
            </li>
            <li className="p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Ai đó đã thích bài viết của bạn
            </li>
            <li className="p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Bạn có một lời mời kết bạn
            </li>
        </ul>
    </div>
);

export default NotificationMenu;