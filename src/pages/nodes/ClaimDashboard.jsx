import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatEther } from "ethers";

import DiviNodeOwnershipABI from "../../abis/DiviNodeOwnership.json";
import RewardDistributorABI from "../../abis/DiviNodeRewardDistributor.json";

import bullImg from "../../assets/Bull.jpeg";
import apeImg from "../../assets/Ape.jpeg";
import slothImg from "../../assets/Sloth.jpeg";

const NODE_OWNERSHIP_ADDRESS = "0xef2b50EDed0F3AF33470C2E9260954b574e4D375";
const REWARD_DISTRIBUTOR_ADDRESS = "0xCaA359c93E7ecD9C92486a03B5692A506BfFaFc2";

export default function ClaimDashboard() {
  const [account, setAccount] = useState("");
  const [grouped, setGrouped] = useState({ 0: [], 1: [], 2: [] });
  const [totalRewards, setTotalRewards] = useState("0.0000");

  useEffect(() => {
    loadNodes();
  }, []);

  const loadNodes = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);

    const nodeContract = new Contract(NODE_OWNERSHIP_ADDRESS, DiviNodeOwnershipABI, signer);
    const rewardContract = new Contract(REWARD_DISTRIBUTOR_ADDRESS, RewardDistributorABI, signer);

    try {
      const owned = await nodeContract.getOwnedNodes(address); // [10, 11, 22, ...]
      const nodeMap = { 0: [], 1: [], 2: [] };
      let total = 0;

      for (let i = 0; i < owned.length; i++) {
        const nodeId = owned[i];
        const [type] = await nodeContract.getNode(nodeId);
        const reward = await rewardContract.nodeClaimableBNB(nodeId);
        const formatted = parseFloat(formatEther(reward));

        nodeMap[type].push({ id: nodeId, reward: formatted });
        total += formatted;
      }

      setGrouped(nodeMap);
      setTotalRewards(total.toFixed(4));
    } catch (err) {
      console.error("Error loading node data:", err);
    }
  };

  const claimAll = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const rewardContract = new Contract(REWARD_DISTRIBUTOR_ADDRESS, RewardDistributorABI, signer);

    const allNodeIds = [...grouped[0], ...grouped[1], ...grouped[2]].map(n => n.id);

    try {
      const tx = await rewardContract.claimMultiple(allNodeIds);
      await tx.wait();
      alert("BNB claimed!");
      loadNodes();
    } catch (err) {
      console.error("Claim failed:", err);
      alert("Claim failed or was rejected.");
    }
  };

  const getNodeLabel = (type) => {
    if (type === 0) return "Bull Node";
    if (type === 1) return "Ape Node";
    return "Sloth Node";
  };

  const getNodeImage = (type) => {
    if (type === 0) return bullImg;
    if (type === 1) return apeImg;
    return slothImg;
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-6 drop-shadow-[0_0_25px_#00e5ff]">
        Claim Your BNB Rewards
      </h1>

      <p className="text-center text-cyan-200 mb-6">
        Wallet: <span className="text-white font-mono">{account}</span>
      </p>

      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
          Total Pending Rewards:{" "}
          <span className="text-white">{totalRewards} BNB</span>
        </h2>
        {totalRewards > 0 && (
          <button
            onClick={claimAll}
            className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg transition"
          >
            Claim All Rewards
          </button>
        )}
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[0, 1, 2].map((type) => {
          const nodes = grouped[type];
          if (nodes.length === 0) return null;

          const total = nodes.reduce((sum, n) => sum + n.reward, 0).toFixed(4);
          return (
            <div
              key={type}
              className="bg-[#0b0e15] border border-cyan-600 rounded-2xl p-6 text-center shadow-[0_0_20px_#00e5ff40]"
            >
              <img
                src={getNodeImage(type)}
                alt={getNodeLabel(type)}
                className="w-32 h-32 mx-auto rounded-lg mb-4 object-contain"
              />
              <h3 className="text-xl font-bold text-cyan-300">
                {nodes.length} {getNodeLabel(type)}{nodes.length > 1 ? "s" : ""}
              </h3>
              <p className="text-cyan-400 mt-2">{total} BNB</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
