import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.data.token, res.data.data.user);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-low font-body text-on-surface antialiased min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements — Using radial-gradient instead of blur() to prevent GPU hangs during typing */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }}></div>

      <main className="w-full max-w-[480px] z-10">
        {/* Brand Header */}
        <div className="mb-10 text-center">
          <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface mb-2">
            Job Prep AI
          </h1>
          <p className="text-on-surface-variant font-medium tracking-wide">
            Enter your credentials to access your dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_40px_60px_rgba(25,28,29,0.05)] overflow-hidden">
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface tracking-tight" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
                    alternate_email
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-md focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-outline transition-all"
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-on-surface tracking-tight" htmlFor="password">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-high border-none rounded-md focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-outline transition-all"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient py-4 rounded-md text-on-primary font-bold tracking-wide shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="animate-spin material-symbols-outlined text-xl">progress_activity</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                      arrow_right_alt
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30"></div>
              </div>
              <div className="relative flex justify-center text-xs font-bold tracking-widest uppercase">
                <span className="px-4 bg-surface-container-lowest text-outline">
                  New here?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-on-surface-variant font-medium text-sm">
                Don't have an account?
                <Link
                  to="/register"
                  className="text-primary font-bold border-b-2 border-transparent hover:border-primary transition-all ml-1"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}