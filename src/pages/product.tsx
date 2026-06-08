import { useEffect, useState } from "react";
import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { toggleWishlist } from "@/features/wishlistSlice";
import { convertToRupee, formatPercentage, formatPrice } from "@/lib/utils";
import { addToCart } from "@/features/cartSlice";
import { Product } from "@/types";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Package,
  CheckCircle2,
  Zap,
  ArrowLeft,
  Eye,
  BadgeCheck,
  Ruler,
} from "lucide-react";

// ── Loader ───────────────────────────────────────────────────────────────────

export function loader({ params }: LoaderFunctionArgs) {
  const { productId } = params as { productId: string };
  return fetch(`https://dummyjson.com/products/${productId}`)
    .then((res) => {
      if (!res.ok) throw new Error(`Product '${productId}' not found`);
      return res.json();
    })
    .then((product) => ({ ...product, price: convertToRupee(product.price) }));
}

// ── Helper ───────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  const parts = name.split(" ");
  return (parts[0]?.charAt(0) ?? "") + (parts[1]?.charAt(0) ?? "");
}

function StarRow({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sz} ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProductInfo() {
  const product = useLoaderData() as Product;
  const {
    images, title, description, price, brand, stock,
    warrantyInformation, reviews, dimensions, shippingInformation,
    discountPercentage, returnPolicy, rating, category, tags,
  } = product;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(0);
  const wishlisted = useSelector((state: RootState) =>
    (state.wishlist as any)?.items?.some((p: { id: number }) => p.id === data.id) ?? false
  );
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");

  useEffect(() => {
    if (category) {
      fetch(`https://dummyjson.com/products/category/${category}?limit=8`)
        .then((r) => r.json())
        .then((d) =>
          setRelatedProducts(
            (d.products || [])
              .filter((p: Product) => p.id !== product.id)
              .map((p: Product) => ({ ...p, price: convertToRupee(p.price) }))
          )
        );
    }
  }, [category, product.id]);

  function handleAddToCart() {
    dispatch(addToCart({ product, quantity: qty }));
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  }

  const originalPrice = discountPercentage > 1
    ? Math.round(price / (1 - discountPercentage / 100))
    : null;

  const isLowStock = stock > 0 && stock <= 5;
  const isOutOfStock = stock === 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-3 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-xs text-gray-400 capitalize">{category}</span>
        <span className="text-gray-300">/</span>
        <span className="text-xs text-gray-600 font-medium line-clamp-1 max-w-[200px]">{title}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* ── Product Hero ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 animate-scale-in">
          {/* Left — Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-square group">
              <img
                key={selectedImg}
                src={images[selectedImg]}
                alt={title}
                className="w-full h-full object-contain p-6 animate-scale-in"
              />
              {/* Discount badge */}
              {discountPercentage > 1 && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  -{formatPercentage(discountPercentage)}% OFF
                </div>
              )}
              {isLowStock && (
                <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  Only {stock} left!
                </div>
              )}
              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImg((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImg((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              {/* Wishlist */}
              <button
                onClick={() => dispatch(toggleWishlist(data))}
                className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${wishlisted ? "bg-red-500 text-white scale-110" : "bg-white text-gray-400 hover:text-red-500"}`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? "fill-white" : ""}`} />
              </button>
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImg === i
                        ? "border-indigo-500 shadow-md shadow-indigo-100 scale-95"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <img src={img} alt={`view-${i}`} className="w-full h-full object-contain p-1 bg-gray-50" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Product Info */}
          <div className="flex flex-col gap-5">
            {/* Tags */}
            {tags?.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {tags.map((t) => (
                  <span key={t} className="text-[10px] uppercase tracking-wider font-bold text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Title + brand */}
            <div>
              {brand && (
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">{brand}</p>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-tight">{title}</h1>
            </div>

            {/* Rating bar */}
            <div className="flex items-center gap-3">
              <StarRow rating={rating} />
              <span className="text-sm font-bold text-gray-700">{rating.toFixed(1)}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400">{reviews.length} reviews</span>
              {rating >= 4.5 && (
                <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                  <BadgeCheck className="w-3 h-3" /> Top Rated
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-indigo-600 leading-none">
                  ₹{formatPrice(price)}
                </span>
              </div>
              {originalPrice && (
                <span className="text-gray-400 text-base line-through mb-0.5">
                  ₹{formatPrice(originalPrice)}
                </span>
              )}
              {discountPercentage > 1 && (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  Save {formatPercentage(discountPercentage)}%
                </span>
              )}
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">{description}</p>

            {/* Stock indicator */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="text-red-500 text-sm font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-orange-500 text-sm font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  Only {stock} left — order soon!
                </span>
              ) : (
                <span className="text-green-600 text-sm font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({stock} units)
                </span>
              )}
            </div>

            {/* Qty + CTA */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Qty:</span>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 p-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-indigo-600 transition-all disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-gray-800 text-sm">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(stock, q + 1))}
                    disabled={qty >= stock || isOutOfStock}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-indigo-600 transition-all disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`btn-ripple flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                    addedFeedback
                      ? "bg-green-500 text-white scale-95"
                      : isOutOfStock
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
                  }`}
                >
                  {addedFeedback ? (
                    <><CheckCircle2 className="w-4 h-4" /> Added to Cart!</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                  )}
                </button>
                <button
                  disabled={isOutOfStock}
                  className={`btn-ripple flex-1 py-3.5 rounded-2xl text-sm font-bold border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                  }`}
                >
                  <Zap className="w-4 h-4" /> Buy Now
                </button>
              </div>
            </div>

            {/* Policy icons */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
              {[
                { icon: Truck, label: shippingInformation || "Fast Shipping" },
                { icon: RotateCcw, label: returnPolicy || "Easy Return" },
                { icon: ShieldCheck, label: warrantyInformation || "Warranty" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center p-2 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors">
                  <Icon className="w-4 h-4 text-indigo-500" />
                  <span className="text-[10px] text-gray-500 font-medium leading-tight line-clamp-2">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs: Details | Reviews ─────────────────────────────────── */}
        <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100">
            {(["details", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-bold capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab === "reviews" ? `Reviews (${reviews.length})` : "Product Details"}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8 animate-scale-in" key={activeTab}>
            {activeTab === "details" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {brand && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Brand</span>
                    <span className="text-gray-800 font-bold">{brand}</span>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Category</span>
                  <span className="text-gray-800 font-bold capitalize">{category}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1"><Ruler className="w-3 h-3" /> Dimensions</span>
                  <span className="text-gray-800 font-bold">
                    {dimensions.height} × {dimensions.width} × {dimensions.depth} cm
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1"><Package className="w-3 h-3" /> Stock</span>
                  <span className={`font-bold ${isOutOfStock ? "text-red-500" : isLowStock ? "text-orange-500" : "text-green-600"}`}>
                    {isOutOfStock ? "Out of Stock" : `${stock} units available`}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Warranty</span>
                  <span className="text-gray-800 font-bold">{warrantyInformation}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1"><Truck className="w-3 h-3" /> Shipping</span>
                  <span className="text-gray-800 font-bold">{shippingInformation}</span>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Return Policy</span>
                  <span className="text-gray-800 font-bold">{returnPolicy}</span>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="flex flex-col gap-4">
                {/* Average rating summary */}
                <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-5xl font-black text-indigo-600">{rating.toFixed(1)}</span>
                    <StarRow rating={rating} />
                    <span className="text-xs text-gray-400">{reviews.length} reviews</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => Math.round(r.rating) === star).length;
                      const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500 w-3">{star}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-gray-400 w-4 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Individual reviews */}
                {reviews.length > 0 ? (
                  reviews.map(({ reviewerName, reviewerEmail, comment, date, rating: rr }, i) => (
                    <div key={reviewerEmail + i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50/40 transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {getInitials(reviewerName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <span className="font-bold text-gray-800 text-sm">{reviewerName}</span>
                            <span className="text-gray-400 text-xs ml-2">{reviewerEmail}</span>
                          </div>
                          <span className="text-gray-400 text-xs shrink-0">{new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                        <StarRow rating={rr} size="sm" />
                        <p className="text-gray-600 text-sm mt-1.5 leading-relaxed">{comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400">No reviews yet.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ──────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-gray-800">Related Products</h2>
              <button
                onClick={() => navigate(`/?category=${category}`)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
              >
                See all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 8).map((rp, i) => (
                <div
                  key={rp.id}
                  className="product-card animate-fade-in-up bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group cursor-pointer"
                  style={{ animationDelay: `${i * 70}ms` }}
                  onClick={() => navigate(`/product/${rp.id}`)}
                >
                  <div className="relative overflow-hidden bg-gray-50 aspect-square">
                    <img
                      className="card-img w-full h-full object-contain p-4"
                      src={rp.thumbnail}
                      alt={rp.title}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <div className="glass-card rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                          <Eye className="w-3 h-3" /> View
                        </div>
                      </div>
                    </div>
                    {rp.discountPercentage > 1 && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        -{formatPercentage(rp.discountPercentage)}%
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-1.5">
                    <h4 className="font-bold text-gray-800 text-xs line-clamp-2 leading-snug">{rp.title}</h4>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-indigo-600 font-black text-sm">₹{formatPrice(rp.price)}</span>
                      <StarRow rating={rp.rating ?? 0} size="sm" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(addToCart({ product: rp, quantity: 1 }));
                      }}
                      className="btn-ripple w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all mt-1"
                    >
                      <ShoppingCart className="w-3 h-3" /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
