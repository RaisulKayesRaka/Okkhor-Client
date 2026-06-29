import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaGoogle, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { MdError } from "react-icons/md";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useTheme } from "../../providers/ThemeProvider";

export default function Login() {
  const { setUser, userLogin, googleLogIn, resetPassword } = useAuth();
  const axiosPublic = useAxiosPublic();
  const { theme } = useTheme();
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const emailRef = useRef();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    userLogin(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        toast.success("Login Successful");
        navigate(location?.state ? location.state : "/");
      })
      .catch((error) => {
        setError(error.code);
      });
  };

  const handleGoogleLogIn = () => {
    googleLogIn()
      .then((result) => {
        const user = result.user;
        setUser(user);
        axiosPublic
          .post("/users", {
            email: user?.email,
            name: user?.displayName,
            photoUrl: user?.photoURL,
          })
          .then((response) => {
            if (response?.data?.insertedId) {
              toast.success("Login successful!");
            }
          });
        navigate(location?.state ? location.state : "/");
      })
      .catch((error) => {
        setError(error.code);
      });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Helmet>
        <title>Login | Okkhor</title>
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
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please enter your details to sign in.
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
                placeholder="Enter your email"
                id="email"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:focus:border-white dark:focus:ring-white"
                ref={emailRef}
                required
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  state={{ email: emailRef.current?.value }}
                  className="text-xs font-semibold text-black underline underline-offset-2 transition hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  id="password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:focus:border-white dark:focus:ring-white"
                  required
                />
                {showPassword ? (
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={toggleShowPassword}
                    aria-label="Toggle password visibility"
                  >
                    <FaRegEyeSlash />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={toggleShowPassword}
                    aria-label="Toggle password visibility"
                  >
                    <FaRegEye />
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400">
                <MdError className="shrink-0 text-base" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-black py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 focus:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Log In
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
            <span className="text-xs font-medium text-gray-500 uppercase">
              Or continue with
            </span>
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                if (emailRef.current) emailRef.current.value = "raisulkayesofficial@gmail.com";
                const passwordInput = document.getElementById("password");
                if (passwordInput) passwordInput.value = "Password@123";
              }}
              type="button"
              className="rounded-xl border border-gray-200 bg-white py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 focus:scale-[0.98] dark:border-gray-700 dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
            >
              Demo User
            </button>
            <button
              onClick={() => {
                if (emailRef.current) emailRef.current.value = "moderator@okkhor.com";
                const passwordInput = document.getElementById("password");
                if (passwordInput) passwordInput.value = "Password@123";
              }}
              type="button"
              className="rounded-xl border border-gray-200 bg-white py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 focus:scale-[0.98] dark:border-gray-700 dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
            >
              Demo Mod
            </button>
            <button
              onClick={() => {
                if (emailRef.current) emailRef.current.value = "admin@okkhor.com";
                const passwordInput = document.getElementById("password");
                if (passwordInput) passwordInput.value = "Password@123";
              }}
              type="button"
              className="rounded-xl border border-gray-200 bg-white py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 focus:scale-[0.98] dark:border-gray-700 dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
            >
              Demo Admin
            </button>
          </div>

          <button
            onClick={handleGoogleLogIn}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 focus:scale-[0.98] dark:border-gray-700 dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
          >
            <FaGoogle /> Google
          </button>

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-black underline underline-offset-2 dark:text-white"
            >
              Sign up
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
