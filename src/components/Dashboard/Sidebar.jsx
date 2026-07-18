import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaUsersCog, FaBookmark, FaChartPie } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { MdLibraryAddCheck, MdRateReview, MdHistory } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { TbMessageReportFilled } from "react-icons/tb";
import useRole from "../../hooks/useRole";
import { useTheme } from "../../providers/ThemeProvider";
export default function Sidebar({ toggleSidebar }) {
  const { user, logOut } = useAuth();
  const [role] = useRole();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const handleLinkClick = () => {
    if (window.innerWidth < 640) {
      toggleSidebar();
    }
  };
  const navLinkClasses = ({ isActive }) =>
    `flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 ${isActive ? "bg-black font-semibold text-white dark:bg-white dark:text-black" : "text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white"}`;
  return (
    <aside
      id="sidebar"
      className="flex h-full w-full flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-black"
    >
      {" "}
      <div className="flex h-16 items-center gap-4 border-b border-gray-200 p-4 dark:border-gray-800">
        {" "}
        <div
          className="transition- flex cursor-pointer items-center gap-2"
          onClick={() => navigate("/")}
        >
          {" "}
          {theme === "dark" ||
          (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches) ? (
            <img
              className="h-8 w-8 invert"
              src="/okkhor.svg"
              alt="Okkhor Logo"
            />
          ) : (
            <img className="h-8 w-8" src="/okkhor.svg" alt="Okkhor Logo" />
          )}{" "}
          <span className="text-2xl font-bold tracking-tight">Okkhor</span>{" "}
        </div>{" "}
      </div>{" "}
      <section className="flex h-[calc(100vh-64px)] flex-col justify-between">
        {" "}
        <section className="flex-1 overflow-y-auto px-4 py-6">
          {" "}
          <div className="flex flex-col gap-2">
            {" "}
            <NavLink
              to="my-profile"
              onClick={handleLinkClick}
              className={navLinkClasses}
            >
              {" "}
              <FaUser className="text-lg" /> <span>My Profile</span>{" "}
            </NavLink>{" "}
            <NavLink
              to="my-activity"
              onClick={handleLinkClick}
              className={navLinkClasses}
            >
              {" "}
              <MdHistory className="text-lg" /> <span>My Activity</span>{" "}
            </NavLink>{" "}
            {role === "user" && (
              <>
                {" "}
                <NavLink
                  to="analytics"
                  onClick={handleLinkClick}
                  className={navLinkClasses}
                >
                  {" "}
                  <IoStatsChart className="text-lg" />{" "}
                  <span>Analytics</span>{" "}
                </NavLink>{" "}
                <NavLink
                  to="add-blog"
                  onClick={handleLinkClick}
                  className={navLinkClasses}
                >
                  {" "}
                  <MdLibraryAddCheck className="text-lg" />{" "}
                  <span>Add Blog</span>{" "}
                </NavLink>{" "}
                <NavLink
                  to="my-blogs"
                  onClick={handleLinkClick}
                  className={navLinkClasses}
                >
                  {" "}
                  <AiFillProduct className="text-lg" />{" "}
                  <span>My Blogs</span>{" "}
                </NavLink>{" "}
                <NavLink
                  to="saved-blogs"
                  onClick={handleLinkClick}
                  className={navLinkClasses}
                >
                  {" "}
                  <FaBookmark className="text-lg" />{" "}
                  <span>Saved Blogs</span>{" "}
                </NavLink>{" "}
              </>
            )}{" "}
            {(role === "moderator" || role === "admin") && (
              <>
                {" "}
                <NavLink
                  to="blog-review-queue"
                  onClick={handleLinkClick}
                  className={navLinkClasses}
                >
                  {" "}
                  <MdRateReview className="text-lg" />{" "}
                  <span>Blog Review Queue</span>{" "}
                </NavLink>{" "}
                <NavLink
                  to="reported-contents"
                  onClick={handleLinkClick}
                  className={navLinkClasses}
                >
                  {" "}
                  <TbMessageReportFilled className="text-lg" />{" "}
                  <span>Reported Contents</span>{" "}
                </NavLink>{" "}
              </>
            )}{" "}
            {role === "admin" && (
              <>
                {" "}
                <NavLink
                  to="platform-analytics"
                  onClick={handleLinkClick}
                  className={navLinkClasses}
                >
                  {" "}
                  <FaChartPie className="text-lg" />{" "}
                  <span>Platform Analytics</span>{" "}
                </NavLink>{" "}
                <NavLink
                  to="manage-users"
                  onClick={handleLinkClick}
                  className={navLinkClasses}
                >
                  {" "}
                  <FaUsersCog className="text-lg" />{" "}
                  <span>Manage Users</span>{" "}
                </NavLink>{" "}
                <NavLink
                  to="system-logs"
                  onClick={handleLinkClick}
                  className={navLinkClasses}
                >
                  {" "}
                  <MdHistory className="text-lg" />{" "}
                  <span>System Logs</span>{" "}
                </NavLink>{" "}
              </>
            )}{" "}
          </div>{" "}
        </section>{" "}
        <section className="flex flex-col gap-3 border-t border-gray-200 p-4 dark:border-gray-800">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <img
              className="h-10 w-10 rounded-full border border-gray-200 object-cover dark:border-gray-800"
              src={user?.photoURL}
              alt={user?.displayName || "User Profile"}
              referrerPolicy="no-referrer"
            />{" "}
            <div className="flex flex-1 flex-col overflow-hidden">
              {" "}
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {" "}
                {user?.displayName}{" "}
              </p>{" "}
              <p className="truncate text-xs capitalize text-gray-600">
                {" "}
                {role}{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <button
            onClick={() => logOut()}
            className="w-full rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
          >
            {" "}
            Log out{" "}
          </button>{" "}
        </section>{" "}
      </section>{" "}
    </aside>
  );
}
Sidebar.propTypes = { toggleSidebar: PropTypes.func.isRequired };
