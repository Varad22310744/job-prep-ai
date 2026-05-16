import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const setAuth = useAuthStore((s) => s.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/register', { name, email, password });
            setAuth(res.data.data.token, res.data.data.user);
            toast.success('Account created! Welcome aboard.');
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface-container-low font-body text-on-surface flex min-h-screen items-center justify-center p-6">
            <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_40px_60px_rgba(25,28,29,0.05)]">

                {/* Left Panel */}
                {/* Left Panel */}
                <div className="hidden lg:block relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#001ed2] via-[#1a35e0] to-[#243bf9]"></div>

                    {/* Animated background circles */}
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-white/5"></div>
                    <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 rounded-full bg-white/5"></div>
                    <div className="absolute top-[40%] right-[10%] w-32 h-32 rounded-full bg-white/5"></div>

                    <div className="absolute inset-0 p-12 flex flex-col justify-between">
                        {/* Top — Brand */}
                        <div>
                            <h1 className="font-headline font-black text-3xl text-white tracking-tight">
                                Job Prep AI
                            </h1>
                        </div>

                        {/* Middle — Feature list fills the gap */}
                        <div className="flex flex-col gap-5">
                            {[
                                { icon: 'description', title: 'Smart Resume Parsing', desc: 'Upload PDF or DOCX and extract your skills automatically' },
                                { icon: 'auto_awesome', title: 'AI Skill Extraction', desc: 'Gemini AI identifies and normalizes every skill from your resume' },
                                { icon: 'analytics', title: 'Skill Gap Analysis', desc: 'Instantly see what skills you have and what you are missing' },
                                { icon: 'psychology', title: 'Interview Preparation', desc: 'Get tailored interview questions for every job you apply to' },
                            ].map((feature) => (
                                <div key={feature.title} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-none">
                                        <span className="material-symbols-outlined text-white text-lg">{feature.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{feature.title}</p>
                                        <p className="text-white/60 text-xs leading-relaxed mt-0.5">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom — Tagline */}
                        <div className="space-y-2">
                            <p className="font-headline font-bold text-3xl text-white leading-tight">
                                Land your dream job with AI-powered preparation.
                            </p>
                            <p className="text-white/70 text-sm">
                                Join thousands of job seekers who use Job Prep AI to get hired faster.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Panel — Form */}
                <div className="p-8 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10">
                        <h2 className="font-headline font-extrabold text-3xl text-on-surface mb-2">
                            Create Account
                        </h2>
                        <p className="text-on-surface-variant text-sm">
                            Start your job prep journey today.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider" htmlFor="name">
                                Full Name
                            </label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                                    person
                                </span>
                                <input
                                    className="w-full bg-surface-container-high border-none rounded-lg py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-outline transition-all"
                                    id="name"
                                    type="text"
                                    placeholder="Alex Thompson"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                                    mail
                                </span>
                                <input
                                    className="w-full bg-surface-container-high border-none rounded-lg py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-outline transition-all"
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider" htmlFor="password">
                                Password
                            </label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                                    lock
                                </span>
                                <input
                                    className="w-full bg-surface-container-high border-none rounded-lg py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-outline transition-all"
                                    id="password"
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    minLength={6}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <div className="flex items-center h-5">
                                <input
                                    className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/30"
                                    id="terms"
                                    type="checkbox"
                                    required
                                />
                            </div>
                            <label className="text-sm text-on-surface-variant leading-none" htmlFor="terms">
                                I agree to the{' '}
                                <span className="text-primary font-medium cursor-pointer hover:underline">Terms of Service</span>
                                {' '}and{' '}
                                <span className="text-primary font-medium cursor-pointer hover:underline">Privacy Policy</span>.
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-gradient w-full py-4 text-white font-bold rounded-lg shadow-[0_10px_20px_rgba(0,30,210,0.2)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="animate-spin material-symbols-outlined text-xl">
                                    progress_activity
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center space-y-4">
                        <p className="text-sm text-on-surface-variant">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                        <div className="pt-6 border-t border-surface-container flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-outline text-sm">info</span>
                            <p className="text-[10px] uppercase tracking-widest text-outline font-semibold">
                                Automatic login after registration
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}