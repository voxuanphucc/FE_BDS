import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl mx-4 mt-8 mb-8 p-8">
                <div className="relative z-10 flex items-center">
                    <div className="bg-white rounded-full p-4 mr-6">
                        <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6z"/>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Đăng Tin Bất Động Sản</h1>
                        <p className="text-white text-lg opacity-90">
                            Đăng tin nhanh chóng, hiệu quả và tiếp cận hàng ngàn khách hàng tiềm năng.
                        </p>
                    </div>
                </div>
                {/* Background house model */}
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
                    {/* Card 1 */}
                    <div className="text-center">
                        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6z"/>
                            </svg>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">5,000+</div>
                        <div className="text-gray-600">Bất động sản</div>
                    </div>

                    {/* Card 2 */}
                    <div className="text-center">
                        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">95%</div>
                        <div className="text-gray-600">Tỷ lệ thành công</div>
                    </div>

                    {/* Card 3 */}
                    <div className="text-center">
                        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">24/7</div>
                        <div className="text-gray-600">Hỗ trợ</div>
                    </div>

                    {/* Card 4 */}
                    <div className="text-center">
                        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">63+</div>
                        <div className="text-gray-600">Tỉnh thành</div>
                    </div>
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
        </div>
    );
}