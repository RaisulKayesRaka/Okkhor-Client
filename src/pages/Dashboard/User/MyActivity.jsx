import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import DashboardPageHeader from "../../../components/Dashboard/DashboardPageHeader";
import DashboardCard from "../../../components/Dashboard/DashboardCard";
import useAuth from "../../../hooks/useAuth";
export default function MyActivity() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["myActivity", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/logs/user/${user?.email}`);
      return res?.data;
    },
  });
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        {" "}
        <span className="loading loading-spinner loading-lg"></span>{" "}
      </div>
    );
  }
  return (
    <>
      {" "}
      <Helmet>
        {" "}
        <title>My Activity | Okkhor</title>{" "}
      </Helmet>{" "}
      <section className="w-full">
        {" "}
        <DashboardPageHeader
          title="My Activity"
          subtitle="A timeline of your recent interactions on Okkhor."
        />{" "}
        <DashboardCard>
          {" "}
          <div className="overflow-x-auto">
            {" "}
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
              {" "}
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-600 dark:bg-gray-900/50 dark:text-gray-400">
                {" "}
                <tr>
                  {" "}
                  <th className="px-6 py-4 font-semibold">Timestamp</th>{" "}
                  <th className="px-6 py-4 font-semibold">Action</th>{" "}
                  <th className="px-6 py-4 font-semibold">Details</th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-black">
                {" "}
                {logs.map((log) => (
                  <tr
                    key={log?._id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    {" "}
                    <td className="whitespace-nowrap px-6 py-4">
                      {" "}
                      {new Date(log.createdAt).toLocaleString()}{" "}
                    </td>{" "}
                    <td className="whitespace-nowrap px-6 py-4">
                      {" "}
                      <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        {" "}
                        {log.action}{" "}
                      </span>{" "}
                    </td>{" "}
                    <td className="px-6 py-4"> {log.details} </td>{" "}
                  </tr>
                ))}{" "}
                {logs.length === 0 && (
                  <tr>
                    {" "}
                    <td
                      colSpan="3"
                      className="px-6 py-8 text-center text-gray-600"
                    >
                      {" "}
                      No activity found yet. Start exploring and interacting
                      with blogs!{" "}
                    </td>{" "}
                  </tr>
                )}{" "}
              </tbody>{" "}
            </table>{" "}
          </div>{" "}
        </DashboardCard>{" "}
      </section>{" "}
    </>
  );
}
