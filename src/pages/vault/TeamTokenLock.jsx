import React, { useEffect, useState } from "react";
import { BrowserProvider, parseUnits, parseEther } from "ethers";

const CONTRACT_ADDRESS = "YOUR_LOCKER_CONTRACT_ADDRESS";
const CONTRACT_ABI = [/* your contract ABI here */];

export default function TeamTokenLock() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [tokenAddress, setTokenAddress] = useState("");
  const [lockAmount, setLockAmount] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [lockName, setLockName] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [multiSigAddresses, setMultiSigAddresses] = useState([""]);
  const [showTooltip, setShowTooltip] = useState(false);

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

  const handleAddAddress = () => {
    setMultiSigAddresses([...multiSigAddresses, ""]);
  };

  const handleAddressChange = (index, value) => {
    const updated = [...multiSigAddresses];
    updated[index] = value;
    setMultiSigAddresses(updated);
  };

  const handleRemoveAddress = (index) => {
    const updated = [...multiSigAddresses];
    updated.splice(index, 1);
    setMultiSigAddresses(updated);
  };

  const baseCost = 0.25;
  const multisigCost = 0.1 * (multiSigAddresses.length - 1);
  const totalCost = (baseCost + multisigCost).toFixed(2);

  const isValid = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(unlockDate).setHours(0, 0, 0, 0);
    return (
      tokenAddress.startsWith("0x") &&
      !isNaN(parseFloat(lockAmount)) &&
      parseFloat(lockAmount) > 0 &&
      unlockDate &&
      selectedDate > today
    );
  };

  const handleLock = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const unlockTimestamp = Math.floor(new Date(unlockDate).getTime() / 1000);
      const amountInWei = parseUnits(lockAmount, 18);
      const costInWei = parseEther(totalCost);

      const tx = await contract.lockTokens(
        tokenAddress,
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
        { value: costInWei }
      );

      await tx.wait();
      alert("Team tokens successfully locked!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-cyan-400 text-center">Lock Team Tokens</h1>

        <div className="space-y-4">
          <label className="block text-cyan-300 font-medium">Token Address</label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
            placeholder="0x..."
          />
        </div>

        <div className="space-y-4">
          <label className="block text-cyan-300 font-medium">Amount to Lock</label>
          <input
            type="number"
            value={lockAmount}
            onChange={(e) => setLockAmount(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
            placeholder="Enter token amount"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-cyan-300 font-medium">Unlock Date</label>
          <input
            type="date"
            value={unlockDate}
            onChange={(e) => setUnlockDate(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-cyan-300 font-medium">Optional Lock Name</label>
          <input
            type="text"
            value={lockName}
            onChange={(e) => setLockName(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
            placeholder="MyTeam-Lock"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-cyan-300 font-medium">Website</label>
          <input
            type="text"
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
            placeholder="https://yourproject.com (Optional)"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-cyan-300 font-medium">Social Link</label>
          <input
            type="text"
            value={socialLink}
            onChange={(e) => setSocialLink(e.target.value)}
            className="w-full bg-gray-900 text-white p-3 rounded-xl border border-cyan-500"
            placeholder="https://twitter.com/project (Optional)"
          />
        </div>

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

        <div className="text-cyan-200 font-bold text-lg mt-4">
          Estimated Fee: {totalCost} BNB
        </div>

        <button
          onClick={handleLock}
          disabled={!isValid()}
          className={`w-full py-3 mt-6 rounded-xl font-bold transition ${
            isValid()
              ? "bg-cyan-500 hover:bg-cyan-600 text-black"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Approve & Lock Team Tokens
        </button>
      </div>
    </div>
  );
}
