import { useDonations } from '../context/DonationsContext'
import { CURRENCIES, formatNumber } from '../lib/config'

const ORDER = ['USD', 'SYP', 'SAR']

export default function TopDonorCard() {
  const { donations } = useDonations()

  const rows = ORDER.map((code) => {
    const list = donations.filter((d) => (d.currency || 'SYP') === code)
    if (!list.length) return null
    const top = [...list].sort((a, b) => Number(b.amount) - Number(a.amount))[0]
    return { code, label: CURRENCIES[code].label, symbol: CURRENCIES[code].symbol, ...top }
  }).filter(Boolean)

  if (rows.length === 0) {
    return (
      <section className="panel top-donor-card">
        <header className="panel-header">
          <span className="star-icon" aria-hidden="true" />
          <h2>أعلى المبالغ</h2>
        </header>
        <p className="empty-hint">لا توجد تبرعات بعد، كن أول الداعمين.</p>
      </section>
    )
  }

  return (
    <section className="panel top-donor-card">
      <header className="panel-header">
        <span className="star-icon" aria-hidden="true" />
        <h2>أعلى المبالغ</h2>
      </header>
      <div className="top-cur-list">
        {rows.map((row) => (
          <div key={row.code} className="top-cur-row">
            <span className="top-cur-badge">{row.symbol}</span>
            <div className="top-cur-info">
              <span className="top-cur-name">{row.name}</span>
              <span className="top-cur-label">{row.label}</span>
            </div>
            <span className="top-cur-amount">{formatNumber(row.amount)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
