import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </LibraryProvider>
    </AuthProvider>
  );
}
