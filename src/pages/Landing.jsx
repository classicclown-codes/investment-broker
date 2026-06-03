import React from 'react'
import { Link } from 'react-router-dom'

const metrics = [
  ['Client assets monitored', '$412M+'],
  ['Strategy sleeves', '8'],
  ['Settlement coverage', '24/7'],
]

const services = [
  {
    title: 'Discretionary portfolios',
    copy: 'Managed allocations across equities, fixed income, alternatives, and digital-asset exposure with documented risk controls.',
  },
  {
    title: 'Private client onboarding',
    copy: 'A structured intake process for suitability, investment objectives, identity review, and funding preferences.',
  },
  {
    title: 'Custody-aware execution',
    copy: 'Operational workflows designed around account security, settlement verification, and transparent transaction records.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#090705] px-4 py-6 text-[#f2e9c8] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="surface-card p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Private wealth management</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#f7e9c8] sm:text-5xl">Boutique capital oversight for ambitious investors.</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#b3a37d] sm:text-base">
                A refined portal for funding requests, portfolio monitoring, and disciplined admin-reviewed deployment that matches an elevated wealth experience.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/login" className="brand-button inline-flex justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5">
                  Client login
                </Link>
                <Link to="/signup" className="inline-flex justify-center rounded-2xl border border-[#7d6a40] bg-[#11100b] px-6 py-3 text-sm font-semibold text-[#f2e6c8] transition hover:border-[#d4b05f] hover:-translate-y-0.5">
                  Request access
                </Link>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-[#2a2014] bg-[#0b0905] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
              <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Private track</div>
              <div className="mt-4 text-xl font-semibold text-[#f7e9c8]">Built for deliberate capital deployment.</div>
              <p className="mt-3 text-sm leading-7 text-[#b3a37d]">
                Selective funding, admin verification, and portfolio signals for clients who expect precision, discretion, and performance-minded reporting.
              </p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="rounded-2xl bg-[#11100d] p-4">
                  <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Admin-first funding</div>
                  <div className="mt-1 text-[#f7e9c8]">Every request is reviewed before capital is deployed.</div>
                </div>
                <div className="rounded-2xl bg-[#11100d] p-4">
                  <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Controlled growth</div>
                  <div className="mt-1 text-[#f7e9c8]">Deposits are captured only after verification and strategy review.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-3">
          <div className="surface-panel p-5">
            <h2 className="text-lg font-semibold text-[#f7e9c8]">Portfolio oversight</h2>
            <p className="mt-3 text-sm text-[#b3a37d]">Real-time account reporting with clear capital allocation and status visibility.</p>
          </div>
          <div className="surface-panel p-5">
            <h2 className="text-lg font-semibold text-[#f7e9c8]">Funding requests</h2>
            <p className="mt-3 text-sm text-[#b3a37d]">Submit your funding details and await admin confirmation before payment is finalized.</p>
          </div>
          <div className="surface-panel p-5">
            <h2 className="text-lg font-semibold text-[#f7e9c8]">Admin review</h2>
            <p className="mt-3 text-sm text-[#b3a37d]">Deposit confirmations are managed by admin for secure settlement and oversight.</p>
          </div>
        </section>

        <section className="surface-card p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="surface-panel p-5">
              <h2 className="text-lg font-semibold text-[#f7e9c8]">Growth outlook</h2>
              <p className="mt-3 text-sm text-[#b3a37d]">
                Our portfolio process is built for selective capital deployment and a professional 20-30% interest projection across eligible client allocations.
              </p>
            </div>
            <div className="surface-panel p-5">
              <h2 className="text-lg font-semibold text-[#f7e9c8]">Preserved access</h2>
              <p className="mt-3 text-sm text-[#b3a37d]">
                Funding requests are reviewed by admin, ensuring secure onboarding and aligned investment execution before settlement.
              </p>
            </div>
          </div>
        </section>

        <section className="surface-card p-6 sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Experience</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#f7e9c8]">Tailored for elite investors.</h2>
              <p className="mt-4 text-sm leading-7 text-[#b3a37d]">
                The portal is crafted to reduce complexity, preserve discretion, and keep your capital flow aligned with private-banking standards.
              </p>
            </div>
            <div className="surface-panel p-5 text-sm text-[#d4b05f]">
              <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Client access</div>
              <div className="mt-3 font-semibold text-[#f7e9c8]">Private sign-in only</div>
              <div className="mt-3 text-[#b3a37d]">Your account details and funding requests are available only after authentication and admin review.</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
