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
        if (error.code === "auth/account-exists-with-different-credential") {
          setError("An account already exists with this email. Please sign in with your email and password.");
        } else {
          setError(error.message || error.code);
        }
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
        if (error.code === "auth/account-exists-with-different-credential") {
          setError("An account already exists with this email. Please sign in with your email and password.");
        } else {
          setError(error.message || error.code);
        }
      });
  };
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <>
      {" "}
      <Helmet>
        {" "}
        <title>Login | Okkhor</title>{" "}
      </Helmet>{" "}
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
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                id="email"
                className="w-full rounded-full border border-gray-200 bg-gray-50 px-6 py-3 text-sm transition focus:border-green-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-800 dark:bg-gray-950 dark:focus:border-green-500 dark:focus:ring-green-500"
                ref={emailRef}
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  state={{ email: emailRef.current?.value }}
                  className="text-xs font-semibold text-gray-500 transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
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
                  className="w-full rounded-full border border-gray-200 bg-gray-50 px-6 py-3 text-sm transition focus:border-green-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-800 dark:bg-gray-950 dark:focus:border-green-500 dark:focus:ring-green-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={toggleShowPassword}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/10 dark:text-red-400">
                <MdError className="shrink-0 text-base" /> <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-green-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            >
              Log In
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <hr className="flex-1 border-gray-200 dark:border-gray-800" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
              Or continue with
            </span>
            <hr className="flex-1 border-gray-200 dark:border-gray-800" />
          </div>

          <div className="mb-4 grid grid-cols-3 gap-3">
            <button
              onClick={() => {
                if (emailRef.current) emailRef.current.value = "raisulkayesofficial@gmail.com";
                const passwordInput = document.getElementById("password");
                if (passwordInput) passwordInput.value = "Password@123";
              }}
              type="button"
              className="rounded-full border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-transparent dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
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
              className="rounded-full border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-transparent dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
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
              className="rounded-full border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-transparent dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Demo Admin
            </button>
          </div>

          <button
            onClick={handleGoogleLogIn}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
          >
            <FaGoogle className="text-lg" /> Google
          </button>

          <div className="mt-8 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              Sign up
            </Link>
          </div>

        </div>
      </section>{" "}
    </>
  );
}
