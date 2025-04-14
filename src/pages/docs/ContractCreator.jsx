import React from "react";
import { Link } from "react-router-dom";

export default function ContractCreator() {
  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          Divi Contract Creator
        </h1>
        <p className="text-cyan-200 mt-2 text-lg max-w-2xl mx-auto">
          Launch a professional ERC-20 token without writing a single line of code.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-[#0e1016] rounded-2xl border border-cyan-500 p-8 shadow-[0_0_40px_#00e5ff80] space-y-8">

        {/* Intro */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">🧪 What is the Contract Creator?</h2>
          <p>
            Divi's Contract Creator allows anyone — even without coding knowledge — to build a secure, customizable ERC-20 token.
            Just fill out a simple form and click deploy. We'll handle the rest.
          </p>
        </div>

        {/* Key Features */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">⚙️ Key Features</h2>
          <ul className="list-disc ml-6 text-sm text-cyan-100 space-y-1">
            <li>Generate a full ERC-20 token with your token name, symbol, and supply</li>
            <li>Optional taxes: add reflections, auto liquidity, marketing, buybacks, etc.</li>
            <li>Anti-bot, cooldowns, max wallet, and other protections built-in</li>
            <li>Choose your options with easy checkboxes — no code, no confusion</li>
            <li>Auto-formatted code available for download and deployment</li>
            <li>Professional launch templates available</li>
          </ul>
        </div>

        {/* How it Works */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">🛠️ How Does It Work?</h2>
          <p className="text-cyan-100 text-sm mt-2">
            The creator guides you step-by-step through naming your token, choosing features, setting limits, and finally launching.
            You’ll be able to:
          </p>
          <ul className="list-disc ml-6 text-sm text-cyan-100 space-y-1 mt-2">
            <li>Pick your token name, symbol, decimals, and supply</li>
            <li>Enable optional modules like tax routing, reflections, etc.</li>
            <li>Preview the full contract</li>
            <li>Launch it straight to the blockchain or export the code</li>
          </ul>
        </div>

        {/* Who it's for */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">👥 Who should use this?</h2>
          <p>
            Whether you're launching your first meme token, a serious DeFi protocol, or just experimenting — this tool gives you
            pro-level control with no dev team required.
          </p>
        </div>
      </div>

      {/* Back Button */}
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
