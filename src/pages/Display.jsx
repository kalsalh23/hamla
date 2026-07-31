import Header from '../components/Header'
import TotalAmount from '../components/TotalAmount'
import TopDonors from '../components/TopDonors'
import RecentDonors from '../components/RecentDonors'
import { useDonations } from '../context/DonationsContext'
import { config } from '../lib/config'

export default function Display() {
  const { loading, error } = useDonations()

  return (
    <div className="display-page">
      <Header />
      <main className="display-main">
        <TotalAmount />
        {loading ? (
          <p className="loading-hint">جارٍ تحميل التبرعات…</p>
        ) : error ? (
          <p className="loading-hint setup-hint">{error}</p>
        ) : (
          <div className="donors-grid">
            <TopDonors />
            <RecentDonors />
          </div>
        )}
      </main>
      <footer className="app-footer">
        <p>
          الحملة برعاية <strong>{config.campaignName}</strong> · سوريا ٢٠٢٦ بعد التحرير
        </p>
      </footer>
    </div>
  )
}
