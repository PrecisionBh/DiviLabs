import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseUnits, parseEther } from "ethers";

const CONTRACT_ADDRESS = "YOUR_LOCKER_CONTRACT_ADDRESS";
const CONTRACT_ABI = [/* your contract ABI here */];
const ERC20_ABI = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"];

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
  const [multiSigAddresses, setMultiSigAddresses] = useState([""]);
  const [showTooltip, setShowTooltip] = useState(false);

  const baseCost = 0.25;
  const multisigCost = 0.1 * (multiSigAddresses.length - 1);
  const totalCost = (baseCost + multisigCost).toFixed(2);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      setMultiSigAddresses([accounts[0]]);
    }
  };

  const fetchLpBalance = async () => {
    try {
      if (!lpAddress.startsWith("0x") || !walletAddress) return;
      const provider = new BrowserProvider(window.ethereum);
      const token = new Contract(lpAddress, ERC20_ABI, provider);
      const rawBalance = await token.balanceOf(walletAddress);
      const decimals = await token.decimals();
      const formatted = parseFloat(rawBalance.toString()) / 10 ** decimals;
      setLpBalance(formatted.toFixed(2));
    } catch (err) {
      console.error("Failed to fetch LP balance", err);
    }
  };

  const handlePercentageChange = (value) => {
    const percent = parseFloat(value);
    setPercentageToLock(value);
    if (!isNaN(percent) && percent >= 1 && percent <= 100 && lpBalance !== null) {
      const amount = ((lpBalance * percent) / 100).toFixed(2);
      setCalculatedAmount(amount);
    } else {
      setCalculatedAmount("");
    }
  };

  const handleAddAddress = () => setMultiSigAddresses([...multiSigAddresses, ""]);
  const handleRemoveAddress = (index) => setMultiSigAddresses(multiSigAddresses.filter((_, i) => i !== index));
  const handleAddressChange = (index, value) => {
    const updated = [...multiSigAddresses];
    updated[index] = value;
    setMultiSigAddresses(updated);
  };

  const isValid = () => {
    const today = new Date();
    const selected = new Date(unlockDate);
    return (
      lpAddress.startsWith("0x") &&
      !isNaN(parseFloat(percentageToLock)) &&
      parseFloat(percentageToLock) > 0 &&
      parseFloat(percentageToLock) <= 100 &&
      selected > today &&
      calculatedAmount > 0
    );
  };

  const handleLock = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const unlockTimestamp = Math.floor(new Date(unlockDate).getTime() / 1000);
      const amountInWei = parseUnits(calculatedAmount, 18);
      const fee = parseEther(totalCost);

      const tx = await contract.lockTokens(
        lpAddress,
        amountInWei,
        unlockTimestamp,
        lockName,
        multiSigAddresses,
        multiSigAddresses.length > 1 ? multiSigAddresses.length : 0,
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
      console.error(err);
      alert("Transaction failed.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-cyan-400 text-center">Lock Liquidity Pair</h1>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-cyan-300 font-medium">Liquidity Pair Address</label>
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
          <label className="text-cyan-300 font-medium">Unlock Date</label>
          <input
            type="date"
            value={unlockDate}
            onChange={(e) => setUnlockDate(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
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

        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-cyan-300 font-medium">Multi-Sig Wallets (optional)</label>
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-cyan-400 text-sm"
            >
              ?
            </button>
          </div>
          {showTooltip && (
            <div className="bg-gray-800 text-white text-xs p-3 rounded-md mb-3 max-w-sm shadow-md">
              Multi-sig means the locked tokens cannot be withdrawn until <strong>all wallet addresses</strong> listed here approve the unlock. Divi Vault uses this system to ensure team funds require full consensus before release.
            </div>
          )}
          <button
            onClick={handleAddAddress}
            className="text-sm text-cyan-400 hover:underline mb-3 block text-left"
          >
            + Add Multi-Sig Wallet (+0.1 BNB)
          </button>
        </div>

        {multiSigAddresses.length > 1 &&
          multiSigAddresses.slice(1).map((addr, index) => (
            <div key={index + 1} className="relative mb-3">
              <input
                type="text"
                value={addr}
                onChange={(e) => handleAddressChange(index + 1, e.target.value)}
                className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
                placeholder="0x..."
              />
              <button
                onClick={() => handleRemoveAddress(index + 1)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-red-400"
              >
                ✕
              </button>
            </div>
          ))}

        <div className="text-cyan-200 font-bold text-lg mt-4">Estimated Fee: {totalCost} BNB</div>

        <button
          onClick={handleLock}
          disabled={!isValid()}
          className={`w-full py-3 mt-6 rounded-xl font-bold transition ${
            isValid()
              ? "bg-cyan-500 hover:bg-cyan-600 text-black"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Approve & Lock LP Tokens
        </button>
      </div>
    </div>
  );
}
