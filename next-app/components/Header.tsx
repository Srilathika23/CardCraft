'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-350 ${
        scrolled
          ? 'bg-[#FAF7F2]/92 backdrop-blur-md border-b border-[#E2D9D0] shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6B1A2A] to-[#8B2535] flex items-center justify-center shadow-md shadow-[#6B1A2A]/10 group-hover:scale-105 transition-transform duration-300">
            <span className="color-[#C9A84C] font-serif font-bold text-lg select-none text-[#C9A84C]">C</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif font-bold text-lg text-[#1C1410] tracking-wide">CardCraft</span>
            <span className="text-[9px] font-semibold text-[#7A6860] uppercase tracking-wider mt-0.5">Digital Identity</span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Features', href: '/#features' },
            { label: 'QR Code', href: '/qr' },
            { label: 'Widgets', href: '/widgets' },
            { label: 'Email Signatures', href: '/email-signatures' },
            { label: 'For Teams', href: '/#for-teams' },
            { label: 'FAQ', href: '/#faq' },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 relative py-1.5 ${
                  isActive
                    ? 'text-[#6B1A2A]'
                    : 'text-[#7A6860] hover:text-[#6B1A2A]'
                } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#6B1A2A] after:transition-all after:duration-300 ${
                  isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <Link
              href={user.role === 'admin' ? '/admin' : '/dashboard'}
              className="text-xs font-bold uppercase tracking-wider text-[#6B1A2A] hover:text-[#8B2535] transition-colors py-2 px-4 border border-[#6B1A2A]/20 rounded-full hover:bg-[#6B1A2A]/5"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-xs font-bold uppercase tracking-wider text-[#7A6860] hover:text-[#6B1A2A] transition-colors py-2 px-4"
            >
              Log in
            </Link>
          )}
          <Link
            href="/create-card"
            className="bg-gradient-to-r from-[#6B1A2A] to-[#8B2535] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md shadow-[#6B1A2A]/15 hover:shadow-lg hover:shadow-[#6B1A2A]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Craft my card
          </Link>
        </div>
      </div>
    </header>
  );
}
