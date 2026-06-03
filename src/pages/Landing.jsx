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
    <div className="space-y-10 py-6 sm:py-10">
      <section className="rounded-[1.5rem] border border-[#3b3120] bg-[#0d0b08]/90 p-6 sm:p-8">
        <div className="space-y-5 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Private wealth management</p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#f7e9c8] sm:text-5xl">A secure client portal for your capital.</h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-[#b3a37d] sm:text-base">
            Manage your investments, funding requests, and performance with a clean private-client experience.
          </p>
          <div className="mx-auto flex max-w-sm flex-col gap-3 sm:flex-row">
            <Link to="/login" className="inline-flex justify-center rounded-2xl bg-[#d4b05f] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e2c480]">
              Client login
            </Link>
            <Link to="/signup" className="inline-flex justify-center rounded-2xl border border-[#7d6a40] px-6 py-3 text-sm font-semibold text-[#f2e6c8] transition hover:border-[#d4b05f]">
              Request access
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[1.25rem] border border-[#3b3120] bg-[#11100b] p-6">
          <h2 className="text-lg font-semibold text-[#f7e9c8]">Portfolio oversight</h2>
          <p className="mt-3 text-sm text-[#b3a37d]">Real-time account reporting with clarity on value, return and allocation.</p>
        </div>
        <div className="rounded-[1.25rem] border border-[#3b3120] bg-[#11100b] p-6">
          <h2 className="text-lg font-semibold text-[#f7e9c8]">Funding requests</h2>
          <p className="mt-3 text-sm text-[#b3a37d]">Submit funding details and await admin confirmation before payment is finalized.</p>
        </div>
        <div className="rounded-[1.25rem] border border-[#3b3120] bg-[#11100b] p-6">
          <h2 className="text-lg font-semibold text-[#f7e9c8]">Private approval</h2>
          <p className="mt-3 text-sm text-[#b3a37d]">All deposit confirmations are controlled by admin review to protect your capital.</p>
        </div>
      </section>

      <section className="rounded-[1.25rem] border border-[#3b3120] bg-surface p-6 sm:p-8">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Experience</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#f7e9c8]">Built for a focused investor.</h2>
            <p className="mt-4 text-sm leading-7 text-[#b3a37d]">The portal is designed to remove noise and keep your capital oversight simple, secure, and mobile-first.</p>
          </div>
          <div className="rounded-3xl border border-[#2c2418] bg-[#0d0b08] p-5 text-sm text-[#d4b05f]">
            <div className="text-xs uppercase tracking-[0.35em] text-[#7a6a50]">Client access</div>
            <div className="mt-3 font-semibold text-[#f7e9c8]">Private sign-in only</div>
            <div className="mt-3">Your account and funding details become visible after authentication and review.</div>
          </div>
        </div>
      </section>
    </div>
  )
}
