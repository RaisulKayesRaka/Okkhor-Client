import { useState, useEffect, useRef } from "react";
import { IoCloseOutline, IoMenuOutline } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../providers/ThemeProvider";
export default function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { user, logOut } = useAuth();
  const { theme } = useTheme();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !dropdownButtonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);
  return (
    <>
      {" "}
      <nav className="sticky top-0 z-50 border-b bg-white py-5 dark:border-gray-800 dark:bg-black">
        {" "}
        <div className="mx-auto flex w-11/12 max-w-screen-xl items-center justify-between">
          {" "}
          <section className="flex items-center justify-center gap-2">
            {" "}
            {theme === "dark" ||
            (theme === "system" &&
              window.matchMedia("(prefers-color-scheme: dark)").matches) ? (
              <img
                onClick={() => {
                  setOpen(false);
                  navigate("/");
                }}
                className="h-9 w-9 cursor-pointer invert"
                src="/okkhor.svg"
                alt="Okkhor Logo"
              />
            ) : (
              <img
                onClick={() => {
                  setOpen(false);
                  navigate("/");
                }}
                className="h-9 w-9 cursor-pointer"
                src="/okkhor.svg"
                alt="Okkhor Logo"
              />
            )}{" "}
            <h3
              onClick={() => {
                setOpen(false);
                navigate("/");
              }}
              className="cursor-pointer text-3xl font-semibold"
            >
              {" "}
              Okkhor{" "}
            </h3>{" "}
          </section>{" "}
          <section className="flex items-center gap-8">
            {" "}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? "font-bold" : ""} hidden sm:block`
              }
            >
              {" "}
              Home{" "}
            </NavLink>{" "}
            <NavLink
              to="/blogs"
              className={({ isActive }) =>
                `${isActive ? "font-bold" : ""} hidden sm:block`
              }
            >
              {" "}
              Blogs{" "}
            </NavLink>{" "}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${isActive ? "font-bold" : ""} hidden sm:block`
              }
            >
              {" "}
              About{" "}
            </NavLink>{" "}
            <NavLink
              to="/faq"
              className={({ isActive }) =>
                `${isActive ? "font-bold" : ""} hidden sm:block`
              }
            >
              {" "}
              FAQ{" "}
            </NavLink>{" "}
            <ThemeToggle />{" "}
            {user && user?.email ? (
              <div
                ref={dropdownButtonRef}
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="relative hidden h-9 w-9 cursor-pointer rounded-full sm:block"
              >
                {" "}
                <img
                  className="h-9 w-9 cursor-pointer rounded-full border"
                  src={user?.photoURL}
                  alt=""
                  referrerPolicy="no-referrer"
                />{" "}
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 top-12 flex min-w-56 flex-col rounded-lg border bg-white py-2 dark:border-gray-800 dark:bg-black"
                  >
                    {" "}
                    <p className="px-4 py-3 font-semibold">
                      {" "}
                      {user?.displayName}{" "}
                    </p>{" "}
                    <hr className="dark:border-gray-800" />{" "}
                    <Link
                      to="/dashboard"
                      className="mt-2 px-4 py-2 hover:bg-gray-50 focus:scale-95 dark:hover:bg-gray-900"
                    >
                      {" "}
                      Dashboard{" "}
                    </Link>{" "}
                    <button
                      onClick={logOut}
                      className="px-4 py-2 text-left hover:bg-gray-50 focus:scale-95 dark:hover:bg-gray-900"
                    >
                      {" "}
                      Logout{" "}
                    </button>{" "}
                  </div>
                )}{" "}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="hidden rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus:scale-95 dark:bg-white dark:text-black sm:block"
              >
                {" "}
                Login{" "}
              </NavLink>
            )}{" "}
            <button
              onClick={() => setOpen(true)}
              className="text-3xl sm:hidden"
              aria-label="Open Menu"
            >
              {" "}
              <IoMenuOutline />{" "}
            </button>{" "}
          </section>{" "}
          <section
            className={`fixed inset-0 z-[100] block h-[100dvh] w-full overflow-y-auto bg-white transition-all duration-300 ease-in-out dark:bg-black sm:hidden ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-full opacity-0"}`}
          >
            {" "}
            <div className="flex min-h-full flex-col p-6">
              {" "}
              <div className="flex justify-end">
                {" "}
                <button
                  onClick={() => setOpen(false)}
                  className="text-3xl"
                  aria-label="Close Menu"
                >
                  {" "}
                  <IoCloseOutline />{" "}
                </button>{" "}
              </div>{" "}
              <div className="mt-8 flex-1 text-center">
                {" "}
                <NavLink
                  to="/"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${isActive ? "font-bold" : ""} block py-3`
                  }
                >
                  {" "}
                  Home{" "}
                </NavLink>{" "}
                <NavLink
                  to="/blogs"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${isActive ? "font-bold" : ""} block py-3`
                  }
                >
                  {" "}
                  Blogs{" "}
                </NavLink>{" "}
                <NavLink
                  to="/about"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${isActive ? "font-bold" : ""} block py-3`
                  }
                >
                  {" "}
                  About{" "}
                </NavLink>{" "}
                <NavLink
                  to="/faq"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${isActive ? "font-bold" : ""} block py-3`
                  }
                >
                  {" "}
                  FAQ{" "}
                </NavLink>{" "}
              </div>{" "}
              {user && user?.email ? (
                <div className="w-full rounded-lg border py-4 dark:border-gray-800">
                  {" "}
                  <div className="flex items-center justify-center">
                    {" "}
                    <img
                      className="h-24 w-24 rounded-full"
                      src={user?.photoURL}
                      alt=""
                      referrerPolicy="no-referrer"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="px-4 py-3 text-center font-semibold">
                      {" "}
                      {user?.displayName}{" "}
                    </p>{" "}
                    <hr className="dark:border-gray-800" />{" "}
                    <div className="flex flex-col">
                      {" "}
                      <Link
                        to="/dashboard"
                        onClick={() => setOpen(false)}
                        className="mt-2 px-4 py-2 text-center hover:bg-gray-50 focus:scale-95 dark:hover:bg-gray-900"
                      >
                        {" "}
                        Dashboard{" "}
                      </Link>{" "}
                      <button
                        onClick={() => {
                          logOut();
                          setOpen(false);
                        }}
                        className="block px-4 py-2 text-center hover:bg-gray-50 focus:scale-95 dark:hover:bg-gray-900"
                      >
                        {" "}
                        Logout{" "}
                      </button>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg bg-black px-4 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800 focus:scale-95 dark:bg-white dark:text-black"
                >
                  {" "}
                  Login{" "}
                </NavLink>
              )}{" "}
            </div>{" "}
          </section>{" "}
        </div>{" "}
      </nav>{" "}
    </>
  );
}
