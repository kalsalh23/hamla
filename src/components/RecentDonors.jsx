import { useEffect, useRef, useState } from 'react'
import { useDonations } from '../context/DonationsContext'
import { config } from '../lib/config'

const formatMoney = (value) =>
  new Intl.NumberFormat('ar-SY', { maximumFractionDigits: 0 }).format(Math.round(Number(value || 0)))

const formatTime = (iso) => {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'الآن'
  if (mins < 60) return `قبل ${mins} د`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `قبل ${hours} س`
  return `قبل ${Math.floor(hours / 24)} ي`
}

export default function RecentDonors() {
  const { donations } = useDonations()
  const [tick, setTick] = useState(0)
  const listRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = 0
  }, [donations.length, tick])

  const recent = donations.slice(0, 20)

  return (
    <section className="panel">
      <header className="panel-header">
        <h2>آخر 20 متبرع</h2>
        <span className="live-dot">مباشر</span>
      </header>
      <div className="recent-list-wrap" ref={listRef}>
        <ul className="recent-list">
          {recent.map((donor, i) => (
            <li key={donor.id} className="recent-row">
              <span className="recent-seq">{String(i + 1).padStart(2, '0')}</span>
              <div className="row-info">
                <span className="row-name">{donor.name}</span>
                {donor.note && <span className="row-note">{donor.note}</span>}
              </div>
              <div className="row-side">
                <span className="row-amount">
                  {formatMoney(donor.amount)} <small>{config.currency}</small>
                </span>
                <span className="row-time">{formatTime(donor.created_at)}</span>
              </div>
            </li>
          ))}
          {recent.length === 0 && <li className="empty-hint">بانتظار أول تبرّع…</li>}
        </ul>
      </div>
    </section>
  )
}
