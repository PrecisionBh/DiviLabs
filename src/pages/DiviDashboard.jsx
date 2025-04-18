import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../assets/starfield.css";
import CountdownBox from "../components/CountdownBox";


const DIVI_TOKEN = "0x32Cf9c7fceb015165456742aDdcaDFFC8c2bd104";
const LP_PAIR = "0x79FEA4A1FC0B308D99a05b25B5FFA8a35009F294";
const ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
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
  "function approve(address spender, uint amount) external returns (bool)"
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
    const interval = setInterval(() => {
      fetchBNBPrice();
      fetchStats();
      fetchHolderCount();
    }, 10000); // ⏱ every 10 seconds
  
    return () => clearInterval(interval); // cleanup on unmount
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
  
      // Get reserves + token order
      const [reserve0, reserve1] = await lp.getReserves();
      const token0 = await lp.token0();
      const token1 = await lp.token1();
  
      console.log("Reserves:", reserve0.toString(), reserve1.toString());
      console.log("token0:", token0);
      console.log("token1:", token1);
  
      let bnbReserveRaw, diviReserveRaw;
  
      if (token0.toLowerCase() === WBNB.toLowerCase()) {
        bnbReserveRaw = reserve0;
        diviReserveRaw = reserve1;
      } else if (token1.toLowerCase() === WBNB.toLowerCase()) {
        bnbReserveRaw = reserve1;
        diviReserveRaw = reserve0;
      } else {
        throw new Error("WBNB not found in LP pair");
      }
  
      const bnbReserve = Number(bnbReserveRaw) / 1e18;
      const diviReserve = Number(diviReserveRaw) / 1e18;
  
      console.log("Parsed BNB Reserve:", bnbReserve);
      console.log("Parsed DIVI Reserve:", diviReserve);
  
      // Get BNB price inline
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd");
      const data = await res.json();
      const bnbUsd = data?.binancecoin?.usd;
  
      if (!bnbUsd) {
        console.warn("BNB price not available, skipping calculations.");
        return;
      }
  
      // ✅ Calculate DIVI price in USD
      const tokensPerBnb = diviReserve / bnbReserve;
      const diviPriceUsd = bnbUsd / tokensPerBnb;
  
      setPrice(diviPriceUsd.toFixed(6)); // ✅ THIS LINE is crucial
  
      // ✅ Set other dashboard metrics
      setLiquidity((bnbReserve * bnbUsd * 2).toLocaleString(undefined, { maximumFractionDigits: 0 }));
  
      const totalSupply = await divi.totalSupply();
      const mc = (Number(totalSupply) / 1e18) * diviPriceUsd;
      setMarketCap(mc.toLocaleString(undefined, { maximumFractionDigits: 0 }));
  
      const totalReflections = await divi.totalReflections();
      const amount = Number(totalReflections) / 1e18;
      setReflectionsDIVI(amount.toLocaleString(undefined, { maximumFractionDigits: 0 }));
      setReflectionsUSD((amount * diviPriceUsd).toFixed(2));
    } catch (err) {
      console.error("fetchStats failed:", err);
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
    try {
      if (!window.ethereum) return alert("Connect wallet first");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const router = new ethers.Contract(
        ROUTER,
        [
          "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable",
          "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)"
        ],
        signer
      );

      const feeAmount = parseFloat(bnbAmount) * 0.005;
      const netAmount = parseFloat(bnbAmount) - feeAmount;

      if (!isSelling) {
        const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
          0,
          [WBNB, DIVI_TOKEN],
          await signer.getAddress(),
          Math.floor(Date.now() / 1000) + 60,
          { value: ethers.parseEther(netAmount.toFixed(6)) }
        );
        await tx.wait();

        const feeTx = await signer.sendTransaction({
          to: BNB_FEE_WALLET,
          value: ethers.parseEther(feeAmount.toFixed(6))
        });
        await feeTx.wait();
      } else {
        const token = new ethers.Contract(DIVI_TOKEN, DIVI_ABI, signer);
        const amountIn = ethers.parseEther(bnbAmount);

        const approvalTx = await token.approve(ROUTER, amountIn);
        await approvalTx.wait();

        const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
          amountIn,
          0,
          [DIVI_TOKEN, WBNB],
          await signer.getAddress(),
          Math.floor(Date.now() / 1000) + 60
        );
        await tx.wait();
      }

      setShowConfirm(false);
      setBnbAmount("");
      setDiviAmount("");
    } catch (err) {
      console.error("Swap failed:", err);
      alert("Swap failed: " + err.message);
    }
  };

  const cancelSwap = () => setShowConfirm(false);
  const swapDirection = () => {
    setIsSelling(!isSelling);
    setBnbAmount(diviAmount);
    setDiviAmount(bnbAmount);
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-10">
  
      {/* ✅ Reflections Box */}
      <div className="z-50 text-cyan-300 text-sm w-full max-w-xs mx-auto md:absolute md:top-6 md:left-6 md:mx-0 mb-6 md:mb-0">
        <div className="font-semibold mb-1 text-center md:text-left">Total Reflections Sent</div>
        <div className="bg-[#0e1016] border border-cyan-400 px-6 py-4 rounded-xl shadow-[0_0_15px_#00e5ff50] text-center">
          <div className="text-2xl font-bold text-white">${reflectionsUSD}</div>
          <div className="text-sm text-cyan-300 mt-1">({reflectionsDIVI} DIVI)</div>
        </div>
      </div>
  
      {/* ✅ Title */}
      <div className="text-center mb-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff]">
          Divi Dashboard
        </h1>
        <p className="text-cyan-200 text-md md:text-lg mt-1 tracking-wide">Central Hub of the Divi Token</p>
      </div>
  
      {/* ✅ Countdown Timer */}
      <CountdownBox />
  
      <div className="flex justify-center gap-6 md:gap-10 text-cyan-300 text-sm font-semibold mb-10 flex-wrap text-center">
        <div>Price: ${price}</div>
        <div>LP: ${liquidity}</div>
        <div>Market Cap: ${marketCap}</div>
        <div>Holders: {holderCount}</div>
      </div>
  
      <div className="flex justify-center z-10 relative">
        <div className="bg-[#0e1016] border border-cyan-500 rounded-2xl p-6 shadow-[0_0_40px_#00e5ff90] w-full max-w-[420px] space-y-6">
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
  
      <div className="flex justify-center mt-8">
        <a
          href="/token-info"
          className="px-6 py-3 border border-cyan-500 text-cyan-300 hover:bg-cyan-500 hover:text-black transition rounded-full shadow-[0_0_15px_#00e5ff70] font-bold"
        >
          View Divi Tokenomics
        </a>
      </div>
  
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