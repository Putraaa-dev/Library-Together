import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { BookOpen, Clock, CheckCircle, Search, BookMarked, ArrowRight } from 'lucide-react';

export function UserDashboard() {
  const { books, getLoansByUser } = useLibrary();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const myLoans = currentUser ? getLoansByUser(currentUser.id) : [];
  const activeLoans = myLoans.filter(l => l.status === 'approved');
  const pendingLoans = myLoans.filter(l => l.status === 'pending');
  const returnedLoans = myLoans.filter(l => l.status === 'returned');
  const recentBooks = books.filter(b => b.available > 0).slice(0, 4);

  const stats = [
    { label: 'Sedang Dipinjam', value: activeLoans.length, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Menunggu', value: pendingLoans.length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Sudah Kembali', value: returnedLoans.length, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Total Pinjaman', value: myLoans.length, icon: BookMarked, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-white text-2xl font-bold">Halo, {currentUser?.name?.split(' ')[0]}! 📚</h1>
        <p className="text-slate-400 text-sm mt-1">Temukan dan pinjam buku favoritmu hari ini.</p>
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

      {/* Quick Search CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="flex-1">
          <h3 className="text-white font-semibold">Cari Buku Favoritmu</h3>
          <p className="text-slate-400 text-sm mt-1">Jelajahi {books.length}+ koleksi buku dari berbagai kategori.</p>
        </div>
        <button
          onClick={() => navigate('/catalog')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-sm font-medium transition-all duration-200 group"
        >
          <Search size={16} />
          Jelajahi Katalog
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-slate-800/40 border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Buku yang Sedang Dipinjam</h3>
            <button onClick={() => navigate('/my-loans')} className="text-blue-400 text-xs hover:text-blue-300 transition-colors">
              Lihat semua →
            </button>
          </div>
          <div className="space-y-3">
            {activeLoans.map(loan => {
              const due = new Date(loan.dueDate);
              const today = new Date();
              const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={loan.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <BookOpen size={14} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium">Dipinjam sejak {loan.borrowDate}</p>
                    <p className="text-slate-500 text-xs">Batas kembali: {loan.dueDate}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${daysLeft < 3 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {daysLeft > 0 ? `${daysLeft}h lagi` : 'Hari ini!'}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recommended Books */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-slate-800/40 border border-white/5 rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Buku Tersedia</h3>
          <button onClick={() => navigate('/catalog')} className="text-blue-400 text-xs hover:text-blue-300 transition-colors">
            Lihat semua →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {recentBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              whileHover={{ y: -4 }}
              className="cursor-pointer"
              onClick={() => navigate('/catalog')}
            >
              <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-slate-700">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <p className="text-white text-xs font-medium truncate">{book.title}</p>
              <p className="text-slate-500 text-xs truncate">{book.author}</p>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                {book.available} tersedia
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}