import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div className="relative w-screen h-screen bg-gradient-to-r from-[#588BF0] to-[#A08CED] flex items-center justify-center">
            <div className="fixed inset-0 bg-gradient-to-r to-[#455c8a] from-[#ccc3ee] clip-path-triangle-right"></div>
            <div className="relative bg-gray-200 md:min-w-[768px] w-[350px] max-w-screen h-[480px] border border-gray-800 shadow-lg overflow-hidden rounded-xl">
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;