import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      onLogin(data.user)
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'بيانات الدخول غير صحيحة'
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <img src="/logo.svg" alt="شعار" className="login-logo" />
        <h1>لوحة التحكم</h1>
        <p className="login-sub">دخول مدير النظام · همة طيبة</p>

        <label className="field">
          <span>البريد الإلكتروني</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@hema.sy"
            required
            dir="ltr"
          />
        </label>

        <label className="field">
          <span>كلمة المرور</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            dir="ltr"
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'جارٍ الدخول…' : 'دخول'}
        </button>
      </form>
    </div>
  )
}
