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
    <section className="mx-auto my-20 w-11/12 max-w-screen-xl">
      <div className="relative overflow-hidden rounded-3xl border border-gray-200/50 bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-16 text-center dark:border-gray-800 dark:from-gray-900 dark:via-black dark:to-gray-900 sm:px-16 sm:py-24">
        
        {/* Decorative Background Elements */}
        <div className="absolute -left-10 -top-10 z-0 text-[20rem] font-black leading-none text-green-500/5 dark:text-gray-800/50">
          @
        </div>
        <div className="absolute -bottom-20 -right-20 z-0 h-96 w-96 rounded-full bg-green-500/10 blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Stay Updated!
          </h2>
          
          <p className="mb-10 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Join thousands of other readers and creators. Subscribe to our newsletter and never miss an update on the latest trends and stories.
          </p>

          {/* Combined Input & Button Pill */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex w-full max-w-lg flex-col items-center gap-3 sm:flex-row sm:gap-0 sm:rounded-full sm:border sm:border-gray-100 sm:bg-white sm:p-1.5 sm:transition-all sm:focus-within:ring-4 sm:focus-within:ring-green-500/20 sm:dark:border-gray-800 sm:dark:bg-black"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full flex-1 rounded-full border border-gray-100 bg-white px-6 py-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-4 focus:ring-green-500/20 dark:border-gray-800 dark:bg-black dark:text-white sm:w-auto sm:border-none sm:bg-transparent sm:px-6 sm:py-3 sm:focus:ring-0"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-green-600 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 sm:w-auto sm:py-3"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
