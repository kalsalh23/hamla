import { useDonations } from '../context/DonationsContext'
import { formatNumber } from '../lib/config'

export default function TotalAmount() {
  const { totalSYP, totalUSD, totalSAR, totalCount } = useDonations()

  return (
    <section className="panel total-card">
      <div className="total-ornament" aria-hidden="true" />
      <p className="total-label">إجمالي التبرعات حتى الآن</p>

      <p className="total-amount-row">
        <span className="total-number">{formatNumber(totalSYP)}</span>
        <span className="total-currency">ليرة سورية</span>
      </p>
      <p className="total-amount-row">
        <span className="total-number">{formatNumber(totalUSD)}</span>
        <span className="total-currency">دولار أمريكي</span>
      </p>
      <p className="total-amount-row">
        <span className="total-number">{formatNumber(totalSAR)}</span>
        <span className="total-currency">ريال سعودي</span>
      </p>

      <p className="total-count">
        {formatNumber(totalCount)} <span>تبرّع</span>
      </p>
    </section>
  )
}
