import { MdDelete, MdDoNotDisturb } from "react-icons/md";
import { FaRectangleList } from "react-icons/fa6";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import DashboardPageHeader from "../../../components/Dashboard/DashboardPageHeader";
import DashboardCard from "../../../components/Dashboard/DashboardCard";
export default function ReportedContents() {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { data: blogs = [], refetch } = useQuery({
    queryKey: ["reported-blogs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reported-blogs");
      return res?.data;
    },
  });
  const handleDismiss = async (id) => {
    try {
      const res = await axiosSecure.patch(`/blogs/dismiss-report/${id}`);
      if (res?.data?.modifiedCount > 0) {
        toast.success("Report dismissed successfully");
        refetch();
      }
    } catch (error) {
      toast.error("Failed to dismiss report");
      console.error(error);
    }
  };
  const handleDelete = (id) => {
    const deleteBlog = async () => {
      const res = await axiosSecure.delete(`/blogs/${id}`);
      if (res?.data?.deletedCount > 0) {
        toast.success("Blog deleted successfully");
        refetch();
      }
    };
    toast((t) => (
      <div className="flex flex-col items-center justify-center gap-4">
        {" "}
        <div>Are you sure you want to delete this blog?</div>{" "}
        <div className="flex items-center gap-4">
          {" "}
          <button
            onClick={() => {
              deleteBlog();
              toast.dismiss(t.id);
            }}
            className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold"
          >
            {" "}
            Yes{" "}
          </button>{" "}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold"
          >
            {" "}
            No{" "}
          </button>{" "}
        </div>{" "}
      </div>
    ));
  };
  return (
    <>
      {" "}
      <Helmet>
        {" "}
        <title>Reported Blogs | Okkhor</title>{" "}
      </Helmet>{" "}
      <section className="w-full">
        {" "}
        <DashboardPageHeader
          title="Reported Blogs"
          subtitle="Review and take action on reported content."
        />{" "}
        {blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-gray-200/50 bg-gray-50 py-20 dark:border-gray-800 dark:bg-gray-800/50">
            {" "}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {" "}
              No reported blogs{" "}
            </h2>{" "}
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {" "}
              Content is clean! No reports found.{" "}
            </p>{" "}
          </div>
        ) : (
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
                    <th className="px-6 py-4 font-semibold">Blog Name</th>{" "}
                    <th className="px-6 py-4 text-right font-semibold">
                      {" "}
                      Action{" "}
                    </th>{" "}
                  </tr>{" "}
                </thead>{" "}
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-black">
                  {" "}
                  {blogs.map((blog) => (
                    <tr
                      key={blog?._id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      {" "}
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {" "}
                        {blog?.blogName}{" "}
                      </td>{" "}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        {" "}
                        <div className="flex items-center justify-end gap-2">
                          {" "}
                          <button
                            onClick={() => navigate(`/blogs/${blog?._id}`)}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200/50 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            {" "}
                            View <FaRectangleList />{" "}
                          </button>{" "}
                          <button
                            onClick={() => handleDismiss(blog?._id)}
                            className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-xs font-medium text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                          >
                            {" "}
                            Dismiss <MdDoNotDisturb />{" "}
                          </button>{" "}
                          <button
                            onClick={() => handleDelete(blog?._id)}
                            className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                          >
                            {" "}
                            Delete <MdDelete />{" "}
                          </button>{" "}
                        </div>{" "}
                      </td>{" "}
                    </tr>
                  ))}{" "}
                </tbody>{" "}
              </table>{" "}
            </div>{" "}
          </DashboardCard>
        )}{" "}
      </section>{" "}
    </>
  );
}
