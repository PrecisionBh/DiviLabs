import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import StakingPoolFactoryABI from "../../abis/StakingPoolFactory.json";
import StakingPoolABI from "../../abis/StakingPool.json";
import ERC20ABI from "../../abis/ERC20.json";

const FACTORY_ADDRESS = "0xf5FaDE4954799794bb1a695766b46a8279F22077";

export default function StakingDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [pools, setPools] = useState([]);
  const [recentPools, setRecentPools] = useState([]);
  const [filteredPools, setFilteredPools] = useState([]);

  useEffect(() => {
    fetchPools();
  }, []);

  useEffect(() => {
    if (!search) setFilteredPools([]);
  }, [search]);

  const fetchPools = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const factory = new ethers.Contract(FACTORY_ADDRESS, StakingPoolFactoryABI, provider);
      const count = Number(await factory.getPoolCount());
      const fetched = [];

      for (let i = count - 1; i >= 0; i--) {
        const poolAddress = await factory.stakingPools(i);
        const pool = new ethers.Contract(poolAddress, StakingPoolABI, provider);
        const stakeTokenAddress = await pool.stakeToken();
        const rewardTokenAddress = await pool.rewardToken();

        const stakeToken = new ethers.Contract(stakeTokenAddress, ERC20ABI, provider);
        const rewardToken = new ethers.Contract(rewardTokenAddress, ERC20ABI, provider);

        let stakeName = "Unknown Stake Token";
        let rewardName = "Unknown Reward Token";

        try { stakeName = await stakeToken.name(); } catch {}
        try { rewardName = await rewardToken.name(); } catch {}

        const rawRewardBalance = await rewardToken.balanceOf(poolAddress);
        const totalStakedRaw = await pool.totalStaked();

        let rewardsAvailable;
        if (stakeTokenAddress.toLowerCase() === rewardTokenAddress.toLowerCase()) {
          const adjustedRewards = rawRewardBalance - totalStakedRaw;
          rewardsAvailable = ethers.formatEther(adjustedRewards > 0n ? adjustedRewards : 0n);
        } else {
          rewardsAvailable = ethers.formatEther(rawRewardBalance);
        }

        const totalStaked = ethers.formatEther(totalStakedRaw);

        fetched.push({
          poolAddress,
          stakeName,
          rewardName,
          stakeTokenAddress,
          rewardTokenAddress,
          rewardsAvailable,
          totalStaked,
        });
      }

      setPools(fetched);
      setRecentPools(fetched.slice(0, 2));
    } catch (err) {
      console.error("Failed to fetch pools", err);
    }
  };

  const handleSearch = () => {
    if (!search) return;
    const results = pools.filter((pool) =>
      pool.stakeTokenAddress.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPools(results);
  };

  const PoolCard = ({ pool }) => (
    <div className="bg-[#0e1016] border border-cyan-500 rounded-2xl px-6 py-5 shadow-[0_0_25px_#00e5ff40] max-w-sm w-full">
      <h3 className="text-xl font-extrabold text-cyan-300 uppercase mb-2">{pool.stakeName}</h3>
      <p className="text-sm text-cyan-100"><strong>Stake CA:</strong> {pool.stakeTokenAddress}</p>
      <p className="text-sm text-cyan-100"><strong>Reward Token:</strong> {pool.rewardName}</p>
      <p className="text-sm text-cyan-100"><strong>Rewards Available:</strong> {parseFloat(pool.rewardsAvailable).toFixed(2)}</p>
      <p className="text-sm text-cyan-100"><strong>APY:</strong> 5% – 18%</p>
      <p className="text-sm text-cyan-100"><strong>Total Staked:</strong> {parseFloat(pool.totalStaked).toFixed(2)}</p>
      <button
        className="mt-4 w-full bg-[#0e1016] text-cyan-300 font-bold py-2 rounded-xl border border-cyan-500 hover:bg-cyan-500 hover:text-black transition shadow-[0_0_20px_#00e5ff]"
        onClick={() => navigate(`/staking/pool/${pool.poolAddress}`)}
      >
        Stake
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          Staking Dashboard
        </h1>
        <p className="text-cyan-200 mt-2 text-lg max-w-xl mx-auto">
          Explore all available staking pools or search by token contract address.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 max-w-md mx-auto mb-12">
        <div className="flex w-full gap-2">
          <input
            type="text"
            placeholder="Search by token address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-[#1e293b] text-white border border-cyan-400 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-3 bg-[#0e1016] border border-cyan-500 hover:bg-cyan-500 hover:text-black rounded-xl shadow-[0_0_15px_#00e5ff] text-cyan-300 font-bold text-xl"
            title="Search"
          >
            🔍
          </button>
        </div>

        <button
          onClick={() => navigate("/staking/user")}
          className="w-full py-3 bg-[#0e1016] text-cyan-300 font-bold text-lg rounded-xl border border-cyan-500 hover:bg-cyan-500 hover:text-black transition shadow-[0_0_20px_#00e5ff]"
        >
          View My Stakes
        </button>

        <button
          onClick={() => navigate("/staking/onboard")}
          className="w-full py-3 bg-[#0e1016] text-cyan-300 font-bold text-lg rounded-xl border border-cyan-500 hover:bg-cyan-500 hover:text-black transition shadow-[0_0_20px_#00e5ff]"
        >
          Onboard My Project
        </button>
      </div>

      <div className="flex flex-col gap-12 items-center">
        {recentPools.length > 0 && (
          <div className="w-full max-w-6xl">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4 text-center">🔥 Recently Created Pools</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {recentPools.map((pool, index) => (
                <PoolCard key={`recent-${index}`} pool={pool} />
              ))}
            </div>
          </div>
        )}

        {search && (
          <div className="w-full max-w-6xl">
            <h2 className="text-xl text-cyan-200 mt-8 mb-4 text-center">🔎 Search Results</h2>
            {filteredPools.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-8">
                {filteredPools.map((pool, index) => (
                  <PoolCard key={`search-${index}`} pool={pool} />
                ))}
              </div>
            ) : (
              <div className="text-center text-cyan-400 text-lg mt-4">
                😥 No pools found for that token address.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/staking/start")}
          className="text-cyan-300 underline hover:text-cyan-100 text-sm"
        >
          ← Back to Stake Home
        </button>
      </div>
    </div>
  );
}
