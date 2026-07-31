export const config = {
  campaignName: import.meta.env.VITE_CAMPAIGN_NAME || 'همة طيبة',
  campaignSubtitle: import.meta.env.VITE_CAMPAIGN_SUBTITLE || 'حملة الدعم الجماعي 2026',
  currency: import.meta.env.VITE_CURRENCY || 'دولار أمريكي',
}

export const CURRENCIES = {
  SYP: { label: 'ليرة سورية', symbol: 'ل.س' },
  USD: { label: 'دولار أمريكي', symbol: '$' },
}

export const formatNumber = (value) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(Number(value || 0)))

export const formatAmount = (value, currency = 'USD') => {
  const c = CURRENCIES[currency] || CURRENCIES.USD
  return `${formatNumber(value)} ${c.symbol}`
}
