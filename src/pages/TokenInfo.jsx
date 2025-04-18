import { useNavigate } from "react-router-dom";
import React from "react";
import CountdownBox from "../components/CountdownBox";

export default function TokenInfo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12 flex flex-col items-center">
      {/* 🔥 Countdown Timer */}
      <CountdownBox />

      <div className="text-center mb-10 mt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          Divi Tokenomics
        </h1>
        <p className="text-cyan-200 mt-2 text-lg">
          Fair-launched, protected, and built to grow with you.
        </p>
        <p className="text-cyan-400 mt-1 text-md font-semibold">
          🚀 Launch Date: <span className="italic text-white">June 1st 3pm Est</span>
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-[#0e1016] rounded-2xl border border-cyan-500 p-8 shadow-[0_0_40px_#00e5ff80] space-y-8">
        {/* Token Basics */}
        <div className="space-y-2">
          <h2 className="text-cyan-300 text-xl font-bold">Token Details</h2>
          <p><strong>Token Type:</strong> BEP-20 (Binance Smart Chain)</p>
          <p><strong>Contract Address:</strong> <span className="italic text-cyan-200">Coming Soon!</span></p>
          <p>
            <strong>Swap Available On:</strong> Divi Dashboard or{" "}
            <a
              href="https://pancakeswap.finance/swap?outputCurrency=0xB5623308Cc34691233B7FfB1940da5f524AB36CB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline hover:text-cyan-200"
            >
              PancakeSwap
            </a>
          </p>
        </div>

        {/* Token Supply */}
        <div className="space-y-2">
          <h2 className="text-cyan-300 text-xl font-bold">Total Supply</h2>
          <p>1,000,000 DIVI</p>
        </div>

        {/* Tax Structure */}
        <div className="space-y-4">
          <h2 className="text-cyan-300 text-xl font-bold">Tax Structure</h2>

          <div>
            <p className="font-semibold text-white">Base Buy/Sell Tax: 6%</p>
            <ul className="list-disc ml-6 text-sm text-cyan-100">
              <li>3% Marketing / Development</li>
              <li>2% Auto Liquidity</li>
              <li>1% Reflections to Holders</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white">High Sell Tax: 15%</p>
            <p className="text-sm text-cyan-100 mb-1">Triggered on any sell ≥ 0.25% of the total supply</p>
            <ul className="list-disc ml-6 text-sm text-orange-300">
              <li>4% Marketing</li>
              <li>3% Liquidity</li>
              <li>8% Reflections</li>
            </ul>
          </div>

          <div className="mt-3 text-sm text-cyan-200 italic border-t border-cyan-800 pt-3">
            <span className="font-semibold text-cyan-300">Future Note:</span> As the Divi ecosystem grows and generates
            more revenue through utility and services, the need for marketing tax will decrease — allowing
            a greater portion of the tax to be shifted toward holder reflections and liquidity rewards.
          </div>
        </div>

        {/* Limits */}
        <div className="space-y-2">
          <h2 className="text-cyan-300 text-xl font-bold">Limits</h2>
          <p><strong>Max Wallet:</strong> 2.5% of supply</p>
          <p><strong>Max Transaction:</strong> 0.5% of supply</p>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h2 className="text-cyan-300 text-xl font-bold">Protection & Utility</h2>
          <ul className="list-disc ml-6 text-sm space-y-1 text-cyan-100">
            <li>Bot protection and auto-blacklisting</li>
            <li>Cooldown between transactions</li>
            <li>Fully locked liquidity</li>
            <li>Live reflections tracking on dashboard</li>
            <li>No presales, team tokens, or VC allocations</li>
          </ul>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-12">
        <button
          onClick={() => navigate("/ecosystem")}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow-lg transition"
        >
          ← Back to Ecosystem
        </button>
      </div>
    </div>
  );
}
