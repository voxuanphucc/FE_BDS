import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
    ArrowLeft,
    MapPin,
    DollarSign,
    Calendar,
    Ruler,
    Home,
    Bath,
    Bed,
    Car,
    ChefHat,
    Building,
    Star,
    Share2,
    Heart,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface PostFullDTO {
    id: string;
    postRank: string;
    postType: string;
    thumbnailUrl: string;
    realEstateType: string;
    title: string;
    content: string;
    status: string;
    createdAt: string;

    // Post detail fields (can be null)
    price?: number;
    direction?: string;
    square?: number;
    length?: number;
    width?: number;
    streetWidth?: number;
    legal?: string;
    bedrooms?: number;
    bathrooms?: number;
    floors?: number;
    yearBuilt?: string;
    diningRoom?: boolean;
    kitchen?: boolean;
    rooftop?: boolean;
    carPark?: boolean;
    owner?: boolean;

    // Images
    imageUrls?: string[];
}

interface ApiResponseSuccess<T> {
    code: number;
    message: string;
    data: T;
}

const PostDetailPage: React.FC = () => {
    const [post, setPost] = useState<PostFullDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isLiked, setIsLiked] = useState<boolean>(false);

    // Sử dụng useParams để lấy postId từ URL
    const { postId } = useParams<{ postId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Lấy thông tin trang trước đó từ query parameter 'from'
    const fromParam = searchParams.get('from');

    useEffect(() => {
        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const fetchPost = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:8081/api/posts/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Không thể tải thông tin bài viết`);
            }

            // Handle ApiResponseSuccess structure
            const apiResponse = await response.json();

            // Check if the response has the expected structure
            if (apiResponse.code === 200 && apiResponse.data) {
                setPost(apiResponse.data);
            } else {
                throw new Error(apiResponse.message || 'Không thể tải dữ liệu');
            }

        } catch (err) {
            console.error('Error fetching post:', err);
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        if (fromParam) {
            // Nếu có thông tin trang trước, quay lại trang đó
            navigate(`/home?${fromParam}`);
        } else {
            // Nếu không có thông tin, quay lại trang chủ
            navigate('/home ');
        }
    };

    const formatPrice = (price: number): string => {
        if (price >= 1000000000) {
            return `${(price / 1000000000).toFixed(1)} tỷ`;
        } else if (price >= 1000000) {
            return `${(price / 1000000).toFixed(0)} triệu`;
        }
        return price.toLocaleString('vi-VN');
    };

    const getRankDisplay = (rank: string) => {
        const rankMap = {
            'COPPER': { icon: '🥉', label: 'Đồng', color: 'bg-amber-600' },
            'SILVER': { icon: '🥈', label: 'Bạc', color: 'bg-gray-500' },
            'GOLD': { icon: '🥇', label: 'Vàng', color: 'bg-yellow-500' },
            'DIAMOND': { icon: '💎', label: 'Kim cương', color: 'bg-blue-600' }
        };
        return rankMap[rank as keyof typeof rankMap] || rankMap.COPPER;
    };

    const getTypeDisplay = (type: string) => {
        const typeMap = {
            'SALE': { icon: '🏠', label: 'Bán', color: 'text-green-600' },
            'RENT': { icon: '🏘️', label: 'Cho thuê', color: 'text-blue-600' }
        };
        return typeMap[type as keyof typeof typeMap] || typeMap.SALE;
    };

    const getRealEstateTypeDisplay = (type: string) => {
        const typeMap = {
            'HOUSE': 'Nhà ở',
            'APARTMENT': 'Chung cư',
            'LAND': 'Đất nền',
            'COMMERCIAL': 'Thương mại'
        };
        return typeMap[type as keyof typeof typeMap] || type;
    };

    const getDirectionDisplay = (direction: string) => {
        const directionMap = {
            'NORTH': 'Bắc',
            'SOUTH': 'Nam',
            'EAST': 'Đông',
            'WEST': 'Tây',
            'NORTHEAST': 'Đông Bắc',
            'NORTHWEST': 'Tây Bắc',
            'SOUTHEAST': 'Đông Nam',
            'SOUTHWEST': 'Tây Nam'
        };
        return directionMap[direction as keyof typeof directionMap] || direction;
    };

    const getLegalDisplay = (legal: string) => {
        const legalMap = {
            'RED_BOOK': 'Sổ đỏ',
            'PINK_BOOK': 'Sổ hồng',
            'SALES_CONTRACT': 'Hợp đồng mua bán',
            'WAITING_FOR_BOOK': 'Chờ sổ',
            'OTHER': 'Khác'
        };
        return legalMap[legal as keyof typeof legalMap] || legal;
    };

    const nextImage = () => {
        if (post?.imageUrls) {
            setCurrentImageIndex((prev) =>
                prev === post.imageUrls!.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (post?.imageUrls) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? post.imageUrls!.length - 1 : prev - 1
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
                    <div className="text-red-500 mb-4">
                        <Home className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải bài viết</h2>
                    <p className="text-red-600 mb-6">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={fetchPost}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Thử lại
                        </button>
                        <button
                            onClick={handleGoBack}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Quay lại
                        </button>

                    </div>
                </div>
            </div>
        );
    }

    if (!post) return null;

    const rankDisplay = getRankDisplay(post.postRank);
    const typeDisplay = getTypeDisplay(post.postType);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleGoBack}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Quay lại</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                            </button>
                            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="relative">
                                {post.imageUrls && post.imageUrls.length > 0 ? (
                                    <>
                                        <div className="relative w-full h-96 overflow-hidden">
                                            {/* Background blur layer */}
                                            <img
                                                src={post.imageUrls[currentImageIndex]}
                                                alt="Blurred background"
                                                className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
                                            />

                                            {/* Foreground image */}
                                            <img
                                                src={post.imageUrls[currentImageIndex]}
                                                alt={`Property ${currentImageIndex + 1}`}
                                                className="relative z-10 w-full h-full object-contain"
                                            />
                                        </div>

                                        {post.imageUrls.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                                >
                                                    <ChevronLeft className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                                >
                                                    <ChevronRight className="h-5 w-5" />
                                                </button>
                                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                                    {post.imageUrls.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setCurrentImageIndex(index)}
                                                            className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                                        <Home className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}

                                {/* Rank Badge */}
                                <div className={`absolute top-4 left-4 ${rankDisplay.color} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 z-10`}>
                                    <span>{rankDisplay.icon}</span>
                                    <span>{rankDisplay.label}</span>
                                </div>

                                {/* Type Badge */}
                                <div className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${typeDisplay.color} z-10`}>
                                    <span>{typeDisplay.icon}</span>
                                    <span>{typeDisplay.label}</span>
                                </div>
                            </div>

                            {/* Thumbnail Grid */}
                            {post.imageUrls && post.imageUrls.length > 1 && (
                                <div className="p-4 border-t">
                                    <div className="flex gap-2 overflow-x-auto">
                                        {post.imageUrls.map((url, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                                                    }`}
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Property Info */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Đăng ngày {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                    <span>•</span>
                                    <span>{getRealEstateTypeDisplay(post.realEstateType)}</span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                    <span className="text-3xl font-bold text-green-600">
                                        {post.price ? formatPrice(post.price) + ' VND' : 'Liên hệ'}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Mô tả chi tiết</h2>
                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {post.content}
                                </div>
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông số kỹ thuật</h2>

                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {post.square && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Ruler className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Diện tích</p>
                                            <p className="font-semibold">{post.square} m²</p>
                                        </div>
                                    </div>
                                )}

                                {post.bedrooms && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Bed className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phòng ngủ</p>
                                            <p className="font-semibold">{post.bedrooms} phòng</p>
                                        </div>
                                    </div>
                                )}

                                {post.bathrooms && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Bath className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phòng tắm</p>
                                            <p className="font-semibold">{post.bathrooms} phòng</p>
                                        </div>
                                    </div>
                                )}

                                {post.floors && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <Building className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Số tầng</p>
                                            <p className="font-semibold">{post.floors} tầng</p>
                                        </div>
                                    </div>
                                )}

                                {post.direction && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-100 rounded-lg">
                                            <MapPin className="h-5 w-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Hướng nhà</p>
                                            <p className="font-semibold">{getDirectionDisplay(post.direction)}</p>
                                        </div>
                                    </div>
                                )}

                                {post.legal && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <Star className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Pháp lý</p>
                                            <p className="font-semibold">{getLegalDisplay(post.legal)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Dimensions */}
                            {(post.length || post.width || post.streetWidth) && (
                                <div className="mt-6 pt-6 border-t">
                                    <h3 className="font-semibold text-gray-900 mb-4">Kích thước</h3>
                                    <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                                        {post.length && (
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-500">Chiều dài</p>
                                                <p className="font-semibold text-lg">{post.length}m</p>
                                            </div>
                                        )}
                                        {post.width && (
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-500">Chiều rộng</p>
                                                <p className="font-semibold text-lg">{post.width}m</p>
                                            </div>
                                        )}
                                        {post.streetWidth && (
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-500">Mặt tiền</p>
                                                <p className="font-semibold text-lg">{post.streetWidth}m</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Amenities */}
                            <div className="mt-6 pt-6 border-t">
                                <h3 className="font-semibold text-gray-900 mb-4">Tiện nghi</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {post.kitchen && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <ChefHat className="h-4 w-4" />
                                            <span className="text-sm">Bếp</span>
                                        </div>
                                    )}
                                    {post.diningRoom && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Home className="h-4 w-4" />
                                            <span className="text-sm">Phòng ăn</span>
                                        </div>
                                    )}
                                    {post.carPark && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Car className="h-4 w-4" />
                                            <span className="text-sm">Chỗ đậu xe</span>
                                        </div>
                                    )}
                                    {post.rooftop && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Building className="h-4 w-4" />
                                            <span className="text-sm">Sân thượng</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Info */}
                            {post.yearBuilt && (
                                <div className="mt-6 pt-6 border-t">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <span className="text-gray-600">
                                            Năm xây dựng: <span className="font-semibold">{new Date(post.yearBuilt).getFullYear()}</span>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Contact Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Liên hệ</h3>

                                <div className="space-y-4">
                                    {post.owner && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            <span className="text-green-600 font-medium">Chính chủ</span>
                                        </div>
                                    )}

                                    <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <span>Gọi ngay</span>
                                    </button>

                                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        <span>Gửi email</span>
                                    </button>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt giá</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Giá {post.postType === 'SALE' ? 'bán' : 'thuê'}</span>
                                        <span className="font-semibold">{post.price ? formatPrice(post.price) + ' VND' : 'Liên hệ'}</span>
                                    </div>
                                    {post.square && post.price && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Giá/m²</span>
                                            <span className="text-gray-700">{formatPrice(post.price / post.square)}/m²</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">ID tin</span>
                                        <span className="font-mono text-xs">{post.id.slice(-8)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trạng thái</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${post.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {post.status === 'ACTIVE' ? 'Đang hiện' : post.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;