import AddressForm, { AddressFormValues } from "@/components/ui/address-form";
import BillingForm, { BillingFormValues } from "@/components/ui/billing-form";
import { clearCart } from "@/features/cartSlice";
import { getCartItemCount, getCartSubtotal } from "@/lib/utils";
import { RootState } from "@/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Truck,
  Package,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const STEPS = [
  { id: "address", label: "Delivery", icon: MapPin },
  { id: "billing", label: "Payment", icon: CreditCard },
  { id: "done",    label: "Confirm",  icon: CheckCircle2 },
];

export default function Payment() {
  const { items } = useSelector((state: RootState) => state.cart);
  const totalItems = getCartItemCount(items);
  const subtotal = getCartSubtotal(items);
  const subtotalNum = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const shipping = subtotalNum >= 999 ? 0 : 79;
  const total = subtotalNum + shipping;

  const [activeTab, setActiveTab] = useState<"address" | "billing" | "done">("address");
  const [savedAddress, setSavedAddress] = useState<AddressFormValues | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentStep = STEPS.findIndex((s) => s.id === activeTab);

  function onAddressFormSubmit(data: AddressFormValues) {
    setSavedAddress(data);
    setActiveTab("billing");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onBillingFormSubmit(_data: BillingFormValues) {
    const promise = new Promise<{ subTotal: string }>((resolve) =>
      setTimeout(() => resolve({ subTotal: subtotal }), 2000)
    );
    toast.promise(promise, {
      loading: "Processing payment...",
      success: ({ subTotal }) => {
        dispatch(clearCart());
        setActiveTab("done");
        setTimeout(() => navigate("/"), 3000);
        return `Payment of ₹${subTotal} successful!`;
      },
    });
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (activeTab === "done") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-6 text-center animate-scale-in max-w-sm">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl shadow-green-200 animate-pulse-ring">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-extrabold text-gray-800">Order Placed!</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Thank you for your purchase. Your order has been confirmed and will be delivered soon.
            </p>
            <div className="mt-2 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
              <p className="text-green-700 font-bold text-base">₹{subtotal} paid successfully</p>
              <p className="text-green-500 text-xs mt-0.5">Order confirmation sent to your email</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full text-xs">
            {[
              { icon: Truck, label: "Estimated Delivery", value: "3-5 business days" },
              { icon: Package, label: "Order Status", value: "Processing" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col items-center gap-1.5 shadow-sm">
                <Icon className="w-4 h-4 text-indigo-500" />
                <span className="text-gray-400 font-medium">{label}</span>
                <span className="text-gray-700 font-bold">{value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/")}
            className="btn-ripple w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            Continue Shopping <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center gap-3 sticky top-0 z-20 backdrop-blur-md bg-white/80 shadow-sm">
        <button
          onClick={() => navigate("/cart")}
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-extrabold text-gray-800 text-lg leading-none">Checkout</h1>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <Lock className="w-3 h-3 text-green-500" /> Secure checkout
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-8">
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map(({ id, label, icon: Icon }, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={id} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      done
                        ? "bg-green-500 text-white shadow-md shadow-green-200"
                        : active
                        ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 animate-pulse-ring"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      active ? "text-indigo-600" : done ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 rounded-full transition-all duration-500 ${i < currentStep ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Form panel */}
          <div className="animate-scale-in" key={activeTab}>
            {activeTab === "address" && (
              <AddressForm onFormSubmit={onAddressFormSubmit} />
            )}
            {activeTab === "billing" && (
              <>
                {/* Saved address chip */}
                {savedAddress && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-start gap-3 mb-4 animate-fade-in-up">
                    <MapPin className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-green-700 text-xs font-bold">Delivering to</p>
                      <p className="text-green-600 text-xs mt-0.5 line-clamp-1">
                        {savedAddress.name}, {savedAddress.line1}, {savedAddress.city}, {savedAddress.state} — {savedAddress.postalCode}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("address")}
                      className="text-indigo-600 text-xs font-bold hover:text-indigo-800 transition-colors shrink-0"
                    >
                      Change
                    </button>
                  </div>
                )}
                <BillingForm onFormSubmit={onBillingFormSubmit} />
              </>
            )}
          </div>

          {/* Order summary */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
              <h3 className="font-extrabold text-gray-800 text-base mb-4">Order Summary</h3>

              {/* Items preview */}
              <div className="flex flex-col gap-2.5 mb-4 max-h-48 overflow-y-auto pr-1" style={{ scrollbarWidth: "none" }}>
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                      <img src={item.product.thumbnail} alt={item.product.title} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 line-clamp-1">{item.product.title}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-100 pt-4 flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-800">₹{subtotal}</span>
                </div>
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
                <div className="flex justify-between border-t border-gray-100 pt-3">
                  <span className="font-extrabold text-gray-800">Total</span>
                  <span className="font-extrabold text-indigo-600 text-xl">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Security badges */}
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
                {[
                  { icon: ShieldCheck, label: "SSL Secure" },
                  { icon: Lock, label: "Encrypted" },
                  { icon: CheckCircle2, label: "Verified" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <Icon className="w-4 h-4 text-green-500" />
                    <span className="text-[9px] text-gray-400 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
