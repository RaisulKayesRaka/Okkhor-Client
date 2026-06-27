import { MdCancel, MdFeaturedVideo } from "react-icons/md";
import { FaRectangleList } from "react-icons/fa6";
import { IoMdCheckmarkCircle } from "react-icons/io";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import DashboardPageHeader from "../../../components/Dashboard/DashboardPageHeader";
import DashboardCard from "../../../components/Dashboard/DashboardCard";

export default function BlogReviewQueue() {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { data: blogs = [], refetch } = useQuery({
    queryKey: ["queued-blogs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/queued-blogs");
      return res?.data;
    },
  });

  const handleMakeFeatured = (id) => {
    const makeFeatured = async () => {
      const res = await axiosSecure.patch(`/blogs/make-featured/${id}`);
      if (res?.data?.modifiedCount > 0) {
        toast.success("Blog made featured successfully");
        refetch();
      }
    };

    toast((t) => (
      <div className="flex flex-col items-center justify-center gap-4">
        <div>Are you sure you want to make this blog featured?</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              makeFeatured();
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

  const handleRemoveFeatured = (id) => {
    const removeFeatured = async () => {
      const res = await axiosSecure.patch(`/blogs/remove-featured/${id}`);
      if (res?.data?.modifiedCount > 0) {
        toast.success("Blog removed from featured successfully");
        refetch();
      }
    };

    toast((t) => (
      <div className="flex flex-col items-center justify-center gap-4">
        <div>Are you sure you want to remove this blog from featured?</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              removeFeatured();
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

  const handleMakeAccepted = (id) => {
    const makeAccepted = async () => {
      const res = await axiosSecure.patch(`/blogs/make-accepted/${id}`);
      if (res?.data?.modifiedCount > 0) {
        toast.success("Blog accepted successfully");
        refetch();
      }
    };

    toast((t) => (
      <div className="flex flex-col items-center justify-center gap-4">
        <div>Are you sure you want to accept this blog?</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              makeAccepted();
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

  const handleMakeRejected = (id) => {
    const makeRejected = async () => {
      const res = await axiosSecure.patch(`/blogs/make-rejected/${id}`);
      if (res?.data?.modifiedCount > 0) {
        toast.success("Blog rejected successfully");
        refetch();
      }
    };

    toast((t) => (
      <div className="flex flex-col items-center justify-center gap-4">
        <div>Are you sure you want to reject this blog?</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              makeRejected();
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
        <title>Blog Review Queue | Okkhor</title>
      </Helmet>
      <section className="w-full">
        <DashboardPageHeader 
          title="Blog Review Queue" 
          subtitle="Review pending blogs and manage content quality." 
        />

        {blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-20 dark:border-gray-700 dark:bg-gray-800/50">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              No blogs to review
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Great job! All blogs have been reviewed.
            </p>
          </div>
        ) : (
          <DashboardCard>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Blog Name</th>
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
                        {blog?.blogName}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/blogs/${blog?._id}`)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            View <FaRectangleList />
                          </button>
                          {blog?.type === "Featured" ? (
                            <button
                              onClick={() => handleRemoveFeatured(blog?._id)}
                              className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30"
                              title="Remove from Featured"
                            >
                              Unfeature <MdFeaturedVideo />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMakeFeatured(blog?._id)}
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                            >
                              Feature <MdFeaturedVideo />
                            </button>
                          )}
                          <button
                            onClick={() => handleMakeAccepted(blog?._id)}
                            className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                            disabled={blog?.status === "Accepted"}
                          >
                            Accept <IoMdCheckmarkCircle />
                          </button>
                          <button
                            onClick={() => handleMakeRejected(blog?._id)}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                            disabled={blog?.status === "Rejected"}
                          >
                            Reject <MdCancel />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        )}
      </section>
    </>
  );
}
