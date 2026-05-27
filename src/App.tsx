import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import Profile from "./pages/Profile";
import InvoicesPage from "./pages/invoices/Index";
import NewInvoicePage from "./pages/invoices/NewInvoicePage";
import ViewInvoicePage from "./pages/invoices/ViewInvoicePage";
import EditInvoicePage from "./pages/invoices/EditInvoicePage";
import SignInPage from "./pages/Sign-in";
import SignUpPage from "./pages/Sign-Up";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/Sign-Up" element={<SignUpPage />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/invoices" element={<InvoicesPage />} />
      <Route path="/invoices/new" element={<NewInvoicePage />} />
      <Route path="/invoices/:id" element={<ViewInvoicePage />} />
      <Route path="/invoices/:id/edit" element={<EditInvoicePage />} />
    </Routes>
  );
};

export default App;
