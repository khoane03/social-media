import NewPost from "../components/newpost/NewPost";
import Post from "../components/post/Post";
import PostService from "../service/PostService";
import { useEffect, useState } from "react";

export default function MainLayout() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        (async () => {
            const rep = await PostService.getAllPosts();
            setPosts(rep.data);
        })();

    }, []);
    return (
        <>
            <div>
                <NewPost />
            </div >
            <div className="mt-5">
                <Post posts={posts} />
            </div>
        </>
    );
}