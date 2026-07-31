import { useEffect, useState } from 'react'
import { useDonations } from '../context/DonationsContext'
import { supabase } from '../lib/supabase'
import { config } from '../lib/config'

const formatMoney = (value) =>
  new Intl.NumberFormat('ar-SY', { maximumFractionDigits: 0 }).format(Math.round(Number(value || 0)))

export default function Admin({ user, onLogout }) {
  const { donations, totalAmount, refetch } = useDonations()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [feedback])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const amt = Number(amount)
    if (!name.trim()) return setFeedback({ type: 'error', text: 'أدخل اسم المتبرّع' })
    if (!amt || amt <= 0) return setFeedback({ type: 'error', text: 'أدخل مبلغ تبرّع صحيح' })

    setSaving(true)
    setFeedback(null)
    try {
      const { error } = await supabase.from('donations').insert({
        name: name.trim(),
        amount: amt,
        note: note.trim(),
      })
      if (error) throw error
      setName('')
      setAmount('')
      setNote('')
      setFeedback({ type: 'success', text: 'تمت إضافة التبرّع ونشره على الشاشة مباشرةً' })
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('donations').delete().eq('id', id)
    if (error) {
      setFeedback({ type: 'error', text: error.message })
    } else {
      setFeedback({ type: 'success', text: 'تم حذف التبرّع' })
      refetch()
    }
    setConfirmDelete(null)
  }

  const ranked = [...donations]
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .map((d, i) => ({ ...d, rank: i + 1 }))

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">
          <img src="/logo.svg" alt="شعار" className="admin-logo" />
          <div>
            <h1>لوحة تحكم {config.campaignName}</h1>
            <p>مرحباً، {user?.email}</p>
          </div>
        </div>
        <button className="btn-ghost" onClick={onLogout}>تسجيل الخروج</button>
      </header>

      <main className="admin-main">
        <section className="admin-stats">
          <div className="stat-card">
            <span>الإجمالي</span>
            <strong>{formatMoney(totalAmount)} <small>{config.currency}</small></strong>
          </div>
          <div className="stat-card">
            <span>عدد التبرعات</span>
            <strong>{donations.length}</strong>
          </div>
          <div className="stat-card">
            <span>أعلى تبرّع</span>
            <strong>{formatMoney(ranked[0]?.amount || 0)} <small>{config.currency}</small></strong>
          </div>
        </section>

        <div className="admin-grid">
          <section className="form-card">
            <h2>إضافة تبرّع جديد</h2>
            {feedback && (
              <p className={`form-feedback ${feedback.type}`}>{feedback.text}</p>
            )}
            <form onSubmit={handleSubmit}>
              <label className="field">
                <span>اسم المتبرّع *</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أحمد"
                  required
                />
              </label>

              <label className="field">
                <span>مبلغ التبرّع ({config.currency}) *</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  required
                  dir="ltr"
                />
              </label>

              <label className="field">
                <span>ملاحظة</span>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="اختياري"
                />
              </label>

              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? 'جارٍ الحفظ…' : '+ إضافة التبرّع'}
              </button>
            </form>
          </section>

          <section className="form-card">
            <h2>آخر التبرعات</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الاسم</th>
                    <th>المبلغ</th>
                    <th>الملاحظة</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {ranked.slice(0, 20).map((d) => (
                    <tr key={d.id}>
                      <td className="rank">{d.rank}</td>
                      <td>{d.name}</td>
                      <td className="amount">{formatMoney(d.amount)}</td>
                      <td className="note-cell">{d.note || '—'}</td>
                      <td>
                        {confirmDelete === d.id ? (
                          <span className="confirm-group">
                            <button className="btn-danger" onClick={() => handleDelete(d.id)}>تأكيد</button>
                            <button className="btn-ghost-sm" onClick={() => setConfirmDelete(null)}>إلغاء</button>
                          </span>
                        ) : (
                          <button className="btn-ghost-sm danger" onClick={() => setConfirmDelete(d.id)}>حذف</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {ranked.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-hint">لا توجد تبرعات بعد</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
