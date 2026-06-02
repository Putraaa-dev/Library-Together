import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Search, Edit2, Trash2, X, BookOpen, Filter, Save, Loader2 } from 'lucide-react';
import { Book, BOOK_CATEGORIES } from '../data/mockData';

type BookFormData = Omit<Book, 'id'>;

export function ManageBooksPage() {
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const PER_PAGE = 8;

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BookFormData>();

  const isAdmin = currentUser?.role === 'admin';

  const filtered = books.filter(b => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || b.category === category;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => {
    reset({
      title: '', author: '', isbn: '', category: 'Teknologi', description: '',
      cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=400&fit=crop',
      publisher: '', year: 2024, stock: 1, available: 1, location: 'Rak A1', pages: 100, language: 'Indonesia',
    });
    setEditingBook(null);
    setShowForm(true);
  };

  const openEdit = (book: Book) => {
    setEditingBook(book);
    Object.entries(book).forEach(([k, v]) => {
      if (k !== 'id') setValue(k as keyof BookFormData, v as any);
    });
    setShowForm(true);
  };

  const onSubmit = async (data: BookFormData) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    if (editingBook) {
      updateBook(editingBook.id, data);
      toast.success('Buku berhasil diperbarui!');
    } else {
      addBook(data);
      toast.success('Buku berhasil ditambahkan!');
    }
    setSaving(false);
    setShowForm(false);
    reset();
  };

  const onDelete = (id: string) => {
    deleteBook(id);
    setDeleteConfirm(null);
    toast.success('Buku berhasil dihapus!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-white text-2xl font-bold">Kelola Buku</h1>
          <p className="text-slate-400 text-sm mt-1">{books.length} buku dalam koleksi</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} />
            Tambah Buku
          </button>
        )}
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari judul atau penulis..."
            className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="pl-10 pr-8 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none min-w-[160px]"
          >
            <option value="">Semua Kategori</option>
            {BOOK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
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
                <th className="text-left text-slate-500 text-xs font-medium px-4 py-3 hidden md:table-cell">Kategori</th>
                <th className="text-left text-slate-500 text-xs font-medium px-4 py-3 hidden sm:table-cell">Stok</th>
                <th className="text-left text-slate-500 text-xs font-medium px-4 py-3 hidden lg:table-cell">Lokasi</th>
                {isAdmin && <th className="text-right text-slate-500 text-xs font-medium px-4 py-3">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {paged.map((book, i) => (
                <motion.tr
                  key={book.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/3 hover:bg-white/3 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={book.cover} alt="" className="w-10 h-13 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate max-w-[200px]">{book.title}</p>
                        <p className="text-slate-400 text-xs">{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="px-2.5 py-1 bg-blue-500/15 text-blue-400 text-xs rounded-lg">{book.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="text-xs">
                      <span className={`font-medium ${book.available > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{book.available}</span>
                      <span className="text-slate-500">/{book.stock}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-slate-400 text-xs">{book.location}</span>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(book)}
                          className="p-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirm(book.id)}
                          className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>

          {paged.length === 0 && (
            <div className="text-center py-16">
              <BookOpen size={32} className="text-slate-700 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Tidak ada buku ditemukan</p>
            </div>
          )}
        </div>

        {/* Pagination */}
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

      {/* Book Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowForm(false)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl my-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h2 className="text-white font-semibold">{editingBook ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-slate-300 text-xs mb-1 block">Judul Buku *</label>
                    <input {...register('title', { required: true })}
                      placeholder="Judul buku"
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">Penulis *</label>
                    <input {...register('author', { required: true })}
                      placeholder="Nama penulis"
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">ISBN *</label>
                    <input {...register('isbn', { required: true })}
                      placeholder="978-XXXXXXXXXX"
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">Kategori *</label>
                    <select {...register('category', { required: true })}
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none"
                    >
                      {BOOK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">Penerbit</label>
                    <input {...register('publisher')}
                      placeholder="Nama penerbit"
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">Tahun Terbit</label>
                    <input {...register('year', { valueAsNumber: true })} type="number" min={1900} max={2099}
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">Stok Total</label>
                    <input {...register('stock', { valueAsNumber: true })} type="number" min={0}
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">Tersedia</label>
                    <input {...register('available', { valueAsNumber: true })} type="number" min={0}
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">Jumlah Halaman</label>
                    <input {...register('pages', { valueAsNumber: true })} type="number" min={1}
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">Bahasa</label>
                    <select {...register('language')}
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none"
                    >
                      <option value="Indonesia">Indonesia</option>
                      <option value="Inggris">Inggris</option>
                      <option value="Arab">Arab</option>
                      <option value="Jepang">Jepang</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">Lokasi Rak</label>
                    <input {...register('location')}
                      placeholder="Contoh: Rak A1"
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-300 text-xs mb-1 block">URL Cover Buku</label>
                    <input {...register('cover')}
                      placeholder="https://..."
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-300 text-xs mb-1 block">Deskripsi</label>
                    <textarea {...register('description')}
                      placeholder="Deskripsi buku..."
                      rows={3}
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-sm transition-all"
                  >
                    Batal
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {saving ? <><Loader2 size={14} className="animate-spin" />Menyimpan...</> : <><Save size={14} />{editingBook ? 'Perbarui' : 'Simpan'}</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-red-500/20 rounded-2xl p-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <h3 className="text-white font-semibold text-center mb-2">Hapus Buku?</h3>
              <p className="text-slate-400 text-sm text-center mb-5">Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition-all"
                >
                  Batal
                </button>
                <button onClick={() => onDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-medium transition-all"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
