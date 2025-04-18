import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CountdownBox from "../components/CountdownBox";

export default function LandingPage() {
  console.log("LandingPage rendered");

  return (
    <div className="min-h-screen bg-[#070B17] text-[#00E5FF] px-4 py-8 md:px-6 md:py-12 flex flex-col items-center justify-center relative overflow-hidden space-y-20">
      <div className="text-center w-full">
        <h1 className="text-4xl md:text-6xl font-bold text-[#00E5FF] mb-4">Divi Labs</h1>
        <h2 className="text-lg md:text-xl text-[#B0C4DE] italic mb-4">The safer side of DeFi</h2>
        <p className="text-base md:text-lg text-[#C2E9F9] max-w-3xl mx-auto mb-6">
          Welcome to Divi — a next-gen ecosystem built on transparency, security, and simplicity.
          Whether you're here to explore, build, or buy, you're not alone. You’re part of the <span className="text-[#00E5FF] font-semibold">Divi Army</span> — a movement focused on doing DeFi right.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-[#00E5FF] text-black text-sm md:text-base font-bold py-2 px-6 rounded-full shadow-[0_0_10px_#00E5FF] transition-all duration-300"
        >
          <Link to="/ecosystem">Enter Ecosystem</Link>
        </motion.div>
      </div>

      {/* 🔥 Countdown timer placed below button */}
      <CountdownBox />
    </div>
  );
}
