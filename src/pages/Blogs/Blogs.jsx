import { FaSearch } from "react-icons/fa";
import BlogCard from "../../components/BlogCard";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useInView } from "react-intersection-observer";
export default function Blogs() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [feedType, setFeedType] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const itemsPerPage = 6;
  const { ref, inView } = useInView({ threshold: 0 });
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["blogs", itemsPerPage, search, sort, feedType, user?.email],
    queryFn: async ({ pageParam = 0 }) => {
      if (feedType === "following") {
        const { data } = await axiosSecure.get(
          `/blogs/following?page=${pageParam}&size=${itemsPerPage}&search=${search}&sort=${sort}`,
        );
        return data;
      } else {
        const { data } = await axiosPublic.get(
          `/accepted-blogs?page=${pageParam}&size=${itemsPerPage}&search=${search}&sort=${sort}`,
        );
        return data;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === itemsPerPage ? allPages.length : undefined;
    },
  });
  const blogs = data?.pages?.flat() || [];
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  return (
    <>
      {" "}
      <Helmet>
        {" "}
        <title>Blogs | Okkhor</title>{" "}
      </Helmet>{" "}
      <section className="mx-auto w-11/12 max-w-screen-xl py-10">
        {" "}
        <div className="mb-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          {" "}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300 sm:text-4xl">
              Discover
            </h1>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
              Explore our latest blogs and updates.
            </p>
            {user && (
              <div className="mt-6 flex gap-2 rounded-full border border-gray-200/50 bg-gray-100 p-1.5 dark:border-gray-800 dark:bg-gray-900/50 sm:w-fit">
                <button
                  onClick={() => setFeedType("all")}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                    feedType === "all"
                      ? "bg-white text-gray-900 border border-gray-200/50 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      : "text-gray-600 border border-transparent hover:bg-gray-200/50 dark:text-gray-400 dark:hover:bg-gray-800/50"
                  }`}
                >
                  All Blogs
                </button>
                <button
                  onClick={() => setFeedType("following")}
                  className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                    feedType === "following"
                      ? "bg-white text-gray-900 border border-gray-200/50 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      : "text-gray-600 border border-transparent hover:bg-gray-200/50 dark:text-gray-400 dark:hover:bg-gray-800/50"
                  }`}
                >
                  Following
                </button>
              </div>
            )}
          </div>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row items-end pb-1.5">
            <input
              onChange={handleSearch}
              type="text"
              name="search"
              placeholder="Search by title..."
              className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-sm outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500 sm:w-72"
            />
            <select
              onChange={(e) => setSort(e.target.value)}
              name="sort"
              id="sort"
              className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-sm outline-none transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-500 sm:w-auto"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Popular</option>
            </select>
          </div>
        </div>{" "}
        {isLoading ? (
          <Loading />
        ) : blogs.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-[2.5rem] border border-gray-200/50 bg-gray-50/50 p-12 text-center dark:border-gray-800 dark:bg-gray-800/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              No blogs found
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {feedType === "following"
                ? "You aren't following anyone yet, or they haven't published anything!"
                : "Try adjusting your search filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {" "}
            {blogs.map((blog) => (
              <BlogCard key={blog?._id} blog={blog} refetch={refetch} />
            ))}{" "}
          </div>
        )}{" "}
        {/* Intersection Observer target element for infinite scrolling */}{" "}
        <div ref={ref} className="mt-8 flex justify-center pb-8">
          {" "}
          {isFetchingNextPage && (
            <span className="loading loading-dots loading-md text-gray-600"></span>
          )}{" "}
        </div>{" "}
      </section>{" "}
    </>
  );
}
