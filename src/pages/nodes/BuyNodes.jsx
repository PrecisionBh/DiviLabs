import React, { useState } from "react";
import {
  BrowserProvider,
  Contract,
  parseEther
} from "ethers";

import DiviNodeOwnershipABI from "../../abis/DiviNodeOwnership.json";

import bullImg from "../../assets/Bull.jpeg";
import apeImg from "../../assets/Ape.jpeg";
import slothImg from "../../assets/Sloth.jpeg";

const NODE_CONTRACT_ADDRESS = "0xef2b50EDed0F3AF33470C2E9260954b574e4D375";

const nodes = [
  {
    type: "Bull Node",
    image: bullImg,
    bnb: "2.75 BNB",
    reward: "50% of all node rewards",
    quote: "The apex predator of passive income. Own the charge.",
    nodeId: 0,
  },
  {
    type: "Ape Node",
    image: apeImg,
    bnb: "1.75 BNB",
    reward: "35% of all node rewards",
    quote: "Strong hands. Banana dreams. Mid-tier yield, max-tier vibes.",
    nodeId: 1,
  },
  {
    type: "Sloth Node",
    image: slothImg,
    bnb: "0.75 BNB",
    reward: "15% of all node rewards",
    quote: "Why hustle when you can coast? Earn while you nap.",
    nodeId: 2,
  },
];

export default function BuyNodes() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12 relative">
      {/* ✅ Success Modal */}
      {showSuccess && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#0e1016] border border-cyan-400 text-center rounded-2xl px-8 py-10 shadow-[0_0_45px_#00e5ff] animate-pulse">
            <h2 className="text-3xl font-extrabold text-cyan-400 mb-4">
              🎉 Congratulations!
            </h2>
            <p className="text-white text-lg">
              You are now part owner of <span className="text-cyan-300 font-bold">Divi</span>!
            </p>
          </div>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          Buy a Divi Node
        </h1>
        <p className="text-cyan-200 mt-2 text-lg max-w-xl mx-auto">
          Only 30 nodes will ever exist. Own a slice of every transaction.
        </p>
        <button
          className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg transition"
          onClick={() => window.location.href = "/nodes/claim"}
        >
          Go to My Node
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {nodes.map((node, index) => (
          <div
            key={index}
            className="bg-[#0e1016] border border-cyan-500 rounded-2xl p-6 shadow-[0_0_30px_#00e5ff60] hover:shadow-[0_0_40px_#00e5ff80] transition text-center flex flex-col justify-between"
          >
            <div>
              <img
                src={node.image}
                alt={node.type}
                className="w-full h-64 object-contain bg-black rounded-xl mb-4"
              />
              <h2 className="text-2xl font-bold text-cyan-300 mb-2">{node.type}</h2>
              <p className="text-cyan-200 font-semibold">{node.bnb}</p>
              <p className="text-cyan-400 mt-2 italic">{node.reward}</p>
              <p className="text-cyan-500 mt-4 text-sm">{node.quote}</p>
            </div>
            <button
              className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg transition"
              onClick={() => handleBuy(node.nodeId, setShowSuccess)}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

async function handleBuy(nodeId, setShowSuccess) {
  if (!window.ethereum) {
    alert("MetaMask is required!");
    return;
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new Contract(NODE_CONTRACT_ADDRESS, DiviNodeOwnershipABI, signer);

  let value;
  if (nodeId === 0) value = parseEther("2.75");
  else if (nodeId === 1) value = parseEther("1.75");
  else value = parseEther("0.75");

  try {
    const tx = await contract.buyNode(nodeId, { value });
    await tx.wait();

    setShowSuccess(true);
    setTimeout(() => {
      window.location.href = "/nodes/claim";
    }, 3000);
  } catch (err) {
    console.error("Buy failed:", err);
    alert("Transaction failed or cancelled.");
  }
}
