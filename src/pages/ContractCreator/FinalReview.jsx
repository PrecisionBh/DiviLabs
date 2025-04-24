// src/pages/ContractCreator/FinalReview.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storeContractLocally } from "../../lib/ContractStorage";
import { generateContractCode } from "../../lib/ContractBuilder";
import { ethers } from "ethers";

export default function FinalReview() {
  const navigate = useNavigate();
  const [acknowledged, setAcknowledged] = useState(false);
  const [deployOption, setDeployOption] = useState("download");
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    setError("");

    if (!acknowledged) {
      alert("❌ You must acknowledge the terms before continuing.");
      return;
    }

    try {
      if (!window.ethereum) throw new Error("MetaMask not detected.");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const packageType = localStorage.getItem("divi_token_package") || "basic";
      const baseCost = packageType.toLowerCase() === "advanced" ? 0.2 : 0.1;
      const totalCost = deployOption === "manual" ? baseCost + 0.5 : baseCost;

      const tx = await signer.sendTransaction({
        to: "0x8f9c1147b2c710F92BE65956fDE139351123d27E",
        value: ethers.parseEther(totalCost.toString()),
      });

      await tx.wait();
      localStorage.setItem("fee_tx_hash", tx.hash);

      // ✅ Save the contract after payment
      const tokenInfo = JSON.parse(localStorage.getItem("divi_token_info")) || {};
      const tokenomics = JSON.parse(localStorage.getItem("divi_tokenomics")) || {};
      const advancedOptions = JSON.parse(localStorage.getItem("divi_advanced_options")) || {};
      const id = Date.now().toString();

      storeContractLocally({
        id,
        tokenInfo,
        tokenomics,
        advancedOptions,
        package: packageType,
        timestamp: Date.now(),
        wallet: localStorage.getItem("connected_wallet") || "unknown",
        code: generateContractCode(),
      });

      localStorage.setItem("last_contract_id", id);
      setShowPopup(true);

      // ✅ Delay before routing
      setTimeout(() => {
        if (deployOption === "manual") {
          navigate("/contract-creator/manual-deploy-form");
        } else {
          navigate("/contract-creator/success"); // 🔥 fix this line
        }
      }, 1500);
      
    } catch (err) {
      console.error("Payment error:", err);
      setError("❌ Payment rejected or failed. Please try again.");
    }
  };

  const packageType = localStorage.getItem("divi_token_package") || "basic";
  const baseCost = packageType.toLowerCase() === "advanced" ? 0.2 : 0.1;
  const totalCost = deployOption === "manual" ? baseCost + 0.5 : baseCost;

  return (
    <div className="min-h-screen bg-[#060a13] text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-cyan-400 drop-shadow mb-4">Review & Confirm</h2>
        <p className="text-cyan-300">A small payment is required to proceed with token creation.</p>
      </div>

      <div className="w-full max-w-2xl bg-[#0e1016] border border-cyan-500 p-6 rounded-2xl shadow">
        <p className="mb-2 text-cyan-200 text-md">
          <strong>Package:</strong> {packageType}
        </p>
        <p className="mb-6 text-cyan-200 text-md">
          <strong>Base Cost:</strong> {baseCost} BNB
        </p>

        <div className="mb-6 space-y-4">
          <RadioOption
            value="download"
            label="Only want the token file"
            subLabel="(No Extra Fee)"
            checked={deployOption === "download"}
            onChange={setDeployOption}
          />
          <RadioOption
            value="manual"
            label="Divi Labs will deploy & transfer ownership"
            subLabel="+0.5 BNB"
            checked={deployOption === "manual"}
            onChange={setDeployOption}
          />
        </div>

        <p className="mt-4 mb-4 text-cyan-300 text-lg font-semibold">
          Total: {totalCost} BNB
        </p>

        <label className="flex items-center mt-6 space-x-3 text-red-400 text-sm">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={() => setAcknowledged(!acknowledged)}
            className="w-4 h-4"
          />
          <span>
            I understand that once payment is made, my token code will be generated and cannot be changed.
          </span>
        </label>

        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-xl transition"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded-xl shadow transition"
          >
            Continue
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed top-6 bg-green-600 text-black px-6 py-3 rounded-xl shadow-lg font-semibold text-md transition">
          ✅ Contract saved locally
        </div>
      )}
    </div>
  );
}

function RadioOption({ value, label, subLabel, checked, onChange }) {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="w-5 h-5 text-cyan-500"
      />
      <span className="text-white">
        {label} <span className="text-cyan-300">{subLabel}</span>
      </span>
    </label>
  );
}
