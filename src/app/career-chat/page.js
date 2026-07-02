"use client";

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Send, Bot, User, Mic, Loader2 } from 'lucide-react';

export default function CareerChat() {
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', content: 'Hello! I am your AI Career Guide powered by Skills Mirage. I can help you with:\n\n• Understanding your AI automation risk\n• Suggesting career transition paths\n• Recommending courses (NPTEL, SWAYAM, Coursera)\n• Personalized reskilling guidance\n\nHow can I help you today? (English/Hindi supported)' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const endOfMessagesRef = useRef(null);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { id: Date.now(), role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const chatHistory = [...messages, userMessage]
                .filter(m => m.role === 'user' || m.role === 'assistant')
                .map(m => ({ role: m.role, content: m.content }));

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: chatHistory }),
            });

            const data = await res.json();

            if (data.error) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.'
                }]);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: data.reply
                }]);
            }
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: 'Connection error. Please check your internet and try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-10 flex flex-col h-[calc(100vh-100px)]">
            <header>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Career Guidance</h1>
                <p className="text-slate-500 text-sm mt-1">Chat about your job risk and upskilling pathways. Powered by Groq AI (EN/HI)</p>
            </header>

            <Card className="flex-1 flex flex-col overflow-hidden p-0 min-h-0">
                <div className="bg-slate-50 w-full p-4 border-b border-slate-200 flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 bg-cyan-600/10 rounded-full flex items-center justify-center border border-cyan-600/20">
                        <Bot className="w-5 h-5 text-cyan-600" strokeWidth={1.75} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 text-sm">Skills Mirage Assistant</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                            <span className="text-xs text-slate-500">{isLoading ? 'Thinking...' : 'Online'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6 min-h-0">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-slate-100 border border-slate-200'}`}>
                                {msg.role === 'user' ? <User className="w-4 h-4 text-white" strokeWidth={1.75} /> : <Bot className="w-4 h-4 text-cyan-600" strokeWidth={1.75} />}
                            </div>
                            <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-cyan-600 text-white rounded-tr-md'
                                    : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-md'
                                }`}>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-slate-100 border border-slate-200">
                                <Bot className="w-4 h-4 text-cyan-600" strokeWidth={1.75} />
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-md p-3.5 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-cyan-600 animate-spin" />
                                <span className="text-sm text-slate-500">Generating response...</span>
                            </div>
                        </div>
                    )}
                    <div ref={endOfMessagesRef} />
                </div>

                <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <button type="button" className="shrink-0 p-2 rounded-lg text-slate-500 hover:text-cyan-700 transition-colors" aria-label="Voice input">
                            <Mic className="w-5 h-5" strokeWidth={1.75} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your career risk, courses, or say 'mujhe kya karna chahiye?'..."
                            disabled={isLoading}
                            className="flex-1 bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all shadow-sm disabled:opacity-60"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="shrink-0 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-200 disabled:text-slate-400 text-white p-3 rounded-xl transition-colors flex items-center justify-center disabled:cursor-not-allowed shadow-sm"
                        >
                            <Send className="w-4 h-4" strokeWidth={1.75} />
                        </button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
