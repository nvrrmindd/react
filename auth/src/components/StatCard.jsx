export default function StatCard({ label, value, children }) {
  return (
    <div className="stat">
      <p className="muted small">{label}</p>
      <p className="stat-value">{value}</p>
      {children}
    </div>
  )
}
