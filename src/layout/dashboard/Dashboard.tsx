import { Outlet } from "react-router-dom";
import Left from "../../components/admin/menu/Left";
function Dashboard() {
  document.title = "Quản lý hệ thống";
    return (
        <div className="flex h-full bg-gray-100">
            <Left />
            <div className="absolute left-64 min-h-screen w-[calc(100%-16rem)] bg-gray-100 z-10">
                <Outlet/>  
            </div>
        </div>
    );
}

export default Dashboard;