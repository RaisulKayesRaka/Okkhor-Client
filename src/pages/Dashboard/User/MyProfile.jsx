import useAuth from "../../../hooks/useAuth";
import { Helmet } from "react-helmet-async";

export default function MyProfile() {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>My Profile | Okkhor</title>
      </Helmet>
      <section className="container mx-auto max-w-lg px-4 py-20">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white text-center shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
          <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"></div>
          <div className="relative -mt-16 px-6 pb-8">
            <div className="mx-auto inline-block rounded-full border-4 border-white p-1 dark:border-gray-900">
              <img
                className="h-32 w-32 rounded-full object-cover"
                src={user?.photoURL}
                alt={user?.displayName}
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {user?.displayName}
            </h3>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                User
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
