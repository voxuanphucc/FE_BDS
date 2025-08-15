import React, { useEffect, useState } from 'react';
import {
    Home,
    Upload,
    X,
    Star,
    Ruler,
    DollarSign,
    MapPin
} from 'lucide-react';
import { uploadService } from '../../services/uploadService';
import { postService } from '../../services/postService';
import { CreatePostData } from '../../types';
import FormSection from '../FormSection/FormSection';

const AddPostPage: React.FC = () => {
    const [formData, setFormData] = useState<CreatePostData>({
        postRank: 'COPPER',
        postType: '',
        city: '',
        thumbnailUrl: '',
        realEstateType: '',
        title: '',
        content: '',
        price: null,
        direction: null,
        square: null,
        length: null,
        width: null,
        streetWidth: null,
        legal: null,
        bedrooms: null,
        bathrooms: null,
        floors: null,
        diningRoom: false,
        kitchen: false,
        rooftop: false,
        carPark: false,
        owner: false,
        imageUrls: []
    });

    const [uploadingImages, setUploadingImages] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Cloudinary configuration
    const cloudName = 'dt2hiwsge';
    const uploadPreset = 'BDSMOI';

    // Post rank options
    const postRankOptions = [
        { value: 'COPPER', label: '🥉 Đồng - Miễn phí', description: 'Tin thường, chờ duyệt' },
        { value: 'SLIVER', label: '🥈 Bạc - 50k/tuần', description: 'Hiển thị ưu tiên' },
        { value: 'GOLD', label: '🥇 Vàng - 100k/tuần', description: 'Hiển thị nổi bật' },
        { value: 'DIAMOND', label: '💎 Kim cương - 200k/tuần', description: 'Hiển thị VIP' }
    ];

    // Simplified Cloudinary upload function
    const uploadToCloudinary = async (file: File): Promise<{ publicId: string; secureUrl: string }> => {
        try {
            const result = await uploadService.uploadImage(file, cloudName, uploadPreset);
            return {
                publicId: result.public_id,
                secureUrl: result.url
            };
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    };

    const handleImageUpload = async (files: FileList) => {
        setUploadingImages(true);

        try {
            // Validate file types and sizes
            const validFiles = Array.from(files).filter(file => {
                const isValidType = file.type.startsWith('image/');
                const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

                if (!isValidType) {
                    alert(`File ${file.name} không phải là ảnh hợp lệ`);
                    return false;
                }

                if (!isValidSize) {
                    alert(`File ${file.name} vượt quá 10MB`);
                    return false;
                }

                return true;
            });

            if (validFiles.length === 0) {
                return;
            }

            const uploadPromises = validFiles.map(file => uploadToCloudinary(file));
            const uploadResults = await Promise.all(uploadPromises);

            const newImageUrls = uploadResults.map(result => result.secureUrl);

            setFormData(prev => ({
                ...prev,
                imageUrls: [...prev.imageUrls, ...newImageUrls],
                // Set first image as thumbnail if not set
                thumbnailUrl: prev.thumbnailUrl || newImageUrls[0] || ''
            }));

            alert(`Đã upload thành công ${uploadResults.length} ảnh!`);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Có lỗi xảy ra khi upload ảnh. Vui lòng thử lại.');
        } finally {
            setUploadingImages(false);
        }
    };

    const removeImage = (index: number) => {
        const removedImageUrl = formData.imageUrls[index];
        const newImageUrls = formData.imageUrls.filter((_: string, i: number) => i !== index);

        setFormData(prev => ({
            ...prev,
            imageUrls: newImageUrls,
            // Update thumbnail if the removed image was the thumbnail
            thumbnailUrl: prev.thumbnailUrl === removedImageUrl ? (newImageUrls[0] || '') : prev.thumbnailUrl
        }));
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        let postData;
        try {
            // Validate required fields
            if (!formData.title || !formData.content || !formData.postType || !formData.realEstateType || !formData.price) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc');
                return;
            }

            // Prepare data to match PostCreationDTO structure
            postData = {
                // Post info
                postRank: formData.postRank,
                postType: formData.postType,
                city: formData.city,
                thumbnailUrl: formData.thumbnailUrl,
                realEstateType: formData.realEstateType,
                title: formData.title,
                content: formData.content,

                // PostDetail info - convert empty strings to null and handle data types
                price: formData.price,
                direction: formData.direction,
                square: formData.square,
                length: formData.length,
                width: formData.width,
                streetWidth: formData.streetWidth,
                legal: formData.legal,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                floors: formData.floors,
                diningRoom: formData.diningRoom,
                kitchen: formData.kitchen,
                rooftop: formData.rooftop,
                carPark: formData.carPark,
                owner: formData.owner,

                // Images
                imageUrls: formData.imageUrls
            };

            console.log('Submitting post data:', postData);

            // Call API using postService
            await postService.createPost(postData);

            alert('Đăng tin thành công!');

            // Reset form after successful submission
            setFormData({
                postRank: 'COPPER',
                postType: '',
                city: '',
                thumbnailUrl: '',
                realEstateType: '',
                title: '',
                content: '',
                price: null,
                direction: null,
                square: null,
                length: null,
                width: null,
                streetWidth: null,
                legal: null,
                bedrooms: null,
                bathrooms: null,
                floors: null,
                diningRoom: false,
                kitchen: false,
                rooftop: false,
                carPark: false,
                owner: false,
                imageUrls: []
            });

        } catch (error) {
            console.error('Error submitting post:', error);
            console.log('Failed data:', postData);
            alert(`Có lỗi xảy ra khi đăng tin: ${error}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            postRank: 'COPPER',
            postType: '',
            city: '',
            thumbnailUrl: '',
            realEstateType: '',
            title: '',
            content: '',
            price: null,
            direction: null,
            square: null,
            length: null,
            width: null,
            streetWidth: null,
            legal: null,
            bedrooms: null,
            bathrooms: null,
            floors: null,
            diningRoom: false,
            kitchen: false,
            rooftop: false,
            carPark: false,
            owner: false,
            imageUrls: []
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 px-8 py-6">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Home className="h-8 w-8" />
                            </div>
                            Đăng tin bất động sản
                        </h1>
                        <p className="text-gray-100 mt-2">Điền thông tin chi tiết để đăng tin hiệu quả</p>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Post Rank Selection */}
                        <FormSection title="Gói tin đăng" icon={Star}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {postRankOptions.map((option) => (
                                    <label key={option.value} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="postRank"
                                            value={option.value}
                                            checked={formData.postRank === option.value}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className={`p-4 border-2 rounded-xl transition-all duration-200 ${formData.postRank === option.value
                                            ? 'border-yellow-500 bg-yellow-50 shadow-md'
                                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                            }`}>
                                            <div className="text-lg font-semibold mb-1">{option.label}</div>
                                            <div className="text-sm text-gray-600">{option.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </FormSection>

                        {/* Basic Information */}
                        <FormSection title="Thông tin cơ bản" icon={Home}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Loại tin đăng <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="postType"
                                        value={formData.postType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        required
                                    >
                                        <option value="">Chọn loại tin đăng</option>
                                        <option value="SALE">🏠 Bán</option>
                                        <option value="RENT">🏘️ Cho thuê</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Loại bất động sản <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="realEstateType"
                                        value={formData.realEstateType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        required
                                    >
                                        <option value="">Chọn loại bất động sản</option>
                                        <option value="HOUSE">🏡 Nhà ở</option>
                                        <option value="APARTMENT">🏢 Chung cư</option>
                                        <option value="LAND">🌳 Đất nền</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Tiêu đề <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                    placeholder="Nhập tiêu đề hấp dẫn cho bài đăng của bạn"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Mô tả chi tiết <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                                    placeholder="Mô tả chi tiết về vị trí, thiết kế, tiện ích và những điểm nổi bật của bất động sản..."
                                    required
                                />
                            </div>
                        </FormSection>

                        {/* Property Details */}
                        <FormSection title="Thông tin chi tiết" icon={Ruler}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Pháp lý</label>
                                    <select
                                        name="legal"
                                        value={formData.legal || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                    >
                                        <option value="">Chọn loại pháp lý</option>
                                        <option value="RED_BOOK">📕 Sổ đỏ</option>
                                        <option value="PINK_BOOK">📖 Sổ hồng</option>
                                        <option value="SALES_CONTRACT">📋 Hợp đồng mua bán</option>
                                        <option value="WAITING_FOR_BOOK">⏰ Chờ sổ</option>
                                        <option value="OTHER">📄 Khác</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Tỉnh thành</label>
                                    <select
                                        name="city"
                                        value={formData.city || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                    >
                                        <option value="">Chọn tỉnh thành</option>
                                        <option value="DaNang">Đà nẵng</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price and Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex text-sm font-semibold text-gray-700 items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-gray-600" />
                                        Giá (VND) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        placeholder="Nhập giá bán hoặc cho thuê"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex text-sm font-semibold text-gray-700 items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-600" />
                                        Hướng nhà
                                    </label>
                                    <select
                                        name="direction"
                                        value={formData.direction || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                    >
                                        <option value="">Chọn hướng nhà</option>
                                        <option value="NORTH">🧭 Bắc</option>
                                        <option value="SOUTH">🧭 Nam</option>
                                        <option value="EAST">🧭 Đông</option>
                                        <option value="WEST">🧭 Tây</option>
                                        <option value="NORTHEAST">🧭 Đông Bắc</option>
                                        <option value="NORTHWEST">🧭 Tây Bắc</option>
                                        <option value="SOUTHEAST">🧭 Đông Nam</option>
                                        <option value="SOUTHWEST">🧭 Tây Nam</option>
                                    </select>
                                </div>
                            </div>

                            {/* Dimensions */}
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="flex text-sm font-semibold text-gray-700 items-center gap-2">
                                        <Ruler className="h-4 w-4 text-gray-600" />
                                        Diện tích (m²)
                                    </label>
                                    <input
                                        type="number"
                                        name="square"
                                        value={formData.square || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        placeholder="0"
                                        step="0.1"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Chiều dài (m)</label>
                                    <input
                                        type="number"
                                        name="length"
                                        value={formData.length || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        placeholder="0"
                                        step="0.1"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Chiều rộng (m)</label>
                                    <input
                                        type="number"
                                        name="width"
                                        value={formData.width || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        placeholder="0"
                                        step="0.1"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Độ rộng mặt tiền (m)</label>
                                    <input
                                        type="number"
                                        name="streetWidth"
                                        value={formData.streetWidth || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        placeholder="0"
                                        step="0.1"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Số phòng ngủ</label>
                                    <input
                                        type="number"
                                        name="bedrooms"
                                        value={formData.bedrooms || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Số phòng tắm</label>
                                    <input
                                        type="number"
                                        name="bathrooms"
                                        value={formData.bathrooms || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Số tầng</label>
                                    <input
                                        type="number"
                                        name="floors"
                                        value={formData.floors || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>

                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Tiện nghi</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {[
                                        { name: 'diningRoom', label: 'Phòng ăn' },
                                        { name: 'kitchen', label: 'Bếp' },
                                        { name: 'rooftop', label: 'Sân thượng' },
                                        { name: 'carPark', label: 'Chỗ đậu xe' },
                                        { name: 'owner', label: 'Chính chủ' }
                                    ].map(({ name, label }) => (
                                        <label key={name} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name={name}
                                                checked={formData[name as keyof CreatePostData] as boolean}
                                                onChange={handleInputChange}
                                                className="rounded border-gray-300 text-gray-600 focus:ring-gray-500 h-5 w-5"
                                            />
                                            <span className="text-sm text-gray-700">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </FormSection>

                        {/* Image Upload */}
                        <FormSection title="Hình ảnh" icon={Upload}>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                <div className="flex flex-col items-center justify-center">
                                    <Upload className="h-16 w-16 text-gray-400 mb-4" />
                                    <p className="text-gray-600 font-medium mb-2">Tải lên hình ảnh bất động sản</p>
                                    <p className="text-sm text-gray-500 mb-4">Hỗ trợ JPG, PNG. Tối đa 10MB mỗi file. Ảnh sẽ được tự động tối ưu hóa.</p>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                                        className="hidden"
                                        id="image-upload"
                                        disabled={uploadingImages}
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className={`px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors duration-200 ${uploadingImages
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-gray-600 text-white hover:bg-gray-700'
                                            }`}
                                    >
                                        {uploadingImages ? 'Đang tải...' : 'Chọn ảnh'}
                                    </label>
                                </div>
                            </div>
                            {formData.imageUrls.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Ảnh đã tải lên</h3>
                                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                        {formData.imageUrls.map((imageUrl, index) => (
                                            <div key={index} className="relative flex-shrink-0 w-48">
                                                <img
                                                    src={imageUrl}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-36 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
                                                    loading="lazy"
                                                />
                                                <button
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors duration-200 shadow-md"
                                                    type="button"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </FormSection>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || uploadingImages}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${isSubmitting || uploadingImages
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-gray-600 text-white hover:bg-gray-700'
                                    }`}
                            >
                                {isSubmitting ? 'Đang đăng...' : 'Đăng tin'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPostPage;
