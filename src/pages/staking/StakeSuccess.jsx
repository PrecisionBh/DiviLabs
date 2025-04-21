import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LOCK_TEXT = ["7 Days (5%)", "30 Days (10%)", "60 Days (18%)"];

export default function StakeSuccess() {
  const [stakeData, setStakeData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("divi_lastStake");
    if (!data) {
      navigate("/staking/pools");
      return;
    }
    setStakeData(JSON.parse(data));
  }, [navigate]);

  if (!stakeData) return null;

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-20 flex justify-center">
      <div className="w-full max-w-md bg-[#0e1016] border border-cyan-500 rounded-xl p-6 shadow-[0_0_20px_#00e5ff40] text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-cyan-400">✅ Stake Confirmed</h1>
        <p className="text-cyan-200 text-lg font-bold">You staked {stakeData.amount} {stakeData.token}</p>
        <p className="text-cyan-300 text-sm">Lock Duration: <strong>{LOCK_TEXT[stakeData.tier]}</strong></p>
        <p className="text-sm text-cyan-400 mt-2">
          You can now track and claim your rewards from the User Dashboard.
        </p>
        <button
          onClick={() => navigate("/staking/user")}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-xl shadow"
        >
          Go to User Dashboard
        </button>
      </div>
    </div>
  );
}
