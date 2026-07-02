"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, BrainCircuit, Map, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-slate-400 text-sm font-medium">Loading...</div>
    </div>
  );

  const modules = [
    { title: 'Hiring Trends Analysis', icon: <BarChart3 className="w-6 h-6 text-cyan-400" strokeWidth={1.75} />, path: '/hiring-trends', desc: 'Monitor job demand and market volume.' },
    { title: 'Skills Intelligence', icon: <BrainCircuit className="w-6 h-6 text-purple-400" strokeWidth={1.75} />, path: '/skills-intelligence', desc: 'Discover rising skills and industry gaps.' },
    { title: 'AI Vulnerability', icon: <Map className="w-6 h-6 text-red-400" strokeWidth={1.75} />, path: '/ai-vulnerability', desc: 'Assess automation risks across roles.' },
    { title: 'Personal Risk Analysis', icon: <ShieldAlert className="w-6 h-6 text-amber-400" strokeWidth={1.75} />, path: '/personal-risk', desc: 'Evaluate specific job threats.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Welcome back, {user.fullName}</h1>
        <p className="text-slate-600 text-sm">Here is your workforce intelligence overview for today.</p>
      </section>

      <section>
        <h2 className="sr-only">Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod, idx) => (
            <Link href={mod.path} key={idx} className="block group">
              <div className="h-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-600/20 flex items-center justify-center mb-5 transition-colors">
                  {mod.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2 tracking-tight">{mod.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{mod.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
