'use client';

import Link from 'next/link';

export default function Footer() {
  const socials = [
    {
      label: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.27c-.96 0-1.75-.79-1.75-1.76s.79-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76zm13.5 10.27h-3v-4.5c0-1.07-.02-2.45-1.49-2.45-1.5 0-1.73 1.17-1.73 2.37v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.67-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07zm0 5.46c-2.97 0-5.38 2.41-5.38 5.38s2.41 5.38 5.38 5.38 5.38-2.41 5.38-5.38-2.41-5.38-5.38-5.38zm0 8.87c-1.93 0-3.49-1.56-3.49-3.49s1.56-3.49 3.49-3.49 3.49 1.56 3.49 3.49-1.56 3.49-3.49 3.49zm6.85-9.08c0 .7-.56 1.25-1.25 1.25s-1.25-.56-1.25-1.25.56-1.25 1.25-1.25 1.25.56 1.25 1.25z" />
        </svg>
      ),
    },
    {
      label: 'GitHub',
      href: '#',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.63 0-12 5.37-12 12 0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5.99.11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02.01 2.04.14 3 .41 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.22.7.83.58 4.76-1.59 8.2-6.08 8.2-11.38 0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
    {
      label: 'Twitter',
      href: '#',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.9 1.15h3.68l-8.04 9.19 9.46 12.51h-7.41l-5.8-7.59-6.64 7.59h-3.68l8.6-9.83-9.07-11.87h7.6l5.24 6.93zm-1.29 19.5h2.04l-13.17-17.42h-2.19z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#2A161C] to-[#180D10] text-[#FAF7F2] py-16 px-6 border-t border-[#6B1A2A]/20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-6 group">
            <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-br from-[#6B1A2A] to-[#8B2535] flex items-center justify-center">
              <span className="text-[#C9A84C] font-serif font-bold text-base">C</span>
            </div>
            <span className="font-serif font-bold text-xl text-white tracking-wide">CardCraft</span>
          </Link>
          <p className="text-[#9A8880] text-sm leading-relaxed max-w-md mb-8">
            The premium digital business card platform for modern professionals. Designed to empower connections through premium aesthetics and modern web tech.
          </p>
          {/* Socials */}
          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#9A8880] hover:bg-[#C9A84C] hover:text-[#1C1410] hover:-translate-y-0.5 transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        
        {/* Footer Links & Copyright */}
        <div className="border-t border-[#26161C] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#5A4840]">
          <div>
            &copy; {new Date().getFullYear()} CardCraft Technologies. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#9A8880] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#9A8880] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#9A8880] transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
