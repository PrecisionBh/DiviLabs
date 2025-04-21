import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import StakingPoolABI from "../../abis/StakingPool.json";
import ERC20ABI from "../../abis/ERC20.json";

const LOCK_OPTIONS = [
  { value: 0, label: "7 Days", apy: 5 },
  { value: 1, label: "30 Days", apy: 10 },
  { value: 2, label: "60 Days", apy: 18 },
];

export default function StakePage() {
  const { address } = useParams();
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState("");
  const [stakeToken, setStakeToken] = useState("");
  const [stakeTokenName, setStakeTokenName] = useState("Stake Token");
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");
  const [totalStaked, setTotalStaked] = useState("0");
  const [selectedTier, setSelectedTier] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [emergency, setEmergency] = useState(false);

  useEffect(() => {
    loadInfo();
  }, [address]);

  async function loadInfo() {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    setWalletAddress(userAddress);

    const pool = new ethers.Contract(address, StakingPoolABI, provider);
    const stakeTokenAddr = await pool.stakeToken();
    setStakeToken(stakeTokenAddr);

    const token = new ethers.Contract(stakeTokenAddr, ERC20ABI, provider);
    try {
      const name = await token.name();
      setStakeTokenName(name);
    } catch {}

    try {
      const rawBal = await token.balanceOf(userAddress);
      setBalance(ethers.formatEther(rawBal));
    } catch {
      setBalance("0");
    }

    try {
      const allowance = await token.allowance(userAddress, address);
      setIsApproved(allowance > 0);
    } catch {}

    try {
      const rawStaked = await pool.totalStaked();
      setTotalStaked(ethers.formatEther(rawStaked));
    } catch {}

    try {
      const isEmergency = await pool.emergencyUnlockTriggered();
      if (isEmergency) {
        setEmergency(true);
        setTxStatus("🚨 This pool is in emergency mode. Staking is disabled.");
      }
    } catch {}
  }

  const handleApprove = async () => {
    try {
      if (!window.ethereum || !stakeToken) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(stakeToken, ERC20ABI, signer);

      const tx = await token.approve(address, ethers.parseUnits(amount || "0", 18));
      setTxStatus("Waiting for approval...");
      await tx.wait();
      setTxStatus("✅ Approved!");
      setIsApproved(true);
    } catch (err) {
      console.error("Approve failed:", err);
      setTxStatus("❌ Approve failed.");
    }
  };

  const handleStake = async () => {
    try {
      if (!window.ethereum || !amount || emergency) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const pool = new ethers.Contract(address, StakingPoolABI, signer);

      const tx = await pool.stake(ethers.parseUnits(amount, 18), selectedTier);
      setTxStatus("⛓️ Sending stake transaction...");
      await tx.wait();
      setTxStatus("✅ Successfully staked!");

      // Save info for success page
      localStorage.setItem("divi_lastStake", JSON.stringify({
        token: stakeTokenName,
        amount,
        tier: selectedTier,
      }));

      // Reset + navigate
      setIsApproved(false);
      setAmount("");
      await loadInfo();

      navigate("/staking/success");
    } catch (err) {
      console.error("Stake failed:", err);
      setTxStatus("❌ Stake failed.");
    }
  };

  return (
    <div className="bg-[#060a13] text-white px-4 py-10 flex justify-center items-start min-h-[100vh]">
      <div className="w-full max-w-lg bg-[#0e1016] border border-cyan-500 rounded-xl p-4 shadow-[0_0_20px_#00e5ff40] space-y-3">
        <button onClick={() => navigate("/staking/pools")} className="text-cyan-400 text-sm mb-1">
          &larr; Back
        </button>

        <h2 className="text-2xl font-extrabold text-cyan-300 mb-1">Stake {stakeTokenName}</h2>

        <div className="text-sm text-cyan-200 space-y-1">
          <p><strong>Staking Token:</strong> {stakeTokenName}</p>
          <p><strong>Available:</strong> {parseFloat(balance).toFixed(4)}</p>
          <p><strong>Total Staked in Pool:</strong> {parseFloat(totalStaked).toFixed(2)}</p>
        </div>

        <div>
          <label className="text-cyan-200 text-sm mb-1 block">Amount to Stake:</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#1e293b] text-sm text-white border border-cyan-400"
          />
        </div>

        <div>
          <label className="text-cyan-200 text-sm mb-1 block">Lock Duration:</label>
          <div className="flex justify-between gap-2">
            {LOCK_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedTier(opt.value)}
                className={`flex-1 py-2 text-sm rounded-xl border font-semibold transition ${
                  selectedTier === opt.value
                    ? "bg-cyan-500 text-black shadow-[0_0_10px_#00e5ff]"
                    : "bg-[#1e293b] text-white border-cyan-600"
                }`}
              >
                {opt.label} <br />({opt.apy}% APY)
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-cyan-200">
          Selected APY: <strong>{LOCK_OPTIONS[selectedTier].apy}%</strong>
        </p>

        {!isApproved ? (
          <button
            onClick={handleApprove}
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow transition"
            disabled={!amount || emergency}
          >
            Approve
          </button>
        ) : (
          <button
            onClick={handleStake}
            className="w-full py-2 bg-cyan-400 hover:bg-cyan-600 text-black font-bold rounded-xl shadow transition"
            disabled={!amount || emergency}
          >
            Stake
          </button>
        )}

        {txStatus && (
          <p className="text-center text-sm text-cyan-300 mt-1 mb-1">{txStatus}</p>
        )}
      </div>
    </div>
  );
}
