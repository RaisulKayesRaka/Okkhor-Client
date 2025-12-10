import { useState } from "react";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing!");
      setEmail("");
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  return (
    <div className="mx-auto my-12 w-11/12 max-w-screen-xl">
      <div className="rounded-3xl bg-gray-50 px-6 py-12 text-center dark:bg-gray-900/50 md:px-16">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Stay Updated!
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-gray-400">
          Subscribe to our newsletter and never miss an update on the latest blogs.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex w-full max-w-md flex-col gap-4 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-black dark:text-white dark:focus:border-white dark:focus:ring-white"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 sm:w-auto"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
