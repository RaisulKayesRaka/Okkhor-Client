export default function Banner() {
  return (
    <section className="mx-auto my-8 w-11/12 max-w-screen-xl">
      <div className="flex flex-col items-center justify-center gap-6 rounded-3xl bg-gray-50 px-6 py-24 text-center dark:bg-gray-900/50 md:px-12 md:py-32">
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Discover and Share Amazing Stories
        </h1>
        <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400 md:text-xl">
          Explore diverse perspectives, insightful blogs, and creative ideas
          from writers around the world. Join our community to share your own
          journey on any topic.
        </p>
      </div>
    </section>
  );
}
