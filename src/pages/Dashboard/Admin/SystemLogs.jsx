import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

export default function SystemLogs() {
  const axiosSecure = useAxiosSecure();
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/logs`);
      return res?.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>System Logs | Okkhor</title>
      </Helmet>
      <section className="container mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">System Logs</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">View recent system activities and events.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Details</th>
                  <th className="px-6 py-4 font-semibold">Triggered By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-black">
                {logs.map((log) => (
                  <tr
                    key={log?._id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {log.details}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {log.triggeredBy}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
