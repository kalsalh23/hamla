import { config } from '../lib/config'

export default function Header() {
  return (
    <header className="app-header">
      <div className="brand">
        <img src="/logo.svg" alt="شعار همة طيبة" className="brand-logo" />
        <div className="brand-text">
          <h1 className="brand-title">{config.campaignName}</h1>
          <p className="brand-subtitle">{config.campaignSubtitle}</p>
        </div>
      </div>
      <div className="header-stripe" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </header>
  )
}
