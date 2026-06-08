import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
import { MapPin, User, Home, Building2, Mail, ChevronRight } from "lucide-react";

const formSchema = z.object({
  name:       z.string().min(2, { message: "Full name is required" }),
  line1:      z.string().min(4, { message: "Address line 1 is required" }),
  line2:      z.string().optional(),
  city:       z.string().min(1, { message: "City is required" }),
  state:      z.string().min(1, { message: "State is required" }),
  postalCode: z.string().min(6, { message: "6-digit postal code required" }),
});
export type AddressFormValues = z.infer<typeof formSchema>;

export default function AddressForm({ onFormSubmit }: { onFormSubmit: (data: AddressFormValues) => void }) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", line1: "", line2: "", city: "", state: "", postalCode: "" },
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-100">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-extrabold text-gray-800 text-base leading-none">Delivery Address</h2>
          <p className="text-xs text-gray-400 mt-0.5">Where should we deliver your order?</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
          {/* Full name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="John Doe"
                      className="pl-10 rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all h-11"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Address Line 1 */}
          <FormField
            control={form.control}
            name="line1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Address Line 1</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="House no., Street, Area"
                      className="pl-10 rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all h-11"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Address Line 2 */}
          <FormField
            control={form.control}
            name="line2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Address Line 2 <span className="text-gray-400 normal-case font-medium">(optional)</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="Apartment, landmark, etc."
                      className="pl-10 rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all h-11"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* City + State */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mumbai"
                      className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">State</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Maharashtra"
                      className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Postal code */}
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Postal Code</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="400001"
                      maxLength={6}
                      className="pl-10 rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all h-11"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="btn-ripple mt-2 w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            Continue to Payment <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </Form>
    </div>
  );
}
