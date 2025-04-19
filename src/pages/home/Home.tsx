import { useEffect } from "react";
import { useLocation, useParams, matchPath, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import SidebarLeft from "../../components/sidebar/SidebarLeft";
import CommingSoon from "../../components/common/CommingSoon";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import ViewPost from "../../components/post/ShowPost";

export default function Home() {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();

    // Kiểm tra nếu đường dẫn là /post/:postId
    const isPostModal = matchPath("/post/:postId", location.pathname);

    useEffect(() => {
        document.title = "Social Media";

        if (isPostModal) {
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false);
        }
    }, [location.pathname]);

    return (
        <div className="bg-[rgb(242,244,247)] text-black min-h-screen w-screen flex flex-col">
            {/* Header */}
            <Header />

            {/* Nội dung chính */}
            <div className="flex flex-1 pt-[68px] bg-[#F2F4F7]">
                {/* Sidebar Trái */}
                <div className="flex-[3] overflow-y-auto px-5 md:flex hidden scroll-smooth ">
                    <SidebarLeft />
                </div>

                {/* Outlet */}
                <div className={`${location.pathname === "/friends" ? "flex-[9]" : "flex-[6]"} overflow-y-auto px-4 scroll-smooth `} >
                    <div className={`${location.pathname === "/friends" ? "" : "max-w-[592px]"
                            } justify-center mx-auto h-screen scroll-smooth `} >
                        <Outlet />
                    </div>
                </div>

                {/* Sidebar Phải (ẩn khi ở /friends) */}
                {location.pathname !== "/friends" && (
                    <div className="flex-[3] overflow-y-auto px-5 md:flex hidden scroll-smooth ">
                        <CommingSoon />
                    </div>
                )}
            </div>

            {/* Modal hiển thị nếu là /post/:postId */}
            {isModalOpen && (
                <ViewPost
                    isOpen={isModalOpen}
                    onClose={() => navigate(-1)}
                    postId={postId} 
                />
            )}
        </div>
    );
}
