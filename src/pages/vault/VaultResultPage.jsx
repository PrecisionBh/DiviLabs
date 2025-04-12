import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VaultResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const isSuccess = new URLSearchParams(location.search).get("status") === "success";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-4 py-12 text-center space-y-6">
      {isSuccess ? (
        <>
          <h1 className="text-4xl font-bold text-green-400 drop-shadow">✅ Lock Successful!</h1>
          <p className="text-lg text-gray-300 max-w-md">
            Your tokens have been successfully locked and recorded on-chain.
            If you minted a promotional NFT, you can view it in your connected wallet.
          </p>
          <button
            onClick={() => navigate("/ecosystem")}
            className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded-xl shadow-lg transition"
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
