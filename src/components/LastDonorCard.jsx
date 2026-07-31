import { useDonations } from '../context/DonationsContext'
import { formatAmount } from '../lib/config'

const formatTime = (iso) => {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'الآن'
  if (mins < 60) return `قبل ${mins} د`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `قبل ${hours} س`
  return `قبل ${Math.floor(hours / 24)} ي`
}

export default function LastDonorCard() {
  const { donations } = useDonations()
  const last = donations[0] || null

  if (!last) {
    return (
      <section className="panel last-donor-card">
        <header className="panel-header">
          <span className="live-pulse" aria-hidden="true" />
          <h2>آخر متبرع</h2>
        </header>
        <p className="empty-hint">بانتظار أول تبرّع…</p>
      </section>
    )
  }

  return (
    <section className="panel last-donor-card">
      <header className="panel-header">
        <span className="live-pulse" aria-hidden="true" />
        <h2>آخر متبرع</h2>
      </header>
      <div className="donor-card-body">
        <p className="donor-card-name">{last.name}</p>
        <p className="donor-card-amount">
          <span className="num">{formatAmount(last.amount, last.currency)}</span>
        </p>
        {last.note && <p className="donor-card-note">{last.note}</p>}
        <p className="donor-card-time">{formatTime(last.created_at)}</p>
      </div>
    </section>
  )
}
