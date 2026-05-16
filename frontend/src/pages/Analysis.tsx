import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

const runAnalysis = async (jobId: string) => {
    const res = await api.post(`/analysis/run/${jobId}`);
    return res.data.data;
};

const fetchQuestions = async (jobId: string) => {
    const res = await api.get(`/jobs/${jobId}/interview-questions`);
    return res.data.data;
};

const fetchSuggestions = async (jobId: string) => {
    const res = await api.get(`/analysis/suggestions/${jobId}`);
    return res.data.data;
};

const getScoreColor = (score: number) => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
};

const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Strong Match';
    if (score >= 40) return 'Moderate Match';
    return 'Needs Work';
};

const getPriorityStyles = (priority: string) => {
    switch (priority) {
        case 'high': return {
            border: 'border-error',
            badge: 'bg-error-container text-on-error-container',
            label: 'High Priority',
        };
        case 'medium': return {
            border: 'border-tertiary',
            badge: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
            label: 'Medium Priority',
        };
        default: return {
            border: 'border-outline-variant',
            badge: 'bg-surface-container text-on-surface-variant',
            label: 'Low Priority',
        };
    }
};

export default function Analysis() {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const { data: analysis, isLoading: analysisLoading } = useQuery({
        queryKey: ['analysis', jobId],
        queryFn: () => runAnalysis(jobId!),
        enabled: !!jobId,
    });

    const { data: questionsData, isLoading: questionsLoading } = useQuery({
        queryKey: ['questions', jobId],
        queryFn: () => fetchQuestions(jobId!),
        enabled: !!jobId,
    });

    const { data: suggestionsData, isLoading: suggestionsLoading } = useQuery({
        queryKey: ['suggestions', jobId],
        queryFn: () => fetchSuggestions(jobId!),
        enabled: !!jobId,
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
        { label: 'Resume', icon: 'description', href: '/resume' },
        { label: 'Jobs', icon: 'work', href: '/jobs' },
    ];

    const score = analysis?.matchScore ?? 0;
    const circumference = 2 * Math.PI * 42;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-surface-container-low font-body text-on-surface antialiased min-h-screen">

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full hidden md:flex flex-col z-40 bg-[#191c1d] w-64 justify-between">
                <div>
                    <div className="px-6 py-8">
                        <span className="text-xl font-bold text-white tracking-tight font-headline">
                            Job Prep AI
                        </span>
                    </div>
                    <div className="flex items-center gap-3 px-6 pb-6 mb-4 border-b border-white/10">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <p className="text-white font-medium text-sm">{user?.name || 'User'}</p>
                            <p className="text-gray-400 text-xs">Job Seeker</p>
                        </div>
                    </div>
                    <nav className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.href) && item.href !== '/dashboard';
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`flex items-center py-3 transition-all duration-200 ${isActive
                                            ? 'text-white border-l-4 border-primary bg-white/5 pl-4'
                                            : 'text-slate-400 pl-5 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className="material-symbols-outlined mr-4">{item.icon}</span>
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="px-3 pb-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-slate-400 pl-5 py-3 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <span className="material-symbols-outlined mr-4">logout</span>
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Top Bar */}
            <header className="md:ml-64 bg-white shadow-sm w-full top-0 sticky z-40">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/jobs')}
                            className="material-symbols-outlined text-gray-500 hover:bg-gray-50 transition-colors p-2 rounded-full"
                        >
                            arrow_back
                        </button>
                        <h1 className="text-lg font-bold text-primary font-headline">
                            Skill Gap Analysis
                        </h1>
                    </div>
                    {(analysisLoading || questionsLoading || suggestionsLoading) && (
                        <div className="flex items-center gap-2 bg-primary-fixed px-3 py-1.5 rounded-full">
                            <span className="material-symbols-outlined text-primary text-sm animate-spin">sync</span>
                            <span className="text-on-primary-fixed text-xs font-bold">Loading...</span>
                        </div>
                    )}
                </div>
            </header>

            <main className="md:ml-64 max-w-7xl mx-auto px-6 py-8 mb-24">

                {/* Hero Grid — Score + Skills Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

                    {/* Match Score */}
                    <section className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-8 flex flex-col items-center justify-center text-center">
                        <h2 className="font-headline text-on-surface-variant font-bold text-sm tracking-widest uppercase mb-6">
                            Match Score
                        </h2>

                        {analysisLoading ? (
                            <div className="w-48 h-48 rounded-full skeleton mb-6" />
                        ) : (
                            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                                <svg
                                    className="w-full h-full"
                                    style={{ transform: 'rotate(-90deg)' }}
                                    viewBox="0 0 100 100"
                                >
                                    <circle
                                        cx="50" cy="50" r="42"
                                        fill="transparent"
                                        stroke="#e7e8e9"
                                        strokeWidth="8"
                                    />
                                    <circle
                                        cx="50" cy="50" r="42"
                                        fill="transparent"
                                        stroke={getScoreColor(score)}
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="font-headline text-5xl font-extrabold text-on-surface">
                                        {score}%
                                    </span>
                                    <span
                                        className="font-bold text-xs"
                                        style={{ color: getScoreColor(score) }}
                                    >
                                        {getScoreLabel(score)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {suggestionsData && (
                            <p className="text-on-surface-variant text-sm leading-relaxed max-w-[240px]">
                                {suggestionsData.summary}
                            </p>
                        )}
                    </section>

                    {/* Skills Breakdown */}
                    <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8">
                        <h2 className="font-headline text-xl font-bold mb-8">Skills Breakdown</h2>

                        {analysisLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 w-1/2 skeleton rounded mb-4" />
                                        {[...Array(3)].map((_, j) => (
                                            <div key={j} className="h-7 w-20 skeleton rounded-lg" />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Matched */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                                        <h3 className="font-bold text-sm text-emerald-900">
                                            Matched ({analysis?.matchedSkills?.length || 0})
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis?.matchedSkills?.map((skill: string) => (
                                            <span key={skill} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100">
                                                {skill}
                                            </span>
                                        ))}
                                        {(!analysis?.matchedSkills?.length) && (
                                            <span className="text-xs text-on-surface-variant">None matched</span>
                                        )}
                                    </div>
                                </div>

                                {/* Missing */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="material-symbols-outlined text-error text-lg">cancel</span>
                                        <h3 className="font-bold text-sm text-error">
                                            Missing ({analysis?.missingSkills?.length || 0})
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis?.missingSkills?.map((skill: string) => (
                                            <span key={skill} className="px-3 py-1 bg-error-container/30 text-error rounded-lg text-xs font-semibold border border-error/10">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Extra */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="material-symbols-outlined text-gray-500 text-lg">add_circle</span>
                                        <h3 className="font-bold text-sm text-gray-700">
                                            Extra ({analysis?.extraSkills?.length || 0})
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis?.extraSkills?.slice(0, 8).map((skill: string) => (
                                            <span key={skill} className="px-3 py-1 bg-surface-container text-gray-600 rounded-lg text-xs font-semibold">
                                                {skill}
                                            </span>
                                        ))}
                                        {(analysis?.extraSkills?.length || 0) > 8 && (
                                            <span className="px-3 py-1 bg-surface-container text-outline rounded-lg text-xs">
                                                +{analysis.extraSkills.length - 8} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* Interview Questions + Suggestions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Interview Questions */}
                    <section className="lg:col-span-7">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-headline text-2xl font-extrabold tracking-tight">
                                Interview Prep Questions
                            </h2>
                            {questionsData && (
                                <span className="text-on-surface-variant text-sm font-medium">
                                    {questionsData.count} questions
                                </span>
                            )}
                        </div>

                        {questionsLoading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="bg-surface-container-lowest p-6 rounded-xl">
                                        <div className="flex gap-5">
                                            <div className="w-8 h-8 skeleton rounded-lg flex-none" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 w-3/4 skeleton rounded" />
                                                <div className="h-3 w-1/2 skeleton rounded" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {questionsData?.questions?.map((question: string, index: number) => (
                                    <div
                                        key={index}
                                        className="bg-surface-container-lowest p-6 rounded-xl group hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex gap-5">
                                            <span className="flex-none w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center font-bold text-primary text-sm">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <p className="font-semibold text-on-surface group-hover:text-primary transition-colors leading-relaxed">
                                                {question}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Improvement Suggestions */}
                    <aside className="lg:col-span-5 space-y-6">
                        <h2 className="font-headline text-2xl font-extrabold tracking-tight">
                            Learning Path
                        </h2>

                        {suggestionsLoading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-surface-container-lowest p-6 rounded-xl space-y-4">
                                        <div className="h-5 w-1/3 skeleton rounded" />
                                        <div className="h-16 skeleton rounded" />
                                        <div className="h-4 w-1/4 skeleton rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {suggestionsData?.suggestions?.map((s: { skill: string; priority: string; reason: string; resources: string[] }, i: number) => {
                                    const styles = getPriorityStyles(s.priority);
                                    return (
                                        <div
                                            key={i}
                                            className={`bg-surface-container-lowest p-6 rounded-xl border-l-4 ${styles.border} shadow-sm`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-headline font-bold text-lg">{s.skill}</h3>
                                                    <p className="text-xs text-on-surface-variant font-medium mt-1">
                                                        {s.reason}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ml-2 flex-none ${styles.badge}`}>
                                                    {styles.label}
                                                </span>
                                            </div>

                                            {s.resources?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {s.resources.slice(0, 2).map((resource: string, ri: number) => (
                                                        <a
                                                            key={ri}
                                                            href={`https://${resource}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-primary text-xs font-bold hover:underline"
                                                        >
                                                            {ri === 0 ? 'Start Learning' : 'More Resources'}
                                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                    </div>
                        );
                })}

                        {suggestionsData?.suggestions?.length === 0 && (
                            <div className="text-center py-8 bg-surface-container-lowest rounded-xl">
                                <span className="material-symbols-outlined text-4xl text-emerald-500 block mb-2">
                                    celebration
                                </span>
                                <p className="font-bold text-on-surface">No missing skills!</p>
                                <p className="text-sm text-on-surface-variant">
                                    You match all requirements for this job.
                                </p>
                            </div>
                        )}
                </div>
            )}
            </aside>
        </div>
      </main >

        {/* Mobile Bottom Nav */ }
        < nav className = "fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-6 bg-white/80 backdrop-blur-xl shadow-sm z-50 rounded-t-xl md:hidden" >
        {
            navItems.map((item) => (
                <Link
                    key={item.href}
                    to={item.href}
                    className="flex flex-col items-center justify-center text-gray-400 hover:text-primary transition-all"
                >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span className="text-[11px] font-semibold">{item.label}</span>
                </Link>
            ))
        }
      </nav >
    </div >
  );
}