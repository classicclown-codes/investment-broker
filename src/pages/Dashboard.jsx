import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PortfolioMiniChart from '../components/PortfolioMiniChart'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const auth = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    if (!auth.user) return

    if (!isSupabaseConfigured) {
      setErr('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      setLoading(false)
      return
    }

    let mounted = true
    const fetchPortfolio = async () => {
      setLoading(true)
      try {
        const { data: account, error: accountError } = await supabase
          .from('accounts')
          .select('id, portfolio_value, invested_amount, pending_deposits, active_strategies')
          .eq('user_id', auth.user.id)
          .maybeSingle()

        if (accountError) {
          const accountErrorMessage = accountError.message || String(accountError)
          if (accountErrorMessage.includes('Could not find the table') || accountErrorMessage.includes('schema cache')) {
            throw new Error('Supabase schema unavailable. Verify your tables and try again.')
          }
          throw accountError
        }

        if (!account) {
          setErr('No portfolio record found. Submit a funding request to initialize your account.')
          return
        }

        const { data: holdings, error: holdingsError } = await supabase
          .from('holdings')
          .select('asset, value, color')
          .eq('account_id', account.id)
          .order('value', { ascending: false })

        if (holdingsError) {
          setErr(holdingsError.message || 'Unable to load holdings data.')
          return
        }

        const { data: recentTransactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('id, asset, amount, status, date')
          .eq('account_id', account.id)
          .order('date', { ascending: false })
          .limit(10)

        if (transactionsError) {
          setErr(transactionsError.message || 'Unable to load recent transaction data.')
          return
        }

        if (mounted) {
          setData({
            ...account,
            holdings: holdings || [],
            recentTransactions: recentTransactions || [],
          })
        }
      } catch (error) {
        if (mounted) {
          const errorMessage = error.message || String(error)
          setErr(errorMessage || 'Unable to load portfolio data from Supabase.')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPortfolio()
    return () => {
      mounted = false
    }
  }, [auth.user])

  if (loading) return <div className="text-muted">Loading portfolio data...</div>
  if (err) return <div className="text-red-400">Error: {err}</div>

  const { portfolio_value, invested_amount, pending_deposits, active_strategies, holdings, recentTransactions } = data
  const portfolioValue = portfolio_value || 0
  const investedAmount = invested_amount || 0
  const totalHoldings = holdings.reduce((sum, holding) => sum + (holding.value || 0), 0)
  const returnsAmount = investedAmount > 0 ? portfolioValue - investedAmount : 0
  const returnsPct = investedAmount > 0 ? (returnsAmount / investedAmount) * 100 : 0

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="rounded-[1.5rem] border border-[#3b3120] bg-[#0d0b08]/90 p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Private client portal</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#f7e9c8] sm:text-4xl">Welcome back, {auth.user?.name.split(' ')[0] || 'Investor'}</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#b3a37d]">A concise view of your account, returns and pending admin approvals.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/apply" className="inline-flex items-center justify-center rounded-2xl border border-[#7d6a40] bg-[#0f0d09]/80 px-5 py-3 text-sm font-semibold text-[#f2e6c8] hover:bg-[#1b1710] transition">Submit funding</Link>
            <div className="inline-flex items-center justify-center rounded-2xl bg-[#d4b05f] px-5 py-3 text-sm font-semibold text-black">Admin review required</div>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[1.25rem] border border-[#3b3120] bg-surface p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-[#7a6a50] mb-3">Portfolio value</div>
          <div className="text-4xl font-semibold text-[#f7e9c8]">${portfolioValue.toLocaleString()}</div>
          <p className="mt-2 text-sm text-[#b3a37d]">Current account value.</p>
        </div>
        <div className="rounded-[1.25rem] border border-[#3b3120] bg-surface p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-[#7a6a50] mb-3">Invested capital</div>
          <div className="text-4xl font-semibold text-[#f7e9c8]">${investedAmount.toLocaleString()}</div>
          <p className="mt-2 text-sm text-[#b3a37d]">Total funded amount under review or allocation.</p>
        </div>
        <div className="rounded-[1.25rem] border border-[#3b3120] bg-surface p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-[#7a6a50] mb-3">Net return</div>
          <div className="text-4xl font-semibold text-[#f7e9c8]">${returnsAmount.toLocaleString()}</div>
          <p className="mt-2 text-sm text-[#b3a37d]">Realized value above invested capital.</p>
        </div>
        <div className="rounded-[1.25rem] border border-[#3b3120] bg-surface p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-[#7a6a50] mb-3">ROI</div>
          <div className="text-4xl font-semibold text-[#f7e9c8]">{investedAmount ? `${returnsPct.toFixed(1)}%` : '—'}</div>
          <p className="mt-2 text-sm text-[#b3a37d]">Return on invested capital.</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-[1.25rem] border border-[#2c2418] bg-[#11100b] p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#f7e9c8]">Recent activity</h3>
              <p className="text-sm text-[#b3a37d] mt-2">Recent deposits and transaction statuses.</p>
            </div>
            <div className="rounded-full bg-[#1a1720] px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Admin confirmed</div>
          </div>
          <div className="space-y-3">
            {(recentTransactions || []).map((tx) => (
              <div key={tx.id} className="rounded-[1.15rem] border border-[#2e2618] bg-[#0e0c08] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-medium text-[#f2e9c8]">{tx.asset} — {tx.amount}</div>
                    <div className="text-xs text-[#b3a37d]">{tx.status} • {tx.date}</div>
                  </div>
                  <div className="text-xs text-[#7a6a50]">{tx.id}</div>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && <div className="text-sm text-[#b3a37d]">No recent transaction records are available.</div>}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-[#3b3120] bg-surface p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#f7e9c8]">Holdings allocation</h3>
              <p className="text-sm text-[#b3a37d] mt-2">Current mix across your active positions.</p>
            </div>
            <div className="text-sm font-semibold text-[#d4b05f]">{totalHoldings ? `${((totalHoldings / portfolioValue) * 100).toFixed(0)}% invested` : '—'}</div>
          </div>
          <div className="flex items-center justify-center">
            <PortfolioMiniChart holdings={holdings} size={150} />
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            {holdings.map((h) => (
              <li key={h.asset} className="flex items-center gap-3 rounded-2xl border border-[#2a2014] bg-[#0d0b08] p-3">
                <span className="h-3 w-3 rounded-sm" style={{ background: h.color }} />
                <span className="font-medium text-[#f2e9c8]">{h.asset}</span>
                <span className="ml-auto text-sm text-[#b3a37d]">${h.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
