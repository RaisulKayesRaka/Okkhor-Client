import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useDBUser from "../../../hooks/useDBUser";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import DashboardPageHeader from "../../../components/Dashboard/DashboardPageHeader";
import DashboardCard from "../../../components/Dashboard/DashboardCard";
import { BsBookmarkX, BsEye } from "react-icons/bs";

export default function SavedBlogs() {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();
  const { dbUser } = useDBUser();
  const { data: savedBlogs = [], refetch } = useQuery({
    queryKey: ["savedBlogs", dbUser?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/saved-blogs?userId=${dbUser?._id}`);
      return res?.data;
    },
    enabled: !loading && !!dbUser?._id,
  });
  const handleUnsave = async (id) => {
    try {
      const res = await axiosSecure.delete(
        `/saved-blogs/${id}?userId=${dbUser?._id}`,
      );
      if (res.data.deletedCount > 0) {
        toast.success("Removed from saved blogs");
        refetch();
      }
    } catch (error) {
      toast.error("Failed to remove blog");
      console.error(error);
    }
  };
  return (
    <>
      {" "}
      <Helmet>
        {" "}
        <title>Saved Blogs | Okkhor</title>{" "}
      </Helmet>{" "}
      <section className="w-full">
        {" "}
        <DashboardPageHeader
          title="Saved Blogs"
          subtitle="Your personal reading list."
        />{" "}
        {savedBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200/50 bg-gray-50 py-20 dark:border-gray-800 dark:bg-gray-800/50">
            {" "}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {" "}
              No saved blogs{" "}
            </h2>{" "}
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {" "}
              You haven&apos;t bookmarked any blogs yet.{" "}
            </p>{" "}
            <Link
              to="/blogs"
              className="mt-6 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 dark:bg-green-500 dark:text-white dark:hover:bg-green-600"
            >
              {" "}
              Explore Blogs{" "}
            </Link>{" "}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {" "}
            {savedBlogs.map((blog) => (
              <DashboardCard key={blog._id} className="flex flex-col">
                {" "}
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {" "}
                  <img
                    src={blog.blogImage}
                    alt={blog.blogName}
                    className="h-full w-full object-cover duration-300"
                  />{" "}
                  <button
                    onClick={() => handleUnsave(blog._id)}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-red-500 backdrop-blur transition hover:bg-red-50 hover:text-red-600 dark:bg-black/70 dark:hover:bg-red-900/50"
                    title="Remove from saved"
                    aria-label="Remove from saved"
                  >
                    {" "}
                    <BsBookmarkX size={18} />{" "}
                  </button>{" "}
                </div>{" "}
                <div className="flex flex-1 flex-col p-5">
                  {" "}
                  <div className="mb-2 flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    {" "}
                    <span className="rounded bg-gray-100 px-2 py-1 font-medium dark:bg-gray-800">
                      {" "}
                      {blog.type}{" "}
                    </span>{" "}
                    <span className="flex items-center gap-1">
                      {" "}
                      <BsEye size={14} /> {blog.views || 0}{" "}
                    </span>{" "}
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>{" "}
                  </div>{" "}
                  <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 dark:text-white">
                    {" "}
                    <Link to={`/blogs/${blog._id}`} className="hover:underline">
                      {" "}
                      {blog.blogName}{" "}
                    </Link>{" "}
                  </h3>{" "}
                  <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-600 dark:text-gray-400">
                    {" "}
                    {blog.blogDescription}{" "}
                  </p>{" "}
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="mt-auto inline-flex w-full items-center justify-center rounded-full border border-gray-200/50 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                  >
                    {" "}
                    Read Blog{" "}
                  </Link>{" "}
                </div>{" "}
              </DashboardCard>
            ))}{" "}
          </div>
        )}{" "}
      </section>{" "}
    </>
  );
}
