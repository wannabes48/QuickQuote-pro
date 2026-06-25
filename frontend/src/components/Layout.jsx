import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
        <div className="min-h-screen bg-gray-light flex relative">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <SessionNavBar />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden md:ml-[4rem] transition-all duration-200 relative z-10">
                {/* Mobile Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 md:hidden sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                        </button>
                        <AppLogo className="h-8 w-auto sm:h-10" />
                        <AppLogoText className="text-lg hidden xs:block" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50">
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

            {/* Mobile Sidebar Overlay & Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white/90 backdrop-blur-xl border-r border-white/20 shadow-2xl z-50 md:hidden flex flex-col"
                        >
                            <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white/50">
                                <div className="flex items-center gap-2">
                                    <AppLogo className="h-10 w-auto sm:h-12" />
                                    <AppLogoText className="text-xl" />
                                </div>
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname.startsWith(item.path);
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                                                isActive 
                                                    ? 'bg-primary/10 text-primary font-bold shadow-sm' 
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium'
                                            }`}
                                        >
                                            <Icon size={22} className={isActive ? 'text-primary' : 'text-gray-400'} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-white/50">
                                <div className="flex items-center gap-3 mb-4 px-2">
                                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-md">
                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-sm font-bold text-gray-900 truncate">{user?.company_name || user?.username || 'User'}</span>
                                        <span className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
