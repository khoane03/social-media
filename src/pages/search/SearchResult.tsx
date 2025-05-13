import { CheckCircle, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import UserService from "../../service/UserService";

interface User {
    id: string;
    name: string;
    avatarUrl?: string;
    verifier: boolean;

}

function SearchResult() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const response = await UserService.searchUser(keyword);
                setResults(response.data);
                console.log("Search results:", response.data);

                setError("");
            } catch (err: any) {
                console.error("Search error:", err);
                setError("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        if (keyword.trim()) {
            fetchResults();
        } else {
            setResults([]);
            setLoading(false);
        }
    }, [keyword]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <Search className="mr-2 text-purple-600" />
                Kết quả tìm kiếm cho:
                <span className="ml-2 text-purple-600">"{keyword}"</span>
            </h2>

            {loading ? (
                <p className="text-gray-500">Đang tìm kiếm...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : results.length === 0 ? (
                <p className="text-gray-500">Không tìm thấy kết quả phù hợp.</p>
            ) : (
                <div className="grid gap-4">
                    {results.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-shadow duration-200"
                        >
                            <Link to={`/profile/${user.id}`} className="flex items-center">
                                <img
                                    src={user.avatarUrl || "/default-avatar.png"}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div className="flex items-center">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {user.name}
                                    </h3>
                                    {user.verifier && (
                                        <CheckCircle className="text-blue-500 ml-1" fontSize="small" />
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchResult;
