import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, AlertTriangle, Search, RotateCcw, BookOpen } from 'lucide-react';
import { LoanStatus } from '../data/mockData';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  approved: { label: 'Aktif', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  returned: { label: 'Kembali', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  rejected: { label: 'Ditolak', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  overdue: { label: 'Terlambat', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
} as const;

export function ManageLoansPage() {
  const { loans, books, users, updateLoanStatus, returnBook } = useLibrary();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = loans.filter(l => {
    const book = books.find(b => b.id === l.bookId);
    const user = users.find(u => u.id === l.userId);
    const matchSearch = !search ||
      book?.title.toLowerCase().includes(search.toLowerCase()) ||
      user?.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => b.borrowDate.localeCompare(a.borrowDate));
  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paged = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = {
    all: loans.length,
    pending: loans.filter(l => l.status === 'pending').length,
    approved: loans.filter(l => l.status === 'approved').length,
    overdue: loans.filter(l => l.status === 'overdue').length,
    returned: loans.filter(l => l.status === 'returned').length,
    rejected: loans.filter(l => l.status === 'rejected').length,
  };

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

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-white text-2xl font-bold">Kelola Peminjaman</h1>
        <p className="text-slate-400 text-sm mt-1">{loans.length} total transaksi peminjaman</p>
      </motion.div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { key: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { key: 'approved', label: 'Aktif', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { key: 'overdue', label: 'Terlambat', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          { key: 'returned', label: 'Kembali', icon: RotateCcw, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { key: 'rejected', label: 'Ditolak', icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
        ].map(s => (
          <motion.button key={s.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => { setStatusFilter(s.key); setPage(1); }}
            className={`p-4 rounded-2xl border ${s.bg} text-left transition-all ${statusFilter === s.key ? 'ring-1 ring-white/20' : ''}`}
          >
            <s.icon size={16} className={s.color} />
            <p className={`text-xl font-bold mt-2 ${s.color}`}>{counts[s.key as keyof typeof counts]}</p>
            <p className="text-slate-500 text-xs">{s.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari buku atau user..."
            className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
          />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none"
        >
          <option value="all">Semua Status ({counts.all})</option>
          <option value="pending">Pending ({counts.pending})</option>
          <option value="approved">Aktif ({counts.approved})</option>
          <option value="overdue">Terlambat ({counts.overdue})</option>
          <option value="returned">Kembali ({counts.returned})</option>
          <option value="rejected">Ditolak ({counts.rejected})</option>
        </select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-slate-500 text-xs font-medium px-4 py-3">Buku</th>
                <th className="text-left text-slate-500 text-xs font-medium px-4 py-3 hidden md:table-cell">Peminjam</th>
                <th className="text-left text-slate-500 text-xs font-medium px-4 py-3 hidden sm:table-cell">Tgl Pinjam</th>
                <th className="text-left text-slate-500 text-xs font-medium px-4 py-3 hidden lg:table-cell">Jatuh Tempo</th>
                <th className="text-left text-slate-500 text-xs font-medium px-4 py-3">Status</th>
                <th className="text-right text-slate-500 text-xs font-medium px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((loan, i) => {
                const book = books.find(b => b.id === loan.bookId);
                const user = users.find(u => u.id === loan.userId);
                const sc = STATUS_CONFIG[loan.status as keyof typeof STATUS_CONFIG];
                const due = new Date(loan.dueDate);
                const today = new Date();
                const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <tr key={loan.id} className="border-b border-white/3 hover:bg-white/2 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={12} className="text-blue-400" />
                        </div>
                        <p className="text-white text-xs font-medium truncate max-w-[150px]">{book?.title || '—'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div>
                        <p className="text-slate-300 text-xs">{user?.name || '—'}</p>
                        <p className="text-slate-600 text-xs">{user?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-slate-400 text-xs">{loan.borrowDate}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`text-xs font-medium ${
                        loan.status === 'approved' && daysLeft < 3 ? 'text-red-400' : 'text-slate-400'
                      }`}>{loan.dueDate}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex text-xs px-2.5 py-1 rounded-full border ${sc.bg} ${sc.color}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {loan.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(loan.id)}
                              className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                              title="Setujui"
                            >
                              <CheckCircle size={13} />
                            </button>
                            <button onClick={() => handleReject(loan.id)}
                              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Tolak"
                            >
                              <XCircle size={13} />
                            </button>
                          </>
                        )}
                        {(loan.status === 'approved' || loan.status === 'overdue') && (
                          <button onClick={() => handleReturn(loan.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-xs font-medium"
                          >
                            Return
                          </button>
                        )}
                        {(loan.status === 'returned' || loan.status === 'rejected') && (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {paged.length === 0 && (
            <div className="text-center py-16">
              <BookOpen size={32} className="text-slate-700 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Tidak ada data peminjaman</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-white/5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  p === page ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
