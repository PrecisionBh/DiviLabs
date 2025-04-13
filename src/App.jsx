import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import all your pages
import LandingPage from './pages/LandingPage';
import EcosystemHome from './pages/EcosystemHome';
import VaultLanding from './pages/vault/VaultLanding';
import ChainSelect from './pages/vault/ChainSelect';
import TokenTypeSelect from './pages/vault/TokenTypeSelect';
import LiquidityLock from './pages/vault/LiquidityLock';
import TeamTokenLock from './pages/vault/TeamTokenLock';
import PromoPage from './pages/vault/PromoPage'; // This is your promo page
import LoadingPage from './pages/vault/LoadingPage';
import VaultResultPage from './pages/vault/VaultResultPage';
import ConnectWalletButton from './components/ConnectWalletButton'; // Ensure this works

export default function App() {
  return (
    <Router> {/* Wrap the entire app with Router */}
      {/* Your global Connect Wallet Button */}
      <ConnectWalletButton />
      
      {/* Set up your Routes here */}
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/ecosystem" element={<EcosystemHome />} />

        {/* Vault Flow */}
        <Route path="/vault" element={<Navigate to="/vault/start" />} />
        <Route path="/vault/start" element={<VaultLanding />} />
        <Route path="/vault/chain" element={<ChainSelect />} />
        <Route path="/vault/type" element={<TokenTypeSelect />} />
        <Route path="/vault/liquidity" element={<LiquidityLock />} />
        <Route path="/vault/team" element={<TeamTokenLock />} />
        <Route path="/vault/promo" element={<PromoPage />} /> {/* Promo page */}
        <Route path="/vault/loading" element={<LoadingPage />} />
        <Route path="/vault/result" element={<VaultResultPage />} />
      </Routes>
    </Router>
  );
}
