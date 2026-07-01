import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
export default function MainLayout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname.includes("/login") ||
    location.pathname.includes("/register");
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <Helmet>
        <title>Okkhor</title>
      </Helmet>
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
