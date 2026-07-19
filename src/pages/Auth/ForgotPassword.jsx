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
      <section className="mx-auto flex min-h-[calc(100vh-80px)] w-11/12 max-w-screen-xl items-center justify-center py-12">
        <div className="w-full max-w-[450px] rounded-3xl border border-gray-200/50 bg-white p-8 dark:border-gray-800 dark:bg-gray-900 sm:p-12">
          <div className="mb-10 text-center">
            <Link to="/">
              <img
                className="mx-auto mb-6 h-12 w-auto cursor-pointer"
                src="/okkhor.svg"
                alt="Okkhor Logo"
              />
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                id="email"
                className="w-full rounded-full border border-gray-200 bg-gray-50 px-6 py-3 text-sm transition focus:border-green-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-800 dark:bg-gray-950 dark:focus:border-green-500 dark:focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-full bg-green-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-50 dark:bg-green-500 dark:text-white dark:hover:bg-green-600"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <div className="mt-8 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            Remembered your password?{" "}
            <Link 
              to="/login" 
              className="font-bold text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
