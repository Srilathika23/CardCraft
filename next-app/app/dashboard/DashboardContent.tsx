'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://cardcraft-ryo7.onrender.com/api';

interface CardData {
  _id: string;
  cardName: string;
  fullName: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  template: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  designData?: any;
  department?: string;
}

const T = {
  primary:   '#6B1A2A',
  mid:       '#8B2535',
  warm:      '#B85C6E',
  ivory:     '#FAF7F2',
  paper:     '#F2EDE6',
  gold:      '#C9A84C',
  ink:       '#1C1410',
  muted:     '#7A6860',
  border:    '#E2D9D0',
  white:     '#FFFFFF',
};

const templateColors: Record<string, [string, string]> = {
  'Midnight Pro': ['#1a1a2e', '#16213e'],
  'Ivory Elegance': ['#FAF7F2', '#F2EDE6'],
  'Scarlet Executive': ['#6B1A2A', '#3D0B16'],
  'Gold Classic': ['#C9A84C', '#8a6500'],
  'Forest Minimal': ['#1a3a2a', '#0d2018'],
  'Corporate Blue': ['#1a3a6b', '#0d2045'],
  'Rose Boutique': ['#B85C6E', '#8B2535'],
};

function getInitials(name: string) {
  if (!name) return 'CC';
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function DashboardContent({ defaultSection = 'overview' }: { defaultSection?: string }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [qrModalCard, setQrModalCard] = useState<CardData | null>(null);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(defaultSection);

  useEffect(() => {
    setActiveSection(defaultSection);
  }, [defaultSection]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
    if (!isLoading && user?.role === 'admin') {
      router.push('/admin');
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCards();
    }
  }, [isAuthenticated, user]);

  const fetchCards = async () => {
    try {
      const res = await fetch(`${API_BASE}/cards/my`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (err) {
      console.error('Failed to fetch cards:', err);
    } finally {
      setLoadingCards(false);
    }
  };

  const deleteCard = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/cards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        setCards(cards.filter(c => c._id !== id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error('Failed to delete card:', err);
    }
  };

  const duplicateCardAction = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/cards/${id}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        fetchCards();
      }
    } catch (err) {
      console.error('Failed to duplicate card:', err);
    }
  };

  const shareCard = (id: string) => {
    const cardUrl = `${window.location.origin}/card/${id}`;
    navigator.clipboard.writeText(cardUrl).then(() => {
      setCopiedCardId(id);
      setTimeout(() => setCopiedCardId(null), 2000);
    }).catch(err => {
      console.error('Failed to copy link:', err);
    });
  };

  const downloadQR = async (cardId: string, cardName: string) => {
    try {
      const res = await fetch(`${API_BASE}/cards/${cardId}/qr`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${cardName.replace(/\s+/g, '_')}_qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download QR code", err);
    }
  };

  const downloadVCard = (card: CardData) => {
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

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section === 'overview') {
      router.push('/dashboard');
    } else if (section === 'cards') {
      router.push('/dashboard/my-cards');
    } else if (section === 'profile') {
      router.push('/dashboard?section=profile');
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: T.ivory }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${T.border}`, borderTopColor: T.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: T.muted, fontSize: 14, fontWeight: 500 }}>Loading dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const totalViews = cards.reduce((sum, c) => sum + c.views, 0);

  const renderCardPreview = (card: CardData) => {
    const colors = templateColors[card.template] || [T.primary, T.mid];
    const textIsLight = !['Ivory Elegance'].includes(card.template);
    const textColor = textIsLight ? '#fff' : T.ink;
    const coverUrl = card.designData?.images?.cover?.url;
    const profileUrl = card.designData?.images?.profile?.url;
    const initials = getInitials(card.fullName);

    return (
      <div className="my-card-preview" style={{ background: coverUrl ? `url(${coverUrl}) center/cover no-repeat` : `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
        {coverUrl && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1 }} />}
        <div className="my-card-preview-inner" style={{ background: coverUrl ? 'transparent' : 'rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div className="my-card-preview-avatar" style={{ color: textColor, borderColor: textIsLight ? 'rgba(255,255,255,0.5)' : 'rgba(28,20,16,0.3)', overflow: 'hidden' }}>
              {profileUrl ? <img src={profileUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.2)', color: textColor }}>
              {card.template}
            </span>
          </div>
          <div style={{ zIndex: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: textColor, textShadow: coverUrl ? '0 1px 4px rgba(0,0,0,0.6)' : 'none' }}>{card.fullName}</div>
            <div style={{ fontSize: 9.5, color: textIsLight ? 'rgba(255,255,255,0.8)' : T.muted, marginTop: 1, textShadow: coverUrl ? '0 1px 4px rgba(0,0,0,0.6)' : 'none' }}>
              {card.jobTitle || 'No title'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.2s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.3s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.4s; opacity: 0; }
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(107,26,42,0.15); }
        .sidebar-link { display: flex; align-items: center; gap: 12px; padding: 10px 20px; color: rgba(255,255,255,0.7); font-size: 13.5px; font-weight: 500; cursor: pointer; border-left: 3px solid transparent; transition: all 0.18s; text-decoration: none; border-radius: 0 6px 6px 0; margin: 1px 0; }
        .sidebar-link:hover { background: rgba(255,255,255,0.08); color: #fff; border-left-color: rgba(201,168,76,0.5); }
        .sidebar-link.active { background: rgba(201,168,76,0.15); color: #fff; border-left-color: ${T.gold}; }
        
        /* Premium Responsive Card Grid System */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 16px;
        }
        .my-card-item {
          background: #fff;
          border-radius: 12px;
          border: 1px solid ${T.border};
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(107,26,42,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .my-card-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(107,26,42,0.12);
        }
        .my-card-preview {
          height: 130px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .my-card-preview-inner {
          width: 170px;
          height: 100px;
          border-radius: 8px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
          position: relative;
          z-index: 2;
        }
        .my-card-preview-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255,255,255,0.22);
          border: 1.5px solid rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
        }
        .my-card-details {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .my-card-title {
          font-size: 15px;
          font-weight: 700;
          color: ${T.ink};
          margin-bottom: 4px;
        }
        .my-card-meta {
          font-size: 11px;
          color: ${T.muted};
          margin-bottom: 2px;
        }
        .my-card-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-top: 14px;
          border-top: 1px solid ${T.border};
          padding-top: 12px;
        }
        .my-card-actions-row2 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-top: 6px;
        }
        .action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 7px 4px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid ${T.border};
          background: #fff;
          color: ${T.muted};
          text-decoration: none;
          transition: all 0.15s;
        }
        .action-btn:hover {
          background: rgba(107,26,42,0.05);
          border-color: ${T.primary};
          color: ${T.primary};
        }
        .action-btn-danger:hover {
          background: #fdecea;
          border-color: #c0392b;
          color: #c0392b;
        }
        .qr-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qr-modal {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          max-width: 380px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }

        @media (max-width: 768px) {
          .dashboard-sidebar { transform: translateX(-100%); }
          .dashboard-sidebar.open { transform: translateX(0); }
          .dashboard-main { margin-left: 0 !important; }
          .dashboard-topbar { left: 0 !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />
      )}

      {/* Sidebar */}
      <nav className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`} style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 260,
        background: `linear-gradient(170deg, ${T.primary} 0%, #3D0B16 100%)`,
        display: 'flex', flexDirection: 'column', zIndex: 1000,
        boxShadow: '4px 0 24px rgba(107,26,42,0.22)', overflowY: 'auto', transition: 'transform 0.3s ease',
      }}>
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, background: T.gold, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: T.primary, fontWeight: 700, flexShrink: 0 }}>
            <i className="fa-solid fa-address-card" />
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: 0.4 }}>CardCraft</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 1.4 }}>My Dashboard</div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '12px 0' }}>
          <div style={{ padding: '14px 20px 4px', fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 1.8, color: 'rgba(255,255,255,0.32)', fontWeight: 600 }}>Main</div>
          <div className={`sidebar-link ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => handleSectionChange('overview')}>
            <i className="fa-solid fa-gauge-high" style={{ width: 18, textAlign: 'center', fontSize: 14 }} /> Overview
          </div>
          <div className={`sidebar-link ${activeSection === 'cards' ? 'active' : ''}`} onClick={() => handleSectionChange('cards')}>
            <i className="fa-solid fa-id-card" style={{ width: 18, textAlign: 'center', fontSize: 14 }} /> My Cards
            <span style={{ marginLeft: 'auto', background: T.gold, color: T.primary, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>{cards.length}</span>
          </div>

          <div style={{ padding: '14px 20px 4px', fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 1.8, color: 'rgba(255,255,255,0.32)', fontWeight: 600 }}>Create</div>
          <Link href="/create-card" className="sidebar-link" style={{ textDecoration: 'none' }}>
            <i className="fa-solid fa-plus" style={{ width: 18, textAlign: 'center', fontSize: 14 }} /> New Card
          </Link>
          <Link href="/email-signatures" className="sidebar-link" style={{ textDecoration: 'none' }}>
            <i className="fa-solid fa-envelope" style={{ width: 18, textAlign: 'center', fontSize: 14 }} /> Email Signature
          </Link>

          <div style={{ padding: '14px 20px 4px', fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 1.8, color: 'rgba(255,255,255,0.32)', fontWeight: 600 }}>Account</div>
          <div className={`sidebar-link ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => handleSectionChange('profile')}>
            <i className="fa-solid fa-circle-user" style={{ width: 18, textAlign: 'center', fontSize: 14 }} /> My Profile
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.10)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${T.gold}, ${T.warm})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#fff', fontWeight: 700, flexShrink: 0 }}>
              {getInitials(user.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)' }}>{user.email}</div>
            </div>
            <i className="fa-solid fa-arrow-right-from-bracket" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer' }} onClick={() => { logout(); router.push('/login'); }} title="Logout" />
          </div>
        </div>
      </nav>

      {/* Top Bar */}
      <header className="dashboard-topbar" style={{
        position: 'fixed', top: 0, left: 260, right: 0, height: 64,
        background: '#fff', borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16,
        zIndex: 999, boxShadow: '0 2px 8px rgba(107,26,42,0.06)',
      }}>
        <button className="mobile-toggle" onClick={() => setSidebarOpen(true)} style={{ display: 'none', width: 38, height: 38, alignItems: 'center', justifyContent: 'center', background: 'none', border: `1.5px solid ${T.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 16, color: T.muted, marginRight: 8 }}>
          <i className="fas fa-bars" />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: T.ink, fontFamily: "'Cormorant Garamond', serif" }}>
            {activeSection === 'overview' ? 'Dashboard' : activeSection === 'cards' ? 'My Cards' : 'My Profile'}
          </h2>
          <p style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>
            Welcome back, {user.name.split(' ')[0]} — manage your digital greeting cards.
          </p>
        </div>
        <Link href="/create-card" style={{
          background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`, color: '#fff', border: 'none',
          padding: '9px 18px', borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 7, textDecoration: 'none',
          transition: 'all 0.2s',
        }}>
          <i className="fas fa-plus" /> Create Card
        </Link>
        <div onClick={() => { logout(); router.push('/login'); }} style={{
          width: 38, height: 38, borderRadius: '50%',
          background: `linear-gradient(135deg, ${T.primary}, ${T.warm})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          border: `2px solid ${T.gold}`,
        }} title="Logout">
          {getInitials(user.name)}
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main" style={{ marginLeft: 260, marginTop: 64, padding: 28, minHeight: 'calc(100vh - 64px)', background: T.ivory }}>
        
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div>
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
              {[
                { icon: 'fa-id-card', label: 'Total Cards', value: cards.length, color: T.primary, bg: 'rgba(107,26,42,0.10)' },
                { icon: 'fa-eye', label: 'Total Views', value: totalViews, color: T.gold, bg: 'rgba(201,168,76,0.15)' },
                { icon: 'fa-calendar-plus', label: 'Latest Card', value: cards[0] ? new Date(cards[0].createdAt).toLocaleDateString() : 'N/A', color: T.warm, bg: 'rgba(184,92,110,0.12)' },
                { icon: 'fa-check-circle', label: 'Published', value: cards.filter(c => c.isPublished).length, color: T.muted, bg: 'rgba(122,104,96,0.12)' },
              ].map((stat, i) => (
                <div key={i} className={`card-hover fade-up fade-up-${i + 1}`} style={{
                  background: '#fff', borderRadius: 10, border: `1px solid ${T.border}`, padding: '22px 24px',
                  boxShadow: '0 2px 12px rgba(107,26,42,0.10)', position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${T.primary}, ${T.warm})` }} />
                  <div style={{ width: 48, height: 48, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14, background: stat.bg, color: stat.color }}>
                    <i className={`fas ${stat.icon}`} />
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 700, color: T.ink, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: 12.5, color: T.muted, marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="fade-up fade-up-2" style={{ background: '#fff', borderRadius: 10, border: `1px solid ${T.border}`, padding: '22px 24px', boxShadow: '0 2px 12px rgba(107,26,42,0.10)', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: T.ink, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-bolt" style={{ color: T.primary }} /> Quick Actions
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <Link href="/create-card" style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
                  background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`, borderRadius: 10,
                  color: '#fff', textDecoration: 'none', transition: 'all 0.2s', fontWeight: 600, fontSize: 14,
                }}>
                  <i className="fas fa-plus-circle" style={{ fontSize: 20 }} />
                  <div>
                    <div>Create New Card</div>
                    <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 400 }}>Design your digital greeting card</div>
                  </div>
                </Link>
                <Link href="/email-signatures" style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
                  background: `linear-gradient(135deg, ${T.gold}, #a88030)`, borderRadius: 10,
                  color: '#fff', textDecoration: 'none', transition: 'all 0.2s', fontWeight: 600, fontSize: 14,
                }}>
                  <i className="fas fa-envelope" style={{ fontSize: 20 }} />
                  <div>
                    <div>Email Signature</div>
                    <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 400 }}>Generate a professional signature</div>
                  </div>
                </Link>
                <Link href="/" style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
                  background: T.paper, border: `1.5px solid ${T.border}`, borderRadius: 10,
                  color: T.ink, textDecoration: 'none', transition: 'all 0.2s', fontWeight: 600, fontSize: 14,
                }}>
                  <i className="fas fa-globe" style={{ fontSize: 20, color: T.warm }} />
                  <div>
                    <div>Visit Landing Page</div>
                    <div style={{ fontSize: 11, color: T.muted, fontWeight: 400 }}>See CardCraft homepage</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Cards */}
            <div className="fade-up fade-up-3" style={{ background: '#fff', borderRadius: 10, border: `1px solid ${T.border}`, padding: '22px 24px', boxShadow: '0 2px 12px rgba(107,26,42,0.10)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: T.ink, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-id-card" style={{ color: T.primary }} /> Recent Cards
                </span>
                {cards.length > 3 && (
                  <button onClick={() => handleSectionChange('cards')} style={{
                    background: 'transparent', color: T.primary, border: `1.5px solid ${T.primary}`,
                    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>
                    View All
                  </button>
                )}
              </div>
              {loadingCards ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 32, height: 32, border: `3px solid ${T.border}`, borderTopColor: T.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                  <p style={{ color: T.muted, fontSize: 13 }}>Loading your cards...</p>
                </div>
              ) : cards.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <i className="fas fa-id-card" style={{ fontSize: 48, color: T.border, marginBottom: 16 }} />
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: T.ink, marginBottom: 8 }}>No cards yet</h3>
                  <p style={{ color: T.muted, fontSize: 13, marginBottom: 20 }}>Create your first digital greeting card to get started!</p>
                  <Link href="/create-card" style={{
                    background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`, color: '#fff',
                    padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}>
                    <i className="fas fa-plus" /> Create Your First Card
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                  {cards.slice(0, 3).map((card) => {
                    const colors = templateColors[card.template] || [T.primary, T.mid];
                    const textIsLight = !['Ivory Elegance'].includes(card.template);
                    return (
                      <div key={card._id} className="card-hover" style={{
                        background: '#fff', borderRadius: 10, border: `1.5px solid ${T.border}`,
                        overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,26,42,0.10)',
                      }}>
                        <div style={{
                          height: 120, background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                        }}>
                          <div style={{
                            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 8, padding: 14, textAlign: 'center', width: 140,
                          }}>
                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: textIsLight ? '#fff' : T.ink }}>
                              {getInitials(card.fullName)}
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: textIsLight ? '#fff' : T.ink }}>{card.fullName}</div>
                            <div style={{ fontSize: 8.5, color: textIsLight ? 'rgba(255,255,255,0.75)' : T.muted, marginTop: 2 }}>{card.jobTitle || 'No title'}</div>
                          </div>
                        </div>
                        <div style={{ padding: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{card.cardName}</div>
                              <div style={{ fontSize: 11.5, color: T.muted, marginTop: 3 }}>{card.template} · {card.views} views</div>
                            </div>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                              background: card.isPublished ? '#e8f5ee' : '#f5e8e8', color: card.isPublished ? '#1a7a3f' : '#c0392b',
                            }}>
                              {card.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <Link href={`/create-card?edit=${card._id}`} style={{
                              flex: 1, padding: 7, fontSize: 12, textAlign: 'center',
                              background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`, color: '#fff',
                              borderRadius: 6, border: 'none', fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                            }}>
                              <i className="fas fa-pen" style={{ fontSize: 10 }} /> Edit
                            </Link>
                            <button onClick={() => setDeleteConfirm(card._id)} style={{
                              width: 30, height: 30, borderRadius: 6, border: `1px solid ${T.border}`,
                              background: '#fff', color: T.muted, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }} title="Delete">
                              <i className="fas fa-trash" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cards Section */}
        {activeSection === 'cards' && (
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: T.primary, marginBottom: 4 }}>My Cards</h1>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>Manage all your digital cards in one place.</p>
            
            <div style={{ background: '#fff', borderRadius: 10, border: `1px solid ${T.border}`, padding: '22px 24px', boxShadow: '0 2px 12px rgba(107,26,42,0.10)' }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>Total Cards: {cards.length}</span>
                <Link href="/create-card" style={{
                  marginLeft: 'auto', background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`, color: '#fff',
                  border: 'none', padding: '9px 18px', borderRadius: 8, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 7, textDecoration: 'none',
                }}>
                  <i className="fas fa-plus" /> Create New Card
                </Link>
              </div>

              {loadingCards ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 32, height: 32, border: `3px solid ${T.border}`, borderTopColor: T.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                  <p style={{ color: T.muted, fontSize: 13 }}>Loading your cards...</p>
                </div>
              ) : cards.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <i className="fas fa-id-card" style={{ fontSize: 48, color: T.border, marginBottom: 16 }} />
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: T.ink }}>No cards yet</h3>
                  <p style={{ color: T.muted, fontSize: 13, marginBottom: 20 }}>Create your first card to get started!</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {cards.map((card) => (
                    <div key={card._id} className="my-card-item">
                      {renderCardPreview(card)}
                      <div className="my-card-details">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                          <span className="my-card-title">{card.cardName}</span>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                            background: card.isPublished ? '#e8f5ee' : '#f5e8e8', color: card.isPublished ? '#1a7a3f' : '#c0392b',
                          }}>
                            {card.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <div className="my-card-meta">
                          <i className="fa-regular fa-calendar-plus" style={{ width: 14 }} /> Created: {new Date(card.createdAt).toLocaleDateString()}
                        </div>
                        <div className="my-card-meta">
                          <i className="fa-regular fa-calendar-check" style={{ width: 14 }} /> Updated: {new Date(card.updatedAt || card.createdAt).toLocaleDateString()}
                        </div>
                        <div className="my-card-meta">
                          <i className="fa-regular fa-eye" style={{ width: 14 }} /> Views: <strong>{card.views}</strong>
                        </div>

                        <div className="my-card-actions">
                          <a href={`/card/${card._id}`} target="_blank" className="action-btn" title="View Card">
                            <i className="fa-solid fa-eye" /> <span>View</span>
                          </a>
                          <Link href={`/create-card?edit=${card._id}`} className="action-btn" title="Edit Card">
                            <i className="fa-solid fa-pen" /> <span>Edit</span>
                          </Link>
                          <button onClick={() => duplicateCardAction(card._id)} className="action-btn" title="Duplicate Card">
                            <i className="fa-solid fa-copy" /> <span>Copy</span>
                          </button>
                          <button onClick={() => shareCard(card._id)} className="action-btn" title="Share Link">
                            <i className="fa-solid fa-share-alt" /> <span>{copiedCardId === card._id ? 'Copied' : 'Share'}</span>
                          </button>
                        </div>
                        
                        <div className="my-card-actions-row2">
                          <button onClick={() => setQrModalCard(card)} className="action-btn" style={{ borderColor: T.gold, color: T.gold }} title="View QR Code">
                            <i className="fa-solid fa-qrcode" /> <span>QR Code</span>
                          </button>
                          <button onClick={() => downloadVCard(card)} className="action-btn" title="Download Contacts (vCard)">
                            <i className="fa-solid fa-download" /> <span>vCard</span>
                          </button>
                          <button onClick={() => setDeleteConfirm(card._id)} className="action-btn action-btn-danger" title="Delete Card">
                            <i className="fa-solid fa-trash" style={{ color: '#c0392b' }} /> <span style={{ color: '#c0392b' }}>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: T.primary, marginBottom: 4 }}>My Profile</h1>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>View your account details.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, maxWidth: 800 }}>
              <div style={{ background: '#fff', borderRadius: 10, border: `1px solid ${T.border}`, padding: '24px', boxShadow: '0 2px 12px rgba(107,26,42,0.10)', textAlign: 'center' }}>
                <div style={{
                  width: 90, height: 90, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${T.primary}, ${T.warm})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 34, color: '#fff', fontWeight: 700,
                  border: `3px solid ${T.gold}`, margin: '0 auto 12px',
                }}>
                  {getInitials(user.name)}
                </div>
                <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: T.ink }}>{user.name}</h4>
                <p style={{ color: T.muted, fontSize: 13 }}>{user.role === 'admin' ? 'Administrator' : 'Member'}</p>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: '#e8f5ee', color: '#1a7a3f', marginTop: 8,
                }}>Active</span>
              </div>
              <div style={{ background: '#fff', borderRadius: 10, border: `1px solid ${T.border}`, padding: '24px', boxShadow: '0 2px 12px rgba(107,26,42,0.10)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
                  <i className="fas fa-user" style={{ color: T.primary }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>Account Details</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    ['Name', user.name],
                    ['Email', user.email],
                    ['Role', user.role],
                    ['User ID', user.userId],
                    ['Total Cards', `${cards.length} cards`],
                    ['Total Views', `${totalViews} views`],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: T.muted, fontWeight: 600, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 14, color: T.ink, fontWeight: 500 }}>{value}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => { logout(); router.push('/login'); }} style={{
                  marginTop: 24, background: 'transparent', color: '#c0392b', border: '1.5px solid #c0392b',
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                }}>
                  <i className="fas fa-sign-out-alt" /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 24, maxWidth: 360, width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fdecea', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22, color: '#c0392b' }}>
              <i className="fas fa-trash" />
            </div>
            <h5 style={{ fontWeight: 700, color: T.ink, marginBottom: 6 }}>Delete Card?</h5>
            <p style={{ fontSize: 13.5, color: T.muted }}>This action cannot be undone. The card will be permanently removed.</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{
                background: 'transparent', color: T.primary, border: `1.5px solid ${T.primary}`,
                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={() => deleteCard(deleteConfirm)} style={{
                background: '#c0392b', color: '#fff', border: 'none',
                padding: '9px 18px', borderRadius: 8, fontWeight: 600, fontSize: 13.5, cursor: 'pointer',
              }}>
                <i className="fas fa-trash" style={{ marginRight: 4 }} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalCard && (
        <div className="qr-modal-overlay" onClick={() => setQrModalCard(null)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: T.primary }}>
                QR Code for {qrModalCard.cardName}
              </h3>
              <button onClick={() => setQrModalCard(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: T.muted }}>
                <i className="fas fa-times" />
              </button>
            </div>
            <div style={{ background: '#fcfcfc', border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, display: 'inline-block', marginBottom: 16 }}>
              <img 
                src={`${API_BASE}/cards/${qrModalCard._id}/qr`} 
                alt="Card QR Code" 
                style={{ width: 220, height: 220, display: 'block' }} 
              />
            </div>
            <p style={{ fontSize: 12.5, color: T.muted, marginBottom: 20 }}>
              Scan the QR code to open this digital greeting card on any mobile device.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button 
                onClick={() => downloadQR(qrModalCard._id, qrModalCard.cardName)} 
                style={{
                  background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`, color: '#fff', border: 'none',
                  padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6
                }}
              >
                <i className="fas fa-download" /> Download QR
              </button>
              <button 
                onClick={() => setQrModalCard(null)} 
                style={{
                  background: 'transparent', color: T.muted, border: `1.5px solid ${T.border}`,
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


