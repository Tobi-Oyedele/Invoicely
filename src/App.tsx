import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import Profile from "./pages/Profile";
import InvoicesPage from "./pages/invoices/Index";
import NewInvoicePage from "./pages/invoices/NewInvoicePage";
import ViewInvoicePage from "./pages/invoices/ViewInvoicePage";
import EditInvoicePage from "./pages/invoices/EditInvoicePage";
import SignInPage from "./pages/Sign-in";
import SignUpPage from "./pages/Sign-Up";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import DashboardLayout from "./components/layout/DashboardLayout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-Up" element={<SignUpPage />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Authenticated Dashboard Routes (Shared Sidebar) */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Navigate to="/invoices" replace />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/invoices/new" element={<NewInvoicePage />} />
        <Route path="/invoices/:id" element={<ViewInvoicePage />} />
        <Route path="/invoices/:id/edit" element={<EditInvoicePage />} />
      </Route>
    </Routes>
  );
};

export default App;
