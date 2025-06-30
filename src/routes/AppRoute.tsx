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
import Forgot from "../pages/auth/Forgot";
import Photo from "../pages/profile/Photo";
import Friends from "../pages/profile/Friends";
import ChatLayout from "../layout/chats/ChatLayout";
import Dashboard from "../layout/dashboard/Dashboard";
import Overview from "../components/admin/manager/Overview";
import AccountCard from "../components/admin/manager/AccountCard";
import Info from "../components/admin/manager/Info";
import PostsManager from "../components/admin/manager/PostsManager";
import AdminLogin from "../components/admin/login/AdminLogin";
import SearchResult from "../pages/search/SearchResult";

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />}>
                    <Route index element={<Overview />} />
                    <Route path="account" element={<AccountCard />} />
                    <Route path="post" element={<PostsManager />} />
                    <Route path="info" element={<Info />} />
                </Route>

                {/* Auth page */}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route index element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot" element={<Forgot />} />
                    <Route path="admin" element={<AdminLogin />} />
                </Route>
                {/* Profile page */}
                <Route
                    path="/profile/:userId?"
                    element={
                        <UserProvider>
                            <Profile />
                        </UserProvider>
                    }>
                    <Route index element={<MainProfile />} />
                    <Route path="friend" element={<Friends />} />
                    <Route path="photos" element={<Photo />} />
                </Route>

                {/* Home page */}
                <Route path="/" element={
                    <UserProvider>
                        <Home />
                    </UserProvider>
                }>
                    <Route index element={<MainLayout />} />
                    <Route path="friends" element={<Friend />} />
                    <Route path="/search" element={<SearchResult />} />
                </Route>


                {/* CHAT */}
                <Route path="/chat/:userId?" element={
                    <UserProvider>
                        <ChatLayout />
                    </UserProvider>
                }>
                </Route>

                <Route path="*" element={<NotFound />} />
                <Route path="/no-permission" element={<AccessDenied />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;