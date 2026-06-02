import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BookOpen, Users, ClipboardList, TrendingUp, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', peminjaman: 45, pengembalian: 38 },
  { month: 'Feb', peminjaman: 52, pengembalian: 48 },
  { month: 'Mar', peminjaman: 61, pengembalian: 55 },
  { month: 'Apr', peminjaman: 48, pengembalian: 44 },
  { month: 'Mei', peminjaman: 70, pengembalian: 62 },
  { month: 'Jun', peminjaman: 65, pengembalian: 58 },
];

const categoryData = [
  { name: 'Teknologi', value: 4 },
  { name: 'Sejarah', value: 1 },
  { name: 'Sastra', value: 2 },
  { name: 'Psikologi', value: 2 },
  { name: 'Ekonomi', value: 2 },
  { name: 'Lainnya', value: 4 },
];

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export function AdminDashboard() {
  const { stats, loans, books, users } = useLibrary();
  const { currentUser } = useAuth();

  const pendingLoans = loans.filter(l => l.status === 'pending');
  const recentLoans = [...loans].sort((a, b) => b.borrowDate.localeCompare(a.borrowDate)).slice(0, 5);

  const statCards = [
    { label: 'Total Buku', value: stats.totalBooks, icon: BookOpen, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20', textColor: 'text-blue-400' },
    { label: 'Total User', value: stats.totalUsers, icon: Users, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-500/10', border: 'border-violet-500/20', textColor: 'text-violet-400' },
    { label: 'Peminjaman Aktif', value: stats.activeLoans, icon: ClipboardList, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', textColor: 'text-emerald-400' },
    { label: 'Terlambat', value: stats.overdueLoans, icon: AlertTriangle, color: 'from-red-500 to-red-600', bg: 'bg-red-500/10', border: 'border-red-500/20', textColor: 'text-red-400' },
  ];

  const statusData = [
    { name: 'Aktif', value: stats.activeLoans, color: '#10b981' },
    { name: 'Pending', value: loans.filter(l => l.status === 'pending').length, color: '#f59e0b' },
    { name: 'Kembali', value: stats.returnedLoans, color: '#3b82f6' },
    { name: 'Terlambat', value: stats.overdueLoans, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-white text-2xl font-bold">Selamat datang, {currentUser?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-slate-400 text-sm mt-1">Berikut ringkasan aktivitas perpustakaan hari ini.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`p-5 rounded-2xl ${s.bg} border ${s.border} relative overflow-hidden`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
              <s.icon size={18} className="text-white" />
            </div>
            <p className={`text-3xl font-bold ${s.textColor}`}>{s.value}</p>
            <p className="text-slate-400 text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-slate-800/40 border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold">Tren Peminjaman</h3>
              <p className="text-slate-500 text-xs mt-0.5">6 bulan terakhir</p>
            </div>
            <TrendingUp size={18} className="text-blue-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorPinjam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorKembali" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Area type="monotone" dataKey="peminjaman" stroke="#3b82f6" fill="url(#colorPinjam)" strokeWidth={2} name="Peminjaman" />
              <Area type="monotone" dataKey="pengembalian" stroke="#10b981" fill="url(#colorKembali)" strokeWidth={2} name="Pengembalian" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-slate-800/40 border border-white/5 rounded-2xl p-5"
        >
          <h3 className="text-white font-semibold mb-1">Status Peminjaman</h3>
          <p className="text-slate-500 text-xs mb-4">Distribusi saat ini</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-400">{s.name}</span>
                </div>
                <span className="text-white font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Loans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/40 border border-white/5 rounded-2xl p-5"
        >
          <h3 className="text-white font-semibold mb-4">Peminjaman Terbaru</h3>
          <div className="space-y-3">
            {recentLoans.map((loan, i) => {
              const book = books.find(b => b.id === loan.bookId);
              const user = users.find(u => u.id === loan.userId);
              const statusMap: Record<string, { icon: React.ReactNode; color: string }> = {
                pending: { icon: <Clock size={12} />, color: 'text-amber-400 bg-amber-400/10' },
                approved: { icon: <CheckCircle size={12} />, color: 'text-emerald-400 bg-emerald-400/10' },
                returned: { icon: <CheckCircle size={12} />, color: 'text-blue-400 bg-blue-400/10' },
                rejected: { icon: <XCircle size={12} />, color: 'text-red-400 bg-red-400/10' },
                overdue: { icon: <AlertTriangle size={12} />, color: 'text-red-400 bg-red-400/10' },
              };
              const s = statusMap[loan.status] || statusMap.pending;
              return (
                <div key={loan.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={14} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{book?.title}</p>
                    <p className="text-slate-500 text-xs">{user?.name}</p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${s.color}`}>
                    {s.icon} {loan.status}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Category Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-slate-800/40 border border-white/5 rounded-2xl p-5"
        >
          <h3 className="text-white font-semibold mb-4">Koleksi per Kategori</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Buku" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Pending Alert */}
      {pendingLoans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Clock size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-amber-300 font-medium text-sm">Ada {pendingLoans.length} Permintaan Peminjaman Menunggu</p>
            <p className="text-amber-400/60 text-xs">Segera tinjau dan proses permintaan peminjaman yang masuk.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
