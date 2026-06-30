import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { Helmet } from "react-helmet-async";
import BlogCard from "../components/BlogCard";
import Loading from "../components/Loading";

export default function PublicProfile() {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: author, isLoading: isAuthorLoading } = useQuery({
    queryKey: ["publicProfile", id, user?.email],
    queryFn: async () => {
      const url = user?.email 
        ? `/users/public/${id}?viewerEmail=${user.email}`
        : `/users/public/${id}`;
      const { data } = await axiosPublic.get(url);
      return data;
    },
  });

  const { mutate: toggleFollow, isPending: isFollowPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axiosSecure.post(`/users/follow/${id}`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["publicProfile", id] });
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to toggle follow");
    }
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const { data: blogs = [], isLoading: isBlogsLoading, refetch } = useQuery({
    queryKey: ["authorBlogs", id, search, sort],
    queryFn: async () => {
      // 0 means start page, size 100 to get a bunch without complex pagination for now
      const { data } = await axiosPublic.get(`/accepted-blogs?ownerId=${id}&page=0&size=100&search=${search}&sort=${sort}`);
      return data;
    },
  });

  if (isAuthorLoading || isBlogsLoading) {
    return <Loading />;
  }

  if (!author) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">User not found</h2>
        <p className="mt-2 text-gray-500">The profile you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{author.name} | Okkhor Profile</title>
      </Helmet>
      
      <main className="mx-auto my-12 min-h-screen w-11/12 max-w-screen-xl">
        {/* Profile Header */}
        <div className="mb-12 flex flex-col items-center justify-center rounded-2xl bg-gray-50 py-12 text-center dark:bg-gray-900/50">
          <img
            className="mb-4 h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg dark:border-gray-800"
            src={author.photoUrl || "https://placehold.co/400"}
            alt={author.name}
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{author.name}</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Joined {new Date(author.createdAt).toLocaleDateString()}
          </p>

          {/* Follow Button */}
          {user && user.email !== author.email && (
            <button
              onClick={() => toggleFollow()}
              disabled={isFollowPending}
              className={`mt-4 rounded-full px-6 py-2 text-sm font-semibold transition ${
                author.isFollowing 
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              }`}
            >
              {isFollowPending ? "..." : author.isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-black dark:text-white">{author.followersCount || 0}</span>
              <span className="text-gray-500 dark:text-gray-400">Followers</span>
            </div>
            <div className="hidden h-10 w-px bg-gray-300 dark:bg-gray-700 sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-black dark:text-white">{blogs.length}</span>
              <span className="text-gray-500 dark:text-gray-400">Published Blogs</span>
            </div>
            <div className="hidden h-10 w-px bg-gray-300 dark:bg-gray-700 sm:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-black dark:text-white">
                {blogs.reduce((acc, curr) => acc + (curr.views || 0), 0)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">Total Views</span>
            </div>
          </div>
        </div>

        {/* Author's Blogs */}
        <div>
          <div className="mb-6 flex flex-col items-center justify-between gap-4 border-b border-gray-100 pb-4 dark:border-gray-800 sm:flex-row">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Blogs by {author.name}
            </h2>
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <input
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                name="search"
                placeholder="Search blogs..."
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white sm:w-64"
              />
              <select
                onChange={(e) => setSort(e.target.value)}
                name="sort"
                id="sort"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white sm:w-auto"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Popular</option>
              </select>
            </div>
          </div>
          {blogs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No blogs published yet.</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Check back later for new content from {author.name}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} refetch={refetch} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
