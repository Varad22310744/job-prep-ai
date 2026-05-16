import { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

const fetchResume = async () => {
  const res = await api.get('/resume');
  return res.data.data;
};

const SKILL_COLORS = [
  'bg-primary/10 text-primary',
  'bg-secondary/10 text-secondary',
  'bg-tertiary/10 text-tertiary',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-pink-100 text-pink-700',
];

export default function Resume() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const { data: resume, isLoading } = useQuery({
    queryKey: ['resume'],
    queryFn: fetchResume,
    retry: false,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Resume uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['resume'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Upload failed');
    },
  });

  const extractMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/resume/extract-skills');
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        data.fromCache
          ? 'Skills loaded from cache'
          : `${data.data.count} skills extracted!`
      );
      queryClient.invalidateQueries({ queryKey: ['resume'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Extraction failed');
    },
  });

  const handleFile = (file: File) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(ext)) {
      toast.error('Only PDF and Word documents are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
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

  return (
    <div className="bg-surface-container-low font-body text-on-surface antialiased">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center px-4 h-16 w-full z-50 fixed top-0 bg-white/80 backdrop-blur-xl shadow-sm justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">menu</span>
          <h1 className="text-xl font-extrabold text-primary font-headline">Job Prep AI</h1>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-screen p-6 z-40 bg-[#191c1d] w-64 fixed left-0 top-0 shadow-2xl justify-between">
        <div>
          <div className="mb-10">
            <h1 className="text-2xl font-bold font-headline text-white">Job Prep AI</h1>
          </div>
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/10">
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
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center px-4 py-3 transition-colors duration-200 group ${
                    isActive
                      ? 'text-white border-l-4 border-primary bg-white/5 rounded-r-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10 rounded-lg'
                  }`}
                >
                  <span className={`material-symbols-outlined mr-3 ${isActive ? 'text-primary' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-400 hover:text-white px-4 py-3 hover:bg-white/10 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined mr-3">logout</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen pt-20 md:pt-10 px-6 md:px-12 pb-12">
        {/* Page Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">
              Resume Intelligence
            </h2>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed">
              Upload your resume, extract skills with AI, and match against job requirements.
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-lg flex items-center gap-2 hover:opacity-90 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-lg">upload_file</span>
            {resume ? 'Replace Resume' : 'Upload Resume'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left — Upload + Resume Info */}
          <div className="md:col-span-8 space-y-6">

            {/* Upload Zone */}
            {!resume && !isLoading && (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant hover:border-primary hover:bg-primary/5'
                }`}
              >
                {uploadMutation.isPending ? (
                  <span className="material-symbols-outlined text-5xl text-primary animate-spin mb-4">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-5xl text-outline mb-4">
                    upload_file
                  </span>
                )}
                <p className="font-bold text-on-surface mb-1">
                  {uploadMutation.isPending ? 'Uploading...' : 'Drop your resume here'}
                </p>
                <p className="text-on-surface-variant text-sm">PDF or DOCX · Max 5MB</p>
              </div>
            )}

            {/* Loading skeleton */}
            {isLoading && (
              <div className="bg-surface-container-lowest rounded-xl p-8 animate-pulse">
                <div className="h-6 bg-surface-container-high rounded w-1/3 mb-4" />
                <div className="h-4 bg-surface-container-high rounded w-2/3 mb-2" />
                <div className="h-4 bg-surface-container-high rounded w-1/2" />
              </div>
            )}

            {/* Resume Card */}
            {resume && (
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full tracking-wider uppercase mb-3 inline-block">
                      Active Resume
                    </span>
                    <h3 className="text-2xl font-bold font-headline">{resume.fileName}</h3>
                    <p className="text-on-surface-variant text-sm mt-1">
                      {resume.fileType.toUpperCase()} · {resume.rawText?.length} characters extracted
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">swap_horiz</span>
                  </button>
                </div>

                {/* Text Preview */}
                <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/20 max-h-48 overflow-y-auto">
                  <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                    {resume.rawText?.slice(0, 600)}
                    {resume.rawText?.length > 600 && '...'}
                  </p>
                </div>

                {/* Upload replacing */}
                {uploadMutation.isPending && (
                  <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium">
                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    Uploading new resume...
                  </div>
                )}
              </div>
            )}

            {/* Skills Section */}
            {resume && (
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">psychology</span>
                    Extracted Skills
                  </h3>
                  <button
                    onClick={() => extractMutation.mutate()}
                    disabled={extractMutation.isPending}
                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-60 flex items-center gap-2"
                  >
                    {extractMutation.isPending ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                        Extracting...
                      </>
                    ) : resume.extractedSkills?.length > 0 ? (
                      <>
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        Re-extract
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        Extract with AI
                      </>
                    )}
                  </button>
                </div>

                {resume.extractedSkills?.length > 0 ? (
                  <>
                    <p className="text-on-surface-variant text-sm mb-4">
                      {resume.extractedSkills.length} skills found in your resume
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {resume.extractedSkills.map((skill: string, i: number) => (
                        <span
                          key={skill}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            SKILL_COLORS[i % SKILL_COLORS.length]
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-4xl text-outline mb-3 block">
                      auto_awesome
                    </span>
                    <p className="text-on-surface-variant text-sm">
                      Click "Extract with AI" to identify your skills automatically
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — Stats Panel */}
          <div className="md:col-span-4 space-y-6">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-[#191c1d] to-[#2e3132] p-8 rounded-xl text-white shadow-xl">
              <p className="text-gray-400 text-sm font-medium mb-1">Skills Extracted</p>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-extrabold font-headline">
                  {resume?.extractedSkills?.length || 0}
                </span>
                <span className="text-primary-fixed-dim text-xl font-bold mb-1">skills</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full mb-6">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(100, ((resume?.extractedSkills?.length || 0) / 30) * 100)}%`,
                  }}
                />
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <span className={`material-symbols-outlined text-lg ${resume ? 'text-green-400' : 'text-gray-500'}`}>
                    {resume ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  Resume uploaded
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className={`material-symbols-outlined text-lg ${resume?.extractedSkills?.length > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                    {resume?.extractedSkills?.length > 0 ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  Skills extracted
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="material-symbols-outlined text-lg text-gray-500">
                    radio_button_unchecked
                  </span>
                  Add jobs to analyze
                </li>
              </ul>
              <Link
                to="/jobs"
                className="w-full mt-8 py-3 bg-white/5 border border-white/20 rounded-lg text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">work</span>
                Go to Jobs
              </Link>
            </div>

            {/* Tips Card */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
              <h4 className="font-bold text-lg font-headline mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                Tips
              </h4>
              <div className="space-y-3">
                {[
                  'Upload a PDF for best text extraction results',
                  'Make sure your resume lists skills clearly',
                  'Add multiple jobs to compare your match scores',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-surface-container-low rounded-lg">
                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">tips_and_updates</span>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: 'work', label: 'Add a Job', href: '/jobs' },
                { icon: 'dashboard', label: 'View Dashboard', href: '/dashboard' },
              ].map((action) => (
                <Link
                  key={action.href}
                  to={action.href}
                  className="p-4 rounded-xl bg-surface-container-high/50 border border-transparent hover:border-primary/20 transition-all cursor-pointer group flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary">{action.icon}</span>
                  </div>
                  <span className="font-bold text-sm">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}