import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdvancedOptions() {
  const navigate = useNavigate();

  const [options, setOptions] = useState({
    reflections: false,
    adjustableTaxes: false,
    antiBot: false,
    maxWallet: "",
    maxTx: "",
    highSellTax: "",
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setOptions({
      ...options,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNext = () => {
    const highSell = parseFloat(options.highSellTax);
    if (highSell > 20) {
      alert("High sell tax cannot exceed 20%.");
      return;
    }

    localStorage.setItem("divi_advanced_options", JSON.stringify(options));
    navigate("/contract-creator/final-review");
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white flex flex-col items-center px-6 py-12">
      <h2 className="text-4xl font-extrabold text-cyan-400 drop-shadow-[0_0_25px_#00e5ff] mb-8 text-center">
        Advanced Token Options
      </h2>

      <div className="w-full max-w-2xl bg-[#0f1522] border border-cyan-500 rounded-2xl p-8 shadow-[0_0_30px_#00e5ff40] space-y-6">
        {/* Reflections Toggle */}
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="reflections"
            checked={options.reflections}
            onChange={handleChange}
            className="accent-cyan-500 w-5 h-5"
          />
          <span className="text-cyan-200">Enable Reflections (Redistribute % of each tx to holders)</span>
        </label>

        {/* Adjustable Taxes */}
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="adjustableTaxes"
            checked={options.adjustableTaxes}
            onChange={handleChange}
            className="accent-cyan-500 w-5 h-5"
          />
          <span className="text-cyan-200">Allow Taxes to be Adjustable by Owner (up to 10%)</span>
        </label>

        {/* Anti-Bot */}
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="antiBot"
            checked={options.antiBot}
            onChange={handleChange}
            className="accent-cyan-500 w-5 h-5"
          />
          <span className="text-cyan-200">Enable Anti-Bot Protection (cooldown + blacklist)</span>
        </label>

        {/* Max Wallet */}
        <div>
          <label className="block text-cyan-300 font-semibold mb-1">Max Wallet % (optional)</label>
          <input
            type="number"
            name="maxWallet"
            value={options.maxWallet}
            onChange={handleChange}
            placeholder="e.g. 2"
            className="w-full p-3 bg-[#0d111c] border border-cyan-500 rounded-xl text-white"
          />
        </div>

        {/* Max Transaction */}
        <div>
          <label className="block text-cyan-300 font-semibold mb-1">Max Transaction % (optional)</label>
          <input
            type="number"
            name="maxTx"
            value={options.maxTx}
            onChange={handleChange}
            placeholder="e.g. 1"
            className="w-full p-3 bg-[#0d111c] border border-cyan-500 rounded-xl text-white"
          />
        </div>

        {/* High Sell Tax */}
        <div>
          <label className="block text-cyan-300 font-semibold mb-1">
            High Sell Tax % <span className="text-sm text-cyan-400">(Optional — max 20%)</span>
          </label>
          <input
            type="number"
            name="highSellTax"
            value={options.highSellTax}
            onChange={handleChange}
            placeholder="e.g. 15"
            className="w-full p-3 bg-[#0d111c] border border-cyan-500 rounded-xl text-white"
          />
        </div>

        <button
          onClick={handleNext}
          className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-black py-3 rounded-xl font-bold shadow-[0_0_20px_#00e5ff] transition"
        >
          Continue to Final Review
        </button>

        <p className="mt-6 text-sm text-cyan-200 text-center drop-shadow-[0_0_10px_#00e5ff80]">
          All taxes must remain under 10% for buys and sells. High sell tax is allowed once and cannot exceed 20%.
        </p>
      </div>
    </div>
  );
}
