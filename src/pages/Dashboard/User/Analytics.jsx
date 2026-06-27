import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Analytics() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/blogs/analytics/${user?.email}`);
      return res?.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Format status data for recharts
  const statusData = analytics?.statusCounts
    ? Object.keys(analytics.statusCounts).map((status) => ({
        name: status,
        count: analytics.statusCounts[status],
      }))
    : [];

  return (
    <>
      <Helmet>
        <title>Analytics | Okkhor</title>
      </Helmet>
      <section className="container mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Author Analytics</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">View your blog performance and statistics.</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-black">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Blogs</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{analytics?.totalBlogs || 0}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-black">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Upvotes</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{analytics?.totalUpvotes || 0}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-black">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Downvotes</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{analytics?.totalDownvotes || 0}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-black">
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Blogs by Status</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" tick={{fill: '#6B7280'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#6B7280'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{fill: '#f3f4f6'}}
                />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </>
  );
}
