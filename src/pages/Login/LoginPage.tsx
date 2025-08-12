import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { authService } from '../../services/authService';

const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await authService.login({ phone, password });

            // Lưu token/refreshToken và thông tin user
            localStorage.setItem('authToken', data.token);
            if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);

            alert('Đăng nhập thành công!');
            navigate('/');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Lỗi không xác định';
            alert('Đăng nhập thất bại: ' + message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 text-center">Đăng nhập</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Chưa có tài khoản? <a href="/register" className="text-blue-600 hover:underline">Đăng ký ngay</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;