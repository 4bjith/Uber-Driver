import React from "react";
import { Link } from "react-router-dom";
import { FiShield, FiCheckCircle } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-black border-t border-neutral-200 dark:border-zinc-800 py-8 px-4 sm:px-6 lg:px-8 mt-auto transition-colors font-sans">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
        
        {/* Brand & Copyright */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-xs">
            V
          </div>
          <span className="font-extrabold text-black dark:text-white">
            VOYAGO DRIVER WING
          </span>
          <span className="text-neutral-400">•</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>

        {/* Badges & System Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-[11px] font-bold text-black dark:text-white">
            <FiShield />
            <span>Cashfree Escrow Payouts</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-black dark:text-white">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            <span>Telemetry Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
