import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import TeamManagement from "@/pages/TeamManagement";
import { TeamDetails } from "@/components/teams/TeamDetails";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import MassProgramming from "@/pages/MassProgramming";
import PlantManagement from "@/pages/PlantManagement";

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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;