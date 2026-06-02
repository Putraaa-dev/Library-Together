import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { PetugasDashboard } from '../components/dashboard/PetugasDashboard';
import { UserDashboard } from '../components/dashboard/UserDashboard';

export function DashboardPage() {
  const { currentUser } = useAuth();

  if (currentUser?.role === 'admin') return <AdminDashboard />;
  if (currentUser?.role === 'petugas') return <PetugasDashboard />;
  return <UserDashboard />;
}
