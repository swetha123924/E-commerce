import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { removeFromWishlist, clearWishlist } from "@/features/wishlistSlice";
import { addToCart } from "@/features/cartSlice";
import { formatPercentage, formatPrice } from "@/lib/utils";
import {
  Package, ArrowLeft, CheckCircle2, Clock, Truck, RotateCcw,
  ShoppingBag, ChevronRight, MapPin, Calendar, Receipt,
  Heart, ShoppingCart, Trash2, Sparkles, Eye, Star,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface OrderItem { id: number; title: string; thumbnail: string; price: number; quantity: number; }
interface Order { id: string; date: string; items: OrderItem[]; total: number; status: "delivered" | "shipped" | "processing" | "cancelled"; address: string; }

const STATUS_CONFIG = {
  delivered:  { label: "Delivered",  color: "text-green-600 bg-green-50 border-green-200",  icon: CheckCircle2 },
  shipped:    { label: "Shipped",    color: "text-blue-600 bg-blue-50 border-blue-200",    icon: Truck },
  processing: { label: "Processing", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
  cancelled:  { label: "Cancelled",  color: "text-red-500 bg-red-50 border-red-200",       icon: RotateCcw },
};

function getMockOrders(): Order[] {
  const stored = localStorage.getItem("orders");
  if (stored) { try { return JSON.parse(stored); } catch { /* ignore */ } }
  return [
    { id: "ORD-2026-001", date: new Date(Date.now() - 2 * 86400000).toISOString(), status: "delivered", address: "123, MG Road, Bangalore, Karnataka — 560001", total: 12499, items: [{ id: 1, title: "iPhone 15 Pro Max", thumbnail: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015%20Pro%20Max/thumbnail.png", price: 12499, quantity: 1 }] },
    { id: "ORD-2026-002", date: new Date(Date.now() - 1 * 86400000).toISOString(), status: "shipped", address: "456, Linking Road, Mumbai, Maharashtra — 400050", total: 4998, items: [{ id: 2, title: "Samsung Galaxy Watch", thumbnail: "https://cdn.dummyjson.com/products/images/smart-watches/Samsung%20Galaxy%20Watch/thumbnail.png", price: 2499, quantity: 2 }] },
    { id: "ORD-2026-003", date: new Date().toISOString(), status: "processing", address: "789, Anna Salai, Chennai, Tamil Nadu — 600002", total: 3199, items: [{ id: 3, title: "Nike Air Max 270", thumbnail: "https://cdn.dummyjson.com/products/images/womens-shoes/Nike%20Air%20Max%20270/thumbnail.png", price: 3199, quantity: 1 }] },
  ];
}

/* ─── Star row ───────────────────────────────────────────────────────── */
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

/* ─── Tab bar ────────────────────────────────────────────────────────── */
const TABS = [
  { key: "orders",   label: "My Orders",  icon: Receipt, badge: (o: number, _w: number) => o },
  { key: "wishlist", label: "Wishlist",   icon: Heart,   badge: (_o: number, w: number) => w },
] as const;
type TabKey = typeof TABS[number]["key"];

/* ═══════════════════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════════════════ */
export default function Orders() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab: TabKey = (searchParams.get("tab") as TabKey) ?? "orders";

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const [orders] = useState<Order[]>(getMockOrders);
  const [expanded, setExpanded] = useState<string | null>(null);

  function switchTab(key: TabKey) {
    setSearchParams(key === "orders" ? {} : { tab: key });
  }

  /* ── wishlist helpers ── */
  function handleAddToCart(product: any) {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.title} added to cart!`);
  }
  function handleRemove(id: number) {
    dispatch(removeFromWishlist(id));
    toast.success("Removed from wishlist");
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* ── Sticky header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 backdrop-blur-md bg-white/90 shadow-sm">
        <div className="px-4 sm:px-8 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-extrabold text-gray-800 text-lg leading-none">Activity</h1>
            <p className="text-xs text-gray-400 mt-0.5">Orders &amp; Wishlist</p>
          </div>
          {/* Wishlist clear button — only on wishlist tab */}
          {activeTab === "wishlist" && wishlistItems.length > 0 && (
            <button
              onClick={() => { dispatch(clearWishlist()); toast.success("Wishlist cleared"); }}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {/* ── Tab strip ── */}
        <div className="flex px-4 sm:px-8 gap-1 pb-0">
          {TABS.map(({ key, label, icon: Icon, badge }) => {
            const count = badge(orders.length, wishlistItems.length);
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => switchTab(key)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all duration-200 ${
                  isActive
                    ? "text-indigo-600 bg-indigo-50/80"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive && key === "wishlist" ? "fill-pink-500 text-pink-500" : ""}`} />
                {label}
                {count > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                    {count}
                  </span>
                )}
                {/* Active underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          ORDERS TAB
      ════════════════════════════════════════════ */}
      {activeTab === "orders" && (
        <>
          {orders.length === 0 ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 py-16">
              <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center animate-float">
                <ShoppingBag className="w-12 h-12 text-indigo-400" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-gray-800">No orders yet</h2>
                <p className="text-gray-400 text-sm max-w-xs mt-1">Once you place an order it will appear here.</p>
              </div>
              <button onClick={() => navigate("/")} className="btn-ripple bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 transition-all">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-4">
              {orders.map((order, i) => {
                const cfg = STATUS_CONFIG[order.status];
                const StatusIcon = cfg.icon;
                const isOpen = expanded === order.id;
                return (
                  <div key={order.id} className="animate-fade-in-up bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ animationDelay: `${i * 80}ms` }}>
                    <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors" onClick={() => setExpanded(isOpen ? null : order.id)}>
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="w-10 h-10 rounded-xl border-2 border-white bg-gray-50 overflow-hidden shadow-sm">
                              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain p-0.5" />
                            </div>
                          ))}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-800 text-sm">{order.id}</p>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" /> {cfg.label}
                        </span>
                        <span className="text-indigo-600 font-black text-sm">₹{formatPrice(order.total)}</span>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-4 animate-fade-in-up">
                        <div className="flex flex-col gap-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain p-1" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.title}</p>
                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                              </div>
                              <span className="text-indigo-600 font-bold text-sm shrink-0">₹{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-dashed border-gray-100">
                          <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                            <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Delivery Address</p>
                              <p className="text-xs text-gray-700 font-medium mt-0.5">{order.address}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 bg-indigo-50 rounded-xl p-3">
                            <Package className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Order Total</p>
                              <p className="text-xl font-black text-indigo-600 mt-0.5">₹{formatPrice(order.total)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {order.status === "delivered" && (
                            <button className="btn-ripple flex-1 text-xs font-bold py-2.5 rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">Write a Review</button>
                          )}
                          {order.status === "processing" && (
                            <button className="btn-ripple flex-1 text-xs font-bold py-2.5 rounded-xl border border-red-400 text-red-400 hover:bg-red-50 transition-all">Cancel Order</button>
                          )}
                          <button onClick={() => navigate("/")} className="btn-ripple flex-1 text-xs font-bold py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all">Reorder</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════
          WISHLIST TAB
      ════════════════════════════════════════════ */}
      {activeTab === "wishlist" && (
        <>
          {wishlistItems.length === 0 ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 py-16">
              <div className="w-28 h-28 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center animate-float">
                <Heart className="w-12 h-12 text-pink-400" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-gray-800">Your wishlist is empty</h2>
                <p className="text-gray-400 text-sm max-w-xs mt-1">Save items you love by tapping the heart icon on any product.</p>
              </div>
              <button onClick={() => navigate("/")} className="btn-ripple bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-pink-200 hover:scale-105 transition-all flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Discover Products
              </button>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {wishlistItems.map((product, i) => {
                  const originalPrice = product.discountPercentage > 1
                    ? Math.round(product.price / (1 - product.discountPercentage / 100))
                    : null;
                  return (
                    <div key={product.id} className="product-card animate-fade-in-up bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="relative overflow-hidden bg-gray-50 aspect-square cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                        <img className="card-img w-full h-full object-contain p-4" src={product.thumbnail} alt={product.title} loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                            <div className="glass-card rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-800 shadow-lg">
                              <Eye className="w-3 h-3" /> View
                            </div>
                          </div>
                        </div>
                        {product.discountPercentage > 1 && (
                          <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                            -{formatPercentage(product.discountPercentage)}%
                          </span>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemove(product.id); }}
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 hover:scale-110 transition-all duration-200"
                        >
                          <Heart className="w-3.5 h-3.5 fill-white" />
                        </button>
                      </div>
                      <div className="flex flex-col gap-2 p-3 flex-1">
                        <h3 className="font-bold text-gray-800 text-xs leading-snug line-clamp-2 cursor-pointer hover:text-pink-500 transition-colors" onClick={() => navigate(`/product/${product.id}`)}>
                          {product.title}
                        </h3>
                        <StarRow rating={product.rating ?? 0} />
                        <div className="flex items-end gap-1.5 mt-auto pt-1">
                          <span className="text-indigo-600 font-black text-base leading-none">₹{formatPrice(product.price)}</span>
                          {originalPrice && <span className="text-gray-300 text-xs line-through mb-0.5">₹{formatPrice(originalPrice)}</span>}
                        </div>
                        <button onClick={() => handleAddToCart(product)} className="btn-ripple w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all mt-1 shadow-sm hover:shadow-indigo-200">
                          <ShoppingCart className="w-3 h-3" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => { wishlistItems.forEach((p) => dispatch(addToCart({ product: p, quantity: 1 }))); toast.success(`${wishlistItems.length} items added to cart!`); }}
                  className="btn-ripple flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all"
                >
                  <Package className="w-4 h-4" /> Add All to Cart ({wishlistItems.length} items)
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
