// Reusable block for loading / error / empty states
export default function StatusMessage({ type, text, onRetry }) {
  return (
    <div className={`status ${type}`}>
      {type === 'loading' && <div className="spinner" />}
      <p>{text}</p>
      {onRetry && (
        <button className="btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
