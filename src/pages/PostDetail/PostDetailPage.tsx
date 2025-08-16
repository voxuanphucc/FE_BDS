import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSwipeable } from 'react-swipeable';
import {
    ArrowLeft,
    Home,
    Bath,
    Bed,
    Car,
    ChefHat,
    Building,
    Star,
    Share2,
    Heart,
    Compass,
    Layout,
    Phone,
    HomeIcon,
    Building2Icon
} from 'lucide-react';
import { postService } from '../../services/postService';
import { Post } from '../../types';

const PostDetailPage: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isLiked, setIsLiked] = useState<boolean>(false);

    const { postId } = useParams<{ postId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const fromParam = searchParams.get('from');
    const imageUrls = post?.imageUrls ?? [];

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (currentImageIndex < imageUrls.length - 1) {
                setCurrentImageIndex(currentImageIndex + 1);
            }
        },
        onSwipedRight: () => {
            if (currentImageIndex > 0) {
                setCurrentImageIndex(currentImageIndex - 1);
            }
        },
        trackMouse: false,
    });


    useEffect(() => {
        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const fetchPost = async () => {
        if (!postId) return;

        setLoading(true);
        setError('');

        try {
            const postData = await postService.getPostById(postId);
            setPost(postData);
        } catch (err) {
            console.error('Error fetching post:', err);
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        if (fromParam) {
            navigate(`/home?${fromParam}`);
        } else {
            navigate('/home');
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


    const getTypeDisplay = (type: string) => {
        const typeMap = {
            SALE: {
                icon: <Building2Icon className="w-5 h-5 text-gray-700" />,
                label: 'Bán',
                color: 'text-black-600',
            },
            RENT: {
                icon: <Building2Icon className="w-5 h-5 text-gray-700" />,
                label: 'Cho thuê',
                color: 'text-black-600',
            },
        };
        return typeMap[type as keyof typeof typeMap] || typeMap.SALE;
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


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b border-blue-600 mx-auto mb-3"></div>
                    <p className="text-gray-600 text-sm">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-6 rounded-sm shadow-md max-w-md">
                    <div className="text-red-500 mb-3">
                        <Home className="h-14 w-14 mx-auto mb-3 opacity-50" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Không thể tải bài viết</h2>
                    <p className="text-red-600 text-sm mb-5">{error}</p>
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={fetchPost}
                            className="px-5 py-1.5 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors text-sm"
                        >
                            Thử lại
                        </button>
                        <button
                            onClick={handleGoBack}
                            className="px-5 py-1.5 bg-gray-300 text-gray-700 rounded-sm hover:bg-gray-400 transition-colors text-sm"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) return null;

    const typeDisplay = getTypeDisplay(post.postType);

    return (
        <div className="min-h-screen bg-gray-100 text-sm">
            {/* Header */}
            <div className="bg-white shadow-sm border-b-[1px] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto p-2">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleGoBack}
                            className="flex rounded-full bg-gray-100 p-1 items-center gap-1.5 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-1.5 rounded-full transition-colors ${isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                            </button>
                            <button className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                                <Share2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>



            <div className="max-w-7xl mx-auto  md:py-6 md:px-3 ">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-5 ">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-sm overflow-hidden">
                            <div className="relative">
                                {post.imageUrls && post.imageUrls.length > 0 ? (
                                    <>
                                        <div
                                            {...handlers}
                                            className="relative w-full h-80 overflow-hidden touch-pan-x"
                                        >
                                            <img
                                                src={post.imageUrls[currentImageIndex]}
                                                alt="Blurred background"
                                                className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
                                            />
                                            <img
                                                src={post.imageUrls[currentImageIndex]}
                                                alt={`Property ${currentImageIndex + 1}`}
                                                className="relative z-10 w-full h-full object-contain transition-all duration-300"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                                        <Home className="h-10 w-10 text-gray-400" />
                                    </div>
                                )}

                                <div
                                    className={`absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-sm text-xs font-medium flex items-center gap-1 ${typeDisplay.color} z-10`}
                                >
                                    <span>{typeDisplay.icon}</span>
                                    <span>{typeDisplay.label}</span>
                                </div>
                                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
                                    {imageUrls.map((_, index) => (
                                        <span
                                            key={index}
                                            className={`w-1 h-1 rounded-full transition-all ${index === currentImageIndex ? 'bg-gray-500 scale-125' : 'bg-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {post.imageUrls && post.imageUrls.length > 1 && (
                                <div className="p-3 border-t-[1px]">
                                    <div className="flex gap-1.5 overflow-x-auto">
                                        {post.imageUrls.map((url, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`flex-shrink-0 w-14 h-14 rounded-sm overflow-hidden border transition-colors ${index === currentImageIndex
                                                    ? 'border-blue-500'
                                                    : 'border-gray-200'
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

                            <div className="bg-white rounded-sm px-3 pb-3">
                                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                                    {post.title}
                                </h1>

                                <div className="flex items-center gap-8">
                                    <span className="text-lg sm:text-xl font-bold text-red-500">
                                        {formatPrice(post.price)}
                                    </span>
                                    {post.square && post.price && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-700 font-bold">
                                                {formatPrice(post.price / post.square)}/m²
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>



                        {/* Property Details */}
                        <div className="bg-white rounded-md shadow-md p-5 m-2 ">
                            <h2 className="text-lg font-semibold text-gray-900 mb-5">Thông số kỹ thuật</h2>

                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {post.square && (
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-sm ">
                                            <Layout className="h-4 w-4 stroke-black fill-none" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Diện tích</p>
                                            <p className="font-semibold text-sm">{post.square} m²</p>
                                        </div>
                                    </div>
                                )}

                                {post.bedrooms && (
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-sm">
                                            <Bed className="h-4 w-4 stroke-black fill-none" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Phòng ngủ</p>
                                            <p className="font-semibold text-sm">{post.bedrooms} phòng</p>
                                        </div>
                                    </div>
                                )}

                                {post.bathrooms && (
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-sm">
                                            <Bath className="h-4 w-4 stroke-black fill-none" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Phòng tắm</p>
                                            <p className="font-semibold text-sm">{post.bathrooms} phòng</p>
                                        </div>
                                    </div>
                                )}

                                {post.floors && (
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-sm ">
                                            <Building className="h-4 w-4 stroke-black fill-none" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Số tầng</p>
                                            <p className="font-semibold text-sm">{post.floors} tầng</p>
                                        </div>
                                    </div>
                                )}

                                {post.direction && (
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-sm ">
                                            <Compass className="h-4 w-4 stroke-black fill-none" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Hướng nhà</p>
                                            <p className="font-semibold text-sm">{getDirectionDisplay(post.direction)}</p>
                                        </div>
                                    </div>
                                )}

                                {post.legal && (
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-1.5 rounded-sm">
                                            <Star className="h-4 w-4 stroke-black fill-none" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Pháp lý</p>
                                            <p className="font-semibold text-sm">{getLegalDisplay(post.legal)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>


                            {(post.length || post.width || post.streetWidth) && (
                                <div className="mt-5 pt-5 border-t-[1px]">
                                    <h3 className="font-semibold text-gray-900 mb-3 text-sm">Kích thước</h3>
                                    <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
                                        {post.length && (
                                            <div className="text-center p-2 bg-gray-100 rounded-sm">
                                                <p className="text-xs text-gray-500">Chiều dài</p>
                                                <p className="font-semibold text-sm">{post.length}m</p>
                                            </div>
                                        )}
                                        {post.width && (
                                            <div className="text-center p-2 bg-gray-100 rounded-sm">
                                                <p className="text-xs text-gray-500">Chiều rộng</p>
                                                <p className="font-semibold text-sm">{post.width}m</p>
                                            </div>
                                        )}
                                        {post.streetWidth && (
                                            <div className="text-center p-2 bg-gray-100 rounded-sm">
                                                <p className="text-xs text-gray-500">Mặt tiền</p>
                                                <p className="font-semibold text-sm">{post.streetWidth}m</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-5 pt-5 border-t-[1px]">
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Tiện nghi</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {post.kitchen && (
                                        <div className="flex items-center gap-1.5 text-green-600">
                                            <ChefHat className="h-3.5 w-3.5" />
                                            <span className="text-xs">Bếp</span>
                                        </div>
                                    )}
                                    {post.diningRoom && (
                                        <div className="flex items-center gap-1.5 text-green-600">
                                            <Home className="h-3.5 w-3.5" />
                                            <span className="text-xs">Phòng ăn</span>
                                        </div>
                                    )}
                                    {post.carPark && (
                                        <div className="flex items-center gap-1.5 text-green-600">
                                            <Car className="h-3.5 w-3.5" />
                                            <span className="text-xs">Chỗ đậu xe</span>
                                        </div>
                                    )}
                                    {post.rooftop && (
                                        <div className="flex items-center gap-1.5 text-green-600">
                                            <Building className="h-3.5 w-3.5" />
                                            <span className="text-xs">Sân thượng</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white shadow-md rounded-md p-4 m-2">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Mô tả chi tiết</h2>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                                {post.content}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Contact Card - desktop */}
                            <div className="bg-white rounded-md shadow-lg p-6 hidden md:block">
                                <div className="space-y-4">
                                    {/* Avatar + Số điện thoại (desktop) */}
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={post.avatarUrl}
                                            alt="Avatar"
                                            className="w-12 h-12 rounded-full object-cover border-[1px]"
                                        />
                                        <a
                                            href={`tel:${post.phone}`}
                                            className="bg-rose-600 text-white py-3 px-14 rounded-lg transition-colors flex items-center gap-3 text-base font-semibold hover:bg-rose-700"
                                        >
                                            <Phone className="h-5 w-5" />
                                            <span>{post.phone}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="bg-white rounded-md shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt giá</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Giá {post.postType === 'SALE' ? 'bán' : 'thuê'}</span>
                                        <span className="font-semibold">
                                            {post.price ? formatPrice(post.price) + ' VND' : 'Liên hệ'}
                                        </span>
                                    </div>
                                    {post.square && post.price && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Giá/m²</span>
                                            <span className="text-gray-700">
                                                {formatPrice(post.price / post.square)}/m²
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-md shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">ID tin</span>
                                        <span className="font-mono text-xs">{post.id.slice(-8)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trạng thái</span>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${post.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {post.status === 'ACTIVE' ? 'Đang hiện' : post.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Avatar + Số điện thoại - mobile fixed bottom */}
                        <div className="fixed bottom-0 left-0 w-full bg-white px-6 py-3 shadow-md z-50 md:hidden">
                            <div className="flex items-center gap-4">
                                <img
                                    src={post.avatarUrl}
                                    alt="Avatar"
                                    className="w-12 h-12 rounded-full object-cover border-[1px]"
                                />
                                <a
                                    href={`tel:${post.phone}`}
                                    className="bg-rose-600 text-white py-3 px-6 rounded-lg transition-colors flex items-center gap-3 text-base font-semibold hover:bg-rose-700 flex-1 justify-center"
                                >
                                    <Phone className="h-5 w-5" />
                                    <span>{post.phone}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;