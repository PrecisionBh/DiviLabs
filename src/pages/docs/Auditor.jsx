import React from "react";
import { Link } from "react-router-dom";

export default function Auditor() {
  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          Divi Auditor Docs
        </h1>
        <p className="text-cyan-200 mt-2 text-lg">
          Get your smart contract professionally reviewed and unlock trust-driven growth.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-[#0e1016] rounded-2xl border border-cyan-500 p-8 shadow-[0_0_40px_#00e5ff80] space-y-6">
        {/* Overview */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">🔍 What is the Divi Auditor?</h2>
          <p>
            The Divi Auditor is a transparent contract analysis system designed to detect hidden risks, protect investors, 
            and give developers a chance to showcase clean, safe, and fair contract logic. Every audit is reviewed by experts — 
            not just auto-checks — and all results are made public.
          </p>
        </div>

        {/* Protection Focus */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">🛡️ Why Audits Matter</h2>
          <ul className="list-disc ml-6 text-sm text-cyan-100 space-y-1">
            <li>Detect hidden backdoors, mint functions, and owner-only exploits</li>
            <li>Expose unsafe tax manipulation, liquidity drain logic, or rug risks</li>
            <li>Help investors identify safe and honest contracts instantly</li>
            <li>Ensure fairness by removing any functions that harm holders</li>
          </ul>
        </div>

        {/* Growth & Credibility */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">🚀 Fuel Project Growth</h2>
          <p>
            A Divi audit is more than just a safety check — it’s a credibility badge. Projects that pass with flying colors 
            gain instant trust with potential buyers, investors, and communities. It shows your devs have nothing to hide and 
            everything to prove. Use it to:
          </p>
          <ul className="list-disc ml-6 text-sm text-cyan-100 space-y-1 mt-2">
            <li>Promote confidently with a transparent, verifiable audit link</li>
            <li>Stand out from unverified tokens and sketchy launches</li>
            <li>Get listed or promoted in Divi partner communities</li>
          </ul>
        </div>

        {/* What You Get */}
        <div>
          <h2 className="text-cyan-300 text-xl font-bold">📋 What's Included in the Audit</h2>
          <ul className="list-disc ml-6 text-sm text-cyan-100 space-y-1">
            <li>Backdoor and malicious code scan</li>
            <li>Check for unsafe owner-only functions</li>
            <li>Evaluation of tax logic, limits, and liquidity control</li>
            <li>Score based on decentralization, transparency, and trust</li>
            <li>Public report — no hidden audits or paid rankings</li>
          </ul>
        </div>

        {/* Final Note */}
        <div className="text-sm text-cyan-200 italic border-t border-cyan-800 pt-3">
          <span className="font-semibold text-cyan-300">Reminder:</span> Divi audits cannot be purchased. If your contract fails, 
          it will be shown — plain and simple. We’re here to protect the community and highlight projects built the right way.
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
