import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PortfolioMiniChart from '../components/PortfolioMiniChart'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    fetch('/data/account.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load account data')
        return res.json()
      })
      .then(j => setData(j))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-muted">Loading account...</div>
  if (err) return <div className="text-red-400">Error: {err}</div>

  const { portfolioValue, pendingDeposits, activeStrategies, recentTransactions, holdings } = data

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Portfolio dashboard</h2>
          <p className="text-sm text-muted mt-2 max-w-2xl">A broker-grade overview of your holdings, performance, and recent transaction activity.</p>
        </div>
        <Link to="/apply" className="inline-flex items-center justify-center rounded-2xl border border-[#7d6a40] bg-[#0f0d09]/80 px-5 py-3 text-sm font-semibold text-[#f2e6c8] hover:bg-[#1b1710] transition w-full md:w-auto">New application</Link>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.25rem] border border-[#3b3120] bg-surface p-4 sm:p-5">
          <div className="text-xs uppercase tracking-[0.3em] text-muted mb-2">Portfolio value</div>
          <div className="text-3xl font-semibold text-[#f7e9c8]">${Number(portfolioValue).toLocaleString()}</div>
        </div>
        <div className="rounded-[1.25rem] border border-[#3b3120] bg-surface p-4 sm:p-5">
          <div className="text-xs uppercase tracking-[0.3em] text-muted mb-2">Pending deposits</div>
          <div className="text-2xl font-semibold text-[#f7e9c8]">{pendingDeposits}</div>
        </div>
        <div className="rounded-[1.25rem] border border-[#3b3120] bg-surface p-4 sm:p-5">
          <div className="text-xs uppercase tracking-[0.3em] text-muted mb-2">Active strategies</div>
          <div className="text-2xl font-semibold text-[#f7e9c8]">{activeStrategies}</div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="rounded-[1.25rem] border border-[#2c2418] bg-[#11100b] p-4 sm:p-5">
          <h3 className="text-lg font-semibold text-[#f7e9c8] mb-4">Recent transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="rounded-[1rem] border border-[#2e2618] bg-[#0e0c08] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#f2e6c8]">{tx.asset} — {tx.amount}</div>
                    <div className="text-xs text-muted">{tx.status} • {tx.date}</div>
                  </div>
                  <div className="text-xs text-muted">{tx.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-[#3b3120] bg-surface p-4 sm:p-5">
          <h3 className="text-lg font-semibold text-[#f7e9c8] mb-4">Holdings breakdown</h3>
          <PortfolioMiniChart holdings={holdings} size={140} />
          <ul className="mt-4 space-y-3 text-sm">
            {holdings.map(h => (
              <li key={h.asset} className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-sm" style={{ background: h.color }} />
                <span className="font-medium text-[#f2e6c8]">{h.asset}</span>
                <span className="ml-auto text-sm text-muted">${h.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="rounded-[1.25rem] border border-[#2f2718] bg-[#0b0906]/80 p-4 text-sm text-muted">Data is being rendered from <code className="text-[#d4b05f]">/data/account.json</code> for the demo environment.</div>
    </div>
  )
}
