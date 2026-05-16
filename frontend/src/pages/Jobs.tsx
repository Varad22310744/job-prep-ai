import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

const fetchJobs = async () => {
  const res = await api.get('/jobs');
  return res.data.data;
};

export default function Jobs() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [extractedPreview, setExtractedPreview] = useState<string[]>([]);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/jobs', { jobTitle, company, jobDescription });
      return res.data.data;
    },
    onSuccess: (data) => {
      toast.success('Job added successfully!');
      setExtractedPreview(data.requiredSkills || []);
      setJobTitle('');
      setCompany('');
      setJobDescription('');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setTimeout(() => setExtractedPreview([]), 5000);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add job');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (jobId: string) => {
      await api.delete(`/jobs/${jobId}`);
      return jobId;
    },
    onSuccess: () => {
      toast.success('Job deleted');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: () => toast.error('Failed to delete job'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !company || !jobDescription) {
      toast.error('Please fill in all fields');
      return;
    }
    addMutation.mutate();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
    { label: 'Resume', icon: 'description', href: '/resume' },
    { label: 'Jobs', icon: 'work', href: '/jobs' },
  ];

  const formatDate = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3_600_000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="bg-surface text-on-surface flex min-h-screen">
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
          <nav className="mt-2 space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center py-3 pl-4 transition-all duration-200 ${
                    isActive
                      ? 'text-white border-l-4 border-primary bg-white/5'
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
            className="flex items-center w-full text-slate-400 pl-5 py-3 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <span className="material-symbols-outlined mr-4">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 bg-surface-container-low min-h-screen pb-24 md:pb-12">
        {/* Mobile Header */}
        <header className="flex justify-between items-center px-6 py-4 w-full md:hidden bg-white/80 backdrop-blur-xl sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">menu</span>
            <h1 className="text-lg font-black text-on-surface font-headline">Jobs</h1>
          </div>
        </header>

        {/* Page Header */}
        <div className="hidden md:flex px-8 pt-8 pb-4 justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">
              Jobs Management
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Track and analyze your career opportunities.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1.5 rounded-lg">
            <span className="text-xs font-semibold text-on-surface-variant">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} added
            </span>
          </div>
        </div>

        <div className="px-6 md:px-8 space-y-8 mt-6">
          {/* Add Job Form */}
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-headline flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                Add New Job
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-1">
                  Job Title
                </label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/50 text-sm placeholder:text-outline transition-all"
                  placeholder="e.g. Senior Frontend Engineer"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                />
              </div>

              {/* Company */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-1">
                  Company Name
                </label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/50 text-sm placeholder:text-outline transition-all"
                  placeholder="e.g. Google"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>

              {/* Job Description */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-1">
                  Job Description
                </label>
                <textarea
                  className="w-full bg-surface-container-high border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/50 text-sm placeholder:text-outline transition-all resize-none"
                  placeholder="Paste the full job description here to extract required skills..."
                  rows={5}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
              </div>

              {/* Extracted Skills Preview + Submit */}
              <div className="md:col-span-2 flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                <div className="flex-1 bg-surface-container-low rounded-lg p-4 border border-outline-variant/20">
                  <span className="text-[10px] font-bold text-outline uppercase block mb-3">
                    Extracted Skills (after submit)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {extractedPreview.length > 0 ? (
                      extractedPreview.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs rounded-full border border-outline-variant/30 flex items-center gap-1.5 opacity-50">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        Awaiting input...
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all self-end md:self-center h-fit disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {addMutation.isPending ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">
                        progress_activity
                      </span>
                      Adding...
                    </>
                  ) : (
                    'Add Job'
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Jobs List */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold font-headline">
                Your Jobs
                <span className="ml-2 text-sm font-normal text-on-surface-variant">
                  ({jobs.length})
                </span>
              </h2>
            </div>

            {isLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-surface-container-lowest p-6 rounded-xl animate-pulse h-48" />
                ))}
              </div>
            )}

            {!isLoading && jobs.length === 0 && (
              <div className="text-center py-16 bg-surface-container-lowest rounded-xl">
                <span className="material-symbols-outlined text-6xl text-outline mb-4 block">
                  work_off
                </span>
                <p className="font-bold text-on-surface mb-2">No jobs added yet</p>
                <p className="text-on-surface-variant text-sm">
                  Add a job description above to get started
                </p>
              </div>
            )}

            {!isLoading && jobs.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job: any) => (
                  <div
                    key={job._id}
                    className="group bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-transparent hover:border-primary/10 hover:shadow-md hover:scale-[1.01] transition-all duration-300"
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">work</span>
                      </div>
                      <span className="text-[10px] font-bold text-outline uppercase">
                        {formatDate(job.createdAt)}
                      </span>
                    </div>

                    {/* Job Info */}
                    <h3 className="text-lg font-bold font-headline mb-1 group-hover:text-primary transition-colors">
                      {job.jobTitle}
                    </h3>
                    <p className="text-sm text-on-surface-variant font-medium mb-4">
                      {job.company}
                    </p>

                    {/* Skills count */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-primary text-sm">
                        auto_awesome
                      </span>
                      <span className="text-xs font-semibold text-primary">
                        {job.requiredSkills?.length || 0} skills required
                      </span>
                    </div>

                    {/* Skills preview */}
                    {job.requiredSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.requiredSkills.slice(0, 4).map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.requiredSkills.length > 4 && (
                          <span className="px-2 py-0.5 bg-surface-container text-outline text-xs rounded-full">
                            +{job.requiredSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                      <Link
                        to={`/analysis/${job._id}`}
                        className="text-xs font-bold px-4 py-2 rounded-lg border border-outline-variant hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
                      >
                        Analyze
                      </Link>
                      <button
                        onClick={() => deleteMutation.mutate(job._id)}
                        disabled={deleteMutation.isPending}
                        className="p-2 text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around py-3 px-2 bg-white md:hidden z-50 border-t border-slate-100 shadow-sm">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center transition-all ${
                isActive ? 'text-primary font-bold' : 'text-slate-400'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}