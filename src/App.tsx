import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Portfolio from "./pages/Portfolio";
import Orderbook from "./pages/Orderbook";
import Welcome from "./pages/Welcome";
import Auth from "./pages/auth/Auth";
import QRCode from "./pages/QRCode";
import Admin from "./pages/admin/Admin";
import Members from "./pages/admin/Members";
import MemberDetail from "./pages/admin/MemberDetail";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/use-auth";
import OrderMock from "./pages/OrderMock";
import ApiKeys from "./pages/ApiKeys";
import ApiDocs from "./pages/ApiDocs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Auth route (no layout) */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/qrcode/:id" element={<QRCode />} />

              {/* Protected routes with layout */}
              <Route
                path="/"
                element={
                  <Layout>
                    <Portfolio />
                  </Layout>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <Layout>
                    <Portfolio />
                  </Layout>
                }
              />
              <Route
                path="/orderbook"
                element={
                  <Layout>
                    <OrderMock />
                  </Layout>
                }
              />
              <Route
                path="/welcome"
                element={
                  <Layout>
                    <Welcome />
                  </Layout>
                }
              />
              <Route
                path="/admin"
                element={
                  <Layout>
                    <Admin />
                  </Layout>
                }
              />
              <Route
                path="/admin/members"
                element={
                  <Layout>
                    <Members />
                  </Layout>
                }
              />
              <Route
                path="/admin/members/:accountId"
                element={
                  <Layout>
                    <MemberDetail />
                  </Layout>
                }
              />
              <Route
                path="/api-keys"
                element={
                  <Layout>
                    <ApiKeys />
                  </Layout>
                }
              />
              <Route
                path="/api-docs"
                element={
                  <Layout>
                    <ApiDocs />
                  </Layout>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
