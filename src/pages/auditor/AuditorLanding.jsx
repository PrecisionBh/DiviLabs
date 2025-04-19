import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuditorLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#060a13] text-white flex flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff] mb-4">
        Divi Token Auditor
      </h1>
      <p className="text-cyan-200 max-w-xl mx-auto mb-10">
        Instantly check your token or request a full verified audit and earn your badge.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10 z-10">
        <button
          onClick={() => navigate("/auditor/prelaunch")}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_#00e5ff] transition w-64"
        >
          Pre Launch Audit (Free)
        </button>
        <button
          onClick={() => navigate("/auditor/verified")}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_#00e5ff] transition w-64"
        >
          Verified Audit (0.1 BNB)
        </button>
      </div>

      {/* ✅ View Public Audits Button */}
      <button
        onClick={() => navigate("/auditor/results")}
        className="mb-10 bg-[#1e293b] hover:bg-[#2c3e50] text-white font-bold py-3 px-6 rounded-xl border border-cyan-500 shadow-[0_0_12px_#00e5ff66] transition w-64"
      >
        🔍 View Public Audits
      </button>

      {/* Audit Explanation Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mt-6 z-10 w-full px-4">
        {/* Pre Launch Audit Box */}
        <div className="bg-[#0e1016] border border-cyan-800 rounded-xl p-5 shadow-[0_0_20px_#00e5ff30]">
          <h3 className="text-cyan-300 font-bold text-lg mb-2 flex items-center gap-2">
            🔎 Pre Launch Audit
          </h3>
          <p className="text-cyan-100 text-sm leading-relaxed">
            Checks your contract for high-risk patterns, hidden functions, and missing security measures — all in under a minute.
          </p>
        </div>

        {/* Verified Audit Box */}
        <div className="bg-[#0e1016] border border-blue-800 rounded-xl p-5 shadow-[0_0_20px_#00e5ff30]">
          <h3 className="text-cyan-300 font-bold text-lg mb-2 flex items-center gap-2">
            🛡️ Verified Audit
          </h3>
          <p className="text-cyan-100 text-sm leading-relaxed">
            Includes full line-by-line analysis, a transparent score breakdown, and a verified badge for your community. Your project will also be listed in the Divi audit database for investor search.
          </p>
        </div>
      </div>

      {/* Back Button with Outer Glow */}
      <button
        onClick={() => navigate("/ecosystem")}
        className="mt-12 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl shadow-[0_0_20px_#00e5ff] transition"
      >
        ← Back to Ecosystem
      </button>
    </div>
  );
}
