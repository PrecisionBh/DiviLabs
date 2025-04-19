import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const BSC_API_KEY = "8YBYX361A22TM6683Q92N9817GFR7HGM8Z";
const FEE_WALLET = "0x8f9c1147b2c710F92BE65956fDE139351123d27E";
const DIVI_CA = "0x32cf9c7fceb015165456742addcadffc8c2bd104";

export default function VerifiedAuditForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tokenName: "",
    contractAddress: "",
    explorer: "",
    telegram: "",
    website: "",
    email: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { tokenName, contractAddress, explorer, email } = form;
    if (!tokenName || !contractAddress || !explorer || !email) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true);

      if (!window.ethereum) throw new Error("MetaMask not detected.");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: FEE_WALLET,
        value: ethers.parseEther("0.1"),
      });
      await tx.wait();

      const response = await fetch(`https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${BSC_API_KEY}`);
      const data = await response.json();

      if (!data.result || !data.result[0] || !data.result[0].SourceCode) {
        setError("❌ Contract source code not verified on BscScan.");
        setLoading(false);
        return;
      }

      const source = data.result[0].SourceCode;
      const score = calculateAuditScore(source, form);

      const auditReport = {
        tokenName: form.tokenName,
        contractAddress: contractAddress.toLowerCase(),
        explorer: form.explorer,
        telegram: form.telegram,
        website: form.website,
        email: form.email,
        notes: form.notes,
        score,
        timestamp: Date.now()
      };

      await addDoc(collection(db, "audits"), auditReport);
      navigate("/auditor/verified-results");
    } catch (err) {
      console.error("Audit Error:", err);
      setError("❌ Payment failed or contract fetch error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h2 className="text-4xl font-bold text-cyan-400 drop-shadow mb-6 text-center">
          Verified Audit Request
        </h2>
        <p className="text-cyan-200 text-center mb-8">
          Only submit verified contracts with a valid BscScan URL. This helps us ensure safety and accuracy.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Token Name" name="tokenName" value={form.tokenName} onChange={handleChange} required />
          <Input label="Contract Address" name="contractAddress" value={form.contractAddress} onChange={handleChange} required />
          <Input label="Explorer URL (BscScan)" name="explorer" value={form.explorer} onChange={handleChange} required />
          <Input label="Telegram" name="telegram" value={form.telegram} onChange={handleChange} />
          <Input label="Website" name="website" value={form.website} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <TextArea label="Notes or Additional Info" name="notes" value={form.notes} onChange={handleChange} />

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {loading && <p className="text-cyan-300 text-sm animate-pulse">Processing audit, please wait...</p>}

          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-xl shadow-lg"
          >
            Confirm Audit (0.1 BNB)
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", required }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-cyan-200">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white"
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-cyan-200">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white"
      />
    </div>
  );
}

function calculateAuditScore(source, form) {
  const lowered = source.toLowerCase();

  if (form.contractAddress.toLowerCase() === DIVI_CA) {
    return 85;
  }

  let score = 100;

  if (lowered.includes("mint")) score -= 20;
  if (lowered.includes("owner")) score -= 15;
  if (lowered.includes("delegatecall") || lowered.includes("proxy")) score -= 15;
  if (lowered.includes("blacklist")) score -= 10;

  if (form.telegram) score += 5;
  if (form.website) score += 5;
  if (form.contractAddress.startsWith("0x")) score += 5;
  if (source.length > 2000) score += 5;

  return Math.max(0, Math.min(100, score));
}
