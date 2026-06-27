import {
  BsCaretDown,
  BsCaretDownFill,
  BsCaretUp,
  BsCaretUpFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

export default function BlogCard({ blog, refetch }) {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isUpvoted = false, refetch: refetchIsUpvoted } = useQuery({
    enabled: !loading && !!blog?._id,
    queryKey: ["isUpvoted", blog?._id, user?.email],
    queryFn: async () => {
      if (!user?.email) return false;
      const { data } = await axiosSecure.get(
        `/blogs/is-upvoted/${blog?._id}?email=${user?.email}`
      );
      return data;
    },
  });

  const { data: isDownvoted = false, refetch: refetchIsDownvoted } = useQuery({
    enabled: !loading && !!blog?._id,
    queryKey: ["isDownvoted", blog?._id, user?.email],
    queryFn: async () => {
      if (!user?.email) return false;
      const { data } = await axiosSecure.get(
        `/blogs/is-downvoted/${blog?._id}?email=${user?.email}`
      );
      return data;
    },
  });

  const handleUpvote = async (e) => {
    e.stopPropagation(); // Prevent card click
    isDownvoted && handleDownvote(e);
    const res = await axiosSecure.put(
      `/blogs/upvote/${blog?._id}?email=${user?.email}`
    );
    if (res.data.modifiedCount > 0) {
      refetchIsUpvoted();
      refetch();
    }
  };

  const handleDownvote = async (e) => {
    e.stopPropagation(); // Prevent card click
    isUpvoted && handleUpvote(e);
    const res = await axiosSecure.put(
      `/blogs/downvote/${blog?._id}?email=${user?.email}`
    );
    if (res.data.modifiedCount > 0) {
      refetchIsDownvoted();
      refetch();
    }
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
      <Link to={`/blogs/${blog?._id}`} className="block overflow-hidden">
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={blog?.blogImage}
            alt={blog?.blogName}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {blog?.blogTags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              #{typeof tag === 'object' ? (tag?.text || tag?.id) : tag}
            </span>
          ))}
        </div>

        <Link to={`/blogs/${blog?._id}`} className="group-hover:underline">
          <h3 className="mb-2 line-clamp-2 text-xl font-bold leading-tight text-gray-900 dark:text-gray-100">
            {blog?.blogName}
          </h3>
        </Link>

        {/* Spacer to push footer to bottom */}
        <div className="flex-1" />

        <div className="mt-4 flex items-center justify-between border-t pt-4 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <p title={blog?.ownerId?.name}>
              <img
                className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800"
                src={blog?.ownerId?.photoUrl}
                alt={blog?.ownerId?.name}
              />
            </p>
            <span className="font-medium text-gray-700 dark:text-gray-300">{blog?.ownerId?.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={user?.email === blog?.ownerId?.email || !user}
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${isUpvoted
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
            >
              {isUpvoted ? <BsCaretUpFill size={18} /> : <BsCaretUp size={18} />}
              <span>{blog?.upvotes}</span>
            </button>

            <button
              disabled={user?.email === blog?.ownerId?.email || !user}
              onClick={handleDownvote}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${isDownvoted
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
            >
              {isDownvoted ? (
                <BsCaretDownFill size={18} />
              ) : (
                <BsCaretDown size={18} />
              )}
              <span>{blog?.downvotes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  blog: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};
