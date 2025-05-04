import React, { useEffect, useState } from "react";
import { useWallet } from "../../context/WalletContext";
import { ethers } from "ethers";
import DiviNodeOwnershipABI from "../../abis/DiviNodeOwnership.json";
import { useNavigate } from "react-router-dom";

import bullImg from "../../assets/Bull.jpeg";
import apeImg from "../../assets/Ape.jpeg";
import slothImg from "../../assets/Sloth.jpeg";

const NODE_CONTRACT_ADDRESS = "0xef2b50EDed0F3AF33470C2E9260954b574e4D375";
const DEPLOYER_ADDRESS = "0x8f9c1147b2c710f92be65956fde139351123d27e";

const tierInfo = {
  Bull: { start: 0, end: 9, price: "2.75" },
  Ape: { start: 10, end: 19, price: "1.75" },
  Sloth: { start: 20, end: 29, price: "0.75" },
};

const nodes = [
  {
    type: "Bull Node",
    tier: "Bull",
    image: bullImg,
    reward: "50% of all node rewards",
    quote: "The apex predator of passive income. Own the charge.",
  },
  {
    type: "Ape Node",
    tier: "Ape",
    image: apeImg,
    reward: "35% of all node rewards",
    quote: "Strong hands. Banana dreams. Mid-tier yield, max-tier vibes.",
  },
  {
    type: "Sloth Node",
    tier: "Sloth",
    image: slothImg,
    reward: "15% of all node rewards",
    quote: "Why hustle when you can coast? Earn while you nap.",
  },
];

// 🔄 Spinner Component
const Spinner = () => (
  <div className="w-6 h-6 border-4 border-white border-t-cyan-400 rounded-full animate-spin mx-auto" />
);

export default function BuyNodes() {
  const { walletAddress } = useWallet();
  const [showSuccess, setShowSuccess] = useState(false);
  const [nodesLeft, setNodesLeft] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const waitForEthereumAndFetch = async () => {
      if (typeof window.ethereum === "undefined") return;
      await fetchNodesLeft();
    };

    waitForEthereumAndFetch();
  }, []);

  const fetchNodesLeft = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        NODE_CONTRACT_ADDRESS,
        DiviNodeOwnershipABI,
        provider
      );

      const updated = {};
      for (const [tier, { start, end }] of Object.entries(tierInfo)) {
        let count = 0;
        for (let id = start; id <= end; id++) {
          const [, owner, isOwned] = await contract.getNode(id);
          if (owner.toLowerCase() === DEPLOYER_ADDRESS && isOwned === false) {
            count++;
          }
        }
        updated[tier] = count;
      }

      setNodesLeft(updated);
    } catch (err) {
      console.error("Error fetching nodes left:", err);
    }
  };

  const getAvailableNodeId = async (start, end, contract) => {
    for (let id = start; id <= end; id++) {
      try {
        const [, owner, isOwned] = await contract.getNode(id);
        if (owner.toLowerCase() === DEPLOYER_ADDRESS && isOwned === false) {
          return id;
        }
      } catch (err) {
        console.error(`Error checking node ${id}:`, err);
      }
    }
    throw new Error("All nodes sold out in this tier");
  };

  const handleBuy = async (tier) => {
    if (!walletAddress) return alert("Please connect wallet first.");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        NODE_CONTRACT_ADDRESS,
        DiviNodeOwnershipABI,
        signer
      );

      const { start, end, price } = tierInfo[tier];
      const availableNodeId = await getAvailableNodeId(start, end, contract);

      const tx = await contract.buyNode(availableNodeId, {
        value: ethers.parseEther(price),
      });
      await tx.wait();

      setShowSuccess(true);
      await fetchNodesLeft();
      setTimeout(() => navigate("/nodes/claim"), 2000);
    } catch (err) {
      console.error("Buy failed:", err);
      alert("Transaction failed or all nodes in this tier are sold.");
    }
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          Buy a Divi Node
        </h1>
        <p className="text-cyan-200 mt-2 text-lg max-w-xl mx-auto">
          Only 30 nodes will ever exist. Own a slice of every transaction.
        </p>
        <button
          onClick={() => navigate("/nodes/claim")}
          className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg transition"
        >
          Go to My Node
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {nodes.map((node, index) => (
          <div
            key={index}
            className="bg-[#0e1016] border border-cyan-500 rounded-2xl p-6 shadow-[0_0_30px_#00e5ff60] hover:shadow-[0_0_40px_#00e5ff80] transition text-center"
          >
            <img
              src={node.image}
              alt={node.type}
              className="w-full h-80 object-contain rounded-xl mb-4"
            />
            <h2 className="text-2xl font-bold text-cyan-300 mb-2">
              {node.type}
            </h2>
            <p className="text-cyan-200 font-semibold">
              {tierInfo[node.tier].price} BNB
            </p>
            <p className="text-cyan-400 mt-2 italic">{node.reward}</p>
            <p className="text-cyan-500 mt-4 text-sm">{node.quote}</p>
            <p className="mt-2 text-cyan-300 font-bold">
              {!nodesLeft ? (
                <Spinner />
              ) : (
                `${nodesLeft[node.tier]} Left`
              )}
            </p>
            <button
              className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg transition"
              onClick={() => handleBuy(node.tier)}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {showSuccess && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#000000bb] z-50">
          <div className="bg-[#0e1016] border border-cyan-500 rounded-2xl p-10 shadow-[0_0_40px_#00e5ff] text-center text-white max-w-md">
            <h2 className="text-2xl font-bold text-cyan-300">
              🎉 Congratulations!
            </h2>
            <p className="mt-4 text-cyan-100">
              You are now part owner of Divi!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
