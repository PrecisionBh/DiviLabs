import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import StakingPoolFactoryABI from "../../abis/StakingPoolFactory.json";
import StakingPoolABI from "../../abis/StakingPool.json";
import ERC20ABI from "../../abis/ERC20.json";

const FACTORY_ADDRESS = "0xf5FaDE4954799794bb1a695766b46a8279F22077";

export default function DevDashboard() {
  const [walletAddress, setWalletAddress] = useState("");
  const [myPools, setMyPools] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    checkWallet();
  }, []);

  const checkWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      const factory = new ethers.Contract(FACTORY_ADDRESS, StakingPoolFactoryABI, provider);
      const poolAddrs = await factory.getPoolsByCreator(address);

      const pools = [];
      for (const addr of poolAddrs) {
        const pool = new ethers.Contract(addr, StakingPoolABI, provider);
        const rewardTokenAddr = await pool.rewardToken();
        const stakeTokenAddr = await pool.stakeToken();

        const rewardToken = new ethers.Contract(rewardTokenAddr, ERC20ABI, provider);
        const stakeToken = new ethers.Contract(stakeTokenAddr, ERC20ABI, provider);

        const [rewardName, stakeName] = await Promise.all([
          rewardToken.name(),
          stakeToken.name(),
        ]);

        const rewardBal = await rewardToken.balanceOf(addr);
        const emergencyUnlock = await pool.emergencyUnlockTriggered();

        pools.push({
          address: addr,
          rewardTokenAddr,
          rewardName,
          stakeName,
          stakeTokenAddr,
          rewardBal: ethers.formatEther(rewardBal),
          emergencyUnlock,
        });
      }

      setMyPools(pools);
    } catch (err) {
      console.error("Failed to load DevDashboard", err);
      setStatus("❌ Failed to load pools");
    }
  };

  const refillRewards = async (poolAddr, rewardTokenAddr) => {
    const amount = prompt("Enter reward amount to add:");
    if (!amount) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(rewardTokenAddr, ERC20ABI, signer);
      const parsed = ethers.parseUnits(amount, 18);

      const approveTx = await token.approve(poolAddr, parsed);
      await approveTx.wait();

      const pool = new ethers.Contract(poolAddr, StakingPoolABI, signer);
      const tx = await pool.depositRewards(parsed);
      await tx.wait();

      setStatus(`✅ Refilled ${amount} rewards to pool.`);
      checkWallet();
    } catch (err) {
      console.error("Refill failed", err);
      setStatus("❌ Refill failed");
    }
  };

  const withdrawRewards = async (poolAddr) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const pool = new ethers.Contract(poolAddr, StakingPoolABI, signer);
      const tx = await pool.triggerEmergencyUnlock();
      await tx.wait();
      setStatus("✅ Emergency unlock triggered and rewards withdrawn.");
      checkWallet();
    } catch (err) {
      console.error("Withdraw error", err);
      setStatus("❌ Withdrawal failed");
    }
  };

  const unstakeAll = async (poolAddr) => {
    try {
      const user = prompt("Enter staker address to force unstake:");
      if (!user) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const pool = new ethers.Contract(poolAddr, StakingPoolABI, signer);
      const tx = await pool.emergencyUnstake(user);
      await tx.wait();
      setStatus(`✅ Unstaked user ${user}`);
    } catch (err) {
      console.error("Unstake failed", err);
      setStatus("❌ Unstake failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <h1 className="text-4xl text-cyan-400 font-bold text-center mb-10 drop-shadow">
        Dev Dashboard
      </h1>

      {walletAddress ? (
        myPools.length > 0 ? (
          <div className="flex flex-wrap gap-6 justify-center">
            {myPools.map((pool, i) => (
              <div
                key={i}
                className="bg-[#0e1016] border border-cyan-500 p-6 rounded-xl max-w-md shadow-[0_0_20px_#00e5ff40] w-full"
              >
                <h2 className="text-xl font-bold text-cyan-300 mb-2">{pool.stakeName}</h2>
                <p className="text-sm text-cyan-100 mb-1"><strong>Token CA:</strong> {pool.stakeTokenAddr}</p>
                <p className="text-sm text-cyan-100 mb-1"><strong>Reward Token:</strong> {pool.rewardName}</p>
                <p className="text-sm text-cyan-100 mb-3"><strong>Reward Pool:</strong> {pool.rewardBal}</p>

                {!pool.emergencyUnlock && (
                  <button
                    onClick={() => withdrawRewards(pool.address)}
                    className="w-full bg-[#0e1016] border border-yellow-400 text-yellow-300 font-bold py-2 rounded-xl hover:bg-yellow-500 hover:text-black transition shadow-[0_0_10px_#ffd70040] mb-2"
                  >
                    🧯 Withdraw Remaining Rewards
                  </button>
                )}

                {pool.emergencyUnlock && (
                  <button
                    onClick={() => unstakeAll(pool.address)}
                    className="w-full bg-[#0e1016] border border-red-400 text-red-400 font-bold py-2 rounded-xl hover:bg-red-500 hover:text-black transition shadow-[0_0_10px_#ff000040] mb-2"
                  >
                    🚨 Unstake All
                  </button>
                )}

                <button
                  onClick={() => refillRewards(pool.address, pool.rewardTokenAddr)}
                  className="w-full bg-[#0e1016] border border-cyan-400 text-cyan-300 font-bold py-2 rounded-xl hover:bg-cyan-500 hover:text-black transition shadow-[0_0_10px_#00e5ff40]"
                >
                  ➕ Refill Rewards
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-cyan-300 text-center mt-12">😕 No pools found for this wallet</p>
        )
      ) : (
        <p className="text-cyan-300 text-center">Connect your wallet to view your pools.</p>
      )}

      {status && <p className="text-center text-cyan-400 mt-6">{status}</p>}
    </div>
  );
}