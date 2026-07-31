import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { DonationsProvider } from './context/DonationsContext'
import Display from './pages/Display'
import Admin from './pages/Admin'
import Login from './pages/Login'

export default function App() {
  const [session, setSession] = useState(null)
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setBooted(true)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  if (!booted) return null

  return (
    <DonationsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Display />} />
          <Route path="/admin" element={session ? <Admin user={session.user} onLogout={() => supabase.auth.signOut()} /> : <Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={session ? <Navigate to="/admin" replace /> : <Login onLogin={() => {}} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DonationsProvider>
  )
}
