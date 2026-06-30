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
    <section className="mx-auto my-12 w-11/12 max-w-screen-xl">
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Recent Blogs
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentBlogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} refetch={refetch} />
        ))}
      </div>
    </section>
  );
}
