import { FaQuoteLeft } from "react-icons/fa";
import PropTypes from "prop-types";

const testimonials = [
  {
    id: 1,
    name: "Raisul Kayes",
    role: "Content Creator",
    feedback: "This platform helped me launch my blog successfully! The community support is amazing.",
  },
  {
    id: 2,
    name: "Saiful Hasan",
    role: "Avid Reader",
    feedback: "A great place to discover new and innovative blogs. Highly recommend!",
  },
  {
    id: 3,
    name: "Sajid Islam",
    role: "Tech Enthusiast",
    feedback: "Upvoting and reviewing blogs has never been easier. Love this website!",
  },
  {
    id: 4,
    name: "Shazidul Haque",
    role: "Software Engineer",
    feedback: "Okkhor has fundamentally changed how I consume tech blogs. The interface is stunning and reading is a breeze.",
  },
  {
    id: 5,
    name: "Rifat Shahriar",
    role: "Freelance Writer",
    feedback: "Writing on this platform feels so natural. The editor is clean, and the community is highly engaging. Brilliant work!",
  },
  {
    id: 6,
    name: "Riazul Haque",
    role: "Product Designer",
    feedback: "I've discovered so many hidden gems through Okkhor. The curated content is always top-notch and relevant.",
  },
  {
    id: 7,
    name: "Saidul Islam",
    role: "Web Developer",
    feedback: "As a developer, I appreciate the attention to detail in the UI. It's fast, responsive, and a joy to use daily.",
  },
  {
    id: 8,
    name: "Mohammad Ujjal",
    role: "Community Manager",
    feedback: "The seamless integration of community features makes this more than just a blogging site. It's a true knowledge hub.",
  },
  {
    id: 9,
    name: "Nur Mohammad Sujon",
    role: "Night Owl Reader",
    feedback: "I love the new dark mode! Reading articles late at night has never been this comfortable. Highly recommended.",
  },
  {
    id: 10,
    name: "Ismail Hossain",
    role: "Blogger",
    feedback: "Publishing my thoughts used to be a hassle. Now, it takes just a few clicks. The user experience is simply unmatched.",
  },
  {
    id: 11,
    name: "Rakib Hasan",
    role: "Digital Marketer",
    feedback: "The best platform for creators to share their stories. The reach and engagement I've gotten here are phenomenal.",
  },
  {
    id: 12,
    name: "Nifat Chowdhury",
    role: "UI/UX Designer",
    feedback: "Clean, distraction-free reading. That's what I always wanted, and Okkhor delivered perfectly. 10/10.",
  },
  {
    id: 13,
    name: "Atiqul Islam",
    role: "Frontend Developer",
    feedback: "From the elegant typography to the smooth transitions, every aspect of Okkhor feels premium and well thought out.",
  }
];

const row1 = testimonials.slice(0, 7);
const row2 = testimonials.slice(7, 13);

const TestimonialCard = ({ testimonial }) => (
  <div className="flex w-[320px] flex-shrink-0 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-8 transition-all dark:border-gray-800 dark:bg-black sm:w-[400px] whitespace-normal">
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 text-lg font-bold text-green-700 dark:from-green-900/40 dark:to-emerald-900/40 dark:text-green-400">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            {testimonial.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {testimonial.role}
          </p>
        </div>
        <FaQuoteLeft className="ml-auto shrink-0 text-4xl text-gray-100 dark:text-gray-800/50" />
      </div>
      <p className="text-gray-700 leading-relaxed dark:text-gray-300">
        &quot;{testimonial.feedback}&quot;
      </p>
    </div>
  </div>
);

TestimonialCard.propTypes = {
  testimonial: PropTypes.object.isRequired,
};

export default function Testimonials() {
  return (
    <section className="mx-auto my-20 w-11/12 max-w-screen-xl overflow-hidden">
      <h2 className="mb-12 text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300 sm:text-4xl">
        Testimonials
      </h2>

      <div className="relative flex flex-col gap-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        
        {/* Row 1 - Scrolls Left */}
        <div className="flex w-max animate-scroll-left gap-6 hover:[animation-play-state:paused] px-3">
          {[...row1, ...row1].map((testimonial, idx) => (
            <TestimonialCard key={`r1-${idx}`} testimonial={testimonial} />
          ))}
        </div>

        {/* Row 2 - Scrolls Right */}
        <div className="flex w-max animate-scroll-right gap-6 hover:[animation-play-state:paused] px-3">
          {[...row2, ...row2].map((testimonial, idx) => (
            <TestimonialCard key={`r2-${idx}`} testimonial={testimonial} />
          ))}
        </div>

      </div>
    </section>
  );
}
