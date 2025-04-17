import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Tokenomics() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    buyTax: "",
    sellTax: "",
    marketingWallet: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const buy = parseFloat(form.buyTax);
    const sell = parseFloat(form.sellTax);
    const wallet = form.marketingWallet;

    if (isNaN(buy) || isNaN(sell) || !wallet) {
      alert("Please fill in all fields with valid values.");
      return;
    }

    if (buy < 0 || buy > 10 || sell < 0 || sell > 10) {
      alert("Taxes must be between 0% and 10%.");
      return;
    }

    localStorage.setItem("divi_tokenomics", JSON.stringify(form));
    navigate("/contract-creator/pricing");
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12 flex justify-center items-start">
      <div className="w-full max-w-xl">
        <h2 className="text-3xl font-bold text-cyan-400 text-center drop-shadow mb-6">Tokenomics</h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-[#111827] p-6 rounded-2xl border border-cyan-500 shadow-[0_0_30px_#00e5ff55]"
        >
          <div>
            <label className="block text-sm mb-1 font-semibold">Buy Tax (%)</label>
            <input
              name="buyTax"
              value={form.buyTax}
              onChange={handleChange}
              type="number"
              min="0"
              max="10"
              step="0.1"
              placeholder="e.g. 5"
              required
              className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-semibold">Sell Tax (%)</label>
            <input
              name="sellTax"
              value={form.sellTax}
              onChange={handleChange}
              type="number"
              min="0"
              max="10"
              step="0.1"
              placeholder="e.g. 8"
              required
              className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-semibold">Marketing Wallet Address</label>
            <input
              name="marketingWallet"
              value={form.marketingWallet}
              onChange={handleChange}
              type="text"
              placeholder="0x..."
              required
              className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white"
            />
          </div>

          <p className="text-yellow-400 text-sm font-medium text-center">
            ⚠️ Disclaimer: Divi Labs will not create any token contract where the buy or sell tax exceeds 10%.
          </p>

          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
