import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import NavigationMenu from "../../components/layout/NavigationMenu";
import Filter, { FilterData } from "../../components/ui/Filter";
import { postService } from '../../services/postService';
import { favoriteService } from '../../services/favoriteService';
import { PostSummary } from '../../types';
import Navbar from "../../components/layout/Navbar";

export default function HomePage() {
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false);
    const [currentFilters, setCurrentFilters] = useState<FilterData | null>(null);

    // Sử dụng URLSearchParams để quản lý page query parameter
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Lấy page từ URL, default là 1 (UI hiển thị 1-based)
    const currentPageUI = parseInt(searchParams.get('page') || '1', 10);

    const fetchPosts = useCallback(async (pageNumberUI: number, filters?: FilterData) => {
        setLoading(true);
        try {
            // Convert UI page (1-based) to API page (0-based)
            const apiPage = pageNumberUI - 1;

            if (filters && (filters.postType || filters.realEstateType || filters.city || filters.priceFrom !== null || filters.priceTo !== null)) {
                console.log('🔍 Calling filter API with:', {
                    page: apiPage,
                    size: 20,
                    realEstateType: filters.realEstateType,
                    postType: filters.postType,
                    city: filters.city,
                    priceFrom: filters.priceFrom,
                    priceTo: filters.priceTo
                });

                // Use filter API
                const data = await postService.filterPosts({
                    page: apiPage,
                    size: 20,
                    realEstateType: filters.realEstateType,
                    postType: filters.postType,
                    city: filters.city,
                    priceFrom: filters.priceFrom,
                    priceTo: filters.priceTo
                });

                console.log('✅ Filter API response:', data);
                setPosts(data.data.items);
                setTotalPages(data.data.totalPage);
            } else {
                console.log('📋 Calling regular API with page:', apiPage);

                // Use regular API
                const data = await postService.getPosts(apiPage, 20);

                console.log('✅ Regular API response:', data);
                setPosts(data.data.items);
                setTotalPages(data.data.totalPage);
            }
        } catch (err) {
            console.error('❌ Error fetching posts:', err);
            // Show user-friendly error message
            alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect để load initial data và khi page thay đổi
    useEffect(() => {
        console.log('🔄 useEffect triggered - currentPageUI:', currentPageUI, 'currentFilters:', currentFilters);
        if (currentFilters) {
            fetchPosts(currentPageUI, currentFilters);
        } else {
            fetchPosts(currentPageUI);
        }
    }, [currentPageUI, fetchPosts]); // Removed currentFilters from dependencies to prevent double call

    const handleFilterApply = async (filters: FilterData) => {
        console.log('=== FILTER APPLY START ===');
        console.log('Filters received:', filters);
        console.log('Price filter values:', { priceFrom: filters.priceFrom, priceTo: filters.priceTo });

        setFilterLoading(true);
        try {
            // Set filters first, then fetch
            setCurrentFilters(filters);
            await fetchPosts(1, filters); // Reset to page 1 when filtering
            navigate('/'); // Reset URL to first page
            console.log('✅ Filter applied successfully');
        } catch (error) {
            console.error('❌ Error applying filters:', error);
        } finally {
            setFilterLoading(false);
        }
        console.log('=== FILTER APPLY END ===');
    };

    const handlePageChange = (newPage: number) => {
        console.log('📄 Page change to:', newPage);
        // Cập nhật URL với page parameter
        if (newPage === 1) {
            // Nếu là trang đầu tiên, không cần page parameter
            navigate('/');
        } else {
            navigate(`/?page=${newPage}`);
        }
        // Scroll to top when changing page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatPrice = (price: number): string => {
        if (price >= 1000000000) {
            return `${(price / 1000000000).toFixed(1)} tỷ`;
        } else if (price >= 1000000) {
            return `${(price / 1000000).toFixed(0)} triệu`;
        }
        return price.toLocaleString('vi-VN');
    };

    // Clear filters function
    const handleClearFilters = () => {
        console.log('🧹 Clearing filters');
        setCurrentFilters(null);
        fetchPosts(1); // Fetch first page without filters
        navigate('/'); // Reset URL
    };

    // Tạo array các số trang để hiển thị (UI 1-based)
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Nếu tổng số trang <= 5, hiển thị tất cả
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Hiển thị logic phức tạp hơn cho nhiều trang
            const startPage = Math.max(1, currentPageUI - 2);
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
        }

        return pageNumbers;
    };

    const handleAddToFavorites = async (postId: string) => {
        try {
            await favoriteService.addToFavorites(postId);
            alert('Đã thêm vào danh sách yêu thích!');
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="sticky top-0 z-50 bg-white shadow-md">
                <Navbar />
            </div>
            {/* Hero Banner */}
            <div className="relative overflow-hidden mb-10 shadow-2xl">
                {/* Banner Image */}
                <img
                    src="/banner.png"
                    alt="Banner"
                    className="w-full h-[300px] md:h-[400px] object-cover"
                />

                {/* Overlay Text bên trái */}
                <div className="absolute top-1/2 left-4 md:left-10 transform -translate-y-1/2 z-10">
                    <div className="bg-white/20 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/30 shadow-lg max-w-[100%] md:max-w-2xl">
                        <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-white leading-tight drop-shadow-md text-center md:text-left">
                            Khám Phá Không Gian Sống
                            <span className="block text-lg md:text-xl lg:text-2xl font-medium text-green-100 mt-2">
                                Được Thiết Kế Dành Riêng Cho Bạn
                            </span>
                        </h1>
                    </div>
                </div>

                {/* Particles (giữ nguyên nếu muốn) */}
                <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-green-200 rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 left-20 w-1.5 h-1.5 bg-blue-200 rounded-full animate-bounce"></div>

                {/* Navigation Menu */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                    <NavigationMenu />
                </div>
            </div>


            {/* Latest Posts */}
            <div className="container mx-auto px-4 sm:px-14 lg:px-56">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
                    <span className="w-2 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full mr-3 shadow-sm"></span>
                    {currentFilters ? 'Kết quả tìm kiếm' : 'Tin đăng mới nhất'}
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-4">Không tìm thấy kết quả nào</div>
                        {currentFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {posts.map((post) => {
                            // Function to convert realEstateType to Vietnamese
                            const getRealEstateTypeVN = (type) => {
                                switch (type) {
                                    case 'LAND':
                                        return 'Đất';
                                    case 'APARTMENT':
                                        return 'Chung cư';
                                    case 'HOUSE':
                                        return 'Nhà';
                                    default:
                                        return type; // Fallback to original value if not matched
                                }
                            };

                            return (
                                <Link
                                    key={post.id}
                                    to={`/post/${post.id}?${currentPageUI > 1 ? `page=${currentPageUI}` : ''}`}
                                    className=" shadow-lghover:shadow-xl transition-all duration-300 cursor-pointer block relative transform hover:-translate-y-1 border-spacing-0 border-gray-100"
                                >
                                    <div className="relative mb-1">
                                        <img
                                            src={post.thumbnailUrl || "/default-thumbnail.jpg"}
                                            alt={post.title}
                                            className="w-full h-32 object-cover rounded-sm"
                                        />
                                        <div
                                            className={`absolute bottom-2 left-2 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-2 ${post.postRank === 'DIAMOND'
                                                ? 'bg-red-600'
                                                : post.postRank === 'GOLD'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-black bg-opacity-60'
                                                }`}
                                        >
                                            {post.postRank === 'DIAMOND' ? (
                                                <>
                                                    {/* 💎 Kim Cương Icon */}
                                                    <svg className="w- h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2L2 7l10 15 10-15-10-5z" />
                                                    </svg>
                                                    <span>VIP</span>
                                                </>
                                            ) : post.postRank === 'GOLD' ? (
                                                <>
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2l2.9 6.9L22 9.2l-5.5 4.8L18 21l-6-3.5L6 21l1.5-7L2 9.2l7.1-0.3L12 2z" />
                                                    </svg>

                                                    <span>Gold</span>
                                                </>
                                            ) : (
                                                <>
                                                    {/* ⏰ Clock Icon */}
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="M12 6v6l4 2" />
                                                    </svg>
                                                    <span>{formatRelativeTime(post.createdAt)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{post.title}</h3>

                                    {/* Giá tiền + biểu tượng trái tim */}
                                    <div className="flex items-center">
                                        <p className="text-red-600 font-bold text-sm">
                                            {post.price < 1_000_000_000
                                                ? `${Math.round(post.price / 1_000_000)} triệu`
                                                : `${(post.price / 1_000_000_000).toFixed(2)} tỷ`}
                                        </p>
                                        {post.square && post.price && (
                                            <div className="flex justify-between text-xs ml-8">
                                                <span className="text-red-600 font-bold">
                                                    {formatPrice(post.price / post.square)}/m²
                                                </span>
                                            </div>
                                        )}


                                    </div>
                                    <div className="max-w-full w-full flex gap-10">
                                        <p className="text-xs text-red-600 font-medium text-center">
                                            {getRealEstateTypeVN(post.realEstateType)}
                                        </p>
                                        <p className="text-xs text-right text-red-600 font-medium ">
                                            {post.square}m²
                                        </p>

                                    </div>

                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Numbered Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 space-x-3">
                        {/* Previous button */}
                        <button
                            onClick={() => handlePageChange(currentPageUI - 1)}
                            disabled={currentPageUI === 1}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            ‹
                        </button>

                        {/* First page if not visible */}
                        {getPageNumbers()[0] > 1 && (
                            <>
                                <button
                                    onClick={() => handlePageChange(1)}
                                    className="w-12 h-12 rounded-lg border border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300 transition-all duration-200 font-medium"
                                >
                                    1
                                </button>
                                {getPageNumbers()[0] > 2 && (
                                    <span className="px-2 text-gray-500">...</span>
                                )}
                            </>
                        )}

                        {/* Page numbers */}
                        {getPageNumbers().map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`w-10 h-10 rounded-lg border transition-all duration-200 font-medium ${currentPageUI === pageNum
                                    ? 'bg-gradient-to-r text-gray-700 border-teal-500 shadow-lg'
                                    : 'border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        ))}

                        {/* Last page if not visible */}
                        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                            <>
                                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                                    <span className="px-2 text-gray-500">...</span>
                                )}
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    className="w-12 h-12 rounded-lg border border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300 transition-all duration-200 font-medium"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}

                        {/* Next button */}
                        <button
                            onClick={() => handlePageChange(currentPageUI + 1)}
                            disabled={currentPageUI === totalPages}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-teal-50 hover:border-teal-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}