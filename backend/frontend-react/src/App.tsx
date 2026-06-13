import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Login from './pages/Login';
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import { Navbar } from './components/Navbar';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();

  // Jika tidak ada token, paksa pindah ke laman login (gue aja ga punya lama login)
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Jika ada Token, izinkan melihat laman
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      {children}
    </div>
  );
};

function App() {
  return (

    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/login" element={<Login />} />

          <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
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
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>

  );
}

export default App;