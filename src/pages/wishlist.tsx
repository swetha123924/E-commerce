import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { removeFromWishlist, clearWishlist } from "@/features/wishlistSlice";
import { addToCart } from "@/features/cartSlice";
import { formatPercentage, formatPrice } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  Heart, ShoppingCart, Trash2, ArrowLeft, Sparkles,
  Eye, Star, Package,
} from "lucide-react";
import { toast } from "sonner";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  );
}

export default function Wishlist() {
  const { items } = useSelector((state: RootState) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleAddToCart(product: any) {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.title} added to cart!`);
  }

  function handleRemove(id: number) {
    dispatch(removeFromWishlist(id));
    toast.success("Removed from wishlist");
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 py-16 bg-gray-50 animate-scale-in">
        <div className="w-28 h-28 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center animate-float">
          <Heart className="w-12 h-12 text-pink-400" />
        </div>
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold text-gray-800">Your wishlist is empty</h2>
          <p className="text-gray-400 text-sm max-w-xs">
            Save items you love by tapping the heart icon on any product.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="btn-ripple bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-pink-200 hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Discover Products
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
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-pink-50 hover:border-pink-200 hover:text-pink-500 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-extrabold text-gray-800 text-lg leading-none flex items-center gap-2">
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500" /> Wishlist
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">{items.length} saved items</p>
          </div>
        </div>
        <button
          onClick={() => { dispatch(clearWishlist()); toast.success("Wishlist cleared"); }}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-all duration-200"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((product, i) => {
            const originalPrice = product.discountPercentage > 1
              ? Math.round(product.price / (1 - product.discountPercentage / 100))
              : null;
            return (
              <div
                key={product.id}
                className="product-card animate-fade-in-up bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden bg-gray-50 aspect-square cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    className="card-img w-full h-full object-contain p-4"
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                  />
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
                  {/* Remove from wishlist */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(product.id); }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 hover:scale-110 transition-all duration-200"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2 p-3 flex-1">
                  <h3
                    className="font-bold text-gray-800 text-xs leading-snug line-clamp-2 cursor-pointer hover:text-pink-500 transition-colors"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.title}
                  </h3>
                  <StarRow rating={product.rating ?? 0} />
                  <div className="flex items-end gap-1.5 mt-auto pt-1">
                    <span className="text-indigo-600 font-black text-base leading-none">
                      ₹{formatPrice(product.price)}
                    </span>
                    {originalPrice && (
                      <span className="text-gray-300 text-xs line-through mb-0.5">
                        ₹{formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-ripple w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all mt-1 shadow-sm hover:shadow-indigo-200"
                  >
                    <ShoppingCart className="w-3 h-3" /> Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add all to cart */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              items.forEach((p) => dispatch(addToCart({ product: p, quantity: 1 })));
              toast.success(`${items.length} items added to cart!`);
            }}
            className="btn-ripple flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all duration-200"
          >
            <Package className="w-4 h-4" /> Add All to Cart ({items.length} items)
          </button>
        </div>
      </div>
    </div>
  );
}
