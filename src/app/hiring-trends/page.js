"use client";

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Line, Bar, Pie } from '@/components/ui/Charts';
import { Dropdown } from '@/components/ui/Dropdown';
import { MultiDropdown } from '@/components/ui/MultiDropdown';
import dynamic from 'next/dynamic';
import { Briefcase, TrendingUp, MapPin, Sparkles, ChevronDown, RefreshCw, Loader2 } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';

const DynamicMap = dynamic(() => import('@/components/ui/MapLeaflet'), {
    ssr: false,
    loading: () => <div className="w-full h-full min-h-[300px] bg-slate-100 animate-pulse rounded-xl" />,
});

const COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b', '#22c55e', '#f97316', '#14b8a6'];

// ── Per-city job and sector breakdowns (used for region filtering) ──
const cityJobData = {
    'Bangalore': { total: 9400, growth: '+18%', sectors: { IT: 48, BPO: 15, Finance: 14, Healthcare: 12, Retail: 11 } },
    'Pune': { total: 5800, growth: '+14%', sectors: { IT: 42, BPO: 22, Finance: 16, Healthcare: 10, Retail: 10 } },
    'Hyderabad': { total: 5200, growth: '+16%', sectors: { IT: 45, BPO: 18, Finance: 13, Healthcare: 14, Retail: 10 } },
    'Chennai': { total: 3900, growth: '+10%', sectors: { IT: 38, BPO: 20, Finance: 15, Healthcare: 18, Retail: 9 } },
    'Mumbai': { total: 4500, growth: '+12%', sectors: { IT: 30, BPO: 14, Finance: 28, Healthcare: 16, Retail: 12 } },
    'Delhi NCR': { total: 4900, growth: '+13%', sectors: { IT: 35, BPO: 16, Finance: 22, Healthcare: 14, Retail: 13 } },
    'Indore': { total: 2100, growth: '+22%', sectors: { IT: 40, BPO: 25, Finance: 12, Healthcare: 10, Retail: 13 } },
    'Noida': { total: 3200, growth: '+15%', sectors: { IT: 50, BPO: 18, Finance: 14, Healthcare: 8, Retail: 10 } },
};

// ── Category-based bar chart subcategories ──
const categoryBarData = {
    'All Categories': {
        'IT Jobs': { 'Software Dev': 14200, 'DevOps': 3100, 'Cloud Eng.': 2900, 'Full Stack': 4500 },
        'BPO Jobs': { 'Customer Support': 9500, 'Chat Agent': 3200, 'Voice Support': 4800 },
        'AI Jobs': { 'Data Science': 4200, 'ML Engineer': 3400, 'AI Researcher': 1800 },
        'Finance Jobs': { 'Accountant': 3600, 'Fin. Analyst': 2800, 'Risk Manager': 1900 },
        'Healthcare Jobs': { 'Medical Coder': 2400, 'Lab Tech': 1800, 'Pharma Rep': 1500 },
    },
    'Engineering': {
        'IT Jobs': { 'Software Dev': 14200, 'DevOps': 3100, 'Cloud Eng.': 2900 },
        'AI Jobs': { 'ML Engineer': 3400, 'AI Researcher': 1800 },
    },
    'Data Science': {
        'AI Jobs': { 'Data Scientist': 4200, 'ML Engineer': 3400, 'Data Analyst': 2600 },
        'IT Jobs': { 'Data Engineer': 2800, 'BI Analyst': 1900 },
    },
    'Design': {
        'IT Jobs': { 'UI/UX Designer': 2200, 'Product Designer': 1800 },
    },
    'Marketing': {
        'Finance Jobs': { 'Marketing Analyst': 1800, 'SEO Specialist': 1400 },
    },
    'Sales': {
        'BPO Jobs': { 'Telemarketing': 2800, 'Sales Rep': 3200, 'Account Mgr': 1600 },
    },
};

// ── Sector-based pie data filtered by sector dropdown ──
const sectorFilteredData = {
    'All Sectors': [
        { name: 'IT', value: 42 }, { name: 'BPO', value: 18 }, { name: 'Finance', value: 16 },
        { name: 'Healthcare', value: 13 }, { name: 'Retail', value: 11 },
    ],
    'IT & Software': [
        { name: 'Software Dev', value: 45 }, { name: 'Cloud/DevOps', value: 25 },
        { name: 'AI/ML', value: 18 }, { name: 'Cybersecurity', value: 12 },
    ],
    'BPO': [
        { name: 'Customer Support', value: 40 }, { name: 'Chat/Email', value: 25 },
        { name: 'Voice Support', value: 20 }, { name: 'Back Office', value: 15 },
    ],
    'Healthcare': [
        { name: 'Medical Coding', value: 35 }, { name: 'Lab Tech', value: 25 },
        { name: 'Pharma', value: 22 }, { name: 'Clinical Research', value: 18 },
    ],
    'Finance': [
        { name: 'Accounting', value: 30 }, { name: 'Banking', value: 28 },
        { name: 'Insurance', value: 22 }, { name: 'Fintech', value: 20 },
    ],
    'Manufacturing': [
        { name: 'Automation', value: 35 }, { name: 'Quality Control', value: 25 },
        { name: 'Supply Chain', value: 22 }, { name: 'Industrial IoT', value: 18 },
    ],
};

// ── Line chart: base trends vary by time range ──
const lineCategories = ['IT Jobs', 'BPO Jobs', 'AI Jobs', 'Finance Jobs', 'Healthcare Jobs'];
const lineColors = { 'IT Jobs': '#06b6d4', 'BPO Jobs': '#ef4444', 'AI Jobs': '#8b5cf6', 'Finance Jobs': '#f59e0b', 'Healthcare Jobs': '#22c55e' };

function buildLineData(days, region) {
    // Scale factor per region (some regions are bigger markets)
    const scale = region === 'All Regions' ? 1 : (cityJobData[region]?.total || 3000) / 9400;
    const bases = {
        'IT Jobs': [9200, 9500, 10200, 11500].map(v => Math.round(v * scale)),
        'BPO Jobs': [4000, 3800, 3400, 2800].map(v => Math.round(v * scale)),
        'AI Jobs': [1200, 1300, 1450, 1740].map(v => Math.round(v * scale)),
        'Finance Jobs': [2100, 2200, 2350, 2500].map(v => Math.round(v * scale)),
        'Healthcare Jobs': [1800, 1900, 1850, 2000].map(v => Math.round(v * scale)),
    };
    const labels = Array.from({ length: days }, (_, i) => i === days - 1 ? 'Today' : `${days - 1 - i}d ago`);
    const datasets = Object.fromEntries(
        Object.entries(bases).map(([cat, arr]) => {
            const lastVal = arr[arr.length - 1];
            const firstVal = arr[0];
            const data = Array.from({ length: days }, (_, i) =>
                Math.round(firstVal + ((lastVal - firstVal) * i) / Math.max(days - 1, 1) + (i % 3) * 30 * scale)
            );
            return [cat, data];
        })
    );
    return { labels, datasets };
}

const cityInsightsData = {
    'Bangalore': 'Bangalore leads with 9,400+ active IT job listings. Strong demand in AI/ML and cloud architecture. The city shows 18% YoY growth driven by AI adoption.',
    'Pune': 'Pune ranks #2 with 5,800 listings. Growing fintech and SaaS sectors drive demand. Data engineering roles are spiking +28%.',
    'Hyderabad': 'Hyderabad holds #3 with 5,200 listings. Pharmaceutical IT and cloud corridors fuel hiring. AI/ML roles up +35%.',
    'Delhi NCR': 'Delhi NCR at #4 with 4,900 listings. Diverse demand across finance, e-commerce, and enterprise IT.',
    'Mumbai': 'Mumbai at #5 with 4,500 listings. Financial services and media tech dominate. Fintech hiring up 30%.',
    'Chennai': 'Chennai at #6 with 3,900 listings. Automotive tech and semiconductor design roles growing rapidly.',
    'Indore': 'Indore at #7 with 2,100 listings. Fastest growing Tier-2 IT hub with 45% YoY growth.',
};

const heatmapCitiesAll = [
    { city: 'Bangalore', coordinates: [12.9716, 77.5946], demand: 'High', color: '#7f1d1d', tooltipText: 'High Demand' },
    { city: 'Pune', coordinates: [18.5204, 73.8567], demand: 'High', color: '#7f1d1d', tooltipText: 'High Demand' },
    { city: 'Hyderabad', coordinates: [17.3850, 78.4867], demand: 'High', color: '#7f1d1d', tooltipText: 'High Demand' },
    { city: 'Chennai', coordinates: [13.0827, 80.2707], demand: 'High', color: '#7f1d1d', tooltipText: 'High Demand' },
    { city: 'Mumbai', coordinates: [19.0760, 72.8777], demand: 'High', color: '#7f1d1d', tooltipText: 'High Demand' },
    { city: 'Indore', coordinates: [22.7196, 75.8577], demand: 'Medium', color: '#d97706', tooltipText: 'Medium Demand' },
    { city: 'Jaipur', coordinates: [26.9124, 75.7873], demand: 'Medium', color: '#d97706', tooltipText: 'Medium Demand' },
    { city: 'Surat', coordinates: [21.1702, 72.8311], demand: 'Low', color: '#eab308', tooltipText: 'Low Demand' },
    { city: 'Lucknow', coordinates: [26.8467, 80.9462], demand: 'Low', color: '#eab308', tooltipText: 'Low Demand' },
    { city: 'Noida', coordinates: [28.5355, 77.3910], demand: 'High', color: '#7f1d1d', tooltipText: 'High Demand' },
];

const LINE_TIME_OPTIONS = ['Last 7 days', 'Last 15 days', 'Last 30 days'];

export default function HiringTrends() {
    const { data: marketData, loading: marketLoading, refresh, lastUpdated } = useMarketData();
    const [region, setRegion] = useState('All Regions');
    const [category, setCategory] = useState('All Categories');
    const [sector, setSector] = useState('All Sectors');
    const [lineTime, setLineTime] = useState('Last 7 days');
    const [selectedLineCategories, setSelectedLineCategories] = useState(['IT Jobs', 'BPO Jobs', 'AI Jobs']);
    const [topCityDropdown, setTopCityDropdown] = useState('Bangalore');
    const [showCityMenu, setShowCityMenu] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const hiring = marketData?.hiringData || {};
    const cityInsights = hiring.cityInsights || cityInsightsData;

    // ── Stats react to REGION filter ──
    const stats = useMemo(() => {
        if (region === 'All Regions') {
            return { totalListings: hiring.totalListings || '45,200', growthRate: hiring.growthRate || '+16%', topCity: hiring.topCity || 'Bangalore' };
        }
        const city = cityJobData[region];
        if (city) {
            return { totalListings: city.total.toLocaleString(), growthRate: city.growth, topCity: region };
        }
        return { totalListings: '—', growthRate: '—', topCity: region };
    }, [region, hiring]);

    // ── Line chart reacts to TIME + REGION ──
    const lineDays = lineTime === 'Last 7 days' ? 7 : lineTime === 'Last 15 days' ? 15 : 30;
    const lineData = useMemo(() => buildLineData(lineDays, region), [lineDays, region]);

    // ── Bar chart reacts to CATEGORY + selected line categories ──
    const barEntries = useMemo(() => {
        const catMap = categoryBarData[category] || categoryBarData['All Categories'];
        const entries = [];
        const availableCats = Object.keys(catMap);
        const activeCats = selectedLineCategories.filter(c => availableCats.includes(c));
        (activeCats.length > 0 ? activeCats : availableCats).forEach(cat => {
            const sub = catMap[cat];
            if (sub) Object.entries(sub).forEach(([name, jobs]) => entries.push({ name, jobs }));
        });
        return entries.length > 0 ? entries : [{ name: 'No data for this filter', jobs: 0 }];
    }, [category, selectedLineCategories]);

    // ── Pie chart reacts to SECTOR filter ──
    const pieData = useMemo(() => {
        if (sector !== 'All Sectors') {
            return sectorFilteredData[sector] || sectorFilteredData['All Sectors'];
        }
        if (region !== 'All Regions' && cityJobData[region]) {
            const sectors = cityJobData[region].sectors;
            return Object.entries(sectors).map(([name, value]) => ({ name, value }));
        }
        return sectorFilteredData['All Sectors'];
    }, [sector, region]);

    // ── Map reacts to REGION ──
    const heatmapCities = useMemo(() => {
        if (region === 'All Regions') return heatmapCitiesAll;
        return heatmapCitiesAll.filter(c =>
            c.city.toLowerCase().includes(region.toLowerCase()) ||
            (region === 'Delhi NCR' && c.city === 'Noida')
        );
    }, [region]);

    // ── City insights react to REGION ──
    const topCitiesRank = Object.keys(cityInsights);
    const activeInsight = useMemo(() => {
        if (region !== 'All Regions') return cityInsights[region] || `Showing data for ${region}.`;
        return cityInsights[topCityDropdown] || 'Select a city to view AI-generated insights.';
    }, [region, topCityDropdown, cityInsights]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setIsRefreshing(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Hiring Trends Analysis</h1>
                    <p className="text-slate-500 text-sm">
                        {marketData ? '🟢 Live AI-generated market intelligence' : 'Visualize job market demand and volume metrics.'}
                        {lastUpdated && <span className="ml-2 text-xs text-slate-400">Updated: {lastUpdated.toLocaleString()}</span>}
                    </p>
                </div>
                <div className="flex flex-wrap justify-end gap-3 ml-auto">
                    <button onClick={handleRefresh} disabled={isRefreshing}
                        className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-cyan-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50">
                        {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                    <Dropdown value={region} onChange={setRegion} options={['All Regions', 'Bangalore', 'Pune', 'Indore', 'Hyderabad', 'Chennai', 'Mumbai', 'Delhi NCR']} />
                    <Dropdown value={category} onChange={setCategory} options={['All Categories', 'Engineering', 'Data Science', 'Design', 'Marketing', 'Sales']} />
                    <Dropdown value={sector} onChange={setSector} options={['All Sectors', 'IT & Software', 'BPO', 'Healthcare', 'Finance', 'Manufacturing']} />
                </div>
            </header>

            {marketLoading && (
                <div className="flex items-center gap-3 bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                    <Loader2 className="w-5 h-5 text-cyan-600 animate-spin" />
                    <span className="text-sm text-cyan-800 font-medium">Generating live market intelligence with AI...</span>
                </div>
            )}

            {/* Top Stats — react to region */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-600/10 rounded-xl border border-cyan-600/20 shrink-0"><Briefcase className="w-5 h-5 text-cyan-600" strokeWidth={1.75} /></div>
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {region === 'All Regions' ? 'Total Job Listings' : `Jobs in ${region}`}
                        </p>
                        <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stats.totalListings}</h3>
                    </div>
                </Card>
                <Card className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shrink-0"><TrendingUp className="w-5 h-5 text-emerald-400" strokeWidth={1.75} /></div>
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Growth Rate</p>
                        <h3 className="text-xl font-bold text-emerald-400 mt-0.5">{stats.growthRate}</h3>
                    </div>
                </Card>
                <Card className="flex flex-col gap-2 justify-center relative">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 shrink-0"><MapPin className="w-5 h-5 text-purple-400" strokeWidth={1.75} /></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Top Hiring City</p>
                            <h3 className="text-xl font-bold text-purple-400 mt-0.5">{stats.topCity}</h3>
                        </div>
                        {region === 'All Regions' && (
                            <button type="button" onClick={() => setShowCityMenu(!showCityMenu)} className="shrink-0 bg-white hover:bg-slate-50 border border-slate-200 text-cyan-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                                More <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCityMenu ? 'rotate-180' : ''}`} strokeWidth={2} />
                            </button>
                        )}
                    </div>
                    {showCityMenu && region === 'All Regions' && (
                        <div className="mt-2 bg-white border border-slate-200 rounded-lg max-h-48 overflow-y-auto py-1 shadow-lg">
                            {topCitiesRank.map(c => (
                                <button type="button" key={c} onClick={() => { setTopCityDropdown(c); setShowCityMenu(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm rounded-md mx-1 transition-colors ${topCityDropdown === c ? 'bg-purple-500/10 text-purple-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* AI Insight — react to region and city dropdown */}
            <Card className="min-h-[140px]">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-400" strokeWidth={1.75} />
                    <h3 className="text-base font-semibold text-slate-900">AI Market Insight</h3>
                    {region !== 'All Regions' && (
                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200 font-medium">
                            Filtered: {region}
                        </span>
                    )}
                    {marketData && <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">Live</span>}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{activeInsight}</p>
            </Card>

            {/* Line + Bar Charts — line reacts to time+region, bar reacts to category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Job Volume Over Time</h3>
                            {region !== 'All Regions' && <p className="text-xs text-purple-600 mt-0.5">Scaled for {region}</p>}
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-2 z-10 ml-auto">
                            <Dropdown value={lineTime} onChange={setLineTime} options={LINE_TIME_OPTIONS} />
                            <div className="w-48 min-w-[12rem]">
                                <MultiDropdown options={lineCategories} selected={selectedLineCategories} onChange={setSelectedLineCategories} placeholder="Select Categories" />
                            </div>
                        </div>
                    </div>
                    <div className="h-72 w-full relative z-0">
                        <Line
                            data={{
                                labels: lineData.labels,
                                datasets: selectedLineCategories.map(cat => ({
                                    label: cat,
                                    data: lineData.datasets[cat] || [],
                                    borderColor: lineColors[cat] || '#fff',
                                    tension: 0.4,
                                }))
                            }}
                            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false }, x: { grid: { display: false } } } }}
                        />
                    </div>
                </Card>

                <Card className="flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-base font-semibold text-slate-900 mb-1">Hiring by Category</h3>
                        <p className="text-xs text-slate-500">
                            {category !== 'All Categories' ? `Filtered: ${category}` : 'Change "Category" filter above to drill down.'}
                        </p>
                    </div>
                    <div className="h-72 w-full relative z-0">
                        <Bar
                            data={{ labels: barEntries.map(d => d.name), datasets: [{ label: 'Jobs', data: barEntries.map(d => d.jobs), backgroundColor: '#8b5cf6', borderRadius: 4 }] }}
                            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true }, x: { grid: { display: false } } } }}
                        />
                    </div>
                </Card>
            </div>

            {/* Map + Pie — map reacts to region, pie reacts to sector+region */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="flex flex-col">
                    <h3 className="text-base font-semibold text-slate-900 mb-1">City Opportunity Index</h3>
                    <p className="text-xs text-slate-500 mb-6">
                        {region !== 'All Regions' ? `Zoomed into ${region}` : 'Use Region filter to zoom into a specific city.'}
                    </p>
                    <div className="flex-1 w-full min-h-[300px] h-[400px] mb-2 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 relative z-0">
                        <DynamicMap key={`hiring-map-${region}`} cityData={heatmapCities} />
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-500/80 border border-amber-600/50" /> Low</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-500/80 border border-orange-600/50" /> Medium</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-800/80 border border-red-900/50" /> High</span>
                    </div>
                </Card>

                <Card>
                    <div className="mb-6">
                        <h3 className="text-base font-semibold text-slate-900 mb-1">Sector Distribution</h3>
                        <p className="text-xs text-slate-500">
                            {sector !== 'All Sectors'
                                ? `Showing ${sector} sub-distribution`
                                : region !== 'All Regions'
                                    ? `Sector breakdown for ${region}`
                                    : 'Change Sector or Region filters to explore.'}
                        </p>
                    </div>
                    <div className="h-72 flex items-center justify-center pb-4 relative z-0">
                        <Pie
                            data={{ labels: pieData.map(d => d.name), datasets: [{ data: pieData.map(d => d.value), backgroundColor: COLORS.slice(0, pieData.length), borderWidth: 0, hoverOffset: 4 }] }}
                            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { usePointStyle: true, padding: 20 } } } }}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
