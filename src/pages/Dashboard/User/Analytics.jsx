import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardPageHeader from "../../../components/Dashboard/DashboardPageHeader";
import DashboardCard from "../../../components/Dashboard/DashboardCard";

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
      <section className="w-full">
        <DashboardPageHeader
          title="Author Analytics"
          subtitle="View your blog performance and statistics."
        />
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard className="p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Blogs
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {analytics?.totalBlogs || 0}
            </p>
          </DashboardCard>
          <DashboardCard className="p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Upvotes
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {analytics?.totalUpvotes || 0}
            </p>
          </DashboardCard>
          <DashboardCard className="p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Downvotes
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {analytics?.totalDownvotes || 0}
            </p>
          </DashboardCard>
          <DashboardCard className="p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Views
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {analytics?.totalViews || 0}
            </p>
          </DashboardCard>
        </div>
        {/* Chart */}
        <DashboardCard className="p-6">
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Blogs by Status
          </h3>
          <div className="h-80 w-full">
            {statusData && statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#374151"
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "24px",
                      border: "1px solid rgba(229,231,235,0.5)",
                      boxShadow: "none",
                    }}
                    cursor={{ fill: "#f3f4f6" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#16a34a"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No chart data available</p>
              </div>
            )}
          </div>
        </DashboardCard>

        {/* Activity Timeline Chart */}
        <DashboardCard className="mt-8 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Blogs Published (Last 12 Months)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A timeline showing the number of blogs you've created each month.
            </p>
          </div>
          <div className="h-80 w-full">
            {analytics?.monthlyPublishData && analytics.monthlyPublishData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics.monthlyPublishData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#374151"
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "24px",
                      border: "1px solid rgba(229,231,235,0.5)",
                      boxShadow: "none",
                    }}
                    formatter={(value) => [value, "Blogs Published"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Blogs Published"
                    stroke="#16a34a"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    activeDot={{ r: 6, fill: "#16a34a", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No timeline data available</p>
              </div>
            )}
          </div>
        </DashboardCard>
      </section>
    </>
  );
}
