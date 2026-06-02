import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, BookOpen, Users, ClipboardList, LogOut,
  Menu, X, Bell, Search, ChevronRight, Library, UserCircle,
  BookMarked, History, Settings,
} from 'lucide-react';
import { toast } from 'sonner';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={18} />, roles: ['admin', 'petugas', 'user'] },
  { label: 'Katalog Buku', to: '/catalog', icon: <BookOpen size={18} />, roles: ['user'] },
  { label: 'Pinjaman Saya', to: '/my-loans', icon: <History size={18} />, roles: ['user'] },
  { label: 'Kelola Buku', to: '/manage-books', icon: <BookMarked size={18} />, roles: ['admin', 'petugas'] },
  { label: 'Kelola Peminjaman', to: '/manage-loans', icon: <ClipboardList size={18} />, roles: ['admin', 'petugas'] },
  { label: 'Kelola User', to: '/manage-users', icon: <Users size={18} />, roles: ['admin'] },
  { label: 'Profil Saya', to: '/profile', icon: <UserCircle size={18} />, roles: ['admin', 'petugas', 'user'] },
];

const roleColors = {
  admin: 'bg-red-500',
  petugas: 'bg-amber-500',
  user: 'bg-emerald-500',
};

const roleLabels = {
  admin: 'Admin',
  petugas: 'Petugas',
  user: 'Pengunjung',
};

export function DashboardLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Berhasil logout!');
    navigate('/');
  };

  const userNavItems = navItems.filter(item => currentUser && item.roles.includes(currentUser.role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
          <Library size={18} className="text-white" />
        </div>
        {(sidebarOpen || mobileSidebarOpen) && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <span className="text-white font-semibold text-sm">BiblioSpace</span>
            <span className="text-blue-300 text-xs">Perpustakaan Digital</span>
          </motion.div>
        )}
      </div>

      {/* User Info */}
      {(sidebarOpen || mobileSidebarOpen) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-4 my-4 p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <img src={currentUser?.avatar} alt="" className="w-9 h-9 rounded-full border-2 border-blue-400" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{currentUser?.name}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full text-white font-medium ${roleColors[currentUser?.role || 'user']}`}>
                {roleLabels[currentUser?.role || 'user']}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {userNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/30 to-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex-shrink-0 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'}`}>{item.icon}</span>
                {(sidebarOpen || mobileSidebarOpen) && (
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                )}
                {(sidebarOpen || mobileSidebarOpen) && isActive && (
                  <ChevronRight size={14} className="text-blue-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {(sidebarOpen || mobileSidebarOpen) && <span className="text-sm font-medium">Keluar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 68 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col bg-slate-900 border-r border-white/5 overflow-hidden flex-shrink-0"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-slate-900 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.innerWidth < 768) setMobileSidebarOpen(!mobileSidebarOpen);
                else setSidebarOpen(!sidebarOpen);
              }}
              className="p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2 border border-white/5">
              <Search size={16} className="text-slate-400" />
              <span className="text-slate-500 text-sm">Cari...</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <img src={currentUser?.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-blue-500/50" />
              <span className="hidden sm:block text-white text-sm font-medium">{currentUser?.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
