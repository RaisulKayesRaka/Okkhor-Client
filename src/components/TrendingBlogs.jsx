import BlogCard from "./BlogCard";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";
export default function TrendingBlogs() {
  const axiosPublic = useAxiosPublic();
  const {
    data: trendingBlogs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["trendingBlogs"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/trending-blogs");
      return data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (trendingBlogs.length === 0) {
    return null;
  }
  return (
    <section className="mx-auto my-20 w-11/12 max-w-screen-xl">
      {" "}
      <h2 className="mb-12 text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300 sm:text-4xl">
        Trending Blogs
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {" "}
        {trendingBlogs?.map((blog) => (
          <BlogCard key={blog._id} blog={blog} refetch={refetch} />
        ))}{" "}
      </div>{" "}
    </section>
  );
}
