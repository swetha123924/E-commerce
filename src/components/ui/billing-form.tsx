import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "./select";
import { CreditCard, User, Lock, Calendar, ShieldCheck, Zap } from "lucide-react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formSchema = z.object({
  name:       z.string().min(2, { message: "Cardholder name is required" }),
  cardNumber: z.string().min(16, { message: "Enter a valid 16-digit card number" }),
  expires:    z.string().min(1, { message: "Select expiry month" }),
  year:       z.string().min(4, { message: "Select expiry year" }),
  cvc:        z.string().min(3, { message: "CVC must be 3 digits" }).max(4),
});
export type BillingFormValues = z.infer<typeof formSchema>;

export default function BillingForm({ onFormSubmit }: { onFormSubmit: (data: BillingFormValues) => void }) {
  const form = useForm<BillingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", cardNumber: "", expires: "", year: "", cvc: "" },
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-100">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-extrabold text-gray-800 text-base leading-none">Payment Details</h2>
          <p className="text-xs text-gray-400 mt-0.5">Your card info is encrypted and secure</p>
        </div>
      </div>

      {/* Card type icons */}
      <div className="flex items-center gap-2 mb-5">
        {["VISA", "MC", "AMEX", "RuPay"].map((brand) => (
          <span key={brand} className="text-[9px] font-black text-gray-500 bg-gray-100 border border-gray-200 px-2 py-1 rounded-lg tracking-wider">
            {brand}
          </span>
        ))}
        <span className="text-[10px] text-gray-400 ml-1 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-green-500" /> All cards accepted
        </span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
          {/* Cardholder name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Cardholder Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="Name as on card"
                      className="pl-10 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all h-11"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Card number */}
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Card Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="4242 4242 4242 4242"
                      maxLength={16}
                      className="pl-10 rounded-xl border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all h-11 tracking-widest font-mono"
                      {...field}
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Expiry + CVC */}
          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={form.control}
              name="expires"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Month
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={onChange} value={value} {...rest}>
                      <SelectTrigger className="rounded-xl border-gray-200 focus:border-violet-400 h-11 text-sm">
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m, i) => (
                          <SelectItem key={m} value={`${i + 1}`}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Year</FormLabel>
                  <FormControl>
                    <Select onValueChange={onChange} value={value} {...rest}>
                      <SelectTrigger className="rounded-xl border-gray-200 focus:border-violet-400 h-11 text-sm">
                        <SelectValue placeholder="YYYY" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => {
                          const yr = new Date().getFullYear() + i;
                          return <SelectItem key={yr} value={`${yr}`}>{yr}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cvc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3" /> CVC
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="•••"
                      maxLength={4}
                      type="password"
                      className="rounded-xl border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all h-11 font-mono tracking-widest text-center"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <button
            type="submit"
            className="btn-ripple mt-2 w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <Zap className="w-4 h-4" /> Pay Now Securely
          </button>

          <p className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> 256-bit SSL encryption — your data is completely safe
          </p>
        </form>
      </Form>
    </div>
  );
}
