// src/pages/auditor/PreLaunchAudit.jsx
import React, { useState } from "react";
import runAuditScorer from "../../lib/auditScorer";
import { runAuditChecks } from "../../lib/runAuditChecks";

export default function PreLaunchAudit() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const handleAudit = () => {
    const { score, report } = runAuditScorer(code);
    const fullChecks = runAuditChecks(code);
    setResult({ score, report, fullChecks });
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <h2 className="text-4xl font-bold text-cyan-400 mb-6 text-center">Pre-Launch Contract Audit</h2>

        <textarea
          placeholder="Paste your Solidity code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={10}
          className="w-full p-4 rounded-xl bg-[#1e293b] text-white border border-cyan-600"
        />

        <button
          onClick={handleAudit}
          className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded-xl shadow transition w-full"
        >
          Run Audit
        </button>

        {result && (
          <div className="mt-8 bg-[#0e1016] border border-cyan-500 rounded-2xl p-6 shadow-[0_0_25px_#00e5ff60]">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4 text-center">Audit Results</h3>

            <div className="text-center mb-6">
              <p className="text-lg text-cyan-200 mb-2">Audit Score:</p>
              <div className="text-5xl font-extrabold text-green-400 drop-shadow-[0_0_25px_#00ffcc]">
                {result.score}/100
              </div>
            </div>

            <div className="text-center mb-4">
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="text-sm text-cyan-300 underline hover:text-white"
              >
                {expanded ? "Hide Detailed Breakdown ▲" : "Show Detailed Breakdown ▼"}
              </button>
            </div>

            {expanded && (
              <div className="grid grid-cols-1 gap-3 text-sm text-cyan-200">
                {result.fullChecks.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1e293b] p-4 rounded-xl border border-cyan-700 flex justify-between items-center"
                  >
                    <span><strong className="text-white">{item.label}</strong></span>
                    <span>{item.status}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-[#111] text-yellow-300 text-sm p-4 rounded-xl border border-yellow-400 mt-6">
              <strong>Disclaimer:</strong> Audit scores do not guarantee safety. Malicious devs can still change code after an audit. Divi Labs has no control over the contract. Always do your own research.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
