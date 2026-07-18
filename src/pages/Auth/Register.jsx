import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaGoogle, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { MdError } from "react-icons/md";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useTheme } from "../../providers/ThemeProvider";
export default function Register() {
  const { setUser, createNewUser, updateUserProfile, googleLogIn } = useAuth();
  const axiosPublic = useAxiosPublic();
  const { theme } = useTheme();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get("name");
    const photoUrl = "https://placehold.co/400";
    const email = form.get("email");
    const password = form.get("password");
    const regex = /^(?=.*[A-Z])(?=.*[a-z]).{6,}$/;
    if (!regex.test(password)) {
      setError(
        "Invalid password! Password must be at least 6 characters and include uppercase and lowercase letters.",
      );
      return;
    }
    createNewUser(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        updateUserProfile({ displayName: name, photoURL: photoUrl }).then(
          () => {
            axiosPublic
              .post("/users", { email, name, photoUrl })
              .then((response) => {
                if (response?.data?.insertedId) {
                  toast.success("Registration successful!");
                }
              });
            navigate(location?.state ? location.state : "/");
          },
        );
      })
      .catch((error) => {
        setError(error.code);
      });
  };
  const handleGoogleLogIn = () => {
    googleLogIn()
      .then((result) => {
        const user = result?.user;
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
      {" "}
      <Helmet>
        {" "}
        <title>Register | Okkhor</title>{" "}
      </Helmet>{" "}
      <section className="mx-auto flex min-h-[calc(100vh-80px)] w-11/12 max-w-screen-xl items-center justify-center py-12">
        <div className="w-full max-w-[450px] rounded-[2.5rem] border border-gray-200/50 bg-white p-8 dark:border-gray-800 dark:bg-gray-900 sm:p-12">
          
          <div className="mb-10 text-center">
            <Link to="/">
              <img
                className="mx-auto mb-6 h-12 w-auto cursor-pointer"
                src="/okkhor.svg"
                alt="Okkhor Logo"
              />
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Join our community of writers and readers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                id="name"
                className="w-full rounded-full border border-gray-200 bg-gray-50 px-6 py-3 text-sm transition focus:border-green-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-800 dark:bg-gray-950 dark:focus:border-green-500 dark:focus:ring-green-500"
                required
              />
            </div>

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
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
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
              Create Account
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <hr className="flex-1 border-gray-200 dark:border-gray-800" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
              Or continue with
            </span>
            <hr className="flex-1 border-gray-200 dark:border-gray-800" />
          </div>

          <button
            onClick={handleGoogleLogIn}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
          >
            <FaGoogle className="text-lg" /> Google
          </button>

          <div className="mt-8 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              Sign in
            </Link>
          </div>
          
        </div>
      </section>{" "}
    </>
  );
}
