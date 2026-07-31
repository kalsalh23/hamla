import { useDonations } from '../context/DonationsContext'
import { formatAmount } from '../lib/config'

export default function TopDonorCard() {
  const { donations } = useDonations()
  const top = donations.length
    ? [...donations].sort((a, b) => Number(b.amount) - Number(a.amount))[0]
    : null

  if (!top) {
    return (
      <section className="panel top-donor-card">
        <header className="panel-header">
          <span className="star-icon" aria-hidden="true" />
          <h2>أعلى متبرع</h2>
        </header>
        <p className="empty-hint">لا توجد تبرعات بعد، كن أول الداعمين.</p>
      </section>
    )
  }

  return (
    <section className="panel top-donor-card">
      <header className="panel-header">
        <span className="star-icon" aria-hidden="true" />
        <h2>أعلى متبرع</h2>
      </header>
      <div className="donor-card-body">
        <p className="donor-card-name">{top.name}</p>
        <p className="donor-card-amount">
          <span className="num">{formatAmount(top.amount, top.currency)}</span>
        </p>
        {top.note && <p className="donor-card-note">{top.note}</p>}
      </div>
    </section>
  )
}
