import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login.tsx";
import Layout from "./components/ui/layout.tsx";
import Dashboard, { loader } from "./pages/dashboard.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import Cart from "./pages/cart.tsx";
import ProductInfo, { loader as productLoader } from "./pages/product.tsx";
import Payment from "./pages/paymen.tsx";
import { getStoredValue } from "./lib/utils.ts";
import Wishlist from "./pages/wishlist.tsx";
import Orders from "./pages/orders.tsx";
import AdminPage from "./pages/admin.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: loader,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/product/:productId",
        element: <ProductInfo />,
        loader: productLoader,
      },
      {
        path: "payment",
        element: <Payment />,
        loader: () => {
          const user = getStoredValue("user");
          if (!user) {
            return redirect("/login");
          }
          return null;
        },
      },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/orders", element: <Orders /> },
      {
        path: "/admin",
        element: <AdminPage />,
        loader: () => {
          const user = getStoredValue("user");
          if (!user) return redirect("/login");
          return null;
        },
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);