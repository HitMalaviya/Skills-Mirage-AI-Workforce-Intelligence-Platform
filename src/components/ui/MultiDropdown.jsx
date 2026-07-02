"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export function MultiDropdown({ selected, onChange, options, placeholder = "Select..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (opt) => {
        if (selected.includes(opt)) {
            onChange(selected.filter(o => o !== opt));
        } else {
            onChange([...selected, opt]);
        }
    };

    const displayText = selected.length === 0 ? placeholder : selected.length === 1 ? selected[0] : `${selected.length} selected`;

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between min-w-40 min-h-0 bg-white border border-slate-200 text-slate-900 text-sm rounded-lg px-3 py-2.5 outline-none hover:border-slate-300 hover:bg-slate-50 focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all shadow-sm"
            >
                <span className="truncate">{displayText}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.75} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="max-h-52 overflow-y-auto py-1">
                        {options.map((opt, i) => {
                            const isActive = selected.includes(opt);
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => toggleOption(opt)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                    <span className="truncate">{opt}</span>
                                    {isActive && <Check className="w-4 h-4 text-cyan-600 shrink-0 ml-2" strokeWidth={2} />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
