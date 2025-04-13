import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VaultResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [lockData, setLockData] = useState(null);

  const isSuccess = new URLSearchParams(location.search).get("status") === "success";

  useEffect(() => {
    const storedData = localStorage.getItem("diviLockData");
    if (storedData) {
      setLockData(JSON.parse(storedData));
    }
  }, []);

  const unlockTimestamp = lockData?.daysToLock
    ? new Date(Date.now() + lockData.daysToLock * 24 * 60 * 60 * 1000)
    : null;

  const formattedUnlockDate = unlockTimestamp?.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-4 py-12 text-center space-y-6">
      {isSuccess ? (
        <>
          <h1 className="text-4xl font-bold text-green-400 drop-shadow">✅ Lock Successful!</h1>

          {lockData && (
            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg max-w-xl w-full space-y-4 border border-cyan-500">
              <h2 className="text-2xl font-bold text-cyan-400">🔒 Liquidity Lock Created!</h2>
              <p><strong>📦 Locked Amount:</strong> {lockData.calculatedAmount} Tokens</p>
              <p><strong>🔗 Token Address:</strong> {lockData.lpAddress}</p>
              <p><strong>📅 Unlock Date:</strong> {formattedUnlockDate}</p>
              {lockData.lockName && <p><strong>🧪 Lock Name:</strong> {lockData.lockName}</p>}
              {lockData.websiteLink && <p><strong>🌐 Website:</strong> {lockData.websiteLink}</p>}
              {lockData.socialLink && <p><strong>📣 Social:</strong> {lockData.socialLink}</p>}
              <p className="text-yellow-400 text-sm mt-4">⚠️ If you minted an NFT, it will appear in your wallet shortly.</p>
              <p className="text-orange-300 text-sm">Once your lock expires, visit the Vault landing page and click <strong>Claim Tokens</strong>.</p>
            </div>
          )}

          <button
            onClick={() => navigate("/ecosystem")}
            className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded-xl shadow-lg transition"
          >
            Back to Ecosystem
          </button>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-red-500 drop-shadow">❌ Lock Failed</h1>
          <p className="text-lg text-gray-300 max-w-md">
            Something went wrong during the transaction. This could be due to gas errors,
            a rejected wallet prompt, or an on-chain failure.
          </p>
          <button
            onClick={() => navigate("/vault/type")}
            className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded-xl shadow-lg transition"
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
}
