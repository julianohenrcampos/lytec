import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="functions" element={<FunctionManagement />} />
            <Route path="cost-centers" element={<CostCenterManagement />} />
            <Route path="companies" element={<CompanyManagement />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;