const styles = {
  Completed: 'bg-emerald-50 text-emerald-600',
  Pending: 'bg-amber-50 text-amber-600',
  Cancelled: 'bg-red-50 text-red-500',
};

const StatusBadge = ({ status }) => (
  <span className={`badge ${styles[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
);

export default StatusBadge;
