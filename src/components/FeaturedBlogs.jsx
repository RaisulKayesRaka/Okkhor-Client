import BlogCard from "./BlogCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
/* import"./styles.css"; */ import {
  Autoplay,
  Mousewheel,
} from "swiper/modules";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";
export default function FeaturedBlogs() {
  const axiosPublic = useAxiosPublic();
  const {
    data: featuredBlogs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["featuredBlogs"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/featured-blogs");
      return data;
    },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (featuredBlogs.length === 0) {
    return null;
  }
  return (
    <section className="mx-auto my-20 w-11/12 max-w-screen-xl">
      {" "}
      <h2 className="mb-12 text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300 sm:text-4xl">
        Featured Blogs
      </h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        mousewheel={true}
        loop={true}
        autoplay={{
          delay: 2000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 16 },
          768: { slidesPerView: 2, spaceBetween: 16 },
          1024: { slidesPerView: 3, spaceBetween: 16 },
        }}
        modules={[Autoplay, Mousewheel]}
        className="mySwiper"
      >
        {" "}
        {featuredBlogs?.map((blog) => (
          <SwiperSlide key={blog._id}>
            {" "}
            <BlogCard blog={blog} refetch={refetch} />{" "}
          </SwiperSlide>
        ))}{" "}
      </Swiper>{" "}
    </section>
  );
}
