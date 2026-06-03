import React, { useEffect, useState } from "react";

const steps = ["Profile", "Investment", "Strategy", "Deposit", "Review"];
const APP_HISTORY_KEY = 'aurum-application-history'
const DRAFT_KEY = 'aurum-application-draft'

const formatCurrency = (val) => val ? "$" + Number(val).toLocaleString() : "";

const inputClass = "w-full rounded-3xl bg-[#0d0b08] border border-[#2c2314] px-4 py-3 text-sm text-[#f2e9c8] placeholder-[#7a6a50] focus:border-[#c8a96e] focus:outline-none focus:ring-2 focus:ring-[#c8a96e]/20 transition";
const labelClass = "block text-[#c8a96e] text-xs tracking-[0.35em] uppercase mb-2 font-semibold";

const WALLETS = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    color: "#f7931a",
    address: "bc1qzgfdme77qm0gqgh6e2lh0armmktpd6xmj0q2xa",
    network: "Bitcoin Network",
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    color: "#627eea",
    address: "0xeb34f556ba50243d54132c09BE94bB6Ffeb67c3F",
    network: "ERC-20 Network",
  },
  USDT: {
    symbol: "USDT",
    name: "Tether (USDT)",
    color: "#26a17b",
    address: "TUV7NHn4bGYaVxeM3GhiBbr7rZTy1ZJCXn",
    network: "TRC-20 (TRON)",
  },
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition ${copied ? 'border-green-500/40 bg-green-500/10 text-green-400' : 'border-[#2c2314] bg-[#0d0b08] text-[#b9a976] hover:border-[#c8a96e] hover:text-[#f7e9c8]'}`}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState("USDT");
  const [applications, setApplications] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(window.localStorage.getItem(APP_HISTORY_KEY)) || []
    } catch {
      return []
    }
  });

  const initialForm = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    dob: "",
    nationality: "",
    occupation: "",
    investAmount: "",
    customAmount: "",
    investTypes: [],
    investGoal: "",
    riskTolerance: "",
    strategy: "",
    horizon: "",
    referral: "",
    txHash: "",
    depositCoin: "USDT",
    agreeTerms: false,
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const draft = JSON.parse(window.localStorage.getItem(DRAFT_KEY))
      if (draft) {
        setForm((prev) => ({ ...prev, ...draft }))
      }
    } catch {
      // ignore invalid draft data
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || submitted) return
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
  }, [form, submitted]);

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(APP_HISTORY_KEY, JSON.stringify(applications))
  }, [applications]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const toggle = (key, value) => setForm((prev) => ({
    ...prev,
    [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
  }));

  const canNext = () => {
    if (step === 0) return form.fullName && form.email && form.phone;
    if (step === 1) return (form.investAmount || form.customAmount) && form.investTypes.length > 0;
    if (step === 2) return form.strategy && form.riskTolerance;
    if (step === 3) return form.txHash.trim().length > 10;
    if (step === 4) return form.agreeTerms;
    return true;
  };

  const amountOptions = [
    { label: "Under $10,000", value: "under10k" },
    { label: "$10,000 – $50,000", value: "10k-50k" },
    { label: "$50,001 – $100,000", value: "50k-100k" },
    { label: "$100,001 – $500,000", value: "100k-500k" },
    { label: "Over $500,000", value: "over500k" },
  ];

  const typeOptions = ["Stocks", "Real Estate", "Technology Ventures", "Bonds", "Crypto Assets", "Commodities"];

  const strategyOptions = [
    { value: "conservative", label: "Conservative", desc: "Preserve capital with lower volatility." },
    { value: "balanced", label: "Balanced", desc: "Blend growth with stability." },
    { value: "aggressive", label: "Aggressive Growth", desc: "Target higher returns with curated risk." },
    { value: "income", label: "Income-Focused", desc: "Generate steady income through dividends and interest." },
  ];

  const riskOptions = ["Low", "Moderate", "High", "Very High"];
  const horizonOptions = ["< 1 Year", "1–3 Years", "3–5 Years", "5–10 Years", "10+ Years"];

  const displayAmount = form.investAmount === "custom"
    ? formatCurrency(form.customAmount)
    : amountOptions.find((item) => item.value === form.investAmount)?.label || "—";

  const wallet = WALLETS[selectedCoin];

  if (submitted) {
    return (
      <div className="bg-[#090705] py-4 text-[#f2e9c8] sm:py-8">
        <div className="mx-auto max-w-3xl rounded-[1.25rem] border border-[#3b2f1f] bg-[#0f0d08]/95 p-5 shadow-[0_35px_90px_rgba(0,0,0,0.45)] sm:p-8">
          <div className="flex flex-col gap-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#c8a96e]/15 border border-[#c8a96e]/40 text-[#c8a96e]">
              <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Client application submitted</p>
            <h1 className="text-3xl font-semibold text-[#f7e9c8] sm:text-4xl">Deposit confirmed</h1>
            <p className="max-w-2xl text-sm leading-7 text-[#b3a37d]">Thank you, <span className="text-[#d4b05f]">{form.fullName}</span>. Your request has been received by our private client team and will be processed within 24 hours.</p>
            <div className="rounded-3xl border border-[#2a2014] bg-[#11100d] p-6 text-left text-sm text-[#d8c79b]">
              <div className="grid gap-3">
                {[
                  ['Investment range', displayAmount],
                  ['Strategy', form.strategy ? form.strategy.charAt(0).toUpperCase() + form.strategy.slice(1) : '—'],
                  ['Risk tolerance', form.riskTolerance || '—'],
                  ['Deposit asset', form.depositCoin],
                  ['TX hash', form.txHash || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-[#7a6a50]">{label}</span>
                    <span className="font-semibold text-[#f2e9c8] truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setSubmittedData(null);
                setStep(0);
                setSelectedCoin("USDT");
                setForm(initialForm);
              }}
              className="mx-auto rounded-2xl border border-[#c8a96e]/40 bg-[#c8a96e]/10 px-7 py-3 text-sm font-semibold text-[#d4b05f] transition hover:bg-[#c8a96e]/15"
            >
              Start another application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#090705] py-4 text-[#f2e9c8] sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[1.25rem] border border-[#3b2f1f] bg-[#0f0d08]/95 p-4 shadow-[0_35px_90px_rgba(0,0,0,0.45)] sm:p-6 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Private client onboarding</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#f7e9c8] sm:text-4xl">Investment application</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#b3a37d]">Complete your wealth onboarding form with broker-grade security and preferred asset choices.</p>
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
                  {steps.map((label, index) => (
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
                        <input className={inputClass} placeholder="Jane Doe" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Email address</label>
                        <input type="email" className={inputClass} placeholder="client@domain.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>Phone number</label>
                        <input type="tel" className={inputClass} placeholder="+1 (555) 123-4567" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Date of birth</label>
                        <input type="date" className={inputClass} value={form.dob} onChange={(e) => set('dob', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                      <div>
                        <label className={labelClass}>City</label>
                        <input className={inputClass} placeholder="New York" value={form.city} onChange={(e) => set('city', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>State / region</label>
                        <input className={inputClass} placeholder="NY" value={form.state} onChange={(e) => set('state', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>ZIP / postal</label>
                        <input className={inputClass} placeholder="10001" value={form.zip} onChange={(e) => set('zip', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>Nationality</label>
                        <input className={inputClass} placeholder="United States" value={form.nationality} onChange={(e) => set('nationality', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Occupation</label>
                        <input className={inputClass} placeholder="Finance Executive" value={form.occupation} onChange={(e) => set('occupation', e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Investment range</label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {amountOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => set('investAmount', option.value)}
                            className={`rounded-2xl border px-4 py-4 text-left text-sm transition ${form.investAmount === option.value ? 'border-[#c8a96e] bg-[#c8a96e]/10 text-[#f7e9c8]' : 'border-[#2c2314] bg-[#0d0b08] text-[#b9a976]'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                        <div className="rounded-2xl border border-[#2c2314] bg-[#0d0b08] p-4">
                          <label className={labelClass}>Custom amount</label>
                          <input
                            type="number"
                            className={inputClass}
                            value={form.customAmount}
                            onChange={(e) => set('customAmount', e.target.value)}
                            placeholder="Enter amount"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Preferred asset classes</label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {typeOptions.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggle('investTypes', type)}
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
                      <label className={labelClass}>Investment objective</label>
                      <textarea
                        className={`${inputClass} h-40 resize-none`}
                        placeholder="Describe your primary investment goal"
                        value={form.investGoal}
                        onChange={(e) => set('investGoal', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-3xl border border-[#2c2314] bg-[#0d0b08] p-4">
                        <div className="mb-4 text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Strategy profile</div>
                        <div className="space-y-3">
                          {strategyOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => set('strategy', option.value)}
                              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${form.strategy === option.value ? 'border-[#c8a96e] bg-[#c8a96e]/10 text-[#f7e9c8]' : 'border-[#2c2314] bg-[#0d0b08] text-[#b9a976]'}`}
                            >
                              <div className="font-semibold">{option.label}</div>
                              <div className="text-xs text-[#7a6a50] mt-1">{option.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-3xl border border-[#2c2314] bg-[#0d0b08] p-4">
                        <div className="mb-4 text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Risk & horizon</div>
                        <div className="space-y-4">
                          <div>
                            <label className={labelClass}>Risk tolerance</label>
                            <select className={`${inputClass} appearance-none`} value={form.riskTolerance} onChange={(e) => set('riskTolerance', e.target.value)}>
                              <option value="">Choose profile</option>
                              {riskOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>Investment horizon</label>
                            <select className={`${inputClass} appearance-none`} value={form.horizon} onChange={(e) => set('horizon', e.target.value)}>
                              <option value="">Choose horizon</option>
                              {horizonOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-[#2a2014] bg-[#0d0b08] p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Deposit instruction</div>
                          <div className="mt-2 text-xl font-semibold text-[#f7e9c8]">Select settlement currency</div>
                        </div>
                        <span className="rounded-full bg-[#c8a96e]/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-[#d4b05f]">Private deposit</span>
                      </div>
                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {Object.entries(WALLETS).map(([key, walletData]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setSelectedCoin(key);
                              set('depositCoin', key);
                            }}
                            className={`rounded-3xl border p-4 text-left transition ${selectedCoin === key ? 'border-[#c8a96e] bg-[#c8a96e]/10 text-[#f7e9c8]' : 'border-[#2c2314] bg-[#0d0b08] text-[#b9a976]'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16120c] text-sm font-semibold text-[#f2e9c8]">{walletData.symbol}</div>
                              <div>
                                <div className="font-semibold">{walletData.name}</div>
                                <div className="text-xs text-[#7a6a50]">{walletData.network}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="mt-6 space-y-4 rounded-3xl border border-[#2a2014] bg-[#11100d] p-5 text-sm text-[#d8c79b]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Deposit address</p>
                            <p className="mt-2 break-all text-[#f2e9c8]">{wallet.address}</p>
                          </div>
                          <CopyButton text={wallet.address} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className={labelClass}>Transaction hash</label>
                            <input className={inputClass} placeholder="Paste TX hash" value={form.txHash} onChange={(e) => set('txHash', e.target.value)} />
                          </div>
                          <div>
                            <label className={labelClass}>Referral source</label>
                            <input className={inputClass} placeholder="e.g. family office" value={form.referral} onChange={(e) => set('referral', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-[#2a2014] bg-[#0d0b08] p-6">
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#f7e9c8]">Review submission</h2>
                        <p className="mt-2 text-sm text-[#b3a37d]">Confirm your details before finalizing the application.</p>
                      </div>
                      <div className="grid gap-4">
                        {[
                          ['Full name', form.fullName],
                          ['Email', form.email],
                          ['Phone', form.phone],
                          ['Investment preference', displayAmount],
                          ['Strategy', form.strategy ? form.strategy.charAt(0).toUpperCase() + form.strategy.slice(1) : '—'],
                          ['Risk tolerance', form.riskTolerance || '—'],
                          ['Horizon', form.horizon || '—'],
                          ['Deposit asset', form.depositCoin],
                          ['TX hash', form.txHash || '—'],
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
                        onChange={(e) => set('agreeTerms', e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-[#2c2314] bg-[#0d0b08] text-[#c8a96e]"
                      />
                      <span>I confirm that the information provided is accurate and agree to the terms of service.</span>
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
                    if (!canNext()) return;
                    if (step === 4) {
                      const entry = {
                        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                        createdAt: new Date().toISOString(),
                        name: form.fullName,
                        email: form.email,
                        strategy: form.strategy,
                        riskTolerance: form.riskTolerance,
                        depositCoin: form.depositCoin,
                        txHash: form.txHash,
                        investment: displayAmount,
                      };
                      setApplications((prev) => [entry, ...prev].slice(0, 5));
                      setSubmittedData(entry);
                      setSubmitted(true);
                      window.localStorage.removeItem(DRAFT_KEY);
                    } else {
                      setStep((current) => Math.min(4, current + 1));
                    }
                  }}
                  className={`rounded-2xl px-6 py-3 text-sm font-semibold transition ${canNext() ? 'bg-[#c8a96e] text-[#0d0a06] shadow-[0_15px_35px_rgba(212,176,95,0.25)] hover:bg-[#e0c480]' : 'bg-[#1d1911] text-[#4c452f] cursor-not-allowed'}`}
                >
                  {step === 4 ? 'Submit application' : 'Continue'}
                </button>
              </div>
            </div>

            <aside className="space-y-4 rounded-[1.25rem] border border-[#2f2718] bg-[#10100c]/95 p-4 text-sm text-[#b9a976] sm:space-y-6 sm:p-6">
              <div className="rounded-3xl border border-[#2a2014] bg-[#11100d] p-5">
                <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Private advisory</div>
                <div className="mt-4 text-sm text-[#f2e9c8]">Your application is reviewed by our dedicated private client team, ensuring a bespoke strategy and secure execution.</div>
              </div>
              <div className="rounded-3xl border border-[#2a2014] bg-[#11100d] p-5">
                <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50] mb-4">Recent applications</div>
                {applications.length === 0 ? (
                  <p className="text-sm text-[#b3a37d]">No saved applications yet. Submit one to preserve it here.</p>
                ) : (
                  <div className="space-y-3">
                    {applications.map((entry) => (
                      <div key={entry.id} className="rounded-2xl border border-[#2a2014] bg-[#0d0b08] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold text-[#f7e9c8]">{entry.name || entry.email}</div>
                            <div className="text-xs text-[#7a6a50]">{new Date(entry.createdAt).toLocaleDateString()}</div>
                          </div>
                          <span className="rounded-full bg-[#c8a96e]/10 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-[#d4b05f]">{entry.depositCoin}</span>
                        </div>
                        <div className="mt-3 text-sm text-[#b3a37d]">{entry.investment} • {entry.strategy ? entry.strategy.charAt(0).toUpperCase() + entry.strategy.slice(1) : 'Strategy pending'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="rounded-3xl border border-[#2a2014] bg-[#11100d] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16120c] text-[#f7e9c8]">A</div>
                  <div>
                    <div className="text-sm font-semibold text-[#f7e9c8]">Aurum Capital</div>
                    <div className="text-xs text-[#7a6a50]">Broker service for premium clients</div>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="flex justify-between"><span>Strategy review</span><span className="text-[#f7e9c8]">Included</span></div>
                  <div className="flex justify-between"><span>Private account setup</span><span className="text-[#f7e9c8]">Immediate</span></div>
                  <div className="flex justify-between"><span>Deposit tracking</span><span className="text-[#f7e9c8]">Detailed</span></div>
                </div>
              </div>
              <div className="rounded-3xl border border-[#2a2014] bg-[#11100d] p-5">
                <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50] mb-4">Selected wallet</div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16120c] text-[#f7e9c8]">{wallet.symbol}</div>
                  <div>
                    <div className="font-semibold text-[#f7e9c8]">{wallet.name}</div>
                    <div className="text-xs text-[#7a6a50]">{wallet.network}</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
