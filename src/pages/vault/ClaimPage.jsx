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
  const [claimableLocks, setClaimableLocks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) fetchClaimableLocks();
  }, [walletAddress]);

  const fetchClaimableLocks = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const totalLocks = await contract.nextLockId();
      const claimables = [];

      for (let i = 0; i < totalLocks; i++) {
        const lock = await contract.locks(i);
        const isCreator = lock.creator?.toLowerCase() === walletAddress.toLowerCase();
        const isUnlocked = Number(lock.unlockTime || 0) <= Date.now() / 1000;
        const notWithdrawn = !lock.withdrawn;

        if (isCreator && isUnlocked && notWithdrawn) {
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

            if (lock.amount) {
              formattedAmount = ethers.formatUnits(lock.amount.toString(), decimals);
            }

            if (lock.unlockTime && Number(lock.unlockTime) > 0) {
              unlockTimeFormatted = new Date(Number(lock.unlockTime) * 1000).toLocaleString();
            }
          } catch (err) {
            console.warn("Token metadata fetch failed for:", lock.token, err);
          }

          claimables.push({
            lockId: i,
            symbol,
            amount: formattedAmount,
            unlockTime: unlockTimeFormatted
          });
        }
      }

      setClaimableLocks(claimables);
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
      fetchClaimableLocks();
    } catch (err) {
      console.error("Claim failed:", err);
      alert("❌ Claim failed. See console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070B17] text-white px-6 py-12">
      <h1 className="text-center text-4xl font-bold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff] mb-8">
        Claim Your Locked Tokens
      </h1>

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
        <p className="text-center text-cyan-300 animate-pulse mt-6">Loading claimable locks...</p>
      )}

      {walletAddress && !loading && claimableLocks.length === 0 && (
        <p className="text-center text-cyan-500 mt-6">No claimable locks found.</p>
      )}

      {claimableLocks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-5xl mx-auto">
          {claimableLocks.map((lock, idx) => (
            <div
              key={idx}
              className="bg-[#0e1016] border border-cyan-500 rounded-xl p-6 shadow-[0_0_20px_#00e5ff50] text-white space-y-2"
            >
              <p className="font-bold text-cyan-300 text-lg">Lock ID: {lock.lockId}</p>
              <p className="text-sm text-white">Token Symbol: {lock.symbol}</p>
              <p className="text-sm text-white">Locked Amount: {lock.amount}</p>
              <p className="text-sm text-white">Unlock Time: {lock.unlockTime}</p>

              <button
                onClick={() => handleClaim(lock.lockId)}
                className="mt-4 w-full py-2 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-600 transition"
              >
                🔓 Claim Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
