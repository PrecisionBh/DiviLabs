import React, { useState, useEffect } from "react";

export default function PublicAuditResults() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("public_verified_audits");
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  const handleSearch = () => {
    const q = query.toLowerCase();
    const matches = results.filter(
      (item) =>
        item.tokenName?.toLowerCase().includes(q) ||
        item.contractAddress?.toLowerCase().includes(q)
    );
    setFiltered(matches);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-cyan-400 drop-shadow mb-4">
          Search Verified Audit Reports
        </h1>
        <p className="text-cyan-200 mb-8 text-sm">
          Enter a token name or contract address to find an audit.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search by token name or CA..."
            className="w-full sm:w-96 px-4 py-3 rounded-xl bg-[#1e293b] text-white text-sm border border-cyan-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow transition"
          >
            Search
          </button>
        </div>

        {query === "" && (
          <div className="mt-8 max-w-md mx-auto text-center">
            <h3 className="text-cyan-400 text-xl font-semibold mb-2">
              Divi Token Verified Audit Badge
            </h3>
            <div className="bg-[#0e1016] border border-green-500 rounded-xl px-6 py-4 shadow-[0_0_20px_#00ff9966] inline-block">
              <p className="text-green-300 text-sm font-bold">
                ✅ Verified by Divi Labs Automated Auditor
              </p>
              <p className="text-3xl text-white font-extrabold mt-1">85</p>
              <p className="text-cyan-300 text-sm mt-1">Divi Token</p>
              <p className="text-cyan-400 text-xs mt-2">
                CA: 0x32cf...d104<br />
                Audited: 4/19/25 — 09:24 AM EST
              </p>
            </div>
          </div>
        )}

        {query !== "" && filtered.length === 0 && (
          <p className="text-cyan-300 text-sm mt-6">
            No results found. Double-check your spelling or try another term.
          </p>
        )}

        {filtered.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6">
            {filtered.map((item, index) => (
              <div
                key={index}
                className="bg-[#0e1016] border border-cyan-600 rounded-xl p-5 shadow-[0_0_20px_#00e5ff40]"
              >
                <p className="text-lg font-bold text-cyan-300 mb-1">{item.tokenName}</p>
                <p className="text-sm text-cyan-400 break-all mb-1">
                  CA: {item.contractAddress}
                </p>
                <p className="text-sm text-green-400 mb-2">Score: {item.score}/100</p>
                <a
                  href="/auditor/verified-results"
                  className="text-sm text-blue-400 underline"
                >
                  View Full Audit →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
