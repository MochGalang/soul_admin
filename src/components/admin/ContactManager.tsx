"use client";

import { useState, useEffect } from "react";
import { Save, ExternalLink } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface Settings {
  whatsapp_number: string;
  instagram_link: string;
  email_address: string;
}

export default function ContactManager() {
  const [settings, setSettings] = useState<Settings>({ whatsapp_number: "", instagram_link: "", email_address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const token = typeof window !== "undefined" ? localStorage.getItem("soul_token") : null;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings`);
        const data = await res.json();
        setSettings({ whatsapp_number: data.whatsapp_number || "", instagram_link: data.instagram_link || "", email_address: data.email_address || "" });
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: "success", text: data.message });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Gagal menyimpan" });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="text-white/50 text-center py-20">Memuat pengaturan...</div>;

  return (
    <div className="max-w-2xl">
      {message.text && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${message.type === "success" ? "bg-green-500/15 border border-green-400/30 text-green-300" : "bg-red-500/15 border border-red-400/30 text-red-300"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* WhatsApp */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.625-1.475A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.169 0-4.189-.576-5.938-1.584l-.424-.254-2.744.877.879-2.682-.278-.44 A9.79 9.79 0 012.182 12c0-5.418 4.4-9.818 9.818-9.818S21.818 6.582 21.818 12s-4.4 9.818-9.818 9.818z"/></svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Nomor WhatsApp</h3>
              <p className="text-white/30 text-xs">Nomor WA yang terhubung di web (Gunakan kode negara: 628...)</p>
            </div>
          </div>
          <input type="text" value={settings.whatsapp_number} onChange={e => setSettings({...settings, whatsapp_number: e.target.value})}
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-green-400/40" 
            placeholder="62812345678" />
          {settings.whatsapp_number && (
            <a href={`https://api.whatsapp.com/send?phone=${settings.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-green-400/60 text-xs hover:text-green-400">
              <ExternalLink className="w-3 h-3" /> Test link
            </a>
          )}
        </div>

        {/* Instagram */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center">
              <svg className="w-5 h-5 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Instagram</h3>
              <p className="text-white/30 text-xs">Link profil Instagram</p>
            </div>
          </div>
          <input type="url" value={settings.instagram_link} onChange={e => setSettings({...settings, instagram_link: e.target.value})}
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-pink-400/40"
            placeholder="https://www.instagram.com/soulco.id" />
          {settings.instagram_link && (
            <a href={settings.instagram_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-pink-400/60 text-xs hover:text-pink-400">
              <ExternalLink className="w-3 h-3" /> Test link
            </a>
          )}
        </div>

        {/* Email */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Email</h3>
              <p className="text-white/30 text-xs">Alamat email kontak</p>
            </div>
          </div>
          <input type="email" value={settings.email_address} onChange={e => setSettings({...settings, email_address: e.target.value})}
            className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-blue-400/40"
            placeholder="hello@soulcoffee.id" />
        </div>

        {/* Save button */}
        <button type="submit" disabled={saving}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/30 disabled:opacity-50">
          <Save className="w-4 h-4" />
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
