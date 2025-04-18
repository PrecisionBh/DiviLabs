// src/pages/ContractCreator/ManualDeployForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredContract } from "../../lib/ContractStorage";

export default function ManualDeployForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    telegram: "",
    twitter: "",
    email: "",
    notes: "",
    ownerAddress: "",
  });
  const [tokenData, setTokenData] = useState(null);
  const [feePaid, setFeePaid] = useState(true);

  useEffect(() => {
    const lastId = localStorage.getItem("last_contract_id");
    const feeTx = localStorage.getItem("fee_tx_hash");

    if (!feeTx) {
      setFeePaid(false);
      return;
    }

    if (lastId) {
      const stored = getStoredContract(lastId);
      setTokenData(stored);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      tokenName: tokenData?.tokenInfo?.name,
      symbol: tokenData?.tokenInfo?.symbol,
      supply: tokenData?.tokenInfo?.supply,
      package: tokenData?.package,
    };

    try {
      const response = await fetch("https://formspree.io/f/mnnpkree", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("✅ Your deployment request was submitted! We'll reach out shortly.");
        navigate("/contract-creator/success");
      } else {
        alert("❌ Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("❌ An error occurred while submitting the form.");
    }
  };

  if (!feePaid) {
    return (
      <div className="min-h-screen bg-[#060a13] text-white flex flex-col items-center justify-center text-center px-6 py-12">
        <h2 className="text-3xl font-bold text-red-400 mb-4">Payment Required</h2>
        <p className="text-cyan-200 mb-6">
          You must complete payment before submitting a manual deploy request.
        </p>
        <button
          onClick={() => navigate("/contract-creator/final-review")}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-md"
        >
          Return to Payment
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-cyan-400 drop-shadow mb-6 text-center">
          Manual Deployment Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {tokenData && (
            <div className="bg-[#111827] p-4 rounded-xl text-cyan-200 text-sm mb-4 space-y-1">
              <p><strong>Token Name:</strong> {tokenData.tokenInfo?.name}</p>
              <p><strong>Symbol:</strong> {tokenData.tokenInfo?.symbol}</p>
              <p><strong>Total Supply:</strong> {tokenData.tokenInfo?.supply}</p>
              <p><strong>Package:</strong> {tokenData.package}</p>
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Telegram Username</label>
            <input
              name="telegram"
              required
              value={form.telegram}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white"
              placeholder="@yourhandle"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">X (Twitter) Handle</label>
            <input
              name="twitter"
              required
              value={form.twitter}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white"
              placeholder="@yourhandle"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email Address</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Your Wallet Address</label>
            <input
              name="ownerAddress"
              required
              value={form.ownerAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white"
              placeholder="0x..."
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Any Notes or Special Requests?</label>
            <textarea
              name="notes"
              rows={4}
              value={form.notes}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white"
              placeholder="Optional"
            />
          </div>

          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 w-full py-3 rounded-xl font-bold text-black shadow-lg"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
