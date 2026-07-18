import PropTypes from "prop-types";
export default function DashboardPageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      {" "}
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300 pb-1">
        {" "}
        {title}{" "}
      </h1>{" "}
      {subtitle && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {" "}
          {subtitle}{" "}
        </p>
      )}{" "}
    </div>
  );
}
DashboardPageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};
