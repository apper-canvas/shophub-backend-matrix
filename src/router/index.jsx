import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

// Lazy load all page components
const Home = lazy(() => import("@/components/pages/Home"));
const ProductListing = lazy(() => import("@/components/pages/ProductListing"));
const ProductDetail = lazy(() => import("@/components/pages/ProductDetail"));
const Cart = lazy(() => import("@/components/pages/Cart"));
const Checkout = lazy(() => import("@/components/pages/Checkout"));
const OrderConfirmation = lazy(() => import("@/components/pages/OrderConfirmation"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Wrap lazy components with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<div>Loading.....</div>}>
    <Component />
  </Suspense>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: withSuspense(Home)
  },
  {
    path: "products",
    element: withSuspense(ProductListing)
  },
  {
    path: "product/:id",
    element: withSuspense(ProductDetail)
  },
  {
    path: "cart",
    element: withSuspense(Cart)
  },
  {
    path: "checkout",
    element: withSuspense(Checkout)
  },
  {
    path: "order-confirmation/:orderId",
    element: withSuspense(OrderConfirmation)
  },
  {
    path: "*",
    element: withSuspense(NotFound)
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);