import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers, parseUnits } from "ethers";

export default function LiquidityLock() {
  const navigate = useNavigate();

  const [lpAddress, setLpAddress] = useState("");
  const [lpBalance, setLpBalance] = useState(null);
  const [percentageToLock, setPercentageToLock] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState("");
  const [daysToLock, setDaysToLock] = useState("");
  const [lockName, setLockName] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");

  const handlePercentageChange = (value) => {
    setPercentageToLock(value);
    const percent = parseFloat(value);
    if (!isNaN(percent) && percent >= 1 && percent <= 100 && lpBalance !== null) {
      const amount = ((lpBalance * percent) / 100).toFixed(4);
      setCalculatedAmount(amount);
    } else {
      setCalculatedAmount("");
    }
  };

  const fetchLpBalance = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not found");
        return;
      }

      if (!lpAddress.startsWith("0x") || !lpAddress) {
        alert("Enter a valid LP token address.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const contract = new ethers.Contract(
        lpAddress,
        [
          "function balanceOf(address) view returns (uint256)",
          "function decimals() view returns (uint8)"
        ],
        provider
      );

      const rawBalance = await contract.balanceOf(userAddress);
      const decimals = await contract.decimals();
      const formatted = Number(ethers.formatUnits(rawBalance, decimals));

      setLpBalance(formatted);
    } catch (err) {
      console.error("Error fetching LP balance:", err);
      alert("Error fetching LP balance.");
    }
  };

  const handleNext = () => {
    if (!lpBalance || !calculatedAmount || !daysToLock || !lpAddress) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const lockPayload = {
      lpAddress,
      calculatedAmount,
      daysToLock,
      lockName,
      socialLink,
      websiteLink
    };

    localStorage.setItem("diviLockData", JSON.stringify(lockPayload));
    navigate("/vault/promo");
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-cyan-400 text-center">Lock Liquidity Pair</h1>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-cyan-300 font-medium">LP Token Address</label>
            <button onClick={fetchLpBalance} className="text-cyan-400 hover:text-cyan-300 text-sm">
              ➤ Fetch LP Balance
            </button>
          </div>
          <input
            type="text"
            value={lpAddress}
            onChange={(e) => setLpAddress(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
            placeholder="0x..."
          />
          {lpBalance !== null && (
            <p className="text-cyan-200 text-sm mt-1">Wallet LP Balance: {lpBalance} tokens</p>
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
            <p className="text-cyan-200 text-sm">You are locking: {calculatedAmount} LP Tokens</p>
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
          onClick={handleNext}
          className="w-full py-3 mt-6 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-600 text-black"
        >
          Continue to Promo
        </button>
      </div>
    </div>
  );
}
