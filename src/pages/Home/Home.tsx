import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HomePage() {
    interface PostSummaryDTO {
        id: string;
        postRank: string;
        postType: string;
        thumbnailUrl: string;
        realEstateType: string;
        title: string;
        status: string;
        createdAt: string;

        price: number;
        direction: string;
        square: number;
        streetWidth: number;
        bedrooms: number;
        bathrooms: number;
        floors: number;
        diningRoom: boolean;
        kitchen: boolean;
        rooftop: boolean;
        carPark: boolean;

        imageUrls: string;
    }

    const [posts, setPosts] = useState<PostSummaryDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetch(`http://localhost:8081/api/posts/summary?page=${page}&size=10`)
            .then((res) => res.json())
            .then((data) => {
                setPosts(data.data?.items ?? []);
                setTotalPages(data.data?.totalPages ?? 1);
            })
            .catch((err) => {
                console.error("Lỗi khi fetch bài đăng:", err);
            });
    }, [page]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl mx-4 mt-8 mb-8 p-8">
                <div className="relative z-10 flex items-center">
                    <div className="bg-white rounded-full p-4 mr-6">
                        <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Đăng Tin Bất Động Sản</h1>
                        <p className="text-white text-lg opacity-90">
                            Đăng tin nhanh chóng, hiệu quả và tiếp cận hàng ngàn khách hàng tiềm năng.
                        </p>
                    </div>
                </div>
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20">
                    <div className="w-32 h-32 bg-white rounded-lg relative">
                        <div className="absolute bottom-0 left-0 w-2/3 h-3/4 bg-white"></div>
                        <div className="absolute bottom-0 right-0 w-1/3 h-3/4 bg-gray-400"></div>
                        <div className="absolute top-0 left-0 right-0 h-1/4 bg-gray-400 rounded-t-lg"></div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="bg-white rounded-2xl mx-4 p-8 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Cards omitted for brevity */}
                </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-8">
                <Link
                    to="/add-post"
                    className="inline-block px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-lg font-semibold"
                >
                    ➕ Bắt đầu đăng tin ngay
                </Link>
            </div>

            {/* Latest Posts */}
            <div className="mt-12 px-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Tin đăng mới nhất</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
                            <img
                                src={post.thumbnailUrl || "/default-thumbnail.jpg"}
                                alt={post.title}
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                            <p className="text-gray-600">{post.realEstateType} • {post.square} m²</p>
                            <p className="text-green-600 font-bold mt-2">{post.price?.toLocaleString()} VNĐ</p>
                            <Link
                                to={`/post/${post.id}`}
                                className="inline-block mt-4 text-blue-600 hover:underline font-medium"
                            >
                                Xem chi tiết →
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        ← Trang trước
                    </button>
                    <span className="px-4 py-2 text-gray-700 font-medium">
                        Trang {page + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        Trang sau →
                    </button>
                </div>
            </div>
        </div>
    );
}
