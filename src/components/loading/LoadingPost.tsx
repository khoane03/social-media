function LoadingPost() {
    return (
        <div className="animate-pulse bg-white w-full h-auto rounded-xl shadow-md py-3 mb-4">
            <div className="flex items-center px-4 py-2">
                <div className="w-10 h-10 mr-2">
                    <img src={'default.png'}
                        className="w-10 h-10 rounded-full border border-gray-400" />
                </div>
                <div>
                    <div className="flex items-center">
                        <div className="bg-gray-200 w-20 p-2 rounded-3xl" >
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-[95%] mx-auto h-32 bg-gray-200 animate-pulse rounded-lg mb-4"> </div>
        </div>
    );
}

export default LoadingPost;