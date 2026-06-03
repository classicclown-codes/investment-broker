import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const inputClass = 'w-full rounded-3xl bg-[#0d0b08] border border-[#2c2314] px-4 py-3 text-sm text-[#f2e9c8] placeholder-[#7a6a50] focus:border-[#c8a96e] focus:outline-none focus:ring-2 focus:ring-[#c8a96e]/20 transition'
const labelClass = 'block text-[#c8a96e] text-xs tracking-[0.35em] uppercase mb-2 font-semibold'

const amountOptions = [
  { label: 'Under $10,000', value: 'under10k' },
  { label: '$10,000 – $50,000', value: '10k-50k' },
  { label: '$50,001 – $100,000', value: '50k-100k' },
  { label: '$100,001 – $500,000', value: '100k-500k' },
  { label: 'Over $500,000', value: 'over500k' },
]

const investmentOptions = ['Stocks', 'Real Estate', 'Bonds', 'Crypto', 'Commodities']
const strategyOptions = ['Conservative', 'Balanced', 'Aggressive Growth', 'Income-Focused']
const riskOptions = ['Low', 'Moderate', 'High', 'Very High']
const horizonOptions = ['< 1 Year', '1–3 Years', '3–5 Years', '5–10 Years', '10+ Years']

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  investAmount: '',
  investTypes: [],
  strategy: '',
  riskTolerance: '',
  horizon: '',
  investGoal: '',
  txReference: '',
  fundingSource: '',
  agreeTerms: false,
}

function formatCurrency(value) {
  if (!value) return ''
  return '$' + Number(value).toLocaleString()
}

export default function InvestmentApp() {
  const auth = useAuth()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (!auth.user) return
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || auth.user.name || '',
      email: prev.email || auth.user.email || '',
    }))
  }, [auth.user])

  const submitFundingRequest = async () => {
    if (!auth.user) {
      setSubmitError('You must be signed in to submit a request.')
      return
    }

    if (!isSupabaseConfigured) {
      setSubmitError('Supabase is not configured. Please check your environment variables.')
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      const accountPayload = {
        user_id: auth.user.id,
        portfolio_value: 0,
        invested_amount: Number(form.investAmount) || 0,
        pending_deposits: Number(form.investAmount) || 0,
        active_strategies: form.investTypes.join(', '),
        strategy: form.strategy,
        last_activity: new Date().toISOString().split('T')[0],
      }

      const { data: existingAccount, error: fetchAccountError } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', auth.user.id)
        .maybeSingle()

      if (fetchAccountError) {
        throw fetchAccountError
      }

      const accountResponse = existingAccount?.id
        ? await supabase.from('accounts').update(accountPayload).eq('id', existingAccount.id).select().single()
        : await supabase.from('accounts').insert(accountPayload).select().single()

      if (accountResponse.error) {
        throw accountResponse.error
      }

      const account = accountResponse.data

      const clientPayload = {
        user_id: auth.user.id,
        email: auth.user.email,
        name: form.fullName || auth.user.name || '',
        portfolio_value: Number(form.investAmount) || 0,
        status: 'Pending',
        strategy: form.strategy,
        holdings: 0,
        last_activity: new Date().toISOString().split('T')[0],
        account_id: account?.id,
      }

      const { data: existingClient, error: fetchClientError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', auth.user.email)
        .maybeSingle()

      if (fetchClientError) {
        throw fetchClientError
      }

      const clientResponse = existingClient?.id
        ? await supabase.from('clients').update(clientPayload).eq('id', existingClient.id)
        : await supabase.from('clients').insert(clientPayload)

      if (clientResponse.error) {
        throw clientResponse.error
      }

      const transactionPayload = {
        account_id: account?.id,
        user_id: auth.user.id,
        amount: Number(form.investAmount) || 0,
        asset: form.investTypes.join(', ') || 'Funding request',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        reference: form.txReference,
        funding_source: form.fundingSource,
        notes: form.investGoal,
      }

      const { error: transactionError } = await supabase.from('transactions').insert(transactionPayload)
      if (transactionError) {
        throw transactionError
      }

      setSubmitted(true)
    } catch (error) {
      setSubmitError(error?.message || 'Unable to submit funding request.')
    } finally {
      setSubmitting(false)
    }
  }

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const toggleSelection = (value) => {
    setForm((prev) => ({
      ...prev,
      investTypes: prev.investTypes.includes(value)
        ? prev.investTypes.filter((item) => item !== value)
        : [...prev.investTypes, value],
    }))
  }

  const canNext = () => {
    if (step === 0) return form.fullName && form.email && form.phone
    if (step === 1) return form.investAmount && form.investTypes.length > 0
    if (step === 2) return form.strategy && form.riskTolerance
    if (step === 3) return form.txReference.trim().length > 5 && form.fundingSource.trim().length > 5
    if (step === 4) return form.agreeTerms
    return true
  }

  const amountLabel = amountOptions.find((item) => item.value === form.investAmount)?.label || formatCurrency(form.investAmount)

  if (submitted) {
    return (
      <div className="bg-[#090705] py-4 text-[#f2e9c8] sm:py-8">
        <div className="mx-auto max-w-3xl rounded-[1.25rem] border border-[#3b2f1f] bg-[#0f0d08]/95 p-5 shadow-[0_35px_90px_rgba(0,0,0,0.45)] sm:p-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Funding request submitted</p>
            <h1 className="mt-4 text-3xl font-semibold text-[#f7e9c8]">Pending admin approval</h1>
            <p className="mt-3 max-w-2xl mx-auto text-sm leading-7 text-[#b3a37d]">
              Your funding request has been received. Payment and account activation will be confirmed by admin once review is complete.
            </p>
            <div className="mt-8 rounded-3xl border border-[#2a2014] bg-[#11100d] p-6 text-left text-sm text-[#d8c79b]">
              <div className="grid gap-3">
                {[
                  ['Name', form.fullName],
                  ['Email', form.email],
                  ['Phone', form.phone],
                  ['Amount', amountLabel],
                  ['Strategy', form.strategy || '—'],
                  ['Risk tolerance', form.riskTolerance || '—'],
                  ['Reference', form.txReference || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-[#7a6a50]">{label}</span>
                    <span className="font-semibold text-[#f2e9c8]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false)
                setStep(0)
                setForm(initialForm)
              }}
              className="mt-8 rounded-2xl border border-[#c8a96e]/40 bg-[#c8a96e]/10 px-7 py-3 text-sm font-semibold text-[#d4b05f] transition hover:bg-[#c8a96e]/15"
            >
              Start another request
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#090705] py-4 text-[#f2e9c8] sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[1.25rem] border border-[#3b2f1f] bg-[#0f0d08]/95 p-4 shadow-[0_35px_90px_rgba(0,0,0,0.45)] sm:p-6 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Funding request</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#f7e9c8] sm:text-4xl">Submit your investment request</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#b3a37d]">Admin will review your funding details and confirm payment before execution.</p>
            </div>
            <div className="rounded-3xl border border-[#2a2014] bg-[#10100c]/95 px-5 py-4 text-center text-sm text-[#d4b05f]">
              <div className="text-[10px] uppercase tracking-[0.35em] text-[#7a6a50]">Step</div>
              <div className="mt-2 text-3xl font-semibold">{step + 1}</div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.9fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-[1.25rem] border border-[#2f2718] bg-[#12100c]/95 p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap gap-3">
                  {['Client', 'Funding', 'Strategy', 'Review'].map((label, index) => (
                    <span
                      key={label}
                      className={`inline-flex items-center rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.28em] ${index === step ? 'border-[#c8a96e] bg-[#c8a96e]/10 text-[#d4b05f]' : index < step ? 'border-[#3b3227] text-[#7a6a50]' : 'border-[#2a2014] text-[#3a3020]'}`}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {step === 0 && (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>Full legal name</label>
                        <input className={inputClass} value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Email address</label>
                        <input type="email" className={inputClass} value={form.email} onChange={(e) => setField('email', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>Phone number</label>
                        <input type="tel" className={inputClass} value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Investment horizon</label>
                        <select className={`${inputClass} appearance-none`} value={form.horizon} onChange={(e) => setField('horizon', e.target.value)}>
                          <option value="">Choose horizon</option>
                          {horizonOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Funding amount</label>
                      <input type="number" min="0" className={inputClass} placeholder="Enter amount" value={form.investAmount} onChange={(e) => setField('investAmount', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelClass}>Preferred allocations</label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {investmentOptions.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleSelection(type)}
                            className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${form.investTypes.includes(type) ? 'border-[#c8a96e] bg-[#c8a96e]/10 text-[#f7e9c8]' : 'border-[#2c2314] bg-[#0d0b08] text-[#b9a976]'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Investment strategy</label>
                      <select className={`${inputClass} appearance-none`} value={form.strategy} onChange={(e) => setField('strategy', e.target.value)}>
                        <option value="">Choose strategy</option>
                        {strategyOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Risk tolerance</label>
                      <select className={`${inputClass} appearance-none`} value={form.riskTolerance} onChange={(e) => setField('riskTolerance', e.target.value)}>
                        <option value="">Choose risk</option>
                        {riskOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Investment objective</label>
                      <textarea className={`${inputClass} h-32 resize-none`} placeholder="Describe your primary goal" value={form.investGoal} onChange={(e) => setField('investGoal', e.target.value)} />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-[#2a2014] bg-[#0d0b08] p-6">
                      <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Funding confirmation</div>
                      <p className="mt-3 text-sm text-[#b3a37d]">Provide the reference used for your transfer. Admin will confirm payment before funding is finalized.</p>
                      <div className="mt-6 grid gap-4">
                        <div>
                          <label className={labelClass}>Transaction reference</label>
                          <input className={inputClass} placeholder="Enter reference" value={form.txReference} onChange={(e) => setField('txReference', e.target.value)} />
                        </div>
                        <div>
                          <label className={labelClass}>Funding source</label>
                          <input className={inputClass} placeholder="Bank transfer or settlement source" value={form.fundingSource} onChange={(e) => setField('fundingSource', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-[#2a2014] bg-[#0d0b08] p-6">
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#f7e9c8]">Review request</h2>
                        <p className="mt-2 text-sm text-[#b3a37d]">Confirm your details before submitting for admin review.</p>
                      </div>
                      <div className="grid gap-4">
                        {[
                          ['Full name', form.fullName],
                          ['Email', form.email],
                          ['Phone', form.phone],
                          ['Amount', amountLabel || '—'],
                          ['Allocations', form.investTypes.join(', ') || '—'],
                          ['Strategy', form.strategy || '—'],
                          ['Risk tolerance', form.riskTolerance || '—'],
                          ['Reference', form.txReference || '—'],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-2xl border border-[#2a2014] bg-[#11100d] p-4">
                            <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">{label}</div>
                            <div className="mt-2 text-sm text-[#f2e9c8]">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <label className="flex items-start gap-3 rounded-3xl border border-[#2a2014] bg-[#11100d] p-5 text-sm text-[#b3a37d]">
                      <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={(e) => setField('agreeTerms', e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-[#2c2314] bg-[#0d0b08] text-[#c8a96e]"
                      />
                      <span>I confirm the information provided is accurate and approve this request for admin review.</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  disabled={step === 0}
                  className="rounded-2xl border border-[#2c2314] bg-[#0d0b08] px-6 py-3 text-sm text-[#b9a976] transition hover:border-[#c8a96e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!canNext()) return
                    if (step === 4) {
                      submitFundingRequest()
                      return
                    }
                    setStep((current) => Math.min(4, current + 1))
                  }}
                  disabled={submitting || !canNext()}
                  className={`rounded-2xl px-6 py-3 text-sm font-semibold transition ${canNext() && !submitting ? 'bg-[#c8a96e] text-[#0d0a06] shadow-[0_15px_35px_rgba(212,176,95,0.25)] hover:bg-[#e0c480]' : 'bg-[#1d1911] text-[#4c452f] cursor-not-allowed'}`}
                >
                  {submitting ? 'Submitting...' : step === 4 ? 'Submit request' : 'Continue'}
                </button>
              </div>
              {submitError && (
                <div className="rounded-3xl border border-[#7d4f2d] bg-[#241709] p-4 text-sm text-[#f0c39b]">{submitError}</div>
              )}
            </div>

            <aside className="space-y-4 rounded-[1.25rem] border border-[#2f2718] bg-[#10100c]/95 p-4 text-sm text-[#b9a976] sm:space-y-6 sm:p-6">
              <div className="rounded-3xl border border-[#2a2014] bg-[#11100d] p-5">
                <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Admin review process</div>
                <div className="mt-4 text-sm text-[#f2e9c8]">Your request is routed to admin for confirmation. Payment is only finalized after approval.</div>
              </div>
              <div className="rounded-3xl border border-[#2a2014] bg-[#11100d] p-5">
                <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">What we collect</div>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between"><span>Contact details</span><span className="text-[#f7e9c8]">Required</span></div>
                  <div className="flex justify-between"><span>Funding reference</span><span className="text-[#f7e9c8]">Required</span></div>
                  <div className="flex justify-between"><span>Admin confirmation</span><span className="text-[#f7e9c8]">Mandatory</span></div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
