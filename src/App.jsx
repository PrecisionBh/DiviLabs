import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import EcosystemHome from "./pages/EcosystemHome";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ecosystem" element={<EcosystemHome />} />
      </Routes>
    </Router>
  );
}
