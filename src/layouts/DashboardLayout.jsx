import { useState } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import MainContent from "../components/Dashboard/MainContent";
import { Helmet } from "react-helmet-async";
export default function DashboardLayout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    window.innerWidth >= 640,
  );
  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };
  return (
    <>
      {" "}
      <Helmet>
        {" "}
        <title>Dashboard | Okkhor</title>{" "}
      </Helmet>{" "}
      <section className="relative flex min-h-screen bg-white dark:bg-black">
        {" "}
        {/* Overlay for mobile */}{" "}
        <div
          onClick={toggleSidebar}
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 sm:hidden ${isSidebarVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        />{" "}
        {/* Sidebar Wrapper */}{" "}
        <div
          className={`fixed inset-y-0 left-0 z-50 shrink-0 overflow-hidden transition-all duration-300 ease-in-out sm:sticky sm:top-0 sm:h-screen ${isSidebarVisible ? "w-72 translate-x-0" : "w-72 -translate-x-full sm:w-0 sm:translate-x-0"}`}
        >
          {" "}
          <div className="h-full w-72 shrink-0">
            {" "}
            <Sidebar toggleSidebar={toggleSidebar} />{" "}
          </div>{" "}
        </div>{" "}
        <MainContent
          toggleSidebar={toggleSidebar}
          isSidebarVisible={isSidebarVisible}
        />{" "}
      </section>{" "}
    </>
  );
}
