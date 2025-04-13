import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";

export default function VaultLanding() {
  const navigate = useNavigate();
  const { walletAddress, connectWallet } = useWallet();

  const handleStartLock = async () => {
    if (!walletAddress) {
      await connectWallet();
      return;
    }
    navigate("/vault/chain");
  };

  const handleClaimLock = async () => {
    if (!walletAddress) {
      await connectWallet();
      return;
    }
    navigate("/vault/claim");
  };

  return (
    <div className="min-h-screen bg-[#070B17] text-[#00E5FF] px-6 py-12 flex flex-col items-center justify-center space-y-10">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Divi Vault</h1>
        <p className="text-[#B0C4DE] text-lg max-w-xl mx-auto">
          Locking your tokens ensures trust, stability, and long-term commitment to your community. With Divi Vault, you can securely lock liquidity or vest team tokens — all backed by blockchain verification and NFT-proof transparency.
        </p>
      </div>

      <div className="text-center mt-12 text-sm text-[#C2E9F9]">
        Page 1 of 9 — Vault Process Begins Here.
      </div>

      {/* Start Lock Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStartLock}
        className="mt-10 px-8 py-3 bg-[#00E5FF] text-black font-semibold rounded-full shadow-[0_0_15px_#00E5FF] hover:shadow-[0_0_25px_#00E5FF] transition-all"
      >
        {walletAddress ? "Start Lock" : "Connect Wallet"}
      </motion.button>

      {/* Claim Lock Glowing Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleClaimLock}
        className="mt-4 px-10 py-3 bg-[#0f1929] text-[#00E5FF] font-extrabold rounded-full shadow-[0_0_25px_#00E5FF] hover:shadow-[0_0_45px_#00E5FF] border border-[#00E5FF] transition-all animate-pulse"
      >
        🔓 Claim Your Lock
      </motion.button>
    </div>
  );
}
