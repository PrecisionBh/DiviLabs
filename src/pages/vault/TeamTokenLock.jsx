import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";

export default function TeamTokenLock() {
  const navigate = useNavigate();

  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState(null);
  const [percentageToLock, setPercentageToLock] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState("");
  const [daysToLock, setDaysToLock] = useState("");
  const [lockName, setLockName] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");

  const baseCost = 0.25;
  const totalCost = baseCost.toFixed(2);

  const handlePercentageChange = (value) => {
    setPercentageToLock(value);
    const percent = parseFloat(value);

    if (!isNaN(percent) && percent >= 1 && percent <= 100 && tokenBalance !== null) {
      const balance = Number(tokenBalance);
      const amount = ((balance * percent) / 100).toFixed(4);
      setCalculatedAmount(amount);
    } else {
      setCalculatedAmount("");
    }
  };

  const fetchTokenBalance = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not found");
        return;
      }

      if (!tokenAddress.startsWith("0x")) {
        alert("Enter a valid token address.");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const contract = new Contract(tokenAddress, ["function balanceOf(address) view returns (uint256)"], provider);
      const rawBalance = await contract.balanceOf(address);
      const formatted = Number(rawBalance.toString()) / 1e18;

      setTokenBalance(formatted);
    } catch (err) {
      console.error("Error fetching token balance:", err);
      alert("Error fetching token balance.");
    }
  };

  const handleLock = () => {
    if (tokenBalance && calculatedAmount && daysToLock) {
      const lockData = {
        tokenAddress,
        tokenBalance,
        percentageToLock,
        calculatedAmount,
        daysToLock,
        lockName,
        websiteLink,
        socialLink,
      };
      localStorage.setItem("diviTeamLockData", JSON.stringify(lockData));
      navigate("/vault/promo");
    } else {
      alert("Please fill in all fields correctly.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-cyan-400 text-center">Lock Team Tokens</h1>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-cyan-300 font-medium">Token Address</label>
            <button onClick={fetchTokenBalance} className="text-cyan-400 hover:text-cyan-300 text-sm">
              ➤ Fetch Token Balance
            </button>
          </div>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
            placeholder="0x..."
          />
          {tokenBalance !== null && (
            <p className="text-cyan-200 text-sm mt-1">Wallet Token Balance: {tokenBalance} tokens</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-cyan-300 font-medium">Amount to Lock (%)</label>
          <input
            type="number"
            value={percentageToLock}
            onChange={(e) => handlePercentageChange(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
            placeholder="Enter % (1-100)"
            min={1}
            max={100}
          />
          {calculatedAmount && (
            <p className="text-cyan-200 text-sm">You are locking: {calculatedAmount} Tokens</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-cyan-300 font-medium">How many days do you want to lock?</label>
          <input
            type="number"
            value={daysToLock}
            onChange={(e) => setDaysToLock(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
            placeholder="Please enter the number of days"
            min={1}
          />
        </div>

        <input
          type="text"
          value={lockName}
          onChange={(e) => setLockName(e.target.value)}
          placeholder="Optional Lock Name"
          className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
        />

        <input
          type="text"
          value={websiteLink}
          onChange={(e) => setWebsiteLink(e.target.value)}
          placeholder="https://yourproject.com (optional)"
          className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
        />
        <input
          type="text"
          value={socialLink}
          onChange={(e) => setSocialLink(e.target.value)}
          placeholder="https://twitter.com/project (optional)"
          className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
        />

        <button
          onClick={handleLock}
          className="w-full py-3 mt-6 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-600 text-black"
        >
          Proceed to Last Step
        </button>
      </div>
    </div>
  );
}

