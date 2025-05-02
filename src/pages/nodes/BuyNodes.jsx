import React from "react";
import bullImg from "../../assets/Bull.jpeg";
import apeImg from "../../assets/Ape.jpeg";
import slothImg from "../../assets/Sloth.jpeg";

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
  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      {/* Section Title */}
      <div className="text-center mb-6">
        <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          Become a Node Owner. Earn Like a Founder.
        </h2>
      </div>

      {/* Description Box */}
      <div className="max-w-4xl mx-auto mb-16 bg-[#0b0e15] border border-cyan-600 rounded-2xl p-6 shadow-[0_0_30px_#00e5ff40] text-cyan-200 text-lg text-center leading-relaxed">
        When you become a node owner, you're not just earning passive income — 
        <span className="text-white font-semibold"> you're claiming lifetime ownership in the Divi token economy.</span> 
        1% of every transaction is distributed to node holders based on tier. Own one node or own them all — 
        <span className="text-white"> only 30 will ever exist</span>, and all rewards are paid in BNB. Forever.
      </div>

      {/* Node Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {nodes.map((node, index) => (
          <div
            key={index}
            className="bg-[#0e1016] border border-cyan-500 rounded-2xl p-6 shadow-[0_0_30px_#00e5ff60] hover:shadow-[0_0_40px_#00e5ff80] transition flex flex-col justify-between text-center h-full"
          >
            <div>
              <img
                src={node.image}
                alt={node.type}
                className="mx-auto w-full h-64 object-contain rounded-xl mb-4"
              />
              <h2 className="text-2xl font-bold text-cyan-300 mb-2">{node.type}</h2>
              <p className="text-cyan-200 font-semibold">{node.bnb}</p>
              <p className="text-cyan-400 mt-2 italic">{node.reward}</p>
              <p className="text-cyan-500 mt-4 text-sm">{node.quote}</p>
            </div>
            <button
              className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg transition"
              onClick={() => handleBuy(node.nodeId)}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {/* Math Breakdown Section */}
      <div className="mt-16 text-center max-w-3xl mx-auto bg-[#0b0e15] border border-cyan-600 rounded-2xl p-8 shadow-[0_0_30px_#00e5ff50]">
        <h3 className="text-2xl font-bold text-cyan-300 mb-4">BNB Reward Breakdown Example</h3>
        <p className="text-cyan-200 mb-6">
          Based on $5,000,000 in trading volume with a 1% node tax (50 BNB total):
        </p>
        <div className="flex flex-col items-center gap-2 text-cyan-400">
          <p>
            🐂 <span className="font-semibold">Bull Node:</span> 50% share = <span className="text-white">25 BNB</span> / 10 nodes → <span className="text-white">2.5 BNB per node</span>
          </p>
          <p>
            🦍 <span className="font-semibold">Ape Node:</span> 35% share = <span className="text-white">17.5 BNB</span> / 10 nodes → <span className="text-white">1.75 BNB per node</span>
          </p>
          <p>
            🦥 <span className="font-semibold">Sloth Node:</span> 15% share = <span className="text-white">7.5 BNB</span> / 10 nodes → <span className="text-white">0.75 BNB per node</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function handleBuy(nodeId) {
  // Replace with actual contract integration
  alert(`Trigger buyNode(${nodeId})`);
}
