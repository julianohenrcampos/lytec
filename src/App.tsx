import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import EmployeeManagement from "./pages/EmployeeManagement";
import DepartmentManagement from "./pages/DepartmentManagement";
import FunctionManagement from "./pages/FunctionManagement";
import CostCenterManagement from "./pages/CostCenterManagement";
import CompanyManagement from "./pages/CompanyManagement";
import { useAuth } from "./hooks/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><EmployeeManagement /></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute><DepartmentManagement /></ProtectedRoute>} />
      <Route path="/functions" element={<ProtectedRoute><FunctionManagement /></ProtectedRoute>} />
      <Route path="/cost-centers" element={<ProtectedRoute><CostCenterManagement /></ProtectedRoute>} />
      <Route path="/companies" element={<ProtectedRoute><CompanyManagement /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;