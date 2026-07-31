import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isConfigured } from '../lib/supabase'

const DonationsContext = createContext(null)

export function DonationsProvider({ children }) {
  const [donations, setDonations] = useState([])
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
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDonations(data || [])
    } catch (e) {
      setError(e.message)
      console.error('تعذّر تحميل التبرعات:', e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDonations()
    if (!isConfigured) return

    const channel = supabase
      .channel('donations-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'donations' },
        (payload) => {
          setDonations((prev) => [payload.new, ...prev])
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'donations' },
        (payload) => {
          setDonations((prev) => prev.filter((d) => d.id !== payload.old.id))
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'donations' },
        (payload) => {
          setDonations((prev) =>
            prev.map((d) => (d.id === payload.new.id ? payload.new : d)),
          )
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchDonations])

  const totalAmount = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0)
  const totalSYP = donations
    .filter((d) => (d.currency || 'SYP') === 'SYP')
    .reduce((sum, d) => sum + Number(d.amount || 0), 0)
  const totalUSD = donations
    .filter((d) => d.currency === 'USD')
    .reduce((sum, d) => sum + Number(d.amount || 0), 0)
  const totalSAR = donations
    .filter((d) => d.currency === 'SAR')
    .reduce((sum, d) => sum + Number(d.amount || 0), 0)
  const totalCount = donations.length

  return (
    <DonationsContext.Provider
      value={{ donations, loading, error, totalAmount, totalSYP, totalUSD, totalSAR, totalCount, refetch: fetchDonations }}
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
