import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { BookOpen, Clock, CheckCircle, XCircle, AlertTriangle, History, Calendar } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Menunggu', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  approved: { label: 'Dipinjam', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  returned: { label: 'Kembali', icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  rejected: { label: 'Ditolak', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  overdue: { label: 'Terlambat', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
} as const;

export function MyLoansPage() {
  const { getLoansByUser, books } = useLibrary();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState('all');

  const myLoans = currentUser ? getLoansByUser(currentUser.id) : [];
  const filtered = filter === 'all' ? myLoans : myLoans.filter(l => l.status === filter);
  const sorted = [...filtered].sort((a, b) => b.borrowDate.localeCompare(a.borrowDate));

  const counts = {
    all: myLoans.length,
    pending: myLoans.filter(l => l.status === 'pending').length,
    approved: myLoans.filter(l => l.status === 'approved').length,
    returned: myLoans.filter(l => l.status === 'returned').length,
    rejected: myLoans.filter(l => l.status === 'rejected').length,
    overdue: myLoans.filter(l => l.status === 'overdue').length,
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-white text-2xl font-bold">Riwayat Pinjaman</h1>
        <p className="text-slate-400 text-sm mt-1">Pantau status peminjaman bukumu</p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {([
          ['all', 'Semua'],
          ['approved', 'Aktif'],
          ['pending', 'Menunggu'],
          ['returned', 'Kembali'],
          ['overdue', 'Terlambat'],
          ['rejected', 'Ditolak'],
        ] as [string, string][]).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === val
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/5'
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${filter === val ? 'bg-white/20' : 'bg-slate-700'}`}>
              {counts[val as keyof typeof counts]}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Loans List */}
      <div className="space-y-4">
        {sorted.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <History size={40} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Belum ada riwayat peminjaman</p>
            <p className="text-slate-600 text-xs mt-1">Mulai pinjam buku dari katalog</p>
          </motion.div>
        ) : (
          sorted.map((loan, i) => {
            const book = books.find(b => b.id === loan.bookId);
            const sc = STATUS_CONFIG[loan.status as keyof typeof STATUS_CONFIG];
            const due = new Date(loan.dueDate);
            const today = new Date();
            const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 flex gap-4"
              >
                {/* Cover */}
                <div className="w-16 h-22 rounded-xl overflow-hidden flex-shrink-0 bg-slate-700">
                  {book?.cover && <img src={book.cover} alt={book?.title} className="w-full h-full object-cover" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-white font-semibold text-sm leading-snug">{book?.title || 'Buku tidak ditemukan'}</h3>
                      <p className="text-slate-400 text-xs mt-0.5">{book?.author}</p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border flex-shrink-0 ${sc.bg} ${sc.color}`}>
                      <sc.icon size={10} />
                      {sc.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={11} />
                      <span>Pinjam: <span className="text-slate-300">{loan.borrowDate}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={11} />
                      <span>Jatuh tempo: <span className={`font-medium ${
                        loan.status === 'approved' && daysLeft < 3 ? 'text-red-400' : 'text-slate-300'
                      }`}>{loan.dueDate}</span></span>
                    </div>
                    {loan.returnDate && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <CheckCircle size={11} />
                        <span>Dikembalikan: <span className="text-emerald-400">{loan.returnDate}</span></span>
                      </div>
                    )}
                  </div>

                  {loan.status === 'approved' && daysLeft > 0 && daysLeft <= 3 && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                      <AlertTriangle size={11} />
                      Segera kembalikan! Tersisa {daysLeft} hari
                    </div>
                  )}

                  {loan.notes && (
                    <p className="mt-2 text-xs text-slate-500 italic">{loan.notes}</p>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
