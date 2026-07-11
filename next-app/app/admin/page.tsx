'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Script from 'next/script';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const T = {
  primary: '#6B1A2A', mid: '#8B2535', warm: '#B85C6E',
  ivory: '#FAF7F2', paper: '#F2EDE6', gold: '#C9A84C',
  ink: '#1C1410', muted: '#7A6860', border: '#E2D9D0',
};

const avatarColors = ['#6B1A2A','#8B2535','#B85C6E','#C9A84C','#1a3a6b','#1a3a2a','#7A6860','#3949ab'];
function avatarColor(i: number) { return avatarColors[i % avatarColors.length]; }
function initials(name: string) { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }

function statusBadge(s: string) {
  const m: Record<string, string> = { Active: 'active', Inactive: 'inactive', Suspended: 'suspended', Pending: 'pending' };
  const cls = m[s] || 'muted';
  const styles: Record<string, { bg: string; color: string }> = {
    active: { bg: '#e8f5ee', color: '#1a7a3f' },
    inactive: { bg: '#f5e8e8', color: '#c0392b' },
    suspended: { bg: '#fff3e0', color: '#e65100' },
    pending: { bg: '#e8eaf6', color: '#3949ab' },
    muted: { bg: T.paper, color: T.muted },
  };
  const style = styles[cls] || styles.muted;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: style.bg, color: style.color }}>{s}</span>;
}

// Mock data for sections that don't have backend APIs yet
const mockTemplates = [
  { id: 'TPL-001', name: 'Midnight Pro', category: 'Professional', color: '#1a1a2e', color2: '#16213e', textColor: '#fff', uses: 1240, status: 'Active' },
  { id: 'TPL-002', name: 'Ivory Elegance', category: 'Minimal', color: '#FAF7F2', color2: '#F2EDE6', textColor: '#1C1410', uses: 987, status: 'Active' },
  { id: 'TPL-003', name: 'Scarlet Executive', category: 'Bold', color: '#6B1A2A', color2: '#3D0B16', textColor: '#fff', uses: 834, status: 'Active' },
  { id: 'TPL-004', name: 'Gold Classic', category: 'Professional', color: '#C9A84C', color2: '#8a6500', textColor: '#fff', uses: 721, status: 'Active' },
  { id: 'TPL-005', name: 'Forest Minimal', category: 'Minimal', color: '#1a3a2a', color2: '#0d2018', textColor: '#fff', uses: 614, status: 'Active' },
  { id: 'TPL-006', name: 'Corporate Blue', category: 'Professional', color: '#1a3a6b', color2: '#0d2045', textColor: '#fff', uses: 540, status: 'Active' },
];

const mockActivity = [
  { icon: 'fa-user-plus', bg: 'rgba(107,26,42,0.1)', color: T.primary, text: 'registered a new account', name: 'New User', time: '2 min ago' },
  { icon: 'fa-id-card', bg: 'rgba(201,168,76,0.12)', color: T.gold, text: 'created a new business card', name: 'User', time: '8 min ago' },
  { icon: 'fa-credit-card', bg: 'rgba(184,92,110,0.1)', color: T.warm, text: 'upgraded to Pro plan', name: 'User', time: '23 min ago' },
  { icon: 'fa-qrcode', bg: 'rgba(29,120,64,0.1)', color: '#1d7840', text: 'scanned a QR code 18 times', name: 'User', time: '41 min ago' },
];

interface AdminStats {
  totalUsers: number;
  usersThisMonth: number;
  userGrowth: number;
  activeUsers30d: number;
  totalCards: number;
  cardsThisMonth: number;
  cardGrowth: number;
  totalViews: number;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  userId: string;
  createdAt: string;
  cardCount: number;
}

interface AdminCard {
  _id: string;
  cardName: string;
  fullName: string;
  company: string;
  template: string;
  views: number;
  createdAt: string;
  userId: { name: string; email: string };
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chartsInit, setChartsInit] = useState(false);
  const [chartJsLoaded, setChartJsLoaded] = useState(false);

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [cards, setCards] = useState<AdminCard[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [cardsTotal, setCardsTotal] = useState(0);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (!isLoading && user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Fetch data
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchStats();
      fetchUsers();
      fetchCards();
    }
  }, [isAuthenticated, user]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) setStats(await res.json());
    } catch (err) { console.error('Failed to fetch stats:', err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/users?limit=10`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setUsersTotal(data.total);
      }
    } catch (err) { console.error('Failed to fetch users:', err); }
  };

  const fetchCards = async () => {
    try {
      const res = await fetch(`${API_BASE}/cards/all?limit=10`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCards(data.cards);
        setCardsTotal(data.total);
      }
    } catch (err) { console.error('Failed to fetch cards:', err); }
  };

  // Init charts when Chart.js is loaded and dashboard is active
  const growthChartRef = useRef<HTMLCanvasElement>(null);
  const cardCreationChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartJsLoaded && activeSection === 'dashboard' && !chartsInit) {
      setTimeout(() => {
        initCharts();
        setChartsInit(true);
      }, 100);
    }
  }, [chartJsLoaded, activeSection, chartsInit]);

  const initCharts = () => {
    const Chart = (window as any).Chart;
    if (!Chart) return;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    if (growthChartRef.current) {
      new Chart(growthChartRef.current, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            { label: 'New Users', data: [820, 1040, 1280, 1490, 1840, stats?.usersThisMonth || 0], borderColor: T.primary, backgroundColor: 'rgba(107,26,42,.08)', fill: true, tension: .4, pointRadius: 4, pointBackgroundColor: T.primary },
            { label: 'Active Users', data: [620, 780, 940, 1120, 1380, stats?.activeUsers30d || 0], borderColor: T.gold, backgroundColor: 'rgba(201,168,76,.06)', fill: true, tension: .4, pointRadius: 4, pointBackgroundColor: T.gold },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 12 } } } }, scales: { y: { grid: { color: 'rgba(226,217,208,.5)' } }, x: { grid: { display: false } } } },
      });
    }
    if (cardCreationChartRef.current) {
      new Chart(cardCreationChartRef.current, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [{ label: 'Cards Created', data: [3840, 4120, 5200, 5800, 6400, stats?.cardsThisMonth || 0], backgroundColor: [T.primary, T.mid, T.warm, T.gold, T.primary, T.mid], borderRadius: 6, borderSkipped: false }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(226,217,208,.5)' } }, x: { grid: { display: false } } } },
      });
    }
  };

  const pageTitles: Record<string, [string, string]> = {
    dashboard: ['Dashboard', "Welcome back, Admin — here's what's happening today."],
    users: ['User Management', 'View and manage all registered platform users.'],
    cards: ['Business Cards', 'All digital cards created on CardCraft.'],
    templates: ['Template Management', 'Manage card templates available to platform users.'],
    settings: ['Settings', 'Platform configuration and integrations.'],
    profile: ['Admin Profile', 'Manage your personal information and account security.'],
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: T.ivory }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${T.border}`, borderTopColor: T.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: T.muted, fontSize: 14, fontWeight: 500 }}>Loading admin panel...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'admin') return null;

  const [title, subtitle] = pageTitles[activeSection] || ['Dashboard', ''];

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js" onLoad={() => setChartJsLoaded(true)} />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: ${T.ivory}; color: ${T.ink}; min-height: 100vh; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .stat-card { background: #fff; border-radius: 10px; border: 1px solid ${T.border}; padding: 22px 24px; box-shadow: 0 2px 12px rgba(107,26,42,.10); transition: transform .2s, box-shadow .2s; position: relative; overflow: hidden; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(107,26,42,.14); }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, ${T.primary}, ${T.warm}); }
        .panel { background: #fff; border-radius: 10px; border: 1px solid ${T.border}; padding: 22px 24px; box-shadow: 0 2px 12px rgba(107,26,42,.10); margin-bottom: 24px; }
        .panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid ${T.border}; }
        .panel-title { font-size: 15px; font-weight: 700; color: ${T.ink}; display: flex; align-items: center; gap: 8px; }
        .panel-title i { color: ${T.primary}; }
        .custom-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .custom-table thead th { background: ${T.paper}; color: ${T.muted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; padding: 10px 14px; border-bottom: 2px solid ${T.border}; white-space: nowrap; }
        .custom-table tbody td { padding: 12px 14px; border-bottom: 1px solid ${T.border}; vertical-align: middle; }
        .custom-table tbody tr:hover { background: ${T.ivory}; }
        .avatar-cell { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; }
        .nav-link-item { display: flex; align-items: center; gap: 12px; padding: 10px 20px; color: rgba(255,255,255,.72); font-size: 13.5px; font-weight: 500; cursor: pointer; border-left: 3px solid transparent; transition: all .18s; text-decoration: none; border-radius: 0 6px 6px 0; margin: 1px 0; }
        .nav-link-item i { width: 18px; text-align: center; font-size: 14px; }
        .nav-link-item:hover { background: rgba(255,255,255,.08); color: #fff; border-left-color: rgba(201,168,76,.5); }
        .nav-link-item.active { background: rgba(201,168,76,.15); color: #fff; border-left-color: ${T.gold}; }
        .badge-count { margin-left: auto; background: ${T.gold}; color: ${T.primary}; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 10px; }
        .revenue-highlight { background: linear-gradient(135deg, ${T.primary} 0%, #3D0B16 100%); border-radius: 10px; padding: 28px; color: #fff; position: relative; overflow: hidden; }
        .template-card { background: #fff; border-radius: 10px; border: 1.5px solid ${T.border}; overflow: hidden; box-shadow: 0 2px 12px rgba(107,26,42,.10); transition: all .2s; }
        .template-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(107,26,42,.14); border-color: ${T.warm}; }
        .btn-primary-custom { background: linear-gradient(135deg, ${T.primary}, ${T.mid}); color: #fff; border: none; padding: 9px 18px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: all .2s; display: inline-flex; align-items: center; gap: 7px; }
        .btn-primary-custom:hover { box-shadow: 0 4px 14px rgba(107,26,42,.3); transform: translateY(-1px); }
        .btn-outline-custom { background: transparent; color: ${T.primary}; border: 1.5px solid ${T.primary}; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s; display: inline-flex; align-items: center; gap: 7px; }
        .btn-outline-custom:hover { background: ${T.primary}; color: #fff; }
        .action-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid ${T.border}; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; transition: all .15s; background: #fff; color: ${T.muted}; text-decoration: none; }
        .filter-input { padding: 8px 14px; border: 1.5px solid ${T.border}; border-radius: 8px; font-size: 13px; color: ${T.ink}; background: ${T.ivory}; outline: none; transition: border-color .2s; flex: 1; min-width: 180px; }
        .filter-input:focus { border-color: ${T.warm}; }
        @media (max-width: 992px) {
          #admin-sidebar { transform: translateX(-100%); }
          #admin-sidebar.open { transform: translateX(0); }
          #admin-topbar, #admin-main { margin-left: 0 !important; left: 0 !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>

      {/* Sidebar overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />}

      {/* Sidebar */}
      <nav id="admin-sidebar" className={sidebarOpen ? 'open' : ''} style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 260,
        background: `linear-gradient(170deg, ${T.primary} 0%, #3D0B16 100%)`,
        display: 'flex', flexDirection: 'column', zIndex: 1000,
        boxShadow: '4px 0 24px rgba(107,26,42,.22)', overflowY: 'auto', transition: 'transform .3s ease',
      }}>
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,.10)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, background: T.gold, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: T.primary, fontWeight: 700 }}>
            <i className="fa-solid fa-address-card" />
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: .4 }}>CardCraft</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: 1.4 }}>Admin Console</div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '12px 0' }}>
          <div style={{ padding: '14px 20px 4px', fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 1.8, color: 'rgba(255,255,255,.32)', fontWeight: 600 }}>Main</div>
          {[
            { id: 'dashboard', icon: 'fa-gauge-high', label: 'Dashboard' },
            { id: 'users', icon: 'fa-users', label: 'Users', badge: usersTotal || '' },
            { id: 'cards', icon: 'fa-id-card', label: 'Business Cards', badge: cardsTotal || '' },
            { id: 'templates', icon: 'fa-layer-group', label: 'Templates' },
          ].map(item => (
            <div key={item.id} className={`nav-link-item ${activeSection === item.id ? 'active' : ''}`} onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}>
              <i className={`fa-solid ${item.icon}`} /> {item.label}
              {item.badge && <span className="badge-count">{item.badge}</span>}
            </div>
          ))}

          <div style={{ padding: '14px 20px 4px', fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 1.8, color: 'rgba(255,255,255,.32)', fontWeight: 600 }}>Config</div>
          {[
            { id: 'settings', icon: 'fa-gear', label: 'Settings' },
            { id: 'profile', icon: 'fa-circle-user', label: 'Admin Profile' },
          ].map(item => (
            <div key={item.id} className={`nav-link-item ${activeSection === item.id ? 'active' : ''}`} onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}>
              <i className={`fa-solid ${item.icon}`} /> {item.label}
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,.10)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${T.gold}, ${T.warm})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#fff', fontWeight: 700 }}>
              {initials(user.name)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff' }}>{user.name}</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.45)' }}>Administrator</div>
            </div>
            <i className="fa-solid fa-arrow-right-from-bracket" style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, cursor: 'pointer' }} onClick={() => { logout(); router.push('/'); }} />
          </div>
        </div>
      </nav>

      {/* Top Bar */}
      <header id="admin-topbar" style={{
        position: 'fixed', top: 0, left: 260, right: 0, height: 64,
        background: '#fff', borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16,
        zIndex: 999, boxShadow: '0 2px 8px rgba(107,26,42,.06)',
      }}>
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} style={{ display: 'none', width: 38, height: 38, alignItems: 'center', justifyContent: 'center', background: 'none', border: `1.5px solid ${T.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 16, color: T.muted }}>
          <i className="fas fa-bars" />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: T.ink, fontFamily: "'Cormorant Garamond', serif" }}>{title}</h2>
          <p style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>{subtitle}</p>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg, ${T.primary}, ${T.warm})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', border: `2px solid ${T.gold}` }} onClick={() => setActiveSection('profile')}>
          {initials(user.name)}
        </div>
      </header>

      {/* Main Content */}
      <main id="admin-main" style={{ marginLeft: 260, marginTop: 64, padding: 28, minHeight: 'calc(100vh - 64px)' }}>

        {/* === DASHBOARD === */}
        {activeSection === 'dashboard' && (
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: T.primary, marginBottom: 4 }}>Platform Overview</h1>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>Live statistics and performance metrics for CardCraft.</p>

            <div className="row g-3 mb-4">
              {[
                { icon: 'fa-users', label: 'Total Users', value: stats?.totalUsers || 0, delta: `${stats?.userGrowth || 0}% vs last month`, up: (stats?.userGrowth || 0) >= 0, iconClass: 'burgundy' },
                { icon: 'fa-id-card', label: 'Total Business Cards', value: stats?.totalCards || 0, delta: `${stats?.cardGrowth || 0}% vs last month`, up: (stats?.cardGrowth || 0) >= 0, iconClass: 'gold' },
                { icon: 'fa-circle-check', label: 'Active Users (30d)', value: stats?.activeUsers30d || 0, delta: 'Last 30 days', up: true, iconClass: 'warm' },
                { icon: 'fa-calendar-plus', label: 'Cards This Month', value: stats?.cardsThisMonth || 0, delta: `${stats?.totalViews || 0} total views`, up: true, iconClass: 'muted' },
              ].map((stat, i) => {
                const iconStyles: Record<string, { bg: string; color: string }> = {
                  burgundy: { bg: 'rgba(107,26,42,.10)', color: T.primary },
                  gold: { bg: 'rgba(201,168,76,.15)', color: T.gold },
                  warm: { bg: 'rgba(184,92,110,.12)', color: T.warm },
                  muted: { bg: 'rgba(122,104,96,.12)', color: T.muted },
                };
                const is = iconStyles[stat.iconClass];
                return (
                  <div key={i} className="col-xl-3 col-md-6">
                    <div className="stat-card">
                      <div style={{ width: 48, height: 48, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14, background: is.bg, color: is.color }}>
                        <i className={`fas ${stat.icon}`} />
                      </div>
                      <div style={{ fontSize: 30, fontWeight: 700, color: T.ink, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</div>
                      <div style={{ fontSize: 12.5, color: T.muted, marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 8, color: stat.up ? '#2d7d46' : '#c0392b' }}>
                        <i className={`fas fa-arrow-${stat.up ? 'up' : 'down'} fa-xs`} /> {stat.delta}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts */}
            <div className="row g-3 mb-4">
              <div className="col-xl-4 col-md-6">
                <div className="revenue-highlight" style={{ height: '100%' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 }}>Platform Summary</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 700 }}>{stats?.totalCards || 0}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', marginTop: 4 }}>Total Cards Created</div>
                  <hr style={{ borderColor: 'rgba(255,255,255,.15)', margin: '16px 0' }} />
                  <div className="row g-2 text-center">
                    <div className="col-4">
                      <div style={{ fontSize: 17, fontWeight: 700 }}>{stats?.totalUsers || 0}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>Users</div>
                    </div>
                    <div className="col-4">
                      <div style={{ fontSize: 17, fontWeight: 700 }}>{stats?.activeUsers30d || 0}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>Active</div>
                    </div>
                    <div className="col-4">
                      <div style={{ fontSize: 17, fontWeight: 700 }}>{stats?.totalViews || 0}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)' }}>Views</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8 col-md-6">
                <div className="panel mb-0" style={{ height: '100%' }}>
                  <div className="panel-header">
                    <span className="panel-title"><i className="fas fa-chart-area" /> User Growth</span>
                  </div>
                  <div style={{ position: 'relative', height: 240 }}>
                    <canvas ref={growthChartRef} />
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-xl-6">
                <div className="panel mb-0">
                  <div className="panel-header">
                    <span className="panel-title"><i className="fas fa-chart-bar" /> Card Creations</span>
                  </div>
                  <div style={{ position: 'relative', height: 240 }}>
                    <canvas ref={cardCreationChartRef} />
                  </div>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="panel mb-0">
                  <div className="panel-header">
                    <span className="panel-title"><i className="fas fa-bolt" /> Recent Activity</span>
                    <span style={{ fontSize: 12, color: T.muted }}>Today</span>
                  </div>
                  {mockActivity.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < mockActivity.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, background: a.bg }}>
                        <i className={`fas ${a.icon}`} style={{ color: a.color }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.5 }}><strong>{a.name}</strong> {a.text}</div>
                        <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === USERS === */}
        {activeSection === 'users' && (
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: T.primary, marginBottom: 4 }}>User Management</h1>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>View and manage all registered users.</p>
            <div className="panel">
              <div style={{ overflowX: 'auto' }}>
                <table className="custom-table">
                  <thead><tr>
                    <th>User</th><th>Email</th><th>Role</th><th>Cards</th><th>Registered</th><th>User ID</th>
                  </tr></thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: T.muted }}>No users found</td></tr>
                    ) : users.map((u, i) => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="avatar-cell" style={{ background: avatarColor(i) }}>{initials(u.name)}</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{u.name}</div>
                              <div style={{ fontSize: 11, color: T.muted }}>{u.cardCount} cards</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 13 }}>{u.email}</td>
                        <td>{statusBadge(u.role === 'admin' ? 'Active' : 'Active')}<span style={{ marginLeft: 6, fontSize: 11, color: T.muted }}>{u.role}</span></td>
                        <td style={{ fontWeight: 700 }}>{u.cardCount}</td>
                        <td style={{ fontSize: 13, color: T.muted }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={{ fontSize: 11.5, color: T.muted }}>{u.userId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 13, color: T.muted }}>
                <span>Showing {users.length} of {usersTotal} users</span>
              </div>
            </div>
          </div>
        )}

        {/* === CARDS === */}
        {activeSection === 'cards' && (
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: T.primary, marginBottom: 4 }}>Business Card Management</h1>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>Browse and manage all digital cards created on the platform.</p>
            <div className="panel">
              <div style={{ overflowX: 'auto' }}>
                <table className="custom-table">
                  <thead><tr>
                    <th>Card Owner</th><th>Card Name</th><th>Company</th><th>Template</th><th>Views</th><th>Created</th>
                  </tr></thead>
                  <tbody>
                    {cards.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: T.muted }}>No cards found</td></tr>
                    ) : cards.map((c, i) => (
                      <tr key={c._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="avatar-cell" style={{ background: avatarColor(i) }}>{initials(c.fullName)}</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.fullName}</div>
                              <div style={{ fontSize: 11, color: T.muted }}>{c.userId?.email || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 13 }}>{c.cardName}</td>
                        <td style={{ fontSize: 13, color: T.muted }}>{c.company || '—'}</td>
                        <td style={{ fontSize: 13 }}>{c.template}</td>
                        <td><strong>{c.views.toLocaleString()}</strong></td>
                        <td style={{ fontSize: 13, color: T.muted }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 13, color: T.muted }}>
                <span>Showing {cards.length} of {cardsTotal} cards</span>
              </div>
            </div>
          </div>
        )}

        {/* === TEMPLATES === */}
        {activeSection === 'templates' && (
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: T.primary, marginBottom: 4 }}>Template Management</h1>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>Manage card templates available to platform users.</p>
            <div className="row g-3">
              {mockTemplates.map((t) => (
                <div key={t.id} className="col-xl-3 col-md-4 col-sm-6">
                  <div className="template-card">
                    <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${t.color}, ${t.color2})` }}>
                      <div style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', width: 140, padding: 14, borderRadius: 8, textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,.15)' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,.3)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: t.textColor }}>JD</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: t.textColor }}>John Doe</div>
                        <div style={{ fontSize: 8.5, color: `${t.textColor}99`, marginTop: 2 }}>Product Manager</div>
                        <div style={{ height: 1, background: 'rgba(255,255,255,.3)', margin: '8px 0' }} />
                        <div style={{ fontSize: 8, color: `${t.textColor}99` }}>john@company.co</div>
                      </div>
                    </div>
                    <div style={{ padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{t.name}</div>
                          <div style={{ fontSize: 11.5, color: T.muted, marginTop: 3 }}>{t.category} · {t.uses.toLocaleString()} uses</div>
                        </div>
                        {statusBadge(t.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === SETTINGS === */}
        {activeSection === 'settings' && (
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: T.primary, marginBottom: 4 }}>Platform Settings</h1>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>Configure your CardCraft platform preferences.</p>
            <div className="panel">
              <div style={{ fontSize: 12, fontWeight: 600, color: T.muted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14 }}>
                <i className="fas fa-globe" style={{ marginRight: 8 }} />General
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 6, display: 'block' }}>Website Name</label>
                  <input className="filter-input" defaultValue="CardCraft" style={{ width: '100%' }} />
                </div>
                <div className="col-md-6">
                  <label style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 6, display: 'block' }}>Support Email</label>
                  <input className="filter-input" defaultValue="support@cardcraft.io" style={{ width: '100%' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button className="btn-primary-custom"><i className="fas fa-save" /> Save Settings</button>
                <button className="btn-outline-custom">Reset to Default</button>
              </div>
            </div>
          </div>
        )}

        {/* === PROFILE === */}
        {activeSection === 'profile' && (
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: T.primary, marginBottom: 4 }}>Admin Profile</h1>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>Manage your personal information and account security.</p>
            <div className="row g-3">
              <div className="col-xl-4">
                <div className="panel text-center">
                  <div style={{ width: 90, height: 90, borderRadius: '50%', background: `linear-gradient(135deg, ${T.primary}, ${T.warm})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, color: '#fff', fontWeight: 700, border: `3px solid ${T.gold}`, margin: '0 auto 12px' }}>
                    {initials(user.name)}
                  </div>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: T.ink }}>{user.name}</h4>
                  <p style={{ color: T.muted, fontSize: 13 }}>Platform Administrator</p>
                  {statusBadge('Active')}
                  <div style={{ background: T.paper, borderRadius: 8, padding: 14, textAlign: 'left', marginTop: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13 }}>
                      <i className="fas fa-envelope" style={{ color: T.primary, width: 16 }} /> {user.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <i className="fas fa-shield-halved" style={{ color: T.primary, width: 16 }} /> {user.role}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8">
                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title"><i className="fas fa-user-pen" /> Account Info</span>
                  </div>
                  <div className="row g-3">
                    {[
                      ['Name', user.name],
                      ['Email', user.email],
                      ['Role', user.role],
                      ['User ID', user.userId],
                    ].map(([label, value]) => (
                      <div key={label} className="col-md-6">
                        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: T.muted, fontWeight: 600, marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 14, color: T.ink, fontWeight: 500 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { logout(); router.push('/'); }} className="btn-outline-custom" style={{ marginTop: 24, color: '#c0392b', borderColor: '#c0392b' }}>
                    <i className="fas fa-sign-out-alt" /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </>
  );
}
