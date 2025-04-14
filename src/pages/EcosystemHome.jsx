import React from "react";
import { useNavigate } from "react-router-dom";

export default function EcosystemHome() {
  const navigate = useNavigate();

  const pages = [
    { title: "Divi Dashboard", path: "/dashboard" },
    { title: "Divi Vault", path: "/vault/start" },
    { title: "Contract Creator (Coming Soon)", path: "/docs/contract-creator" },
    { title: "Token Auditor (Coming Soon)", path: "/docs/auditor" },
    { title: "Staking Platform (Coming Soon)", path: "/docs/staking" },
    { title: "Divi Docs", path: "/docs" },
  ];

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          Divi Ecosystem
        </h1>
        <p className="text-cyan-200 mt-2 text-lg max-w-xl mx-auto">
          Explore all the tools and features built to empower Divi holders and developers across DeFi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        {pages.map((page, index) => (
          <div
            key={index}
            onClick={() => navigate(page.path)}
            className="cursor-pointer bg-[#0e1016] border border-cyan-500 rounded-2xl px-8 py-6 shadow-[0_0_30px_#00e5ff60] hover:shadow-[0_0_40px_#00e5ff80] transition text-center"
          >
            <h2 className="text-2xl font-bold text-cyan-300">{page.title}</h2>
          </div>
        ))}
      </div>

      {/* Social Buttons */}
      <div className="flex flex-col items-center space-y-4">
        <a
          href="https://x.com/DiviOfficial"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg transition"
        >
          Follow us on X
        </a>
        <a
          href="https://t.me/DiviBEP20"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg transition"
        >
          Join us on Telegram
        </a>
      </div>
    </div>
  );
}
