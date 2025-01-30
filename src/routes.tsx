import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import EmployeeManagement from "./pages/EmployeeManagement";
import CompanyManagement from "./pages/CompanyManagement";
import DepartmentManagement from "./pages/DepartmentManagement";
import FunctionManagement from "./pages/FunctionManagement";
import CostCenterManagement from "./pages/CostCenterManagement";
import FleetManagement from "./pages/FleetManagement";
import TruckEquipmentManagement from "./pages/TruckEquipmentManagement";
import PlantManagement from "./pages/PlantManagement";
import MassRequestManagement from "./pages/MassRequestManagement";
import MassRequestDetails from "./pages/MassRequestDetails";
import MassRequestEdit from "./pages/MassRequestEdit";
import MassProgramming from "./pages/MassProgramming";
import MassProgrammingDetails from "./pages/MassProgrammingDetails";
import TeamManagement from "./pages/TeamManagement";
import PermissionManagement from "./pages/PermissionManagement";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import InspectionChecklist from "./pages/InspectionChecklist";
import ChecklistList from "./pages/ChecklistList";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/teams" element={<TeamManagement />} />
        <Route path="/companies" element={<CompanyManagement />} />
        <Route path="/functions" element={<FunctionManagement />} />
        <Route path="/cost-centers" element={<CostCenterManagement />} />
        <Route path="/fleets" element={<FleetManagement />} />
        <Route path="/trucks-equipment" element={<TruckEquipmentManagement />} />
        <Route path="/plants" element={<PlantManagement />} />
        <Route path="/mass-requests" element={<MassRequestManagement />} />
        <Route path="/mass-requests/:id" element={<MassRequestDetails />} />
        <Route path="/mass-requests/:id/edit" element={<MassRequestEdit />} />
        <Route path="/mass-programming" element={<MassProgramming />} />
        <Route path="/mass-programming/:id" element={<MassProgrammingDetails />} />
        <Route path="/permissions" element={<PermissionManagement />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/inspection-checklist" element={<InspectionChecklist />} />
        <Route path="/checklist-list" element={<ChecklistList />} />
        <Route path="/inspection-checklist/:id" element={<InspectionChecklist />} />
        <Route path="/inspection-checklist/:id/edit" element={<InspectionChecklist />} />
      </Route>
    </Routes>
  );
}