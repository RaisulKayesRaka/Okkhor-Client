export default function FAQ() {
  const faqs = [
    {
      question: "What is this platform about?",
      answer:
        "This platform is a hub for discovering, sharing, and engaging with stories and ideas from various creators. Users can submit, upvote, and review blogs in various categories.",
    },
    {
      question: "How can I submit a blog?",
      answer:
        "To submit a blog, you need to create an account and navigate to the 'Add Blog' section in your dashboard. Provide the necessary details and submit your blog for review.",
    },
    {
      question: "What happens after I submit a blog?",
      answer:
        "Your blog will be reviewed by our moderators to ensure it meets our content guidelines. Once approved, it will be listed on the platform for users to discover and engage with.",
    },
    {
      question: "How many blogs can I submit?",
      answer: "You can submit as many blogs as you want.",
    },
    {
      question: "How long does it take for a blog to be approved?",
      answer: "Blog approval typically takes 1-2 business days.",
    },
  ];
  return (
    <div className="mx-auto my-16 w-11/12 max-w-screen-xl sm:my-24">
      <h1 className="mb-12 text-center text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300 sm:text-5xl">
        Frequently Asked Questions
      </h1>
      <div className="mx-auto max-w-4xl space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-[2rem] border border-gray-200/50 bg-white p-8 transition-colors dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {faq.question}
            </h2>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
