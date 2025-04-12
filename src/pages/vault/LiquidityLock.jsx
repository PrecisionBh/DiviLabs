import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseUnits, parseEther } from "ethers";

const CONTRACT_ADDRESS = "0x27Ce0569B5f865A1C1F6fA36D66cE07ca329ce35";
const CONTRACT_ABI = [
  // Contract ABI (same as before)
];

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export default function LiquidityLock() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [lpAddress, setLpAddress] = useState("");
  const [lpBalance, setLpBalance] = useState(null);
  const [percentageToLock, setPercentageToLock] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [lockName, setLockName] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");

  const baseCost = 0.25;
  const totalCost = baseCost.toFixed(2);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      console.log("Connected Wallet:", accounts[0]);
      setWalletAddress(accounts[0]);
    }
  };

  const fetchLpBalance = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not found");
        return;
      }

      if (!lpAddress.startsWith("0x") || !walletAddress) {
        alert("Enter a valid LP token address and connect your wallet.");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const token = new Contract(lpAddress, ERC20_ABI, provider);

      const rawBalance = await token.balanceOf(walletAddress);
      const decimals = await token.decimals();

      const divisor = BigInt(10) ** BigInt(decimals);
      const formatted = Number((rawBalance * 10000n) / divisor) / 10000;

      console.log("LP Balance:", formatted);
      setLpBalance(formatted.toFixed(4));
    } catch (err) {
      console.error("Error fetching LP balance:", err);
      alert("Error fetching LP balance. Check the console for details.");
    }
  };

  const handlePercentageChange = (value) => {
    console.log("Percentage to Lock:", value);
    setPercentageToLock(value);

    const percent = parseFloat(value);

    if (!isNaN(percent) && percent >= 1 && percent <= 100 && lpBalance !== null) {
      console.log("LP Balance for Calculation:", lpBalance);

      const amount = ((lpBalance * percent) / 100).toFixed(4);
      console.log("Calculated Amount:", amount);
      setCalculatedAmount(amount);
    } else {
      setCalculatedAmount(""); // Clear if percentage is invalid
    }
  };

  const isValid = () => {
    if (!lpAddress || !lpAddress.startsWith("0x")) {
      return false; // Invalid LP address
    }

    const percent = parseFloat(percentageToLock);
    if (isNaN(percent) || percent <= 0 || percent > 100) {
      return false; // Invalid percentage
    }

    const amount = parseFloat(calculatedAmount);
    if (isNaN(amount) || amount <= 0) {
      return false; // Invalid calculated amount
    }

    if (!unlockDate) {
      return false; // No unlock date set
    }

    const [month, day, year] = unlockDate.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const selected = new Date(formattedDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected <= today) {
      return false; // Unlock date in the past
    }

    return true;
  };

  const handleLock = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const unlockTimestamp = Math.floor(new Date(unlockDate + "T00:00:00").getTime() / 1000);
      const amountInWei = parseUnits(calculatedAmount, 18);
      const fee = parseEther(totalCost);

      const unlockers = [walletAddress];
      const lockType = 0;

      const tx = await contract.lockTokens(
        lpAddress,
        amountInWei,
        unlockTimestamp,
        lockName,
        unlockers,
        lockType,
        false, 
        false,
        "",
        websiteLink,
        socialLink,
        { value: fee }
      );

      await tx.wait();
      alert("Liquidity successfully locked!");
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction failed.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-cyan-400 text-center">Lock Liquidity Pair</h1>

        {/* LP Token Address Section */}
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

        {/* Percentage to Lock */}
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

        {/* Unlock Date */}
        <div className="space-y-2">
          <label className="text-cyan-300 font-medium">Unlock Date</label>
          <input
            type="date"
            value={unlockDate}
            onChange={(e) => setUnlockDate(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
          />
        </div>

        {/* Optional Lock Name */}
        <input
          type="text"
          value={lockName}
          onChange={(e) => setLockName(e.target.value)}
          placeholder="Optional Lock Name"
          className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
        />

        {/* Website and Social Links */}
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

        {/* Lock Button */}
        <button
          onClick={handleLock}
          disabled={!isValid()}
          className={`w-full py-3 mt-6 rounded-xl font-bold transition ${isValid() ? "bg-cyan-500 hover:bg-cyan-600 text-black" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
        >
          Approve & Lock LP Tokens
        </button>
      </div>
    </div>
  );
}
