"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductManager from "@/components/admin/ProductManager";
import ContactManager from "@/components/admin/ContactManager";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://soul-api-two.vercel.app";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"products" | "contacts">("products");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("soul_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Invalid token");
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("soul_token");
        localStorage.removeItem("soul_user");
        router.push("/login");
      } finally {
        setChecking(false);
      }
    };

    verifyToken();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("soul_token");
    localStorage.removeItem("soul_user");
    router.push("/login");
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a3e] via-[#1A1A9E] to-[#12127A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10 text-white/60" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-white/50 text-sm">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0c0c2d] flex">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0c0c2d]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {activeTab === "products" ? "Kelola Produk" : "Kelola Kontak"}
              </h1>
              <p className="text-white/40 text-sm mt-0.5">
                {activeTab === "products"
                  ? "Tambah, edit, atau hapus produk kopi Anda"
                  : "Perbarui informasi kontak yang tampil di website"}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/50 text-xs">Admin Online</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="p-6">
          {activeTab === "products" ? <ProductManager /> : <ContactManager />}
        </div>
      </main>
    </div>
  );
}
