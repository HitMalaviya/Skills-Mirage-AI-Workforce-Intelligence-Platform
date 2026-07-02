"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export function Dropdown({ value, onChange, options, placeholder = "Select..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = options.filter(o => o.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-40 min-w-0 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg px-3 py-2.5 outline-none hover:border-slate-300 hover:bg-slate-50 focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all shadow-sm"
            >
                <span className="truncate">{value || placeholder}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.75} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 lg:left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-2 border-b border-slate-200 bg-slate-50/60">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 text-sm text-slate-900 rounded-md px-2.5 py-2 pl-8 outline-none focus:border-cyan-600/60 focus:ring-1 focus:ring-cyan-600/15 transition-colors placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                    <div className="max-h-52 overflow-y-auto py-1">
                        {filtered.length === 0 ? (
                            <div className="px-3 py-3 text-sm text-slate-500">No results</div>
                        ) : (
                            filtered.map((opt, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => { onChange(opt); setIsOpen(false); setSearchTerm(''); }}
                                    className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                    {opt}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
