import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FileCheck, LayoutDashboard, Users, FileText, Settings, LogOut, Receipt, ArrowUpRight } from 'lucide-react';
import { Announcement, AnnouncementTag, AnnouncementTitle } from './ui/announcement';

export default function Layout() {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
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
            <aside className="w-64 bg-white border-r border-gray-border flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-border">
                    <div className="bg-blue-50 p-1.5 rounded-lg mr-2">
                        <FileCheck className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold text-gray-dark tracking-tight">QuickQuote Pro</span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link key={item.name} to={item.path} className={`flex items-center px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-blue-50 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-dark'}`}>
                                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-border">
                    <div className="flex items-center px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm mr-3">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-dark truncate">{user?.company_name || user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 bg-white border-b border-gray-border flex items-center justify-between px-4 md:hidden">
                    <div className="flex items-center">
                        <FileCheck className="h-8 w-8 text-primary" />
                    </div>
                    <button onClick={handleLogout} className="text-sm text-red-600 font-medium">Logout</button>
                </header>

                <div className="flex-1 overflow-auto p-6 md:p-8 bg-gray-50">
                    <div className="mb-6 flex justify-center">
                        <Announcement themed className="bg-blue-50 text-primary border border-blue-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <AnnouncementTag className="bg-white text-primary shadow-sm">New</AnnouncementTag>
                            <AnnouncementTitle>
                                Welcome to QuickQuote Pro! See what's new in v1.0
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
