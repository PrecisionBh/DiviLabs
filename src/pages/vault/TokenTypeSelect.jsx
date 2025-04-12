import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import ConnectWalletButton from '../../components/ConnectWalletButton';
import { motion } from 'framer-motion';

export default function TokenTypeSelect() {
  const { walletAddress, connectWallet } = useWallet();
  const navigate = useNavigate();

  const handleSelect = (path) => {
    if (!walletAddress) {
      alert('Please connect your wallet first.');
      return;
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0c0f1a] text-white px-4 py-12 relative">
      <ConnectWalletButton />

      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-cyan-400 drop-shadow-lg mb-6">
          What Type of Token Are You Locking?
        </h1>
        <p className="text-lg text-gray-300 mb-12">
          Choose the lock type that fits your project goals.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full max-w-xs px-8 py-6 bg-[#111827] border border-cyan-500 rounded-2xl text-cyan-300 font-bold text-lg shadow-lg hover:shadow-cyan-500/40 transition text-center"
            onClick={() => handleSelect("/vault/liquidity")}
          >
            Liquidity Pair
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full max-w-xs px-8 py-6 bg-[#111827] border border-cyan-500 rounded-2xl text-cyan-300 font-bold text-lg shadow-lg hover:shadow-cyan-500/40 transition text-center"
            onClick={() => handleSelect("/vault/team")}
          >
            Team Tokens
          </motion.button>
        </div>
      </div>
    </div>
  );
}
