import { MdDelete, MdEdit } from "react-icons/md";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

export default function MyBlogs() {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: blogs = [], refetch } = useQuery({
    queryKey: ["myBlogs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/all-blogs?email=${user?.email}`);
      return res?.data;
    },
    enabled: !loading && !!user?.email,
  });

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
        <div>Are you sure you want to delete?</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              deleteBlog();
              toast.dismiss(t.id);
            }}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold"
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Helmet>
        <title>My Blogs | Okkhor</title>
      </Helmet>
      <section className="container mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            My Blogs
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Manage your blog posts and track their status.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-20 dark:border-gray-700 dark:bg-gray-800/50">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              No blogs added yet
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Start writing your first blog post today.
            </p>
            <Link
              to="/dashboard/add-blog"
              className="mt-6 rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Write a Blog
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm dark:border-gray-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Blog Name</th>
                    <th className="px-6 py-4 font-semibold">Upvotes</th>
                    <th className="px-6 py-4 font-semibold">Downvotes</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-black">
                  {blogs.map((blog) => (
                    <tr
                      key={blog?._id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        <Link
                          to={`/blogs/${blog?._id}`}
                          className="hover:underline"
                        >
                          {blog?.blogName}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {blog?.upvotes}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {blog?.downvotes}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${blog?.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : blog?.status === "Accepted"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                        >
                          {blog?.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/update-blog/${blog?._id}`)
                            }
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                            title="Update"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(blog?._id)}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            title="Delete"
                          >
                            <MdDelete size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
