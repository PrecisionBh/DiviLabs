import React from "react";
import { Link } from "react-router-dom";

export default function VaultDocs() {
  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          What is Divi Vault?
        </h1>
        <p className="text-cyan-200 mt-2 text-lg">
          A simple way to lock your tokens and prove your project is secure.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-[#0e1016] rounded-2xl border border-cyan-500 p-8 shadow-[0_0_40px_#00e5ff80] space-y-8">
        {/* What is it */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">🔒 What is Divi Vault?</h2>
          <p>
            Divi Vault is a secure system that lets developers lock their liquidity and team tokens. This helps build trust
            with investors by showing they can’t just run off with the funds.
          </p>
        </div>

        {/* What can be locked */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">🧩 What can be locked?</h2>
          <ul className="list-disc ml-6 text-cyan-100 text-sm space-y-1">
            <li><strong>Liquidity Pairs:</strong> Lock LP tokens to prove the project's liquidity is safe.</li>
            <li><strong>Team Tokens:</strong> Lock tokens given to your team, with optional vesting periods.</li>
          </ul>
        </div>

        {/* Why it's important */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">🚨 Why does locking matter?</h2>
          <p>
            When tokens are locked in Divi Vault, it shows your project is legit and here to stay. No one can take the tokens
            out until the time you set is up — and it’s all verifiable on-chain.
          </p>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">⚙️ Key Features</h2>
          <ul className="list-disc ml-6 text-sm text-cyan-100 space-y-1">
            <li>100% on-chain proof of lock</li>
            <li>Promotional NFT cards for public visibility</li>
            <li>Supports BNB Chain (with more chains coming soon)</li>
            <li>Emergency unlock option (requires a fee and delay)</li>
            <li>Optional vesting schedules for team tokens</li>
            <li>Multi-sig unlock support</li>
          </ul>
        </div>

        {/* Cost */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">💰 What does it cost?</h2>
          <ul className="list-disc ml-6 text-cyan-100 text-sm space-y-1">
            <li>Base Fee: 0.25 BNB per lock</li>
            <li>+0.1 BNB per vesting checkpoint</li>
            <li>+0.1 BNB per added team member (for multi-sig unlocks)</li>
            <li>+0.75 BNB to mint a promotional NFT</li>
          </ul>
        </div>

        {/* Who it's for */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">👥 Who should use Divi Vault?</h2>
          <p>
            Any developer or project team that wants to build trust and show the community they’re serious. Whether you're launching
            your first token or preparing for a presale — locking with Divi Vault gives instant credibility.
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-10">
        <Link to="/ecosystem">
          <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg transition">
            ← Back to Ecosystem
          </button>
        </Link>
      </div>
    </div>
  );
}
