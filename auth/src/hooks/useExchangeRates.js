import { useEffect, useState } from 'react'
import { getExchangeRates } from '../services/service'

export default function useExchangeRates() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    getExchangeRates()
      .then((result) => {
        if (!ignore) setData(result)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
    return () => {
      ignore = true
    }
  }, [])

  return { data, error, loading: !data && !error }
}
