import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import NavigationMenu from "../../components/layout/NavigationMenu";
import Filter, { FilterData } from "../../components/ui/Filter";
import { postService } from '../../services/postService';
import { favoriteService } from '../../services/favoriteService';
import { PostSummary } from '../../types';

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
            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-green-500 mx-2 mt-6 mb-10 rounded-xl shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-40 translate-y-40"></div>
                    <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white rounded-full opacity-40"></div>
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12">
                    <div className="flex items-start flex-col max-w-2xl">
                        {/* Icon với glow */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/30 shadow-xl">
                            <svg className="w-12 h-12 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.94-.34 3.84-1.15 5.55-2.36C19.16 24.65 22 20.2 22 17V7l-10-5z" />
                                <path d="M12 4.5L4 8.5v8.5c0 4.1 2.84 7.4 6.5 8.3V4.5h1.5z" />
                            </svg>
                        </div>

                        {/* Text */}
                        <h1 className="text-2xl lg:text-5xl  font-bold text-white mb-4 leading-tight">
                            Tìm Kiếm Bất Động Sản
                            <span className="block text-2xl lg:text-3xl font-medium text-green-100 mt-2">
                                Phù Hợp Với Bạn
                            </span>
                        </h1>

                        {/* Search box */}
                        <div className="mt-6 w-full max-w-md">
                            <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden">
                                <input
                                    type="text"
                                    placeholder="Nhập địa điểm, dự án hoặc loại BĐS..."
                                    className="flex-1 px-4 py-3 text-gray-700 outline-none"
                                />
                                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold">
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Building */}
                    <div className="hidden lg:block relative mt-10 lg:mt-0">
                        <div className="w-48 h-48 relative transform rotate-6 hover:rotate-0 transition-transform duration-500">
                            <div className="absolute bottom-0 left-6 w-10 h-32 bg-white/40 rounded-t-lg backdrop-blur-sm"></div>
                            <div className="absolute bottom-0 left-20 w-12 h-40 bg-white/50 rounded-t-lg backdrop-blur-sm"></div>
                            <div className="absolute bottom-0 left-36 w-10 h-36 bg-white/30 rounded-t-lg backdrop-blur-sm"></div>

                            {/* Windows */}
                            <div className="absolute bottom-6 left-8 w-2 h-2 bg-yellow-300 rounded-sm"></div>
                            <div className="absolute bottom-10 left-8 w-2 h-2 bg-yellow-300 rounded-sm"></div>
                            <div className="absolute bottom-14 left-22 w-2 h-2 bg-yellow-300 rounded-sm"></div>
                            <div className="absolute bottom-18 left-22 w-2 h-2 bg-yellow-300 rounded-sm"></div>
                        </div>
                    </div>
                </div>

                {/* Particles */}
                <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-green-200 rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 left-20 w-1.5 h-1.5 bg-blue-200 rounded-full animate-bounce"></div>
            </div>

            {/* Navigation Menu */}
            <div className="mb-10 flex justify-center">
                <NavigationMenu />
            </div>

            {/* Filter Section */}
            <div className="container mx-auto px-4 sm:px-14 lg:px-56 mb-8">
                <Filter onApply={handleFilterApply} loading={filterLoading} />

                {/* Filter Status & Clear Button */}
                {currentFilters && (
                    <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-blue-700">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">
                                Đang áp dụng bộ lọc - Tìm thấy {posts.length} kết quả
                            </span>
                        </div>
                        <button
                            onClick={handleClearFilters}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </div>

            {/* Latest Posts */}
            <div className="container mx-auto px-4 sm:px-14 lg:px-56">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
                    <span className="w-2 h-8 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full mr-3 shadow-sm"></span>
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                to={`/post/${post.id}?from=${currentPageUI > 1 ? `page=${currentPageUI}` : ''}`}
                                className="bg-white rounded-xl shadow-lg p-2 hover:shadow-xl transition-all duration-300 cursor-pointer block relative transform hover:-translate-y-1 border border-gray-100"
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
                                            color="black"
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