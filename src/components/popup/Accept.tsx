function Accept({ action, isAccept, isReject }: { action: string, isAccept: () => void, isReject: () => void }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-xs z-[1000]">
            <div className="bg-white p-6 rounded-xl shadow-xl w-80 transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    Bạn có chắc muốn {action}?
                </h2>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={isReject}
                        className="px-5 py-2 text-white font-medium rounded-lg bg-green-500 hover:bg-green-600 transition-all"
                    >
                        Không
                    </button>
                    <button
                        onClick={isAccept}
                        className="px-5 py-2 text-white font-medium rounded-lg bg-red-500 hover:bg-red-600 transition-all">
                        Có
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Accept;