import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TokenDetails() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    symbol: "",
    supply: "",
    decimals: 18, // fixed
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.symbol || !form.supply) {
      alert("Please fill out all fields.");
      return;
    }

    localStorage.setItem("divi_token_info", JSON.stringify(form));
    navigate("/contract-creator/tokenomics");
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12 flex justify-center items-start">
      <div className="w-full max-w-xl">
        <h2 className="text-3xl font-bold text-cyan-400 drop-shadow text-center mb-6">
          Token Info
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-[#111827] p-6 rounded-2xl border border-cyan-500 shadow-[0_0_30px_#00e5ff55]"
        >
          <div>
            <label className="block text-sm mb-1 font-semibold">Token Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="MyToken"
              className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-semibold">Token Symbol</label>
            <input
              name="symbol"
              value={form.symbol}
              onChange={handleChange}
              required
              placeholder="MTK"
              className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-semibold">Total Supply</label>
            <input
              name="supply"
              value={form.supply}
              onChange={handleChange}
              required
              placeholder="1000000"
              className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-semibold">Decimals</label>
            <input
              name="decimals"
              value={form.decimals}
              readOnly
              disabled
              className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-gray-400 border border-gray-600 cursor-not-allowed"
            />
          </div>

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
