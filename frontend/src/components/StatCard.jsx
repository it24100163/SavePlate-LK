export default function StatCard({ icon, value, label, accent }) {
  return (
    <article className={`stat-card ${accent}`}>
      <span className="stat-icon" aria-hidden="true">{icon}</span>
      <div><strong>{value}</strong><span>{label}</span></div>
    </article>
  );
}
