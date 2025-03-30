import Header from "../../components/header/Header";
import { Outlet } from "react-router-dom";
import SidebarLeft from "../../components/sidebar/SidebarLeft";
import CommingSoon from "../../components/common/CommingSoon";

export default function Home() {
    document.title = "Social Media";    
    return (
        <div className="bg-[rgb(242,244,247)] text-black h-screen w-screen">
            <Header />

            <div className="bg-[#F2F4F7] flex h-screen translate-y-[68px]">
                <div className="flex-[3] overflow-y-auto px-5 md:flex hidden">
                    <SidebarLeft />
                </div>

                <div className="flex-[6] overflow-y-auto px-4">
                    <div className="max-w-[592px] justify-center mx-auto h-[1000px]">

                       <Outlet/>
                    </div>
                </div>

                <div className="flex-[3] overflow-y-auto px-5 md:flex hidden">
                    <div className="">
                        <CommingSoon />
                    </div>
                </div>
            </div>

        </div>


    );
}