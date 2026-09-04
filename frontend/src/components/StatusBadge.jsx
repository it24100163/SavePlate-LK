export default function StatusBadge({ status, expired = false }) {
  if (expired) return <span className="status-badge expired">PICKUP TIME PASSED</span>;
  return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
}
