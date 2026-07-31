import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isConfigured } from '../lib/supabase'

const DonationsContext = createContext(null)

const PAGE_SIZE = 1000
const EMPTY_TOTALS = { total_count: 0, syp: 0, usd: 0, sar: 0 }

export function DonationsProvider({ children }) {
  const [donations, setDonations] = useState([])
  const [totals, setTotals] = useState(EMPTY_TOTALS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDonations = useCallback(async () => {
    if (!isConfigured) {
      setLoading(false)
      setError('لم يتم إعداد متغيرات Supabase. أضف ملف .env وراجع README.')
      return
    }
    try {
      setError(null)
      const all = []
      let from = 0
      for (;;) {
        const { data, error } = await supabase
          .from('donations')
          .select('*')
          .order('created_at', { ascending: false })
          .range(from, from + PAGE_SIZE - 1)
        if (error) throw error
        all.push(...(data || []))
        if (!data || data.length < PAGE_SIZE) break
        from += PAGE_SIZE
      }
      setDonations(all)
    } catch (e) {
      setError(e.message)
      console.error('تعذّر تحميل التبرعات:', e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTotals = useCallback(async () => {
    if (!isConfigured) return
    try {
      const { data, error } = await supabase.rpc('get_totals')
      if (error) throw error
      const row = Array.isArray(data) ? data[0] : data
      if (row) setTotals(row)
    } catch (e) {
      console.error('تعذّر جلب الإجماليات:', e.message)
    }
  }, [])

  useEffect(() => {
    fetchDonations()
    fetchTotals()
    if (!isConfigured) return

    const channel = supabase
      .channel('donations-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'donations' },
        (payload) => {
          setDonations((prev) => [payload.new, ...prev])
          fetchTotals()
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'donations' },
        (payload) => {
          setDonations((prev) => prev.filter((d) => d.id !== payload.old.id))
          fetchTotals()
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'donations' },
        (payload) => {
          setDonations((prev) =>
            prev.map((d) => (d.id === payload.new.id ? payload.new : d)),
          )
          fetchTotals()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchDonations, fetchTotals])

  return (
    <DonationsContext.Provider
      value={{
        donations,
        loading,
        error,
        totalSYP: totals.syp,
        totalUSD: totals.usd,
        totalSAR: totals.sar,
        totalCount: totals.total_count,
        refetch: fetchDonations,
      }}
    >
      {children}
    </DonationsContext.Provider>
  )
}

export function useDonations() {
  const ctx = useContext(DonationsContext)
  if (!ctx) throw new Error('useDonations يجب استخدامه داخل DonationsProvider')
  return ctx
}
