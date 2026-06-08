import { CartItemsType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "@/features/cartSlice";

export default function CartItem({ item }: { item: CartItemsType }) {
  const {
    product: { title, price, description, thumbnail, discountPercentage },
    quantity,
  } = item;

  const dispatch = useDispatch();

  return (
    <div className="group animate-fade-in-up flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-4 overflow-hidden">
      {/* Image */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
        <img
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          src={thumbnail}
          alt={title}
        />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">{title}</h3>
          <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{description}</p>
          {discountPercentage > 1 && (
            <span className="inline-block mt-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              {Math.round(discountPercentage)}% OFF
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-3 gap-3">
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-indigo-600 font-black text-base leading-none">
              ₹{formatPrice(price * quantity)}
            </span>
            {quantity > 1 && (
              <span className="text-gray-400 text-xs">
                (₹{formatPrice(price)} each)
              </span>
            )}
          </div>

          {/* Qty controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => dispatch(removeFromCart(item.product.id))}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 border font-bold ${
                quantity <= 1
                  ? "border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400"
                  : "border-gray-200 text-gray-500 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {quantity <= 1 ? (
                <Trash2 className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
            </button>

            <span className="w-8 h-8 flex items-center justify-center font-bold text-gray-800 text-sm bg-gray-50 rounded-xl border border-gray-200">
              {quantity}
            </span>

            <button
              onClick={() => dispatch(addToCart({ product: item.product, quantity: 1 }))}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
