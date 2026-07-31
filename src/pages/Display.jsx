import Header from '../components/Header'
import TotalAmount from '../components/TotalAmount'
import TopDonorCard from '../components/TopDonorCard'
import TopDonors from '../components/TopDonors'
import LastDonorCard from '../components/LastDonorCard'
import RecentDonors from '../components/RecentDonors'
import QuranVerse from '../components/QuranVerse'
import { useDonations } from '../context/DonationsContext'
import { config } from '../lib/config'

export default function Display() {
  const { loading, error } = useDonations()

  return (
    <div className="display-page">
      <Header />
      <main className="display-main">
        {loading ? (
          <p className="loading-hint">جارٍ تحميل التبرعات…</p>
        ) : error ? (
          <p className="loading-hint setup-hint">{error}</p>
        ) : (
          <div className="display-grid">
            <div className="col col-right">
              <TopDonorCard />
              <TopDonors />
            </div>

            <div className="col col-center">
              <TotalAmount />
              <h2 className="campaign-name">{config.campaignName}</h2>
            </div>

            <div className="col col-left">
              <LastDonorCard />
              <RecentDonors />
            </div>
          </div>
        )}
        <QuranVerse />
      </main>
    </div>
  )
}
