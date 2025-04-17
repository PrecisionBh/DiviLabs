// src/pages/ContractCreator/DeployPage.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { deployGeneratedContract } from "../../lib/Deployer"; // ✅ Corrected path

export default function DeployPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Connecting to MetaMask...");
  const [txHash, setTxHash] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const deployToken = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("MetaMask not detected.");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setStatus(`Connected: ${address}`);

        // 🚧 Skip fee logic (for test only)
        const fakeHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
        setStatus("Skipping fee payment for test...");
        localStorage.setItem("fee_tx_hash", fakeHash);
        setTxHash(fakeHash);

        // ✅ Compile and deploy contract
        setStatus("Deploying contract to blockchain...");
        const { contractAddress } = await deployGeneratedContract(signer);
        setContractAddress(contractAddress);

        // 🎯 Save for success page
        localStorage.setItem("deployed_contract_address", contractAddress);
        localStorage.setItem("deploy_type", "auto");

        setStatus("Contract deployed successfully!");
        setTimeout(() => navigate("/contract-creator/success"), 3000);
      } catch (err) {
        console.error(err);
        setError(err.message || "Deployment failed.");
        setStatus("Deployment failed.");
      }
    };

    deployToken();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#060a13] text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center max-w-xl">
        <h2 className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_20px_#00e5ff] mb-4">
          Deploying Your Token
        </h2>
        <p className="text-cyan-200 mb-6">{status}</p>

        {txHash && (
          <p className="text-green-400 mb-2">
            ✅ Fee TX (skipped):{" "}
            <span className="underline text-green-300">{txHash.slice(0, 10)}...</span>
          </p>
        )}

        {contractAddress && (
          <p className="text-green-400 text-lg mt-2">
            ✅ Contract Deployed:{" "}
            <a
              href={`https://bscscan.com/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-green-300"
            >
              {contractAddress}
            </a>
          </p>
        )}

        {error && (
          <div className="mt-6 text-center">
            <p className="text-red-400 text-md mb-4">❌ {error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-5 rounded-xl shadow-[0_0_10px_#00e5ff] transition"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/contract-creator")}
                className="bg-[#1e1e2a] hover:bg-[#2c2c3a] text-white font-bold py-2 px-5 rounded-xl shadow-[0_0_10px_#00e5ff44] transition"
              >
                Back to Start
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
