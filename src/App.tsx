
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
            
            {/* Protected routes wrapped in MainLayout */}
            <Route element={<MainLayout />}>
              {/* User routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Analytics routes */}
              <Route path="/analytics/queries" element={<AnalyticsQueries />} />
              <Route path="/analytics/queries/new" element={<AnalyticsQueryForm />} />
              <Route path="/analytics/queries/:id/edit" element={<AnalyticsQueryForm initialData={undefined} />} />
              <Route path="/analytics/queries/:id/run" element={<AnalyticsQueryRunner />} />
              
              {/* PowerBI routes */}
              <Route path="/powerbi/reports" element={<PowerBIReports />} />
              <Route path="/powerbi/reports/new" element={<PowerBIReportForm />} />
              <Route path="/powerbi/reports/:id/edit" element={<PowerBIReportForm initialData={undefined} />} />
              <Route path="/powerbi/reports/:id/view" element={<PowerBIViewer />} />
              
              {/* Admin routes */}
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/groups" element={<GroupsPage />} />
              <Route path="/admin/access-levels" element={<AccessLevelsPage />} />
              <Route path="/admin/menus" element={<MenusPage />} />
              <Route path="/admin/screens" element={<ScreensPage />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
