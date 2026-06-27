import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import BlogCard from "../../components/BlogCard";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

export default function Blogs() {
  const axiosSecure = useAxiosSecure();
  // const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchBlogsCount = async () => {
      const res = await axiosSecure.get(`/blogs-count?status=Accepted&search=${search}`);
      setCount(res?.data?.count);
    };
    fetchBlogsCount();
  }, [axiosSecure, search]);

  const {
    data: blogs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["blogs", currentPage, itemsPerPage, search, sort],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/accepted-blogs?page=${currentPage}&size=${itemsPerPage}&search=${search}&sort=${sort}`,
      );
      return data;
    },
  });

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(count / itemsPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  return (
    <>
      <Helmet>
        <title>Blogs | Okkhor</title>
      </Helmet>
      <section className="mx-auto w-11/12 max-w-screen-xl py-10">
        <div className="mb-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              All Blogs
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Explore our latest articles and updates.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <input
              onChange={handleSearch}
              type="text"
              name="search"
              placeholder="Search by tag..."
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white sm:w-64"
            />
            <select
              onChange={(e) => setSort(e.target.value)}
              name="sort"
              id="sort"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-white sm:w-auto"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog?._id} blog={blog} refetch={refetch} />
            ))}
          </div>
        )}

        <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-6 dark:border-gray-800">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <FaAngleLeft /> Previous
          </button>

          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Page {currentPage + 1} of {Math.ceil(count / itemsPerPage)}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(count / itemsPerPage) - 1}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Next <FaAngleRight />
          </button>
        </div>
      </section>
    </>
  );
}
