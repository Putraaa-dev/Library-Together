import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Library, Eye, EyeOff, ArrowLeft, User, Mail, Lock, Phone, MapPin, Loader2 } from 'lucide-react';

type LoginForm = { email: string; password: string };
type RegisterForm = { name: string; email: string; password: string; confirmPassword: string; phone: string; address: string };

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register: registerUser, isAuthenticated, isLoading } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const loginForm = useForm<LoginForm>();
  const registerForm = useForm<RegisterForm>();

  const onLogin = async (data: LoginForm) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success(result.message);
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Password tidak cocok!');
      return;
    }
    const result = await registerUser({ name: data.name, email: data.email, password: data.password, phone: data.phone, address: data.address });
    if (result.success) {
      toast.success(result.message);
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const demoAccounts = [
    { label: 'Admin', email: 'admin@perpus.id', pass: 'admin123', color: 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20' },
    { label: 'Petugas', email: 'petugas@perpus.id', pass: 'petugas123', color: 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20' },
    { label: 'User', email: 'ahmad@email.com', pass: 'user123', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20' },
  ];

  const fillDemo = (email: string, pass: string) => {
    loginForm.setValue('email', email);
    loginForm.setValue('password', pass);
  };

  return (
    <div className="min-h-screen bg-[#070f1e] flex items-center justify-center px-4 py-12">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke beranda
        </button>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-8 pb-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Library size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">BiblioSpace</h1>
                <p className="text-slate-400 text-xs">Perpustakaan Digital Modern</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-800/60 rounded-xl mb-6">
              {(['login', 'register'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    tab === t
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'login' ? 'Masuk' : 'Daftar'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 pt-4">
            <AnimatePresence mode="wait">
              {tab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <div>
                      <label className="text-slate-300 text-sm mb-1.5 block">Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          {...loginForm.register('email', { required: true })}
                          type="email"
                          placeholder="email@contoh.com"
                          className="w-full pl-9 pr-4 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm mb-1.5 block">Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          {...loginForm.register('password', { required: true })}
                          type={showPass ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-10 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? <><Loader2 size={16} className="animate-spin" />Memproses...</> : 'Masuk'}
                    </button>
                  </form>

                  {/* Demo Accounts */}
                  <div className="mt-6">
                    <p className="text-slate-500 text-xs text-center mb-3">Akun Demo</p>
                    <div className="grid grid-cols-3 gap-2">
                      {demoAccounts.map((acc, i) => (
                        <button
                          key={i}
                          onClick={() => fillDemo(acc.email, acc.pass)}
                          className={`py-2 rounded-lg border text-xs font-medium transition-all duration-200 ${acc.color}`}
                        >
                          {acc.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-3">
                    <div>
                      <label className="text-slate-300 text-sm mb-1.5 block">Nama Lengkap</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          {...registerForm.register('name', { required: true })}
                          placeholder="Nama lengkap"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm mb-1.5 block">Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          {...registerForm.register('email', { required: true })}
                          type="email"
                          placeholder="email@contoh.com"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 text-sm mb-1.5 block">Password</label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            {...registerForm.register('password', { required: true })}
                            type={showPass ? 'text' : 'password'}
                            placeholder="••••••"
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-300 text-sm mb-1.5 block">Konfirmasi</label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            {...registerForm.register('confirmPassword', { required: true })}
                            type={showConfirmPass ? 'text' : 'password'}
                            placeholder="••••••"
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm mb-1.5 block">No. Telepon</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          {...registerForm.register('phone', { required: true })}
                          placeholder="08xxxxxxxxxx"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm mb-1.5 block">Alamat</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-3 text-slate-500" />
                        <textarea
                          {...registerForm.register('address', { required: true })}
                          placeholder="Alamat lengkap"
                          rows={2}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? <><Loader2 size={16} className="animate-spin" />Memproses...</> : 'Daftar Sekarang'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
