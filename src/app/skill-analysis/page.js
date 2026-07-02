"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Radar } from '@/components/ui/Charts';
import { Activity, Target, AlertTriangle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SkillAnalysis() {
    const [profile, setProfile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const profileData = localStorage.getItem('workerProfileData');
        const analysisData = localStorage.getItem('skillAnalysisResult');

        if (profileData && analysisData) {
            setProfile(JSON.parse(profileData));
            setAnalysis(JSON.parse(analysisData));
        } else {
            router.push('/worker-profile');
        }
    }, [router]);

    if (!profile || !analysis) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-slate-400 text-sm font-medium">Loading analysis...</div>
        </div>
    );

    const radarLabels = ['Technical', 'Problem Solving', 'Communication', 'Management', 'Adaptability', 'Leadership'];
    const radarScores = analysis.radarScores || {};
    const radarValues = [
        radarScores.technical || 50,
        radarScores.problemSolving || 50,
        radarScores.communication || 50,
        radarScores.management || 50,
        radarScores.adaptability || 50,
        radarScores.leadership || 50,
    ];

    const detectedSkills = analysis.detectedSkills || [];
    const riskColor = analysis.riskScore >= 70 ? 'red' : analysis.riskScore >= 40 ? 'amber' : 'emerald';

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Skill Analysis Report</h1>
                    <p className="text-slate-500 text-sm mt-1">Based on your profile: {profile.jobTitle} in {profile.city} · {profile.experience} yrs exp</p>
                </div>
                <Link href="/personal-risk" className="inline-flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white border border-cyan-700/10 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors gap-2 shadow-sm">
                    View Risk Score <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </Link>
            </header>

            {/* AI Narrative */}
            <Card className="border-l-4 border-l-purple-500">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-400" strokeWidth={1.75} />
                    <h3 className="text-base font-semibold text-slate-900">AI Assessment</h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{analysis.narrative || 'No narrative available.'}</p>
                {analysis.topRecommendation && (
                    <div className="mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg text-sm text-cyan-800 font-medium">
                        💡 {analysis.topRecommendation}
                    </div>
                )}
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-purple-400" strokeWidth={1.75} />
                        <h3 className="text-base font-semibold text-slate-900">Competency Radar</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">AI-detected skill distribution across fundamental domains.</p>
                    <div className="h-72 w-full mt-4 flex items-center justify-center">
                        <Radar
                            data={{
                                labels: radarLabels,
                                datasets: [
                                    {
                                        label: 'Detected Depth',
                                        data: radarValues,
                                        backgroundColor: 'rgba(139, 92, 246, 0.3)',
                                        borderColor: '#8b5cf6',
                                        pointBackgroundColor: '#8b5cf6',
                                    },
                                    {
                                        label: 'Market Requirement',
                                        data: [100, 100, 100, 100, 100, 100],
                                        backgroundColor: 'rgba(6, 182, 212, 0.2)',
                                        borderColor: '#06b6d4',
                                        borderDash: [5, 5],
                                        pointBackgroundColor: '#06b6d4',
                                    }
                                ]
                            }}
                            options={{
                                responsive: true, maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, color: '#475569' } } },
                                scales: {
                                    r: {
                                        min: 0, max: 100,
                                        ticks: { display: false },
                                        grid: { color: '#e2e8f0' },
                                        angleLines: { color: '#e2e8f0' },
                                        pointLabels: { color: '#64748b', font: { size: 11 } }
                                    }
                                }
                            }}
                        />
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className={`border-t-4 border-t-${riskColor}-500 bg-${riskColor}-500/5`}>
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-amber-400" strokeWidth={1.75} />
                            <h3 className="text-base font-semibold text-slate-900">Risk Breakdown</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Automation Score</span>
                                <span className="text-slate-900 font-semibold">{analysis.automationScore || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Demand Decline</span>
                                <span className="text-slate-900 font-semibold">{analysis.demandDecline || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Skill Replaceability</span>
                                <span className="text-slate-900 font-semibold">{analysis.skillReplaceability || '—'}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                <span className="text-cyan-600 font-medium">Overall Risk Score</span>
                                <span className="text-2xl font-bold text-slate-900">{analysis.riskScore}<span className="text-sm text-slate-500 font-normal">/100</span></span>
                            </div>
                        </div>
                    </Card>

                    {analysis.saferAlternatives && analysis.saferAlternatives.length > 0 && (
                        <Card>
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
                                <h3 className="text-base font-semibold text-slate-900">Safer Alternatives</h3>
                            </div>
                            <div className="space-y-2">
                                {analysis.saferAlternatives.map((role, i) => (
                                    <div key={i} className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-medium">
                                        {role}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {detectedSkills.length > 0 && (
                <Card>
                    <div className="flex items-center gap-2 mb-6">
                        <Target className="w-5 h-5 text-cyan-400" strokeWidth={1.75} />
                        <h3 className="text-base font-semibold text-slate-900">AI-Detected Skill Confidence</h3>
                    </div>
                    <div className="space-y-4">
                        {detectedSkills.map((skill, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-slate-700">{skill.name}</span>
                                    <span className="text-cyan-400 font-semibold">{skill.score}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${skill.score >= 80 ? 'bg-cyan-500' : 'bg-purple-500'}`}
                                        style={{ width: `${skill.score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
