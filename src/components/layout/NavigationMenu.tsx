import { Home, Building, Users, BookOpen, Heart, MessageCircle, MoreHorizontal } from 'lucide-react';

const NavigationMenu = () => {
    const menuItems = [
        { icon: Home, label: 'TRANG CHỦ', href: '/' },
        { icon: Building, label: 'NHÀ ĐẤT BÁN', href: '/sale' },
        { icon: Building, label: 'NHÀ ĐẤT CHO THUÊ', href: '/rent' },
        { icon: Building, label: 'DỰ ÁN', href: '/projects' },
        { icon: Users, label: 'NHÀ MÔI GIỚI', href: '/agents' },
        { icon: BookOpen, label: 'KINH NGHIỆM', href: '/experience' },
        { icon: Heart, label: 'MẪU NHÀ ĐẸP', href: '/beautiful-houses' },
        { icon: MessageCircle, label: 'LIÊN HỆ - GÓP Ý', href: '/contact' },
        { icon: MoreHorizontal, label: 'XEM THÊM', href: '/more' },
    ];

    return (
        <nav className="hidden md:flex bg-gradient-to-r from-[#D9A066] to-[#FFCC8E] shadow-xl rounded-md overflow-hidden mx-4 max-w-5xl justify-center">
            <div className="px-2 py-2">
                <div className="hidden md:flex items-center justify-between">
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            className="group flex items-center space-x-1 text-[#4B3F2F] hover:text-white transition-all duration-300 px-1 py-1 rounded hover:bg-white/20"
                        >
                            <div className="p-0.5 rounded bg-white/30 group-hover:bg-white/50 transition-all duration-300">
                                <item.icon className="h-3 w-3 text-[#4B3F2F]" />
                            </div>
                            <span className="text-xs font-medium whitespace-nowrap">
                                {item.label}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );

};

export default NavigationMenu;
