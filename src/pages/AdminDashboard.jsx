import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const sampleClients = [
  {
    id: 'c-1001',
    name: 'Caroline Etienne',
    email: 'caroline@aurum.com',
    portfolioValue: 1825000,
    status: 'Active',
    strategy: 'Balanced Growth',
    holdings: 24,
    lastActivity: '2026-05-29',
  },
  {
    id: 'c-1002',
    name: 'Michael Archer',
    email: 'michael@aurum.com',
    portfolioValue: 948000,
    status: 'Pending',
    strategy: 'Conservative',
    holdings: 18,
    lastActivity: '2026-05-26',
  },
  {
    id: 'c-1003',
    name: 'Avery Collins',
    email: 'avery@aurum.com',
    portfolioValue: 1342000,
    status: 'Active',
    strategy: 'Growth',
    holdings: 21,
    lastActivity: '2026-05-28',
  },
]

export default function AdminDashboard() {
  const auth = useAuth()
  const [clients, setClients] = useState(sampleClients)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return
    }

    setLoading(true)
    ;(async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id,name,email,portfolio_value,status,strategy,holdings,last_activity')
        .order('name', { ascending: true })

      if (error) {
        setError('Unable to load client data from Supabase. Showing sample data.')
        setLoading(false)
        return
      }

      if (data?.length) {
        setClients(
          data.map((item) => ({
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
      }
      setLoading(false)
    })()
  }, [])

  const totalAssets = clients.reduce((sum, client) => sum + (client.portfolioValue || 0), 0)
  const activeClients = clients.filter((client) => client.status === 'Active').length
  const pendingClients = clients.filter((client) => client.status !== 'Active').length

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Admin portal</h2>
          <p className="text-sm text-muted mt-2 max-w-2xl">Monitor client portfolios, review account status, and manage your private client relationships.</p>
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
              <h3 className="text-lg font-semibold text-[#f7e9c8]">Client portfolio snapshot</h3>
              <p className="text-sm text-[#b3a37d] mt-2">Review account status, portfolio value, and strategy coverage.</p>
            </div>
            <button className="rounded-2xl border border-[#7d6a40] bg-[#0f0d09]/80 px-4 py-2 text-xs font-semibold text-[#f2e6c8] hover:bg-[#1b1710] transition">Refresh</button>
          </div>

          {loading ? (
            <div className="text-[#d4b05f]">Loading client records...</div>
          ) : (
            <div className="overflow-hidden rounded-[1.25rem] border border-[#2a2014] bg-[#0d0b08]">
              <div className="grid grid-cols-6 gap-4 border-b border-[#2a2014] bg-[#11100d] px-4 py-3 text-xs uppercase tracking-[0.32em] text-[#7a6a50]">
                <div className="col-span-2">Client</div>
                <div>Portfolio</div>
                <div>Status</div>
                <div>Strategy</div>
                <div>Last activity</div>
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
            <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Admin tasks</div>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between"><span>Review client applications</span><span>8 open</span></div>
              <div className="flex justify-between"><span>Rebalance alerts</span><span>3 pending</span></div>
              <div className="flex justify-between"><span>Compliance checks</span><span>1 overdue</span></div>
            </div>
          </div>
          <div className="rounded-3xl border border-[#2a2014] bg-[#11100d] p-5">
            <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Portfolio coverage</div>
            <div className="mt-4 grid gap-3">
              <div className="flex justify-between"><span>High net worth</span><span className="text-[#f7e9c8]">62%</span></div>
              <div className="flex justify-between"><span>Institutional-style</span><span className="text-[#f7e9c8]">28%</span></div>
              <div className="flex justify-between"><span>Crypto-enabled</span><span className="text-[#f7e9c8]">10%</span></div>
            </div>
          </div>
        </aside>
      </div>

      {error && <div className="rounded-[1.25rem] border border-[#7d4f2d] bg-[#241709] p-4 text-sm text-[#f0c39b]">{error}</div>}
    </div>
  )
}
