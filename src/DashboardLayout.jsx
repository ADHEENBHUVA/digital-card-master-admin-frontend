import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, PlusCircle, LogOut, LayoutDashboard, Menu, X, ChevronLeft, ChevronRight, Sun, Moon, UserCircle, Layout } from 'lucide-react';
import useTheme from './hooks/useTheme';

export default function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    // Mobile sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Desktop collapsible sidebar state
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/sub-admins', label: 'Sub Admins', icon: Users },
        { path: '/add-sub-admin', label: 'Add Sub Admin', icon: PlusCircle },
        { path: '/profile', label: 'My Profile', icon: UserCircle },
    ];

    return (
        <div className="flex h-screen bg-[#f1f5f9] dark:bg-slate-900 font-sans overflow-hidden relative">

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-30 absolute top-0 w-full shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-tr from-primary to-secondary p-1.5 rounded-lg">
                        <LayoutDashboard className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">Master Panel</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={toggleTheme} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 focus:outline-none">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 focus:outline-none">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Backdrop for Mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 flex flex-col shadow-2xl md:shadow-none z-50 transform transition-all duration-300 ease-in-out md:relative 
                ${sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 md:translate-x-0'} 
                ${isCollapsed ? 'md:w-24' : 'md:w-72'}`}
            >

                {/* Desktop Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-4 top-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary p-1.5 rounded-full z-50 hover:scale-110 transition-all"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>

                {/* Sidebar Header (Hidden on mobile) */}
                <div className={`hidden md:flex p-8 items-center gap-3 border-b border-slate-100 dark:border-slate-700 transition-all ${isCollapsed ? 'justify-center p-6' : ''}`}>
                    <div className="bg-gradient-to-tr from-primary to-secondary p-2 rounded-xl shadow-lg shadow-primary/20 flex-shrink-0">
                        <LayoutDashboard className="text-white w-6 h-6" />
                    </div>
                    <h2 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-slate-100 dark:to-slate-400 whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                        Master Panel
                    </h2>
                </div>

                {/* Mobile Sidebar spacer & Close Button */}
                <div className="h-[73px] md:hidden border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-6">
                    <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300">Menu</h2>
                    <button onClick={() => setSidebarOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 ring-primary/20">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
                    <p className={`px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 h-0 hidden' : 'opacity-100 hidden md:block'}`}>Management</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200'} ${isCollapsed ? 'justify-center' : ''}`}
                                title={isCollapsed ? item.label : ""}
                            >
                                <Icon size={20} className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`} />
                                <span className={`relative z-10 whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 inline-block'}`}>{item.label}</span>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-2">
                    <button
                        onClick={toggleTheme}
                        title={isCollapsed ? "Toggle Theme" : ""}
                        className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all font-medium group overflow-hidden ${isCollapsed ? 'justify-center' : 'text-left'}`}
                    >
                        {theme === 'dark' ? (
                            <Sun size={20} className="flex-shrink-0 group-hover:scale-110 group-hover:text-amber-400 transition-all" />
                        ) : (
                            <Moon size={20} className="flex-shrink-0 group-hover:scale-110 group-hover:text-indigo-500 transition-all" />
                        )}
                        <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 inline-block'}`}>
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>
                    <button
                        onClick={handleLogout}
                        title={isCollapsed ? "Sign Out" : ""}
                        className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all font-medium group overflow-hidden ${isCollapsed ? 'justify-center' : 'text-left'}`}
                    >
                        <LogOut size={20} className="flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                        <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 inline-block'}`}>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto relative mt-[73px] md:mt-0 w-full min-h-full transition-all duration-300 select-none">
                {/* Minimal Topbar pattern */}
                <div className="h-48 bg-gradient-to-br from-primary to-secondary absolute top-0 left-0 w-full rounded-bl-[100px] z-0 opacity-10 pointer-events-none"></div>

                <div className="relative z-10 p-4 md:p-10 max-w-7xl mx-auto min-h-full overflow-x-hidden">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
