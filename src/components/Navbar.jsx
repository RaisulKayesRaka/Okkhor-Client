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
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const navLinkClasses = ({ isActive }) =>
    `hidden sm:block px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 font-bold"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    }`;

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/70 py-4 backdrop-blur-xl dark:border-gray-800/50 dark:bg-black/70 transition-all">
        <div className="mx-auto flex w-11/12 max-w-screen-xl items-center justify-between">
          
          {/* Logo Section */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate("/");
            }}
            className="flex items-center justify-center gap-3 cursor-pointer focus:outline-none"
            aria-label="Go to home"
          >
            <img
              className="h-9 w-9"
              src="/okkhor.svg"
              alt=""
            />
            <h3
              className="text-2xl font-black tracking-tight"
            >
              Okkhor<span className="text-green-600 dark:text-green-500">.</span>
            </h3>
          </button>

          {/* Nav Links & Actions */}
          <section className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex sm:items-center sm:gap-2 mr-4">
              <NavLink to="/" className={navLinkClasses}>Home</NavLink>
              <NavLink to="/blogs" className={navLinkClasses}>Blogs</NavLink>
              <NavLink to="/about" className={navLinkClasses}>About</NavLink>
              <NavLink to="/faq" className={navLinkClasses}>FAQ</NavLink>
            </div>
            
            <ThemeToggle />
            
            {user && user?.email ? (
              <div
                ref={dropdownButtonRef}
                className="relative hidden sm:block"
              >
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="h-10 w-10 cursor-pointer rounded-full ring-2 ring-transparent transition-all hover:ring-green-500/50 focus:outline-none"
                  aria-expanded={dropdownOpen}
                  aria-label="User menu"
                >
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={user?.photoURL}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                </button>
                
                {/* Glassmorphism Dropdown */}
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 top-14 flex min-w-[200px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white/90 py-2 backdrop-blur-xl dark:border-gray-800 dark:bg-black/90"
                  >
                    <p className="px-5 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                      {user?.displayName}
                    </p>
                    <div className="h-px w-full bg-gray-100 dark:bg-gray-800" />
                    <Link
                      to="/dashboard"
                      className="px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-green-600 dark:text-gray-300 dark:hover:bg-gray-900/50 dark:hover:text-green-400"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={logOut}
                      className="px-5 py-3 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-gray-900/50 dark:hover:text-red-400"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="hidden rounded-full bg-green-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 sm:block"
              >
                Login
              </NavLink>
            )}
            
            <button
              onClick={() => setOpen(true)}
              className="ml-2 rounded-full p-2 text-2xl text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:hidden"
              aria-label="Open Menu"
            >
              <IoMenuOutline />
            </button>
          </section>

          {/* Mobile Fullscreen Menu */}
          <section
            className={`fixed inset-0 z-[100] block h-[100dvh] w-full overflow-y-auto bg-white/95 backdrop-blur-3xl transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] dark:bg-black/95 sm:hidden ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-8 opacity-0"}`}
          >
            <div className="flex min-h-full flex-col p-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-gray-100 p-3 text-2xl text-gray-900 transition-colors dark:bg-gray-900 dark:text-white"
                  aria-label="Close Menu"
                >
                  <IoCloseOutline />
                </button>
              </div>
              
              <div className="mt-12 flex flex-1 flex-col items-center gap-6 text-center text-2xl font-semibold">
                <NavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) => `transition-colors ${isActive ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-300"}`}>Home</NavLink>
                <NavLink to="/blogs" onClick={() => setOpen(false)} className={({ isActive }) => `transition-colors ${isActive ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-300"}`}>Blogs</NavLink>
                <NavLink to="/about" onClick={() => setOpen(false)} className={({ isActive }) => `transition-colors ${isActive ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-300"}`}>About</NavLink>
                <NavLink to="/faq" onClick={() => setOpen(false)} className={({ isActive }) => `transition-colors ${isActive ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-300"}`}>FAQ</NavLink>
              </div>
              
              <div className="mt-auto mb-8 w-full">
                {user && user?.email ? (
                  <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                    <img className="mb-4 h-20 w-20 rounded-full object-cover ring-4 ring-green-50 dark:ring-green-900/20" src={user?.photoURL} alt="" referrerPolicy="no-referrer" />
                    <p className="mb-6 text-lg font-bold text-gray-900 dark:text-white">{user?.displayName}</p>
                    <div className="flex w-full flex-col gap-3">
                      <Link to="/dashboard" onClick={() => setOpen(false)} className="w-full rounded-2xl bg-gray-50 py-3 text-center font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800">Dashboard</Link>
                      <button onClick={() => { logOut(); setOpen(false); }} className="w-full rounded-2xl bg-red-50 py-3 text-center font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/30">Logout</button>
                    </div>
                  </div>
                ) : (
                  <NavLink to="/login" onClick={() => setOpen(false)} className="block w-full rounded-2xl bg-green-600 py-4 text-center text-lg font-bold text-white transition-colors hover:bg-green-700 dark:bg-green-500">Login</NavLink>
                )}
              </div>
            </div>
          </section>
        </div>
      </nav>
    </>
  );
}
