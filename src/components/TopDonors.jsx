import { useDonations } from '../context/DonationsContext'
import { formatAmount, formatNumber, toSYP } from '../lib/config'

const MEDAL_RANK = ['gold', 'silver', 'bronze']

export default function TopDonors() {
  const { donations } = useDonations()

  const top = donations
    .map((d) => ({ ...d, syp: toSYP(d.amount, d.currency) }))
    .sort((a, b) => b.syp - a.syp)
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
            <div className="row-side">
              <span className="row-amount">{formatAmount(donor.amount, donor.currency)}</span>
              <span className="row-equivalent">≈ {formatNumber(donor.syp)} ل.س</span>
            </div>
          </li>
        ))}
        {top.length === 0 && <li className="empty-hint">لا توجد تبرعات بعد</li>}
      </ol>
    </section>
  )
}
