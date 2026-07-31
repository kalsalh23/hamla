export default function DonationCode() {
  return (
    <section className="panel donation-code-card">
      <header className="panel-header">
        <h2>باركود التبرع</h2>
      </header>
      <div className="donation-code-body">
        <img src="/qr-code.jpg" alt="باركود التبرع" className="donation-code-img" />
        <p className="donation-code-hint">امسح الباركود لإتمام التبرع</p>
      </div>
    </section>
  )
}
