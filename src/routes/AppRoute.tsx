import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import { UserProvider } from "../context/UserContext";
import MainLayout from "../layout/MainLayout";
import Login from "../pages/auth/Login";
import AuthLayout from "../layout/auth/AuthLayout";
import Register from "../pages/auth/Register";
import Friend from "../components/friends/Friend";
import NotFound from "../pages/error/NotFound";
import AccessDenied from "../pages/error/AccessDenied";
import Profile from "../pages/profile/Profile";
import MainProfile from "../pages/profile/MainProfile";
import { Dashboard } from "@mui/icons-material";
import CommingSoon from "../components/common/CommingSoon";
import Forgot from "../pages/auth/Forgot";
import Photo from "../pages/profile/Photo";
import Friends from "../pages/profile/Friends";

function AppRouter() {
    return (
        <Router>
            <Routes>
            <Route path="/dashboard" element={<Dashboard />}>
                    <Route index element={<CommingSoon />} />
                    
                </Route>
                
                <Route path="/auth" element={<AuthLayout />}>
                    <Route index element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot" element={<Forgot />} />
                </Route>

                <Route
                    path="/profile/:userId"
                    element={
                        <UserProvider>
                            <Profile />
                        </UserProvider>
                    }>
                    <Route index element={<MainProfile />} />
                    <Route path="friend" element={<Friends />} />
                    <Route path="photos" element={<Photo />} />
                </Route>

                // Home page
                <Route path="/" element={
                    <UserProvider>
                        <Home />
                    </UserProvider>
                }>
                    <Route index element={<MainLayout />} />
                    <Route path="friends" element={<Friend />} />
                </Route>

                <Route path="*" element={<NotFound />} />
                <Route path="/no-permission" element={<AccessDenied />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;