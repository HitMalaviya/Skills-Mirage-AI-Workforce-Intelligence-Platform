"use client";

import { usePathname } from 'next/navigation';
import { Bell, Search, Hexagon } from 'lucide-react';

const Header = () => {
    const pathname = usePathname();

    if (pathname === '/login' || pathname === '/register') return null;

    return (
        <header className="h-16 bg-white/85 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-20 shadow-sm">
            <div className="flex items-center gap-3 min-w-[14rem]">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-600/10 border border-cyan-600/20">
                    <Hexagon className="w-5 h-5 text-cyan-600" strokeWidth={2} />
                </div>
                <span className="text-lg font-semibold tracking-tight text-slate-900">
                    Skills <span className="text-cyan-600">Mirage</span>
                </span>
            </div>

            <div className="flex-1 flex justify-end items-center gap-4 max-w-2xl">
                <div className="relative flex-1 max-w-xs">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search intelligence..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all"
                    />
                </div>

                <button
                    type="button"
                    className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5" strokeWidth={1.75} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-600 rounded-full ring-2 ring-white" />
                </button>
            </div>
        </header>
    );
};

export default Header;
