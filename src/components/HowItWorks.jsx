import { IoPersonOutline, IoDocumentTextOutline, IoChatbubblesOutline } from "react-icons/io5";

const steps = [
  {
    id: 1,
    title: "Create an Account",
    description: "Sign up easily and set up your profile to join our growing community of passionate creators.",
    icon: <IoPersonOutline />
  },
  {
    id: 2,
    title: "Read & Write Blogs",
    description: "Share your unique thoughts with the world, or discover brilliant new ideas from others.",
    icon: <IoDocumentTextOutline />
  },
  {
    id: 3,
    title: "Engage with Community",
    description: "Upvote, comment, and connect with like-minded individuals to build lasting relationships.",
    icon: <IoChatbubblesOutline />
  }
];

export default function HowItWorks() {
  return (
    <section className="mx-auto my-20 w-11/12 max-w-screen-xl">
      <h2 className="mb-16 text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300 sm:text-4xl">
        How It Works
      </h2>

      <div className="relative mx-auto max-w-5xl">
        {/* Connecting Line: Vertical on mobile, Horizontal on md+ */}
        <div className="absolute left-[27px] top-0 h-full w-[2px] bg-gray-200 dark:bg-gray-800 md:left-0 md:top-[45px] md:h-[2px] md:w-full" />

        <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="group relative flex w-full flex-col pl-20 md:w-1/3 md:items-center md:pl-0 md:text-center"
            >
              {/* Timeline Node / Icon */}
              <div className="absolute left-0 top-0 z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-gray-100 text-2xl text-gray-400 transition-all duration-500 group-hover:scale-110 group-hover:border-green-50 group-hover:bg-green-500 group-hover:text-white dark:border-black dark:bg-gray-900 dark:group-hover:border-green-900/50 md:relative md:mb-8 md:h-24 md:w-24 md:border-[6px] md:text-4xl">
                {step.icon}
              </div>

              {/* Step Number Badge */}
              <div className="mb-2 text-sm font-bold tracking-widest text-green-500 md:mt-2">
                STEP 0{index + 1}
              </div>

              {/* Text Content */}
              <h3 className="mb-3 text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
                {step.title}
              </h3>
              
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
