"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Route, CheckCircle, ExternalLink, PlayCircle, Trash2, Save, Loader2, Sparkles, Lightbulb } from 'lucide-react';

export default function Reskilling() {
    const [inputText, setInputText] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [workflows, setWorkflows] = useState([]);
    const [selectedWorkflow, setSelectedWorkflow] = useState(null);
    const [roadmap, setRoadmap] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!currentRole.trim() || !targetRole.trim()) {
            setError('Please fill in both current role and target role.');
            return;
        }
        setError('');
        setIsLoading(true);
        setRoadmap(null);

        try {
            const res = await fetch('/api/reskilling', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentRole: currentRole.trim(),
                    targetRole: targetRole.trim(),
                    preferences: inputText.trim(),
                }),
            });

            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                setRoadmap(data.roadmap);
                const newWorkflow = {
                    id: Date.now(),
                    name: `${currentRole} → ${targetRole}`,
                    currentRole,
                    targetRole,
                    createdAt: new Date().toLocaleString(),
                    roadmap: data.roadmap,
                };
                setWorkflows(prev => [newWorkflow, ...prev]);
                setSelectedWorkflow(newWorkflow);
            }
        } catch {
            setError('Failed to generate roadmap. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (id) => {
        setWorkflows(prev => prev.filter(w => w.id !== id));
        if (selectedWorkflow?.id === id) {
            setSelectedWorkflow(null);
            setRoadmap(null);
        }
    };

    const handleSelectWorkflow = (w) => {
        setSelectedWorkflow(w);
        setRoadmap(w.roadmap);
    };

    const activeRoadmap = roadmap;

    return (
        <div className="flex gap-8 animate-in fade-in duration-500 pb-10">
            <aside className="w-72 shrink-0 hidden lg:flex flex-col bg-white border border-slate-200 rounded-xl p-4 h-fit sticky top-24 max-h-[80vh] shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-900">Saved Roadmaps</h3>
                    <span className="text-xs text-slate-500 font-medium">{workflows.length}</span>
                </div>
                <div className="overflow-y-auto flex-1 space-y-2" style={{ maxHeight: '60vh' }}>
                    {workflows.length === 0 ? (
                        <p className="text-xs text-slate-500 italic text-center py-6">No saved roadmaps yet. Generate one to get started.</p>
                    ) : (
                        workflows.map(w => (
                            <div
                                key={w.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => handleSelectWorkflow(w)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectWorkflow(w); }}
                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedWorkflow?.id === w.id
                                    ? 'bg-cyan-600/10 border-cyan-600/30 text-cyan-800'
                                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                                    }`}
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="truncate text-sm font-medium min-w-0">{w.name}</div>
                                    <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(w.id); }} className="text-slate-500 hover:text-red-600 transition-colors shrink-0 p-0.5" aria-label="Delete roadmap">
                                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                                    </button>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">{w.createdAt}</div>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            <div className="flex-1 space-y-8 min-w-0">
                <header className="pb-6 border-b border-slate-200">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Career Transition Path</h1>
                    <p className="text-slate-500 text-sm">AI-powered personalized learning roadmaps with real course recommendations.</p>
                </header>

                <Card>
                    <h3 className="text-base font-semibold text-slate-900 mb-3 pb-3 border-b border-slate-200">Generate Your Reskilling Roadmap</h3>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">{error}</div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="current-role" className="block text-sm font-medium text-slate-600 mb-1.5">Current Role</label>
                            <input
                                id="current-role"
                                type="text"
                                value={currentRole}
                                onChange={(e) => setCurrentRole(e.target.value)}
                                placeholder="e.g. Customer Support Agent"
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="target-role" className="block text-sm font-medium text-slate-600 mb-1.5">Target Role</label>
                            <input
                                id="target-role"
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g. Data Analyst"
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="preferences" className="block text-sm font-medium text-slate-600 mb-1.5">Additional Preferences (optional)</label>
                        <textarea
                            id="preferences"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="e.g. I prefer free resources in English, I have 3 years experience in BPO..."
                            className="w-full h-20 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm p-4 placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 resize-none transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading || !currentRole.trim() || !targetRole.trim()}
                            className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                            ) : (
                                <><Sparkles className="w-4 h-4" strokeWidth={1.75} /> Generate Roadmap</>
                            )}
                        </button>
                    </div>
                </Card>

                {activeRoadmap && (
                    <>
                        <Card className="border-l-4 border-l-cyan-600">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{activeRoadmap.title}</h3>
                            <p className="text-sm text-slate-600">{activeRoadmap.summary}</p>
                        </Card>

                        <Card>
                            <div className="flex items-center gap-2 mb-6">
                                <Route className="w-5 h-5 text-purple-400" strokeWidth={1.75} />
                                <h3 className="text-base font-semibold text-slate-900">8-Week Learning Roadmap</h3>
                            </div>
                            <div className="relative pl-6 space-y-10 border-l-2 border-slate-200 ml-3">
                                {(activeRoadmap.weeks || []).map((step, i) => (
                                    <div key={i} className="relative">
                                        <div className={`absolute -left-[35px] w-5 h-5 rounded-full flex items-center justify-center border-2 ${i === 0 ? 'bg-cyan-600 border-white ring-2 ring-cyan-600/40 ring-offset-2 ring-offset-white' : 'bg-white border-slate-300'}`}>
                                            {i === 0 && <CheckCircle className="w-3 h-3 text-white" strokeWidth={2.5} />}
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-cyan-700 uppercase tracking-wider">{step.period}</span>
                                            <h4 className="text-base font-semibold mt-1 mb-2 text-slate-900">{step.topic}</h4>
                                            <p className="text-sm text-slate-600 mb-3">{step.description}</p>
                                            <div className="space-y-2">
                                                {(step.resources || []).map((res, j) => (
                                                    <div key={j} className="bg-slate-50 border border-slate-200 rounded-xl p-3 inline-flex flex-col sm:flex-row gap-3 sm:items-center">
                                                        <div className="flex items-center gap-2">
                                                            <PlayCircle className="w-4 h-4 shrink-0 text-cyan-500" strokeWidth={1.75} />
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-900">{res.name}</div>
                                                                <div className="text-xs text-slate-500">{res.platform} · {res.type} {res.free ? '· Free' : '· Paid'}</div>
                                                            </div>
                                                        </div>
                                                        {res.url && res.url !== '#' && (
                                                            <a href={res.url} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-slate-50 text-cyan-700 text-xs px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 shadow-sm sm:ml-4">
                                                                <ExternalLink className="w-3 h-3" strokeWidth={1.75} /> Open
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {activeRoadmap.careerTips && activeRoadmap.careerTips.length > 0 && (
                            <Card className="bg-amber-50/50 border-amber-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <Lightbulb className="w-5 h-5 text-amber-500" strokeWidth={1.75} />
                                    <h3 className="text-base font-semibold text-slate-900">Career Tips</h3>
                                </div>
                                <ul className="space-y-2">
                                    {activeRoadmap.careerTips.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                            <span className="text-amber-500 mt-0.5">•</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
