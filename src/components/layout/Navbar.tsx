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
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src="/icon.png" alt="Logo" className="h-8 w-8 mr-2" />
              <h1 className="text-xl font-bold text-gray-800">Bất Động Sản</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="hidden md:block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Trang chủ
            </Link>
            <Link to="/about" className="hidden md:block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Giới thiệu
            </Link>

            <Link to="/add-post" className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Đăng tin
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
                  <img
                    src={user.avatarUrl}
                    alt={user.userName}
                    className="h-12 w-12 rounded-full object-cover border border-gray-300"
                  />
                  <span className="hidden md:block text-gray-800 font-medium text-sm">{user.userName}</span>
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
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors border-2 border-gray-400 hover:border-gray-600"
              >
                Đăng nhập
              </button>
            )}

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
