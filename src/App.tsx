import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Index from "./pages/Index";
import ElectionsPage from "./pages/ElectionsPage";
import VoterRegistration from "./pages/VoterRegistration";
import VerifyVote from "./pages/VerifyVote";
import VotingPage from "./pages/VotingPage";
import ResultsPage from "./pages/ResultsPage";
import BoothLocator from "./pages/BoothLocator";
import DocumentsPage from "./pages/DocumentsPage";
import HelpCenter from "./pages/HelpCenter";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import type { AdminRole } from "./lib/mockData";

const queryClient = new QueryClient();

const adminRoles: AdminRole[] = ['super', 'ec', 'state', 'district', 'constituency', 'booth', 'staff'];

function PublicLayout() {
  return <Layout><Outlet /></Layout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/elections" element={<ElectionsPage />} />
            <Route path="/register" element={<VoterRegistration />} />
            <Route path="/verify" element={<VerifyVote />} />
            <Route path="/vote" element={<VotingPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/booths" element={<BoothLocator />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>

          {adminRoles.map(role => (
            <Route key={role} path={`/admin/${role}`} element={<AdminLayout role={role} />}>
              <Route index element={<AdminDashboard role={role} />} />
              <Route path="*" element={<AdminDashboard role={role} />} />
            </Route>
          ))}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
