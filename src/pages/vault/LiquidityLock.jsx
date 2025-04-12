import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, parseUnits, parseEther } from "ethers";

const CONTRACT_ADDRESS = "0x27Ce0569B5f865A1C1F6fA36D66cE07ca329ce35";
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_nft", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "lockId", "type": "uint256" }],
    "name": "approveManualUnlock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "lockId", "type": "uint256" }],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "lockId", "type": "uint256" }],
    "name": "claimEmergencyUnlock",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "lockId", "type": "uint256" }],
    "name": "forceUnlockByOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "unlockTime", "type": "uint256" },
      { "internalType": "string", "name": "lockName", "type": "string" },
      { "internalType": "address[]", "name": "unlockers", "type": "address[]" },
      { "internalType": "uint8", "name": "lockType", "type": "uint8" },
      { "internalType": "bool", "name": "withNFT", "type": "bool" },
      { "internalType": "string", "name": "metadataURI", "type": "string" },
      { "internalType": "string", "name": "website", "type": "string" },
      { "internalType": "string", "name": "social", "type": "string" },
      {
        "components": [
          { "internalType": "uint256", "name": "releaseTime", "type": "uint256" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "bool", "name": "claimed", "type": "bool" }
        ],
        "internalType": "struct DiviVaultLockerV2.VestingCheckpoint[]",
        "name": "checkpoints",
        "type": "tuple[]"
      }
    ],
    "name": "lockTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "lockId", "type": "uint256" }],
    "name": "startEmergencyUnlock",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address payable", "name": "to", "type": "address" }],
    "name": "withdrawFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
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
      console.log("Connected Wallet:", accounts[0]);
      setWalletAddress(accounts[0]);
      setMultiSigAddresses([accounts[0]]);
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
    const percent = parseFloat(value);
    setPercentageToLock(value);
    if (!isNaN(percent) && percent >= 1 && percent <= 100 && lpBalance !== null) {
      const amount = ((lpBalance * percent) / 100).toFixed(4);
      setCalculatedAmount(amount);
    } else {
      setCalculatedAmount("");
    }
  };

  const handleAddAddress = () => setMultiSigAddresses([...multiSigAddresses, ""]);
  const handleRemoveAddress = (index) =>
    setMultiSigAddresses(multiSigAddresses.filter((_, i) => i !== index));
  const handleAddressChange = (index, value) => {
    const updated = [...multiSigAddresses];
    updated[index] = value;
    setMultiSigAddresses(updated);
  };

  const isValid = () => {
    if (!lpAddress.startsWith("0x")) return false;

    const percent = parseFloat(percentageToLock);
    if (isNaN(percent) || percent <= 0 || percent > 100) return false;

    const amount = parseFloat(calculatedAmount);
    if (isNaN(amount) || amount <= 0) return false;

    if (!unlockDate) return false;

    const selected = new Date(unlockDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selected > today;
  };

  const handleLock = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
      const unlockTimestamp = Math.floor(new Date(unlockDate + "T00:00:00").getTime() / 1000);
      const amountInWei = parseUnits(calculatedAmount, 18);
      const fee = parseEther(totalCost);
  
      // Filter out empty or invalid addresses
      const validMultiSigAddresses = multiSigAddresses.filter(addr => addr && addr.startsWith("0x"));
      console.log("Valid Multi-Sig Addresses:", validMultiSigAddresses);
  
      // Determine lock type based on multiSigAddresses length
      const lockType = validMultiSigAddresses.length > 1 ? 1 : 0;
  
      const tx = await contract.lockTokens(
        lpAddress,
        amountInWei,
        unlockTimestamp,
        lockName,
        validMultiSigAddresses,
        lockType, // Pass lock type based on multi-sig or not
        false, // NFT flag (optional)
        false, // Additional flag (optional)
        "", // Metadata URI (optional)
        websiteLink, // Website link
        socialLink, // Social link
        { value: fee } // Fee in BNB
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

        {/* Multi-Sig Wallet Addresses */}
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

        {/* Display Multi-Sig Addresses */}
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

        {/* Estimated Fee */}
        <div className="text-cyan-200 font-bold text-lg mt-4">Estimated Fee: {totalCost} BNB</div>

        {/* Lock Button */}
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
