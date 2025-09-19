import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import { CartSidebar } from "@/components/cart-sidebar";
import Home from "@/pages/home";
import Checkout from "@/pages/checkout";
import ProductDetail from "@/pages/product-detail";
import ProductListing from "@/pages/product-listing";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Header />
      <CartSidebar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/products" component={ProductListing} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
