import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export default function AdminDashboard() {
  const auth = useAuth()
  const [clients, setClients] = useState([])
  const [pendingPayments, setPendingPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [paymentError, setPaymentError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured for admin data.')
      setLoading(false)
      return
    }

    let mounted = true
    const fetchData = async () => {
      setLoading(true)
      try {
        const [{ data: clientData, error: clientError }, { data: paymentData, error: paymentError }] = await Promise.all([
          supabase
            .from('clients')
            .select('id,name,email,portfolio_value,status,strategy,holdings,last_activity')
            .order('name', { ascending: true }),
          supabase
            .from('transactions')
            .select('id,account_id,amount,asset,status,created_at,reference')
            .order('created_at', { ascending: false })
            .limit(20),
        ])

        if (clientError) {
          const clientMessage = clientError.message || String(clientError)
          if (clientMessage.includes('Could not find the table') || clientMessage.includes('schema cache')) {
            setError('Supabase schema unavailable. Admin portfolio data cannot be loaded until the clients table exists.')
            setClients([])
            return
          }
          throw clientError
        }
        if (paymentError) {
          setPaymentError('Unable to load payment requests.')
        }

        if (mounted) {
          setClients(
            (clientData || []).map((item) => ({
              id: item.id,
              name: item.name,
              email: item.email,
              portfolioValue: item.portfolio_value || 0,
              status: item.status || 'Active',
              strategy: item.strategy || 'Balanced',
              holdings: item.holdings || 0,
              lastActivity: item.last_activity || '-',
            }))
          )

          setPendingPayments(
            (paymentData || [])
              .filter((tx) => ['pending', 'awaiting_confirmation', 'submitted'].includes((tx.status || '').toLowerCase()))
              .map((tx) => ({
                id: tx.id,
                reference: tx.reference || tx.id,
                amount: tx.amount,
                asset: tx.asset,
                status: tx.status,
                createdAt: tx.created_at,
              }))
          )
        }
      } catch (err) {
        if (mounted) {
          const errMsg = err?.message || String(err)
          if (errMsg.includes('Could not find the table') || errMsg.includes('schema cache')) {
            setError('Supabase schema unavailable. Admin portfolio data cannot be loaded until the database tables exist.')
            setClients([])
          } else {
            setError(errMsg || 'Unable to load admin data.')
          }
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => {
      mounted = false
    }
  }, [])

  const totalAssets = clients.reduce((sum, client) => sum + (client.portfolioValue || 0), 0)
  const activeClients = clients.filter((client) => client.status === 'Active').length
  const pendingClients = clients.filter((client) => client.status !== 'Active').length

  const handleConfirmPayment = async (paymentId) => {
    setPaymentError(null)
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'Confirmed' })
        .eq('id', paymentId)

      if (error) throw error
      setPendingPayments((prev) => prev.filter((payment) => payment.id !== paymentId))
    } catch (err) {
      setPaymentError(err.message || 'Unable to confirm payment.')
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Admin dashboard</h2>
          <p className="text-sm text-muted mt-2 max-w-2xl">Review funding requests, confirm payments, and manage client portfolios.</p>
        </div>
        <div className="rounded-3xl border border-[#3b3120] bg-surface px-5 py-4 text-sm text-[#f2e9c8]">
          <div className="text-xs uppercase tracking-[0.3em] text-[#7a6a50]">Signed in as</div>
          <div className="mt-2 font-semibold text-[#f7e9c8]">{auth.user?.name || auth.user?.email}</div>
          <div className="text-xs text-[#b3a37d]">Admin access</div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.25rem] border border-[#3b3120] bg-surface p-5">
          <div className="text-xs uppercase tracking-[0.3em] text-muted mb-2">Total AUM</div>
          <div className="text-3xl font-semibold text-[#f7e9c8]">${totalAssets.toLocaleString()}</div>
        </div>
        <div className="rounded-[1.25rem] border border-[#3b3120] bg-surface p-5">
          <div className="text-xs uppercase tracking-[0.3em] text-muted mb-2">Active clients</div>
          <div className="text-3xl font-semibold text-[#f7e9c8]">{activeClients}</div>
        </div>
        <div className="rounded-[1.25rem] border border-[#3b3120] bg-surface p-5">
          <div className="text-xs uppercase tracking-[0.3em] text-muted mb-2">Pending reviews</div>
          <div className="text-3xl font-semibold text-[#f7e9c8]">{pendingClients}</div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-[1.25rem] border border-[#2c2418] bg-[#11100b] p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#f7e9c8]">Client portfolio overview</h3>
              <p className="text-sm text-[#b3a37d] mt-2">Monitor client account status and capital deployment.</p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-2xl border border-[#7d6a40] bg-[#0f0d09]/80 px-4 py-2 text-xs font-semibold text-[#f2e6c8] hover:bg-[#1b1710] transition"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-[#d4b05f]">Loading client records...</div>
          ) : clients.length === 0 ? (
            <div className="text-sm text-[#b3a37d]">No client records are available yet.</div>
          ) : (
            <div className="overflow-hidden rounded-[1.25rem] border border-[#2a2014] bg-[#0d0b08]">
              <div className="grid grid-cols-6 gap-4 border-b border-[#2a2014] bg-[#11100d] px-4 py-3 text-xs uppercase tracking-[0.32em] text-[#7a6a50]">
                <div className="col-span-2">Client</div>
                <div>Portfolio</div>
                <div>Status</div>
                <div>Strategy</div>
                <div>Activity</div>
              </div>
              <div className="space-y-2 p-4">
                {clients.map((client) => (
                  <div key={client.id} className="grid grid-cols-6 gap-4 rounded-2xl bg-[#0e0c08] p-4 text-sm text-[#f2e9c8]">
                    <div className="col-span-2 space-y-1">
                      <div className="font-semibold">{client.name}</div>
                      <div className="text-xs text-[#9d8f6b]">{client.email}</div>
                    </div>
                    <div>${client.portfolioValue.toLocaleString()}</div>
                    <div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${client.status === 'Active' ? 'bg-[#1f462b]/80 text-[#8ee0a8]' : 'bg-[#4a291e]/80 text-[#f7c1b2]'}`}>{client.status}</span>
                    </div>
                    <div>{client.strategy}</div>
                    <div>{client.lastActivity}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4 rounded-[1.25rem] border border-[#2f2718] bg-[#10100c]/95 p-5 text-sm text-[#b9a976]">
          <div className="rounded-3xl border border-[#2a2014] bg-[#11100d] p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Pending payment approvals</div>
            <div className="mt-4 space-y-3">
              {paymentError && <div className="text-sm text-[#f0c39b]">{paymentError}</div>}
              {pendingPayments.length === 0 ? (
                <div className="text-sm text-[#b3a37d]">No pending payment requests at this time.</div>
              ) : (
                pendingPayments.map((payment) => (
                  <div key={payment.id} className="rounded-2xl border border-[#2a2014] bg-[#0d0b08] p-4">
                    <div className="text-sm font-semibold text-[#f7e9c8]">{payment.asset || 'Payment'}</div>
                    <div className="mt-2 text-xs text-[#7a6a50]">{payment.reference}</div>
                    <div className="mt-3 flex items-center justify-between gap-4">
                      <span className="text-sm text-[#b3a37d]">${payment.amount?.toLocaleString() || '—'}</span>
                      <button
                        type="button"
                        onClick={() => handleConfirmPayment(payment.id)}
                        className="rounded-2xl border border-[#c8a96e] bg-[#d4b05f] px-3 py-2 text-xs font-semibold text-black transition hover:bg-[#e0c480]"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-[#2a2014] bg-[#11100d] p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Admin control</div>
            <div className="mt-4 grid gap-3">
              <div className="flex justify-between"><span>Pending deposits</span><span className="text-[#f7e9c8]">{pendingPayments.length}</span></div>
              <div className="flex justify-between"><span>Recent clients</span><span className="text-[#f7e9c8]">{clients.length}</span></div>
            </div>
          </div>
        </aside>
      </div>

      {error && <div className="rounded-[1.25rem] border border-[#7d4f2d] bg-[#241709] p-4 text-sm text-[#f0c39b]">{error}</div>}
    </div>
  )
}
