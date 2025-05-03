\import React, { useEffect, useState } from "react";
import {
  BrowserProvider,
  Contract,
  formatEther
} from "ethers";

import DiviNodeOwnershipABI from "../../abis/DiviNodeOwnership.json";
import RewardDistributorABI from "../../abis/DiviNodeRewardDistributor.json";

import bullImg from "../../assets/Bull.jpeg";
import apeImg from "../../assets/Ape.jpeg";
import slothImg from "../../assets/Sloth.jpeg";

const NODE_OWNERSHIP_ADDRESS = "0xef2b50EDed0F3AF33470C2E9260954b574e4D375";
const REWARD_DISTRIBUTOR_ADDRESS = "0xCaA359c93E7ecD9C92486a03B5692A506BfFaFc2";

export default function ClaimDashboard() {
  const [ownedNodes, setOwnedNodes] = useState([]);
  const [rewards, setRewards] = useState({});
  const [account, setAccount] = useState("");
  const [totalRewards, setTotalRewards] = useState("0.0000");
  const [groupedByType, setGroupedByType] = useState({});

  useEffect(() => {
    loadNodeData();
  }, []);

  const loadNodeData = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required!");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    setAccount(userAddress);

    const nodeContract = new Contract(NODE_OWNERSHIP_ADDRESS, DiviNodeOwnershipABI, signer);
    const distributor = new Contract(REWARD_DISTRIBUTOR_ADDRESS, RewardDistributorABI, signer);

    try {
      const owned = await nodeContract.getOwnedNodes(userAddress); // returns array of nodeIds (uint256[])
      setOwnedNodes(owned);

      const rewardData = {};
      let total = 0;
      const grouped = { 0: [], 1: [], 2: [] };

      for (let i = 0; i < owned.length; i++) {
        const nodeId = owned[i];
        const reward = await distributor.nodeClaimableBNB(nodeId);
        const formatted = parseFloat(formatEther(reward));
        rewardData[nodeId] = formatted.toFixed(4);
        total += formatted;

        // Determine node type by ID range
        let type = 0;
        if (nodeId >= 0 && nodeId <= 9) type = 0; // Bull
        else if (nodeId >= 10 && nodeId <= 19) type = 1; // Ape
        else type = 2; // Sloth

        grouped[type].push({ index: nodeId, reward: formatted });
      }

      setGroupedByType(grouped);
      setRewards(rewardData);
      setTotalRewards(total.toFixed(4));
    } catch (err) {
      console.error("Error loading nodes:", err);
    }
  };

  const claimAllRewards = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const distributor = new Contract(REWARD_DISTRIBUTOR_ADDRESS, RewardDistributorABI, signer);

    try {
      const nodeIds = ownedNodes;
      const tx = await distributor.claimMultiple(nodeIds);
      await tx.wait();
      alert("All rewards claimed!");
      loadNodeData();
    } catch (err) {
      console.error("Claim All failed:", err);
      alert("Claim failed or cancelled.");
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
          Total Pending Rewards: <span className="text-white">{totalRewards} BNB</span>
        </h2>
        {ownedNodes.length > 0 && (
          <button
            onClick={claimAllRewards}
            className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg transition"
          >
            Claim All Rewards
          </button>
        )}
      </div>

      {/* Grouped Node Type Display */}
      <div className="max-w-4xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {[0, 1, 2].map((type) => {
          const nodes = groupedByType[type] || [];
          if (nodes.length === 0) return null;

          const label = getNodeLabel(type) + (nodes.length > 1 ? "s" : "");
          const totalByType = nodes.reduce((acc, n) => acc + n.reward, 0).toFixed(4);

          return (
            <div
              key={type}
              className="bg-[#0b0e15] border border-cyan-600 rounded-2xl p-4 shadow-[0_0_20px_#00e5ff40]"
            >
              <img
                src={getNodeImage(type)}
                alt={label}
                className="w-32 h-32 mx-auto object-contain rounded-xl mb-4"
              />
              <h3 className="text-xl text-cyan-300 font-bold">{nodes.length} {label}</h3>
              <p className="text-cyan-400 mt-2">
                {totalByType} BNB
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
