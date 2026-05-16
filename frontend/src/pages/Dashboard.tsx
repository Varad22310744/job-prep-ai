import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

const fetchDashboard = async () => {
  const res = await api.get('/dashboard');
  return res.data.data;
};

const getScoreColor = (score: number) => {
  if (score >= 70) return 'text-green-500';
  if (score >= 40) return 'text-yellow-500';
  return 'text-red-500';
};

const getScoreBg = (score: number) => {
  if (score >= 70) return 'bg-green-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
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

  return (
    <div className="bg-surface-container-low font-body text-on-surface">
      {/* Mobile TopAppBar */}
      <header className="md:hidden flex items-center px-4 h-16 w-full z-50 fixed top-0 bg-white/80 backdrop-blur-xl shadow-sm">
        <h1 className="ml-4 font-headline font-extrabold text-xl text-primary">Job Prep AI</h1>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col h-screen p-6 z-40 fixed left-0 top-0 w-64 bg-[#191c1d] shadow-2xl justify-between">
          <div>
            <div className="mb-12">
              <span className="text-2xl font-bold font-headline text-white">Job Prep AI</span>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center p-3 transition-colors duration-200 group ${
                      isActive
                        ? 'text-white border-l-4 border-primary bg-white/5'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className={`material-symbols-outlined mr-3 ${isActive ? 'active-icon' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Profile + Logout */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-white font-bold text-sm">{user?.name || 'User'}</p>
                <p className="text-gray-500 text-xs">{user?.email || ''}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-gray-400 hover:text-white p-3 hover:bg-white/10 transition-colors duration-200"
            >
              <span className="material-symbols-outlined mr-3">logout</span>
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6 md:p-10 pt-24 md:pt-10 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="mb-10">
            <h2 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}.
            </h2>
            <p className="text-on-surface-variant font-medium">
              Here's your job preparation summary.
            </p>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="md:col-span-3 h-32 bg-surface-container-highest rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6">
              Failed to load dashboard data. Please refresh.
            </div>
          )}

          {data && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* Stats Row */}
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-primary">
                  <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">
                    Total Skills
                  </p>
                  <h3 className="font-headline text-3xl font-bold text-on-surface">
                    {data.user.totalSkills}
                  </h3>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-secondary">
                  <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">
                    Jobs Added
                  </p>
                  <h3 className="font-headline text-3xl font-bold text-on-surface">
                    {data.jobs.total}
                  </h3>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-tertiary">
                  <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">
                    Jobs Analyzed
                  </p>
                  <h3 className="font-headline text-3xl font-bold text-on-surface">
                    {data.jobs.analyzed}
                  </h3>
                </div>
              </div>

              {/* Avg Match Score Card */}
              <div className="md:col-span-4 bg-[#191c1d] text-white p-6 rounded-xl shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="font-headline text-xl font-bold mb-4">Avg Match Score</h3>
                  <div className="flex items-end justify-between mb-2">
                    <span className={`text-4xl font-extrabold font-headline ${getScoreColor(data.analyses.averageMatchScore)}`}>
                      {data.analyses.averageMatchScore}%
                    </span>
                    <span className="text-gray-400 text-sm">
                      {data.analyses.averageMatchScore >= 70 ? 'Strong' : data.analyses.averageMatchScore >= 40 ? 'Moderate' : 'Needs Work'}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${getScoreBg(data.analyses.averageMatchScore)}`}
                      style={{ width: `${data.analyses.averageMatchScore}%` }}
                    />
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-colors" />
              </div>

              {/* Recent Analyses */}
              <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-headline text-2xl font-bold text-on-surface">Recent Analyses</h3>
                  <Link to="/jobs" className="text-primary font-bold text-sm hover:underline">
                    View All Jobs
                  </Link>
                </div>

                {data.analyses.recentAnalyses.length === 0 ? (
                  <div className="text-center py-10">
                    <span className="material-symbols-outlined text-5xl text-outline mb-3 block">work_off</span>
                    <p className="text-on-surface-variant">No analyses yet.</p>
                    <Link to="/jobs" className="text-primary font-bold text-sm hover:underline mt-2 inline-block">
                      Add a job to get started
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.analyses.recentAnalyses.map((item: any) => (
                      <Link
                        key={item.jobId}
                        to={`/analysis/${item.jobId}`}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-surface-bright transition-all border border-transparent hover:border-outline-variant/10 cursor-pointer group"
                      >
                        <div>
                          <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">
                            {item.jobTitle}
                          </h4>
                          <p className="text-on-surface-variant text-sm">{item.company}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${getScoreColor(item.matchScore)}`}>
                            {item.matchScore}%
                          </p>
                          <p className="text-on-surface-variant text-xs">
                            {item.matchedSkills} matched · {item.missingSkills} missing
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Missing Skills */}
              <div className="md:col-span-4 space-y-6">
                <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant/10">
                  <h3 className="font-headline text-lg font-bold mb-4 flex items-center">
                    <span className="material-symbols-outlined mr-2 text-primary">trending_up</span>
                    Top Missing Skills
                  </h3>

                  {data.topMissingSkills.length === 0 ? (
                    <p className="text-on-surface-variant text-sm">No data yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {data.topMissingSkills.map((item: any) => (
                        <div key={item.skill}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-on-surface">{item.skill}</span>
                            <span className="text-on-surface-variant">{item.count}x</span>
                          </div>
                          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full"
                              style={{
                                width: `${Math.min(100, (item.count / data.topMissingSkills[0].count) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Best Match Card */}
                {data.analyses.bestMatch && (
                  <div className="bg-primary p-6 rounded-xl text-white relative overflow-hidden group shadow-lg">
                    <div className="relative z-10">
                      <h3 className="font-headline font-bold mb-1">Best Match</h3>
                      <p className="text-primary-container text-sm mb-1">
                        {data.analyses.bestMatch.jobTitle}
                      </p>
                      <p className="text-primary-container/70 text-xs mb-3">
                        {data.analyses.bestMatch.company}
                      </p>
                      <p className="text-3xl font-extrabold font-headline mb-4">
                        {data.analyses.bestMatch.matchScore}%
                      </p>
                      <Link
                        to={`/analysis/${data.analyses.bestMatch.jobId}`}
                        className="bg-white text-primary px-4 py-2 rounded-md font-bold text-sm hover:bg-opacity-90 transition-all flex items-center w-fit"
                      >
                        View Analysis
                        <span className="material-symbols-outlined text-sm ml-2">arrow_forward</span>
                      </Link>
                    </div>
                    <div className="absolute bottom-0 right-0 p-2 opacity-20 transform translate-x-4 translate-y-4">
                      <span className="material-symbols-outlined text-9xl">stars</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="md:col-span-12 mt-10 pt-10 border-t border-surface-container-highest flex flex-col sm:flex-row justify-between items-center text-on-surface-variant text-sm">
                <p>© 2026 Job Prep AI. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 sm:mt-0">
                  <span className="hover:text-primary transition-colors cursor-pointer">Privacy</span>
                  <span className="hover:text-primary transition-colors cursor-pointer">Terms</span>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>

      {/* FAB */}
      <Link
        to="/jobs"
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
        <span className="absolute right-full mr-4 bg-on-surface text-white px-3 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Add Job
        </span>
      </Link>
    </div>
  );
}