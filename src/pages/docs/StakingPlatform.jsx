import React from "react";
import { Link } from "react-router-dom";

export default function StakingPlatform() {
  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          Divi Staking Platform
        </h1>
        <p className="text-cyan-200 mt-2 text-lg">
          Stake, earn, and fuel the Divi ecosystem.
        </p>
        <p className="text-cyan-400 mt-1 text-md font-semibold">
          🚧 Coming Soon!
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-[#0e1016] border border-cyan-500 rounded-2xl shadow-[0_0_40px_#00e5ff80] p-8 text-cyan-100 space-y-6">
        <p>
          The Divi Staking Platform will allow holders to stake their DIVI tokens
          and earn massive yields — powered by fees, token buybacks, and ecosystem utility.
        </p>

        <p>
          🔁 <strong>Buybacks:</strong> Revenue from contract deployments, audits, and vault locks will fuel recurring buybacks, boosting the staking pool.
        </p>

        <p>
          🌐 <strong>Multi-token Support:</strong> Other projects will be able to create staking pools using our platform, offering their own communities a trusted way to stake — all on Divi's infrastructure.
        </p>

        <p>
          💎 <strong>Zero-code Setup:</strong> Projects won't need to build anything. Just plug into the Divi Staking Platform, configure their pool, and go live.
        </p>

        <p className="italic text-cyan-300 pt-2 border-t border-cyan-800">
          Whether you're a DIVI holder or a project team — staking with Divi is about to get a whole lot better.
        </p>
      </div>

      <div className="flex justify-center mt-10">
        <Link to="/docs">
          <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg transition">
            ← Back to Docs
          </button>
        </Link>
      </div>
    </div>
  );
}
