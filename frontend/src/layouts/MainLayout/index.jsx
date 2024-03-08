import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Toaster } from "@/components/ui/toaster";

const MainLayout = () => {
  return (
    <div className="h-screen max-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <div className="md:block hidden border-r">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col bg-secondary overflow-y-auto">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;
