import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import TeamManagement from "@/pages/TeamManagement";
import { TeamDetails } from "@/components/teams/TeamDetails";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import MassProgramming from "@/pages/MassProgramming";
import PlantManagement from "@/pages/PlantManagement";
import MassRequestManagement from "@/pages/MassRequestManagement";
import TruckEquipmentManagement from "@/pages/TruckEquipmentManagement";
import FleetManagement from "@/pages/FleetManagement";
import CostCenterManagement from "@/pages/CostCenterManagement";
import FunctionManagement from "@/pages/FunctionManagement";
import CompanyManagement from "@/pages/CompanyManagement";
import EmployeeManagement from "@/pages/EmployeeManagement";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teams" element={<TeamManagement />} />
            <Route path="/teams/:id" element={<TeamDetails />} />
            <Route path="/mass-programming" element={<MassProgramming />} />
            <Route path="/plants" element={<PlantManagement />} />
            <Route path="/mass-requests" element={<MassRequestManagement />} />
            <Route path="/trucks-equipment" element={<TruckEquipmentManagement />} />
            <Route path="/fleets" element={<FleetManagement />} />
            <Route path="/cost-centers" element={<CostCenterManagement />} />
            <Route path="/functions" element={<FunctionManagement />} />
            <Route path="/companies" element={<CompanyManagement />} />
            <Route path="/employees" element={<EmployeeManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;