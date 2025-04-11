import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EcosystemHome from "./pages/EcosystemHome";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/ecosystem" />} />
        <Route path="/ecosystem" element={<EcosystemHome />} />
        {/* We'll add /dashboard, /vault, /creator etc here next */}
      </Routes>
    </Router>
  );
}
