import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Library, BookOpen, Users, Award, ArrowRight, Star, ChevronDown } from 'lucide-react';
import { ThreeLibraryScene } from '../components/ThreeLibraryScene';
import { useAuth } from '../context/AuthContext';

const stats = [
  { label: 'Koleksi Buku', value: '15,000+', icon: BookOpen },
  { label: 'Anggota Aktif', value: '3,200+', icon: Users },
  { label: 'Penghargaan', value: '12', icon: Award },
];

const features = [
  {
    title: 'Katalog Digital',
    desc: 'Temukan ribuan buku dari berbagai kategori dengan pencarian cepat dan filter canggih.',
    icon: '📚',
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/20',
  },
  {
    title: 'Peminjaman Online',
    desc: 'Pinjam dan kembalikan buku kapan saja dengan sistem manajemen peminjaman yang mudah.',
    icon: '🔖',
    color: 'from-violet-500/20 to-violet-600/10',
    border: 'border-violet-500/20',
  },
  {
    title: 'Dashboard Pintar',
    desc: 'Pantau statistik perpustakaan, riwayat peminjaman, dan status buku secara real-time.',
    icon: '📊',
    color: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/20',
  },
  {
    title: 'Multi Role Akses',
    desc: 'Sistem akses berbasis peran untuk Admin, Petugas, dan Pengunjung dengan fitur khusus.',
    icon: '🛡️',
    color: 'from-amber-500/20 to-amber-600/10',
    border: 'border-amber-500/20',
  },
];

const testimonials = [
  { name: 'Ahmad Fauzi', role: 'Mahasiswa', text: 'BiblioSpace sangat memudahkan saya mencari buku referensi. Antarmukanya modern dan cepat!', stars: 5 },
  { name: 'Dewi Lestari', role: 'Peneliti', text: 'Sistem peminjaman online sangat praktis. Tidak perlu antri panjang lagi di perpustakaan.', stars: 5 },
  { name: 'Riko Pratama', role: 'Dosen', text: 'Fitur pencarian dan filter kategori sangat membantu dalam menemukan referensi akademis.', stars: 4 },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTA = () => {
    if (isAuthenticated) navigate('/dashboard');
    else navigate('/login');
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#070f1e] min-h-screen text-white overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: scrollY > 50 ? 'rgba(7,15,30,0.95)' : 'transparent', backdropFilter: scrollY > 50 ? 'blur(12px)' : 'none', borderBottom: scrollY > 50 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'all 0.3s ease' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Library size={18} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg">BiblioSpace</span>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-sm transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-slate-300 hover:text-white text-sm transition-colors font-medium"
              >
                Masuk
              </button>
              <button
                onClick={() => navigate('/login?tab=register')}
                className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-sm transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
              >
                Daftar
              </button>
            </>
          )}
        </div>
      </motion.nav>

      {/* Hero Section with 3D */}
      <section className="relative h-screen flex items-center justify-center">
        {/* 3D Scene Background */}
        <div className="absolute inset-0">
          <ThreeLibraryScene className="w-full h-full" />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070f1e]/30 via-[#070f1e]/20 to-[#070f1e]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070f1e]/60 via-transparent to-[#070f1e]/60" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-sm mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Sistem Perpustakaan Digital Modern
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-white">Selamat Datang di</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              BiblioSpace
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Perpustakaan digital modern dengan antarmuka 3D imersif. Temukan, pinjam, dan kelola koleksi buku favoritmu dengan mudah.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleCTA}
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-2xl text-base font-semibold transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
            >
              Mulai Sekarang
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={scrollToFeatures}
              className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 text-white rounded-2xl text-base font-medium transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
            >
              Pelajari Lebih
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-blue-300">{s.value}</p>
                <p className="text-slate-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={scrollToFeatures}
        >
          <ChevronDown size={24} className="text-blue-400/60" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Fitur Unggulan</span>
            <h2 className="text-white mt-3 text-4xl font-bold">Semua yang kamu butuhkan</h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">Platform perpustakaan lengkap yang dirancang untuk kemudahan pengguna modern.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${f.color} border ${f.border} cursor-default`}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials Demo Section */}
      <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-white text-3xl font-bold">Coba Demo Sekarang</h2>
            <p className="text-slate-400 mt-3">Login dengan akun demo untuk menjelajahi fitur setiap role</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { role: 'Admin', email: 'admin@perpus.id', pass: 'admin123', color: 'from-red-500/20 to-red-600/10', border: 'border-red-500/30', badge: 'bg-red-500', desc: 'Akses penuh: kelola buku, user, & peminjaman' },
              { role: 'Petugas', email: 'petugas@perpus.id', pass: 'petugas123', color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', badge: 'bg-amber-500', desc: 'Kelola buku & peminjaman' },
              { role: 'User', email: 'ahmad@email.com', pass: 'user123', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500', desc: 'Katalog & pinjam buku' },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-5 rounded-2xl bg-gradient-to-br ${c.color} border ${c.border}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full ${c.badge} text-white text-xs font-medium`}>{c.role}</span>
                </div>
                <p className="text-slate-300 text-xs mb-3">{c.desc}</p>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-200">{c.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Password:</span>
                    <span className="text-slate-200">{c.pass}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <button
              onClick={() => navigate('/login')}
              className="group inline-flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              Pergi ke Halaman Login
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-white text-3xl font-bold">Apa kata mereka?</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Library size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold">BiblioSpace</span>
        </div>
        <p className="text-slate-600 text-sm">© 2026 BiblioSpace. Sistem Perpustakaan Digital Modern.</p>
      </footer>
    </div>
  );
}
