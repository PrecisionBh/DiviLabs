import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function DocsPage() {
  const navigate = useNavigate();

  const topDocs = [
    { title: "Token Info", path: "/token-info" },
    { title: "Divi Vault", path: "/docs/vault" },
    { title: "Contract Creator", path: "/docs/contract-creator" },
    { title: "Token Auditor", path: "/docs/auditor" },
  ];

  const stakingDoc = { title: "Staking Platform", path: "/docs/staking" };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          Divi Docs
        </h1>
        <p className="text-cyan-200 mt-2 text-lg max-w-xl mx-auto">
          Learn more about the Divi ecosystem, utilities, safety mechanisms, and how to get involved.
        </p>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
        {topDocs.map((doc, index) => (
          <div
            key={index}
            onClick={() => navigate(doc.path)}
            className="cursor-pointer bg-[#0e1016] border border-cyan-500 rounded-2xl px-8 py-6 text-center shadow-[0_0_30px_#00e5ff60] hover:shadow-[0_0_40px_#00e5ff80] transition"
          >
            <h2 className="text-2xl font-bold text-cyan-300">{doc.title}</h2>
          </div>
        ))}
      </div>

      {/* Centered Single Button */}
      <div className="flex justify-center mb-10">
        <div
          onClick={() => navigate(stakingDoc.path)}
          className="cursor-pointer bg-[#0e1016] border border-cyan-500 rounded-2xl px-10 py-6 text-center shadow-[0_0_30px_#00e5ff60] hover:shadow-[0_0_40px_#00e5ff80] transition"
        >
          <h2 className="text-2xl font-bold text-cyan-300">{stakingDoc.title}</h2>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link to="/ecosystem">
          <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg transition">
            ← Back to Ecosystem
          </button>
        </Link>
      </div>
    </div>
  );
}
