import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, Loader2, BookOpen, CheckCircle, Clock } from 'lucide-react';

const ROLE_CONFIG = {
  admin: { label: 'Admin', color: 'bg-red-500' },
  petugas: { label: 'Petugas', color: 'bg-amber-500' },
  user: { label: 'Pengunjung', color: 'bg-emerald-500' },
};

export function ProfilePage() {
  const { currentUser } = useAuth();
  const { updateUser, getLoansByUser } = useLibrary();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const myLoans = currentUser ? getLoansByUser(currentUser.id) : [];
  const activeLoans = myLoans.filter(l => l.status === 'approved').length;
  const pendingLoans = myLoans.filter(l => l.status === 'pending').length;
  const returnedLoans = myLoans.filter(l => l.status === 'returned').length;

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
    },
  });

  const onSubmit = async (data: any) => {
    if (!currentUser) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    updateUser(currentUser.id, data);
    toast.success('Profil berhasil diperbarui!');
    setSaving(false);
    setEditing(false);
  };

  if (!currentUser) return null;

  const rc = ROLE_CONFIG[currentUser.role];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-white text-2xl font-bold">Profil Saya</h1>
        <p className="text-slate-400 text-sm mt-1">Kelola informasi akun Anda</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-slate-800/40 border border-white/5 rounded-2xl overflow-hidden"
      >
        {/* Header Banner */}
        <div className="h-24 bg-gradient-to-r from-blue-600/30 via-violet-600/20 to-blue-600/30 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10" />
        </div>

        {/* Avatar & Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="relative">
              <img
                src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl border-4 border-slate-800 bg-slate-700"
              />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${rc.color} border-2 border-slate-800`} />
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <h2 className="text-white font-bold text-xl">{currentUser.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-white text-xs font-medium ${rc.color}`}>{rc.label}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${currentUser.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                  {currentUser.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            </div>
            {!editing && (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl text-sm transition-colors"
              >
                <Edit2 size={14} />
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-slate-300 text-xs mb-1 block">Nama Lengkap</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input {...register('name', { required: true })}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-700/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-xs mb-1 block">No. Telepon</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input {...register('phone')}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-700/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-xs mb-1 block">Alamat</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-3 text-slate-500" />
                  <textarea {...register('address')} rows={2}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-700/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setEditing(false); reset(); }}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition-all"
                >
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? <><Loader2 size={14} className="animate-spin" />Menyimpan...</> : <><Save size={14} />Simpan</>}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {[
                { icon: Mail, label: 'Email', value: currentUser.email },
                { icon: Phone, label: 'Telepon', value: currentUser.phone || 'Belum diisi' },
                { icon: MapPin, label: 'Alamat', value: currentUser.address || 'Belum diisi' },
                { icon: Calendar, label: 'Bergabung', value: currentUser.createdAt },
                { icon: Shield, label: 'Role', value: rc.label },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
                  <item.icon size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-slate-500 text-xs">{item.label}</p>
                    <p className="text-slate-200 text-sm mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Loan Stats (for users) */}
      {currentUser.role === 'user' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-slate-800/40 border border-white/5 rounded-2xl p-5"
        >
          <h3 className="text-white font-semibold mb-4">Statistik Peminjaman</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Aktif', value: activeLoans, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Pending', value: pendingLoans, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Selesai', value: returnedLoans, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            ].map((s, i) => (
              <div key={i} className={`p-4 rounded-xl ${s.bg} text-center`}>
                <s.icon size={20} className={`${s.color} mx-auto mb-2`} />
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-slate-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-white/3 rounded-xl border border-white/5">
            <p className="text-slate-400 text-xs">Total peminjaman: <span className="text-white font-medium">{myLoans.length} buku</span></p>
          </div>
        </motion.div>
      )}

      {/* Security Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-slate-800/40 border border-white/5 rounded-2xl p-5"
      >
        <h3 className="text-white font-semibold mb-3">Keamanan Akun</h3>
        <div className="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5">
          <div>
            <p className="text-slate-300 text-sm">Password</p>
            <p className="text-slate-600 text-xs">Terakhir diubah: tidak diketahui</p>
          </div>
          <button
            onClick={() => toast.info('Fitur ubah password akan segera tersedia')}
            className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-xs font-medium"
          >
            Ubah Password
          </button>
        </div>
      </motion.div>
    </div>
  );
}
