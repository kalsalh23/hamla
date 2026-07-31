import { useDonations } from '../context/DonationsContext'
import { config } from '../lib/config'

const formatMoney = (value) =>
  new Intl.NumberFormat('ar-SY', { maximumFractionDigits: 0 }).format(Math.round(Number(value || 0)))

const MEDAL_RANK = ['gold', 'silver', 'bronze']

export default function TopDonors() {
  const { donations } = useDonations()

  const top = [...donations]
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 10)

  if (top.length === 0) {
    return (
      <section className="panel top-panel">
        <header className="panel-header top-header">
          <span className="trophy-icon" aria-hidden="true" />
          <h2>أعلى {10} متبرعين</h2>
        </header>
        <p className="empty-hint">لا توجد تبرعات بعد، كن أول الداعمين.</p>
      </section>
    )
  }

  return (
    <section className="panel top-panel">
      <header className="panel-header top-header">
        <span className="trophy-icon" aria-hidden="true" />
        <h2>أعلى {10} متبرعين</h2>
      </header>
      <ol className="top-list">
        {top.map((donor, i) => (
          <li key={donor.id} className={`top-row rank-${i + 1}`}>
            <span className={`rank-badge ${MEDAL_RANK[i] || ''}`}>{i + 1}</span>
            <div className="top-info">
              <span className="top-name">{donor.name}</span>
              {donor.note && <span className="top-note">{donor.note}</span>}
            </div>
            <span className="top-amount">
              {formatMoney(donor.amount)} <small>{config.currency}</small>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
