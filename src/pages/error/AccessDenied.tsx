const AccessDenied = () => {
  const handleGoHome = () => {
   window.location.href = '/';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-lg mb-6">You do not have permission to view this page.</p>
        <div className="space-x-4">
          <button
            onClick={handleGoHome}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
