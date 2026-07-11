'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Check, CheckCircle2, ShieldCheck, Zap, BarChart3, HelpCircle } from 'lucide-react';

export default function QRSectionPage() {
  const [scannedBadgeActive, setScannedBadgeActive] = useState(false);

  useEffect(() => {
    // Simulate periodic scan notifications for premium interactive feel
    const interval = setInterval(() => {
      setScannedBadgeActive(true);
      setTimeout(() => setScannedBadgeActive(false), 3000);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1410] font-sans antialiased selection:bg-[#6B1A2A] selection:text-white pt-24 animate-in fade-in duration-500">
      <Header />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Soft decorative background glows */}
        <div className="absolute top-1/4 right-1/10 h-72 w-72 rounded-full bg-[#6B1A2A]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/10 h-80 w-80 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#6B1A2A]/5 border border-[#6B1A2A]/10 text-[#6B1A2A] text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-sm">
            <Zap className="h-3.5 w-3.5 text-[#C9A84C]" />
            QR Code Technology
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1C1410] font-serif leading-tight">
            Your card, shared <br />
            with one <span className="italic text-[#6B1A2A]">quick scan</span>
          </h1>

          <p className="text-lg text-[#7A6860] leading-relaxed max-w-lg">
            Every CardCraft profile comes with a unique QR code. Share your contact, portfolio, and links instantly — no app required for your contacts.
          </p>

          <ul className="space-y-4 pt-4">
            {[
              'Unique QR code generated for every card',
              'Update your details anytime — the QR never changes',
              'Works with any smartphone camera, no extra apps needed',
              'Download, print, or embed anywhere',
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#1C1410] font-medium">
                <span className="h-5 w-5 rounded-full bg-[#6B1A2A]/5 border border-[#6B1A2A]/10 flex items-center justify-center text-[#6B1A2A] shrink-0 mt-0.5">
                  <Check className="h-3 w-3" />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 pt-6">
            <Link
              href="/widgets"
              className="bg-gradient-to-r from-[#6B1A2A] to-[#8B2535] text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full shadow-md shadow-[#6B1A2A]/15 hover:shadow-lg hover:shadow-[#6B1A2A]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
            >
              Get my free card
              <ArrowRight className="h-4 w-4 text-[#C9A84C]" />
            </Link>
            <a
              href="#how-it-works"
              className="text-xs font-bold uppercase tracking-wider text-[#1C1410] border-b-2 border-[#E2D9D0] hover:border-[#6B1A2A] hover:text-[#6B1A2A] transition-colors py-2 px-1"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Visual Phone Mockup */}
        <div className="relative flex justify-center items-center">
          {/* Decorative radial rings in background */}
          <div className="absolute w-[440px] h-[440px] rounded-full border border-[#C9A84C]/10 flex items-center justify-center animate-pulse duration-[8000ms]">
            <div className="absolute w-[320px] h-[320px] rounded-full border border-[#C9A84C]/5" />
          </div>

          {/* Interactive floating notification badge */}
          <div
            className={`absolute top-10 right-0 lg:-right-8 bg-white border border-[#E2D9D0] rounded-2xl p-4 shadow-xl flex items-center gap-3.5 z-30 transition-all duration-500 ${
              scannedBadgeActive ? 'scale-105 shadow-2xl translate-y-[-4px]' : ''
            }`}
          >
            <div className="h-10 w-10 rounded-xl bg-[#6B1A2A] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#6B1A2A]/10">
              <Zap className="h-5 w-5 text-[#C9A84C]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1C1410]">Scanned just now</div>
              <div className="text-[10px] text-[#7A6860] mt-0.5 font-medium">via iOS Camera</div>
            </div>
          </div>

          {/* Dynamic Always Up-to-date Badge */}
          <div className="absolute bottom-16 left-0 lg:-left-8 bg-white border border-[#E2D9D0] rounded-2xl p-4 shadow-xl flex items-center gap-3.5 z-30">
            <span className="flex h-3.5 w-3.5 rounded-full bg-emerald-500 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            </span>
            <div>
              <div className="text-xs font-bold text-[#1C1410]">Always up-to-date</div>
              <div className="text-[10px] text-[#7A6860] mt-0.5 font-medium">QR never changes</div>
            </div>
          </div>

          {/* Phone Canvas container */}
          <div className="relative w-[280px] h-[570px] rounded-[48px] bg-gradient-to-b from-[#1E1114] to-[#120809] p-2.5 shadow-2xl border-7 border-[#0C0607] shadow-[#1C1410]/25">
            {/* Camera notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#0C0607] rounded-full z-20" />
            
            {/* Screen */}
            <div className="w-full h-full rounded-[38px] bg-white overflow-hidden flex flex-col justify-between p-5 relative">
              <div className="h-[120px] bg-gradient-to-br from-[#6B1A2A] to-[#8B2535] absolute top-0 left-0 right-0" />
              <div className="w-16 h-16 rounded-full border-4 border-white bg-[#F2EDE6] absolute top-[88px] left-6 flex items-center justify-center text-[#7A6860] overflow-hidden">
                <span className="font-serif font-bold text-2xl text-[#6B1A2A]">A</span>
              </div>

              {/* Top status filler */}
              <div className="h-20 shrink-0" />

              {/* Main contact description */}
              <div className="space-y-1">
                <div className="text-xl font-bold text-[#1C1410] font-serif">Alex Morgan</div>
                <div className="text-xs text-[#7A6860] font-semibold">Product Designer · CardCraft</div>
              </div>

              {/* QR Block container */}
              <div className="bg-[#6B1A2A]/5 border border-[#6B1A2A]/10 rounded-2xl p-4 flex items-center justify-between mt-6">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B1A2A]">My QR Code</div>
                  <div className="text-[9.5px] text-[#7A6860] font-medium leading-none">Scan to save contact</div>
                </div>
                <div className="w-16 h-16 bg-white border border-[#E2D9D0] rounded-xl p-1.5 shadow-sm">
                  {/* Styled SVG QR Code */}
                  <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                    <rect width="21" height="21" fill="white" />
                    <rect x="1" y="1" width="7" height="7" rx="0.8" fill="#1C1410" />
                    <rect x="2" y="2" width="5" height="5" rx="0.5" fill="white" />
                    <rect x="3" y="3" width="3" height="3" fill="#1C1410" />
                    <rect x="13" y="1" width="7" height="7" rx="0.8" fill="#1C1410" />
                    <rect x="14" y="2" width="5" height="5" rx="0.5" fill="white" />
                    <rect x="15" y="3" width="3" height="3" fill="#1C1410" />
                    <rect x="1" y="13" width="7" height="7" rx="0.8" fill="#1C1410" />
                    <rect x="2" y="14" width="5" height="5" rx="0.5" fill="white" />
                    <rect x="3" y="15" width="3" height="3" fill="#1C1410" />
                    <rect x="9" y="1" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="11" y="1" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="9" y="3" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="11" y="5" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="9" y="7" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="13" y="9" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="15" y="9" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="17" y="11" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="11" y="9" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="1" y="9" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="3" y="11" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="5" y="9" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="7" y="11" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="9" y="11" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="1" y="11" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="9" y="13" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="11" y="13" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="13" y="13" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="17" y="13" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="15" y="15" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="17" y="17" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="13" y="17" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="11" y="17" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="9" y="17" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="9" y="19" width="1.5" height="1.5" fill="#1C1410" />
                    <rect x="13" y="19" width="1.5" height="1.5" fill="#1C1410" />
                  </svg>
                </div>
              </div>

              {/* Action pills */}
              <div className="flex gap-2 mt-auto">
                {['Call', 'Email', 'Website'].map((label) => (
                  <div key={label} className="bg-[#6B1A2A]/5 text-[#6B1A2A] text-[9.5px] font-bold px-3 py-2 rounded-full flex-1 text-center border border-[#6B1A2A]/10">
                    {label}
                  </div>
                ))}
              </div>

              <div className="w-24 h-1 bg-[#1C1410]/20 rounded-full mx-auto mt-4 shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-[#F2EDE6]/40 border-t border-b border-[#E2D9D0] py-12 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A6860]">Trusted by professionals at</div>
          <div className="flex flex-wrap items-center justify-center gap-12 text-[#7A6860]/50 font-bold text-base font-serif">
            {['Google', 'Salesforce', 'Goldman Sachs', 'Stripe', 'Tesla', 'Shopify'].map((logo) => (
              <span key={logo} className="hover:text-[#6B1A2A] transition-colors duration-200 select-none">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-24 px-6 scroll-mt-16" id="how-it-works">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="w-16 h-0.5 bg-[#C9A84C] mx-auto rounded" />
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1C1410] font-serif">
              Three steps to your perfect digital card
            </h2>
            <p className="text-sm text-[#7A6860] max-w-md mx-auto">
              From setup to sharing in under two minutes. Your QR code is ready the moment you finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Build your profile',
                desc: 'Add your photo, company logo, contact details, and all the links that matter — LinkedIn, portfolio, calendar, and more.',
                icon: (
                  <svg className="w-6 h-6 text-[#6B1A2A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Get your QR code',
                desc: 'CardCraft instantly generates a unique QR code tied to your profile. Download it as a PNG or SVG to use anywhere.',
                icon: (
                  <svg className="w-6 h-6 text-[#6B1A2A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="16" y="16" width="5" height="5" rx="0.5" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Share everywhere',
                desc: 'Print it on your physical card, add it to your email signature, or show it on your phone screen. Contacts scan once, done.',
                icon: (
                  <svg className="w-6 h-6 text-[#6B1A2A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                    <polyline points="16,6 12,2 8,6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                ),
              },
            ].map((s) => (
              <div key={s.step} className="bg-[#FAF7F2] border border-[#E2D9D0] rounded-2xl p-8 space-y-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div className="h-12 w-12 rounded-xl bg-[#6B1A2A]/5 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="font-serif text-3xl font-bold text-[#E2D9D0]">{s.step}</span>
                </div>
                <h3 className="text-lg font-bold text-[#1C1410]">{s.title}</h3>
                <p className="text-sm text-[#7A6860] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-5xl mx-auto py-24 px-6 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1C1410] font-serif leading-tight">
            Everything your <br />
            QR code can do
          </h2>
          <p className="text-base text-[#7A6860]">
            More than just a link — your QR code is a living connection to your professional world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Always live, never stale',
              desc: 'Change your job, number, or links anytime. Your existing QR code always points to your latest profile — no reprinting needed.',
              accent: true,
              icon: <Zap className="h-5 w-5" />,
            },
            {
              title: 'Scan analytics',
              desc: 'See how many times your QR was scanned, on what devices, and where in the world — so you know your card is working.',
              icon: <BarChart3 className="h-5 w-5" />,
            },
            {
              title: 'Private by default',
              desc: 'Your QR only shares what you choose. Toggle each field on or off. Your data is encrypted and never sold.',
              icon: <ShieldCheck className="h-5 w-5" />,
            },
            {
              title: 'Works everywhere',
              desc: 'Any modern smartphone camera reads it instantly. No special app needed — just point and scan, then save the contact.',
              icon: <CheckCircle2 className="h-5 w-5" />,
            },
          ].map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl border p-8 space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                f.accent
                  ? 'bg-[#6B1A2A] border-[#6B1A2A] text-white'
                  : 'bg-white border-[#E2D9D0] text-[#1C1410]'
              }`}
            >
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                  f.accent ? 'bg-white/20 text-white' : 'bg-[#6B1A2A]/5 text-[#6B1A2A]'
                }`}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className={`text-sm leading-relaxed ${f.accent ? 'text-white/85' : 'text-[#7A6860]'}`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-[#1C1410] text-[#FAF7F2] py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(107,26,42,0.4),transparent_65%)] pointer-events-none" />
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-serif text-white">
            Ready to share smarter? <br />
            <span className="italic text-[#C9A84C]">Your card is free, forever.</span>
          </h2>
          <p className="text-sm text-[#9A8880] max-w-sm mx-auto">
            Join over 500,000 professionals already using CardCraft.
          </p>
          <Link
            href="/widgets"
            className="inline-flex bg-[#6B1A2A] hover:bg-[#8B2535] text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full shadow-md shadow-[#6B1A2A]/10 hover:shadow-lg transition-all duration-200 mt-4 border border-white/10"
          >
            Create my card — it's free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
