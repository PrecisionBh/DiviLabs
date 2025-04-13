import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import "../assets/starfield.css";

const routerAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const diviTokenAddress = "0xB5623308Cc34691233B7FfB1940da5f524AB36CB";
const lpAddress = "0xc5fF7bC375C1BD6668E69a2d5d2850d0E9BC3BF7";
const feeWallet = "0x8f9c1147b2c710F92BE65956fDE139351123d27E";

const LP_ABI = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)"
];

const DIVI_ABI = [
  "function totalReflections() view returns (uint256)",
  "function totalSupply() view returns (uint256)"
];

export default function DiviDashboard() {
  const [bnbUsd, setBnbUsd] = useState(null);
  const [bnbAmount, setBnbAmount] = useState("");
  const [bnbUsdAmount, setBnbUsdAmount] = useState("");
  const [inputMode, setInputMode] = useState("bnb");
  const [walletConnected, setWalletConnected] = useState(false);
  const [reflections, setReflections] = useState("...");
  const [reflectionsUsd, setReflectionsUsd] = useState("...");
  const [price, setPrice] = useState("...");
  const [liquidity, setLiquidity] = useState("...");
  const [marketCap, setMarketCap] = useState("...");
  const [holderCount, setHolderCount] = useState("...");
  const [estimatedDivi, setEstimatedDivi] = useState("0.00");
  const [slippage, setSlippage] = useState(10); // default slippage 10%

  useEffect(() => {
    fetchBNBPrice();
    fetchTokenStats();
  }, []);

  useEffect(() => {
    if (bnbUsd && !isNaN(bnbUsd)) {
      if (inputMode === "bnb" && bnbAmount) {
        const usd = parseFloat(bnbAmount) * parseFloat(bnbUsd);
        setBnbUsdAmount(usd.toFixed(2));
      } else if (inputMode === "usd" && bnbUsdAmount) {
        const bnb = parseFloat(bnbUsdAmount) / parseFloat(bnbUsd);
        setBnbAmount(bnb.toFixed(4));
      }
    }
  }, [bnbAmount, bnbUsdAmount, inputMode, bnbUsd]);

  useEffect(() => {
    if (bnbAmount && price && !isNaN(price)) {
      const diviEstimate = (parseFloat(bnbAmount) / parseFloat(price)) * 0.94;
      setEstimatedDivi(diviEstimate.toLocaleString(undefined, { maximumFractionDigits: 2 }));
    } else {
      setEstimatedDivi("0.00");
    }
  }, [bnbAmount, price]);
  const fetchBNBPrice = async () => {
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
      const data = await res.json();
      setBnbUsd(data?.binancecoin?.usd || null);
    } catch {
      setBnbUsd(null);
    }
  };

  const fetchTokenStats = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const lp = new ethers.Contract(lpAddress, LP_ABI, provider);
      const divi = new ethers.Contract(diviTokenAddress, DIVI_ABI, provider);

      const [reserve0, reserve1] = await lp.getReserves();
      const token0 = await lp.token0();
      const bnbIsToken0 = token0.toLowerCase() === "0x0000000000000000000000000000000000000000";
      const bnbReserve = bnbIsToken0 ? reserve0 : reserve1;
      const diviReserve = bnbIsToken0 ? reserve1 : reserve0;

      const bnbAmount = Number(bnbReserve) / 1e18;
      const diviAmount = Number(diviReserve) / 1e18;

      if (bnbAmount > 0 && diviAmount > 0) {
      const diviPricePerToken = bnbAmount / diviAmount;
      setPrice(diviPricePerToken.toFixed(6));

      const liquidityUsd = bnbAmount * bnbUsd * 2;
      setLiquidity(liquidityUsd.toLocaleString(undefined, { maximumFractionDigits: 0 }));

      const totalSupply = await divi.totalSupply();
      const mc = (Number(totalSupply) / 1e18) * diviPricePerToken;
      setMarketCap(mc.toLocaleString(undefined, { maximumFractionDigits: 0 }));
    } else {
      setPrice("0.00");
      setLiquidity("0");
      setMarketCap("0");
    }



      const liquidityUsd = (Number(bnbReserve) / 1e18) * bnbUsd * 2;
      setLiquidity(liquidityUsd.toLocaleString(undefined, { maximumFractionDigits: 0 }));

      const totalSupply = await divi.totalSupply();
      const mc = (Number(totalSupply) / 1e18) * (1 / diviPerBnb);
      setMarketCap(mc.toLocaleString(undefined, { maximumFractionDigits: 0 }));

      setHolderCount("382"); // Replace with on-chain if needed

      const totalReflections = await divi.totalReflections();
      const reflectionsAmount = Number(totalReflections) / 1e18;
      setReflections(reflectionsAmount.toLocaleString(undefined, { maximumFractionDigits: 0 }));
      setReflectionsUsd((reflectionsAmount * (1 / diviPerBnb)).toFixed(2));
    } catch (e) {
      console.error("Token stats error:", e);
    }
  };

  const handleConnect = async () => {
    try {
      if (!window.ethereum) return alert("MetaMask not found");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletConnected(true);
    } catch {
      alert("Failed to connect wallet");
    }
  };

  const handleSwap = async () => {
    if (!window.ethereum || !bnbAmount || isNaN(bnbAmount)) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const router = new ethers.Contract(routerAddress, [
      "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable"
    ], signer);

    const bnbInWei = ethers.parseEther(bnbAmount);
    const fee = bnbInWei * 5n / 1000n;
    const netBNB = bnbInWei - fee;

    const diviPerBnb = 1 / parseFloat(price);
    const rawDivi = parseFloat(ethers.formatEther(netBNB)) * diviPerBnb;
    const afterTax = rawDivi * 0.94;

    const confirm = window.confirm(
      `BNB Amount: ${bnbAmount} BNB\nFee (0.5%): ${ethers.formatEther(fee)} BNB\nEstimated DIVI (after 6% tax): ${afterTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}\nSlippage: ${slippage}%`
    );

    if (!confirm) return;

    await signer.sendTransaction({ to: feeWallet, value: fee });

    const path = ["0x0000000000000000000000000000000000000000", diviTokenAddress];
    const deadline = Math.floor(Date.now() / 1000) + 300;

    const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
      0,
      path,
      await signer.getAddress(),
      deadline,
      { value: netBNB }
    );

    await tx.wait();
    alert("Swap complete!");
  };
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="starfield" />
      {Array.from({ length: 150 }).map((_, i) => (
        <div key={i} className="star" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={`bright-${i}`} className="star-bright" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
      ))}

      {/* Header */}
      <div className="text-center pt-10 z-10 relative">
        <h1 className="text-5xl font-bold text-cyan-400 drop-shadow-[0_0_20px_#00e5ff]">Divi Labs</h1>
        <p className="text-gray-300 text-sm mt-2">The central hub for Divi Token</p>
      </div>

      {/* Token Info */}
      <div className="flex justify-center items-center gap-8 text-cyan-300 text-sm font-semibold mt-6 z-10 relative">
        <span>Price: ${price}</span>
        <span>LP: ${liquidity}</span>
        <span>Market Cap: ${marketCap}</span>
        <span>Holders: {holderCount}</span>
      </div>

      {/* Energy Line */}
      <div className="w-full h-1 bg-cyan-400 animate-pulse mt-2 mb-4 z-10 relative" />

      {/* Reflections Bubble */}
      <div className="absolute top-8 left-8 z-50">
        <div className="text-sm font-semibold text-cyan-300 mb-1">Total Reflections Sent</div>
        <div className="bg-black border border-cyan-400 text-cyan-300 font-bold py-2 px-4 rounded-xl text-center shadow-lg">
          ${reflectionsUsd}
          <div className="text-xs text-white">({reflections} DIVI)</div>
        </div>
      </div>

      {/* Connect Wallet */}
      <div className="fixed top-6 right-6 z-50">
        <button
          className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm rounded-xl shadow-lg transition animate-pulse-slow"
          onClick={handleConnect}
        >
          {walletConnected ? "Wallet Connected" : "Connect Wallet"}
        </button>
      </div>

      {/* Swap Box */}
      <div className="flex justify-center items-center mt-20 z-10 relative">
        <div className="bg-[#0e1016] border border-cyan-400 rounded-2xl p-6 shadow-[0_0_25px_#00e5ff60] w-[380px] space-y-6">

          {/* From BNB or USD */}
          <div>
            <label className="text-cyan-300 font-semibold">From</label>
            <input
              type="number"
              placeholder={inputMode === "bnb" ? "Enter BNB" : "Enter USD"}
              value={inputMode === "bnb" ? bnbAmount : bnbUsdAmount}
              onChange={(e) =>
                inputMode === "bnb" ? setBnbAmount(e.target.value) : setBnbUsdAmount(e.target.value)
              }
              className="w-full bg-gray-900 text-white p-3 rounded-xl mt-1 border border-cyan-600 outline-none"
            />
            <div
              className="text-xs text-cyan-300 mt-1 cursor-pointer hover:underline"
              onClick={() => setInputMode(inputMode === "bnb" ? "usd" : "bnb")}
            >
              ↕ Switch to {inputMode === "bnb" ? "USD" : "BNB"} input
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="text-white text-xl">⬇</div>
          </div>

          {/* To Receive */}
          <div>
            <label className="text-cyan-300 font-semibold">To Receive</label>
            <input
              type="text"
              value={estimatedDivi}
              disabled
              className="w-full bg-gray-900 text-white p-3 rounded-xl mt-1 border border-cyan-600 cursor-not-allowed"
            />
            <div className="text-xs text-gray-400 mt-1">~ Estimated DIVI after 6% tax</div>
          </div>

          {/* Swap Button */}
          <button
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl transition"
            onClick={handleSwap}
          >
            Swap
          </button>

          {/* Slippage Button */}
          <div className="text-center mt-3">
            <button
              className="text-sm text-cyan-300 hover:underline"
              onClick={() => {
                const newSlip = prompt("Enter slippage %", slippage);
                if (newSlip && !isNaN(newSlip) && newSlip >= 0 && newSlip <= 100) {
                  setSlippage(Number(newSlip));
                }
              }}
            >
              ⚙️ Slippage: {slippage}%
            </button>
          </div>
        </div>
      </div>

      {/* Back to Ecosystem */}
      <div className="flex justify-center mt-10 z-10 relative">
        <Link to="/ecosystem">
          <button className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow-lg transition">
            ← Back to Ecosystem
          </button>
        </Link>
      </div>
    </div>
  );
}


