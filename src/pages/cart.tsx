import { useState } from "react";
import CartItem from "@/components/ui/cart-item";
import { clearCart } from "@/features/cartSlice";
import { getCartItemCount, getCartSubtotal } from "@/lib/utils";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Tag,
  ChevronRight,
  Trash2,
  Sparkles,
  Package,
  CheckCircle2,
} from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 999;

export default function Cart() {
  const { items } = useSelector((state: RootState) => state.cart);
  const totalItems = getCartItemCount(items);
  const subtotalStr = getCartSubtotal(items);
  const subtotalNum = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const discount = couponApplied ? Math.round(subtotalNum * 0.15) : 0;
  const shipping = subtotalNum >= FREE_SHIPPING_THRESHOLD ? 0 : 79;
  const total = subtotalNum - discount + shipping;
  const shippingProgress = Math.min((subtotalNum / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalNum);

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "SAVE15") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponApplied(false);
      setCouponError("Invalid coupon code. Try SAVE15");
    }
  }

  // ── Empty State ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 py-16 bg-gray-50 animate-scale-in">
        <div className="relative">
          <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center animate-float">
            <ShoppingBag className="w-12 h-12 text-indigo-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-400 font-black text-sm">0</span>
          </div>
        </div>
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold text-gray-800">Your cart is empty</h2>
          <p className="text-gray-400 text-sm max-w-xs">
            Looks like you haven&apos;t added anything yet. Explore our products and find something you love!
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="btn-ripple bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/80 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-extrabold text-gray-800 text-lg leading-none">Shopping Cart</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch(clearCart())}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-all duration-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Left — Cart Items */}
        <div className="flex flex-col gap-4">
          {/* Free shipping progress */}
          {shipping > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-semibold flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-indigo-500" />
                  Add <span className="text-indigo-600 font-bold">₹{Math.round(amountNeeded)}</span> more for FREE shipping!
                </span>
                <span className="text-gray-400">{Math.round(shippingProgress)}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-2 animate-scale-in">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              <span className="text-green-700 text-xs font-semibold">
                🎉 You've unlocked FREE shipping on this order!
              </span>
            </div>
          )}

          {/* Items */}
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          {/* Continue shopping */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-indigo-600 text-sm font-semibold hover:text-indigo-800 transition-colors mt-1 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>

        {/* Right — Order Summary */}
        <div className="flex flex-col gap-4">
          {/* Coupon */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-500" />
              Coupon Code
            </h3>
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value);
                  setCouponError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                placeholder="e.g. SAVE15"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
              />
              <button
                onClick={applyCoupon}
                className="btn-ripple bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all shrink-0"
              >
                Apply
              </button>
            </div>
            {couponApplied && (
              <p className="text-green-600 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> SAVE15 applied — 15% discount!
              </p>
            )}
            {couponError && (
              <p className="text-red-400 text-xs font-medium">{couponError}</p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 sticky top-20">
            <h3 className="font-extrabold text-gray-800 text-base">Order Summary</h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
                <span className="font-semibold text-gray-800">₹{subtotalStr}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Coupon (SAVE15)
                  </span>
                  <span className="font-semibold text-green-600">-₹{Math.round(discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Shipping
                </span>
                {shipping === 0 ? (
                  <span className="font-semibold text-green-600">FREE</span>
                ) : (
                  <span className="font-semibold text-gray-800">₹{shipping}</span>
                )}
              </div>
              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
                <span className="font-extrabold text-gray-800">Total</span>
                <span className="font-extrabold text-indigo-600 text-xl">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/payment")}
              className="btn-ripple w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              Proceed to Checkout
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
              {[
                { icon: ShieldCheck, label: "Secure Pay" },
                { icon: RotateCcw, label: "Easy Return" },
                { icon: Package, label: "Fast Ship" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] text-gray-400 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
