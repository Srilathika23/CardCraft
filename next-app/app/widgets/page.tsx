'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Smartphone, CheckCircle, HelpCircle, ArrowRight, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

export default function WidgetsShowcasePage() {
  const [activeWidget, setActiveWidget] = useState<'lock' | 'small' | 'medium' | 'wallet'>('medium');
  const [activeOS, setActiveOS] = useState<'ios' | 'android'>('ios');

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1410] font-sans antialiased selection:bg-[#6B1A2A] selection:text-white pt-24 animate-in fade-in duration-500">
      <Header />

      {/* ── HERO SECTION ── */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6B1A2A]/5 rounded-full filter blur-[120px] pointer-events-none -z-10" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-[#E2D9D0] rounded-full text-xs font-bold text-[#6B1A2A] uppercase tracking-wider mb-6">
          <Sparkles className="h-3 w-3 text-[#C9A84C]" />
          Instant Networking
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1C1410] font-serif max-w-4xl mx-auto leading-tight">
          Your Brand, <span className="text-[#6B1A2A] italic">Instantly</span> Accessible from Your Phone Screen
        </h1>
        <p className="mt-6 text-base sm:text-lg text-[#7A6860] max-w-2xl mx-auto leading-relaxed">
          Put your digital business card directly onto your iPhone or Android home screen, lock screen, or digital wallet. Share with a single tap, even when offline.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/create-card"
            className="bg-gradient-to-r from-[#6B1A2A] to-[#8B2535] text-white text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-full shadow-lg shadow-[#6B1A2A]/15 hover:shadow-xl hover:shadow-[#6B1A2A]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Create My Digital Card
          </Link>
          <a
            href="#install-guide"
            className="bg-white border border-[#E2D9D0] text-[#7A6860] hover:text-[#6B1A2A] text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-full shadow-sm hover:shadow active:scale-95 transition-all"
          >
            How to Set Up
          </a>
        </div>
      </section>

      {/* ── INTERACTIVE WIDGET VISUALIZER ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white border border-[#E2D9D0] rounded-3xl p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Mockup Preview (5 Columns) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[280px] h-[570px] rounded-[52px] bg-gradient-to-b from-[#1C1415] to-[#120809] p-3 shadow-2xl border-7 border-[#0C0607]">
              {/* Dynamic Island notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#0C0607] rounded-full z-20" />

              {/* Simulated Screen */}
              <div className="w-full h-full rounded-[42px] bg-[#221719] overflow-hidden relative p-4 flex flex-col justify-between" style={{
                backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(107,26,42,0.4) 0%, transparent 80%)'
              }}>
                {/* Time / Top Status */}
                <div className="flex justify-between items-center text-[10px] text-white/80 font-bold px-3 pt-1">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-white/80 rounded-full" />
                  </div>
                </div>

                {/* DYNAMIC WIDGET VIEWPORT */}
                <div className="my-auto w-full flex flex-col items-center justify-center">
                  
                  {/* LOCK SCREEN WIDGET */}
                  {activeWidget === 'lock' && (
                    <div className="w-16 h-16 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center text-white p-2 text-center animate-in zoom-in duration-300">
                      <div className="w-6 h-6 rounded bg-[#6B1A2A] flex items-center justify-center font-serif text-[10px] text-[#C9A84C] font-bold">C</div>
                      <span className="text-[7px] font-bold mt-1 tracking-wide">SHARE</span>
                    </div>
                  )}

                  {/* SMALL WIDGET (2x2 Grid) */}
                  {activeWidget === 'small' && (
                    <div className="w-[124px] h-[124px] bg-[#FAF7F2] border border-[#E2D9D0] rounded-2xl p-3 flex flex-col justify-between shadow-lg text-[#1C1410] animate-in zoom-in duration-300">
                      <div className="flex items-start justify-between">
                        <div className="w-8 h-8 rounded-full border border-[#E2D9D0] overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-4 h-4 bg-[#6B1A2A] rounded flex items-center justify-center font-serif text-[7px] text-white font-bold">C</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold leading-tight font-serif">Davis Gouse</div>
                        <div className="text-[7.5px] text-[#7A6860] font-semibold mt-0.5 truncate">UI/UX Designer</div>
                      </div>
                      <div className="w-full bg-[#6B1A2A] text-white text-[7px] font-bold uppercase tracking-wider py-1 rounded text-center">
                        Tap to Scan
                      </div>
                    </div>
                  )}

                  {/* MEDIUM WIDGET (4x2 Grid) */}
                  {activeWidget === 'medium' && (
                    <div className="w-[240px] h-[120px] bg-[#FAF7F2] border border-[#E2D9D0] rounded-2xl p-3.5 flex justify-between shadow-lg text-[#1C1410] animate-in zoom-in duration-300">
                      <div className="flex flex-col justify-between min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full border border-[#E2D9D0] overflow-hidden shrink-0">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold leading-tight font-serif truncate">Davis Gouse</div>
                            <div className="text-[8.5px] text-[#7A6860] font-semibold truncate">UI/UX Designer</div>
                          </div>
                        </div>
                        <div className="text-[8.5px] text-[#7A6860] leading-snug font-medium italic">
                          "Tap to connect and save my contact card instantly."
                        </div>
                      </div>
                      <div className="w-[84px] h-[84px] bg-white border border-[#E2D9D0] rounded-xl flex items-center justify-center p-1.5 shrink-0 self-center">
                        <svg viewBox="0 0 21 21" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <rect width="21" height="21" fill="white" />
                          <rect x="1" y="1" width="7" height="7" rx="0.8" fill="#6B1A2A" />
                          <rect x="2" y="2" width="5" height="5" rx="0.5" fill="white" />
                          <rect x="3" y="3" width="3" height="3" fill="#6B1A2A" />
                          <rect x="13" y="1" width="7" height="7" rx="0.8" fill="#6B1A2A" />
                          <rect x="14" y="2" width="5" height="5" rx="0.5" fill="white" />
                          <rect x="15" y="3" width="3" height="3" fill="#6B1A2A" />
                          <rect x="1" y="13" width="7" height="7" rx="0.8" fill="#6B1A2A" />
                          <rect x="2" y="14" width="5" height="5" rx="0.5" fill="white" />
                          <rect x="3" y="15" width="3" height="3" fill="#6B1A2A" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* DIGITAL WALLET PASS */}
                  {activeWidget === 'wallet' && (
                    <div className="w-[210px] h-[300px] bg-gradient-to-br from-[#6B1A2A] to-[#3a0610] border border-white/20 rounded-2xl p-4 flex flex-col justify-between shadow-2xl text-white relative overflow-hidden animate-in zoom-in duration-300">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full filter blur-xl" />
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-[7.5px] font-bold text-[#C9A84C] tracking-widest uppercase">Digital Pass</span>
                          <span className="font-serif font-bold text-sm mt-0.5">CardCraft</span>
                        </div>
                        <div className="w-6 h-6 rounded bg-[#FAF7F2] flex items-center justify-center font-serif text-[9px] text-[#6B1A2A] font-bold">CC</div>
                      </div>

                      <div className="mt-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight font-serif">Davis Gouse</div>
                          <div className="text-[8px] text-white/70">UI/UX Designer @ Acme Inc.</div>
                        </div>
                      </div>

                      <div className="bg-white/10 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 mt-auto">
                        <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center p-1">
                          <svg viewBox="0 0 21 21" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
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
                          </svg>
                        </div>
                        <span className="text-[7.5px] font-semibold text-[#C9A84C] tracking-wide uppercase">Add to Apple Wallet</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Bottom navigation pill */}
                <div className="w-20 h-1 bg-white/30 rounded-full mx-auto" />
              </div>
            </div>
          </div>

          {/* Right Side: Options and explanations (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-bold text-[#1C1410] font-serif">Select Widget Options</h3>
            <p className="text-sm text-[#7A6860]">
              Toggle between the widget configurations below to preview how CardCraft integrates directly into your device's native ecosystem.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'medium', title: 'Medium Home Widget', desc: 'Display profile details alongside an easily scannable QR code.' },
                { id: 'small', title: 'Small Home Widget', desc: 'A minimal tile presenting your brand card on the screen.' },
                { id: 'lock', title: 'Lock Screen Widget', desc: 'One-tap circular lock widget for instant connection offline.' },
                { id: 'wallet', title: 'Digital Wallet Card', desc: 'Saves directly to Apple Passbook or Google Wallet passes.' },
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => setActiveWidget(w.id as any)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                    activeWidget === w.id
                      ? 'border-[#6B1A2A] bg-[#6B1A2A]/5'
                      : 'border-[#E2D9D0] bg-white hover:border-[#6B1A2A]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#1C1410]">{w.title}</div>
                  <div className="text-xs text-[#7A6860] mt-1.5 leading-normal">{w.desc}</div>
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-[#E2D9D0] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs text-[#7A6860] leading-normal font-medium">
                No internet connection is required to scan your widget QR codes. Setup takes under a minute.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── BENEFITS SECTION ── */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#FAF7F2] border border-[#E2D9D0] rounded-2xl p-6">
          <div className="w-10 h-10 rounded-full bg-[#6B1A2A]/5 text-[#6B1A2A] flex items-center justify-center mb-4">
            <Smartphone className="h-5 w-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#1C1410]">Zero Friction</h3>
          <p className="text-xs text-[#7A6860] leading-relaxed mt-2">
            The person receiving your contact details does not need any app installed. Your widget displays a clean QR that opens instantly in their native web browser.
          </p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E2D9D0] rounded-2xl p-6">
          <div className="w-10 h-10 rounded-full bg-[#6B1A2A]/5 text-[#6B1A2A] flex items-center justify-center mb-4">
            <CreditCard className="h-5 w-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#1C1410]">Offline Access</h3>
          <p className="text-xs text-[#7A6860] leading-relaxed mt-2">
            Networking shouldn't depend on cellular connection. Lock screen and wallet widgets store your visual codes offline so you can share in subways, flights, or convention hubs.
          </p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E2D9D0] rounded-2xl p-6">
          <div className="w-10 h-10 rounded-full bg-[#6B1A2A]/5 text-[#6B1A2A] flex items-center justify-center mb-4">
            <CheckCircle className="h-5 w-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#1C1410]">Always Sync'd</h3>
          <p className="text-xs text-[#7A6860] leading-relaxed mt-2">
            When you update your title, phone, or links in the editor, your live business card updates instantly. Anyone loading the page or scanning your widget code will see your latest data.
          </p>
        </div>
      </section>

      {/* ── SETUP GUIDE SECTION ── */}
      <section id="install-guide" className="max-w-4xl mx-auto px-6 py-12 scroll-mt-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-serif text-[#1C1410]">Installation Setup Guide</h2>
          <p className="text-xs text-[#7A6860] mt-2">Set up CardCraft widgets on your device with these quick steps.</p>
          
          <div className="inline-flex bg-[#F2EDE6] border border-[#E2D9D0] rounded-full p-1 mt-6">
            <button
              onClick={() => setActiveOS('ios')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeOS === 'ios' ? 'bg-[#6B1A2A] text-white' : 'text-[#7A6860]'
              }`}
            >
              Apple iOS
            </button>
            <button
              onClick={() => setActiveOS('android')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeOS === 'android' ? 'bg-[#6B1A2A] text-white' : 'text-[#7A6860]'
              }`}
            >
              Android OS
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E2D9D0] rounded-2xl p-8 shadow-sm">
          {activeOS === 'ios' ? (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] flex items-center justify-center font-bold text-xs text-[#6B1A2A] shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-sm text-[#1C1410]">Enter Edit Mode</h4>
                  <p className="text-xs text-[#7A6860] mt-1">Press and hold an empty space on your iPhone Home Screen until the apps begin to jiggle.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] flex items-center justify-center font-bold text-xs text-[#6B1A2A] shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-sm text-[#1C1410]">Add Blinq Widget</h4>
                  <p className="text-xs text-[#7A6860] mt-1">Tap the <strong>+ (Add)</strong> button in the upper-left corner of the screen, search for <strong>CardCraft</strong>, and tap it.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] flex items-center justify-center font-bold text-xs text-[#6B1A2A] shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-sm text-[#1C1410]">Select Layout &amp; Finish</h4>
                  <p className="text-xs text-[#7A6860] mt-1">Swipe through the size options (Small, Medium, Lock Screen), select your preferred widget, and tap <strong>Add Widget</strong>.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] flex items-center justify-center font-bold text-xs text-[#6B1A2A] shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-sm text-[#1C1410]">Open Widgets Menu</h4>
                  <p className="text-xs text-[#7A6860] mt-1">Tap and hold any empty area on your Android Home Screen, and choose the <strong>Widgets</strong> popup icon.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] flex items-center justify-center font-bold text-xs text-[#6B1A2A] shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-sm text-[#1C1410]">Find CardCraft</h4>
                  <p className="text-xs text-[#7A6860] mt-1">Scroll down the widget list to locate the <strong>CardCraft</strong> application and expand it.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E2D9D0] flex items-center justify-center font-bold text-xs text-[#6B1A2A] shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-sm text-[#1C1410]">Drag &amp; Resize</h4>
                  <p className="text-xs text-[#7A6860] mt-1">Drag your chosen widget to the screen. You can tap and hold the widget border anchors to resize it to fit your desktop layout.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FINAL CTA SECTION ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="bg-[#6B1A2A] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#FAF7F2]/5 rounded-full filter blur-xl" />
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">Ready to craft your card?</h2>
          <p className="text-sm text-white/80 max-w-xl mx-auto mt-4 leading-relaxed">
            Build a premium, customizable digital business card today and share it instantly using your phone home widgets.
          </p>
          <div className="mt-8">
            <Link
              href="/create-card"
              className="inline-flex items-center gap-2 bg-[#FAF7F2] hover:bg-[#FAF7F2]/90 text-[#6B1A2A] text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all"
            >
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
