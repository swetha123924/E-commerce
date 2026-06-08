import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { formatPrice } from "@/lib/utils";
import {
  ShieldAlert, ArrowLeft, Plus, Pencil, Trash2, Search, X, Star,
  Package, BarChart2, TrendingUp, ShoppingCart, DollarSign,
} from "lucide-react";

interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  category: string;
  rating: number;
  thumbnail: string;
  discountPercentage: number;
}

type ModalMode = "add" | "edit" | null;

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-800">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

const EMPTY_FORM = { title: "", price: "", stock: "", category: "", discountPercentage: "" };

export default function AdminPage() {
  const navigate = useNavigate();
  const user = (useSelector((state: RootState) => (state.user as any).user));
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<ModalMode>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetch("https://dummyjson.com/products?limit=30")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products ?? []); setLoading(false); });
  }, [user]);

  // Admin guard
  if (user?.role !== "admin") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4 py-16">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-extrabold text-gray-800">Access Denied</h2>
          <p className="text-sm text-gray-400 mt-1">You need admin privileges to view this page.</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="btn-ripple bg-indigo-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-indigo-700 transition-all"
        >
          Go Home
        </button>
      </div>
    );
  }

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  function openAdd() { setForm(EMPTY_FORM); setEditing(null); setModal("add"); }
  function openEdit(p: Product) {
    setEditing(p);
    setForm({ title: p.title, price: String(p.price), stock: String(p.stock), category: p.category, discountPercentage: String(p.discountPercentage) });
    setModal("edit");
  }
  function closeModal() { setModal(null); setEditing(null); setForm(EMPTY_FORM); }

  function handleSave() {
    if (!form.title || !form.price) return;
    if (modal === "add") {
      const newProd: Product = {
        id: Date.now(),
        title: form.title,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        category: form.category,
        discountPercentage: Number(form.discountPercentage) || 0,
        rating: 4.0,
        thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
      };
      setProducts((prev) => [newProd, ...prev]);
    } else if (modal === "edit" && editing) {
      setProducts((prev) =>
        prev.map((p) => p.id === editing.id
          ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock), discountPercentage: Number(form.discountPercentage) }
          : p)
      );
    }
    closeModal();
  }

  function handleDelete(id: number) { setProducts((prev) => prev.filter((p) => p.id !== id)); setDeleting(null); }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/80 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-extrabold text-gray-800 text-lg leading-none flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-500" /> Admin Dashboard
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage products & inventory</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="btn-ripple flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-200 hover:scale-105 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={Package} label="Total Products" value={String(products.length)} color="bg-indigo-50 text-indigo-500" />
          <StatCard icon={ShoppingCart} label="Total Stock" value={String(products.reduce((s, p) => s + p.stock, 0).toLocaleString())} color="bg-blue-50 text-blue-500" />
          <StatCard icon={DollarSign} label="Avg Price" value={`₹${products.length ? formatPrice(products.reduce((s, p) => s + p.price, 0) / products.length) : 0}`} color="bg-green-50 text-green-500" />
          <StatCard icon={TrendingUp} label="Categories" value={String(new Set(products.map((p) => p.category)).size)} color="bg-amber-50 text-amber-500" />
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Loading products…</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                    <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Rating</th>
                    <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p, i) => (
                    <tr key={p.id} className="hover:bg-indigo-50/40 transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                            <img src={p.thumbnail} alt={p.title} className="w-full h-full object-contain p-0.5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 line-clamp-1">{p.title}</p>
                            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md">{p.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right font-bold text-gray-800">₹{formatPrice(p.price)}</td>
                      <td className="px-5 py-3 text-right hidden sm:table-cell">
                        <span className={`font-bold text-xs px-2 py-0.5 rounded-lg ${p.stock < 10 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>{p.stock}</span>
                      </td>
                      <td className="px-5 py-3 text-right hidden md:table-cell">
                        <span className="flex items-center justify-end gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3 h-3 fill-current" /> {p.rating.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(p)}
                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleting(p.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-sm">No products match "{query}"</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-gray-800 text-lg">{modal === "add" ? "Add Product" : "Edit Product"}</h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-col gap-3">
              {(["title", "price", "stock", "category", "discountPercentage"] as const).map((field) => (
                <div key={field} className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {field === "discountPercentage" ? "Discount %" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "title" || field === "category" ? "text" : "number"}
                    value={form[field]}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder={field === "discountPercentage" ? "0" : `Enter ${field}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
              <button
                onClick={handleSave}
                disabled={!form.title || !form.price}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {modal === "add" ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleting !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-gray-800 text-lg">Delete Product?</h2>
              <p className="text-sm text-gray-400 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleting)} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
