import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Raisul Kayes",
    feedback:
      "This platform helped me launch my blog successfully! The community support is amazing.",
  },
  {
    id: 2,
    name: "Saiful Hasan",
    feedback:
      "A great place to discover new and innovative blogs. Highly recommend!",
  },
  {
    id: 3,
    name: "Sajid Islam",
    feedback:
      "Upvoting and reviewing blogs has never been easier. Love this website!",
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto my-12 w-11/12 max-w-screen-xl">
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        What Our Users Say
      </h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <FaQuoteLeft className="text-3xl text-gray-300 dark:text-gray-700" />
            <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
              &quot;{testimonial.feedback}&quot;
            </p>
            <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
              {testimonial.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
