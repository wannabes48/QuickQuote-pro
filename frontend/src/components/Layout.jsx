import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Receipt, ArrowUpRight } from 'lucide-react';
import { Announcement, AnnouncementTag, AnnouncementTitle } from './ui/announcement';
import { AppLogo, AppLogoText } from '@/components/ui/logo';
import { SessionNavBar } from '@/components/ui/sidebar';

export default function Layout() {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Customers', path: '/customers', icon: Users },
        { name: 'Quotes', path: '/quotes', icon: FileText },
        { name: 'Invoices', path: '/invoices', icon: Receipt },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-light flex">
            {/* Sidebar */}
            <div className="hidden md:block">
                <SessionNavBar />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden md:ml-[4rem] transition-all duration-200">
                {/* Mobile Header */}
                <header className="h-16 bg-white border-b border-gray-border flex items-center justify-between px-4 md:hidden">
                    <div className="flex items-center">
                        <AppLogo className="h-8 w-8" />
                    </div>
                    <button onClick={handleLogout} className="text-sm text-red-600 font-medium">Logout</button>
                </header>

                <div className="flex-1 overflow-auto p-6 md:p-8 bg-gray-50">
                    <div className="mb-6 flex justify-center">
                        <Announcement themed className="bg-blue-50 text-primary border border-blue-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <AnnouncementTag className="bg-white text-primary shadow-sm">New</AnnouncementTag>
                            <AnnouncementTitle>
                                Welcome to <span className="text-primary font-bold">QuickQuote Pro</span>! See what's new in v1.0
                                <ArrowUpRight size={16} className="shrink-0 opacity-70 ml-1" />
                            </AnnouncementTitle>
                        </Announcement>
                    </div>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
