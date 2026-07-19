import { useState } from "react";
import { MdCancel, MdFeaturedVideo, MdClose } from "react-icons/md";
import { FaRectangleList } from "react-icons/fa6";
import { IoMdCheckmarkCircle } from "react-icons/io";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import DashboardPageHeader from "../../../components/Dashboard/DashboardPageHeader";
import DashboardCard from "../../../components/Dashboard/DashboardCard";

export default function BlogReviewQueue() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState(0);
  const size = 10;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [previewBlog, setPreviewBlog] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'accept' | 'reject' | 'feature' | 'unfeature', id: string, name: string }

  const { data = { blogs: [], totalCount: 0 }, isLoading } = useQuery({
    queryKey: ["queued-blogs", page, size, search, statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get(`/queued-blogs?page=${page}&size=${size}&search=${search}&status=${statusFilter}`);
      // Fallback for backend returning array instead of object if not updated yet
      if (Array.isArray(res?.data)) {
        return { blogs: res.data, totalCount: res.data.length };
      }
      return res?.data;
    },
  });

  const { blogs, totalCount } = data;
  const totalPages = Math.ceil(totalCount / size);

  const handleAction = async () => {
    if (!confirmAction) return;
    const { type, id } = confirmAction;
    let url = "";
    let successMsg = "";
    let newStatus = "";
    let newType = "";

    if (type === "accept") {
      url = `/blogs/make-accepted/${id}`;
      successMsg = "Blog accepted successfully";
      newStatus = "Accepted";
    } else if (type === "reject") {
      url = `/blogs/make-rejected/${id}`;
      successMsg = "Blog rejected successfully";
      newStatus = "Rejected";
      newType = "Normal";
    } else if (type === "feature") {
      url = `/blogs/make-featured/${id}`;
      successMsg = "Blog made featured successfully";
      newStatus = "Accepted";
      newType = "Featured";
    } else if (type === "unfeature") {
      url = `/blogs/remove-featured/${id}`;
      successMsg = "Blog removed from featured successfully";
      newType = "Normal";
    }

    // Optimistic Update
    queryClient.setQueryData(["queued-blogs", page, size, search, statusFilter], (old) => {
      if (!old || !old.blogs) return old;
      return {
        ...old,
        blogs: old.blogs.map((b) => {
          if (b._id === id) {
            return {
              ...b,
              ...(newStatus && { status: newStatus }),
              ...(newType && { type: newType }),
            };
          }
          return b;
        }),
      };
    });

    setConfirmAction(null);

    try {
      const res = await axiosSecure.patch(url);
      if (res?.data?.modifiedCount > 0) {
        toast.success(successMsg);
      }
    } catch (err) {
      toast.error("Failed to perform action");
      queryClient.invalidateQueries({ queryKey: ["queued-blogs"] });
    }
  };

  const getStatusBadge = (status, type) => {
    if (type === "Featured") {
      return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Featured</span>;
    }
    switch (status) {
      case "Accepted":
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">Accepted</span>;
      case "Rejected":
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">Rejected</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</span>;
    }
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

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row items-end">
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-sm outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500 sm:w-72"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
            <select
              className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-sm outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500 sm:w-auto"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200/50 bg-gray-50 py-20 dark:border-gray-800 dark:bg-gray-800/50">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              No blogs found
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <DashboardCard>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-600 dark:bg-gray-900/50 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Blog Info</th>
                    <th className="px-6 py-4 font-semibold">Author</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-black">
                  {blogs.map((blog) => (
                    <tr
                      key={blog?._id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        <div className="max-w-[200px] truncate" title={blog?.blogName}>
                          {blog?.blogName}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                           <img 
                             className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800"
                             src={
                               blog?.ownerId?.photoUrl ||
                               "https://ui-avatars.com/api/?name=" + blog?.ownerId?.name
                             } 
                             alt={blog?.ownerId?.name || "author"} 
                           />
                           <div>
                             <p className="font-semibold text-gray-900 dark:text-white">
                               {blog?.ownerId?.name || "Unknown"}
                             </p>
                             <p className="text-xs text-gray-600">
                               {blog?.ownerId?.email}
                             </p>
                           </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {new Date(blog?.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {getStatusBadge(blog?.status, blog?.type)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex rounded-full border border-gray-200/50 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
                            <button
                              onClick={() => setPreviewBlog(blog)}
                              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white"
                              title="View Details"
                            >
                              <FaRectangleList size={16} />
                            </button>
                            
                            {blog?.type === "Featured" ? (
                              <button
                                onClick={() => setConfirmAction({ type: "unfeature", id: blog._id, name: blog.blogName })}
                                className="rounded-full p-2 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30"
                                title="Remove from Featured"
                              >
                                <MdFeaturedVideo size={18} />
                              </button>
                            ) : (
                              <button
                                onClick={() => setConfirmAction({ type: "feature", id: blog._id, name: blog.blogName })}
                                className="rounded-full p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-30 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                disabled={blog?.status === "Rejected"}
                                title="Feature Blog"
                              >
                                <MdFeaturedVideo size={18} />
                              </button>
                            )}
                            
                            <button
                              onClick={() => setConfirmAction({ type: "accept", id: blog._id, name: blog.blogName })}
                              className="rounded-full p-2 text-green-600 hover:bg-green-50 hover:text-green-700 disabled:opacity-30 dark:text-green-400 dark:hover:bg-green-900/30"
                              disabled={blog?.status === "Accepted"}
                              title="Accept Blog"
                            >
                              <IoMdCheckmarkCircle size={18} />
                            </button>
                            
                            <button
                              onClick={() => setConfirmAction({ type: "reject", id: blog._id, name: blog.blogName })}
                              className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-30 dark:text-red-400 dark:hover:bg-red-900/30"
                              disabled={blog?.status === "Rejected"}
                              title="Reject Blog"
                            >
                              <MdCancel size={18} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-medium">{page * size + 1}</span> to{" "}
                  <span className="font-medium">{Math.min((page + 1) * size, totalCount)}</span> of{" "}
                  <span className="font-medium">{totalCount}</span> results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="rounded border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="rounded border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </DashboardCard>
        )}
      </section>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Confirm Action</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to {confirmAction.type} <strong>{confirmAction.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Yes, {confirmAction.type}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Preview Modal */}
      {previewBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white flex flex-col max-h-[85vh] shadow-2xl dark:bg-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">
                {previewBlog.blogName}
              </h3>
              <button
                onClick={() => setPreviewBlog(null)}
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                <MdClose size={24} />
              </button>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto p-6 flex-1 text-gray-800 dark:text-gray-200">
              {previewBlog.blogImage && (
                <img src={previewBlog.blogImage} alt="Thumbnail" className="w-full h-auto max-h-96 object-contain bg-gray-50 dark:bg-gray-800 rounded-xl mb-6" />
              )}
              
              <div className="flex flex-wrap gap-2 mb-6">
                 {previewBlog.blogTags?.map((tag, i) => (
                    <span key={i} className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {tag}
                    </span>
                 ))}
              </div>

              <div 
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: previewBlog.blogDescription || "No content available." }} 
              />
            </div>
            
            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-4 dark:border-gray-800">
               <button
                  onClick={() => { setConfirmAction({ type: "accept", id: previewBlog._id, name: previewBlog.blogName }); setPreviewBlog(null); }}
                  className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  disabled={previewBlog?.status === "Accepted"}
               >
                 Accept
               </button>
               <button
                  onClick={() => { setConfirmAction({ type: "reject", id: previewBlog._id, name: previewBlog.blogName }); setPreviewBlog(null); }}
                  className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  disabled={previewBlog?.status === "Rejected"}
               >
                 Reject
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
