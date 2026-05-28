import { Outlet } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      {/* Shared Sidebar */}
      <Sidebar />

      {/* Main Responsive Layout Wrapper */}
      <div className="md:pl-64">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
