export default function About() {
  return (
    <section className="mx-auto my-12 w-11/12 max-w-screen-xl">
      {" "}
      <div className="mx-auto mb-16 max-w-3xl text-center">
        {" "}
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {" "}
          About Us{" "}
        </h1>{" "}
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {" "}
          Welcome to our platform, where creativity meets opportunity. We are a
          hub for discovering, sharing, and engaging with diverse stories and
          ideas. Whether you&apos;re a writer, thinker, or curious reader, this
          is the place for you.{" "}
        </p>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {" "}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 transition dark:border-gray-800 dark:bg-gray-900">
          {" "}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {" "}
            Our Mission{" "}
          </h2>{" "}
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {" "}
            Our mission is to empower creators by providing a platform to
            showcase their blogs, gain feedback, and reach a global
            audience.{" "}
          </p>{" "}
        </div>{" "}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 transition dark:border-gray-800 dark:bg-gray-900">
          {" "}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {" "}
            What We Offer{" "}
          </h2>{" "}
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {" "}
            From personal stories to professional insights, our platform allows
            users to explore fascinating content and engage with a passionate
            community.{" "}
          </p>{" "}
        </div>{" "}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 transition dark:border-gray-800 dark:bg-gray-900">
          {" "}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {" "}
            Join Us{" "}
          </h2>{" "}
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {" "}
            Be a part of our growing network. Connect with like-minded
            individuals, discover fresh perspectives, and help shape the future
            of content sharing.{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="mt-20 text-center">
        {" "}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {" "}
          Our Values{" "}
        </h2>{" "}
        <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
          {" "}
          We believe in transparency, creativity, and collaboration. Our
          community thrives on inclusivity and the shared goal of supporting
          original voices.{" "}
        </p>{" "}
      </div>{" "}
    </section>
  );
}
