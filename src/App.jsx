import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHome from "./AppHome";
import Register from "./Registration";
import VerifyTicket from "./VerifyTicket";
import OrganizerLogin from "./OrganizerLogin";
import OrganizerDashboard from "./OrganizerDashboard";
import AnalyticsDashboard from "./AnalyticsDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppHome />} />

        <Route path="/register" element={<Register />} />

        <Route path="/verify" element={<VerifyTicket />} />

        <Route
          path="/organizer-login"
          element={<OrganizerLogin />}
        />

        <Route
          path="/organizer-dashboard"
          element={<OrganizerDashboard />}
        />

        <Route
          path="/analytics"
          element={<AnalyticsDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
