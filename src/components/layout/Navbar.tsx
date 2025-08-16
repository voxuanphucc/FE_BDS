import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from '../dialog/LoginModal';
import { getUserFromToken, UserPayload } from '../../utils/auth';


const Navbar: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    const currentUser = getUserFromToken();
    setUser(currentUser);
  }, []);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <img
                src="/icon.png"
                alt="Logo"
                className="h-8 w-8 mr-2 transition-transform duration-300 group-hover:scale-110"
              />
              <h1 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                BDS
              </h1>
            </Link>
          </div>

          {/* Contact Info - Center */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative group">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:shadow-md">
                {/* Phone Icon */}
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>

                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                    Mrs.Ngọc Nhân
                  </div>
                  <div className="text-sm font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                    0786.791.314
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                  <div className="absolute w-3 h-3 bg-green-500 rounded-full top-0"></div>
                </div>
              </div>

              {/* Hover tooltip */}
              <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-1 whitespace-nowrap">
                  Nhấn để gọi
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation - Right */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-blue-50"
              >
                Trang chủ
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-blue-50"
              >
                Giới thiệu
              </Link>
            </div>

            <Link
              to="/add-post"
              className="bg-gray-600 text-white hover:bg-gray-700 hover:shadow-lg px-3 md:px-4 py-2 rounded-md text-sm font-normal transition-all duration-300 transform hover:scale-105"
            >
              Đăng tin
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 hover:opacity-90 transition-all duration-300 hover:bg-gray-50 rounded-lg p-1"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.userName}
                    className="h-10 md:h-12 w-10 md:w-12 rounded-full object-cover border-2 border-gray-300 hover:border-blue-400 transition-colors duration-300"
                  />
                  <span className="hidden md:block text-gray-800 font-medium text-sm hover:text-blue-600 transition-colors">
                    {user.userName}
                  </span>
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    window.location.href = '/login';
                  } else {
                    setShowLogin(true);
                  }
                }}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-2 md:px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 border-2 border-gray-400 hover:border-blue-400"
              >
                Đăng nhập
              </button>
            )}

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
          </div>
        </div>

        {/* Mobile Contact Info */}
        <div className="md:hidden border-t border-gray-100 py-2">
          <a
            href="tel:0786791314"
            className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 active:scale-95"
          >
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="text-sm font-semibold text-gray-800">Mrs.Ngọc Nhân</span>
            <span className="text-sm font-bold text-blue-600">0786.791.314</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
