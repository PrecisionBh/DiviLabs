import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { downloadContractZip } from "../../lib/ZipBuilder";
import { generateContractCode } from "../../lib/ContractBuilder";

export default function DeploySuccess() {
  const navigate = useNavigate();
  const [deployType, setDeployType] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [feeTxHash, setFeeTxHash] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [contractCode, setContractCode] = useState("");

  useEffect(() => {
    setDeployType(localStorage.getItem("deploy_type"));
    setContractAddress(localStorage.getItem("deployed_contract_address"));
    setFeeTxHash(localStorage.getItem("fee_tx_hash"));
  }, []);

  return (
    <div className="min-h-screen bg-[#060a13] text-white flex flex-col items-center justify-center px-4 py-16">

      {/* 🟡 Message Above Box */}
      <p className="text-yellow-300 text-center text-base sm:text-lg mb-6 max-w-2xl px-4">
        💾 If you ever need to redownload this contract, visit the{" "}
        <Link to="/my-contracts" className="underline text-cyan-400 hover:text-cyan-300">
          My Contracts
        </Link>{" "}
        page from the Contract Creator welcome screen.
      </p>

      {/* 🌌 Glow Box */}
      <div className="w-full max-w-2xl bg-[#111827] border border-cyan-500 rounded-2xl shadow-[0_0_40px_#00e5ff55] px-6 sm:px-10 py-10 space-y-8 text-center">

        {/* ✅ Success Header */}
        <h2 className="text-4xl font-extrabold text-cyan-400 drop-shadow-[0_0_30px_#00e5ff]">
          Success!
        </h2>

        {/* 📜 Deploy Info */}
        {deployType === "auto" && contractAddress ? (
          <>
            <p className="text-lg text-cyan-100">
              Your token has been deployed successfully.
            </p>
            <p className="text-green-400 text-md">
              <strong>Contract Address:</strong><br />
              <a
                href={`https://bscscan.com/address/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-green-300"
              >
                {contractAddress}
              </a>
            </p>
            {feeTxHash && (
              <p className="text-green-400 text-md">
                <strong>Fee TX:</strong><br />
                <a
                  href={`https://bscscan.com/tx/${feeTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-green-300"
                >
                  {feeTxHash}
                </a>
              </p>
            )}
          </>
        ) : (
          <p className="text-lg text-cyan-100">
            Your contract has been downloaded successfully. You can deploy it manually using Remix or Hardhat.
          </p>
        )}

        {/* 🔘 Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
          <button
            onClick={downloadContractZip}
            className="w-full sm:w-auto px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-md transition shadow-[0_0_20px_#00e5ff]"
          >
            Download Your File
          </button>

          <button
            onClick={() => {
              setContractCode(generateContractCode());
              setShowCode(true);
            }}
            className="w-full sm:w-auto px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-md transition shadow-[0_0_20px_#00e5ff]"
          >
            Preview Contract Code
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0">
          <a
            href="https://remix.ethereum.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-md transition shadow-[0_0_20px_#00e5ff]"
          >
            Open Remix IDE
          </a>

          <button
            onClick={() => navigate("/ecosystem")}
            className="w-full sm:w-auto px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-md transition shadow-[0_0_20px_#00e5ff]"
          >
            Return to Ecosystem
          </button>
        </div>
      </div>

      {/* 🔍 Code Preview Modal */}
      {showCode && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 p-6 flex flex-col items-center justify-center">
          <div className="bg-[#0e1016] border border-cyan-500 p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto text-left text-sm text-cyan-200 whitespace-pre-wrap relative">
            <button
              onClick={() => setShowCode(false)}
              className="absolute top-2 right-4 text-red-400 font-bold text-xl"
            >
              ✕
            </button>
            <code>{contractCode}</code>
          </div>
        </div>
      )}
    </div>
  );
}
