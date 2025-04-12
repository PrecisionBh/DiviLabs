import React from "react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0c0f1a] text-white flex items-center justify-center px-4 py-20">
      <div className="text-center space-y-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-400 border-opacity-50 mx-auto"></div>
        <h1 className="text-3xl font-bold text-cyan-300">Waiting for wallet confirmation...</h1>
        <p className="text-gray-400">Do not close this window. Confirm the transaction in your wallet.</p>
      </div>
    </div>
  );
}
