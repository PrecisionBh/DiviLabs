// src/pages/ContractCreator/ContractCreatorPricing.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContractCreatorPricing() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (!selected) {
      alert("Please select a package before continuing.");
      return;
    }

    localStorage.setItem("divi_token_package", selected);
    navigate(
      selected === "advanced"
        ? "/contract-creator/advanced-options"
        : "/contract-creator/final-review"
    );
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white flex flex-col items-center px-6 py-12">
      <h2 className="text-4xl font-extrabold text-cyan-400 drop-shadow-[0_0_30px_#00e5ff] mb-10 text-center">
        Choose Your Contract Package
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Basic Card */}
        <div
          onClick={() => setSelected("basic")}
          className={`cursor-pointer p-6 rounded-2xl bg-[#0f1522] border-2 ${
            selected === "basic" ? "border-cyan-400 shadow-[0_0_40px_#00e5ff99]" : "border-white/10"
          } hover:border-cyan-500 transition-all duration-300`}
        >
          <h3 className="text-2xl font-bold text-cyan-300 mb-2">Basic Token</h3>
          <ul className="text-sm text-white/80 list-disc ml-5 space-y-1 mb-4">
            <li>Fixed buy/sell tax</li>
            <li>Renounced ownership (optional)</li>
            <li>Simple deploy-ready BEP-20</li>
            <li>No advanced features</li>
          </ul>
          <p className="text-cyan-400 font-semibold text-lg">0.5 BNB</p>
        </div>

        {/* Advanced Card */}
        <div
          onClick={() => setSelected("advanced")}
          className={`cursor-pointer p-6 rounded-2xl bg-[#0f1522] border-2 ${
            selected === "advanced" ? "border-cyan-400 shadow-[0_0_40px_#00e5ff99]" : "border-white/10"
          } hover:border-cyan-500 transition-all duration-300`}
        >
          <h3 className="text-2xl font-bold text-cyan-300 mb-2">Advanced Token</h3>
          <ul className="text-sm text-white/80 list-disc ml-5 space-y-1 mb-4">
            <li>Adjustable taxes</li>
            <li>Reflections system</li>
            <li>Anti-bot protection</li>
            <li>Max wallet / tx limits</li>
          </ul>
          <p className="text-cyan-400 font-semibold text-lg">1 BNB</p>
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="mt-10 bg-cyan-500 hover:bg-cyan-600 text-black py-3 px-6 rounded-xl font-bold shadow-[0_0_20px_#00e5ff] transition"
      >
        Continue
      </button>

      {/* Footer Note */}
      <p className="mt-6 text-sm text-cyan-200 text-center drop-shadow-[0_0_10px_#00e5ff80] max-w-xl">
        You can build your token and preview the contract before paying. Payment is only required during deployment.
      </p>
    </div>
  );
}
