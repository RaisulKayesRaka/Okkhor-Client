import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import { Outlet } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
export default function MainContent({ toggleSidebar, isSidebarVisible }) {
  return (
    <>
      {" "}
      <Helmet>
        {" "}
        <title>Dashboard | Okkhor</title>{" "}
      </Helmet>{" "}
      <main className="w-full flex-1 bg-white dark:bg-black">
        {" "}
        <div className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-black">
          {" "}
          <button
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            className="block rounded-lg bg-gray-50 p-1.5 text-xl text-gray-600 transition-colors hover:bg-gray-200 hover:text-black dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            {" "}
            {isSidebarVisible ? (
              <GoSidebarCollapse />
            ) : (
              <GoSidebarExpand />
            )}{" "}
          </button>{" "}
          <div>
            {" "}
            <ThemeToggle />{" "}
          </div>{" "}
        </div>{" "}
        <div className="mx-auto w-full max-w-7xl p-6 lg:p-8">
          {" "}
          <Outlet />{" "}
        </div>{" "}
      </main>{" "}
    </>
  );
}
MainContent.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired,
};
