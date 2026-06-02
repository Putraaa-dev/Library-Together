import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Search, Filter, BookOpen, X, Star, MapPin, Calendar, Globe, Hash } from 'lucide-react';
import { BOOK_CATEGORIES, Book } from '../data/mockData';

export function CatalogPage() {
  const { books, addLoan, getLoansByUser } = useLibrary();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 9;

  const myLoans = currentUser ? getLoansByUser(currentUser.id) : [];
  const activeLoanBookIds = myLoans.filter(l => ['pending', 'approved'].includes(l.status)).map(l => l.bookId);

  const filtered = books.filter(b => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search);
    const matchCat = !category || b.category === category;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleBorrow = (book: Book) => {
    if (!currentUser) return;
    if (activeLoanBookIds.includes(book.id)) {
      toast.error('Kamu sudah meminjam buku ini!');
      return;
    }
    if (book.available <= 0) {
      toast.error('Stok buku tidak tersedia!');
      return;
    }
    const today = new Date();
    const due = new Date(today);
    due.setDate(today.getDate() + 14);

    addLoan({
      userId: currentUser.id,
      bookId: book.id,
      borrowDate: today.toISOString().split('T')[0],
      dueDate: due.toISOString().split('T')[0],
      returnDate: null,
      status: 'pending',
      notes: '',
    });
    toast.success('Permintaan peminjaman berhasil dikirim! Menunggu persetujuan petugas.');
    setSelectedBook(null);
  };

  const isAlreadyBorrowed = (bookId: string) => activeLoanBookIds.includes(bookId);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-white text-2xl font-bold">Katalog Buku</h1>
        <p className="text-slate-400 text-sm mt-1">Jelajahi {books.length} koleksi buku kami</p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari judul, penulis, ISBN..."
            className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-sm transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="pl-10 pr-8 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all appearance-none min-w-[160px]"
          >
            <option value="">Semua Kategori</option>
            {BOOK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">{filtered.length} buku ditemukan</p>
        {(search || category) && (
          <button onClick={() => { setSearch(''); setCategory(''); }} className="text-blue-400 text-xs hover:text-blue-300 transition-colors">
            Reset filter
          </button>
        )}
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {paged.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4 }}
              className="bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => setSelectedBook(book)}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-xs rounded-lg font-medium">
                  {book.category}
                </span>
                <span className={`absolute top-3 right-3 px-2 py-1 backdrop-blur-sm text-xs rounded-lg font-medium ${
                  book.available > 0 ? 'bg-emerald-500/80 text-white' : 'bg-red-500/80 text-white'
                }`}>
                  {book.available > 0 ? `${book.available} tersedia` : 'Habis'}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-1">{book.title}</h3>
                <p className="text-slate-400 text-xs mb-3">{book.author} · {book.year}</p>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">{book.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                    <MapPin size={10} /> {book.location}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); if (book.available > 0 && !isAlreadyBorrowed(book.id)) handleBorrow(book); }}
                    disabled={book.available === 0 || isAlreadyBorrowed(book.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      isAlreadyBorrowed(book.id)
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : book.available === 0
                        ? 'bg-red-500/20 text-red-400 cursor-not-allowed'
                        : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300'
                    }`}
                  >
                    {isAlreadyBorrowed(book.id) ? 'Dipinjam' : book.available === 0 ? 'Habis' : 'Pinjam'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                p === page ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBook(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-48">
                <img src={selectedBook.cover} alt={selectedBook.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <button onClick={() => setSelectedBook(null)} className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <X size={16} />
                </button>
                <div className="absolute bottom-3 left-4">
                  <span className="px-2 py-1 bg-blue-500/80 backdrop-blur-sm text-white text-xs rounded-lg">{selectedBook.category}</span>
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-white font-bold text-lg leading-snug">{selectedBook.title}</h2>
                <p className="text-blue-400 text-sm mt-1">{selectedBook.author}</p>

                <div className="grid grid-cols-2 gap-3 my-4">
                  {[
                    { icon: Hash, label: 'ISBN', value: selectedBook.isbn },
                    { icon: Calendar, label: 'Tahun', value: selectedBook.year },
                    { icon: Globe, label: 'Bahasa', value: selectedBook.language },
                    { icon: BookOpen, label: 'Halaman', value: selectedBook.pages },
                    { icon: MapPin, label: 'Lokasi', value: selectedBook.location },
                    { icon: Star, label: 'Stok', value: `${selectedBook.available}/${selectedBook.stock}` },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <item.icon size={12} className="text-slate-500 flex-shrink-0" />
                      <span className="text-slate-500">{item.label}:</span>
                      <span className="text-slate-300">{item.value}</span>
                    </div>
                  ))}
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-5">{selectedBook.description}</p>

                <div className="flex items-center gap-3">
                  <span className={`flex-1 text-center py-2.5 rounded-xl text-sm font-medium ${
                    selectedBook.available > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedBook.available > 0 ? `${selectedBook.available} buku tersedia` : 'Stok habis'}
                  </span>
                  <button
                    onClick={() => handleBorrow(selectedBook)}
                    disabled={selectedBook.available === 0 || isAlreadyBorrowed(selectedBook.id)}
                    className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAlreadyBorrowed(selectedBook.id) ? 'Sudah Dipinjam' : 'Pinjam Buku'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <BookOpen size={40} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Buku tidak ditemukan</p>
          <p className="text-slate-600 text-xs mt-1">Coba kata kunci atau kategori lain</p>
        </div>
      )}
    </div>
  );
}
