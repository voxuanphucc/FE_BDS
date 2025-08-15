import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { authService } from '../../services/authService';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        setLoading(true);

        try {
            await authService.register({
                name,
                email,
                password,
                confirmPassword,
                phone
            });
            alert('Đăng ký thành công!');
            navigate('/'); // Redirect về trang chủ
        } catch (error) {
            let errorMessage = 'Lỗi không xác định';

            if (error instanceof Error) {
                errorMessage = error.message;

                // Xử lý các loại lỗi cụ thể
                if (errorMessage.includes('409') || errorMessage.includes('Conflict')) {
                    errorMessage = 'Thông tin đăng ký đã tồn tại! Vui lòng kiểm tra:\n• Email đã được sử dụng\n• Username đã tồn tại\n• Số điện thoại đã được đăng ký';
                } else if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
                    errorMessage = 'Dữ liệu không hợp lệ! Vui lòng kiểm tra lại thông tin.';
                } else if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
                    errorMessage = 'Lỗi server! Vui lòng thử lại sau.';
                }
            }

            alert('Đăng ký thất bại:\n\n' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 text-center">Đăng ký</h1>

                <form onSubmit={handleRegister} className="space-y-4">

                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tên đầy đủ"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="tel"
                            placeholder="Số điện thoại (10 số)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            required
                            pattern="\d{10}"
                            maxLength={10}
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Mật khẩu (ít nhất 6 ký tự)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                    >
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Đã có tài khoản? <a href="/login" className="text-blue-600 hover:underline">Đăng nhập</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;