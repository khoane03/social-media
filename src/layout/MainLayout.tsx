import LoadingPost from "../components/loading/LoadingPost";
import NewPost from "../components/newpost/NewPost";
import Post from "../components/post/Post";
import PostService from "../service/PostService";
import { useEffect, useMemo, useState } from "react";

export default function MainLayout() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const rep = await PostService.getAllPosts();
                setPosts(rep.data);
            } catch (err) {
                setError('Failed to fetch posts');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Sử dụng useMemo để tránh render lại khi posts không thay đổi
    const memoizedPosts = useMemo(() => posts, [posts]);

    return (
        <>
            <div>
                <NewPost />
            </div>
            <div className="mt-5">
                {isLoading ? (
                    <LoadingPost/>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <Post posts={memoizedPosts} />
                )}
            </div>
        </>
    );
}