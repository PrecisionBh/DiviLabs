import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function EcosystemHome() {
  const features = [
    { title: "Dashboard", path: "/dashboard", desc: "Buy Divi & track reflections" },
    { title: "Vault", path: "/vault", desc: "Lock LP & team tokens" },
    { title: "Contract Creator", path: "/creator", desc: "Launch your own token (coming soon)" },
    { title: "Staking", path: "/staking", desc: "Stake & earn (coming soon)" },
    { title: "Audits", path: "/audit", desc: "Verify smart contracts (coming soon)" },
    { title: "Docs", path: "/docs", desc: "Explore the Divi ecosystem" },
  ];

  return (
    <div className="min-h-screen bg-[#070B17] text-[#00E5FF] px-4 py-10 md:px-12 md:py-16 flex flex-col items-center space-y-12">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[#00E5FF]">Divi Labs</h1>
        <h2 className="text-lg md:text-xl text-[#B0C4DE] italic">Choose your path below</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl w-full">
        {features.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-2xl p-6 bg-gradient-to-br from-[#0A1228] via-[#111c3a] to-[#0A1228] border-4 border-[#00E5FF] shadow-[inset_0_0_30px_rgba(0,229,255,0.2),_0_0_15px_#00E5FF] backdrop-blur-md text-center"
          >
            <Link to={item.path} className="flex flex-col items-center space-y-2">
              <div className="text-3xl font-bold text-[#00E5FF]">{item.title}</div>
              <p className="text-[#C2E9F9] text-sm">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
