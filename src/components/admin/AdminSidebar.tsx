"use client";

import { Coffee, Package, Phone, LogOut, X, Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface AdminSidebarProps {
  activeTab: "products" | "contacts";
  onTabChange: (tab: "products" | "contacts") => void;
  onLogout: () => void;
}

export default function AdminSidebar({ activeTab, onTabChange, onLogout }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "products" as const, label: "Produk", icon: Package },
    { id: "contacts" as const, label: "Kontak", icon: Phone },
  ];

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center text-white"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-30" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0a0a2a] border-r border-white/[0.06] flex flex-col z-40 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 bg-white flex-shrink-0 relative">
              <Image src="/images/soul_coffee_logo.jpeg" alt="Logo" width={40} height={40} className="object-contain w-full h-full" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm tracking-wider">SOUL COFFEE</h2>
              <p className="text-white/30 text-[10px] font-semibold tracking-widest uppercase">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase px-3 mb-3">Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { onTabChange(item.id); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"}`}>
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : ""}`} />
                {item.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <a href="https://soul-coffe.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-white/40 hover:text-white/70 text-sm transition-colors rounded-xl hover:bg-white/[0.04] mb-1">
            <Coffee className="w-4 h-4" />Lihat Website
          </a>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 text-sm transition-all duration-200 rounded-xl">
            <LogOut className="w-4 h-4" />Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
