import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "./input";
import {
  Search, ShoppingCart, UserRoundPen, X, ChevronDown,
  Package, Heart, LogOut, User, Settings, Zap,
  Truck, ShieldCheck, RotateCcw, Phone, Mail, MapPin,
  Instagram, Twitter, Facebook, Youtube,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { getCartItemCount } from "@/lib/utils";
import { Toaster } from "./sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/features/user-slice";

function Header() {
  const { items } = useSelector((state: RootState) => state.cart);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user } = useSelector((state: RootState) => (state.user as any));
  const totalItems = getCartItemCount(items);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Sync search input with URL
  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearch(q);
  }, [searchParams]);

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Load categories
  useEffect(() => {
    fetch("https://dummyjson.com/products/category-list")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  function onCategoryChange(val: string) {
    navigate(val === "all" ? "/" : `/?category=${val}`);
  }

  function searchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    if (e.target.value === "") navigate("/");
  }

  function onSearchSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (search.trim()) navigate(`/?search=${search.trim()}`);
  }

  function clearSearch() {
    setSearch("");
    navigate("/");
    searchRef.current?.focus();
  }

  function onLogout() {
    dispatch(logout());
    navigate("/");
  }

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white text-[11px] font-semibold py-1.5 text-center tracking-wide">
        🎉 Use code <span className="bg-white/20 px-1.5 py-0.5 rounded font-black">WELCOME20</span> for 20% off your first order &nbsp;·&nbsp; Free shipping above ₹999
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-shadow duration-200 ${
          scrolled ? "shadow-md shadow-black/5" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-[auto_1fr_auto] gap-4 items-center">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none select-none shrink-0">
            <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
              ShopZen
            </span>
            <span className="text-[9px] font-semibold text-gray-400 tracking-widest uppercase -mt-0.5">
              Premium Store
            </span>
          </Link>

          {/* Search + Category — hidden on mobile unless toggled */}
          <form
            onSubmit={onSearchSubmit}
            className={`items-center gap-2 ${mobileSearchOpen ? "flex" : "hidden sm:flex"}`}
          >
            {/* Category picker */}
            <Select onValueChange={onCategoryChange}>
              <SelectTrigger className="hidden md:flex w-36 rounded-xl border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-200 h-10 shrink-0">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                <SelectItem value="all" className="capitalize text-xs font-semibold">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize text-xs">
                    {cat.replace(/-/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search input */}
            <div
              className={`flex items-center flex-1 h-10 rounded-xl border transition-all duration-200 bg-gray-50 ${
                searchFocused
                  ? "border-indigo-400 ring-2 ring-indigo-100 bg-white shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Search className="w-4 h-4 text-gray-400 ml-3 shrink-0" />
              <Input
                ref={searchRef}
                type="search"
                value={search}
                onChange={searchChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search products, brands..."
                className="border-none shadow-none focus-visible:ring-0 bg-transparent text-sm h-full flex-1"
              />
              {search && (
                <button type="button" onClick={clearSearch} className="mr-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="mr-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 h-8 rounded-lg transition-all duration-200 shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile search toggle */}
            <button
              className="sm:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileSearchOpen((v) => !v)}
            >
              {mobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 group"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-badge-pop shadow-sm">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            <button onClick={() => navigate("/orders")}>  
              <Package className="w-5 h-5 text-gray-600 hover:text-indigo-600 transition-colors" />
            </button>

            {/* Wishlist shortcut */}
            <button onClick={() => navigate("/orders?tab=wishlist")} className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-500 transition-all duration-200">
              <Heart className="w-5 h-5" />
            </button>

            {/* User */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-all duration-200 outline-none">
                    <Avatar className="w-8 h-8 ring-2 ring-indigo-200">
                      <AvatarImage src="" alt={user.firstName} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold">
                        {user.email?.charAt(0) ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="hidden md:block w-3 h-3 text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-2xl border-gray-100 shadow-xl shadow-black/5 p-1.5">
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold">
                          {user.email?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="leading-none">
                        <div className="text-sm font-bold text-gray-800">{user.firstName}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  {[
                    { icon: User, label: "Profile", path: "/" },
                    { icon: Settings, label: "Settings", path: "/" },
                  ].map(({ icon: Icon, label, path }) => (
                    <DropdownMenuItem key={label} onClick={() => navigate(path)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50 focus:text-indigo-700">
                      <Icon className="w-4 h-4 text-gray-400" />
                      {label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-500 cursor-pointer hover:bg-red-50 focus:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-indigo-200"
              >
                <UserRoundPen className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile search row */}
        {mobileSearchOpen && (
          <div className="sm:hidden px-4 pb-3 animate-fade-in-down">
            <form onSubmit={onSearchSubmit} className="flex gap-2">
              <div className="flex items-center flex-1 h-10 rounded-xl border border-indigo-300 ring-2 ring-indigo-100 bg-white">
                <Search className="w-4 h-4 text-gray-400 ml-3 shrink-0" />
                <Input
                  autoFocus
                  type="search"
                  value={search}
                  onChange={searchChange}
                  placeholder="Search products..."
                  className="border-none shadow-none focus-visible:ring-0 bg-transparent text-sm h-full flex-1"
                />
                {search && (
                  <button type="button" onClick={clearSearch} className="mr-2 text-gray-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button type="submit" className="bg-indigo-600 text-white text-xs font-bold px-4 h-10 rounded-xl">
                Go
              </button>
            </form>
          </div>
        )}
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      {/* Top CTA strip */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck,       title: "Free Shipping",   sub: "On orders above ₹999" },
            { icon: RotateCcw,   title: "Easy Returns",    sub: "7-day hassle-free returns" },
            { icon: ShieldCheck, title: "Secure Payment",  sub: "256-bit SSL encryption" },
            { icon: Zap,         title: "24/7 Support",    sub: "Always here to help" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/30 to-violet-600/30 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-white text-xs font-bold">{title}</div>
                <div className="text-gray-500 text-[10px]">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-3">
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              ShopZen
            </span>
            <span className="text-[9px] text-gray-500 tracking-widest uppercase mt-0.5">Premium Store</span>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed">
            Discover premium products at unbeatable prices. Fast delivery, easy returns, and world-class support.
          </p>
          <div className="flex gap-2 mt-1">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <button key={i} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-indigo-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Shop links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider">Shop</h4>
          {["New Arrivals", "Best Sellers", "Sale & Offers", "Electronics", "Fashion", "Home & Garden"].map((l) => (
            <button key={l} className="text-gray-500 hover:text-indigo-400 text-xs text-left transition-colors duration-200">
              {l}
            </button>
          ))}
        </div>

        {/* Help links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider">Help</h4>
          {["Track Your Order", "Returns & Refunds", "Shipping Policy", "Privacy Policy", "Terms of Service", "FAQ"].map((l) => (
            <button key={l} className="text-gray-500 hover:text-indigo-400 text-xs text-left transition-colors duration-200">
              {l}
            </button>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider">Contact</h4>
          {[
            { icon: Phone, text: "+91 98765 43210" },
            { icon: Mail,  text: "support@shopzen.in" },
            { icon: MapPin,text: "Mumbai, Maharashtra, India" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-2 text-gray-500 text-xs">
              <Icon className="w-3.5 h-3.5 mt-0.5 text-indigo-500 shrink-0" />
              <span>{text}</span>
            </div>
          ))}
          {/* Newsletter */}
          <div className="mt-2 flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-[11px]">
            © {new Date().getFullYear()} ShopZen. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {["VISA", "MC", "AMEX", "UPI", "RuPay"].map((brand) => (
              <span key={brand} className="text-[9px] font-black text-gray-600 bg-gray-800 border border-gray-700 px-2 py-1 rounded-md tracking-wider">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <section id="layout" className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
        <Toaster richColors position="top-right" />
      </main>
      <Footer />
    </section>
  );
}
