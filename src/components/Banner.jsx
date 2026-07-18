import { Link } from "react-router-dom";
import { IoArrowForwardOutline, IoCreateOutline, IoHeartOutline, IoChatbubbleOutline } from "react-icons/io5";

export default function Banner() {
  return (
    <section className="relative mx-auto my-8 w-11/12 max-w-screen-xl overflow-hidden rounded-[2.5rem] bg-gray-50 dark:bg-black border border-gray-200/50 dark:border-gray-800">
      
      {/* Advanced Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#16a34a1a_1px,transparent_1px),linear-gradient(to_bottom,#16a34a1a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Ambient Glows */}
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-green-500/20 mix-blend-multiply blur-3xl filter dark:bg-green-600/20 dark:mix-blend-screen opacity-70"></div>
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-emerald-500/20 mix-blend-multiply blur-3xl filter dark:bg-emerald-600/20 dark:mix-blend-screen opacity-70"></div>
      
      <div className="relative z-10 grid gap-12 px-6 py-16 md:px-12 md:py-20 lg:grid-cols-2 lg:gap-8 lg:py-24">
        
        {/* Left Content */}
        <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-[4rem] lg:leading-[1.1]">
            Discover and Share <br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
              Amazing Stories
            </span>
          </h1>
          
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-400 md:text-xl">
            Explore diverse perspectives, insightful blogs, and creative ideas
            from writers around the world. Join our community to share your own
            journey on any topic.
          </p>
          
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
            <Link
              to="/blogs"
              className="group flex items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/30 active:scale-95 dark:bg-green-500 dark:hover:bg-green-600"
            >
              Start Reading
              <IoArrowForwardOutline className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="group flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white/50 backdrop-blur-sm px-8 py-3.5 text-base font-semibold text-gray-900 transition-all hover:bg-white active:scale-95 dark:border-gray-700 dark:bg-black/50 dark:text-white dark:hover:bg-gray-900"
            >
              <IoCreateOutline className="text-xl" />
              Write a Blog
            </Link>
          </div>
        </div>

        {/* Right Content - Abstract Floating Cards (Hidden on mobile for better fit) */}
        <div className="hidden lg:relative lg:flex lg:items-center lg:justify-center">
          
          {/* Card 1 */}
          <div className="absolute right-4 top-4 z-20 w-72 -rotate-6 rounded-2xl border border-white/40 bg-white/60 p-5 shadow-2xl backdrop-blur-lg transition-transform duration-500 hover:-rotate-3 hover:scale-105 dark:border-gray-700/50 dark:bg-gray-900/60">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600"></div>
              <div>
                <div className="h-3 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="mt-2 h-2 w-16 rounded-full bg-gray-100 dark:bg-gray-800"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-3 w-4/5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="mt-5 flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-1.5 text-xs font-medium"><IoHeartOutline className="text-sm" /> 124</span>
              <span className="flex items-center gap-1.5 text-xs font-medium"><IoChatbubbleOutline className="text-sm" /> 18</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="absolute left-0 top-32 z-30 w-72 rotate-3 rounded-2xl border border-white/40 bg-white/80 p-5 shadow-xl backdrop-blur-xl transition-transform duration-500 hover:rotate-6 hover:scale-105 dark:border-gray-700/50 dark:bg-gray-800/80">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600"></div>
              <div>
                <div className="h-3 w-28 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="mt-2 h-2 w-20 rounded-full bg-gray-100 dark:bg-gray-800"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-3 w-5/6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-3 w-2/3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="mt-5 flex items-center justify-between">
               <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold tracking-wide text-green-600 dark:bg-green-900/40 dark:text-green-400 uppercase">Technology</span>
               <div className="flex items-center gap-3 text-gray-400">
                 <span className="flex items-center gap-1.5 text-xs font-medium"><IoHeartOutline className="text-sm text-red-500" /> 89</span>
               </div>
            </div>
          </div>
          
          {/* Decorative Circle */}
          <div className="absolute left-1/2 top-1/2 z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-500/20 bg-green-500/5 dark:border-green-500/10 dark:bg-green-500/5"></div>
        </div>
      </div>
    </section>
  );
}
