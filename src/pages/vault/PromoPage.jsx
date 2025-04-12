import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PromoPage() {
  const [withNFT, setWithNFT] = useState(false);
  const navigate = useNavigate();

  const totalCost = withNFT ? 1.0 : 0.25;

  const handleConfirm = () => {
    navigate("/vault/loading");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0c0f1a] text-white px-4 py-12 flex flex-col items-center space-y-12">
      <h1 className="text-4xl font-extrabold text-cyan-400 drop-shadow-lg">Promote Your Lock</h1>
      <p className="text-lg text-center text-gray-300 max-w-xl">
        Mint a glowing NFT card to showcase your lock across the Divi ecosystem. Your lock will
        appear publicly with a visual badge of authenticity.
      </p>

      <div className="bg-[#111827] border border-cyan-500 rounded-2xl px-8 py-6 w-full max-w-xl space-y-6 shadow-xl">
        <label className="flex items-center space-x-4 text-cyan-200 font-semibold">
          <input
            type="checkbox"
            checked={withNFT}
            onChange={() => setWithNFT(!withNFT)}
            className="w-5 h-5 accent-cyan-500"
          />
          <span>Mint Promotional NFT (+0.75 BNB)</span>
        </label>

        <div className="text-lg font-bold text-cyan-300">
          Estimated Total Fee: <span className="text-white">{totalCost.toFixed(2)} BNB</span>
        </div>

        <div className="text-sm text-orange-300 font-medium">
          ⚠️ Once you confirm, your tokens will be locked permanently until the unlock date. This
          action cannot be undone.
        </div>

        <button
          onClick={handleConfirm}
          className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg transition"
        >
          Confirm & Approve Lock
        </button>
      </div>

      {/* NFT Example Preview */}
      <div className="mt-4 text-center">
        <p className="text-cyan-300 mb-4 font-semibold text-xl">Example Promotion NFT</p>

        <div className="relative w-[330px] md:w-[360px] rounded-2xl overflow-hidden border-2 border-cyan-500 shadow-[0_0_20px_#00e5ff80] bg-black">
          <img
            src="https://w3s.link/ipfs/bafybeiagaaxs3ljdlqaz4deipb6e6y3rimkrri7zbvdum6zisffiqjdf7a"
            alt="Divi Vault NFT"
            className="w-full h-[450px] object-cover opacity-95"
          />
        </div>
      </div>
    </div>
  );
}
