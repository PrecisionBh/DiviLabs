// src/pages/auditor/VerifiedAuditResults.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VerifiedBadge from "../../components/VerifiedBadge";
import html2canvas from "html2canvas";

export default function VerifiedAuditResults() {
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [score, setScore] = useState(100);

  useEffect(() => {
    const stored = localStorage.getItem("latest_verified_audit");
    if (stored) {
      const data = JSON.parse(stored);
      setAudit(data);
      setScore(calculateAuditScore(data));
    }
  }, []);

  const calculateAuditScore = (data) => {
    let points = 100;
    if (data.mintFunction === true) points -= 20;
    if (data.renounced !== true) points -= 10;
    if (!data.explorer || !data.explorer.includes("scan")) points -= 10;
    if (!data.maxWallet) points -= 10;
    if (!data.blacklistProtection) points -= 10;
    if (!data.reflectionLogic) points -= 10;
    if (!data.liquidityLock) points -= 10;
    if (!data.maxTxLimit) points -= 10;
    if (data.telegram) points += 2;
    if (data.notes?.length > 10) points += 3;
    if (data.hasCustomSecurity) points += 5;
    return Math.min(100, Math.max(0, points));
  };

  const downloadBadge = async () => {
    const badgeEl = document.getElementById("badge-container");
    if (!badgeEl) return;
    const canvas = await html2canvas(badgeEl);
    const link = document.createElement("a");
    link.download = `divi_audit_badge_${audit.tokenName || "token"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (!audit) {
    return (
      <div className="min-h-screen bg-[#060a13] text-white flex flex-col items-center justify-center px-6 py-16">
        <h2 className="text-3xl font-bold text-red-500 mb-4">No Audit Found</h2>
        <p className="text-cyan-200 mb-6">Please submit a verified audit first.</p>
        <button
          onClick={() => navigate("/auditor/verified")}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded-xl shadow transition"
        >
          Back to Audit Form
        </button>
      </div>
    );
  }

  const formattedTime = new Date(audit.timestamp).toLocaleString();

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12 flex flex-col items-center">
      <VerifiedBadge
        contractAddress={audit.contractAddress}
        tokenName={audit.tokenName}
        score={score}
        timestamp={audit.timestamp}
      />

      <p className="text-xs text-cyan-400 mt-2 text-center max-w-md">
        Disclaimer: This audit does not guarantee safety. Devs may still act maliciously. Divi does not control this contract. Always DYOR.
      </p>

      <button
        onClick={downloadBadge}
        className="mt-4 mb-8 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded-xl shadow transition"
      >
        Download Audit Badge
      </button>

      <div className="max-w-2xl w-full bg-[#0e1016] border border-cyan-500 rounded-2xl shadow-[0_0_25px_#00e5ff60] p-6">
        <h2 className="text-4xl font-extrabold text-cyan-400 text-center drop-shadow mb-6">
          Verified Audit Results
        </h2>

        <div className="text-center mb-8">
          <div className="inline-block px-6 py-2 bg-green-700 rounded-full text-white font-bold text-lg shadow-[0_0_12px_#00e5ff]">
            ✅ Score: {score}/100
          </div>
        </div>

        <div className="space-y-4 text-cyan-200 text-md leading-relaxed">
          <AuditField label="Token Name" value={audit.tokenName} />
          <AuditField label="Contract Address" value={audit.contractAddress} />
          <AuditField
            label="Explorer"
            value={
              <a
                href={audit.explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline break-all"
              >
                {audit.explorer}
              </a>
            }
          />
          {audit.telegram && <AuditField label="Telegram" value={audit.telegram} />}
          {audit.notes && <AuditField label="Notes" value={audit.notes} />}
          <AuditField label="Audit Timestamp" value={formattedTime} />
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/ecosystem")}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_20px_#00e5ff] transition"
          >
            ← Back to Ecosystem
          </button>
        </div>
      </div>
    </div>
  );
}

function AuditField({ label, value }) {
  return (
    <p>
      <span className="font-semibold text-white">{label}:</span>{" "}
      <span className="text-cyan-300">{value}</span>
    </p>
  );
}
