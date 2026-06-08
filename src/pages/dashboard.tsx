import React, { Suspense, useEffect, useState } from "react";
import { Product, ProductsResponse } from "../types";
import {
  Await,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  convertToRupee,
  formatPercentage,
  formatPrice,
  sortProductsByPrice,
} from "@/lib/utils";
import { RootState } from "@/store";
import { addToCart } from "@/features/cartSlice";
import { toggleWishlist } from "@/features/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import Filters from "@/components/ui/filters";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ShoppingCart,
  Heart,
  Star,
  Zap,
  TrendingUp,
  Package,
  Truck,
  ShieldCheck,
  RotateCcw,
  Eye,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Flame,
  Sparkles,
  Tag,
} from "lucide-react";

// ─── Loader ──────────────────────────────────────────────────────────────────

function getData(url: string) {
  return new Promise((resolve) => setTimeout(() => resolve(fetch(url)), 700));
}

const defaultLimit = 15;

export async function loader({ request }: { request: any }) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search");
  const page = url.searchParams.get("page");
  const skip = page ? defaultLimit * (parseInt(page) - 1) : 0;

  if (search) {
    const res = await fetch(`https://dummyjson.com/products/search?q=${search}`);
    const data: ProductsResponse = await res.json();
    return {
      ...data,
      products: data.products.map((p: Product) => ({
        ...p,
        price: convertToRupee(p.price),
      })),
    };
  }
  if (category && category !== "all") {
    const res = await fetch(
      `https://dummyjson.com/products/category/${category}?limit=${defaultLimit}&skip=${skip}`
    );
    const data: ProductsResponse = await res.json();
    return {
      ...data,
      products: data.products.map((p: Product) => ({
        ...p,
        price: convertToRupee(p.price),
      })),
    };
  }
  const res: any = await getData(
    `https://dummyjson.com/products?limit=${defaultLimit}&skip=${skip}`
  );
  const data: ProductsResponse = await res.json();
  return {
    ...data,
    products: data.products.map((p: Product) => ({
      ...p,
      price: convertToRupee(p.price),
    })),
  };
}

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className="text-[10px] text-gray-400 ml-1 font-medium">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-gray-200 rounded-full w-2/3" />
        <div className="h-4 bg-gray-200 rounded-full w-full" />
        <div className="h-3 bg-gray-200 rounded-full w-3/4" />
        <div className="flex gap-2 mt-1">
          <div className="h-8 bg-gray-200 rounded-xl flex-1" />
          <div className="h-8 bg-gray-200 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  );
}

// ─── Flash Sale Banner ────────────────────────────────────────────────────────

const flashItems = [
  "🔥 FLASH SALE — Up to 70% off Electronics!",
  "⚡ FREE SHIPPING on orders above ₹999",
  "💎 NEW ARRIVALS — Premium Collection",
  "🎁 Use code SAVE15 for extra 15% off",
  "🌟 Over 10,000+ Happy Customers",
  "🚀 Same-day delivery available in select cities",
];

function FlashBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white text-xs font-semibold py-2 overflow-hidden">
      <div className="flex gap-16 whitespace-nowrap marquee-track">
        {[...flashItems, ...flashItems].map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            {item}
            <span className="w-px h-3 bg-white/30 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 mt-4 min-h-[220px] sm:min-h-[280px] lg:min-h-[340px] flex items-center">
      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 bg-[length:200%_200%]" />
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl" />
      <div className="absolute top-6 right-1/3 w-24 h-24 bg-yellow-300/15 rounded-full blur-xl animate-float" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative z-10 px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6">
        <div className="flex flex-col gap-4 max-w-xl">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
            <Flame className="w-3.5 h-3.5 text-orange-300 animate-pulse" />
            <span className="text-white/90 text-xs font-semibold tracking-wide">
              TRENDING NOW
            </span>
          </div>
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight animate-fade-in-up">
            Discover <span className="text-yellow-300">Premium</span>
            <br />
            Products at Best Prices
          </h1>
          <p className="text-white/75 text-sm sm:text-base animate-fade-in-up">
            Shop from 10,000+ curated items. Fast delivery. Easy returns.
          </p>
          <div className="flex flex-wrap gap-3 animate-fade-in-up">
            <button className="btn-ripple bg-white text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg hover:shadow-indigo-300 hover:scale-105 transition-all duration-200">
              Shop Now →
            </button>
            <button className="btn-ripple border border-white/50 text-white font-semibold text-sm px-5 py-2.5 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all duration-200">
              Explore Deals
            </button>
          </div>
        </div>
        <div className="hidden md:grid grid-cols-2 gap-3 shrink-0">
          {[
            { icon: Package, label: "Products", value: "10K+" },
            { icon: Truck, label: "Free Delivery", value: "₹999+" },
            { icon: ShieldCheck, label: "Secure Pay", value: "100%" },
            { icon: RotateCcw, label: "Easy Return", value: "7 Days" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 min-w-[140px]"
            >
              <div className="w-8 h-8 bg-white/25 rounded-lg flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-base leading-none">
                  {value}
                </div>
                <div className="text-white/60 text-[10px] font-medium mt-0.5">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Category Quick Bar ───────────────────────────────────────────────────────

const CATEGORIES = [
  { key: "all", label: "All", emoji: "🛍️" },
  { key: "smartphones", label: "Phones", emoji: "📱" },
  { key: "laptops", label: "Laptops", emoji: "💻" },
  { key: "fragrances", label: "Beauty", emoji: "💄" },
  { key: "groceries", label: "Grocery", emoji: "🛒" },
  { key: "home-decoration", label: "Home", emoji: "🏠" },
  { key: "furniture", label: "Furniture", emoji: "🪑" },
  { key: "tops", label: "Fashion", emoji: "👗" },
  { key: "womens-shoes", label: "Shoes", emoji: "👟" },
  { key: "sunglasses", label: "Eyewear", emoji: "🕶️" },
  { key: "automotive", label: "Auto", emoji: "🚗" },
];

function CategoryBar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 px-4"
      style={{ scrollbarWidth: "none" }}
    >
      {CATEGORIES.map(({ key, label, emoji }, i) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          style={{ animationDelay: `${i * 40}ms` }}
          className={`animate-scale-in flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 border ${
            active === key
              ? "cat-pill-active border-transparent"
              : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          <span>{emoji}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  index: number;
  onAddToCart: (p: Product) => void;
  onBuyNow: (id: number) => void;
  onView: (id: number) => void;
}

function ProductCard({
  product,
  index,
  onAddToCart,
  onBuyNow,
  onView,
}: ProductCardProps) {
  const {
    id,
    title,
    description,
    thumbnail,
    price,
    discountPercentage,
    rating,
    stock,
    tags,
  } = product;
  const dispatch = useDispatch();
  const wishlisted = useSelector((state: RootState) =>
    (state.wishlist as any)?.items?.some((p: { id: number }) => p.id === product.id) ?? false
  );
  const [addedFeedback, setAddedFeedback] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    onAddToCart(product);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  }

  const isLowStock = stock > 0 && stock <= 5;
  const isOutOfStock = stock === 0;

  return (
    <div
      className="product-card animate-fade-in-up bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group"
      style={{ animationDelay: `${(index % 6) * 80}ms` }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden bg-gray-50 aspect-square cursor-pointer"
        onClick={() => onView(id)}
      >
        <img
          className="card-img w-full h-full object-contain p-4"
          src={thumbnail}
          alt={title}
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
            <div className="glass-card rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-800 shadow-lg">
              <Eye className="w-3 h-3" /> Quick View
            </div>
          </div>
        </div>
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {discountPercentage > 1 && (
            <span className="discount-badge bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              -{formatPercentage(discountPercentage)}%
            </span>
          )}
          {isLowStock && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Only {stock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Sold Out
            </span>
          )}
        </div>
        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleWishlist(product));
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md
            ${
              wishlisted
                ? "bg-red-500 text-white animate-pulse-ring"
                : "bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white"
            }`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {tags?.length > 0 && (
          <div className="flex gap-1 overflow-hidden">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[9px] uppercase tracking-wider font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3
          className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors"
          onClick={() => onView(id)}
        >
          {title}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-1">{description}</p>
        <StarRating rating={rating ?? 0} />
        {/* Price */}
        <div className="flex items-end gap-2 mt-auto pt-1">
          <span className="text-indigo-600 font-black text-xl leading-none">
            ₹{formatPrice(price)}
          </span>
          {discountPercentage > 1 && (
            <span className="text-gray-300 text-xs line-through mb-0.5">
              ₹{formatPrice(Math.round(price / (1 - discountPercentage / 100)))}
            </span>
          )}
        </div>
        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <button
            disabled={isOutOfStock}
            onClick={handleAdd}
            className={`btn-ripple flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
              addedFeedback
                ? "bg-green-500 text-white scale-95"
                : isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200"
            }`}
          >
            {addedFeedback ? (
              <>✓ Added</>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3" /> Cart
              </>
            )}
          </button>
          <button
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow(id);
            }}
            className={`btn-ripple flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 border ${
              isOutOfStock
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : "border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-md"
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Promo Strip ──────────────────────────────────────────────────────────────

function PromoStrip() {
  const items = [
    { icon: Truck, title: "Free Shipping", sub: "Orders above ₹999" },
    { icon: RotateCcw, title: "Easy Returns", sub: "7-day return policy" },
    { icon: ShieldCheck, title: "Secure Payment", sub: "100% protected" },
    { icon: Sparkles, title: "Best Deals", sub: "Updated daily" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4">
      {items.map(({ icon: Icon, title, sub }, i) => (
        <div
          key={title}
          className="animate-fade-in-up flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-700">{title}</div>
            <div className="text-[10px] text-gray-400">{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { products, total, skip } = useLoaderData() as ProductsResponse;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const numberOfPages = Math.round(total / defaultLimit);
  const pageNumber = Math.ceil(skip / defaultLimit) + 1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = useSelector((state: RootState) => (state.user as any).user?.role as string | undefined);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortBy, setSortBy] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "all"
  );

  const sortedProducts = sortProductsByPrice(products);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  function onSortingChanged(value: string) {
    if (value === "low") {
      setSortBy("asc");
      setFilteredProducts(sortProductsByPrice(filteredProducts));
    } else if (value === "high") {
      setFilteredProducts(sortProductsByPrice(filteredProducts, "desc"));
      setSortBy("desc");
    } else {
      setSortBy("");
      setFilteredProducts(products);
    }
  }

  function onPriceChange([minPrice, maxPrice]: number[]) {
    const filtered = products.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    );
    setFilteredProducts(
      sortBy
        ? sortProductsByPrice(filtered, sortBy as "asc" | "desc")
        : filtered
    );
  }

  function onPageChange(pg: number, event: React.MouseEvent) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set("page", pg.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onCategorySelect(key: string) {
    setActiveCategory(key);
    const params = new URLSearchParams(searchParams);
    if (key === "all") params.delete("category");
    else params.set("category", key);
    params.delete("page");
    setSearchParams(params);
  }

  function addProductToCart(product: Product) {
    dispatch(addToCart({ product, quantity: 1 }));
  }

  function handleBuyNow(productId: number) {
    navigate(`/product/${productId}`);
  }

  function buildPagination() {
    const pages = [];
    for (
      let i = pageNumber > 4 ? pageNumber - 2 : 1;
      i <= pageNumber + 2 && i <= numberOfPages;
      i++
    ) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={(e) => onPageChange(i, e)}
            isActive={pageNumber === i}
            href="#"
            className={
              pageNumber === i
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-md shadow-indigo-200 hover:from-indigo-700 hover:to-violet-700"
                : "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
            }
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4 p-4 mt-4">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 animate-pulse h-64 mx-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      }
    >
      <Await resolve={products}>
        <div className="flex flex-col gap-6 pb-12 bg-gray-50 min-h-screen">
          {/* Flash Banner */}
          <FlashBanner />

          {/* Hero */}
          <HeroSection />

          {/* Promo Strip */}
          <PromoStrip />

          {/* Category Bar */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center px-4">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-500" />
                Browse Categories
              </h2>
            </div>
            <CategoryBar active={activeCategory} onSelect={onCategorySelect} />
          </div>

          {/* Filter + Admin Bar */}
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span className="font-bold text-sm text-gray-700">
                {filteredProducts.length} Products
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Filters
                minPrice={sortedProducts.at(0)?.price}
                maxPrice={sortedProducts.at(-1)?.price}
                onPriceChange={onPriceChange}
                onSortingChanged={onSortingChanged}
              />
              {userRole === "admin" && (
                <div className="flex gap-2 ml-2">
                  {[
                    { icon: Plus, label: "Add", fn: handleAddProduct },
                    { icon: Edit, label: "Edit", fn: handleEditProduct },
                    { icon: Trash2, label: "Delete", fn: handleDeleteProduct },
                    { icon: MapPin, label: "Shipping", fn: handleViewShipping },
                  ].map(({ icon: Icon, label, fn }) => (
                    <button
                      key={label}
                      onClick={fn}
                      className="btn-ripple flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200 shadow-sm"
                    >
                      <Icon className="w-3 h-3" />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <section className="px-4">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 animate-scale-in">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-9 h-9 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700">
                  No Products Found
                </h3>
                <p className="text-gray-400 text-sm text-center max-w-xs">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => setFilteredProducts(products)}
                  className="btn-ripple bg-indigo-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    onAddToCart={addProductToCart}
                    onBuyNow={handleBuyNow}
                    onView={(id) => navigate(`/product/${id}`)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Pagination */}
          {numberOfPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent className="flex-wrap gap-1">
                {pageNumber > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => onPageChange(pageNumber - 1, e)}
                      href="#"
                      className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                    />
                  </PaginationItem>
                )}
                {buildPagination()}
                {pageNumber + 2 < numberOfPages && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {pageNumber < numberOfPages && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => onPageChange(pageNumber + 1, e)}
                      href="#"
                      className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}

          {/* Bottom CTA */}
          <div className="mx-4 rounded-2xl overflow-hidden relative flex items-center justify-between px-8 py-10 gap-6">
            <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-[length:200%_200%]" />
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">
                  Limited Time Offer
                </span>
              </div>
              <h3 className="text-white text-2xl font-extrabold">
                Get 20% off your first order!
              </h3>
              <p className="text-white/70 text-sm">
                Use code{" "}
                <span className="text-yellow-300 font-bold">WELCOME20</span> at
                checkout
              </p>
            </div>
            <button className="relative z-10 btn-ripple shrink-0 bg-white text-indigo-700 font-bold text-sm px-6 py-3 rounded-xl shadow-xl hover:scale-105 transition-all duration-200 hidden sm:block">
              Claim Offer →
            </button>
          </div>
        </div>
      </Await>
    </Suspense>
  );
}

// ─── Admin handlers ────────────────────────────────────────────────────────────

function handleAddProduct() { window.location.href = "/admin"; }
function handleEditProduct() { window.location.href = "/admin"; }
function handleDeleteProduct() { window.location.href = "/admin"; }
function handleViewShipping() { window.location.href = "/admin"; }
