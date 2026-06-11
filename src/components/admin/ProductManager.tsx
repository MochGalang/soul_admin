"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Upload, GripVertical, Package } from "lucide-react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  badge: string;
  badge_color: string;
  sort_order: number;
}

const BADGE_COLORS = [
  { label: "Amber", value: "bg-amber-500" },
  { label: "Rose", value: "bg-rose-600" },
  { label: "Purple", value: "bg-purple-600" },
  { label: "Green", value: "bg-green-600" },
  { label: "Blue", value: "bg-blue-600" },
  { label: "Red", value: "bg-red-600" },
];

const emptyForm: Omit<Product, "id"> = {
  name: "", description: "", price: "", image_url: "", badge: "", badge_color: "bg-amber-500", sort_order: 0,
};

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const token = typeof window !== "undefined" ? localStorage.getItem("soul_token") : null;

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const showMsg = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm({ ...form, image_url: data.url });
      showMsg("success", "Gambar berhasil diupload!");
    } catch (err: any) { showMsg("error", err.message || "Gagal upload gambar"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/products/${editingId}` : `${API_URL}/api/products`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showMsg("success", data.message);
      setShowModal(false); setEditingId(null); setForm(emptyForm);
      fetchProducts();
    } catch (err: any) { showMsg("error", err.message || "Gagal menyimpan"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showMsg("success", data.message);
      fetchProducts();
    } catch (err: any) { showMsg("error", err.message); }
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, image_url: p.image_url, badge: p.badge, badge_color: p.badge_color, sort_order: p.sort_order });
    setShowModal(true);
  };

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setShowModal(true); };

  if (loading) return <div className="text-white/50 text-center py-20">Memuat produk...</div>;

  return (
    <div>
      {message.text && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${message.type === "success" ? "bg-green-500/15 border border-green-400/30 text-green-300" : "bg-red-500/15 border border-red-400/30 text-red-300"}`}>
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm">{products.length} produk</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/30">
          <Plus className="w-4 h-4" /> Tambah Produk
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.15] transition-colors group">
            <div className="relative aspect-square bg-white/[0.02]">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20"><Upload className="w-10 h-10" /></div>
              )}
              {p.badge && (
                <span className={`absolute top-3 left-3 px-2.5 py-1 ${p.badge_color} text-white text-[10px] font-bold rounded-full`}>{p.badge}</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold text-sm mb-1">{p.name}</h3>
              <p className="text-white/40 text-xs line-clamp-2 mb-3">{p.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold text-sm">{p.price}</span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 text-white/30">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Belum ada produk. Klik &quot;Tambah Produk&quot; untuk memulai.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#12123a] border border-white/[0.1] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-white font-bold">{editingId ? "Edit Produk" : "Tambah Produk"}</h3>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase mb-1.5">Nama Produk *</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-blue-400/50" placeholder="Contoh: Black Soul" />
              </div>
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase mb-1.5">Deskripsi</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-blue-400/50 resize-none" placeholder="Deskripsi produk..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-xs font-semibold uppercase mb-1.5">Harga *</label>
                  <input type="text" required value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-blue-400/50" placeholder="Rp 15.000" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-semibold uppercase mb-1.5">Urutan</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-blue-400/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-xs font-semibold uppercase mb-1.5">Badge</label>
                  <input type="text" value={form.badge} onChange={e => setForm({...form, badge: e.target.value})}
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-blue-400/50" placeholder="Best Seller" />
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-semibold uppercase mb-1.5">Warna Badge</label>
                  <select value={form.badge_color} onChange={e => setForm({...form, badge_color: e.target.value})}
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white text-sm focus:outline-none focus:border-blue-400/50">
                    {BADGE_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase mb-1.5">Gambar Produk</label>
                {form.image_url && (
                  <div className="mb-3 relative w-32 h-32 rounded-xl overflow-hidden bg-white/5">
                    <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-white/[0.12] rounded-xl text-white/40 text-sm cursor-pointer hover:border-blue-400/40 hover:text-blue-400 transition-all ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                  <Upload className="w-4 h-4" />
                  {uploading ? "Mengupload..." : "Upload Gambar"}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <input type="text" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})}
                  className="w-full px-4 py-2 mt-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/40 text-xs focus:outline-none" placeholder="Atau paste URL gambar" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-white/[0.12] text-white/60 rounded-xl text-sm hover:bg-white/[0.04] transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-500 transition-colors disabled:opacity-50">
                  {saving ? "Menyimpan..." : editingId ? "Perbarui" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
