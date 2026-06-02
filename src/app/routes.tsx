import { createBrowserRouter, Navigate } from 'react-router';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CatalogPage } from './pages/CatalogPage';
import { MyLoansPage } from './pages/MyLoansPage';
import { ManageBooksPage } from './pages/ManageBooksPage';
import { ManageLoansPage } from './pages/ManageLoansPage';
import { ManageUsersPage } from './pages/ManageUsersPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'my-loans', element: <MyLoansPage /> },
      { path: 'manage-books', element: <ManageBooksPage /> },
      { path: 'manage-loans', element: <ManageLoansPage /> },
      { path: 'manage-users', element: <ManageUsersPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
