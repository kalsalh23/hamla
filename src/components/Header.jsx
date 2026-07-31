import { config } from '../lib/config'

export default function Header() {
  return (
    <header className="app-header">
      <div className="brand-text">
        <h1 className="brand-title">{config.campaignName}</h1>
        <p className="brand-subtitle">{config.campaignSubtitle}</p>
      </div>

      <div className="sponsor">
        <span className="sponsor-line" aria-hidden="true" />
        <img src="/sponsor-logo.jpg" alt="شعار الراعي الإعلامي" className="sponsor-logo" />
        <div className="sponsor-text">
          <span className="sponsor-label">الراعي الإعلامي</span>
          <span className="sponsor-name">طيبة الإمام الرسمية</span>
        </div>
        <span className="sponsor-line" aria-hidden="true" />
      </div>

      <img src="/logo.jpg" alt="شعار الحملة" className="brand-logo" />
    </header>
  )
}
