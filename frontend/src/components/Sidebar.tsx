import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Resume', icon: 'description', href: '/resume' },
  { label: 'Jobs', icon: 'work', href: '/jobs' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
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
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center py-3 transition-all duration-200 ${
                  isActive
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
  );
}