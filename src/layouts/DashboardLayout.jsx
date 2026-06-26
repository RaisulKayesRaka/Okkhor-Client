import { useState } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import MainContent from "../components/Dashboard/MainContent";
import { Helmet } from "react-helmet-async";

export default function DashboardLayout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 640);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | Okkhor</title>
      </Helmet>
      <section className="flex min-h-screen relative bg-white dark:bg-black">
        {/* Overlay for mobile */}
        <div 
          onClick={toggleSidebar}
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 sm:hidden ${
            isSidebarVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`} 
        />
        
        {/* Sidebar Wrapper */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 shrink-0 overflow-hidden transition-all duration-300 ease-in-out sm:sticky sm:top-0 sm:h-screen ${
            isSidebarVisible 
              ? "translate-x-0 w-72" 
              : "-translate-x-full w-72 sm:translate-x-0 sm:w-0"
          }`}
        >
          <div className="w-72 h-full shrink-0">
            <Sidebar toggleSidebar={toggleSidebar} />
          </div>
        </div>

        <MainContent
          toggleSidebar={toggleSidebar}
          isSidebarVisible={isSidebarVisible}
        />
      </section>
    </>
  );
}
