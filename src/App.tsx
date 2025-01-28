import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TeamManagement } from "@/pages/TeamManagement";
import { TeamDetails } from "@/components/teams/TeamDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/teams" element={<TeamManagement />} />
          <Route path="/teams/:id" element={<TeamDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
