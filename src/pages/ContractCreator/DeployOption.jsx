// src/pages/ContractCreator/DeployOption.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { downloadContractZip } from "../../lib/ZipBuilder";

export default function DeployOption() {
  const navigate = useNavigate();
  const [packageType, setPackageType] = useState("basic");

  useEffect(() => {
    const selected = localStorage.getItem("divi_token_package") || "basic";
    setPackageType(selected);
  }, []);

  const handleOption = async (type) => {
    localStorage.setItem("deploy_type", type);

    if (type === "download") {
      await downloadContractZip();
      navigate("/contract-creator/success");
    } else if (type === "manual") {
      navigate("/contract-creator/manual-deploy-form");
    } else {
      alert("No deployment type selected.");
      navigate("/contract-creator/final-review");
    }
  };

  const feeDisplay = "1.0 BNB";

  return (
    <div className="min-h-screen bg-[#060a13] text-white flex flex-col items-center justify-center px-6 py-16 text-center">
      <h2 className="text-4xl font-extrabold text-cyan-400 drop-shadow-[0_0_30px_#00e5ff] mb-4">
        Deploy Your Contract
      </h2>
      <p className="text-cyan-200 mb-8 max-w-md">
        You can choose to have Divi Labs deploy your token for you or download
        the Solidity code to deploy it manually in Remix.
      </p>

      {/* Fees */}
      <div className="mb-6 text-cyan-300">
        <p className="mb-2">
          <strong>Divi Labs Manual Deploy:</strong> {feeDisplay}<br />
          <span className="text-sm text-cyan-200">(we deploy and transfer ownership)</span>
        </p>
        <p>
          <strong>Manual Download:</strong> Free
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => handleOption("manual")}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-xl shadow-[0_0_15px_#00e5ff] transition"
        >
          Divi Labs Deploy (1 BNB)
        </button>
        <button
          onClick={() => handleOption("download")}
          className="bg-[#1e1e2a] hover:bg-[#2c2c3a] text-white font-bold py-3 rounded-xl shadow-[0_0_10px_#00e5ff44] transition"
        >
          Manual Download (Remix / ZIP)
        </button>
      </div>
    </div>
  );
}
