import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import nodeOwnershipAbi from "../../abis/DiviNodeOwnership.json";

const NODE_CONTRACT = "0xef2b50EDed0F3AF33470C2E9260954b574e4D375";

export default function NodeDashboard() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [nodeDetails, setNodeDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWallet();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      fetchNodes();
    }
  }, [walletAddress]);

  const checkWallet = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
    }
  };

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(NODE_CONTRACT, nodeOwnershipAbi, signer);
      const ownedIds = await contract.getOwnedNodes(walletAddress);

      const details = await Promise.all(
        ownedIds.map(async (id) => {
          const node = await contract.getNode(id);
          return {
            id: id.toString(),
            type: ["Bull", "Ape", "Sloth"][node[0]],
            owner: node[1],
            isOwned: node[2],
          };
        })
      );

      setNodeDetails(details);
    } catch (err) {
      console.error("Error fetching nodes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          Divi Node Dashboard
        </h1>
        <p className="text-cyan-200 mt-2 text-lg max-w-xl mx-auto">
          View your owned nodes and claim your rewards.
        </p>

        {/* Main Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
          <a
            href="/nodes/buy"
            className="w-52 text-center px-6 py-4 bg-[#0e1016] text-cyan-300 font-bold border border-cyan-400 rounded-2xl shadow-[0_0_30px_#00e5ff60] hover:shadow-[0_0_40px_#00e5ff80] transition"
          >
            Buy Nodes
          </a>
          <a
            href="/nodes/claim"
            className="w-52 text-center px-6 py-4 bg-[#0e1016] text-cyan-300 font-bold border border-cyan-400 rounded-2xl shadow-[0_0_30px_#00e5ff60] hover:shadow-[0_0_40px_#00e5ff80] transition"
          >
            Claim My Rewards
          </a>
        </div>

        {/* Back Link */}
        <div className="mt-4">
          <a
            href="/ecosystem"
            className="text-cyan-400 hover:text-cyan-300 text-sm underline"
          >
            ← Back to Ecosystem
          </a>
        </div>

        {/* Glowing Info Box */}
        <div className="mt-10 bg-[#0e1016] text-cyan-300 text-md border border-cyan-500 px-6 py-4 max-w-2xl mx-auto rounded-xl shadow-[0_0_30px_#00e5ff40] text-center">
          Only 30 nodes will ever be minted. Each node you own earns a portion of every transaction for life. True passive income.
        </div>
      </div>
    </div>
  );
}
