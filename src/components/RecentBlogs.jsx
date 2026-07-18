import BlogCard from "./BlogCard";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";
export default function RecentBlogs() {
  const axiosPublic = useAxiosPublic();
  const {
    data: recentBlogs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["recentBlogs"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(
        "/accepted-blogs?page=0&size=6&search=&sort=newest",
      );
      return data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (recentBlogs.length === 0) {
    return null;
  }
  return (
    <section className="mx-auto my-20 w-11/12 max-w-screen-xl">
      {" "}
      <h2 className="mb-12 text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300 sm:text-4xl">
        Recent Blogs
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {" "}
        {recentBlogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} refetch={refetch} />
        ))}{" "}
      </div>{" "}
    </section>
  );
}
