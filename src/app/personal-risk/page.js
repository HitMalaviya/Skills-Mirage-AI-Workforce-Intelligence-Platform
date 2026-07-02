"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Line, Radar } from '@/components/ui/Charts';
import { Dropdown } from '@/components/ui/Dropdown';
import { ShieldAlert, Activity, BookOpen, Repeat2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PersonalRiskAnalysis() {
    const [transferCategory, setTransferCategory] = useState('Select Category');
    const [analysis, setAnalysis] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const analysisData = localStorage.getItem('skillAnalysisResult');
        const profileData = localStorage.getItem('workerProfileData');
        if (analysisData) setAnalysis(JSON.parse(analysisData));
        if (profileData) setProfile(JSON.parse(profileData));
    }, []);

    const riskScore = analysis?.riskScore || 74;
    const riskLevel = analysis?.riskLevel || 'High';
    const narrative = analysis?.narrative || 'Complete your Worker Profile to get a personalized AI assessment.';
    const radarScores = analysis?.radarScores || {};

    const radarLabels = ['Technical', 'Problem Solving', 'Communication', 'Management', 'Adaptability', 'Leadership'];
    const radarValues = [
        radarScores.technical || 50,
        radarScores.problemSolving || 50,
        radarScores.communication || 50,
        radarScores.management || 50,
        radarScores.adaptability || 50,
        radarScores.leadership || 50,
    ];

    // Generate trend data based on risk score
    const baseTrend = Math.max(riskScore - 20, 10);
    const trendData = [
        { month: 'Oct', score: baseTrend },
        { month: 'Nov', score: baseTrend + 5 },
        { month: 'Dec', score: baseTrend + 8 },
        { month: 'Jan', score: baseTrend + 12 },
        { month: 'Feb', score: riskScore },
    ];

    const riskColor = riskScore >= 70 ? 'red' : riskScore >= 40 ? 'amber' : 'emerald';
    const riskBadgeClasses = {
        red: 'bg-red-50 text-red-700 border-red-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personal Risk Analysis</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {profile ? `${profile.jobTitle} · ${profile.city} · ${profile.experience} yrs` : 'Holistic view of your career sustainability.'}
                    </p>
                </div>
                <Link
                    href="/reskilling"
                    className="inline-flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 border border-cyan-700/10 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                    Build Transition Plan →
                </Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className={`lg:col-span-1 border-t-4 border-t-${riskColor}-500 flex flex-col items-center justify-center text-center p-8`}>
                    <ShieldAlert className={`w-12 h-12 text-${riskColor}-500 mb-3`} strokeWidth={1.5} />
                    <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Risk Score</h2>
                    <div className="text-4xl font-bold text-slate-900 mb-2">{riskScore}<span className="text-base text-slate-500 font-medium">/100</span></div>
                    <div className={`px-3 py-1.5 rounded-full font-medium text-xs border ${riskBadgeClasses[riskColor]}`}>
                        {riskLevel} Vulnerability Profile
                    </div>
                </Card>

                <Card className="lg:col-span-2 flex flex-col">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                        <Sparkles className="w-5 h-5 text-purple-400" strokeWidth={1.75} />
                        <h3 className="text-base font-semibold text-slate-900">AI Qualitative Assessment</h3>
                    </div>
                    <div className="flex-1 text-sm text-slate-700 leading-relaxed">
                        <p>{narrative}</p>
                    </div>
                    {!analysis && (
                        <Link href="/worker-profile" className="mt-4 inline-flex items-center text-sm text-cyan-700 hover:text-cyan-800 font-medium transition-colors">
                            → Complete Worker Profile for personalized insights
                        </Link>
                    )}
                </Card>
            </div>

            <Card>
                <h3 className="text-base font-semibold text-slate-900 mb-1">Risk Trend Over Time</h3>
                <p className="text-xs text-slate-500 mb-6">Historical monitoring of your personal automation exposure.</p>
                <div className="h-56 w-full">
                    <Line data={{ labels: trendData.map(d => d.month), datasets: [{ label: 'Risk Score', data: trendData.map(d => d.score), borderColor: '#ef4444', tension: 0.4 }] }}
                        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 }, x: { grid: { display: false } } } }} />
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-cyan-400" strokeWidth={1.75} />
                        <h3 className="text-base font-semibold text-slate-900">Skill Visualization</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-6">AI-detected structural competence profile.</p>
                    <div className="h-64 w-full">
                        <Radar data={{ labels: radarLabels, datasets: [{ label: 'Competence', data: radarValues, backgroundColor: 'rgba(6,182,212,0.3)', borderColor: '#06b6d4', pointBackgroundColor: '#06b6d4' }] }}
                            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { min: 0, max: 100, ticks: { display: false }, grid: { color: '#e2e8f0' }, angleLines: { color: '#e2e8f0' }, pointLabels: { color: '#64748b', font: { size: 11 } } } } }} />
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200">
                        <Repeat2 className="w-5 h-5 text-amber-400" strokeWidth={1.75} />
                        <h3 className="text-base font-semibold text-slate-900">Job Transferability Engine</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-6">Select a job category to evaluate career transferability paths.</p>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="w-full sm:w-72">
                            <Dropdown value={transferCategory} onChange={setTransferCategory} options={['Select Category', 'Software Dev', 'Customer Support', 'Marketing', 'Data Science', 'DevOps', 'UI/UX Design', 'Sales', 'HR']} />
                        </div>
                        <Link href="/reskilling" className="inline-flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm">
                            Build Transition →
                        </Link>
                    </div>
                    {transferCategory !== 'Select Category' && (
                        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700">
                            <strong className="text-slate-900">Transferability for {transferCategory}:</strong>
                            <p className="mt-2"><span className="text-cyan-700">{transferCategory}</span> professionals can transition to 3-5 adjacent roles with moderate reskilling. Key transferable skills include communication, analytical thinking, and domain expertise.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
