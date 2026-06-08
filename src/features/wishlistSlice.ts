import { getStoredValue, saveValueToLocalStorage } from "@/lib/utils";
import { Product } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { items: Product[] } = {
  items: getStoredValue("wishlist") ?? [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<Product>) {
      const exists = state.items.find((p) => p.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter((p) => p.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
      saveValueToLocalStorage("wishlist", state.items);
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      saveValueToLocalStorage("wishlist", state.items);
    },
    clearWishlist(state) {
      state.items = [];
      saveValueToLocalStorage("wishlist", []);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
