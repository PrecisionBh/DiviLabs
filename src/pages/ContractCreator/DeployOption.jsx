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
    } else if (type === "auto") {
      navigate("/contract-creator/deploy");
    } else {
      alert("No deployment type selected.");
      navigate("/contract-creator/final-review");
    }
  };

  const feeDisplay = packageType === "advanced" ? "1.2 BNB" : "0.7 BNB";

  return (
    <div className="min-h-screen bg-[#060a13] text-white flex flex-col items-center justify-center px-6 py-16 text-center">
      <h2 className="text-4xl font-extrabold text-cyan-400 drop-shadow-[0_0_30px_#00e5ff] mb-4">
        Deploy Your Contract
      </h2>
      <p className="text-cyan-200 mb-8 max-w-md">
        You can choose to deploy directly to BNB Chain using MetaMask or download
        the Solidity code to deploy manually in Remix.
      </p>

      {/* Fees */}
      <div className="mb-6 text-cyan-300">
        <p className="mb-2">
          <strong>Auto Deploy:</strong> {feeDisplay} total<br />
          <span className="text-sm text-cyan-200">(includes 0.2 BNB deployment fee)</span>
        </p>
        <p>
          <strong>Manual Download:</strong> Free
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => handleOption("auto")}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-xl shadow-[0_0_15px_#00e5ff] transition"
        >
          Auto Deploy (MetaMask)
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
