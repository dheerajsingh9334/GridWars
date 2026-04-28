import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Play from '@/pages/Play';
import History from '@/pages/History';
import NotFound from '@/pages/NotFound';

const App = () => (
  <AuthProvider>
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'hsl(230 22% 9%)',
          color: 'hsl(210 40% 98%)',
          border: '1px solid hsl(230 20% 16%)',
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: '12px',
        },
      }}
    />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/play"
          element={
            <ProtectedRoute>
              <Play />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
