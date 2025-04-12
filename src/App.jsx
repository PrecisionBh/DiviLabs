import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import EcosystemHome from "./pages/EcosystemHome";
import VaultLanding from "./pages/vault/VaultLanding";
import ChainSelect from "./pages/vault/ChainSelect";
import TokenTypeSelect from "./pages/vault/TokenTypeSelect";
import LiquidityLock from "./pages/vault/LiquidityLock";
import TeamTokenLock from "./pages/vault/TeamTokenLock";
import PromoPage from "./pages/vault/PromoPage";
import LoadingPage from "./pages/vault/LoadingPage";
import VaultResultPage from "./pages/vault/VaultResultPage";
import ConnectWalletButton from "./components/ConnectWalletButton";

export default function App() {
  return (
    <Router>
      <ConnectWalletButton />
      <Routes>
        {/* 🌐 Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/ecosystem" element={<EcosystemHome />} />

        {/* 🔐 Vault Flow */}
        <Route path="/vault" element={<Navigate to="/vault/start" />} />
        <Route path="/vault/start" element={<VaultLanding />} />
        <Route path="/vault/chain" element={<ChainSelect />} />
        <Route path="/vault/type" element={<TokenTypeSelect />} />
        <Route path="/vault/liquidity" element={<LiquidityLock />} />
        <Route path="/vault/team" element={<TeamTokenLock />} /> {/* ✅ NEW */}
        <Route path="/vault/promo" element={<PromoPage />} />
        <Route path="/vault/loading" element={<LoadingPage />} />
        <Route path="/vault/result" element={<VaultResultPage />} />
      </Routes>
    </Router>
  );
}
