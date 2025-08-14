import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
    const [currentFilters, setCurrentFilters] = useState<FilterData | null>(null); // Track active filters

    // Sử dụng URLSearchParams để quản lý page query parameter
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Lấy page từ URL, default là 1 (UI hiển thị 1-based)
    const currentPageUI = parseInt(searchParams.get('page') || '1', 10);

    const fetchPosts = async (pageNumberUI: number, filters?: FilterData) => {
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
                setCurrentFilters(filters); // Save current filters
            } else {
                console.log('📋 Calling regular API with page:', apiPage);

                // Use regular API
                const data = await postService.getPosts(apiPage, 20);

                console.log('✅ Regular API response:', data);
                setPosts(data.data.items);
                setTotalPages(data.data.totalPage);
                setCurrentFilters(null); // Clear filters when using regular API
            }
        } catch (err) {
            console.error('❌ Error fetching posts:', err);
            // Show user-friendly error message
            alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // When page changes, use current filters if any
        if (currentFilters) {
            fetchPosts(currentPageUI, currentFilters);
        } else {
            fetchPosts(currentPageUI);
        }
    }, [currentPageUI, currentFilters]);

    const handleFilterApply = async (filters: FilterData) => {
        console.log('=== FILTER APPLY DEBUG ===');
        console.log('Filters received:', filters);
        console.log('Price filter values:', { priceFrom: filters.priceFrom, priceTo: filters.priceTo });
        console.log('==========================');

        setFilterLoading(true);
        try {
            await fetchPosts(1, filters); // Reset to page 1 when filtering
            navigate('/'); // Reset URL to first page
        } catch (error) {
            console.error('Error applying filters:', error);
        } finally {
            setFilterLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
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
            <div className="relative bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl mx-4 mt-8 mb-8 p-8 shadow-xl">
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