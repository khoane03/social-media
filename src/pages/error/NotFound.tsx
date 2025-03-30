export default function NotFound() {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-9xl font-extrabold text-blue-500">404</h1>
                <p className="text-2xl font-semibold text-gray-800 mt-4">Oops! Page not found.</p>
                <p className="text-gray-600 mt-2">Sorry, the page you are looking for doesn't exist or has been moved.</p>
                <a href="/" className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                    Back to Home
                </a>
            </div>
        </div>
    );
}