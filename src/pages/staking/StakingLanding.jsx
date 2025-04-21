// src/pages/staking/StakingLanding.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function StakingLanding() {
  const navigate = useNavigate();

  const buttons = [
    { label: "View Live Staking Pools", path: "/staking/pools" },
    { label: "View My Stakes", path: "/staking/user" },
    { label: "Onboard Your Token", path: "/staking/onboard" },
    { label: "Dev Dashboard", path: "/staking/dev" },
  ];

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-16 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow mb-4 text-center">
        Divi Staking Platform
      </h1>
      <p className="text-cyan-200 text-center mb-10 text-lg max-w-2xl">
        Stake tokens. Earn rewards. Power the Divi ecosystem.
      </p>

      <div className="grid gap-4 w-full max-w-xs text-center">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={() => navigate(btn.path)}
            className="bg-[#0e1016] hover:bg-cyan-500 hover:text-black text-cyan-300 font-bold py-4 px-6 rounded-2xl border border-cyan-500 shadow-[0_0_30px_#00e5ff66] transition-all duration-300"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate("/ecosystem")}
        className="mt-10 text-cyan-300 underline hover:text-cyan-100"
      >
        ← Back to Ecosystem
      </button>
    </div>
  );
}
