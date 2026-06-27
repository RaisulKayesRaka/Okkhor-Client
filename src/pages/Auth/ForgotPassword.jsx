import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useTheme } from "../../providers/ThemeProvider";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const axiosPublic = useAxiosPublic();
  
  // Pre-fill email if passed from login page
  const [email, setEmail] = useState(location?.state?.email || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Verify email exists in DB
      const res = await axiosPublic.get(`/users/check-email/${email}`);
      if (!res.data.exists) {
        toast.error("No account found with this email address.");
        setLoading(false);
        return;
      }
      
      // 2. Send reset email
      await resetPassword(email);
      toast.success("Password reset email sent! Please check your inbox.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | Okkhor</title>
      </Helmet>
      <section className="mx-auto flex min-h-[calc(100vh-80px)] w-11/12 max-w-screen-xl items-center justify-center py-10">
        <div className="w-full max-w-[450px] rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none sm:p-10">
          <div className="mb-8 text-center">
            {theme === "dark" ? (
              <img
                onClick={() => navigate("/")}
                className="mx-auto mb-4 h-12 w-auto cursor-pointer"
                src="/okkhor-white.png"
                alt="Okkhor Logo"
              />
            ) : (
              <img
                onClick={() => navigate("/")}
                className="mx-auto mb-4 h-12 w-auto cursor-pointer"
                src="/okkhor.png"
                alt="Okkhor Logo"
              />
            )}
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-white"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                id="email"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:focus:border-white dark:focus:ring-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-black py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50 focus:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-black underline underline-offset-2 dark:text-white"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
