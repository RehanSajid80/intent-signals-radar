
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { HubspotProvider } from "./context/hubspot";
import Dashboard from "./pages/Dashboard";
import AccountDetails from "./pages/AccountDetails";
import ContactDetails from "./pages/ContactDetails";
import Settings from "./pages/Settings";
import IntentPage from "./pages/IntentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HubspotProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Dashboard />} />
            <Route path="/accounts/:accountId" element={<AccountDetails />} />
            <Route path="/contacts/:contactId" element={<ContactDetails />} />
            <Route path="/contacts" element={<Dashboard />} />
            <Route path="/intent" element={<IntentPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </HubspotProvider>
  </QueryClientProvider>
);

export default App;
