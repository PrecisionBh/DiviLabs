// src/components/VerifiedBadge.jsx
import React from "react";

export default function VerifiedBadge({ contractAddress, tokenName, score, timestamp }) {
  const shortAddress = contractAddress
    ? `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`
    : "Unknown";

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleString()
    : "Unknown";

  return (
    <div
      id="badge-container"
      className="bg-[#0e1016] border border-green-500 rounded-2xl px-10 py-6 text-center shadow-[0_0_25px_#00ff9966] max-w-md w-full"
    >
      <h3 className="text-lg sm:text-xl font-bold text-green-300 mb-1">
        ✅ Verified by Divi Labs Automated Auditor
      </h3>

      <p className="text-5xl font-extrabold text-white mt-1">{score}</p>
      <p className="text-md text-cyan-300 mt-2">{tokenName || "Unknown Token"}</p>

      <p className="text-xs text-cyan-400 mt-2 break-all">
        {contractAddress || shortAddress}
      </p>

      <p className="text-xs text-cyan-400 mt-1">{formattedTime}</p>

      <p className="text-xs text-cyan-400 mt-4">
        Audits do not guarantee safety. Always DYOR. <br />
        Divi Labs is not affiliated with audited tokens.
      </p>
    </div>
  );
}
