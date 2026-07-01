import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  BsCaretDown,
  BsCaretDownFill,
  BsCaretUp,
  BsCaretUpFill,
  BsBookmark,
  BsBookmarkFill,
  BsEye, BsBook,
  BsShare,
} from "react-icons/bs";
import { FaPen, FaReply } from "react-icons/fa";
import { GoReport } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editingReview, setEditingReview] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  useEffect(() => {
    if (id && !sessionStorage.getItem(`viewed_${id}`)) {
      sessionStorage.setItem(`viewed_${id}`, "true");
      axiosSecure.patch(`/blogs/view/${id}`).catch((err) => {
        sessionStorage.removeItem(`viewed_${id}`);
        console.error(err);
      });
    }
  }, [id, axiosSecure]);
  const {
    data: blog = {},
    refetch: refetchBlog,
    isLoading,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/blogs/${id}`);
      return data;
    },
  });
  const { data: isUpvoted = false, refetch: refetchIsUpvoted } = useQuery({
    enabled: !loading && !!blog?._id,
    queryKey: ["isUpvoted", blog?._id, user?.email],
    queryFn: async () => {
      if (!user?.email) return false;
      const { data } = await axiosSecure.get(
        `/blogs/is-upvoted/${blog?._id}?email=${user?.email}`,
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
        `/blogs/is-downvoted/${blog?._id}?email=${user?.email}`,
      );
      return data;
    },
  });
  const { data: isSaved = false, refetch: refetchIsSaved } = useQuery({
    enabled: !loading && !!blog?._id,
    queryKey: ["isSaved", blog?._id, user?.email],
    queryFn: async () => {
      if (!user?.email) return false;
      const { data } = await axiosSecure.get(
        `/saved-blogs/check/${blog?._id}?email=${user?.email}`,
      );
      return data?.isSaved;
    },
  });
  const {
    data: comments = [],
    isLoading: isLoadingComments,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/reviews/${id}`);
      return data;
    },
  });
  const buildCommentTree = (flatComments) => {
    const commentMap = {};
    const tree = [];
    flatComments.forEach((comment) => {
      commentMap[comment._id] = { ...comment, children: [] };
    });
    flatComments.forEach((comment) => {
      if (comment.parentId && commentMap[comment.parentId]) {
        commentMap[comment.parentId].children.push(commentMap[comment._id]);
      } else {
        tree.push(commentMap[comment._id]);
      }
    });
    return tree;
  };
  const commentTree = buildCommentTree(comments);
  const wordCount = blog?.blogDescription ? blog.blogDescription.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const handleAddComment = async (e) => {
    e.preventDefault();
    const form = e.target;
    const review = form.review.value;
    if (editingReview) {
      const { data } = await axiosSecure.patch(
        `/reviews/${editingReview._id}`,
        { review },
      );
      if (data?.modifiedCount > 0) {
        toast.success("Comment updated successfully");
        setEditingReview(null);
        form.reset();
        refetchComments();
      }
    } else {
      const newReview = {
        blogId: id,
        reviewerEmail: user?.email,
        reviewerName: user?.displayName,
        reviewerImage: user?.photoURL,
        review,
        parentId: replyingTo,
      };
      const { data } = await axiosSecure.post("/reviews", newReview);
      if (data?.insertedId) {
        toast.success(
          replyingTo
            ? "Reply added successfully"
            : "Comment added successfully",
        );
        form.reset();
        refetchComments();
      }
    }
    document.getElementById("add-review-modal").classList.add("hidden");
    setReplyingTo(null);
  };
  const handleDeleteComment = async (reviewId) => {
    toast((t) => (
      <div className="flex flex-col items-center justify-center gap-4">
        {" "}
        <div className="text-sm font-medium">Delete this comment?</div>{" "}
        <div className="flex items-center gap-3">
          {" "}
          <button
            onClick={async () => {
              const { data } = await axiosSecure.delete(`/reviews/${reviewId}`);
              if (data?.deletedCount > 0 || data?.modifiedCount > 0) {
                toast.success("Comment deleted");
                refetchComments();
              }
              toast.dismiss(t.id);
            }}
            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
          >
            {" "}
            Delete{" "}
          </button>{" "}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            {" "}
            Cancel{" "}
          </button>{" "}
        </div>{" "}
      </div>
    ));
  };
  const openEditModal = (review) => {
    setEditingReview(review);
    setReplyingTo(null);
    const modal = document.getElementById("add-review-modal");
    const textarea = document.getElementById("review");
    if (textarea) textarea.value = review.review;
    modal.classList.remove("hidden");
  };
  const openAddModal = (parentId = null) => {
    if (!user) {
      toast.error("Please login to comment");
      return navigate("/login");
    }
    setEditingReview(null);
    setReplyingTo(parentId);
    const textarea = document.getElementById("review");
    if (textarea) textarea.value = "";
    document.getElementById("add-review-modal").classList.remove("hidden");
  };
  const handleMakeReported = (id) => {
    if (!user) {
      toast.error("Please login to report blogs");
      return navigate("/login");
    }
    const makeReported = async () => {
      const res = await axiosSecure.patch(`/blogs/make-reported/${id}`);
      if (res?.data?.modifiedCount > 0) {
        toast.success("Blog reported successfully");
      }
    };
    toast((t) => (
      <div className="flex flex-col items-center justify-center gap-4">
        {" "}
        <div className="text-sm font-medium">Report this blog?</div>{" "}
        <div className="flex items-center gap-3">
          {" "}
          <button
            onClick={() => {
              makeReported();
              toast.dismiss(t.id);
            }}
            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
          >
            {" "}
            Yes, Report{" "}
          </button>{" "}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            {" "}
            Cancel{" "}
          </button>{" "}
        </div>{" "}
      </div>
    ));
  };
  const handleUpvote = async () => {
    if (!user) {
      toast.error("Please login to upvote");
      return navigate("/login");
    }
    const res = await axiosSecure.put(
      `/blogs/upvote/${blog?._id}?email=${user?.email}`,
    );
    if (res?.data?.success) {
      refetchIsUpvoted();
      refetchIsDownvoted();
      refetchBlog();
    }
  };
  const handleDownvote = async () => {
    if (!user) {
      toast.error("Please login to downvote");
      return navigate("/login");
    }
    const res = await axiosSecure.put(
      `/blogs/downvote/${blog?._id}?email=${user?.email}`,
    );
    if (res?.data?.success) {
      refetchIsUpvoted();
      refetchIsDownvoted();
      refetchBlog();
    }
  };
  const handleToggleSave = async () => {
    if (!user) {
      toast.error("Please login to save blogs");
      return navigate("/login");
    }
    if (isSaved) {
      const res = await axiosSecure.delete(
        `/saved-blogs/${blog?._id}?email=${user?.email}`,
      );
      if (res.data.deletedCount > 0) {
        toast.success("Blog removed from saved list");
        refetchIsSaved();
      }
    } else {
      const res = await axiosSecure.post("/saved-blogs", {
        userEmail: user?.email,
        blogId: blog?._id,
      });
      if (res.data.insertedId) {
        toast.success("Blog saved successfully");
        refetchIsSaved();
      }
    }
  };
  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: blog?.blogName || "Okkhor Blog",
      text: blog?.blogDescription?.slice(0, 100) + "...",
      url: url,
    };
    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
      if (err.name !== "AbortError") {
        navigator.clipboard
          .writeText(url)
          .then(() => {
            toast.success("Link copied to clipboard!");
          })
          .catch(console.error);
      }
    }
  };
  if (isLoading || isLoadingComments) {
    return <Loading />;
  }
  const CommentItem = ({ comment, isReply = false }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
      <div
        className={`relative ${isReply ? "ml-6 mt-4 border-l-2 border-gray-200 pl-4 dark:border-gray-800 sm:ml-10 sm:pl-6" : ""}`}
      >
        {" "}
        <div className="group relative rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          {" "}
          <div className="mb-4 flex items-center justify-between">
            {" "}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mr-2">{isCollapsed ? "[+]" : "[-]"}</button>
            <Link
              to={comment.isDeleted ? "#" : `/author/${comment?.reviewerId}`}
              className="flex items-center gap-3"
            >
              {" "}
              {!comment.isDeleted && comment?.reviewerImage ? (
                <img
                  src={comment?.reviewerImage}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-50 dark:ring-gray-800"
                  alt={comment?.reviewerName}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
              )}{" "}
              <div>
                {" "}
                <h4
                  className={`font-semibold ${comment.isDeleted ? "italic text-gray-500" : "text-gray-900 dark:text-white"}`}
                >
                  {" "}
                  {comment.isDeleted
                    ? "[Deleted User]"
                    : comment?.reviewerName}{" "}
                </h4>{" "}
                <p className="text-xs text-gray-600">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>{" "}
              </div>{" "}
            </Link>{" "}
            {!comment.isDeleted && (
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {" "}
                <button
                  onClick={() => openAddModal(comment._id)}
                  className="rounded-lg p-2 text-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  title="Reply"
                >
                  {" "}
                  <FaReply size={12} />{" "}
                </button>{" "}
                {user?.email === comment?.reviewerEmail && (
                  <>
                    {" "}
                    <button
                      onClick={() => openEditModal(comment)}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                      title="Edit"
                    >
                      {" "}
                      <FaPen size={12} />{" "}
                    </button>{" "}
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      title="Delete"
                    >
                      {" "}
                      <IoClose size={16} />{" "}
                    </button>{" "}
                  </>
                )}{" "}
              </div>
            )}{" "}
          </div>{" "}
          {!isCollapsed && <p
            className={`text-sm ${comment.isDeleted ? "italic text-gray-500" : "text-gray-700 dark:text-gray-300"}`}
          >
            {" "}
            {comment?.review}{" "}
          </p>}{" "}
        </div>{" "}
        {/* Recursively render children */}{" "}
        {!isCollapsed && comment.children && comment.children.length > 0 && (
          <div className="mt-2 space-y-2">
            {" "}
            {comment.children.map((child) => (
              <CommentItem key={child._id} comment={child} isReply={true} />
            ))}{" "}
          </div>
        )}{" "}
      </div>
    );
  };
  return (
    <>
      {" "}
      <Helmet>
        {" "}
        <title>{blog?.blogName} | Okkhor</title>{" "}
      </Helmet>{" "}
      <article className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {" "}
        {/* Header Section */}{" "}
        <header className="mb-8 text-center">
          {" "}
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {" "}
            {blog?.blogTags?.map((tag, index) => {
              const tagText = typeof tag === "object" ? tag?.text || tag?.id : tag;
              return (
              <Link
                key={index}
                to={`/blogs?search=${encodeURIComponent(tagText)}`}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
              >
                #{tagText}
              </Link>
              );
            })}{" "}
          </div>{" "}
          <h1 className="mb-6 text-3xl font-extrabold leading-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            {" "}
            {blog?.blogName}{" "}
          </h1>{" "}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            {" "}
            {blog?.ownerId && (
              <Link
                to={`/author/${blog?.ownerId?._id}`}
                className="flex items-center gap-2 hover:opacity-80"
              >
                {" "}
                {blog?.ownerId?.photoUrl && (
                  <img
                    src={blog.ownerId.photoUrl}
                    alt={blog.ownerId.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}{" "}
                <span className="font-medium text-gray-900 hover:underline dark:text-gray-200">
                  {blog.ownerId.name}
                </span>{" "}
              </Link>
            )}{" "}
            <span className="flex items-center gap-1">
              <BsEye size={16} /> {blog?.views || 0}
            </span>{" "}
            <span>{new Date(blog?.createdAt).toLocaleDateString()}</span>{" "}
            <span className="flex items-center gap-1"><BsBook size={16} /> {readingTime} min read</span>{" "}
          </div>{" "}
        </header>{" "}
        {/* Hero Image */}{" "}
        <div className="mb-10 overflow-hidden rounded-2xl">
          {" "}
          <img
            className="w-full object-cover"
            src={blog?.blogImage}
            alt={blog?.blogName}
          />{" "}
        </div>{" "}
        {/* Content */}{" "}
        <div className="prose prose-lg prose-gray dark:prose-invert mx-auto mb-12">
          {" "}
          <p className="whitespace-pre-wrap text-justify leading-relaxed text-gray-700 dark:text-gray-300">
            {" "}
            {blog?.blogDescription}{" "}
          </p>{" "}
        </div>{" "}
        {/* Action Bar */}{" "}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-y border-gray-200 py-4 dark:border-gray-800">
          {" "}
          <div className="flex flex-wrap items-center gap-2">
            {" "}
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${isUpvoted ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"}`}
            >
              {" "}
              {isUpvoted ? (
                <BsCaretUpFill size={18} />
              ) : (
                <BsCaretUp size={18} />
              )}{" "}
              <span>{blog?.upvotes}</span>{" "}
            </button>{" "}
            <div className="mx-1 hidden h-6 w-px bg-gray-200 dark:bg-gray-700 sm:block"></div>{" "}
            <button
              onClick={handleDownvote}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${isDownvoted ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"}`}
            >
              {" "}
              {isDownvoted ? (
                <BsCaretDownFill size={18} />
              ) : (
                <BsCaretDown size={18} />
              )}{" "}
              <span>{blog?.downvotes}</span>{" "}
            </button>{" "}
          </div>{" "}
          <div className="flex flex-wrap items-center gap-2">
            {" "}
            <button
              onClick={handleToggleSave}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${isSaved ? "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"}`}
            >
              {" "}
              {isSaved ? (
                <BsBookmarkFill size={16} />
              ) : (
                <BsBookmark size={16} />
              )}{" "}
              <span className="hidden sm:inline">
                {isSaved ? "Saved" : "Save"}
              </span>{" "}
            </button>{" "}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {" "}
              <BsShare size={16} />{" "}
              <span className="hidden sm:inline">Share</span>{" "}
            </button>{" "}
            <button
              onClick={() => handleMakeReported(blog?._id)}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              {" "}
              <GoReport size={18} />{" "}
              <span className="hidden sm:inline">Report</span>{" "}
            </button>{" "}
            <button
              onClick={() => openAddModal(null)}
              className="ml-2 flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {" "}
              <FaPen size={14} /> Write Comment{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {/* Comments Section */}{" "}
        <section>
          {" "}
          <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
            {" "}
            Comments{" "}
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {" "}
              {comments.length}{" "}
            </span>{" "}
          </h3>{" "}
          <div className="space-y-6">
            {" "}
            {commentTree.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-600 dark:border-gray-800">
                {" "}
                No comments yet. Be the first to share your thoughts!{" "}
              </div>
            ) : (
              commentTree.map((comment) => (
                <CommentItem key={comment._id} comment={comment} />
              ))
            )}{" "}
          </div>{" "}
        </section>{" "}
        {/* Comment Modal */}{" "}
        <div
          id="add-review-modal"
          className="fixed inset-0 z-50 hidden h-full w-full overflow-y-auto bg-black/60 backdrop-blur-sm transition-opacity"
        >
          {" "}
          <div className="flex min-h-full items-center justify-center p-4">
            {" "}
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 dark:bg-gray-950">
              {" "}
              <button
                onClick={() => {
                  document
                    .getElementById("add-review-modal")
                    .classList.add("hidden");
                  setReplyingTo(null);
                }}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {" "}
                <IoClose size={24} />{" "}
              </button>{" "}
              <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                {" "}
                {editingReview
                  ? "Update Comment"
                  : replyingTo
                    ? "Reply to Comment"
                    : "Write a Comment"}{" "}
              </h3>{" "}
              <form onSubmit={handleAddComment} className="space-y-6">
                {" "}
                <div>
                  {" "}
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {" "}
                    Your Comment{" "}
                  </label>{" "}
                  <textarea
                    id="review"
                    name="review"
                    rows="4"
                    placeholder="Share your thoughts about this blog..."
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:focus:border-white dark:focus:ring-white"
                    required
                  ></textarea>{" "}
                </div>{" "}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-black py-3 font-bold text-white hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black"
                >
                  {" "}
                  {editingReview
                    ? "Update Comment"
                    : replyingTo
                      ? "Post Reply"
                      : "Post Comment"}{" "}
                </button>{" "}
              </form>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </article>{" "}
    </>
  );
}
