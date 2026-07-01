import PropTypes from "prop-types";
export default function DashboardPageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      {" "}
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
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
