"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Map,
    BrainCircuit,
    FileText,
    Radar,
    MessageSquare,
    LogOut,
    Route
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <BarChart3 className="w-5 h-5 shrink-0" strokeWidth={1.75} /> },
        { name: 'Hiring Trends', path: '/hiring-trends', icon: <BarChart3 className="w-5 h-5 shrink-0" strokeWidth={1.75} /> },
        { name: 'Skills Intelligence', path: '/skills-intelligence', icon: <BrainCircuit className="w-5 h-5 shrink-0" strokeWidth={1.75} /> },
        { name: 'AI Vulnerability', path: '/ai-vulnerability', icon: <Map className="w-5 h-5 shrink-0" strokeWidth={1.75} /> },
        { name: 'Worker Profile', path: '/worker-profile', icon: <FileText className="w-5 h-5 shrink-0" strokeWidth={1.75} /> },
        { name: 'Personal Risk', path: '/personal-risk', icon: <Radar className="w-5 h-5 shrink-0" strokeWidth={1.75} /> },
        { name: 'Career Transition', path: '/reskilling', icon: <Route className="w-5 h-5 shrink-0" strokeWidth={1.75} /> },
        { name: 'AI Career Chat', path: '/career-chat', icon: <MessageSquare className="w-5 h-5 shrink-0" strokeWidth={1.75} /> },
    ];

    if (pathname === '/login' || pathname === '/register') return null;

    return (
        <aside className="w-64 h-screen bg-white/90 backdrop-blur-sm border-r border-slate-200 flex flex-col fixed left-0 top-0 pt-16 z-10">
            <nav className="p-4 flex-1 overflow-y-auto">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                        isActive
                                            ? 'bg-cyan-600/10 text-cyan-700 border border-cyan-600/20 shadow-sm'
                                            : 'text-slate-700 border border-transparent hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="p-4 border-t border-slate-200 space-y-2">
                {user?.fullName && (
                    <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Signed in</p>
                        <p className="text-sm text-slate-900 truncate mt-0.5">{user.fullName}</p>
                    </div>
                )}
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 transition-all text-sm font-medium"
                >
                    <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
