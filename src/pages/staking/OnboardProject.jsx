import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import StakingPoolFactory from "../../abis/StakingPoolFactory.json";
import ERC20 from "../../abis/ERC20.json";

const FACTORY_ADDRESS = "0xf5FaDE4954799794bb1a695766b46a8279F22077";

export default function OnboardProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    projectName: "",
    stakeToken: "",
    rewardToken: "",
    rewardAmount: "",
  });

  const [status, setStatus] = useState("");
  const [approved, setApproved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [txSummary, setTxSummary] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const approveToken = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(form.rewardToken, ERC20, signer);
      const amount = ethers.parseUnits(form.rewardAmount, 18);
      const tx = await token.approve(FACTORY_ADDRESS, amount);
      await tx.wait();
      setApproved(true);
      setStatus("✅ Approval successful");
    } catch (err) {
      console.error(err);
      setStatus("❌ Approval failed");
    }
  };

  const handleCreatePool = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FACTORY_ADDRESS, StakingPoolFactory, signer);
      const amount = ethers.parseUnits(form.rewardAmount, 18);

      const stakeToken = new ethers.Contract(form.stakeToken, ERC20, signer);
      const rewardToken = new ethers.Contract(form.rewardToken, ERC20, signer);
      const stakeTokenName = await stakeToken.name();
      const rewardTokenName = await rewardToken.name();

      const tx = await contract.createPool(form.stakeToken, form.rewardToken, amount, {
        value: ethers.parseEther("0.1"),
      });
      await tx.wait();

      setTxSummary({
        stakeToken: stakeTokenName,
        rewardToken: rewardTokenName,
        rewardAmount: form.rewardAmount,
      });

      setForm({ projectName: "", stakeToken: "", rewardToken: "", rewardAmount: "" });
      setApproved(false);
      setStatus("");
      setShowModal(true);
    } catch (err) {
      console.error("❌ Pool creation error:", err);
      setStatus("❌ Pool creation failed. Check tokens, approvals, or BNB fee.");
    }
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8 text-center drop-shadow">
          Onboard Your Token
        </h1>

        <div className="space-y-4">
          <Input label="Project Name" name="projectName" value={form.projectName} onChange={handleChange} />
          <Input label="Token to Stake (ERC-20 Address)" name="stakeToken" value={form.stakeToken} onChange={handleChange} />
          <Input label="Reward Token Address" name="rewardToken" value={form.rewardToken} onChange={handleChange} />
          <Input label="Reward Token Amount" name="rewardAmount" value={form.rewardAmount} onChange={handleChange} />
        </div>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-cyan-300">💰 0.1 BNB onboarding fee will be charged during pool creation.</p>

          {!approved ? (
            <button onClick={approveToken} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded-xl shadow-lg">
              Approve Reward Token
            </button>
          ) : (
            <button onClick={handleCreatePool} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded-xl shadow-lg animate-pulse">
              Create Staking Pool
            </button>
          )}

          <p className="text-red-400 text-sm font-medium mt-2">{status}</p>

          <div className="mt-6 text-center">
            <button onClick={() => navigate("/staking/start")} className="text-cyan-300 underline hover:text-cyan-100">
              ← Back to Staking Hub
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#0e1016] border border-cyan-500 rounded-2xl p-8 max-w-md text-center shadow-[0_0_40px_#00e5ff99]">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">✅ Pool Created Successfully!</h2>
            <p className="text-cyan-100 mb-1"><strong>Stake Token:</strong> {txSummary.stakeToken}</p>
            <p className="text-cyan-100 mb-1"><strong>Reward Token:</strong> {txSummary.rewardToken}</p>
            <p className="text-cyan-100 mb-4"><strong>Reward Amount:</strong> {txSummary.rewardAmount}</p>
            <button
              onClick={() => {
                setShowModal(false);
                navigate("/staking/pools");
              }}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded-xl mt-4"
            >
              Go to My Pool Dashboard →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-cyan-200 text-sm mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-xl bg-[#1e293b] text-white border border-cyan-500"
      />
    </div>
  );
}
