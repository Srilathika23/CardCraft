'use client';

import React, { useState, useEffect, use } from 'react';
import { Mail, Phone, Globe, Download, MapPin, Award, Briefcase, Users, Link as LinkIcon, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import './card-view.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://cardcraft-ryo7.onrender.com/api';

// ── BRAND COLORS MAPS ──
const SOCIAL_COLORS: Record<string, string> = {
  linkedin: '#0077B5', instagram: '#E1306C', x: '#1a1a1a', facebook: '#1877F2',
  youtube: '#FF0000', tiktok: '#010101', whatsapp: '#25D366', telegram: '#2CA5E0',
  discord: '#5865F2', skype: '#00AFF0', signal: '#3A76F0',
};
const ICON_BG_COLORS: Record<string, string> = {
  linkedin: '#E8F3FB', instagram: '#FDE8F2', x: '#F0F0F0', facebook: '#E8F0FD',
  youtube: '#FFE8E8', tiktok: '#F0F0F0', whatsapp: '#E8FBF0', telegram: '#E3F4FC',
  discord: '#ECEFFE', skype: '#E5F7FC', signal: '#EAF2FF',
  email: '#FFF0E8', mail: '#FFF0E8', phone: '#E8FBF0',
  globe: '#E3F4FC', pin: '#FFE8E8', link: '#F5E8FF'
};

const ICONS: Record<string, React.ReactNode> = {
  user: <path d="M10 10a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM4 16.5c.7-3 3-4.5 6-4.5s5.3 1.5 6 4.5" strokeLinecap="round" strokeLinejoin="round" />,
  briefcase: (
    <>
      <rect x="3.5" y="6.5" width="13" height="9" rx="1.6" />
      <path d="M7.5 6.5V5a1.5 1.5 0 011.5-1.5h2A1.5 1.5 0 0112.5 5v1.5M3.5 10.5h13" />
    </>
  ),
  users: (
    <>
      <circle cx="7" cy="8" r="2.4" />
      <circle cx="14" cy="9" r="1.9" />
      <path d="M2.8 16c.5-2.6 2.1-4 4.2-4s3.7 1.4 4.2 4M11.8 12.4c1.6.1 2.9 1.3 3.4 3.6" strokeLinecap="round" />
    </>
  ),
  building: (
    <>
      <rect x="4.5" y="3" width="9.5" height="14" rx="1" />
      <path d="M7 6.3h1M11 6.3h1M7 9.3h1M11 9.3h1M7 12.3h1M11 12.3h1" strokeLinecap="round" />
    </>
  ),
  award: (
    <>
      <circle cx="10" cy="7.5" r="3.7" />
      <path d="M7.6 10.7L6.5 17l3.5-1.8L13.5 17l-1.1-6.3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  align: <path d="M3.5 5.5h13M3.5 10h9M3.5 14.5h11" strokeLinecap="round" />,
  mail: (
    <>
      <rect x="3" y="5" width="14" height="10.5" rx="1.6" />
      <path d="M3.6 5.8L10 11l6.4-5.2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  phone: <path d="M6.2 3.8c.5 1.2.8 2.3 1.3 3.1.3.5.2 1-.1 1.4l-1 1.1a9 9 0 004.2 4.2l1.1-1c.4-.3.9-.4 1.4-.1.8.5 1.9.8 3.1 1.3.7.3 1 1 .8 1.6l-.6 1.7c-.2.6-.8 1-1.4 1-6-.3-10.9-5.2-11.2-11.2 0-.6.4-1.2 1-1.4l1.7-.6c.6-.2 1.3.1 1.6.8z" strokeLinecap="round" strokeLinejoin="round" />,
  globe: (
    <>
      <circle cx="10" cy="10" r="6.8" />
      <path d="M3.2 10h13.6M10 3.2c2.3 2 3.4 4.4 3.4 6.8s-1.1 4.8-3.4 6.8c-2.3-2-3.4-4.4-3.4-6.8S7.7 5.2 10 3.2z" strokeLinecap="round" />
    </>
  ),
  link: (
    <>
      <path d="M8.3 11.7l3.4-3.4M8.6 6.4l.7-.7a3 3 0 014.2 4.2l-.7.7M11.4 13.6l-.7.7a3 3 0 01-4.2-4.2l.7-.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  pin: (
    <>
      <path d="M10 17.5S15.5 12.4 15.5 8.3a5.5 5.5 0 10-11 0c0 4.1 5.5 9.2 5.5 9.2z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="8.2" r="2" />
    </>
  ),
  linkedin: (
    <>
      <path d="M15 7a5 5 0 015 5v6h-3.5v-6a1.5 1.5 0 00-1.5-1.5 1.5 1.5 0 00-1.5 1.5v6H10v-6a5 5 0 015-5zM3 8h3.5v10H3z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="4.75" cy="4.5" r="1.5" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="14" height="14" rx="4" ry="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="6" r="1" />
    </>
  ),
  x: <path d="M3.5 2.5h4.5l5.5 8 5.5-8h3.5l-7.5 10 8 10h-4.5l-6.5-9-6.5 9h-3.5l8-10-8-10z" strokeLinecap="round" strokeLinejoin="round" />,
  facebook: <path d="M15 2h-2.5a4 4 0 00-4 4v2.5H6.5v3.5H8.5V18h3.5v-6h2.5l.5-3.5H12V6.5a1 1 0 011-1H15z" strokeLinecap="round" strokeLinejoin="round" />,
  youtube: (
    <>
      <path d="M18.5 5.5a2 2 0 00-1.5-1.5C15.5 3.5 10 3.5 10 3.5s-5.5 0-7 .5A2 2 0 001.5 5.5c-.5 1.5-.5 4.5-.5 4.5s0 3 .5 4.5a2 2 0 001.5 1.5c1.5.5 7 .5 7 .5s5.5 0 7-.5a2 2 0 001.5-1.5c.5-1.5.5-4.5.5-4.5s0-3-.5-4.5z" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="8 12 12 10 8 8" fill="currentColor" />
    </>
  ),
  tiktok: <path d="M8.5 11.5a3 3 0 103 3V3.5a4 4 0 004 4" strokeLinecap="round" strokeLinejoin="round" />,
  whatsapp: (
    <>
      <path d="M10 17.2c-1.3 0-2.6-.3-3.7-1l-.3-.2-2.8.7.7-2.7-.2-.3A7.2 7.2 0 1110 17.2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.8 7.8c-.2 0-.4.1-.5.3-.3.3-.5.7-.5 1.2 0 1 .4 2 1.2 2.8 1.1 1.1 2.3 1.7 3.5 1.7.5 0 .9-.2 1.2-.5.2-.2.3-.4.3-.6l-.6-1.2-.8.2c-.3.1-.5 0-.7-.2-.4-.4-.7-.8-.9-1.2 0-.3 0-.5.2-.7l.5-.5L9 8c-.1-.1-.3-.2-.5-.2z" fill="currentColor" />
    </>
  ),
  telegram: <path d="M18 3L2 10l6.5 2.5L15 6l-5.5 7.5 7.5 4z" strokeLinecap="round" strokeLinejoin="round" />,
  discord: (
    <>
      <path d="M4.5 5.5A1.5 1.5 0 016 4h8a1.5 1.5 0 011.5 1.5v8a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 12V5.5z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="8.5" r="1" fill="currentColor" />
      <circle cx="12" cy="8.5" r="1" fill="currentColor" />
      <path d="M7.5 11.5s1 1 2.5 1 2.5-1 2.5-1" strokeLinecap="round" />
    </>
  ),
  skype: (
    <>
      <path d="M13.5 10c0 2-1.5 3.5-3.5 3.5a3.5 3.5 0 01-3.5-3.5A3.5 3.5 0 0110 6.5c2 0 3.5 1.5 3.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6.5" cy="6.5" r="3" />
      <circle cx="13.5" cy="13.5" r="3" />
    </>
  ),
  signal: (
    <>
      <path d="M10 17.5c4.1 0 7.5-3.4 7.5-7.5S14.1 2.5 10 2.5 2.5 5.9 2.5 10s3.4 7.5 7.5 7.5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 13.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

const renderIcon = (name: string, props: React.SVGProps<SVGSVGElement> = {}) => {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      {ICONS[name] || <circle cx="10" cy="10" r="8" />}
    </svg>
  );
};

const templateColors: Record<string, string> = {
  'Midnight Pro': 'linear-gradient(150deg, #1A1B2F 0%, #16120E 100%)',
  'Ivory Elegance': 'linear-gradient(150deg, #FAF7F2 0%, #F2EDE6 100%)',
  'Scarlet Executive': 'linear-gradient(150deg, #6B1A2A 0%, #3D0B16 100%)',
  'Gold Classic': 'linear-gradient(150deg, #C9A84C 0%, #8a6500 100%)',
  'Forest Minimal': 'linear-gradient(150deg, #1a3a2a 0%, #0d2018 100%)',
  'Corporate Blue': 'linear-gradient(150deg, #1a3a6b 0%, #0d2045 100%)',
  'Rose Boutique': 'linear-gradient(150deg, #B85C6E 0%, #8B2535 100%)',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PublicCardViewPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const cardId = resolvedParams.id;

  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/cards/${cardId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Card not found');
        }
        return res.json();
      })
      .then(data => {
        setCard(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [cardId]);

  const downloadVCard = () => {
    if (!card) return;
    
    const designFields = card.designData?.fields || [];
    const fieldVal = (key: string) => {
      const found = designFields.find((f: any) => f.type === key);
      return found ? found.value : '';
    };
    
    const fieldObj = (key: string) => {
      return designFields.find((f: any) => f.type === key);
    };

    const fullName = card.fullName || '';
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${lastName};${firstName};;;\nFN:${fullName}\n`;
    if (card.jobTitle) vcard += `TITLE:${card.jobTitle}\n`;
    if (card.company) vcard += `ORG:${card.company}${card.department ? `;${card.department}` : ''}\n`;
    if (card.email) vcard += `EMAIL;TYPE=PREF,INTERNET:${card.email}\n`;
    
    if (card.phone) {
      const phObj = fieldObj('phone');
      const code = phObj?.countryCode ? phObj.countryCode + ' ' : '';
      const ext = phObj?.extension ? ' ext ' + phObj.extension : '';
      vcard += `TEL;TYPE=CELL,VOICE:${code}${card.phone}${ext}\n`;
    }
    if (card.website) vcard += `URL:${card.website}\n`;
    
    const address = fieldVal('address');
    if (address) vcard += `ADR;TYPE=WORK:;;${address};;;;\n`;

    const socials = ['linkedin', 'instagram', 'x', 'facebook', 'youtube', 'tiktok', 'whatsapp', 'telegram', 'discord', 'skype', 'signal'];
    socials.forEach(k => {
      const val = fieldVal(k);
      if (val) {
        vcard += `URL;type=${k}:${val}\n`;
      }
    });
    vcard += 'END:VCARD';

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fullName.replace(/\s+/g, '_')}_contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#E2D9D0] border-t-[#6B1A2A] rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#7A6860]">Loading digital business card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-sans p-6">
        <div className="bg-white border border-[#E2D9D0] rounded-2xl p-8 max-w-sm w-100 text-center shadow-xl space-y-5">
          <AlertCircle className="w-16 h-16 text-[#6B1A2A] mx-auto animate-pulse" />
          <h3 className="font-serif text-2xl font-bold text-[#1C1410]">Card Not Found</h3>
          <p className="text-sm text-[#7A6860] leading-relaxed">
            The digital business card you are looking for does not exist or has been deleted by the owner.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B1A2A] border-b-2 border-transparent hover:border-[#6B1A2A] transition-all">
            <ArrowLeft className="w-4 h-4" /> Go back home
          </Link>
        </div>
      </div>
    );
  }

  const brandColor = card.designData?.brandColor || '#6B1A2A';
  const customGradient = card.designData?.gradientStart && card.designData?.gradientEnd
    ? `linear-gradient(150deg, ${card.designData.gradientStart} 0%, ${card.designData.gradientEnd} 100%)`
    : (templateColors[card.template] || templateColors['Midnight Pro']);

  const coverUrl = card.designData?.images?.cover?.url;
  const profileUrl = card.designData?.images?.profile?.url;
  const logoUrl = card.designData?.images?.logo?.url;
  const fieldsList = card.designData?.fields || [];

  const customization = {
    profileShape: "circle",
    profileBorder: "white",
    coverRatio: "16-9",
    profilePosition: "overlap",
    logoPosition: "hidden",
    logoSize: 100,
    cardTemplate: "modern",
    typography: "DM Sans",
    cardRadius: 20,
    buttonStyle: "solid",
    backgroundEffect: "solid",
    cardTheme: "light",
    animations: {
      floating: false,
      "gradient-movement": false,
      "glow-effects": false,
      "hover-effects": true,
      "smooth-transitions": true,
      "pulse-effects": false,
      entrance: true
    },
    ...(card.designData?.customization || {})
  };

  const DARK_BG_EFFECTS = ["premium-luxury", "floating-particles", "mesh"];
  const isDarkTheme = customization.cardTheme === "dark" || DARK_BG_EFFECTS.includes(customization.backgroundEffect);
  const themeClass = isDarkTheme ? "theme-dark" : "theme-light";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1410] font-sans antialiased py-12 px-4 flex flex-col items-center justify-center relative">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#6B1A2A]/5 blur-3xl pointer-events-none" />
      
      <div className={`phone-frame ${Object.entries(customization.animations || {}).map(([k, v]) => v ? `anim-${k}` : '').join(' ')}`.trim()} style={{ width: '100%', maxWidth: '340px' }}>
        <div className={`phone-screen-wrap ${customization.animations?.['gradient-movement'] ? 'anim-gradient-movement' : ''}`.trim()}>
          <div className="phone-screen-inner">
            
            {/* Main card viewport wrapper */}
            <div 
              className={`phone-screen pos-${customization.profilePosition} ${themeClass}`}
              style={{ 
                fontFamily: `"${customization.typography}", -apple-system, sans-serif`, 
                borderRadius: `${customization.cardRadius}px`,
                aspectRatio: '320/650',
                maxHeight: '660px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div className="phone-notch" />
              <div 
                className={`phone-screen-bg-effect effect-${customization.backgroundEffect}`} 
                style={{ borderRadius: `${customization.cardRadius}px` }} 
              />
              
              {logoUrl && customization.logoPosition !== 'hidden' && (
                <div className={`preview-logo-container logo-${customization.logoPosition}`}>
                  <img 
                    src={logoUrl} 
                    alt="logo" 
                    style={{ 
                      height: `${Math.round(20 * (customization.logoSize / 100))}px`, 
                      objectFit: 'contain' 
                    }} 
                  />
                </div>
              )}
              
              {/* Cover Photo */}
              <div 
                className={`card-hero ratio-${customization.coverRatio} ${coverUrl ? 'has-cover' : ''}`}
                style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : {
                  background: customGradient
                }}
              />
  
              {/* Profile Avatar */}
              <div className={`avatar-wrap shape-${customization.profileShape} border-${customization.profileBorder}`}>
                {profileUrl ? (
                  <img src={profileUrl} alt={card.fullName} />
                ) : (
                  <div className="w-full h-full bg-[#F2EDE6] flex items-center justify-center text-[#7A6860]">
                    {renderIcon('user', { className: 'w-10 h-10' })}
                  </div>
                )}
              </div>
  
              {/* Card Content Body */}
              <div className="flex-1 overflow-y-auto px-5 py-3 custom-scrollbar" style={{ zIndex: 3, position: 'relative' }}>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1C1410]">{card.fullName}</h2>
                
                {(card.jobTitle || card.company) && (
                  <p className="text-xs text-[#7A6860] font-semibold mt-1">
                    {[card.jobTitle, card.company].filter(Boolean).join(' · ')}
                  </p>
                )}
  
                {card.department && (
                  <p className="text-[11px] text-[#9A8880] font-medium mt-0.5">{card.department}</p>
                )}
  
                {/* Render List of Fields */}
                <div className="space-y-3 mt-5 pb-6">
                  {fieldsList
                    .filter((f: any) => f.type !== 'jobTitle' && f.type !== 'companyName' && f.type !== 'department')
                    .map((f: any) => {
                      const isSocial = ['linkedin', 'instagram', 'x', 'facebook', 'youtube', 'tiktok'].includes(f.type);
                      const isMsg = ['whatsapp', 'telegram', 'discord', 'skype', 'signal'].includes(f.type);
                      
                      let linkHref = '#';
                      if (f.type === 'email') linkHref = `mailto:${f.value}`;
                      else if (f.type === 'phone') linkHref = `tel:${f.countryCode || ''}${f.value}`;
                      else if (f.type === 'companyUrl' || f.type === 'link') {
                        linkHref = f.value.startsWith('http') ? f.value : `https://${f.value}`;
                      } else if (isSocial || isMsg) {
                        linkHref = f.value.startsWith('http') ? f.value : `https://${f.value}`;
                      }
  
                      const labelColor = isSocial || isMsg ? (SOCIAL_COLORS[f.type] || brandColor) : brandColor;
                      const iconBgColor = ICON_BG_COLORS[f.type] || '#FAF7F2';
  
                      return (
                        <a 
                          key={f.type} 
                          href={linkHref} 
                          target={f.type === 'email' || f.type === 'phone' ? undefined : '_blank'} 
                          className="flex items-center gap-3.5 p-3 rounded-2xl border border-[#E2D9D0]/50 bg-white hover:bg-[#FAF7F2]/50 hover:border-[#6B1A2A]/20 transition-all duration-200 group no-underline"
                        >
                          <div 
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                            style={{ background: iconBgColor, color: labelColor }}
                          >
                            {renderIcon(f.type, { className: 'w-5 h-5' })}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] text-[#7A6860] uppercase tracking-wider font-bold leading-none">{f.label || f.type}</span>
                            <span className="text-xs text-[#1C1410] font-semibold mt-1 truncate leading-none">
                              {f.countryCode ? `${f.countryCode} ` : ''}
                              {f.value}
                              {f.extension ? ` Ext. ${f.extension}` : ''}
                            </span>
                          </div>
                        </a>
                      );
                    })}
                </div>
              </div>
  
              {/* Add to Contacts Button */}
              <div className="p-4 bg-white border-t border-[#E2D9D0]/70 shrink-0" style={{ zIndex: 3, position: 'relative' }}>
                <button 
                  onClick={downloadVCard}
                  className={`w-full text-white font-bold text-xs uppercase tracking-wider py-4 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 border-none phone-share-btn style-${customization.buttonStyle}`}
                  style={{
                    background: customization.buttonStyle === 'solid' || customization.buttonStyle === 'dark'
                      ? `linear-gradient(135deg, ${brandColor}, #1C1410)`
                      : undefined
                  }}
                >
                  <Download className="w-4 h-4" /> Add to Contacts
                </button>
              </div>
  
            </div>
          </div>
        </div>
      </div>

      {/* Powered by Watermark */}
      <div className="mt-6 text-center z-10">
        <Link href="/" className="no-underline text-xs text-[#7A6860] hover:text-[#6B1A2A] font-semibold transition-colors">
          Created with <span className="text-[#6B1A2A] font-serif font-bold">CardCraft</span>
        </Link>
      </div>

      <style>{`
        .margin-avatar {
          margin-top: -46px;
          margin-left: 24px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2D9D0;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #C9A84C;
        }
      `}</style>
    </div>
  );
}
