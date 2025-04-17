import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Main Pages
import LandingPage from './pages/LandingPage';
import EcosystemHome from './pages/EcosystemHome';
import DiviDashboard from './pages/DiviDashboard';
import TokenInfo from './pages/TokenInfo';
import ConnectWalletButton from './components/ConnectWalletButton';

// Vault Pages
import VaultLanding from './pages/vault/VaultLanding';
import ChainSelect from './pages/vault/ChainSelect';
import TokenTypeSelect from './pages/vault/TokenTypeSelect';
import LiquidityLock from './pages/vault/LiquidityLock';
import TeamTokenLock from './pages/vault/TeamTokenLock';
import PromoPage from './pages/vault/PromoPage';
import LoadingPage from './pages/vault/LoadingPage';
import VaultResultPage from './pages/vault/VaultResultPage';
import ClaimPage from './pages/vault/ClaimPage';

// Docs Pages
import DocsPage from './pages/docs/DocsPage';
import VaultDocs from './pages/docs/VaultDocs';
import ContractCreator from './pages/docs/ContractCreator';
import Auditor from './pages/docs/Auditor';
import StakingPlatform from './pages/docs/StakingPlatform';

// Contract Creator Wizard Pages
import ContractCreatorLanding from './pages/ContractCreator/ContractCreatorLanding';
import TokenDetails from './pages/ContractCreator/TokenDetails';
import Tokenomics from './pages/ContractCreator/Tokenomics';
import ContractCreatorPricing from './pages/ContractCreator/ContractCreatorPricing';
import AdvancedOptions from './pages/ContractCreator/AdvancedOptions';
import FinalReview from './pages/ContractCreator/FinalReview';
import DeploySuccess from './pages/ContractCreator/DeploySuccess';
import ManualDeployForm from './pages/ContractCreator/ManualDeployForm';
import MyContracts from './pages/ContractCreator/MyContracts';

export default function App() {
  return (
    <Router>
      <ConnectWalletButton />
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/ecosystem" element={<EcosystemHome />} />
        <Route path="/dashboard" element={<DiviDashboard />} />
        <Route path="/token-info" element={<TokenInfo />} />

        {/* Vault Flow */}
        <Route path="/vault" element={<Navigate to="/vault/start" />} />
        <Route path="/vault/start" element={<VaultLanding />} />
        <Route path="/vault/chain" element={<ChainSelect />} />
        <Route path="/vault/type" element={<TokenTypeSelect />} />
        <Route path="/vault/liquidity" element={<LiquidityLock />} />
        <Route path="/vault/team" element={<TeamTokenLock />} />
        <Route path="/vault/promo" element={<PromoPage />} />
        <Route path="/vault/loading" element={<LoadingPage />} />
        <Route path="/vault/result" element={<VaultResultPage />} />
        <Route path="/vault/claim" element={<ClaimPage />} />

        {/* Docs Section */}
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/vault" element={<VaultDocs />} />
        <Route path="/docs/contract-creator" element={<ContractCreator />} />
        <Route path="/docs/auditor" element={<Auditor />} />
        <Route path="/docs/staking" element={<StakingPlatform />} />

        {/* Contract Creator Wizard */}
        <Route path="/contract-creator" element={<ContractCreatorLanding />} />
        <Route path="/contract-creator/token-details" element={<TokenDetails />} />
        <Route path="/contract-creator/tokenomics" element={<Tokenomics />} />
        <Route path="/contract-creator/pricing" element={<ContractCreatorPricing />} />
        <Route path="/contract-creator/advanced-options" element={<AdvancedOptions />} />
        <Route path="/contract-creator/final-review" element={<FinalReview />} />
        <Route path="/contract-creator/success" element={<DeploySuccess />} />
        <Route path="/contract-creator/manual-deploy-form" element={<ManualDeployForm />} />

        {/* Created Contracts */}
        <Route path="/my-contracts" element={<MyContracts />} />
      </Routes>
    </Router>
  );
}
