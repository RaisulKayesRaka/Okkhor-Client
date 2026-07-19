export default function About() {
  return (
    <section className="mx-auto my-16 w-11/12 max-w-screen-xl sm:my-24">
      <div className="mx-auto mb-20 max-w-3xl text-center">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300 sm:text-5xl">
          About Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Welcome to our platform, where creativity meets opportunity. We are a
          hub for discovering, sharing, and engaging with diverse stories and
          ideas. Whether you&apos;re a writer, thinker, or curious reader, this
          is the place for you.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200/50 bg-white p-10 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
            Our Mission
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            Our mission is to empower creators by providing a platform to
            showcase their blogs, gain feedback, and reach a global
            audience.
          </p>
        </div>
        
        <div className="rounded-3xl border border-gray-200/50 bg-white p-10 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
            What We Offer
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            From personal stories to professional insights, our platform allows
            users to explore fascinating content and engage with a passionate
            community.
          </p>
        </div>
        
        <div className="rounded-3xl border border-gray-200/50 bg-white p-10 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
            Join Us
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
            Be a part of our growing network. Connect with like-minded
            individuals, discover fresh perspectives, and help shape the future
            of content sharing.
          </p>
        </div>
      </div>
      
      <div className="mt-24 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
          Our Values
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          We believe in transparency, creativity, and collaboration. Our
          community thrives on inclusivity and the shared goal of supporting
          original voices.
        </p>
      </div>
    </section>
  );
}
