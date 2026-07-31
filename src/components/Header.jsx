import { config } from '../lib/config'

export default function Header() {
  return (
    <header className="app-header">
      <div className="brand-text">
        <h1 className="brand-title">{config.campaignName}</h1>
        <p className="brand-subtitle">{config.campaignSubtitle}</p>
      </div>
      <img src="/logo.jpg" alt="شعار الحملة" className="brand-logo" />
    </header>
  )
}
