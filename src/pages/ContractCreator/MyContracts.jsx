// src/pages/ContractCreator/MyContracts.jsx
import { useState, useEffect } from "react";
import { downloadZipById, getAllSavedContracts } from "../../lib/ContractStorage";
import { useNavigate } from "react-router-dom";

export default function MyContracts() {
  const [contracts, setContracts] = useState([]);
  const [wallet, setWallet] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedWallet = localStorage.getItem("connected_wallet");
    if (!storedWallet) return;

    setWallet(storedWallet);
    loadContracts(storedWallet);
  }, []);

  const loadContracts = (walletAddress) => {
    const all = getAllSavedContracts();
    const filtered = all.filter((c) => c.wallet === walletAddress);
    setContracts(filtered.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this contract?");
    if (!confirmed) return;

    localStorage.removeItem(`divi_contract_${id}`); // ✅ proper deletion
    const updated = getAllSavedContracts().filter((c) => c.wallet === wallet);
    setContracts(updated.sort((a, b) => b.timestamp - a.timestamp));
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12 text-center">
      <h1 className="text-4xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff] mb-10">My Contracts</h1>

      {contracts.length === 0 ? (
        <p className="text-cyan-200 mb-10">No contracts found for this wallet.</p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-[#0e1016] border border-cyan-500 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[0_0_20px_#00e5ff30]"
            >
              <div className="text-left space-y-1">
                <p>
                  <strong className="text-cyan-400">Token:</strong>{" "}
                  {contract.name || contract.tokenInfo?.name || "Unnamed Token"}{" "}
                  <span className="text-cyan-300">
                    ({contract.symbol || contract.tokenInfo?.symbol || "?"})
                  </span>
                </p>
                <p>
                  <strong className="text-cyan-400">Saved:</strong>{" "}
                  {contract.timestamp ? new Date(contract.timestamp).toLocaleString() : "Unknown"}
                </p>
                <p>
                  <strong className="text-cyan-400">Package:</strong> {contract.package || "Unknown"}
                </p>
              </div>

              <div className="flex gap-4 items-center justify-end">
                <button
                  onClick={() => downloadZipById(contract.id)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-5 rounded-xl shadow-[0_0_10px_#00e5ff] transition"
                >
                  Download ZIP
                </button>
                <button
                  onClick={() => handleDelete(contract.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl shadow-[0_0_10px_#ff3b3b] transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12">
        <button
          onClick={() => navigate("/ecosystem")}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded-xl shadow-[0_0_15px_#00e5ff] transition"
        >
          ← Back to Ecosystem
        </button>
      </div>
    </div>
  );
}
