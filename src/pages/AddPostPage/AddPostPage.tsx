import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Home, MapPin, DollarSign, Calendar, Ruler } from 'lucide-react';

interface PostFormData {
    // Post info
    postType: string;
    realEstateType: string;
    title: string;
    content: string;
    status: string;

    // PostDetail info
    price: number | '';
    direction: string;
    square: number | '';
    length: number | '';
    width: number | '';
    streetWidth: number | '';
    legal: string;
    bedrooms: number | '';
    bathrooms: number | '';
    floors: number | '';
    yearBuilt: string;
    diningRoom: boolean;
    kitchen: boolean;
    rooftop: boolean;
    carPark: boolean;
    owner: boolean;

    // Images - now storing public_ids instead of URLs
    imagePublicIds: string[];
}

// CustomDropdown dùng chung cho các trường
function CustomDropdown({ options, value, onChange, placeholder }: { options: { value: string, label: string }[], value: string, onChange: (v: string) => void, placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selected = options.find(opt => opt.value === value) || { value: '', label: placeholder || 'Chọn' };
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div
        tabIndex={0}
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 hover:bg-white cursor-pointer flex items-center justify-between"
        style={{ outline: 'none', boxShadow: 'none' }}
      >
        <span>{selected.label}</span>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      {open && (
        <ul
          className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-10 border border-gray-200"
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
          {options.map(opt => (
            <li
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`px-4 py-3 cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${value === opt.value ? 'bg-blue-600 text-white' : ''}`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// CustomDropdown cho loại bất động sản
const realEstateOptions = [
  { value: '', label: 'Chọn loại bất động sản' },
  { value: 'HOUSE', label: '🏡 Nhà ở' },
  { value: 'APARTMENT', label: '🏢 Chung cư' },
  { value: 'LAND', label: '🌳 Đất nền' },
  { value: 'COMMERCIAL', label: '🏪 Thương mại' },
];

function RealEstateDropdown({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const selected = realEstateOptions.find(opt => opt.value === value) || realEstateOptions[0];
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <div
        tabIndex={0}
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 hover:bg-white cursor-pointer flex items-center justify-between"
        style={{ outline: 'none', boxShadow: 'none' }}
      >
        <span>{selected.label}</span>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      {open && (
        <ul
          className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-10 border border-gray-200"
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
          {realEstateOptions.map(opt => (
            <li
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`px-4 py-3 cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${value === opt.value ? 'bg-blue-600 text-white' : ''}`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Các options cho dropdown
const postTypeOptions = [
  { value: '', label: 'Chọn loại tin đăng' },
  { value: 'SALE', label: '🏠 Bán' },
  { value: 'RENT', label: '🏘️ Cho thuê' },
];
const statusOptions = [
  { value: 'ACTIVE', label: '✅ Hoạt động' },
  { value: 'INACTIVE', label: '⏸️ Tạm dừng' },
  { value: 'PENDING', label: '⏳ Chờ duyệt' },
];
const legalOptions = [
  { value: '', label: 'Chọn loại pháp lý' },
  { value: 'RED_BOOK', label: '📕 Sổ đỏ' },
  { value: 'PINK_BOOK', label: '📖 Sổ hồng' },
  { value: 'SALES_CONTRACT', label: '📋 Hợp đồng mua bán' },
  { value: 'WAITING_FOR_BOOK', label: '⏰ Chờ sổ' },
  { value: 'OTHER', label: '📄 Khác' },
];
const directionOptions = [
  { value: '', label: 'Chọn hướng nhà' },
  { value: 'NORTH', label: '🧭 Bắc' },
  { value: 'SOUTH', label: '🧭 Nam' },
  { value: 'EAST', label: '🧭 Đông' },
  { value: 'WEST', label: '🧭 Tây' },
  { value: 'NORTHEAST', label: '🧭 Đông Bắc' },
  { value: 'NORTHWEST', label: '🧭 Tây Bắc' },
  { value: 'SOUTHEAST', label: '🧭 Đông Nam' },
  { value: 'SOUTHWEST', label: '🧭 Tây Nam' },
];

const AddPostPage: React.FC = () => {
    const [formData, setFormData] = useState<PostFormData>({
        postType: '',
        realEstateType: '',
        title: '',
        content: '',
        status: 'ACTIVE',
        price: '',
        direction: '',
        square: '',
        length: '',
        width: '',
        streetWidth: '',
        legal: '',
        bedrooms: '',
        bathrooms: '',
        floors: '',
        yearBuilt: '',
        diningRoom: false,
        kitchen: false,
        rooftop: false,
        carPark: false,
        owner: false,
        imagePublicIds: []
    });

    const [uploadingImages, setUploadingImages] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Cloudinary configuration
    const cloudName = 'dt2hiwsge';
    const uploadPreset = 'BDSMOI';

    // Simplified Cloudinary upload function based on HTML example
    const uploadToCloudinary = async (file: File): Promise<{ publicId: string; secureUrl: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.secure_url) {
                return {
                    publicId: data.public_id,
                    secureUrl: data.secure_url
                };
            } else {
                throw new Error('Upload failed - no secure_url received');
            }
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

            setFormData(prev => ({
                ...prev,
                imagePublicIds: [...prev.imagePublicIds, ...uploadResults.map(result => result.publicId)]
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
        setFormData(prev => ({
            ...prev,
            imagePublicIds: prev.imagePublicIds.filter((_, i) => i !== index)
        }));
    };

    // Generate Cloudinary URL from public_id
    const getCloudinaryUrl = (publicId: string, options = {}) => {
        const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
        const transformations = Object.entries({
            f: 'auto',
            q: 'auto',
            w: 400,
            h: 300,
            c: 'fill',
            ...options
        }).map(([key, value]) => `${key}_${value}`).join(',');

        return `${baseUrl}/${transformations}/${publicId}`;
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

            // Generate URLs from public IDs for API
            const imageUrls = formData.imagePublicIds.map(publicId =>
                getCloudinaryUrl(publicId, { w: 1200, h: 800, c: 'limit' })
            );

            // Prepare data to match PostWithDetailDTO structure
            postData = {
                // Post info
                postType: formData.postType,
                realEstateType: formData.realEstateType,
                title: formData.title,
                content: formData.content,
                status: formData.status,

                // PostDetail info - convert empty strings to null
                price: formData.price,
                direction: formData.direction || null,
                square: formData.square === '' ? null : Number(formData.square),
                length: formData.length === '' ? null : Number(formData.length),
                width: formData.width === '' ? null : Number(formData.width),
                streetWidth: formData.streetWidth === '' ? null : Number(formData.streetWidth),
                legal: formData.legal || null,
                bedrooms: formData.bedrooms === '' ? null : Number(formData.bedrooms),
                bathrooms: formData.bathrooms === '' ? null : Number(formData.bathrooms),
                floors: formData.floors === '' ? null : Number(formData.floors),
                yearBuilt: formData.yearBuilt || null,
                diningRoom: formData.diningRoom,
                kitchen: formData.kitchen,
                rooftop: formData.rooftop,
                carPark: formData.carPark,
                owner: formData.owner,

                // Images
                imageUrls: imageUrls,
                imagePublicIds: formData.imagePublicIds // Also send public IDs for future reference
            };

            console.log('Submitting post data:', postData);

            // Call API
            const response = await fetch('http://localhost:8081/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.text();
            alert(`Thành công! ${result}`);

            // Reset form after successful submission
            setFormData({
                postType: '',
                realEstateType: '',
                title: '',
                content: '',
                status: 'ACTIVE',
                price: '',
                direction: '',
                square: '',
                length: '',
                width: '',
                streetWidth: '',
                legal: '',
                bedrooms: '',
                bathrooms: '',
                floors: '',
                yearBuilt: '',
                diningRoom: false,
                kitchen: false,
                rooftop: false,
                carPark: false,
                owner: false,
                imagePublicIds: []
            });

        } catch (error) {
            console.error('Error submitting post:', error);
            console.log(postData);
            alert(`Có lỗi xảy ra khi đăng tin: ${error}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            postType: '',
            realEstateType: '',
            title: '',
            content: '',
            status: 'ACTIVE',
            price: '',
            direction: '',
            square: '',
            length: '',
            width: '',
            streetWidth: '',
            legal: '',
            bedrooms: '',
            bathrooms: '',
            floors: '',
            yearBuilt: '',
            diningRoom: false,
            kitchen: false,
            rooftop: false,
            carPark: false,
            owner: false,
            imagePublicIds: []
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
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-100">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Home className="h-5 w-5 text-gray-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Thông tin cơ bản</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Loại tin đăng <span className="text-red-500">*</span>
                                    </label>
                                    <CustomDropdown
                                      options={postTypeOptions}
                                      value={formData.postType}
                                      onChange={v => setFormData(prev => ({ ...prev, postType: v }))}
                                      placeholder="Chọn loại tin đăng"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Loại bất động sản <span className="text-red-500">*</span>
                                    </label>
                                    <RealEstateDropdown
                                      value={formData.realEstateType}
                                      onChange={v => setFormData(prev => ({ ...prev, realEstateType: v }))}
                                    />
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
                        </div>

                        {/* Property Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-100">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Ruler className="h-5 w-5 text-gray-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Thông tin chi tiết</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Trạng thái</label>
                                    <CustomDropdown
                                      options={statusOptions}
                                      value={formData.status}
                                      onChange={v => setFormData(prev => ({ ...prev, status: v }))}
                                      placeholder="Chọn trạng thái"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">Pháp lý</label>
                                    <CustomDropdown
                                      options={legalOptions}
                                      value={formData.legal}
                                      onChange={v => setFormData(prev => ({ ...prev, legal: v }))}
                                      placeholder="Chọn loại pháp lý"
                                    />
                                </div>
                            </div>

                            {/* Price and Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-gray-600" />
                                        Giá (VND) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        placeholder="Nhập giá bán hoặc cho thuê"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-600" />
                                        Hướng nhà
                                    </label>
                                    <CustomDropdown
                                      options={directionOptions}
                                      value={formData.direction}
                                      onChange={v => setFormData(prev => ({ ...prev, direction: v }))}
                                      placeholder="Chọn hướng nhà"
                                    />
                                </div>
                            </div>

                            {/* Dimensions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Ruler className="h-4 w-4 text-gray-600" />
                                        Diện tích (m²)
                                    </label>
                                    <input
                                        type="number"
                                        name="square"
                                        value={formData.square}
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
                                        value={formData.length}
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
                                        value={formData.width}
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
                                        value={formData.streetWidth}
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
                                        value={formData.bedrooms}
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
                                        value={formData.bathrooms}
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
                                        value={formData.floors}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-600" />
                                        Năm xây dựng
                                    </label>
                                    <input
                                        type="date"
                                        name="yearBuilt"
                                        value={formData.yearBuilt}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200"
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
                                                checked={formData[name as keyof PostFormData] as boolean}
                                                onChange={handleInputChange}
                                                className="rounded border-gray-300 text-gray-600 focus:ring-gray-500 h-5 w-5"
                                            />
                                            <span className="text-sm text-gray-700">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-3">Hình ảnh</h2>
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
                            {formData.imagePublicIds.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Ảnh đã tải lên</h3>
                                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                        {formData.imagePublicIds.map((publicId, index) => (
                                            <div key={index} className="relative flex-shrink-0 w-48">
                                                <img
                                                    src={getCloudinaryUrl(publicId, { w: 400, h: 300, c: 'fill' })}
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
                        </div>

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
