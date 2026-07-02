"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { FileText, Briefcase, MapPin, CheckCircle, Loader2 } from 'lucide-react';

export default function WorkerProfile() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        jobTitle: '',
        city: 'Bangalore',
        experience: '',
        about: '',
        resume: null
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');

    const cities = ['Bangalore', 'Pune', 'Hyderabad', 'Indore', 'Jaipur', 'Surat', 'Nagpur', 'Ahmedabad', 'Lucknow', 'Bhopal', 'Chennai', 'Mumbai', 'Delhi', 'Kolkata', 'Gurgaon', 'Noida', 'Kochi', 'Patna', 'Chandigarh', 'Trivandrum'];

    const completionFields = [formData.jobTitle, formData.city, formData.experience, formData.about];
    const filledFields = completionFields.filter(f => f && f.toString().trim() !== '').length;
    const completionPercentage = (filledFields / completionFields.length) * 100;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (completionPercentage < 100) return;

        setIsAnalyzing(true);
        setError('');

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobTitle: formData.jobTitle,
                    city: formData.city,
                    experience: formData.experience,
                    about: formData.about,
                }),
            });

            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else {
                // Store analysis results and profile for other pages
                localStorage.setItem('workerProfileData', JSON.stringify(formData));
                localStorage.setItem('skillAnalysisResult', JSON.stringify(data.analysis));
                router.push('/skill-analysis');
            }
        } catch {
            setError('Failed to analyze profile. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto pb-10">
            <header className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-600/10 border border-cyan-600/20 mb-5">
                    <FileText className="w-8 h-8 text-cyan-600" strokeWidth={1.75} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Worker Career Profile</h1>
                <p className="text-slate-500 mt-2 text-sm">Fill your profile to get AI-powered risk analysis and personalized insights.</p>
            </header>

            <Card>
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-slate-400">Profile Completion</span>
                        <span className="text-sm font-semibold text-cyan-400">{completionPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="job-title" className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                                Job Title
                            </label>
                            <input
                                id="job-title"
                                type="text"
                                required
                                value={formData.jobTitle}
                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                placeholder="e.g. Frontend Developer"
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                                City
                            </label>
                            <select
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all cursor-pointer shadow-sm"
                            >
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-slate-400 mb-1.5">Years of Experience</label>
                        <input
                            id="experience"
                            type="number"
                            required
                            min="0"
                            step="0.5"
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            placeholder="e.g. 3.5"
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all shadow-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="about" className="block text-sm font-medium text-slate-400 mb-1.5">Career Write-Up (Summary)</label>
                        <textarea
                            id="about"
                            required
                            value={formData.about}
                            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                            placeholder="Briefly describe your current role, responsibilities, and career goals..."
                            rows={4}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-cyan-600/60 focus:ring-2 focus:ring-cyan-600/15 transition-all resize-none shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Resume Upload (Optional)</label>
                        <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:border-cyan-600/40 transition-colors cursor-pointer bg-slate-50">
                            <div className="space-y-1 text-center">
                                <FileText className="mx-auto h-10 w-10 text-slate-500" strokeWidth={1.5} />
                                <div className="flex text-sm text-slate-400 justify-center flex-wrap gap-1">
                                    <span className="font-medium text-cyan-700 hover:text-cyan-800">Upload a file</span>
                                    <span>or drag and drop</span>
                                </div>
                                <input type="file" className="sr-only" onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })} />
                                <p className="text-xs text-slate-500">PDF, DOC up to 5MB</p>
                                {formData.resume && (
                                    <p className="text-xs text-emerald-700 font-medium flex items-center justify-center gap-1 mt-2">
                                        <CheckCircle className="w-3 h-3" strokeWidth={2} /> {formData.resume.name} selected
                                    </p>
                                )}
                            </div>
                        </label>
                    </div>

                    <div className="pt-5 border-t border-slate-200">
                        <button
                            type="submit"
                            disabled={completionPercentage < 100 || isAnalyzing}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg shadow-md transition-all active:scale-[0.99] flex justify-center items-center gap-2"
                        >
                            {isAnalyzing ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI...</>
                            ) : (
                                'Analyze My Skills Profile'
                            )}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
