import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useRouteError } from "react-router-dom";
export default function ErrorPage() {
  const error = useRouteError();
  const is404 = error?.status === 404;
  return (
    <>
      {" "}
      <Helmet>
        {" "}
        <title>{is404 ? "404 - Page Not Found" : "Error | Okkhor"}</title>{" "}
      </Helmet>{" "}
      <section className="mx-auto flex h-screen w-11/12 max-w-screen-xl flex-col items-center justify-center px-4">
        {" "}
        {is404 ? (
          <Link to="/">
            <img
              className="w-40 sm:w-48 md:w-56"
              src="./page-not-found.svg"
              alt="Page Not Found"
            />
          </Link>
        ) : (
          <div className="mb-6 text-6xl text-red-500">⚠️</div>
        )}{" "}
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {" "}
          {is404 ? "Page Not Found" : "Oops! Something went wrong."}{" "}
        </h1>{" "}
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          {" "}
          {is404
            ? "The page you're looking for doesn't exist, has been moved, or is temporarily unavailable."
            : error?.message ||
              error?.statusText ||
              "An unexpected error has occurred."}{" "}
        </p>{" "}
        <Link
          to="/"
          className="mt-8 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 dark:bg-green-500 dark:text-white dark:hover:bg-green-600"
        >
          {" "}
          Back to Home{" "}
        </Link>{" "}
      </section>{" "}
    </>
  );
}
