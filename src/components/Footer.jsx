import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTheme } from "../providers/ThemeProvider";

export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white pb-8 pt-16 dark:border-gray-800 dark:bg-black">
      <div className="mx-auto grid w-11/12 max-w-screen-xl grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
        
        {/* Logo and Description */}
        <div className="space-y-6 md:col-span-1">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/okkhor.svg" alt="Okkhor Logo" className="h-9 w-9" />
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Okkhor<span className="text-green-600 dark:text-green-500">.</span>
            </h2>
          </Link>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 pr-4">
            Your premium platform for sharing ideas, engaging stories, and deep knowledge on any topic imaginable.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="text-sm font-black tracking-widest text-gray-900 uppercase dark:text-white">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm font-medium text-gray-600 dark:text-gray-400">
            <li>
              <Link to="/" className="transition-colors hover:text-green-600 dark:hover:text-green-400">Home</Link>
            </li>
            <li>
              <Link to="/blogs" className="transition-colors hover:text-green-600 dark:hover:text-green-400">Blogs</Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-green-600 dark:hover:text-green-400">About</Link>
            </li>
            <li>
              <Link to="/faq" className="transition-colors hover:text-green-600 dark:hover:text-green-400">FAQ</Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h3 className="text-sm font-black tracking-widest text-gray-900 uppercase dark:text-white">
            Contact
          </h3>
          <ul className="space-y-3 text-sm font-medium text-gray-600 dark:text-gray-400">
            <li>
              <span className="block text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider mb-0.5">Email</span>
              <a href="mailto:support@okkhor.com" className="transition-colors hover:text-green-600 dark:hover:text-green-400">support@okkhor.com</a>
            </li>
            <li>
              <span className="block text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider mb-0.5">Phone</span>
              <a href="tel:+1234567890" className="transition-colors hover:text-green-600 dark:hover:text-green-400">+1 234 567 890</a>
            </li>
            <li>
              <span className="block text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wider mb-0.5">Address</span>
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="space-y-6">
          <h3 className="text-sm font-black tracking-widest text-gray-900 uppercase dark:text-white">
            Follow Us
          </h3>
          <div className="flex flex-wrap gap-3">
            <a href="https://facebook.com" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-green-600 hover:text-white dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-green-500 dark:hover:text-white" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-green-600 hover:text-white dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-green-500 dark:hover:text-white" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-green-600 hover:text-white dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-green-500 dark:hover:text-white" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="https://instagram.com" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-green-600 hover:text-white dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-green-500 dark:hover:text-white" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mx-auto mt-16 flex w-11/12 max-w-screen-xl flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 dark:border-gray-900 md:flex-row">
        <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-500">
          © {new Date().getFullYear()} Okkhor. All rights reserved. <br className="md:hidden" /> Created by{" "}
          <a
            href="https://github.com/RaisulKayesRaka"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            Raisul Kayes Raka
          </a>
          .
        </p>
        <div className="flex gap-6 text-sm font-medium text-gray-500 dark:text-gray-500">
          <Link to="/privacy" className="transition-colors hover:text-green-600 dark:hover:text-green-400">Privacy Policy</Link>
          <Link to="/terms" className="transition-colors hover:text-green-600 dark:hover:text-green-400">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
