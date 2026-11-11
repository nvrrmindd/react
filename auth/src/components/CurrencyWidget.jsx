import useExchangeRates from '../hooks/useExchangeRates'

const currencies = ['KZT', 'EUR', 'RUB', 'CNY']

export default function CurrencyWidget({ amount = 1 }) {
  const { data, error, loading } = useExchangeRates()

  return (
    <div className="widget">
      <h3>USD exchange rates</h3>
      {loading && <p className="muted">Loading rates…</p>}
      {error && <p className="error-text">{error}</p>}
      {data && (
        <>
          <ul className="rates">
            {currencies.map((code) => (
              <li key={code}>
                <span className="muted">
                  ${amount.toLocaleString()} =
                </span>{' '}
                <strong>
                  {Math.round(amount * data.rates[code]).toLocaleString()} {code}
                </strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
