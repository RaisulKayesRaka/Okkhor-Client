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
      <Helmet>
        <title>Register | Okkhor</title>
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
              Create Account
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Join our community of writers and readers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-white"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                id="name"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:focus:border-white dark:focus:ring-white"
                required
              />
            </div>



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
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  id="password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:focus:border-white dark:focus:ring-white"
                  required
                />
                {showPassword ? (
                  <FaRegEyeSlash
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={toggleShowPassword}
                  />
                ) : (
                  <FaRegEye
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={toggleShowPassword}
                  />
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
              className="mt-2 w-full rounded-xl bg-black py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 focus:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Create Account
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
            <span className="text-xs font-medium text-gray-500 uppercase">
              Or continue with
            </span>
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          </div>

          <button
            onClick={handleGoogleLogIn}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 focus:scale-[0.98] dark:border-gray-700 dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
          >
            <FaGoogle /> Google
          </button>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-black underline underline-offset-2 dark:text-white"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
