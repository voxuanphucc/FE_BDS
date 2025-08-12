import { Link, useSearchParams, useNavigate } from "react-router-dom";
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
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // Sử dụng URLSearchParams để quản lý page query parameter
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Lấy page từ URL, default là 0
    const currentPage = parseInt(searchParams.get('page') || '0', 10);



    const fetchPosts = async (pageNumber: number) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8081/api/posts/summary?page=${pageNumber}&size=20`);
            const data = await response.json();

            if (data.status === "success") {
                setPosts(data.data?.items ?? []);
                // Tính tổng số trang dựa trên tổng số item và size
                const totalItems = data.data?.total ?? 0;
                const calculatedTotalPages = Math.ceil(totalItems / 10);
                setTotalPages(calculatedTotalPages);
            }
        } catch (err) {
            console.error("Lỗi khi fetch bài đăng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        // Cập nhật URL với page parameter
        if (newPage === 0) {
            // Nếu là trang đầu tiên, không cần page parameter
            navigate('/');
        } else {
            navigate(`/?page=${newPage}`);
        }
        // Scroll to top when changing page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Tạo array các số trang để hiển thị
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Nếu tổng số trang <= 5, hiển thị tất cả
            for (let i = 0; i < totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Hiển thị logic phức tạp hơn cho nhiều trang
            const startPage = Math.max(0, currentPage - 2);
            const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
        }

        return pageNumbers;
    };
    const handleAddToFavorites = async (postId: string) => {
        try {
            const response = await fetch(`http://localhost:8081/api/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });

            const result = await response.json();
            if (result.status === 'success') {
                alert('Đã thêm vào danh sách yêu thích!');
            } else {
                alert('Không thể thêm vào yêu thích.');
            }
        } catch (error) {
            console.error('Lỗi khi thêm vào yêu thích:', error);
            alert('Đã xảy ra lỗi.');
        }
    };

    function formatRelativeTime(dateString: string) {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffMs = now.getTime() - postDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hôm nay';
        if (diffDays === 1) return '1 ngày trước';
        if (diffDays < 7) return `${diffDays} ngày trước`;
        if (diffDays < 14) return '1 tuần trước';
        if (diffDays < 21) return '2 tuần trước';
        return `${Math.floor(diffDays / 7)} tuần trước`;
    }

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

            {/* Latest Posts */}
            <div className="container mx-auto px-4 sm:px-14 lg:px-56">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Tin đăng mới nhất</h2>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                to={`/post/${post.id}?from=${currentPage > 0 ? `page=${currentPage}` : ''}`}
                                className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow cursor-pointer block relative"
                            >
                                <div className="relative mb-3">
                                    <img
                                        src={post.thumbnailUrl || "/default-thumbnail.jpg"}
                                        alt={post.title}
                                        className="w-full h-32 object-cover rounded-md"
                                    />
                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                        {post.postRank === 'DIAMOND'
                                            ? '🔥 Tin hot'
                                            : post.postRank === 'GOLD'
                                                ? '✨ Tin nổi bật'
                                                : formatRelativeTime(post.createdAt)}

                                    </div>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{post.title}</h3>


                                {/* Giá tiền + biểu tượng trái tim */}
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-red-600 font-bold text-sm">
                                        {post.price < 1_000_000_000
                                            ? `${Math.round(post.price / 1_000_000)} triệu VNĐ`
                                            : `${(post.price / 1_000_000_000).toFixed(2)} tỷ VNĐ`}
                                    </p>

                                    <p className="text-xs text-red-600 font-medium text-center">
                                        {post.realEstateType} • {post.square}m²
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault(); // Ngăn click vào Link
                                            e.stopPropagation(); // Ngăn lan sự kiện
                                            handleAddToFavorites(post.id);
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                        title="Thêm vào yêu thích"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            color="black    "
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Numbered Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-8 space-x-2">
                        {/* Previous button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ‹
                        </button>

                        {/* First page if not visible */}
                        {getPageNumbers()[0] > 0 && (
                            <>
                                <button
                                    onClick={() => handlePageChange(0)}
                                    className="w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    1
                                </button>
                                {getPageNumbers()[0] > 1 && (
                                    <span className="px-2 text-gray-500">...</span>
                                )}
                            </>
                        )}

                        {/* Page numbers */}
                        {getPageNumbers().map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-10 h-10 rounded-lg border transition-colors font-medium ${currentPage === pageNum
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {pageNum + 1}
                            </button>
                        ))}

                        {/* Last page if not visible */}
                        {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                            <>
                                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 2 && (
                                    <span className="px-2 text-gray-500">...</span>
                                )}
                                <button
                                    onClick={() => handlePageChange(totalPages - 1)}
                                    className="w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}

                        {/* Next button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}