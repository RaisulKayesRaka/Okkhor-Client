import PropTypes from "prop-types";

export default function DashboardCard({ children, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {children}
    </div>
  );
}

DashboardCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
