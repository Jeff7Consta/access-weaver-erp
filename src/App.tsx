
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/admin/Users";
import GroupsPage from "./pages/admin/Groups";
import AccessLevelsPage from "./pages/admin/AccessLevels";
import MenusPage from "./pages/admin/Menus";
import ScreensPage from "./pages/admin/Screens";

// Analytics pages
import AnalyticsQueries from "./pages/analytics/AnalyticsQueries";
import { AnalyticsQueryForm } from "./pages/analytics/AnalyticsQueryForm";
import AnalyticsQueryRunner from "./pages/analytics/AnalyticsQueryRunner";

// PowerBI pages
import PowerBIReports from "./pages/powerbi/PowerBIReports";
import { PowerBIReportForm } from "./pages/powerbi/PowerBIReportForm";
import PowerBIViewer from "./pages/powerbi/PowerBIViewer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* User routes */}
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            
            {/* Analytics routes */}
            <Route path="/analytics/queries" element={<MainLayout><AnalyticsQueries /></MainLayout>} />
            <Route path="/analytics/queries/new" element={<MainLayout><AnalyticsQueryForm /></MainLayout>} />
            <Route path="/analytics/queries/:id/edit" element={<MainLayout><AnalyticsQueryForm initialData={undefined} /></MainLayout>} />
            <Route path="/analytics/queries/:id/run" element={<MainLayout><AnalyticsQueryRunner /></MainLayout>} />
            
            {/* PowerBI routes */}
            <Route path="/powerbi/reports" element={<MainLayout><PowerBIReports /></MainLayout>} />
            <Route path="/powerbi/reports/new" element={<MainLayout><PowerBIReportForm /></MainLayout>} />
            <Route path="/powerbi/reports/:id/edit" element={<MainLayout><PowerBIReportForm initialData={undefined} /></MainLayout>} />
            <Route path="/powerbi/reports/:id/view" element={<MainLayout><PowerBIViewer /></MainLayout>} />
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<MainLayout requireAdmin><Dashboard /></MainLayout>} />
            <Route path="/admin/users" element={<MainLayout requireAdmin><UsersPage /></MainLayout>} />
            <Route path="/admin/groups" element={<MainLayout requireAdmin><GroupsPage /></MainLayout>} />
            <Route path="/admin/access-levels" element={<MainLayout requireAdmin><AccessLevelsPage /></MainLayout>} />
            <Route path="/admin/menus" element={<MainLayout requireAdmin><MenusPage /></MainLayout>} />
            <Route path="/admin/screens" element={<MainLayout requireAdmin><ScreensPage /></MainLayout>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
