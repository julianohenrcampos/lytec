import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MassRequestManagement from "./pages/MassRequestManagement";
import MassRequestEdit from "./pages/MassRequestEdit";
import MassRequestDetails from "./pages/MassRequestDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MassRequestManagement />} />
        <Route path="/mass-requests" element={<MassRequestManagement />} />
        <Route path="/mass-requests/:id/edit" element={<MassRequestEdit />} />
        <Route path="/mass-requests/:id" element={<MassRequestDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
