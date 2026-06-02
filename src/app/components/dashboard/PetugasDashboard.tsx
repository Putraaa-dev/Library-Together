import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { BookOpen, ClipboardList, AlertTriangle, Clock, CheckCircle, XCircle, BookMarked } from 'lucide-react';
import { toast } from 'sonner';

export function PetugasDashboard() {
  const { books, loans, users, updateLoanStatus, returnBook } = useLibrary();
  const { currentUser } = useAuth();

  const pending = loans.filter(l => l.status === 'pending');
  const active = loans.filter(l => l.status === 'approved');
  const overdue = loans.filter(l => l.status === 'overdue');

  const handleApprove = (id: string) => {
    updateLoanStatus(id, 'approved');
    toast.success('Peminjaman disetujui!');
  };

  const handleReject = (id: string) => {
    updateLoanStatus(id, 'rejected', 'Ditolak oleh petugas');
    toast.error('Peminjaman ditolak');
  };

  const handleReturn = (id: string) => {
    returnBook(id);
    toast.success('Buku berhasil dikembalikan!');
  };

  const stats = [
    { label: 'Total Buku', value: books.length, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Pending', value: pending.length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Aktif', value: active.length, icon: ClipboardList, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Terlambat', value: overdue.length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ];

  const allPending = [...pending, ...overdue].slice(0, 8);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-white text-2xl font-bold">Dashboard Petugas 👋</h1>
        <p className="text-slate-400 text-sm mt-1">Selamat datang, {currentUser?.name?.split(' ')[0]}. Kelola peminjaman buku di sini.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`p-5 rounded-2xl border ${s.bg}`}
          >
            <s.icon size={20} className={`${s.color} mb-3`} />
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-slate-400 text-xs mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Pending Loans */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-slate-800/40 border border-white/5 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-5">
          <BookMarked size={18} className="text-amber-400" />
          <h3 className="text-white font-semibold">Permintaan Peminjaman</h3>
          {pending.length > 0 && (
            <span className="ml-auto px-2.5 py-0.5 bg-amber-500 text-white text-xs rounded-full font-medium">{pending.length}</span>
          )}
        </div>

        {allPending.length === 0 ? (
          <div className="text-center py-10">
            <CheckCircle size={32} className="text-emerald-400 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Tidak ada permintaan yang menunggu!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allPending.map(loan => {
              const book = books.find(b => b.id === loan.bookId);
              const user = users.find(u => u.id === loan.userId);
              return (
                <div key={loan.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/5">
                  <img src={book?.cover} alt="" className="w-12 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{book?.title}</p>
                    <p className="text-slate-400 text-xs">{user?.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-slate-500 text-xs">Tgl: {loan.borrowDate}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        loan.status === 'overdue' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {loan.status === 'overdue' ? 'Terlambat' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  {loan.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(loan.id)}
                        className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        title="Setujui"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => handleReject(loan.id)}
                        className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Tolak"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                  {loan.status === 'overdue' && (
                    <button onClick={() => handleReturn(loan.id)}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-xs font-medium"
                    >
                      Kembalikan
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Active Loans */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-slate-800/40 border border-white/5 rounded-2xl p-5"
      >
        <h3 className="text-white font-semibold mb-4">Peminjaman Aktif</h3>
        <div className="space-y-3">
          {active.slice(0, 5).map(loan => {
            const book = books.find(b => b.id === loan.bookId);
            const user = users.find(u => u.id === loan.userId);
            const due = new Date(loan.dueDate);
            const today = new Date();
            const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div key={loan.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={14} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{book?.title}</p>
                  <p className="text-slate-500 text-xs">{user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Jatuh tempo</p>
                  <p className={`text-xs font-medium ${daysLeft < 3 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {daysLeft > 0 ? `${daysLeft} hari` : 'Hari ini'}
                  </p>
                </div>
                <button onClick={() => handleReturn(loan.id)}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-xs font-medium flex-shrink-0"
                >
                  Return
                </button>
              </div>
            );
          })}
          {active.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-6">Tidak ada peminjaman aktif</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
