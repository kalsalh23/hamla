import { useDonations } from '../context/DonationsContext'
import { config } from '../lib/config'

const formatMoney = (value) =>
  new Intl.NumberFormat('ar-SY', { maximumFractionDigits: 0 }).format(Math.round(Number(value || 0)))

export default function TotalAmount() {
  const { totalAmount, totalCount } = useDonations()

  return (
    <section className="panel total-card">
      <div className="total-ornament" aria-hidden="true" />
      <p className="total-label">إجمالي التبرعات حتى الآن</p>
      <p className="total-value">
        <span className="total-number">{formatMoney(totalAmount)}</span>
      </p>
      <p className="total-currency">{config.currency}</p>
      <p className="total-count">
        {formatMoney(totalCount)} <span>تبرّع</span>
      </p>
    </section>
  )
}
