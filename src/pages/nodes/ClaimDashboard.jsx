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
  const [ownedNodeIds, setOwnedNodeIds] = useState([]);
  const [rewards, setRewards] = useState({});
  const [account, setAccount] = useState("");
  const [totalRewards, setTotalRewards] = useState("0.0000");
  const [groupedNodes, setGroupedNodes] = useState({ bull: [], ape: [], sloth: [] });

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
      const ownedIds = await nodeContract.getOwnedNodes(userAddress); // [0, 11, 24...]
      setOwnedNodeIds(ownedIds);

      const rewardData = {};
      let total = 0;
      const grouped = { bull: [], ape: [], sloth: [] };

      for (let id of ownedIds) {
        const reward = await distributor.nodeClaimableBNB(id);
        const formatted = parseFloat(formatEther(reward));
        rewardData[id] = formatted.toFixed(4);
        total += formatted;

        if (id < 10) grouped.bull.push({ id, reward: formatted });
        else if (id < 20) grouped.ape.push({ id, reward: formatted });
        else if (id < 30) grouped.sloth.push({ id, reward: formatted });
      }

      setGroupedNodes(grouped);
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
      const tx = await distributor.claimMultiple(ownedNodeIds);
      await tx.wait();
      alert("All rewards claimed!");
      loadNodeData();
    } catch (err) {
      console.error("Claim failed:", err);
      alert("Claim failed or cancelled.");
    }
  };

  const getNodeImage = (id) => {
    if (id < 10) return bullImg;
    if (id < 20) return apeImg;
    return slothImg;
  };

  const getNodeLabel = (id) => {
    if (id < 10) return "Bull Node";
    if (id < 20) return "Ape Node";
    return "Sloth Node";
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
        {ownedNodeIds.length > 0 && (
          <button
            onClick={claimAllRewards}
            className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg transition"
          >
            Claim All Rewards
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {ownedNodeIds.map((id) => (
          <div
            key={id}
            className="bg-[#0b0e15] border border-cyan-600 rounded-2xl p-4 shadow-[0_0_20px_#00e5ff40] text-center"
          >
            <img
              src={getNodeImage(id)}
              alt={getNodeLabel(id)}
              className="w-32 h-32 mx-auto object-contain rounded-xl mb-4"
            />
            <h3 className="text-lg font-bold text-cyan-300">{getNodeLabel(id)} #{id}</h3>
            <p className="text-cyan-400">{rewards[id]} BNB</p>
          </div>
        ))}
      </div>
    </div>
  );
}
