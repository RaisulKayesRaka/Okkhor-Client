import Banner from "../components/Banner";
import FeaturedBlogs from "../components/FeaturedBlogs";
import TrendingBlogs from "../components/TrendingBlogs";
import RecentBlogs from "../components/RecentBlogs";
import Newsletter from "../components/Newsletter";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Banner />
      <FeaturedBlogs />
      <TrendingBlogs />
      <RecentBlogs />
      <Testimonials />
      <Newsletter />
    </>
  );
}
