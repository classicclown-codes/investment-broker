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

const process = ['Discovery', 'Suitability review', 'Portfolio mandate', 'Funding verification', 'Ongoing reporting']

export default function Landing() {
  return (
    <div className="space-y-8 sm:space-y-12">
      <section className="grid gap-6 py-4 sm:py-8 lg:min-h-[620px] lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-4 text-[0.68rem] uppercase tracking-[0.28em] text-muted sm:text-xs sm:tracking-[0.35em]">Private wealth brokerage</div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-[#f7e9c8] sm:text-5xl lg:text-6xl">
            Aurum Capital
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#c8b995] sm:text-lg sm:leading-8">
            A secure client portal for investment onboarding, portfolio oversight, and high-touch advisory workflows across traditional and digital markets.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="inline-flex justify-center rounded-2xl bg-[#d4b05f] px-6 py-3 font-semibold text-black transition hover:bg-[#e2c16f]">
              Open client access
            </Link>
            <Link to="/login" className="inline-flex justify-center rounded-2xl border border-[#7d6a40] px-6 py-3 text-sm font-semibold text-[#f2e6c8] transition hover:border-[#d4b05f]">
              Client login
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {metrics.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[#302719] bg-[#0d0b08] p-4 sm:border-l sm:border-r-0 sm:border-y-0 sm:bg-transparent sm:pl-4">
                <div className="text-2xl font-semibold text-[#f7e9c8]">{value}</div>
                <div className="mt-1 text-[0.68rem] uppercase tracking-[0.2em] text-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-[#352b1d] bg-[#0b0906] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.35)] sm:p-5">
            <div className="flex flex-col gap-3 border-b border-[#2d2519] pb-5 min-[380px]:flex-row min-[380px]:items-start min-[380px]:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted">Model mandate</div>
                <div className="mt-2 text-2xl font-semibold text-[#f7e9c8]">Balanced Growth</div>
              </div>
              <div className="w-fit rounded-full border border-[#315a42] bg-[#102117] px-3 py-1 text-xs font-semibold text-[#8ee0a8]">Active</div>
            </div>
            <div className="mt-5 space-y-4">
              {[
                ['Public equities', '44%', '#d4b05f'],
                ['Fixed income', '22%', '#7fb685'],
                ['Alternatives', '18%', '#9a8cff'],
                ['Digital assets', '16%', '#f08a5d'],
              ].map(([label, value, color]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-[#d8c79b]">{label}</span>
                    <span className="font-semibold text-[#f7e9c8]">{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#211b12]">
                    <div className="h-2 rounded-full" style={{ width: value, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#2d2519] bg-[#11100d] p-4">
                <div className="text-xs uppercase tracking-[0.25em] text-muted">Risk profile</div>
                <div className="mt-2 text-lg font-semibold text-[#f7e9c8]">Moderate</div>
              </div>
              <div className="rounded-2xl border border-[#2d2519] bg-[#11100d] p-4">
                <div className="text-xs uppercase tracking-[0.25em] text-muted">Review cycle</div>
                <div className="mt-2 text-lg font-semibold text-[#f7e9c8]">Monthly</div>
              </div>
            </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {services.map((service) => (
          <div key={service.title} className="rounded-[1.25rem] border border-[#302719] bg-[#11100b] p-5">
            <h2 className="text-lg font-semibold text-[#f7e9c8]">{service.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{service.copy}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[1.25rem] border border-[#302719] bg-surface p-5 sm:p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <div className="text-[0.68rem] uppercase tracking-[0.28em] text-muted sm:text-xs sm:tracking-[0.35em]">Operating process</div>
            <h2 className="mt-3 text-2xl font-semibold text-[#f7e9c8] sm:text-3xl">Built for a serious client journey.</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              The portal is structured around the workflow a brokerage relationship actually needs: authenticated access, suitability context, funding records, and ongoing visibility.
            </p>
          </div>
          <div className="grid gap-3">
            {process.map((item, index) => (
              <div key={item} className="flex items-center gap-4 rounded-2xl border border-[#2d2519] bg-[#0d0b08] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d4b05f] text-sm font-bold text-black">{index + 1}</div>
                <div className="font-semibold text-[#f2e6c8]">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[1.25rem] border border-[#302719] bg-[#0d0b08] p-5 text-sm leading-7 text-muted sm:p-6">
        Aurum Capital is presented as a private-client technology experience. Final production use should connect onboarding submissions to secure storage, add compliance review controls, and avoid representing investment performance without the proper disclosures.
      </section>
    </div>
  )
}
