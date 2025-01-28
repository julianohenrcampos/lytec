import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useAuth } from "./hooks/useAuth";
import { DashboardLayout } from "./components/layout/DashboardLayout";
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
import TeamManagement from "./pages/TeamManagement";
import FleetManagement from "./pages/FleetManagement";
import TruckEquipmentManagement from "./pages/TruckEquipmentManagement";
import PlantManagement from "./pages/PlantManagement";
import MassRequestManagement from "./pages/MassRequestManagement";
import MassRequestDetails from "./pages/MassRequestDetails";
import MassProgramming from "./pages/MassProgramming";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Index />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
      <Route path="/reset-password" element={user ? <Navigate to="/dashboard" replace /> : <ResetPassword />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><EmployeeManagement /></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute><DepartmentManagement /></ProtectedRoute>} />
      <Route path="/functions" element={<ProtectedRoute><FunctionManagement /></ProtectedRoute>} />
      <Route path="/cost-centers" element={<ProtectedRoute><CostCenterManagement /></ProtectedRoute>} />
      <Route path="/companies" element={<ProtectedRoute><CompanyManagement /></ProtectedRoute>} />
      <Route path="/teams" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
      <Route path="/fleets" element={<ProtectedRoute><FleetManagement /></ProtectedRoute>} />
      <Route path="/trucks-equipment" element={<ProtectedRoute><TruckEquipmentManagement /></ProtectedRoute>} />
      <Route path="/plants" element={<ProtectedRoute><PlantManagement /></ProtectedRoute>} />
      <Route path="/mass-requests" element={<ProtectedRoute><MassRequestManagement /></ProtectedRoute>} />
      <Route path="/mass-requests/:id" element={<ProtectedRoute><MassRequestDetails /></ProtectedRoute>} />
      <Route path="/mass-programming" element={<ProtectedRoute><MassProgramming /></ProtectedRoute>} />
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