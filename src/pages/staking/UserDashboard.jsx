import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../context/WalletContext";
import StakingPoolABI from "../../abis/StakingPool.json";
import StakingFactoryABI from "../../abis/StakingPoolFactory.json";
import { useNavigate } from "react-router-dom";

const FACTORY_ADDRESS = "0x09f70e0e44EB61f2f81e96E5d4d75cd3BEAEcD7e";

export default function UserDashboard() {
  const { walletAddress, connectWallet } = useWallet();
  const [userPools, setUserPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (walletAddress) {
      setIsConnected(true);
      fetchUserStakes();
    } else {
      setIsConnected(false);
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserPools((prevPools) =>
        prevPools.map((pool) => {
          const now = Math.floor(Date.now() / 1000);
          const secondsStaked = now - pool.lastClaimed;
          const yearlyReward = parseFloat(pool.amount) * (pool.apy / 100);
          const rewardPerSecond = yearlyReward / (365 * 24 * 60 * 60);
          const updatedClaimable = rewardPerSecond * secondsStaked;
          return { ...pool, claimable: updatedClaimable.toFixed(6) };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserStakes = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const factory = new ethers.Contract(FACTORY_ADDRESS, StakingFactoryABI, provider);
      const count = await factory.getPoolCount();
      const stakes = [];

      for (let i = 0; i < count; i++) {
        const poolAddress = await factory.stakingPools(i);
        const pool = new ethers.Contract(poolAddress, StakingPoolABI, provider);
        const emergency = await pool.emergencyUnlockTriggered();
        if (emergency) continue;

        const stake = await pool.stakes(walletAddress);
        if (stake.amount > 0n) {
          const reward = await pool.calculateRewards(walletAddress);
          const tier = Number(stake.tier);
          const unlockTime = Number(stake.startTime) + Number(await pool.tierDuration(tier));
          const apy = await pool.tierAPY(tier);
          const rewardTokenAddr = await pool.rewardToken();

          const rewardToken = new ethers.Contract(rewardTokenAddr, ["function name() view returns (string)"], provider);
          const rewardTokenName = await rewardToken.name();

          const totalStaked = await pool.totalStaked();

          stakes.push({
            poolAddress,
            amount: ethers.formatEther(stake.amount),
            claimable: ethers.formatEther(reward),
            lastClaimed: Number(stake.lastClaimed),
            unlockAt: unlockTime,
            rewardToken: rewardTokenName,
            apy: Number(apy) / 100,
            totalStaked: ethers.formatEther(totalStaked),
          });
        }
      }

      setUserPools(stakes);
    } catch (err) {
      console.error("Failed to fetch stakes", err);
      setStatus("⚠️ Could not load your stakes.");
    }
    setLoading(false);
  };

  const handleAction = async (fn, contractAddress) => {
    try {
      setStatus(`⏳ ${fn} in progress...`);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, StakingPoolABI, signer);
      const tx = await contract[fn]();
      await tx.wait();
      setStatus(`✅ ${fn} successful!`);
      fetchUserStakes();
    } catch (err) {
      console.error(err);
      setStatus(`❌ ${fn} failed.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-center text-cyan-400 mb-10 drop-shadow">
        Your Staking Dashboard
      </h1>

      {loading ? (
        <p className="text-cyan-300 animate-pulse">Loading your stakes...</p>
      ) : !isConnected ? (
        <div className="text-center bg-[#0e1016] border border-cyan-500 p-8 rounded-xl shadow-[0_0_40px_#00e5ff80]">
          <p className="text-cyan-300 mb-4">Please connect your wallet to view your stakes.</p>
          <button
            onClick={connectWallet}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded-xl shadow transition"
          >
            Connect Wallet
          </button>
        </div>
      ) : userPools.length === 0 ? (
        <div className="text-center bg-[#0e1016] border border-cyan-500 p-8 rounded-xl shadow-[0_0_40px_#00e5ff80] max-w-xl">
          <h2 className="text-2xl font-bold text-cyan-300 mb-2">You’re not earning any APY right now 😶‍🌫️</h2>
          <p className="text-cyan-200 mb-6">
            But you could be. Go explore the staking pools and start racking up rewards!
          </p>
          <button
            onClick={fetchUserStakes}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded-xl shadow mb-4"
          >
            🔄 Reload My Stakes
          </button>
          <br />
          <button
            onClick={() => navigate("/staking/start")}
            className="text-cyan-300 underline hover:text-cyan-100 mt-2"
          >
            ← Back to Staking Home
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {userPools.map((pool, i) => (
              <div
                key={i}
                className="bg-[#0e1016] border border-cyan-600 rounded-xl px-10 py-6 w-[500px] text-center shadow-[0_0_25px_#00e5ff40]"
              >
                <h3 className="text-xl font-bold text-cyan-300 uppercase mb-1">{pool.rewardToken}</h3>
                <p className="text-sm text-cyan-200">Reward Token: {pool.rewardToken}</p>
                <p className="text-cyan-100 mt-2">APY: {pool.apy}%</p>
                <p className="text-cyan-100">Total Staked: {Number(pool.totalStaked).toLocaleString()}</p>
                <p className="text-cyan-100 mt-1">Your Stake: {pool.amount}</p>
                <p className="text-cyan-100">Claimable: {pool.claimable}</p>
                <p className="text-cyan-300 text-sm mt-1">
                  Unlocks at: {new Date(pool.unlockAt * 1000).toLocaleString()}
                </p>

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => handleAction("claimRewards", pool.poolAddress)}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 rounded-xl shadow"
                  >
                    Claim
                  </button>
                  <button
                    onClick={() => handleAction("unstake", pool.poolAddress)}
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 rounded-xl"
                  >
                    Unstake
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={fetchUserStakes}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded-xl shadow transition mb-4"
            >
              🔁 Reload My Stakes
            </button>
            <br />
            <button
              onClick={() => navigate("/staking/start")}
              className="text-cyan-300 underline hover:text-cyan-100 mt-2"
            >
              ← Back to Staking Home
            </button>
          </div>
        </>
      )}

      {status && <p className="text-cyan-400 mt-4">{status}</p>}
    </div>
  );
}
