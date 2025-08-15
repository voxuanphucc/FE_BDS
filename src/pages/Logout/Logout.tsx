import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Xóa token
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        // Chuyển hướng sau 2 giây
        const timer = setTimeout(() => {

            navigate('/home');
            window.location.reload();
        }, 1500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
            <div className="text-center animate-fade-in">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3 animate-pulse">
                    Đang đăng xuất...
                </h1>
                <p className="text-gray-600 text-base">
                    Bạn sẽ được chuyển về trang chủ trong giây lát.
                </p>
            </div>
        </div>
    );
};

export default Logout;