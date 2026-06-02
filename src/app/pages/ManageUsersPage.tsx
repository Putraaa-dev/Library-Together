import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Plus, Search, Edit2, Trash2, X, Users, Save, Loader2, UserCheck, UserX } from 'lucide-react';
import { User } from '../data/mockData';

type UserFormData = Omit<User, 'id'>;

const ROLE_CONFIG = {
  admin: { label: 'Admin', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  petugas: { label: 'Petugas', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  user: { label: 'Pengunjung', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

export function ManageUsersPage() {
  const { users, addUser, updateUser, deleteUser } = useLibrary();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const { register, handleSubmit, reset, setValue } = useForm<UserFormData>();

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => {
    reset({ name: '', email: '', password: 'user123', role: 'user', avatar: '', phone: '', address: '', createdAt: new Date().toISOString().split('T')[0], status: 'active' });
    setEditingUser(null);
    setShowForm(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    Object.entries(user).forEach(([k, v]) => {
      if (k !== 'id') setValue(k as keyof UserFormData, v as any);
    });
    setShowForm(true);
  };

  const onSubmit = async (data: UserFormData) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    if (editingUser) {
      updateUser(editingUser.id, data);
      toast.success('User berhasil diperbarui!');
    } else {
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`;
      addUser({ ...data, avatar });
      toast.success('User berhasil ditambahkan!');
    }
    setSaving(false);
    setShowForm(false);
  };

  const onDelete = (id: string) => {
    if (id === currentUser?.id) {
      toast.error('Tidak dapat menghapus akun sendiri!');
      setDeleteConfirm(null);
      return;
    }
    deleteUser(id);
    setDeleteConfirm(null);
    toast.success('User berhasil dihapus!');
  };

  const toggleStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    updateUser(user.id, { status: newStatus });
    toast.success(`User ${newStatus === 'active' ? 'diaktifkan' : 'dinonaktifkan'}!`);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-white text-2xl font-bold">Kelola User</h1>
          <p className="text-slate-400 text-sm mt-1">{users.length} pengguna terdaftar</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} />
          Tambah User
        </button>
      </motion.div>

      {/* Role Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'admin', label: 'Admin', count: users.filter(u => u.role === 'admin').length },
          { key: 'petugas', label: 'Petugas', count: users.filter(u => u.role === 'petugas').length },
          { key: 'user', label: 'Pengunjung', count: users.filter(u => u.role === 'user').length },
        ].map(r => {
          const rc = ROLE_CONFIG[r.key as keyof typeof ROLE_CONFIG];
          return (
            <button key={r.key} onClick={() => { setRoleFilter(r.key); setPage(1); }}
              className={`p-4 rounded-2xl border ${rc.bg} text-left transition-all ${roleFilter === r.key ? 'ring-1 ring-white/20' : ''}`}
            >
              <p className={`text-2xl font-bold ${rc.color}`}>{r.count}</p>
              <p className="text-slate-400 text-xs mt-1">{r.label}</p>
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nama atau email..."
            className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
          />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-4 py-3 bg-slate-800/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none"
        >
          <option value="all">Semua Role</option>
          <option value="admin">Admin</option>
          <option value="petugas">Petugas</option>
          <option value="user">Pengunjung</option>
        </select>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paged.map((user, i) => {
          const rc = ROLE_CONFIG[user.role];
          return (
            <motion.div key={user.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 relative group"
            >
              <div className="flex flex-col items-center text-center mb-3">
                <div className="relative mb-3">
                  <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt=""
                    className={`w-14 h-14 rounded-full border-2 ${user.status === 'active' ? 'border-blue-500/50' : 'border-slate-600'}`}
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${user.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                </div>
                <p className="text-white text-sm font-medium">{user.name}</p>
                <p className="text-slate-500 text-xs truncate w-full">{user.email}</p>
                <span className={`mt-2 text-xs px-2.5 py-0.5 rounded-full border ${rc.bg} ${rc.color}`}>{rc.label}</span>
              </div>

              <div className="text-xs space-y-1 text-slate-500 mb-3">
                <p className="truncate">{user.phone || 'No. telp belum diisi'}</p>
                <p>Bergabung: {user.createdAt}</p>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleStatus(user)}
                  className={`flex-1 p-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 ${
                    user.status === 'active' ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  }`}
                >
                  {user.status === 'active' ? <><UserX size={12} />Nonaktif</> : <><UserCheck size={12} />Aktifkan</>}
                </button>
                <button onClick={() => openEdit(user)}
                  className="p-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setDeleteConfirm(user.id)}
                  className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  disabled={user.id === currentUser?.id}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {paged.length === 0 && (
        <div className="text-center py-16">
          <Users size={32} className="text-slate-700 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">Tidak ada user ditemukan</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
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

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowForm(false)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md my-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h2 className="text-white font-semibold">{editingUser ? 'Edit User' : 'Tambah User Baru'}</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-3">
                <div>
                  <label className="text-slate-300 text-xs mb-1 block">Nama Lengkap *</label>
                  <input {...register('name', { required: true })} placeholder="Nama lengkap"
                    className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-xs mb-1 block">Email *</label>
                  <input {...register('email', { required: true })} type="email" placeholder="email@contoh.com"
                    className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
                  />
                </div>
                {!editingUser && (
                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">Password *</label>
                    <input {...register('password', { required: !editingUser })} type="password" placeholder="Password"
                      className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">Role</label>
                    <select {...register('role')} className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none">
                      <option value="user">Pengunjung</option>
                      <option value="petugas">Petugas</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 text-xs mb-1 block">Status</label>
                    <select {...register('status')} className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 appearance-none">
                      <option value="active">Aktif</option>
                      <option value="inactive">Nonaktif</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-slate-300 text-xs mb-1 block">No. Telepon</label>
                  <input {...register('phone')} placeholder="08xxxxxxxxxx"
                    className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-xs mb-1 block">Alamat</label>
                  <textarea {...register('address')} placeholder="Alamat lengkap" rows={2}
                    className="w-full px-3 py-2.5 bg-slate-800/60 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 text-sm resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition-all"
                  >
                    Batal
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {saving ? <><Loader2 size={14} className="animate-spin" />Menyimpan...</> : <><Save size={14} />{editingUser ? 'Perbarui' : 'Simpan'}</>}
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
              <h3 className="text-white font-semibold text-center mb-2">Hapus User?</h3>
              <p className="text-slate-400 text-sm text-center mb-5">Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm">Batal</button>
                <button onClick={() => onDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-medium">Hapus</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
