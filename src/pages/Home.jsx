import Banner from "../components/Banner";
import FeaturedBlogs from "../components/FeaturedBlogs";
import TrendingBlogs from "../components/TrendingBlogs";
import RecentBlogs from "../components/RecentBlogs";
import Newsletter from "../components/Newsletter";
import Testimonials from "../components/Testimonials";
import HowItWorks from "../components/HowItWorks";

export default function Home() {
  return (
    <>
      {" "}
      <Banner /> <FeaturedBlogs /> <HowItWorks /> <TrendingBlogs /> <RecentBlogs />{" "}
      <Testimonials /> <Newsletter />{" "}
    </>
  );
}
