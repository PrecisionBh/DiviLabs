import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../assets/starfield.css";

const DIVI_TOKEN = "0xbe79a7BAB5aD6682F9cc8deBBDaa9C7256ECbE55";
const LP_PAIR = "0xDFE9c6e9C27F68CF7856E8342Dd58c13ce5364Be";
const BNB_FEE_WALLET = "0x8f9c1147b2c710F92BE65956fDE139351123d27E";
const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

const LP_ABI = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)"
];

const DIVI_ABI = [
  "function totalReflections() view returns (uint256)",
  "function totalSupply() view returns (uint256)",
];

export default function DiviDashboard() {
  const [bnbUsd, setBnbUsd] = useState(null);
  const [price, setPrice] = useState("...");
  const [liquidity, setLiquidity] = useState("...");
  const [marketCap, setMarketCap] = useState("...");
  const [holderCount, setHolderCount] = useState("...");
  const [reflectionsUSD, setReflectionsUSD] = useState("...");
  const [reflectionsDIVI, setReflectionsDIVI] = useState("...");
  const [bnbAmount, setBnbAmount] = useState("");
  const [diviAmount, setDiviAmount] = useState("");
  const [isSelling, setIsSelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [slippage, setSlippage] = useState(10);

  useEffect(() => {
    fetchBNBPrice();
    fetchStats();
    fetchHolderCount();
  }, []);

  useEffect(() => {
    if (!bnbAmount || isNaN(bnbAmount)) {
      setDiviAmount("");
      return;
    }

    const diviPerBnb = parseFloat(price);
    const input = parseFloat(bnbAmount);

    if (!isSelling) {
      const raw = input * diviPerBnb;
      const estimated = raw * (1 - 0.06);
      setDiviAmount(estimated.toFixed(2));
    } else {
      const raw = input / diviPerBnb;
      const estimated = raw * (1 - 0.06);
      setDiviAmount(estimated.toFixed(4));
    }
  }, [bnbAmount, price, isSelling]);

  const fetchBNBPrice = async () => {
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
      const data = await res.json();
      setBnbUsd(data.binancecoin.usd);
    } catch {
      setBnbUsd(null);
    }
  };

  const fetchStats = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const lp = new ethers.Contract(LP_PAIR, LP_ABI, provider);
      const divi = new ethers.Contract(DIVI_TOKEN, DIVI_ABI, provider);

      const [reserve0, reserve1] = await lp.getReserves();
      const token0 = await lp.token0();
      const bnbIs0 = token0.toLowerCase() === WBNB.toLowerCase();

      const bnbReserve = Number(bnbIs0 ? reserve0 : reserve1) / 1e18;
      const diviReserve = Number(bnbIs0 ? reserve1 : reserve0) / 1e18;

      const diviPerBnb = diviReserve / bnbReserve;
      setPrice(diviPerBnb.toFixed(6));
      setLiquidity((bnbReserve * bnbUsd * 2).toLocaleString(undefined, { maximumFractionDigits: 0 }));

      const totalSupply = await divi.totalSupply();
      const mc = (Number(totalSupply) / 1e18) * (bnbUsd / diviPerBnb);
      setMarketCap(mc.toLocaleString(undefined, { maximumFractionDigits: 0 }));

      const totalReflections = await divi.totalReflections();
      const amount = Number(totalReflections) / 1e18;
      setReflectionsDIVI(amount.toLocaleString(undefined, { maximumFractionDigits: 0 }));
      setReflectionsUSD((amount * (bnbUsd / diviPerBnb)).toFixed(2));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHolderCount = async () => {
    try {
      const res = await fetch(`https://api.bscscan.com/api?module=token&action=tokenholdercount&contractaddress=${DIVI_TOKEN}&apikey=8YBYX361A22TM6683Q92N9817GFR7HGM8Z`);
      const data = await res.json();
      if (data.status === "1") setHolderCount(data.result);
    } catch (err) {
      console.error("Holder fetch failed:", err);
    }
  };

  const handleBuyClick = () => {
    if (bnbAmount === "" || isNaN(bnbAmount)) return;
    setShowConfirm(true);
  };

  const confirmSwap = async () => {
    // logic for sending swap here
    setShowConfirm(false);
  };

  const cancelSwap = () => {
    setShowConfirm(false);
  };

  const swapDirection = () => {
    setIsSelling(!isSelling);
    setBnbAmount(diviAmount);
    setDiviAmount(bnbAmount);
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white relative overflow-hidden px-6 py-10">

      {/* Reflections Box */}
      <div className="z-50 text-cyan-300 text-sm w-full max-w-xs mx-auto md:absolute md:top-6 md:left-6 md:mx-0 mb-6 md:mb-0">
        <div className="font-semibold mb-1 text-center md:text-left">Total Reflections Sent</div>
        <div className="bg-[#0e1016] border border-cyan-400 px-6 py-4 rounded-xl shadow-[0_0_15px_#00e5ff50] text-center">
          <div className="text-2xl font-bold text-white">${reflectionsUSD}</div>
          <div className="text-sm text-cyan-300 mt-1">({reflectionsDIVI} DIVI)</div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          Divi Dashboard
        </h1>
        <p className="text-cyan-200 text-md md:text-lg mt-1 tracking-wide">Central Hub of the Divi Token</p>
      </div>

      {/* Metrics */}
      <div className="flex justify-center gap-6 md:gap-10 text-cyan-300 text-sm font-semibold mb-10 flex-wrap text-center">
        <div>Price: ${price}</div>
        <div>LP: ${liquidity}</div>
        <div>Market Cap: ${marketCap}</div>
        <div>Holders: {holderCount}</div>
      </div>

      {/* Swap Box */}
      <div className="flex justify-center z-10 relative">
        <div className="bg-[#0e1016] border border-cyan-500 rounded-2xl p-6 shadow-[0_0_40px_#00e5ff90] w-full max-w-[420px] space-y-6">

          {/* Slippage & Settings */}
          <div className="flex justify-between items-center">
            <div className="text-cyan-300 font-semibold text-sm">Slippage: {slippage}%</div>
            <button
              onClick={() => {
                const s = prompt("Enter slippage % (e.g., 10 for 10%)", slippage.toString());
                if (!s) return;
                const value = parseFloat(s);
                if (!isNaN(value) && value >= 1 && value <= 50) setSlippage(value);
              }}
              className="text-cyan-300 underline text-sm hover:text-white"
            >
              Edit
            </button>
          </div>

          {/* Input */}
          <div className="bg-[#121a26] px-5 py-4 rounded-xl border border-cyan-500 flex items-center justify-between">
            <span className="text-white font-semibold text-base">{isSelling ? "DIVI" : "BNB"}</span>
            <input
              type="number"
              placeholder="0.00"
              value={bnbAmount}
              onChange={(e) => setBnbAmount(e.target.value)}
              className="w-32 bg-transparent text-right text-white font-bold text-2xl outline-none appearance-none"
              style={{ MozAppearance: "textfield" }}
            />
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center relative">
            <div className="absolute w-full h-[1px] bg-cyan-800 opacity-30" />
            <button
              onClick={swapDirection}
              className="z-10 bg-[#0e1016] px-3 text-xl text-cyan-300 hover:text-cyan-100 transition"
              title="Swap Direction"
            >
              ⬍
            </button>
          </div>

          {/* Output */}
          <div className="bg-[#121a26] px-5 py-4 rounded-xl border border-cyan-500 flex items-center justify-between">
            <span className="text-white font-semibold text-base">{isSelling ? "BNB" : "DIVI"}</span>
            <input
              type="text"
              value={diviAmount}
              placeholder="0.00"
              className="w-32 bg-transparent text-right text-white font-bold text-2xl outline-none"
              disabled
            />
          </div>

          <button
            onClick={handleBuyClick}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-[0_0_15px_#00e5ff90] transition"
          >
            {isSelling ? "Sell Now" : "Buy Now"}
          </button>
        </div>
      </div>

      {/* Token Info Link */}
      <div className="flex justify-center mt-8">
        <a
          href="/token-info"
          className="px-6 py-3 border border-cyan-500 text-cyan-300 hover:bg-cyan-500 hover:text-black transition rounded-full shadow-[0_0_15px_#00e5ff70] font-bold"
        >
          View Divi Tokenomics
        </a>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#000000cc] z-50 flex items-center justify-center px-4">
          <div className="bg-[#0e1016] border border-cyan-500 p-6 rounded-2xl w-full max-w-md shadow-[0_0_30px_#00e5ff80]">
            <h2 className="text-xl font-bold text-cyan-300 mb-4 text-center">Confirm {isSelling ? "Sell" : "Buy"}</h2>
            <p className="text-sm text-white mb-2">You are about to {isSelling ? "sell" : "buy"} using:</p>
            <div className="bg-[#1a1f2b] p-3 rounded-lg mb-3 text-cyan-200 text-sm space-y-1">
              <div>Slippage: {slippage}%</div>
              <div>BNB {isSelling ? "Received" : "Spent"}: {bnbAmount}</div>
              <div>DIVI {isSelling ? "Spent" : "Received"}: {diviAmount}</div>
              <div>BNB Fee (0.5%): {(bnbAmount * 0.005).toFixed(6)} BNB</div>
            </div>
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={cancelSwap}
                className="w-1/2 py-2 border border-cyan-500 text-cyan-300 rounded-lg hover:bg-cyan-600 hover:text-black transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwap}
                className="w-1/2 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg shadow transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
