import { BsEye, BsClock } from "react-icons/bs";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";

export default function BlogCard({ blog, refetch }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all dark:border-gray-800 dark:bg-black">
      
      {/* Image Section */}
      <Link to={`/blogs/${blog?._id}`} className="block relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={blog?.blogImage}
          alt={blog?.blogName}
        />
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        
        {/* Author Info */}
        <div className="mb-4 flex items-center justify-between">
          <Link to={`/author/${blog?.ownerId?._id}`} className="flex items-center gap-2 group/author">
            <img
              className="h-7 w-7 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
              src={blog?.ownerId?.photoUrl}
              alt={blog?.ownerId?.name}
            />
            <span className="text-sm font-medium text-gray-700 transition-colors group-hover/author:text-green-600 dark:text-gray-300 dark:group-hover/author:text-green-400">
              {blog?.ownerId?.name}
            </span>
          </Link>

        </div>

        {/* Title */}
        <Link to={`/blogs/${blog?._id}`} className="block">
          <h3 className="line-clamp-2 text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-green-600 dark:text-gray-100 dark:group-hover:text-green-400">
            {blog?.blogName}
          </h3>
        </Link>
        
        {/* Spacer to push footer to bottom */} 
        <div className="flex-1" />
        
        {/* Meta Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <BsClock size={14} />
              <span>
                {blog?.createdAt
                  ? formatDistanceToNow(new Date(blog.createdAt))
                  : ""}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <BsEye size={16} /> 
              <span>{blog?.views || 0} Views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
BlogCard.propTypes = {
  blog: PropTypes.object.isRequired,
  refetch: PropTypes.func,
};
