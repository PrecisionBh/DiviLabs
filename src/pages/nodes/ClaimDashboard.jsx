import React, { useEffect, useState } from "react";
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
  const [groupedByType, setGroupedByType] = useState({ 0: [], 1: [], 2: [] });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    loadNodeData();
  }, []);

  const loadNodeData = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required!");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAccount(userAddress);

      const nodeContract = new Contract(NODE_OWNERSHIP_ADDRESS, DiviNodeOwnershipABI, signer);
      const distributor = new Contract(REWARD_DISTRIBUTOR_ADDRESS, RewardDistributorABI, signer);

      const rawOwned = await nodeContract.getOwnedNodes(userAddress);
      const owned = rawOwned.map(n => Number(n));
      setOwnedNodes(owned);

      const rewardData = {};
      let total = 0;
      const grouped = { 0: [], 1: [], 2: [] };

      for (let i = 0; i < owned.length; i++) {
        const nodeIndex = owned[i];

        // Get node type from the ownership contract
        const [nodeTypeRaw] = await nodeContract.getNode(nodeIndex);
        const nodeType = Number(nodeTypeRaw);

        // Get claimable BNB for this node
        const reward = await distributor.nodeClaimableBNB(nodeIndex);
        const formatted = parseFloat(formatEther(reward));
        rewardData[`${nodeType}-${nodeIndex}`] = formatted.toFixed(4);
        total += formatted;

        if (grouped[nodeType]) {
          grouped[nodeType].push({ index: nodeIndex, reward: formatted });
        }
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
      const nodeIds = ownedNodes.map(index => index);
      const tx = await distributor.claimMultiple(nodeIds);
      await tx.wait();
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
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

  const countNodes = (type) => groupedByType[type]?.length || 0;

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-4 drop-shadow-[0_0_25px_#00e5ff]">
        Claim Your BNB Rewards
      </h1>

      <p className="text-center text-cyan-200 mb-4">
        Wallet: <span className="text-white font-mono">{account}</span>
      </p>

      <h2 className="text-center text-2xl font-semibold text-cyan-300 mb-2">
        Total Pending Rewards: <span className="text-white">{totalRewards} BNB</span>
      </h2>

      {(countNodes(0) + countNodes(1) + countNodes(2)) > 0 && (
        <p className="text-center text-cyan-400 mb-6">
          You own:
          {countNodes(0) > 0 && ` ${countNodes(0)} Bull Node${countNodes(0) > 1 ? 's' : ''}`}
          {countNodes(1) > 0 && `, ${countNodes(1)} Ape Node${countNodes(1) > 1 ? 's' : ''}`}
          {countNodes(2) > 0 && `, ${countNodes(2)} Sloth Node${countNodes(2) > 1 ? 's' : ''}`}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {[0, 1, 2].map((type) => {
          const nodes = groupedByType[type] || [];
          if (nodes.length === 0) return null;

          const totalByType = nodes.reduce((acc, n) => acc + n.reward, 0).toFixed(4);

          return (
            <div
              key={type}
              className="bg-[#0b0e15] border border-cyan-600 rounded-2xl p-6 shadow-[0_0_20px_#00e5ff40] text-center w-64"
            >
              <img
                src={getNodeImage(type)}
                alt={getNodeLabel(type)}
                className="w-48 h-48 mx-auto object-contain rounded-xl mb-4"
              />
              <h3 className="text-xl text-cyan-300 font-bold">
                {nodes.length} {getNodeLabel(type)}{nodes.length > 1 ? "s" : ""}
              </h3>
              <p className="text-cyan-400 mt-2">{totalByType} BNB</p>
            </div>
          );
        })}
      </div>

      {ownedNodes.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={claimAllRewards}
            className="mt-4 px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-lg rounded-xl shadow-lg transition drop-shadow-[0_0_20px_#00e5ff]"
          >
            Claim All Rewards
          </button>
        </div>
      )}

      {showPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-80 text-cyan-400 text-2xl font-bold px-10 py-6 rounded-2xl shadow-[0_0_30px_#00e5ff] z-50">
          ✅ Congratulations! You just claimed your BNB rewards!
        </div>
      )}
    </div>
  );
}
