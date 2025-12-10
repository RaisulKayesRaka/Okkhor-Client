import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found</title>
      </Helmet>
      <section className="mx-auto flex h-screen w-11/12 max-w-screen-xl flex-col items-center justify-center px-4">
        <img
          onClick={() => navigate("/")}
          className="w-40 cursor-pointer transition-transform hover:scale-105 sm:w-48 md:w-56"
          src="./page-not-found.svg"
          alt="Page Not Found"
        />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist, has been moved, or
          is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="mt-8 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Back to Home
        </Link>
      </section>
    </>
  );
}
