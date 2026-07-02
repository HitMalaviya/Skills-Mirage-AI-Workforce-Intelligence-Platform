"use client";

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Line } from '@/components/ui/Charts';
import { Dropdown } from '@/components/ui/Dropdown';
import { MultiDropdown } from '@/components/ui/MultiDropdown';
import { ArrowUpRight, ArrowDownRight, Zap, Target, BookOpen, TrendingDown, ChevronDown, RefreshCw, Loader2 } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';

const SKILL_COLORS = { 'Gen AI': '#a855f7', 'GenAI': '#a855f7', 'Python': '#22d3ee', 'React': '#38bdf8', 'Java': '#94a3b8' };
const allSkillKeys = ['Gen AI', 'Python', 'React', 'Java'];
const SKILL_TIME_OPTIONS = ['Last 7 days', 'Last 15 days', 'Last 30 days', 'Last 6 months', 'Last 1 year'];

// ── City-specific skill prominence weights (used for city filter) ──
const citySkillWeights = {
    'Bangalore': { 'Generative AI': 1.2, 'Python': 1.15, 'Cloud Architecture': 1.3, 'React/Next.js': 1.1, 'Cybersecurity': 1.0, 'Data Entry': 0.6, 'Telemarketing': 0.5 },
    'Pune': { 'Generative AI': 1.0, 'Python': 1.1, 'Cloud Architecture': 1.0, 'React/Next.js': 1.15, 'Data Engineering': 1.2, 'Telemarketing': 0.7 },
    'Hyderabad': { 'Generative AI': 1.15, 'Python': 1.2, 'Machine Learning': 1.3, 'Cloud Architecture': 1.1, 'Cybersecurity': 1.05, 'Data Entry': 0.65 },
    'Delhi NCR': { 'Python': 1.0, 'React/Next.js': 1.1, 'Cloud Architecture': 0.9, 'Cybersecurity': 1.2, 'Telemarketing': 0.9, 'Data Entry': 0.8 },
    'Chennai': { 'Python': 1.05, 'Java': 1.2, 'Data Engineering': 1.1, 'Cloud Architecture': 0.95, 'Manual QA Testing': 0.8 },
    'Mumbai': { 'Python': 1.0, 'React/Next.js': 1.05, 'Cybersecurity': 1.15, 'Cloud Architecture': 1.0, 'Telemarketing': 0.85 },
};

// ── Sector-specific skill data ──
const sectorSkills = {
    'IT & Software': {
        rising: [
            { id: 1, name: 'Generative AI', growth: '+52%' }, { id: 2, name: 'Cloud Architecture', growth: '+32%' },
            { id: 3, name: 'Full Stack Dev', growth: '+22%' }, { id: 4, name: 'DevOps/SRE', growth: '+20%' },
        ],
        declining: [
            { id: 1, name: 'Manual QA Testing', decline: '-30%' }, { id: 2, name: 'Basic Web Dev', decline: '-22%' },
        ],
        gap: [
            { skill: 'AI/ML Engineering', demand: 'Very High', available: 'Low', gapStatus: 'large' },
            { skill: 'Cloud Security', demand: 'High', available: 'Medium', gapStatus: 'moderate' },
            { skill: 'DevOps', demand: 'High', available: 'Medium', gapStatus: 'moderate' },
        ],
        scores: [{ id: 1, name: 'Python', score: 96 }, { id: 2, name: 'JavaScript', score: 92 }, { id: 3, name: 'AWS', score: 85 }, { id: 4, name: 'Docker', score: 82 }],
        clusters: [
            { category: 'AI/ML Pipeline', skills: ['Python', 'PyTorch', 'LangChain', 'MLOps', 'Vector DBs'] },
            { category: 'Full Stack', skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis'] },
        ],
    },
    'Healthcare': {
        rising: [
            { id: 1, name: 'Health Informatics', growth: '+28%' }, { id: 2, name: 'AI Diagnostics', growth: '+35%' },
            { id: 3, name: 'Telemedicine Tech', growth: '+22%' },
        ],
        declining: [
            { id: 1, name: 'Manual Data Entry (Medical)', decline: '-25%' }, { id: 2, name: 'Paper Records Mgmt', decline: '-32%' },
        ],
        gap: [
            { skill: 'Health Informatics', demand: 'High', available: 'Low', gapStatus: 'large' },
            { skill: 'Medical Coding', demand: 'Medium', available: 'Medium', gapStatus: 'covered' },
        ],
        scores: [{ id: 1, name: 'Medical Coding', score: 85 }, { id: 2, name: 'HIPAA Compliance', score: 78 }, { id: 3, name: 'Health IT', score: 72 }],
        clusters: [
            { category: 'Health Tech', skills: ['EHR Systems', 'HL7/FHIR', 'Medical AI', 'Telehealth'] },
        ],
    },
    'Finance': {
        rising: [
            { id: 1, name: 'Fintech Dev', growth: '+30%' }, { id: 2, name: 'Blockchain', growth: '+25%' },
            { id: 3, name: 'Risk Analytics', growth: '+20%' },
        ],
        declining: [
            { id: 1, name: 'Manual Bookkeeping', decline: '-35%' }, { id: 2, name: 'Basic Data Entry', decline: '-28%' },
        ],
        gap: [
            { skill: 'Quantitative Analysis', demand: 'High', available: 'Low', gapStatus: 'large' },
            { skill: 'Financial Modeling', demand: 'Medium', available: 'Medium', gapStatus: 'moderate' },
        ],
        scores: [{ id: 1, name: 'Financial Modeling', score: 88 }, { id: 2, name: 'SQL', score: 85 }, { id: 3, name: 'Python', score: 80 }],
        clusters: [
            { category: 'Fintech', skills: ['Python', 'Blockchain', 'Smart Contracts', 'Risk Modeling', 'RegTech'] },
        ],
    },
    'Manufacturing': {
        rising: [
            { id: 1, name: 'Industrial IoT', growth: '+28%' }, { id: 2, name: 'Robotics', growth: '+22%' },
            { id: 3, name: 'Digital Twin', growth: '+18%' },
        ],
        declining: [
            { id: 1, name: 'Manual Assembly', decline: '-30%' }, { id: 2, name: 'Paper-based QC', decline: '-25%' },
        ],
        gap: [
            { skill: 'PLC Programming', demand: 'High', available: 'Low', gapStatus: 'large' },
            { skill: 'Automation Engineering', demand: 'High', available: 'Medium', gapStatus: 'moderate' },
        ],
        scores: [{ id: 1, name: 'PLC/SCADA', score: 82 }, { id: 2, name: 'CAD/CAM', score: 78 }, { id: 3, name: 'IoT', score: 75 }],
        clusters: [
            { category: 'Smart Manufacturing', skills: ['IoT', 'Robotics', 'PLC', 'Digital Twin', 'AI Vision'] },
        ],
    },
};

// ── Default / fallback data ──
const defaultRising = [
    { id: 1, name: 'Generative AI', growth: '+52%' }, { id: 2, name: 'Prompt Engineering', growth: '+45%' },
    { id: 3, name: 'Cloud Architecture', growth: '+28%' }, { id: 4, name: 'Python', growth: '+24%' },
    { id: 5, name: 'Cybersecurity', growth: '+22%' }, { id: 6, name: 'LLM Fine-tuning', growth: '+20%' },
    { id: 7, name: 'Data Engineering', growth: '+18%' }, { id: 8, name: 'React/Next.js', growth: '+15%' },
];
const defaultDeclining = [
    { id: 1, name: 'Data Entry', decline: '-38%' }, { id: 2, name: 'Telemarketing', decline: '-32%' },
    { id: 3, name: 'Manual QA Testing', decline: '-26%' }, { id: 4, name: 'Basic Copywriting', decline: '-22%' },
];
const defaultGap = [
    { skill: 'Gen AI Integration', demand: 'Very High', available: 'Very Low', gapStatus: 'large' },
    { skill: 'Python/ML', demand: 'High', available: 'Medium', gapStatus: 'moderate' },
    { skill: 'Cloud (AWS/GCP)', demand: 'Very High', available: 'Medium', gapStatus: 'moderate' },
    { skill: 'AI Prompting', demand: 'High', available: 'Low', gapStatus: 'large' },
    { skill: 'Data Structures', demand: 'Medium', available: 'High', gapStatus: 'covered' },
];
const defaultScores = [
    { id: 1, name: 'Python', score: 96 }, { id: 2, name: 'SQL', score: 90 },
    { id: 3, name: 'React', score: 87 }, { id: 4, name: 'Docker', score: 80 }, { id: 5, name: 'TensorFlow', score: 75 },
];
const defaultClusters = [
    { category: 'AI/ML Engineering', skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'LangChain'] },
    { category: 'Full-Stack Dev', skills: ['JavaScript', 'React', 'Next.js', 'Node.js', 'TypeScript'] },
    { category: 'Cloud DevOps', skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'] },
];

// ── Build timeline data per time range ──
function buildTimeline(count, unit, baseValues = { 'Gen AI': 90, Python: 88, React: 82, Java: 58 }) {
    return Array.from({ length: count }, (_, i) => {
        const label = i === count - 1 ? (unit === 'd' ? 'Today' : 'This month') : `${count - 1 - i}${unit} ago`;
        return {
            date: label,
            'Gen AI': Math.min(100, Math.max(0, baseValues['Gen AI'] + (i - count / 2) * 0.8 + (i % 2) * 3)),
            Python: Math.min(100, Math.max(0, baseValues.Python + (i - count / 2) * 1.2 + (i % 3) * 2)),
            React: Math.min(100, Math.max(0, baseValues.React + (i - count / 2) * 1 + (i % 4) * 1.5)),
            Java: Math.min(100, Math.max(0, baseValues.Java - i * 0.3 + (i % 3) * 1)),
        };
    });
}

const timelineByRange = {
    'Last 7 days': buildTimeline(7, 'd'),
    'Last 15 days': buildTimeline(15, 'd'),
    'Last 30 days': buildTimeline(30, 'd'),
    'Last 6 months': buildTimeline(6, 'mo'),
    'Last 1 year': buildTimeline(12, 'mo'),
};

export default function SkillsIntelligence() {
    const { data: marketData, loading: marketLoading, refresh, lastUpdated } = useMarketData();
    const [city, setCity] = useState('All Cities');
    const [category, setCategory] = useState('All Categories');
    const [sector, setSector] = useState('All Sectors');
    const [selectedSkills, setSelectedSkills] = useState(['Gen AI', 'Python', 'React', 'Java']);
    const [skillTime, setSkillTime] = useState('Last 7 days');
    const [risingVisible, setRisingVisible] = useState(4);
    const [decliningVisible, setDecliningVisible] = useState(4);
    const [demandVisible, setDemandVisible] = useState(3);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const apiSkills = marketData?.skillsData || {};

    // ── SECTOR filter drives skill data ──
    const { risingSkills, decliningSkills, skillGapData, skillScores, skillClusters } = useMemo(() => {
        if (sector !== 'All Sectors' && sectorSkills[sector]) {
            const s = sectorSkills[sector];
            return {
                risingSkills: s.rising,
                decliningSkills: s.declining,
                skillGapData: s.gap,
                skillScores: s.scores,
                skillClusters: s.clusters,
            };
        }
        return {
            risingSkills: apiSkills.risingSkills || defaultRising,
            decliningSkills: apiSkills.decliningSkills || defaultDeclining,
            skillGapData: apiSkills.skillGap || defaultGap,
            skillScores: apiSkills.skillScores || defaultScores,
            skillClusters: apiSkills.skillClusters || defaultClusters,
        };
    }, [sector, apiSkills]);

    // ── CITY filter adjusts growth percentages ──
    const filteredRising = useMemo(() => {
        if (city === 'All Cities') return risingSkills;
        const weights = citySkillWeights[city] || {};
        return risingSkills.map(s => {
            const w = weights[s.name] || 1;
            const baseGrowth = parseInt(s.growth) || 0;
            const adjusted = Math.round(baseGrowth * w);
            return { ...s, growth: `${adjusted >= 0 ? '+' : ''}${adjusted}%` };
        }).sort((a, b) => parseInt(b.growth) - parseInt(a.growth));
    }, [city, risingSkills]);

    const filteredDeclining = useMemo(() => {
        if (city === 'All Cities') return decliningSkills;
        const weights = citySkillWeights[city] || {};
        return decliningSkills.map(s => {
            const w = weights[s.name] || 1;
            const baseDecline = parseInt(s.decline) || 0;
            const adjusted = Math.round(baseDecline * w);
            return { ...s, decline: `${adjusted}%` };
        }).sort((a, b) => parseInt(a.decline) - parseInt(b.decline));
    }, [city, decliningSkills]);

    // ── TIME filter on demand timeline ──
    const demandTimeline = timelineByRange[skillTime] || timelineByRange['Last 7 days'];
    const timeLabels = demandTimeline.map(d => d.date);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setIsRefreshing(false);
    };

    const activeFilterLabel = [
        city !== 'All Cities' && city,
        sector !== 'All Sectors' && sector,
    ].filter(Boolean).join(' · ');

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <header className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Skills Intelligence</h1>
                    <p className="text-slate-500 text-sm">
                        {marketData ? '🟢 Live AI-generated skill analysis' : 'Cross-industry analysis of skill demand and gaps.'}
                        {activeFilterLabel && <span className="ml-2 text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200 font-medium">Filtered: {activeFilterLabel}</span>}
                        {lastUpdated && <span className="ml-2 text-xs text-slate-400">Updated: {lastUpdated.toLocaleString()}</span>}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button onClick={handleRefresh} disabled={isRefreshing}
                        className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-cyan-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50">
                        {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                    <Dropdown value={city} onChange={(v) => { setCity(v); setRisingVisible(4); setDecliningVisible(4); }} options={['All Cities', 'Bangalore', 'Pune', 'Hyderabad', 'Delhi NCR', 'Chennai', 'Mumbai']} />
                    <Dropdown value={sector} onChange={(v) => { setSector(v); setRisingVisible(4); setDecliningVisible(4); setDemandVisible(3); }} options={['All Sectors', 'IT & Software', 'Healthcare', 'Finance', 'Manufacturing']} />
                </div>
            </header>

            {marketLoading && (
                <div className="flex items-center gap-3 bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                    <Loader2 className="w-5 h-5 text-cyan-600 animate-spin" />
                    <span className="text-sm text-cyan-800 font-medium">Generating live skill intelligence with AI...</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-t-4 border-t-emerald-500 flex flex-col" style={{ height: '400px' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-emerald-400" strokeWidth={1.75} />
                        <h3 className="text-base font-semibold text-slate-900">Top Rising Skills</h3>
                        {(city !== 'All Cities' || sector !== 'All Sectors') && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200 font-medium">Filtered</span>}
                    </div>
                    <div className="overflow-y-auto flex-1 pr-1 space-y-2">
                        {filteredRising.slice(0, risingVisible).map((skill, idx) => (
                            <div key={skill.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-xs text-slate-500 font-semibold w-5 shrink-0">{idx + 1}.</span>
                                    <span className="text-slate-800 font-medium text-sm truncate">{skill.name}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-md text-xs text-emerald-700 shrink-0 border border-emerald-500/20">
                                    <ArrowUpRight className="w-3 h-3" strokeWidth={2} />{skill.growth}
                                </div>
                            </div>
                        ))}
                    </div>
                    {risingVisible < filteredRising.length && (
                        <button type="button" onClick={() => setRisingVisible(v => Math.min(v + 4, filteredRising.length))} className="mt-3 w-full py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5">
                            <ChevronDown className="w-4 h-4" strokeWidth={2} /> More
                        </button>
                    )}
                </Card>

                <Card className="border-t-4 border-t-red-500 flex flex-col" style={{ height: '400px' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingDown className="w-5 h-5 text-red-400" strokeWidth={1.75} />
                        <h3 className="text-base font-semibold text-slate-900">Declining Skills</h3>
                    </div>
                    <div className="overflow-y-auto flex-1 pr-1 space-y-2">
                        {filteredDeclining.slice(0, decliningVisible).map((skill, idx) => (
                            <div key={skill.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-xs text-slate-500 font-semibold w-5 shrink-0">{idx + 1}.</span>
                                    <span className="text-slate-800 font-medium text-sm truncate">{skill.name}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-md text-xs text-red-700 shrink-0 border border-red-500/20">
                                    <ArrowDownRight className="w-3 h-3" strokeWidth={2} />{skill.decline}
                                </div>
                            </div>
                        ))}
                    </div>
                    {decliningVisible < filteredDeclining.length && (
                        <button type="button" onClick={() => setDecliningVisible(v => Math.min(v + 4, filteredDeclining.length))} className="mt-3 w-full py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5">
                            <ChevronDown className="w-4 h-4" strokeWidth={2} /> More
                        </button>
                    )}
                </Card>
            </div>

            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <h3 className="text-base font-semibold text-slate-900">Skill Evolution Timeline (Demand Score)</h3>
                    <div className="flex gap-2 z-10">
                        <Dropdown value={skillTime} onChange={setSkillTime} options={SKILL_TIME_OPTIONS} />
                        <div className="w-52">
                            <MultiDropdown options={allSkillKeys} selected={selectedSkills} onChange={setSelectedSkills} placeholder="Select Skills" />
                        </div>
                    </div>
                </div>
                <div className="h-80 w-full min-h-[320px] relative z-0">
                    <Line
                        data={{
                            labels: timeLabels,
                            datasets: selectedSkills.map(sk => ({
                                label: sk, data: demandTimeline.map(d => d[sk]),
                                borderColor: SKILL_COLORS[sk] || '#fff', tension: 0.4,
                                borderDash: sk === 'Java' ? [5, 5] : [],
                            }))
                        }}
                        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 }, x: { grid: { display: false } } } }}
                    />
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-0">
                <Card>
                    <div className="flex items-center gap-2 mb-6">
                        <Target className="w-5 h-5 text-purple-400" strokeWidth={1.75} />
                        <h3 className="text-base font-semibold text-slate-900">Skill Gap Map vs Training</h3>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg font-medium">Skill</th>
                                    <th className="px-4 py-3 font-medium">Industry Demand</th>
                                    <th className="px-4 py-3 font-medium">Training Avail.</th>
                                    <th className="px-4 py-3 rounded-tr-lg font-medium">Gap Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {skillGapData.map((gap, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900">{gap.skill}</td>
                                        <td className="px-4 py-3 text-slate-700">{gap.demand}</td>
                                        <td className="px-4 py-3 text-slate-600">{gap.available}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${gap.gapStatus === 'large' ? 'bg-red-500' : gap.gapStatus === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                                <span className="capitalize text-xs text-slate-600">{gap.gapStatus}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card className="flex flex-col" style={{ height: '420px' }}>
                    <div className="flex items-center gap-2 mb-6">
                        <BookOpen className="w-5 h-5 text-cyan-400" strokeWidth={1.75} />
                        <h3 className="text-base font-semibold text-slate-900">Skill Demand Score</h3>
                    </div>
                    <div className="overflow-y-auto flex-1 pr-1 space-y-5">
                        {skillScores.slice(0, demandVisible).map((skill, idx) => (
                            <div key={skill.id}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-slate-800 font-medium">{idx + 1}. {skill.name}</span>
                                    <span className="text-cyan-400 font-semibold">{skill.score}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div className="bg-cyan-500 h-2 rounded-full transition-all duration-300" style={{ width: `${skill.score}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    {demandVisible < skillScores.length && (
                        <button type="button" onClick={() => setDemandVisible(v => Math.min(v + 3, skillScores.length))} className="mt-3 w-full py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5">
                            <ChevronDown className="w-4 h-4" strokeWidth={2} /> More
                        </button>
                    )}
                </Card>
            </div>

            <Card>
                <h3 className="text-base font-semibold text-slate-900 mb-6">
                    Skill Clusters Analysis
                    {sector !== 'All Sectors' && <span className="ml-2 text-xs text-purple-600">({sector})</span>}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {skillClusters.map((cluster, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-xl hover:border-purple-500/30 transition-colors group">
                            <h4 className="text-purple-400 font-semibold mb-3 group-hover:text-purple-300 transition-colors">{cluster.category}</h4>
                            <div className="flex flex-wrap gap-2">
                                {cluster.skills.map((s, i) => (
                                    <span key={i} className="bg-white text-slate-700 text-xs px-2.5 py-1 rounded-md border border-slate-200">{s}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
