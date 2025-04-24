import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../context/WalletContext";

const CONTRACT_ADDRESS = "0x27Ce0569B5f865A1C1F6fA36D66cE07ca329ce35";
const CONTRACT_ABI = [
  "function nextLockId() view returns (uint256)",
  "function locks(uint256) view returns (address token, uint256 amount, uint256 unlockTime, uint8 lockType, address creator, bool withdrawn)",
  "function claim(uint256 lockId) external"
];

export default function ClaimPage() {
  const { walletAddress, connectWallet } = useWallet();
  const [locks, setLocks] = useState([]);
  const [hiddenLockIds, setHiddenLockIds] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const [confirmDismissId, setConfirmDismissId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) fetchLocks();
  }, [walletAddress]);

  const fetchLocks = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const totalLocks = await contract.nextLockId();
      const userLocks = [];

      for (let i = 0; i < totalLocks; i++) {
        const lock = await contract.locks(i);
        const isCreator = lock.creator?.toLowerCase() === walletAddress.toLowerCase();
        const notWithdrawn = !lock.withdrawn;
        if (!isCreator || !notWithdrawn) continue;

        let symbol = "Unknown";
        let decimals = 18;
        let formattedAmount = "Unknown";
        let unlockTimeFormatted = "Unknown";

        try {
          const tokenContract = new ethers.Contract(lock.token, [
            "function symbol() view returns (string)",
            "function decimals() view returns (uint8)"
          ], provider);
          symbol = await tokenContract.symbol();
          decimals = await tokenContract.decimals();
          formattedAmount = ethers.formatUnits(lock.amount.toString(), decimals);
          if (lock.unlockTime && Number(lock.unlockTime) > 0) {
            unlockTimeFormatted = new Date(Number(lock.unlockTime) * 1000).toLocaleString();
          }
        } catch (err) {
          console.warn("Token metadata fetch failed for:", lock.token, err);
        }

        userLocks.push({
          lockId: i,
          symbol,
          amount: formattedAmount,
          unlockTime: lock.unlockTime,
          unlockTimeFormatted
        });
      }

      setLocks(userLocks);
    } catch (err) {
      console.error("Error loading locks:", err);
    }
    setLoading(false);
  };

  const handleClaim = async (lockId) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.claim(lockId);
      await tx.wait();

      alert(`✅ Lock #${lockId} claimed successfully.`);
      setLocks((prevLocks) => prevLocks.filter((lock) => lock.lockId !== lockId));
    } catch (err) {
      if (err?.reason === "Already withdrawn") {
        alert("❗ This lock was already claimed.");
        setLocks((prevLocks) => prevLocks.filter((lock) => lock.lockId !== lockId));
      } else {
        console.error("Claim failed:", err);
        alert("❌ Claim failed. See console for details.");
      }
    }
  };

  const dismissLock = (lockId) => {
    setHiddenLockIds((prev) => [...prev, lockId]);
    setConfirmDismissId(null); // Close confirm modal
  };

  const filteredLocks = locks.filter(
    (lock) => showHidden || !hiddenLockIds.includes(lock.lockId)
  );

  return (
    <div className="min-h-screen bg-[#070B17] text-white px-6 py-12">
      <h1 className="text-center text-4xl font-bold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff] mb-6">
        Claim or View Your Locked Tokens
      </h1>

      <div className="flex justify-center mb-6">
        <label className="flex items-center gap-2 text-sm text-cyan-200">
          <input
            type="checkbox"
            checked={showHidden}
            onChange={() => setShowHidden(!showHidden)}
            className="accent-cyan-500 w-4 h-4"
          />
          Show Hidden Locks
        </label>
      </div>

      {!walletAddress && (
        <div className="text-center">
          <button
            onClick={connectWallet}
            className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-full shadow-lg hover:bg-cyan-600 transition"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {loading && (
        <p className="text-center text-cyan-300 animate-pulse mt-6">Loading your locks...</p>
      )}

      {walletAddress && !loading && filteredLocks.length === 0 && (
        <p className="text-center text-cyan-500 mt-6">No active locks found.</p>
      )}

      {filteredLocks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-5xl mx-auto">
          {filteredLocks.map((lock, idx) => {
            const isUnlocked = Number(lock.unlockTime) <= Date.now() / 1000;

            return (
              <div
                key={idx}
                className="bg-[#0e1016] border border-cyan-500 rounded-xl p-6 shadow-[0_0_20px_#00e5ff50] text-white space-y-2"
              >
                <p className="font-bold text-cyan-300 text-lg">Lock ID: {lock.lockId}</p>
                <p className="text-sm">Token Symbol: {lock.symbol}</p>
                <p className="text-sm">Locked Amount: {lock.amount}</p>
                <p className="text-sm">
                  {isUnlocked ? "✅ Unlock Available" : `🔒 Unlocks At: ${lock.unlockTimeFormatted}`}
                </p>

                {isUnlocked && (
                  <button
                    onClick={() => handleClaim(lock.lockId)}
                    className="mt-4 w-full py-2 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-600 transition"
                  >
                    🔓 Claim Now
                  </button>
                )}

                <button
                  onClick={() => setConfirmDismissId(lock.lockId)}
                  className="mt-2 w-full py-2 bg-gray-700 text-white font-bold rounded-full hover:bg-gray-600 transition text-sm"
                >
                  🧹 Dismiss Lock
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔒 Confirm Modal */}
      {confirmDismissId !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-6">
          <div className="bg-[#0e1016] p-6 rounded-xl border border-cyan-500 max-w-sm w-full space-y-4 text-center">
            <p className="text-cyan-300 text-lg font-semibold">
              Are you sure you want to dismiss Lock #{confirmDismissId}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => dismissLock(confirmDismissId)}
                className="bg-cyan-500 text-black px-4 py-2 font-bold rounded-lg hover:bg-cyan-600 transition"
              >
                Yes, Dismiss
              </button>
              <button
                onClick={() => setConfirmDismissId(null)}
                className="bg-gray-700 text-white px-4 py-2 font-bold rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
