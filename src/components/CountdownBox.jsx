import React, { useEffect, useState } from "react";

export default function CountdownBox() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("2025-06-01T15:00:00-04:00"); // 3PM EST

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-md mx-auto mt-12 px-6 py-6 rounded-2xl border border-cyan-400 bg-[#0e1016] shadow-[0_0_25px_#00e5ff70] text-white text-center">
      <h2 className="text-2xl font-bold text-cyan-400 drop-shadow-[0_0_8px_#00e5ff] mb-4">
        Countdown to Divi Token Launch
      </h2>
      <div className="text-4xl font-extrabold tracking-wide space-x-2 text-cyan-300">
        <span>{String(timeLeft.days).padStart(2, "0")}d</span>
        <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
        <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
        <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
      </div>
    </div>
  );
}
