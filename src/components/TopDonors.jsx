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

  return (
    <section className="panel">
      <header className="panel-header">
        <h2>أعلى 10 متبرعين</h2>
      </header>
      <ol className="top-list">
        {top.map((donor, i) => (
          <li key={donor.id} className="top-row">
            <span className={`rank-badge ${MEDAL_RANK[i] || ''}`}>{i + 1}</span>
            <div className="row-info">
              <span className="row-name">{donor.name}</span>
              {donor.note && <span className="row-note">{donor.note}</span>}
            </div>
            <span className="row-amount">
              {formatMoney(donor.amount)} <small>{config.currency}</small>
            </span>
          </li>
        ))}
        {top.length === 0 && <li className="empty-hint">لا توجد تبرعات بعد</li>}
      </ol>
    </section>
  )
}
