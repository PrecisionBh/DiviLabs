""// src/pages/ContractCreator/FinalReview.jsx
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

  const handleContinue = async () => {
    if (!acknowledged) {
      alert("❌ You must acknowledge the terms before continuing.");
      return;
    }

    const tokenInfo = JSON.parse(localStorage.getItem("divi_token_info")) || {};
    const tokenomics = JSON.parse(localStorage.getItem("divi_tokenomics")) || {};
    const advancedOptions = JSON.parse(localStorage.getItem("divi_advanced_options")) || {};
    const packageType = localStorage.getItem("divi_token_package") || "basic";

    const id = Date.now().toString();
    const data = {
      id,
      tokenInfo,
      tokenomics,
      advancedOptions,
      package: packageType,
      timestamp: Date.now(),
      wallet: localStorage.getItem("connected_wallet") || "unknown",
      code: generateContractCode(),
    };

    try {
      if (!window.ethereum) throw new Error("MetaMask not detected.");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      let cost = packageType.toLowerCase() === "advanced" ? 0.2 : 0.1;
      if (deployOption === "manual") cost += 0.5;

      const tx = await signer.sendTransaction({
        to: "0x8f9c1147b2c710F92BE65956fDE139351123d27E",
        value: ethers.parseEther(cost.toString()),
      });

      await tx.wait();
      localStorage.setItem("fee_tx_hash", tx.hash);
      storeContractLocally(data);
      setShowPopup(true);

      setTimeout(() => {
        if (deployOption === "manual") {
          navigate("/contract-creator/manual-deploy-form");
        } else {
          navigate("/contract-creator/success");
        }
      }, 1500);
    } catch (err) {
      alert("❌ Transaction rejected or failed.");
      console.error("Payment error:", err);
      setShowPopup(false);
    }
  };

  const packageType = localStorage.getItem("divi_token_package") || "Basic";
  const baseCost = packageType.toLowerCase() === "advanced" ? 0.2 : 0.1;
  const totalCost = deployOption === "manual" ? baseCost + 0.5 : baseCost;

  return (
    <div className="min-h-screen bg-[#060a13] text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-cyan-400 drop-shadow-[0_0_20px_#00e5ff] mb-4">
          Review & Confirm
        </h2>
      </div>

      <div className="w-full max-w-2xl bg-[#0e1016] border border-cyan-500 p-6 rounded-2xl shadow-[0_0_20px_#00e5ff40]">
        <p className="mb-2 text-cyan-200 text-md">
          <strong>Package:</strong> {packageType}
        </p>
        <p className="mb-6 text-cyan-200 text-md">
          <strong>Base Cost:</strong> {baseCost} BNB
        </p>

        <div className="mb-6 space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="download"
              checked={deployOption === "download"}
              onChange={() => setDeployOption("download")}
              className="w-5 h-5 text-cyan-500"
            />
            <span className="text-white">
              Only want the token file <span className="text-cyan-300">(No Extra Fee)</span>
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="manual"
              checked={deployOption === "manual"}
              onChange={() => setDeployOption("manual")}
              className="w-5 h-5 text-cyan-500"
            />
            <span className="text-white">
              I want Divi Labs to deploy and transfer ownership for <strong className="text-green-400">+0.5 BNB</strong>
            </span>
          </label>
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

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-xl transition"
          >
            Back
          </button>

          <button
            onClick={handleContinue}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded-xl shadow-[0_0_15px_#00e5ff] transition"
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
