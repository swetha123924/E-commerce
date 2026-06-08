import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { login } from "@/features/user-slice";
import { Eye, EyeOff, Mail, Lock, User, ShoppingBag, Zap, ShieldCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(8, "Must be at least 8 characters"),
});

const registrationSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(8, "Must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["user", "admin"]),
});

function IconInput({
  icon: Icon, type = "text", placeholder, showToggle, error, ...rest
}: {
  icon: React.ElementType;
  type?: string;
  placeholder: string;
  showToggle?: boolean;
  error?: string;
  [key: string]: unknown;
}) {
  const [show, setShow] = useState(false);
  const inputType = showToggle ? (show ? "text" : "password") : type;
  return (
    <div className="flex flex-col gap-1">
      <div className={`flex items-center gap-2 bg-gray-50 border ${error ? "border-red-400" : "border-gray-200"} rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-transparent transition-all`}>
        <Icon className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          type={inputType}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400"
        />
        {showToggle && (
          <button type="button" onClick={() => setShow((s) => !s)} className="text-gray-400 hover:text-indigo-500 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
    </div>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginForm = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const registrationForm = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: { email: "", password: "", firstName: "", lastName: "", role: "user" as "user" | "admin" },
  });

  async function onLogin({ email, password }: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const err = await response.json();
        toast.error(err.message ?? "Login failed");
        return;
      }
      const data = await response.json();
      dispatch(login({ ...data, role: data.role }));
      toast.success(`Welcome back, ${data.firstName ?? "User"}!`);
      navigate("/");
    } catch {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(data: z.infer<typeof registrationSchema>) {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        toast.error(err.message ?? "Registration failed");
        return;
      }
      toast.success("Account created! Please log in.");
      setIsLogin(true);
    } catch {
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="fixed top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-violet-200 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2 rounded-2xl shadow-lg shadow-indigo-200 mb-3">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-black text-lg tracking-tight">ShopZen</span>
            <Zap className="w-4 h-4 fill-current text-yellow-300" />
          </div>
          <p className="text-sm text-gray-400">Your premium shopping destination</p>
        </div>

        <div className="glass-card bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-100 border border-white/60 p-7 flex flex-col gap-6">
          <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
            {["Login", "Register"].map((tab) => (
              <button
                key={tab}
                onClick={() => setIsLogin(tab === "Login")}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  (tab === "Login") === isLogin
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {isLogin && (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="flex flex-col gap-4">
                <div>
                  <h2 className="font-extrabold text-gray-800 text-xl">Welcome back 👋</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Sign in to continue shopping</p>
                </div>
                <FormField control={loginForm.control} name="email" render={({ field, fieldState }) => (
                  <FormItem><FormControl>
                    <IconInput icon={Mail} type="email" placeholder="Email address" error={fieldState.error?.message} {...field} />
                  </FormControl></FormItem>
                )} />
                <FormField control={loginForm.control} name="password" render={({ field, fieldState }) => (
                  <FormItem><FormControl>
                    <IconInput icon={Lock} placeholder="Password" showToggle error={fieldState.error?.message} {...field} />
                  </FormControl></FormItem>
                )} />
                <button type="submit" disabled={loading}
                  className="btn-ripple w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all disabled:opacity-60 mt-1 flex items-center justify-center">
                  {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "Sign In"}
                </button>
                <p className="text-center text-xs text-gray-400">
                  Don&apos;t have an account?{" "}
                  <button type="button" onClick={() => setIsLogin(false)} className="text-indigo-600 font-semibold hover:underline">Register now</button>
                </p>
              </form>
            </Form>
          )}

          {!isLogin && (
            <Form {...registrationForm}>
              <form onSubmit={registrationForm.handleSubmit(onRegister)} className="flex flex-col gap-3">
                <div>
                  <h2 className="font-extrabold text-gray-800 text-xl">Create account ✨</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Join thousands of happy shoppers</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField control={registrationForm.control} name="firstName" render={({ field, fieldState }) => (
                    <FormItem><FormControl>
                      <IconInput icon={User} placeholder="First name" error={fieldState.error?.message} {...field} />
                    </FormControl></FormItem>
                  )} />
                  <FormField control={registrationForm.control} name="lastName" render={({ field, fieldState }) => (
                    <FormItem><FormControl>
                      <IconInput icon={User} placeholder="Last name" error={fieldState.error?.message} {...field} />
                    </FormControl></FormItem>
                  )} />
                </div>
                <FormField control={registrationForm.control} name="email" render={({ field, fieldState }) => (
                  <FormItem><FormControl>
                    <IconInput icon={Mail} type="email" placeholder="Email address" error={fieldState.error?.message} {...field} />
                  </FormControl></FormItem>
                )} />
                <FormField control={registrationForm.control} name="password" render={({ field, fieldState }) => (
                  <FormItem><FormControl>
                    <IconInput icon={Lock} placeholder="Password (min 8 chars)" showToggle error={fieldState.error?.message} {...field} />
                  </FormControl></FormItem>
                )} />
                <FormField control={registrationForm.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-2">
                        {(["user", "admin"] as const).map((r) => (
                          <button key={r} type="button" onClick={() => field.onChange(r)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                              field.value === r
                                ? r === "admin"
                                  ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200"
                                  : "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                                : "border-gray-200 text-gray-500 hover:border-indigo-300"
                            }`}>
                            {r === "admin" ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <button type="submit" disabled={loading}
                  className="btn-ripple w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all disabled:opacity-60 mt-1 flex items-center justify-center">
                  {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "Create Account"}
                </button>
                <p className="text-center text-xs text-gray-400">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setIsLogin(true)} className="text-indigo-600 font-semibold hover:underline">Sign in</button>
                </p>
              </form>
            </Form>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 mt-5 text-xs text-gray-400">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Secure login</span>
          <span className="text-gray-200">|</span>
          <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-indigo-400" /> 256-bit encrypted</span>
        </div>
      </div>
    </div>
  );
}
