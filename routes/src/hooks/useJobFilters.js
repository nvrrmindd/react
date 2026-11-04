import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { initialFilters } from '../constants'

export default function useJobFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') ?? initialFilters.search,
      level: searchParams.get('level') ?? initialFilters.level,
      aiRisk: searchParams.get('aiRisk') ?? initialFilters.aiRisk,
      remoteOnly: searchParams.get('remoteOnly') === 'true',
      sort: searchParams.get('sort') ?? initialFilters.sort,
      page: Number(searchParams.get('page')) || initialFilters.page,
    }),
    [searchParams]
  )

  const updateFilters = useCallback(
    (changes) => {
      const next = { ...filters, page: 1, ...changes }
      const params = {}
      for (const key in next) {
        if (next[key] !== initialFilters[key]) params[key] = String(next[key])
      }
      setSearchParams(params)
    },
    [filters, setSearchParams]
  )

  function resetFilters() {
    setSearchParams({})
  }

  return { filters, updateFilters, resetFilters }
}
