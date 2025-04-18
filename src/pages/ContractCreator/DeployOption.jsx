// src/pages/ContractCreator/DeployPage.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { deployGeneratedContract } from "../../lib/Deployer";
import { generateContractCode } from "../../lib/ContractBuilder";
import { storeContractLocally } from "../../lib/ContractStorage";

export default function DeployPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Connecting to MetaMask...");
  const [txHash, setTxHash] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const deployToken = async () => {
      try {
        if (!window.ethereum) throw new Error("MetaMask not detected");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setStatus(`Connected: ${address}`);

        // Determine base cost from package
        const packageType = localStorage.getItem("divi_token_package") || "basic";
        const baseCost = packageType === "advanced" ? 0.2 : 0.1;
        const totalCost = baseCost;

        // 💰 Fee Payment
        setStatus("Waiting for payment confirmation...");

        const tx = await signer.sendTransaction({
          to: "0x8f9c1147b2c710F92BE65956fDE139351123d27E",
          value: ethers.parseEther(totalCost.toString()),
        });

        await tx.wait();
        setTxHash(tx.hash);
        localStorage.setItem("fee_tx_hash", tx.hash);

        // ✅ Deploy contract
        setStatus("Deploying contract to blockchain...");
        const { contractAddress } = await deployGeneratedContract(signer);
        setContractAddress(contractAddress);

        // 💾 Store on success
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
          wallet: address,
          code: generateContractCode(),
        });

        localStorage.setItem("deployed_contract_address", contractAddress);
        localStorage.setItem("deploy_type", "download");

        setStatus("Contract deployed successfully!");
        setTimeout(() => navigate("/contract-creator/success"), 3000);

      } catch (err) {
        console.error(err);
        if (err.code === 4001) {
          setError("❌ Transaction rejected by user.");
        } else {
          setError(err.message || "Deployment failed.");
        }
        setStatus("Deployment cancelled.");
      }
    };

    deployToken();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#060a13] text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center max-w-xl">
        <h2 className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_20px_#00e5ff] mb-4">Deploying Your Token</h2>
        <p className="text-cyan-200 mb-6">{status}</p>

        {txHash && (
          <p className="text-green-400 mb-2">
            ✅ Fee TX:{" "}
            <a
              href={`https://bscscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-green-300"
            >
              {txHash.slice(0, 10)}...
            </a>
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
          <div className="mt-6 text-red-400 text-md">
            {error}
            <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-5 rounded-xl shadow"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/ecosystem")}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-5 rounded-xl shadow"
              >
                ← Back to Ecosystem
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
