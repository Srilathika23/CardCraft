'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/app/context/AuthContext';
import QRCode from 'qrcode';
import './create-card.css';

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

// ── ICONS SVGS ──
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
  hash: <path d="M8 3.5L6 16.5M14 3.5l-2 13M3.5 8h13M2.7 12.8h13" strokeLinecap="round" />,
  chat: <path d="M3.5 9.6a6.3 6.3 0 1110.9 4.3l.7 2.9-3.1-.8a6.3 6.3 0 01-8.5-6.4z" strokeLinecap="round" strokeLinejoin="round" />,
  code: <path d="M7 6.5L3.5 10 7 13.5M13 6.5L16.5 10 13 13.5" strokeLinecap="round" strokeLinejoin="round" />,
  calendar: (
    <>
      <rect x="3.5" y="4.5" width="13" height="12" rx="1.6" />
      <path d="M3.5 8.3h13M7 3v3M13 3v3" strokeLinecap="round" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5.5" width="14" height="9.5" rx="1.6" />
      <path d="M3 8.5h14" strokeLinecap="round" />
    </>
  ),
  plus: <path d="M10 4.5v11M4.5 10h11" strokeLinecap="round" />,
  trash: <path d="M4 6h12M8 6V4.5A1.5 1.5 0 019.5 3h1A1.5 1.5 0 0112 4.5V6m-6.5 0l.6 9a1.5 1.5 0 001.5 1.4h3.8a1.5 1.5 0 001.5-1.4l.6-9" strokeLinecap="round" strokeLinejoin="round" />,
  pencil: <path d="M12.6 3.9l3.5 3.5L6.3 17.2l-4 .6.6-4z" strokeLinecap="round" strokeLinejoin="round" />,
  check: <path d="M4.5 10.3l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />,
  alert: (
    <>
      <circle cx="10" cy="10" r="7.2" />
      <path d="M10 6.5v4.2M10 13.4v.1" strokeLinecap="round" />
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
  qrcode: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h2v2h-2zM18 14h3M18 18v3M14 18h3M14 21h2" strokeLinecap="round" />
      <path d="M5 5h3v3H5zM16 5h3v3h-3zM5 16h3v3H5z" fill="currentColor" opacity=".4" />
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

// ── TYPES & DATA ──
interface FieldConfig {
  key: string;
  label: string;
  icon: string;
  modal: 'text' | 'phone';
  placeholder?: string;
  suggestions?: string[];
  isName?: boolean;
}

interface FieldGroup {
  group: string;
  fields: FieldConfig[];
}

const FIELD_CATALOG: FieldGroup[] = [
  {
    group: 'Personal',
    fields: [
      { key: 'jobTitle', label: 'Job title', icon: 'briefcase', modal: 'text', placeholder: 'e.g. Product Designer' },
      { key: 'department', label: 'Department', icon: 'users', modal: 'text', placeholder: 'e.g. Marketing' },
      { key: 'companyName', label: 'Company name', icon: 'building', modal: 'text', placeholder: 'e.g. Acme Inc.' },
      { key: 'accreditations', label: 'Accreditations', icon: 'award', modal: 'text', placeholder: 'e.g. CPA, PMP' },
      { key: 'headline', label: 'Headline', icon: 'align', modal: 'text', placeholder: 'A short bio line' },
    ],
  },
  {
    group: 'General',
    fields: [
      { key: 'email', label: 'Email', icon: 'mail', modal: 'text', placeholder: 'name@company.com', suggestions: ['Work', 'Personal'] },
      { key: 'phone', label: 'Phone', icon: 'phone', modal: 'phone' },
      { key: 'companyUrl', label: 'Website', icon: 'globe', modal: 'text', placeholder: 'https://' },
      { key: 'link', label: 'Link', icon: 'link', modal: 'text', placeholder: 'https://', suggestions: ['Portfolio', 'Resume', 'Booking'] },
      { key: 'address', label: 'Address', icon: 'pin', modal: 'text', placeholder: 'City, country', suggestions: ['Home', 'Office'] },
    ],
  },
  {
    group: 'Social',
    fields: [
      { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin', modal: 'text', placeholder: 'Profile URL' },
      { key: 'instagram', label: 'Instagram', icon: 'instagram', modal: 'text', placeholder: '@username' },
      { key: 'x', label: 'X (Twitter)', icon: 'x', modal: 'text', placeholder: '@username' },
      { key: 'facebook', label: 'Facebook', icon: 'facebook', modal: 'text', placeholder: 'Profile URL' },
      { key: 'youtube', label: 'YouTube', icon: 'youtube', modal: 'text', placeholder: 'Channel URL' },
      { key: 'tiktok', label: 'TikTok', icon: 'tiktok', modal: 'text', placeholder: '@username' },
    ],
  },
  {
    group: 'Messaging',
    fields: [
      { key: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', modal: 'text', placeholder: 'Phone number' },
      { key: 'telegram', label: 'Telegram', icon: 'telegram', modal: 'text', placeholder: '@username' },
      { key: 'discord', label: 'Discord', icon: 'discord', modal: 'text', placeholder: 'Username' },
      { key: 'skype', label: 'Skype', icon: 'skype', modal: 'text', placeholder: 'Username' },
      { key: 'signal', label: 'Signal', icon: 'signal', modal: 'text', placeholder: 'Phone number' },
    ],
  },
];

interface AccordionItem {
  key: string;
  label: string;
  icon: string;
  modal: 'text' | 'phone';
  isName?: boolean;
}

const ACCORDION_GROUPS: Record<string, AccordionItem[]> = {
  basic: [
    { key: 'name', label: 'Full Name', icon: 'user', isName: true, modal: 'text' },
    { key: 'jobTitle', label: 'Job Title', icon: 'briefcase', modal: 'text' },
    { key: 'companyName', label: 'Company', icon: 'building', modal: 'text' },
    { key: 'department', label: 'Department', icon: 'users', modal: 'text' },
    { key: 'accreditations', label: 'Accreditations', icon: 'award', modal: 'text' },
    { key: 'headline', label: 'Headline', icon: 'align', modal: 'text' },
  ],
  contact: [
    { key: 'email', label: 'Email', icon: 'mail', modal: 'text' },
    { key: 'phone', label: 'Phone', icon: 'phone', modal: 'phone' },
    { key: 'companyUrl', label: 'Website', icon: 'globe', modal: 'text' },
    { key: 'address', label: 'Address', icon: 'pin', modal: 'text' },
    { key: 'link', label: 'Link', icon: 'link', modal: 'text' },
  ],
  social: [
    { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin', modal: 'text' },
    { key: 'instagram', label: 'Instagram', icon: 'instagram', modal: 'text' },
    { key: 'x', label: 'X (Twitter)', icon: 'x', modal: 'text' },
    { key: 'facebook', label: 'Facebook', icon: 'facebook', modal: 'text' },
    { key: 'youtube', label: 'YouTube', icon: 'youtube', modal: 'text' },
    { key: 'tiktok', label: 'TikTok', icon: 'tiktok', modal: 'text' },
  ],
  messaging: [
    { key: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', modal: 'text' },
    { key: 'telegram', label: 'Telegram', icon: 'telegram', modal: 'text' },
    { key: 'discord', label: 'Discord', icon: 'discord', modal: 'text' },
    { key: 'skype', label: 'Skype', icon: 'skype', modal: 'text' },
    { key: 'signal', label: 'Signal', icon: 'signal', modal: 'text' },
  ]
};

const BRAND_SWATCHES = ['#FF4D4D', '#FF7B30', '#FFD500', '#4CD964', '#05C3A6', '#1E88E5', '#7E57C2', '#EC407A', '#212121'];

const POPULAR_GRADIENTS = [
  { id: 'coral', name: 'Coral', gradient: 'linear-gradient(150deg, #ff7b63 0%, #f86d95 100%)', start: '#ff7b63', end: '#f86d95', accent: '#FF4D4D' },
  { id: 'sunset', name: 'Sunset', gradient: 'linear-gradient(150deg, #FFB03A 0%, #EC407A 100%)', start: '#FFB03A', end: '#EC407A', accent: '#EC407A' },
  { id: 'ocean', name: 'Ocean', gradient: 'linear-gradient(150deg, #00C6FF 0%, #0072FF 100%)', start: '#00C6FF', end: '#0072FF', accent: '#0072FF' },
  { id: 'purple', name: 'Purple', gradient: 'linear-gradient(150deg, #7F00FF 0%, #E100FF 100%)', start: '#7F00FF', end: '#E100FF', accent: '#7F00FF' },
  { id: 'neon', name: 'Neon', gradient: 'linear-gradient(150deg, #00F2FE 0%, #FF007F 100%)', start: '#00F2FE', end: '#FF007F', accent: '#00F2FE' },
  { id: 'dark', name: 'Dark', gradient: 'linear-gradient(150deg, #1A1B2F 0%, #16120E 100%)', start: '#1A1B2F', end: '#16120E', accent: '#212121' },
];

const STYLE_TEMPLATES = [
  { id: 'coral-sunset', name: 'Coral Sunset', gradientId: 'coral', accent: '#FF4D4D' },
  { id: 'ocean-blue', name: 'Ocean Blue', gradientId: 'ocean', accent: '#0072FF' },
  { id: 'royal-purple', name: 'Royal Purple', gradientId: 'purple', accent: '#7F00FF' },
  { id: 'emerald-green', name: 'Emerald Green', gradient: 'linear-gradient(150deg, #11998e 0%, #38ef7d 100%)', start: '#11998e', end: '#38ef7d', accent: '#11998e' },
  { id: 'midnight-black', name: 'Midnight Black', gradientId: 'dark', accent: '#212121' },
  { id: 'golden-orange', name: 'Golden Orange', gradient: 'linear-gradient(150deg, #F2994A 0%, #F2C94C 100%)', start: '#F2994A', end: '#F2C94C', accent: '#F2994A' },
];

const QUICK_ADD_FIELDS = [
  { key: 'email', label: 'Email', icon: 'mail' },
  { key: 'phone', label: 'Phone', icon: 'phone' },
  { key: 'companyUrl', label: 'Website', icon: 'globe' },
  { key: 'address', label: 'Location', icon: 'pin' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp' },
];

// Helper to resolve a field config by key
const getFieldConfig = (key: string): FieldConfig | undefined => {
  for (const group of FIELD_CATALOG) {
    const found = group.fields.find((f) => f.key === key);
    if (found) return found;
  }
  // Check basic accordion custom items
  const bFound = ACCORDION_GROUPS.basic.find((f) => f.key === key);
  if (bFound) return bFound;
  
  return undefined;
};

// Default cover swirl background
const DEFAULT_COVER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 155"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffb09a"/><stop offset="40%" stop-color="#f07070"/><stop offset="100%" stop-color="#f090a0"/></linearGradient></defs><rect fill="url(#g)" width="400" height="155"/><path d="M-40 100 Q80 30 200 90 T440 60" stroke="rgba(255,255,255,.16)" stroke-width="36" fill="none" stroke-linecap="round"/><path d="M-40 130 Q100 60 240 110 T460 85" stroke="rgba(255,255,255,.09)" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M60 -10 Q130 60 90 130 T110 170" stroke="rgba(255,200,180,.13)" stroke-width="40" fill="none" stroke-linecap="round"/></svg>`;
const DEFAULT_COVER_URL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(DEFAULT_COVER_SVG);

// Default logo horizontal layout svg
const DEFAULT_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 52"><text x="2" y="42" font-family="Georgia,serif" font-weight="900" font-size="48" fill="#FF6B6B">CC</text><text x="108" y="38" font-family="Georgia,serif" font-weight="700" font-size="24" fill="#1a1510">CardCraft</text></svg>`;
const DEFAULT_LOGO_URL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(DEFAULT_LOGO_SVG);

const VISUAL_STYLE_PRESETS: Record<string, any> = {
  "modern-profile": {
    brandColor: "#7C6FF0", gradStart: "#7C6FF0", gradEnd: "#A78BFA",
    profileShape: "circle", profileBorder: "white", coverRatio: "16-9", profilePosition: "overlap",
    logoPosition: "hidden", cardTemplate: "modern", typography: "DM Sans", cardRadius: 20,
    buttonStyle: "solid", backgroundEffect: "gradient", cardTheme: "light"
  },
  "corporate-minimal": {
    brandColor: "#1F2937", gradStart: "#1F2937", gradEnd: "#1F2937",
    profileShape: "rounded-square", profileBorder: "none", coverRatio: "16-9", profilePosition: "top-left",
    logoPosition: "top-right", cardTemplate: "executive", typography: "Manrope", cardRadius: 8,
    buttonStyle: "outline", backgroundEffect: "solid", cardTheme: "light"
  },
  "creative-portfolio": {
    brandColor: "#F97316", gradStart: "#F97316", gradEnd: "#FBBF24",
    profileShape: "circle", profileBorder: "white", coverRatio: "21-9", profilePosition: "top-right",
    logoPosition: "top-left", cardTemplate: "creative", typography: "Poppins", cardRadius: 24,
    buttonStyle: "glass", backgroundEffect: "gradient", cardTheme: "light"
  },
  "glassmorphism": {
    brandColor: "#14B8A6", gradStart: "#14B8A6", gradEnd: "#34D399",
    profileShape: "circle", profileBorder: "glow", coverRatio: "16-9", profilePosition: "overlap",
    logoPosition: "top-right", cardTemplate: "modern", typography: "Plus Jakarta Sans", cardRadius: 24,
    buttonStyle: "glass", backgroundEffect: "glass-blur", cardTheme: "light"
  },
  "premium-dark": {
    brandColor: "#D4AF37", gradStart: "#D4AF37", gradEnd: "#F4D03F",
    profileShape: "circle", profileBorder: "premium-ring", coverRatio: "4-3", profilePosition: "top-left",
    logoPosition: "top-right", cardTemplate: "luxury", typography: "Playfair Display", cardRadius: 10,
    buttonStyle: "dark", backgroundEffect: "premium-luxury", cardTheme: "dark"
  },
  "social-creator": {
    brandColor: "#EC4899", gradStart: "#EC4899", gradEnd: "#F472B6",
    profileShape: "circle", profileBorder: "white", coverRatio: "1-1", profilePosition: "overlap",
    logoPosition: "top-left", cardTemplate: "creative", typography: "Poppins", cardRadius: 28,
    buttonStyle: "gradient", backgroundEffect: "gradient", cardTheme: "light"
  }
};

const AI_PRESETS = [
  {
    id: 'designer',
    title: 'Designer Kit',
    badge: 'Creative',
    tags: ['Rounded Photo', 'Soft Gradient', 'Glassmorphic', 'Creative Font'],
    values: { profileShape: "rounded-square", coverRatio: "21-9", cardTemplate: "creative", typography: "Poppins", cardRadius: 24, buttonStyle: "glass", backgroundEffect: "gradient" }
  },
  {
    id: 'business',
    title: 'Business Elite',
    badge: 'Corporate',
    tags: ['Circle Photo', 'Executive Layout', 'Clean Light', 'Solid White'],
    values: { profileShape: "circle", coverRatio: "16-9", cardTemplate: "executive", typography: "Manrope", cardRadius: 8, buttonStyle: "solid", backgroundEffect: "solid", cardTheme: "light" }
  }
];

function hexToHue(hex: string): number {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return Math.round(h * 60);
}

export default function CreateCardPage() {
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [isFlipped, setIsFlipped] = useState(false);
  const [applyInstantly, setApplyInstantly] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showAuthGate, setShowAuthGate] = useState(false);

  // Customization Settings
  const [customization, setCustomization] = useState({
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
    }
  });

  const [activePreset, setActivePreset] = useState<string>('modern-profile');
  const [isStyleStudioOpen, setIsStyleStudioOpen] = useState(false);
  const [activeStyleGroup, setActiveStyleGroup] = useState<string | null>(null);
  const [activeAccordionItem, setActiveAccordionItem] = useState<string | null>(null);

  // Brand Accents
  const [brandColor, setBrandColor] = useState('#FF4D4D');
  const [activeGradientId, setActiveGradientId] = useState<string>('coral');
  const [activeTemplateId, setActiveTemplateId] = useState<string>('coral-sunset');
  const [gradientStart, setGradientStart] = useState('#ff7b63');
  const [gradientEnd, setGradientEnd] = useState('#f86d95');

  // Pending State if applyInstantly is unchecked
  const [pendingBrandColor, setPendingBrandColor] = useState('#FF4D4D');
  const [pendingGradientId, setPendingGradientId] = useState('coral');
  const [pendingTemplateId, setPendingTemplateId] = useState('coral-sunset');
  const [pendingStart, setPendingStart] = useState('#ff7b63');
  const [pendingEnd, setPendingEnd] = useState('#f86d95');

  // Input states
  const [firstName, setFirstName] = useState('Davis');
  const [lastName, setLastName] = useState('Gouse');

  // Image assets
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_LOGO_URL);
  const [profileUrl, setProfileUrl] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
  const [coverUrl, setCoverUrl] = useState<string>(DEFAULT_COVER_URL);

  // Active fields
  interface FieldValue {
    label: string;
    value: string;
    countryCode?: string;
    extension?: string;
  }

  const [fields, setFields] = useState<Record<string, FieldValue>>({
    jobTitle: { label: '', value: 'UI/UX Designer' },
    email: { label: 'Work', value: 'davis@example.com' },
    phone: { label: 'Mobile', value: '(555) 987-6543', countryCode: '+1', extension: '' },
    address: { label: 'Office', value: 'San Francisco, CA' },
    companyUrl: { label: '', value: 'davisgouse.com' },
  });

  // Modal State
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);
  const [modalValue, setModalValue] = useState('');
  const [modalLabel, setModalLabel] = useState('');
  const [modalCountry, setModalCountry] = useState('+1');
  const [modalExt, setModalExt] = useState('');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploadTarget = useRef<'logo' | 'profile' | 'cover' | null>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const phoneSceneRef = useRef<HTMLDivElement>(null);

  // Accordion active state
  const [activeAccordions, setActiveAccordions] = useState<Record<string, boolean>>({
    basic: true,
    contact: true,
    social: true,
    messaging: false,
  });

  // Apply colors dynamically
  useEffect(() => {
    document.documentElement.style.setProperty('--coral', gradientStart);
    document.documentElement.style.setProperty('--coral-2', gradientEnd);
  }, [gradientStart, gradientEnd]);

  // Handle body classes for step background auroras
  useEffect(() => {
    document.body.classList.remove('brand-mode', 'details-mode');
    if (currentStep === 2) document.body.classList.add('brand-mode');
    if (currentStep === 3) document.body.classList.add('details-mode');
    return () => {
      document.body.classList.remove('brand-mode', 'details-mode');
    };
  }, [currentStep]);

  // Get/Set User ID & Load cache & Load server state
  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cardcraft-ryo7.onrender.com/api";
    
    // Check if we are in Edit Mode (via query param `?edit=...`)
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    
    if (editId) {
      setCardId(editId);
      fetch(`${apiBaseUrl}/cards/${editId}`)
        .then(res => {
          if (res.ok) return res.json();
          return null;
        })
        .then(ex => {
          if (ex) {
            if (ex.designData?.brandColor) {
              setBrandColor(ex.designData.brandColor);
              setGradientStart(ex.designData.brandColor);
              setGradientEnd(ex.designData.brandColor);
            }
            if (ex.designData?.customization) {
              setCustomization(ex.designData.customization);
            }
            if (ex.fullName) {
              const nameParts = ex.fullName.trim().split(/\s+/);
              setFirstName(nameParts[0] || '');
              setLastName(nameParts.slice(1).join(' ') || '');
            }
            if (ex.designData?.images) {
              if (ex.designData.images.logo?.url) setLogoUrl(ex.designData.images.logo.url);
              if (ex.designData.images.profile?.url) setProfileUrl(ex.designData.images.profile.url);
              if (ex.designData.images.cover?.url) setCoverUrl(ex.designData.images.cover.url);
            }
            if (ex.designData?.fields) {
              const fieldMap: Record<string, FieldValue> = {};
              ex.designData.fields.forEach((f: any) => {
                fieldMap[f.type] = { label: f.label, value: f.value, countryCode: f.countryCode, extension: f.extension };
              });
              setFields(fieldMap);
            }
            setSaveStatus('saved');
          }
        })
        .catch(err => console.error('Error loading card for edit:', err));
      return;
    }

    let uid = localStorage.getItem("cc_uid");
    if (!uid) {
      uid = "g-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("cc_uid", uid);
    }
    setUserId(uid);

    // Load local storage cached state
    try {
      const raw = localStorage.getItem(`cc_card_${uid}`);
      if (raw) {
        const ex = JSON.parse(raw);
        if (ex.brandColor) {
          setBrandColor(ex.brandColor);
          setGradientStart(ex.brandColor);
          setGradientEnd(ex.brandColor);
        }
        if (ex.customization) {
          setCustomization(ex.customization);
        }
        if (ex.name) {
          setFirstName(ex.name.first || '');
          setLastName(ex.name.last || '');
        }
        if (ex.images) {
          if (ex.images.logo?.url) setLogoUrl(ex.images.logo.url);
          if (ex.images.profile?.url) setProfileUrl(ex.images.profile.url);
          if (ex.images.cover?.url) setCoverUrl(ex.images.cover.url);
        }
        if (ex.fields) {
          const fieldMap: Record<string, FieldValue> = {};
          ex.fields.forEach((f: any) => {
            fieldMap[f.type] = { label: f.label, value: f.value, countryCode: f.countryCode, extension: f.extension };
          });
          setFields(fieldMap);
        }
      }
    } catch (e) {
      console.error('Error loading cached card:', e);
    }

    // Fetch from API using guest uid
    fetch(`${apiBaseUrl}/cards/${uid}`)
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(ex => {
        if (ex) {
          setCardId(ex._id); // Map cached card to its actual DB ID if saved
          if (ex.brandColor) {
            setBrandColor(ex.brandColor);
            setGradientStart(ex.brandColor);
            setGradientEnd(ex.brandColor);
          }
          if (ex.designData?.customization) {
            setCustomization(ex.designData.customization);
          }
          if (ex.name) {
            setFirstName(ex.name.first || '');
            setLastName(ex.name.last || '');
          }
          if (ex.images) {
            if (ex.images.logo?.url) setLogoUrl(ex.images.logo.url);
            if (ex.images.profile?.url) setProfileUrl(ex.images.profile.url);
            if (ex.images.cover?.url) setCoverUrl(ex.images.cover.url);
          }
          if (ex.fields) {
            const fieldMap: Record<string, FieldValue> = {};
            ex.fields.forEach((f: any) => {
              fieldMap[f.type] = { label: f.label, value: f.value, countryCode: f.countryCode, extension: f.extension };
            });
            setFields(fieldMap);
          }
          setSaveStatus('saved');
        }
      })
      .catch(err => {
        console.warn('API load failed, using local/cache state:', err);
      });
  }, []);

  // Save to LocalStorage and API
  const saveCard = async () => {
    // Auth gate: if not logged in, show the login prompt modal
    if (!isAuthenticated || !user) {
      setShowAuthGate(true);
      setSaveStatus('dirty');
      return;
    }

    setSaveStatus('saving');
    const fieldsList = Object.entries(fields).map(([type, data], i) => ({
      type,
      order: i,
      ...data
    }));

    const cardData = {
      fullName: `${firstName} ${lastName}`.trim(),
      cardName: `${firstName} ${lastName}`.trim() + "'s Card",
      jobTitle: fields.jobTitle?.value || '',
      company: fields.companyName?.value || '',
      department: fields.department?.value || '',
      email: fields.email?.value || '',
      phone: fields.phone?.value || '',
      website: fields.companyUrl?.value || '',
      linkedin: fields.linkedin?.value || '',
      twitter: fields.x?.value || '',
      github: '',
      template: activeTemplateId || 'Midnight Pro',
      designData: {
        brandColor,
        gradientStart,
        gradientEnd,
        images: {
          logo: { url: logoUrl },
          profile: { url: profileUrl },
          cover: { url: coverUrl }
        },
        fields: fieldsList,
        customization,
      },
    };

    // Also save to localStorage for local state
    if (userId) {
      try {
        localStorage.setItem(`cc_card_${userId}`, JSON.stringify({
          brandColor,
          images: {
            logo: { url: logoUrl },
            profile: { url: profileUrl },
            cover: { url: coverUrl }
          },
          name: { first: firstName, last: lastName },
          fields: fieldsList,
          customization
        }));
      } catch (e) {
        console.error(e);
      }
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cardcraft-ryo7.onrender.com/api";
    try {
      const url = cardId ? `${apiBaseUrl}/cards/${cardId}` : `${apiBaseUrl}/cards`;
      const method = cardId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(cardData)
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved && saved._id) {
          setCardId(saved._id);
        }
        setSaveStatus('saved');
      } else {
        setSaveStatus('dirty');
      }
    } catch (e) {
      console.error(e);
      setSaveStatus('dirty');
    }
  };

  // Debounced auto-save effect
  useEffect(() => {
    if (saveStatus !== 'dirty') return;
    const timer = setTimeout(() => {
      saveCard();
    }, 600);
    return () => clearTimeout(timer);
  }, [brandColor, gradientStart, gradientEnd, firstName, lastName, logoUrl, profileUrl, coverUrl, fields, userId, saveStatus, cardId, customization]);

  // Generate QR Code dynamically client-side
  useEffect(() => {
    let qrValue = '';
    
    if (cardId) {
      // Point to public card view page
      qrValue = `${window.location.origin}/card/${cardId}`;
    } else {
      // Compile vCard payload for draft
      let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${lastName || ''};${firstName || ''};;;\nFN:${[firstName, lastName].filter(Boolean).join(' ')}\n`;
      if (fields.jobTitle?.value) vcard += `TITLE:${fields.jobTitle.value}\n`;
      if (fields.companyName?.value) vcard += `ORG:${fields.companyName.value}${fields.department?.value ? `;${fields.department.value}` : ''}\n`;
      if (fields.email?.value) vcard += `EMAIL;TYPE=PREF,INTERNET:${fields.email.value}\n`;
      if (fields.phone?.value) {
        const p = fields.phone;
        vcard += `TEL;TYPE=CELL,VOICE:${p.countryCode ? p.countryCode + ' ' : ''}${p.value}${p.extension ? ' ext ' + p.extension : ''}\n`;
      }
      if (fields.companyUrl?.value) vcard += `URL:${fields.companyUrl.value}\n`;
      if (fields.address?.value) vcard += `ADR;TYPE=WORK:;;${fields.address.value};;;;\n`;
      
      const socials = ['linkedin', 'instagram', 'x', 'facebook', 'youtube', 'tiktok'];
      socials.forEach(k => {
        if (fields[k]?.value) {
          vcard += `URL;type=${k}:${fields[k].value}\n`;
        }
      });
      vcard += 'END:VCARD';
      qrValue = vcard;
    }

    QRCode.toDataURL(qrValue, {
      color: {
        dark: brandColor || '#6B1A2A',
        light: '#FFFFFF'
      },
      margin: 1,
      width: 250
    }, (err, url) => {
      if (!err) {
        setQrDataUrl(url);
      } else {
        console.error('Error generating client QR:', err);
      }
    });
  }, [firstName, lastName, fields, brandColor, cardId]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (applyInstantly) {
      setBrandColor(val);
      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        setActiveGradientId('');
        setActiveTemplateId('');
        setGradientStart(val);
        setGradientEnd(val);
        setSaveStatus('dirty');
      }
    } else {
      setPendingBrandColor(val);
      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        setPendingGradientId('');
        setPendingTemplateId('');
        setPendingStart(val);
        setPendingEnd(val);
      }
    }
  };

  const handleEyedropper = async () => {
    if (typeof window === 'undefined' || !('EyeDropper' in window)) return;
    try {
      // @ts-ignore
      const dropper = new window.EyeDropper();
      const result = await dropper.open();
      const hex = result.sRGBHex;
      if (applyInstantly) {
        setBrandColor(hex);
        setActiveGradientId('');
        setActiveTemplateId('');
        setGradientStart(hex);
        setGradientEnd(hex);
        setSaveStatus('dirty');
      } else {
        setPendingBrandColor(hex);
        setPendingGradientId('');
        setPendingTemplateId('');
        setPendingStart(hex);
        setPendingEnd(hex);
      }
    } catch (e) {
      console.log('EyeDropper closed or failed:', e);
    }
  };

  // Phone 3D tilt interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 900 || !phoneSceneRef.current || !phoneRef.current) return;
    const r = phoneSceneRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    phoneRef.current.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 8}deg)`;
  };

  const handleMouseLeave = () => {
    if (!phoneRef.current) return;
    phoneRef.current.style.transition = 'transform .5s';
    phoneRef.current.style.transform = 'none';
    setTimeout(() => {
      if (phoneRef.current) phoneRef.current.style.transition = '';
    }, 520);
  };

  // Image Upload Trigger
  const triggerUpload = (target: 'logo' | 'profile' | 'cover') => {
    activeUploadTarget.current = target;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadTarget.current) return;
    const url = URL.createObjectURL(file);
    if (activeUploadTarget.current === 'logo') setLogoUrl(url);
    if (activeUploadTarget.current === 'profile') setProfileUrl(url);
    if (activeUploadTarget.current === 'cover') setCoverUrl(url);
    setSaveStatus('dirty');

    const reader = new FileReader();
    const target = activeUploadTarget.current;
    reader.onloadend = () => {
      const base64data = reader.result as string;
      if (target === 'logo') setLogoUrl(base64data);
      if (target === 'profile') setProfileUrl(base64data);
      if (target === 'cover') setCoverUrl(base64data);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (target: 'logo' | 'profile' | 'cover', e: React.MouseEvent) => {
    e.stopPropagation();
    if (target === 'logo') setLogoUrl('');
    if (target === 'profile') setProfileUrl('');
    if (target === 'cover') setCoverUrl('');
    setSaveStatus('dirty');
  };

  const updateCustomization = (updates: Partial<typeof customization>) => {
    setCustomization(prev => {
      const next = { ...prev, ...updates };
      setSaveStatus('dirty');
      return next;
    });
  };

  const updateAnimation = (animKey: string, isEnabled: boolean) => {
    setCustomization(prev => {
      const next = {
        ...prev,
        animations: {
          ...prev.animations,
          [animKey]: isEnabled
        }
      };
      setSaveStatus('dirty');
      return next;
    });
  };

  const handleVisualStylePresetClick = (presetKey: string) => {
    const preset = VISUAL_STYLE_PRESETS[presetKey];
    if (!preset) return;

    setBrandColor(preset.brandColor);
    setGradientStart(preset.gradStart);
    setGradientEnd(preset.gradEnd);
    setActiveGradientId('');
    setActiveTemplateId('');

    setCustomization({
      profileShape: preset.profileShape,
      profileBorder: preset.profileBorder,
      coverRatio: preset.coverRatio,
      profilePosition: preset.profilePosition,
      logoPosition: preset.logoPosition,
      logoSize: preset.logoSize || 100,
      cardTemplate: preset.cardTemplate,
      typography: preset.typography,
      cardRadius: preset.cardRadius,
      buttonStyle: preset.buttonStyle,
      backgroundEffect: preset.backgroundEffect,
      cardTheme: preset.cardTheme,
      animations: {
        floating: false,
        "gradient-movement": false,
        "glow-effects": false,
        "hover-effects": true,
        "smooth-transitions": true,
        "pulse-effects": false,
        entrance: true
      }
    });

    setActivePreset(presetKey);
    setSaveStatus('dirty');
  };

  const handleAiPresetClick = (preset: typeof AI_PRESETS[0]) => {
    setCustomization(prev => ({
      ...prev,
      ...preset.values
    }));
    setSaveStatus('dirty');
  };

  // Step 2 Color Accents & Gradient selections
  const handleGradientClick = (grad: typeof POPULAR_GRADIENTS[0]) => {
    if (applyInstantly) {
      setActiveGradientId(grad.id);
      setActiveTemplateId('');
      setBrandColor(grad.accent);
      setGradientStart(grad.start);
      setGradientEnd(grad.end);
      setSaveStatus('dirty');
    } else {
      setPendingGradientId(grad.id);
      setPendingTemplateId('');
      setPendingBrandColor(grad.accent);
      setPendingStart(grad.start);
      setPendingEnd(grad.end);
    }
  };

  const handleTemplateClick = (temp: typeof STYLE_TEMPLATES[0]) => {
    let start = '';
    let end = '';
    if (temp.gradientId) {
      const g = POPULAR_GRADIENTS.find((x) => x.id === temp.gradientId);
      if (g) {
        start = g.start;
        end = g.end;
      }
    } else {
      start = temp.start || '';
      end = temp.end || '';
    }

    if (applyInstantly) {
      setActiveTemplateId(temp.id);
      setActiveGradientId(temp.gradientId || '');
      setBrandColor(temp.accent);
      setGradientStart(start);
      setGradientEnd(end);
      setSaveStatus('dirty');
    } else {
      setPendingTemplateId(temp.id);
      setPendingGradientId(temp.gradientId || '');
      setPendingBrandColor(temp.accent);
      setPendingStart(start);
      setPendingEnd(end);
    }
  };

  const handleSwatchClick = (hex: string) => {
    if (applyInstantly) {
      setBrandColor(hex);
      setActiveGradientId('');
      setActiveTemplateId('');
      setGradientStart(hex);
      setGradientEnd(hex);
      setSaveStatus('dirty');
    } else {
      setPendingBrandColor(hex);
      setPendingGradientId('');
      setPendingTemplateId('');
      setPendingStart(hex);
      setPendingEnd(hex);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hue = parseInt(e.target.value);
    const s = 0.82, l = 0.57;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (hue < 60) { r = c; g = x; }
    else if (hue < 120) { r = x; g = c; }
    else if (hue < 180) { g = c; b = x; }
    else if (hue < 240) { g = x; b = c; }
    else if (hue < 300) { r = x; b = c; }
    else { r = c; b = x; }
    const hex = '#' + [r, g, b].map(n => Math.round((n + m) * 255).toString(16).padStart(2, '0')).join('');

    if (applyInstantly) {
      setBrandColor(hex);
      setActiveGradientId('');
      setActiveTemplateId('');
      setGradientStart(hex);
      setGradientEnd(hex);
      setSaveStatus('dirty');
    } else {
      setPendingBrandColor(hex);
      setPendingGradientId('');
      setPendingTemplateId('');
      setPendingStart(hex);
      setPendingEnd(hex);
    }
  };

  const handleApplyToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const check = e.target.checked;
    setApplyInstantly(check);
    if (check) {
      setBrandColor(pendingBrandColor);
      setActiveGradientId(pendingGradientId);
      setActiveTemplateId(pendingTemplateId);
      setGradientStart(pendingStart);
      setGradientEnd(pendingEnd);
      setSaveStatus('dirty');
    } else {
      setPendingBrandColor(brandColor);
      setPendingGradientId(activeGradientId);
      setPendingTemplateId(activeTemplateId);
      setPendingStart(gradientStart);
      setPendingEnd(gradientEnd);
    }
  };

  const handleStep2Continue = () => {
    if (!applyInstantly) {
      setBrandColor(pendingBrandColor);
      setActiveGradientId(pendingGradientId);
      setActiveTemplateId(pendingTemplateId);
      setGradientStart(pendingStart);
      setGradientEnd(pendingEnd);
      setSaveStatus('dirty');
    }
    setCurrentStep(3);
  };

  // Step 3 Modals logic
  const openFieldModal = (key: string) => {
    if (key === 'name') {
      setActiveModalKey('name');
      setModalValue(firstName);
      setModalLabel(lastName); // Re-use label state for lastName in name modal
    } else {
      setActiveModalKey(key);
      setModalValue(fields[key]?.value || '');
      setModalLabel(fields[key]?.label || '');
      setModalCountry(fields[key]?.countryCode || '+1');
      setModalExt(fields[key]?.extension || '');
    }
  };

  const saveModalField = () => {
    if (!activeModalKey) return;
    if (activeModalKey === 'name') {
      if (!modalValue.trim()) return; // First name is required
      setFirstName(modalValue.trim());
      setLastName(modalLabel.trim());
    } else {
      if (!modalValue.trim()) {
        const updated = { ...fields };
        delete updated[activeModalKey];
        setFields(updated);
      } else {
        setFields({
          ...fields,
          [activeModalKey]: {
            label: modalLabel.trim(),
            value: modalValue.trim(),
            countryCode: getFieldConfig(activeModalKey)?.modal === 'phone' ? modalCountry : undefined,
            extension: getFieldConfig(activeModalKey)?.modal === 'phone' ? modalExt.trim() : undefined,
          },
        });
      }
    }
    setActiveModalKey(null);
    setSaveStatus('dirty');
  };

  const deleteModalField = () => {
    if (!activeModalKey) return;
    if (activeModalKey === 'name') {
      setFirstName('');
      setLastName('');
    } else {
      const updated = { ...fields };
      delete updated[activeModalKey];
      setFields(updated);
    }
    setActiveModalKey(null);
    setSaveStatus('dirty');
  };

  // Profile completion metrics
  const COMPLETION_STEPS = [
    { label: 'Profile Photo', check: () => !!profileUrl },
    { label: 'Brand Color', check: () => brandColor !== '#FF4D4D' || activeGradientId !== 'coral' || activeTemplateId !== 'coral-sunset' },
    { label: 'Basic Information', check: () => !!(firstName || lastName || fields.jobTitle?.value) },
    { label: 'Contact Information', check: () => !!(fields.email?.value || fields.phone?.value) },
    { label: 'Social Profiles', check: () => ['linkedin', 'instagram', 'x', 'facebook', 'youtube', 'tiktok'].some(k => !!fields[k]?.value) },
    { label: 'Messaging Apps', check: () => ['whatsapp', 'telegram', 'discord', 'skype', 'signal'].some(k => !!fields[k]?.value) },
  ];
  const doneCount = COMPLETION_STEPS.filter((s) => s.check()).length;
  const completionPercentage = Math.round((doneCount / COMPLETION_STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1410] font-sans antialiased selection:bg-[#6B1A2A] selection:text-white pt-20">
      <Header />

      {/* ── TOPBAR ── */}
      <header className="topbar mt-4">
        <div className="topbar-logo select-none">
          <div className="cc-mark">
            <svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="2" y="30" fontFamily="'Playfair Display',Georgia,serif" fontSize="28" fontWeight="700" fill={gradientStart}>CC</text>
            </svg>
          </div>
          <div className="topbar-wordmark-wrap">
            <span className="topbar-wordmark">CardCraft</span>
            <span className="topbar-tagline">Your Digital Identity</span>
          </div>
        </div>

        <nav className="topbar-steps">
          <button onClick={() => setCurrentStep(1)} className={`step-pill ${currentStep === 1 ? 'is-active' : 'is-done'}`} type="button">
            <span className="step-pill-num">
              {currentStep > 1 ? (
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }}>
                  <path d="M4.5 10.3l3.5 3.5 7.5-8" />
                </svg>
              ) : '1'}
            </span>
            <span className="step-pill__label">Photos</span>
          </button>
          <div className="step-conn" />
          <button onClick={() => setCurrentStep(2)} className={`step-pill ${currentStep === 2 ? 'is-active' : currentStep > 2 ? 'is-done' : ''}`} type="button">
            <span className="step-pill-num">
              {currentStep > 2 ? (
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }}>
                  <path d="M4.5 10.3l3.5 3.5 7.5-8" />
                </svg>
              ) : '2'}
            </span>
            <span className="step-pill__label">Brand</span>
          </button>
          <div className="step-conn" />
          <button onClick={() => setCurrentStep(3)} className={`step-pill ${currentStep === 3 ? 'is-active' : ''}`} type="button">
            <span className="step-pill-num">3</span>
            <span className="step-pill__label">Details</span>
          </button>
        </nav>

        <div className="topbar-right">
          <span className={`save-badge ${saveStatus === 'saved' ? 'is-saved' : saveStatus === 'saving' ? 'is-saving' : ''}`} role="status">
            <span className="dot" />
            <span>{saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving…' : 'Draft'}</span>
          </span>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <main className="layout">
        
        {/* ── LEFT: PHONE PREVIEW ── */}
        <aside className="preview-pane">
          <div className="phone-scene" ref={phoneSceneRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="phone-3d" ref={phoneRef}>
              <div className={`phone-frame ${Object.entries(customization.animations).map(([k, v]) => v ? `anim-${k}` : '').join(' ')}`.trim()}>
                <div className={`phone-screen-wrap ${customization.animations['gradient-movement'] ? 'anim-gradient-movement' : ''}`.trim()}>
                  <div className={`phone-screen-inner ${isFlipped ? 'is-flipped' : ''}`}>

                    {/* Front Face */}
                    {(() => {
                      const DARK_BG_EFFECTS = ["premium-luxury", "floating-particles", "mesh"];
                      const isDarkTheme = customization.cardTheme === "dark" || DARK_BG_EFFECTS.includes(customization.backgroundEffect);
                      const themeClass = isDarkTheme ? "theme-dark" : "theme-light";
                      const phoneScreenClass = `phone-screen pos-${customization.profilePosition} ${themeClass}`;
                      const customGradient = (activeGradientId || activeTemplateId) && gradientStart && gradientEnd
                        ? `linear-gradient(150deg, ${gradientStart} 0%, ${gradientEnd} 100%)`
                        : brandColor;

                      return (
                        <div 
                          className={phoneScreenClass} 
                          style={{ 
                            fontFamily: `"${customization.typography}", -apple-system, sans-serif`, 
                            borderRadius: `${customization.cardRadius}px` 
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
                          <div 
                            className={`card-hero ratio-${customization.coverRatio} ${coverUrl ? 'has-cover' : ''}`} 
                            style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : { background: customGradient }}
                          >
                            <button onClick={() => triggerUpload('cover')} className="card-hero__edit" title="Edit cover" type="button">
                              {renderIcon('pencil')}
                            </button>
                          </div>
                          <div onClick={() => triggerUpload('profile')} className={`avatar-wrap cursor-pointer shape-${customization.profileShape} border-${customization.profileBorder}`}>
                            {profileUrl ? (
                              <img src={profileUrl} alt="profile" />
                            ) : (
                              renderIcon('user')
                            )}
                          </div>
                          <div className="card-body">
                            <h2 className="preview-name">{[firstName, lastName].filter(Boolean).join(' ') || 'Your name'}</h2>
                            
                            {/* Meta Job Title & Company Name */}
                            {(fields.jobTitle?.value || fields.companyName?.value) && (
                              <p className="preview-meta">
                                {[fields.jobTitle?.value, fields.companyName?.value].filter(Boolean).join(' · ')}
                              </p>
                            )}
                            
                            <div className="preview-fields">
                              {Object.entries(fields)
                                .filter(([k]) => k !== 'jobTitle' && k !== 'companyName' && k !== 'department' && k !== 'headline')
                                .map(([key, data]) => {
                                  const conf = getFieldConfig(key);
                                  if (!conf || !data.value) return null;
                                  return (
                                    <div key={key} className="preview-field">
                                      <span className="preview-field__icon">{renderIcon(conf.icon)}</span>
                                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span className="preview-field__label">{data.label || conf.label}</span>
                                        <span className="preview-field__value">
                                          {data.countryCode ? `${data.countryCode} ` : ''}
                                          {data.value}
                                          {data.extension ? ` Ext. ${data.extension}` : ''}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                          
                          <button onClick={() => setIsFlipped(true)} className={`phone-share-btn style-${customization.buttonStyle}`} type="button">
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 9l-4-4-4 4M10 5v10" />
                            </svg>
                            Share Card
                          </button>
                        </div>
                      );
                    })()}

                    {/* Back Face (QR Code) */}
                    {(() => {
                      const DARK_BG_EFFECTS = ["premium-luxury", "floating-particles", "mesh"];
                      const isDarkTheme = customization.cardTheme === "dark" || DARK_BG_EFFECTS.includes(customization.backgroundEffect);
                      const themeClass = isDarkTheme ? "theme-dark" : "theme-light";
                      return (
                        <div 
                          className={`phone-back ${themeClass}`}
                          style={{ 
                            fontFamily: `"${customization.typography}", -apple-system, sans-serif`, 
                            borderRadius: `${customization.cardRadius}px` 
                          }}
                        >
                          <span className="phone-back-label">Scan to connect</span>
                          <div className="qr-ph" onClick={() => setIsFlipped(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', cursor: 'pointer', overflow: 'hidden', padding: 4 }}>
                            {qrDataUrl ? (
                              <img src={qrDataUrl} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                              <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>Generating...</span>
                            )}
                          </div>
                          <p className="phone-back-name">{[firstName, lastName].filter(Boolean).join(' ') || 'Your name'}</p>
                          <p className="phone-back-tagline">Share your card with anyone, instantly.</p>
                        </div>
                      );
                    })()}

                  </div>
                </div>
              </div>
            </div>
          </div>

          <button onClick={() => setIsFlipped(!isFlipped)} className="flip-toggle" type="button">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10a7 7 0 0114 0M3 10l3-3M3 10l3 3M17 10l-3-3M17 10l-3 3" />
            </svg>
            {isFlipped ? 'Show front' : 'Flip Card'}
          </button>

          <div className="phone-qr-card" onClick={() => setIsFlipped(!isFlipped)}>
            <div className="phone-qr-card__text">
              <div className="phone-qr-card__title">Your card preview</div>
              <div className="phone-qr-card__sub">Scan to preview your digital business card</div>
            </div>
            <div className="phone-qr-mini" onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}>
              {renderIcon('qrcode')}
            </div>
          </div>

          {/* Progress Ring (hidden on step 1) */}
          <div className={`progress-ring-wrap ${currentStep === 1 ? 'hidden' : ''}`}>
            <svg className="progress-ring-svg" width="50" height="50" viewBox="0 0 60 60">
              <circle className="progress-ring-track" cx="30" cy="30" r="26" />
              <circle className="progress-ring-fill" cx="30" cy="30" r="26" strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 * (1 - completionPercentage / 100)} />
            </svg>
            <span className="progress-ring-label">{completionPercentage}%</span>
            <span className="progress-ring-sub">{completionPercentage === 100 ? 'Complete! 🎉' : 'Fill in details'}</span>
          </div>
        </aside>

        {/* ── RIGHT: EDITOR PANE ── */}
        <section className="editor-pane">
          <div className="editor-heading-row">
            <div className="editor-heading-left">
              <h1>
                <span className="sparkle">✦</span>
                <span>
                  {currentStep === 1 && 'Add your photos'}
                  {currentStep === 2 && 'Choose your brand color'}
                  {currentStep === 3 && 'Complete your profile'}
                </span>
              </h1>
              <p>
                {currentStep === 1 && 'Upload a profile picture, company logo, or cover photo to make your card stand out.'}
                {currentStep === 2 && 'Pick a color that represents you or your business — it’ll accent your entire card.'}
                {currentStep === 3 && 'Add your details, social links and more to build your digital identity.'}
              </p>
            </div>
            {currentStep === 1 && (
              <div className="tips-card">
                <div className="tips-card__icon">{renderIcon('alert')}</div>
                <div>
                  <div className="tips-card__title">Tips</div>
                  <div className="tips-card__text">Use high-quality images for the best results.</div>
                </div>
              </div>
            )}
          </div>
          {/* STEP 1: Photos */}
          {currentStep === 1 && (
            <div className="step-panel is-active">
              <div className="studio-layout">
                {/* Center Panel: Customization Studio Controls */}
                <div className="studio-center">
                  
                  {/* Section 0: Visual Style Presets */}
                  <div className="studio-section">
                    <div className="studio-section__header">
                      <span className="studio-section__title">🎨 Visual Style Presets</span>
                    </div>
                    <p className="studio-section__desc">
                      Select a visual style to instantly transform your card and unlock tailored customization options.
                    </p>
                    <div className="vstyle-grid">
                      {[
                        { id: 'modern-profile', name: 'Modern Profile', desc: 'Perfect for personal branding and professionals.', thumbClass: 'modern' },
                        { id: 'corporate-minimal', name: 'Corporate Minimal', desc: 'Professional corporate business identity.', thumbClass: 'corporate' },
                        { id: 'creative-portfolio', name: 'Creative Portfolio', desc: 'Ideal for designers, artists and freelancers.', thumbClass: 'creative' },
                        { id: 'glassmorphism', name: 'Glassmorphism', desc: 'Modern glass UI with premium visual depth.', thumbClass: 'glass' },
                        { id: 'premium-dark', name: 'Premium Dark', desc: 'Luxury dark theme for executives and founders.', thumbClass: 'dark' },
                        { id: 'social-creator', name: 'Social Creator', desc: 'Built for creators, influencers and content brands.', thumbClass: 'social' }
                      ].map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => handleVisualStylePresetClick(item.id)} 
                          className={`vstyle-card ${activePreset === item.id ? 'is-selected' : ''}`}
                        >
                          <div className={`vstyle-thumb vstyle-thumb--${item.thumbClass}`}>
                            {item.id === 'modern-profile' && (
                              <>
                                <span className="vstyle-avatar" />
                                <span className="vstyle-bar vstyle-bar--a" />
                                <span className="vstyle-bar vstyle-bar--b" />
                                <span className="vstyle-bar vstyle-bar--c" />
                              </>
                            )}
                            {item.id === 'corporate-minimal' && (
                              <>
                                <span className="vstyle-logo-sq" />
                                <span className="vstyle-bar vstyle-bar--a" />
                                <span className="vstyle-bar vstyle-bar--b" />
                              </>
                            )}
                            {item.id === 'creative-portfolio' && (
                              <>
                                <span className="vstyle-badge">PORTFOLIO</span>
                                <span className="vstyle-circle-tr" />
                                <span className="vstyle-bar vstyle-bar--white-a" />
                                <span className="vstyle-bar vstyle-bar--white-b" />
                              </>
                            )}
                            {item.id === 'glassmorphism' && (
                              <>
                                <span className="vstyle-blob" />
                                <span className="vstyle-glass-panel">
                                  <span className="vstyle-bar vstyle-bar--white-a" />
                                  <span className="vstyle-bar vstyle-bar--white-b" />
                                </span>
                              </>
                            )}
                            {item.id === 'premium-dark' && (
                              <>
                                <span className="vstyle-avatar-ring" />
                                <span className="vstyle-check">
                                  <svg viewBox="0 0 14 14" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 7l3 3 5-6" />
                                  </svg>
                                </span>
                                <span className="vstyle-bar vstyle-bar--gold" />
                                <span className="vstyle-bar vstyle-bar--gray" />
                                <span className="vstyle-bar vstyle-bar--gray2" />
                              </>
                            )}
                            {item.id === 'social-creator' && (
                              <>
                                <span className="vstyle-avatar" />
                                <span className="vstyle-bar vstyle-bar--white-a" />
                                <span className="vstyle-connect-btn">Connect</span>
                              </>
                            )}
                          </div>
                          <div className="vstyle-info">
                            <p className="vstyle-name">{item.name}</p>
                            <p className="vstyle-desc">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 1: Image Uploads */}
                  <div className="studio-section">
                    <div className="studio-section__header">
                      <span className="studio-section__title">✦ Create Your Identity</span>
                    </div>
                    <p className="studio-section__desc">
                      Add a cover image, profile photo and logo. Just click or drag an image onto any area below.
                    </p>

                    <div className="image-tiles">
                      {/* Profile Photo */}
                      <div className="image-tile" id="tile-profile" onClick={() => triggerUpload('profile')}>
                        <div className="image-tile__frame" id="preview-profile">
                          {profileUrl ? (
                            <img id="preview-profile-img" src={profileUrl} alt="Profile" />
                          ) : (
                            <div className="image-tile__placeholder">
                              <div className="image-tile__icon-wrap">
                                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M10 10a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z" />
                                  <path d="M4 16.5c.7-3 3-4.5 6-4.5s5.3 1.5 6 4.5" />
                                </svg>
                              </div>
                              <span className="image-tile__placeholder-text">+ Add Profile Photo</span>
                            </div>
                          )}
                          {profileUrl && (
                            <>
                              <div className="image-tile__overlay">
                                <span className="image-tile__overlay-text">Replace photo</span>
                              </div>
                              <button 
                                className="image-tile__remove" 
                                id="remove-profile" 
                                type="button"
                                aria-label="Remove profile photo"
                                onClick={(e) => removeImage('profile', e)}
                              >
                                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                  <path d="M3 3l8 8M11 3l-8 8" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                        <div className="image-tile__meta">
                          <p className="image-tile__name">Profile Photo</p>
                          <div className="image-tile__status">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 8.5l3.2 3.2L13 4.5" />
                            </svg>
                            {profileUrl ? (
                              <span className="image-tile__status-label--added">Added</span>
                            ) : (
                              <span className="image-tile__status-label--empty">5MB limit</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Company Logo */}
                      <div className="image-tile" id="tile-logo" onClick={() => triggerUpload('logo')}>
                        <div className="image-tile__frame" id="preview-logo">
                          {logoUrl && logoUrl !== DEFAULT_LOGO_URL ? (
                            <img id="preview-logo-img" src={logoUrl} alt="Logo" />
                          ) : (
                            <div className="image-tile__placeholder">
                              <div className="image-tile__icon-wrap">
                                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" />
                                  <path d="M6 8.5h2M6 11.5h6M10 8.5h4" />
                                </svg>
                              </div>
                              <span className="image-tile__placeholder-text">+ Add Brand Logo</span>
                            </div>
                          )}
                          {logoUrl && logoUrl !== DEFAULT_LOGO_URL && (
                            <>
                              <div className="image-tile__overlay">
                                <span className="image-tile__overlay-text">Replace logo</span>
                              </div>
                              <button 
                                className="image-tile__remove" 
                                id="remove-logo" 
                                type="button"
                                aria-label="Remove logo"
                                onClick={(e) => removeImage('logo', e)}
                              >
                                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                  <path d="M3 3l8 8M11 3l-8 8" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                        <div className="image-tile__meta">
                          <p className="image-tile__name">Company Logo</p>
                          <div className="image-tile__status">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 8.5l3.2 3.2L13 4.5" />
                            </svg>
                            {logoUrl && logoUrl !== DEFAULT_LOGO_URL ? (
                              <span className="image-tile__status-label--added">Added</span>
                            ) : (
                              <span className="image-tile__status-label--empty">PNG, SVG</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Cover Image */}
                      <div className="image-tile" id="tile-cover" onClick={() => triggerUpload('cover')}>
                        <div className="image-tile__frame" id="preview-cover">
                          {coverUrl && coverUrl !== DEFAULT_COVER_URL ? (
                            <img id="preview-cover-img" src={coverUrl} alt="Cover" />
                          ) : (
                            <div className="image-tile__placeholder">
                              <div className="image-tile__icon-wrap">
                                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" />
                                  <path d="M2.5 13l4-4 3 3 2.5-2.5 5.5 5" />
                                  <circle cx="6.5" cy="8" r="1.2" />
                                </svg>
                              </div>
                              <span className="image-tile__placeholder-text">+ Add Cover Image</span>
                            </div>
                          )}
                          {coverUrl && coverUrl !== DEFAULT_COVER_URL && (
                            <>
                              <div className="image-tile__overlay">
                                <span className="image-tile__overlay-text">Replace cover</span>
                              </div>
                              <button 
                                className="image-tile__remove" 
                                id="remove-cover" 
                                type="button"
                                aria-label="Remove cover photo"
                                onClick={(e) => removeImage('cover', e)}
                              >
                                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                  <path d="M3 3l8 8M11 3l-8 8" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                        <div className="image-tile__meta">
                          <p className="image-tile__name">Cover Banner</p>
                          <div className="image-tile__status">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 8.5l3.2 3.2L13 4.5" />
                            </svg>
                            {coverUrl && coverUrl !== DEFAULT_COVER_URL ? (
                              <span className="image-tile__status-label--added">Added</span>
                            ) : (
                              <span className="image-tile__status-label--empty">10MB limit</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/png,image/jpeg,image/webp,image/svg+xml" 
                      hidden 
                    />
                  </div>

                  {/* ✨ More Styles — Card Style Studio toggle */}
                  <button 
                    onClick={() => setIsStyleStudioOpen(!isStyleStudioOpen)}
                    className="style-studio-toggle" 
                    id="styleStudioToggle" 
                    type="button" 
                    aria-expanded={isStyleStudioOpen}
                  >
                    <span className="style-studio-toggle__sparkle">✨</span>
                    <span>{isStyleStudioOpen ? 'Fewer Styles' : 'More Styles'}</span>
                    <svg 
                      className={`chev ${isStyleStudioOpen ? 'rotate-180' : ''}`} 
                      viewBox="0 0 20 20" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ transform: isStyleStudioOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                    >
                      <path d="M5 7.5l5 5 5-5" />
                    </svg>
                  </button>

                  {/* Card Style Studio — collapsible accordion panel */}
                  {isStyleStudioOpen && (
                    <div className="style-studio-panel" id="styleStudioPanel" style={{ display: 'block' }}>
                      <div className="style-studio-card">
                        <div className="style-studio-card__header">
                          <span className="style-studio-card__title">Card Style Studio</span>
                          <span className="style-studio-card__badge">Live preview</span>
                        </div>

                        {/* Style Group: Layout */}
                        <div className={`style-group ${activeStyleGroup === 'layout' ? 'is-active' : ''}`}>
                          <button 
                            className="style-group__header" 
                            type="button" 
                            onClick={() => setActiveStyleGroup(activeStyleGroup === 'layout' ? null : 'layout')}
                            aria-expanded={activeStyleGroup === 'layout'}
                          >
                            <span className="style-group__icon">
                              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="14" height="6" rx="1.5" />
                                <rect x="3" y="11" width="6" height="6" rx="1.5" />
                                <rect x="11" y="11" width="6" height="6" rx="1.5" />
                              </svg>
                            </span>
                            <span className="style-group__text">
                              <span className="style-group__title">Layout</span>
                              <span className="style-group__current">Cover &amp; profile</span>
                            </span>
                            <svg 
                              className="style-group__chev" 
                              viewBox="0 0 20 20" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              style={{ transform: activeStyleGroup === 'layout' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                            >
                              <path d="M5 7.5l5 5 5-5" />
                            </svg>
                          </button>
                          
                          {activeStyleGroup === 'layout' && (
                            <div className="style-group__body" style={{ display: 'block' }}>
                              
                              {/* Accordion Ratio */}
                              <div className={`accordion-item ${activeAccordionItem === 'ratio' ? 'is-open' : ''}`}>
                                <button 
                                  className="accordion-header" 
                                  type="button"
                                  onClick={() => setActiveAccordionItem(activeAccordionItem === 'ratio' ? null : 'ratio')}
                                >
                                  <span className="accordion-header__icon">
                                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x="2.5" y="5" width="15" height="10" rx="1.5" />
                                    </svg>
                                  </span>
                                  <span className="accordion-header__text">
                                    <span className="accordion-header__title">Cover Layout Ratio</span>
                                    <span className="accordion-header__current">{customization.coverRatio.replace('-', ':')}</span>
                                  </span>
                                  <svg className="accordion-header__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 7.5l5 5 5-5" />
                                  </svg>
                                </button>
                                {activeAccordionItem === 'ratio' && (
                                  <div className="accordion-body" style={{ display: 'block' }}>
                                    <div className="accordion-body__inner">
                                      <p className="accordion-body__desc">Adjust the size ratio of the cover banner image.</p>
                                      <div className="option-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                                        {['16-9', '21-9', '4-3', '1-1', 'custom'].map(ratio => (
                                          <div 
                                            key={ratio} 
                                            onClick={() => updateCustomization({ coverRatio: ratio })}
                                            className={`ratio-card ${customization.coverRatio === ratio ? 'is-selected' : ''}`}
                                          >
                                            <div className={`ratio-card__visual ratio-visual-${ratio}`} />
                                            <span className="option-card__label">{ratio.replace('-', ':')}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Accordion Position */}
                              <div className={`accordion-item ${activeAccordionItem === 'position' ? 'is-open' : ''}`}>
                                <button 
                                  className="accordion-header" 
                                  type="button"
                                  onClick={() => setActiveAccordionItem(activeAccordionItem === 'position' ? null : 'position')}
                                >
                                  <span className="accordion-header__icon">
                                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M4 4h12v12H4z" />
                                      <circle cx="7" cy="7" r="1.6" />
                                    </svg>
                                  </span>
                                  <span className="accordion-header__text">
                                    <span className="accordion-header__title">Profile Position</span>
                                    <span className="accordion-header__current">{customization.profilePosition}</span>
                                  </span>
                                  <svg className="accordion-header__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 7.5l5 5 5-5" />
                                  </svg>
                                </button>
                                {activeAccordionItem === 'position' && (
                                  <div className="accordion-body" style={{ display: 'block' }}>
                                    <div className="accordion-body__inner">
                                      <p className="accordion-body__desc">Select where your profile picture floats relative to the cover.</p>
                                      <div className="option-grid">
                                        {[
                                          { id: 'overlap', label: 'Overlap Cover' },
                                          { id: 'center-cover', label: 'Center Cover' },
                                          { id: 'top-left', label: 'Top Left' },
                                          { id: 'top-right', label: 'Top Right' },
                                          { id: 'bottom-left', label: 'Bottom Left' },
                                          { id: 'bottom-right', label: 'Bottom Right' },
                                          { id: 'center-screen', label: 'Center Screen' }
                                        ].map(pos => (
                                          <div 
                                            key={pos.id} 
                                            onClick={() => updateCustomization({ profilePosition: pos.id })}
                                            className={`option-card ${customization.profilePosition === pos.id ? 'is-selected' : ''}`}
                                          >
                                            <span className="option-card__label">{pos.label}</span>
                                            <div className="option-card__indicator" />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                            </div>
                          )}
                        </div>

                        {/* Style Group: Appearance */}
                        <div className={`style-group ${activeStyleGroup === 'appearance' ? 'is-active' : ''}`}>
                          <button 
                            className="style-group__header" 
                            type="button" 
                            onClick={() => setActiveStyleGroup(activeStyleGroup === 'appearance' ? null : 'appearance')}
                            aria-expanded={activeStyleGroup === 'appearance'}
                          >
                            <span className="style-group__icon">
                              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="10" cy="10" r="6.5" />
                                <path d="M10 3.5v2M10 14.5v2M3.5 10h2M14.5 10h2" />
                              </svg>
                            </span>
                            <span className="style-group__text">
                              <span className="style-group__title">Appearance</span>
                              <span className="style-group__current">Templates &amp; radius</span>
                            </span>
                            <svg className="style-group__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 7.5l5 5 5-5" />
                            </svg>
                          </button>
                          {activeStyleGroup === 'appearance' && (
                            <div className="style-group__body" style={{ display: 'block' }}>
                              
                              {/* Accordion Templates */}
                              <div className={`accordion-item ${activeAccordionItem === 'templates' ? 'is-open' : ''}`}>
                                <button 
                                  className="accordion-header" 
                                  type="button"
                                  onClick={() => setActiveAccordionItem(activeAccordionItem === 'templates' ? null : 'templates')}
                                >
                                  <span className="accordion-header__icon">
                                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x="3" y="3" width="6" height="6" rx="1" />
                                      <rect x="11" y="3" width="6" height="6" rx="1" />
                                      <rect x="3" y="11" width="6" height="6" rx="1" />
                                      <rect x="11" y="11" width="6" height="6" rx="1" />
                                    </svg>
                                  </span>
                                  <span className="accordion-header__text">
                                    <span className="accordion-header__title">Card Templates</span>
                                    <span className="accordion-header__current">{customization.cardTemplate}</span>
                                  </span>
                                  <svg className="accordion-header__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 7.5l5 5 5-5" />
                                  </svg>
                                </button>
                                {activeAccordionItem === 'templates' && (
                                  <div className="accordion-body" style={{ display: 'block' }}>
                                    <div className="accordion-body__inner">
                                      <p className="accordion-body__desc">Quick-apply typography, radius, and layout presets in one click.</p>
                                      <div className="option-grid">
                                        {['modern', 'startup', 'executive', 'luxury', 'creative', 'developer', 'personal'].map(tpl => (
                                          <div 
                                            key={tpl} 
                                            onClick={() => updateCustomization({ cardTemplate: tpl })}
                                            className={`option-card ${customization.cardTemplate === tpl ? 'is-selected' : ''}`}
                                          >
                                            <span className="option-card__label" style={{ textTransform: 'capitalize' }}>{tpl}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Accordion Radius & Button Style */}
                              <div className={`accordion-item ${activeAccordionItem === 'radius' ? 'is-open' : ''}`}>
                                <button 
                                  className="accordion-header" 
                                  type="button"
                                  onClick={() => setActiveAccordionItem(activeAccordionItem === 'radius' ? null : 'radius')}
                                >
                                  <span className="accordion-header__icon">
                                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3 9V7a4 4 0 014-4h2" />
                                      <rect x="3" y="9" width="14" height="8" rx="2" />
                                    </svg>
                                  </span>
                                  <span className="accordion-header__text">
                                    <span className="accordion-header__title">Card Radius</span>
                                    <span className="accordion-header__current">{customization.cardRadius}px</span>
                                  </span>
                                  <svg className="accordion-header__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 7.5l5 5 5-5" />
                                  </svg>
                                </button>
                                {activeAccordionItem === 'radius' && (
                                  <div className="accordion-body" style={{ display: 'block' }}>
                                    <div className="accordion-body__inner">
                                      <p className="accordion-body__desc">Determine how rounded the outer edges of your digital card are.</p>
                                      <div className="slider-container">
                                        <div className="slider-row">
                                          <input 
                                            type="range" 
                                            className="studio-slider" 
                                            min="0" 
                                            max="40" 
                                            value={customization.cardRadius} 
                                            onChange={(e) => updateCustomization({ cardRadius: parseInt(e.target.value) })}
                                          />
                                          <span className="slider-value">{customization.cardRadius}px</span>
                                        </div>
                                        <div className="slider-labels">
                                          <span>Sharp (0px)</span>
                                          <span>Modern</span>
                                          <span>Soft</span>
                                          <span>Premium (40px)</span>
                                        </div>
                                      </div>

                                      <p className="accordion-body__desc" style={{ marginTop: 18 }}>Share button style.</p>
                                      <div className="option-grid">
                                        {['solid', 'gradient', 'glass', 'outline', 'dark', 'neon'].map(btn => (
                                          <div 
                                            key={btn} 
                                            onClick={() => updateCustomization({ buttonStyle: btn })}
                                            className={`option-card ${customization.buttonStyle === btn ? 'is-selected' : ''}`}
                                          >
                                            <div className={`mini-button ${btn}`} />
                                            <span className="option-card__label" style={{ textTransform: 'capitalize' }}>{btn}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                            </div>
                          )}
                        </div>

                        {/* Style Group: Effects */}
                        <div className={`style-group ${activeStyleGroup === 'effects' ? 'is-active' : ''}`}>
                          <button 
                            className="style-group__header" 
                            type="button" 
                            onClick={() => setActiveStyleGroup(activeStyleGroup === 'effects' ? null : 'effects')}
                            aria-expanded={activeStyleGroup === 'effects'}
                          >
                            <span className="style-group__icon">
                              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="7" cy="7" r="3" />
                                <circle cx="13" cy="13" r="3" />
                              </svg>
                            </span>
                            <span className="style-group__text">
                              <span className="style-group__title">Effects</span>
                              <span className="style-group__current">Background &amp; motion</span>
                            </span>
                            <svg className="style-group__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 7.5l5 5 5-5" />
                            </svg>
                          </button>
                          {activeStyleGroup === 'effects' && (
                            <div className="style-group__body" style={{ display: 'block' }}>
                              
                              {/* Accordion Background Effects */}
                              <div className={`accordion-item ${activeAccordionItem === 'bg-effects' ? 'is-open' : ''}`}>
                                <button 
                                  className="accordion-header" 
                                  type="button"
                                  onClick={() => setActiveAccordionItem(activeAccordionItem === 'bg-effects' ? null : 'bg-effects')}
                                >
                                  <span className="accordion-header__icon">
                                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="7" cy="7" r="3" />
                                      <circle cx="13" cy="13" r="3" />
                                    </svg>
                                  </span>
                                  <span className="accordion-header__text">
                                    <span className="accordion-header__title">Background Effects</span>
                                    <span className="accordion-header__current" style={{ textTransform: 'capitalize' }}>{customization.backgroundEffect.replace('-', ' ')}</span>
                                  </span>
                                  <svg className="accordion-header__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 7.5l5 5 5-5" />
                                  </svg>
                                </button>
                                {activeAccordionItem === 'bg-effects' && (
                                  <div className="accordion-body" style={{ display: 'block' }}>
                                    <div className="accordion-body__inner">
                                      <p className="accordion-body__desc">Apply interactive backdrops and effects directly to the card body.</p>
                                      <div className="option-grid">
                                        {[
                                          { id: 'solid', label: 'Solid' },
                                          { id: 'gradient', label: 'Gradient' },
                                          { id: 'mesh', label: 'Mesh Gradient' },
                                          { id: 'aurora', label: 'Aurora' },
                                          { id: 'abstract-shapes', label: 'Floating Shapes' },
                                          { id: 'glass-blur', label: 'Glass Blur' }
                                        ].map(eff => (
                                          <div 
                                            key={eff.id} 
                                            onClick={() => updateCustomization({ backgroundEffect: eff.id })}
                                            className={`option-card ${customization.backgroundEffect === eff.id ? 'is-selected' : ''}`}
                                          >
                                            <span className="option-card__label">{eff.label}</span>
                                          </div>
                                        ))}
                                      </div>

                                      <p className="accordion-body__desc" style={{ marginTop: 18 }}>Subtle, premium motion on the preview.</p>
                                      <div className="toggle-list">
                                        {[
                                          { id: 'floating', label: 'Floating Profile', desc: 'Card gently floats in 3D perspective space' },
                                          { id: 'glow-effects', label: 'Glow Effect', desc: 'Soft glassmorphic glow around the card' },
                                          { id: 'gradient-movement', label: 'Gradient Motion', desc: 'Slowly shifts background gradients' },
                                          { id: 'hover-effects', label: 'Hover Effects', desc: 'Elevate the card on mouse hover' },
                                          { id: 'smooth-transitions', label: 'Smooth Transitions', desc: 'Animate steps and changes seamlessly' }
                                        ].map(anim => (
                                          <div key={anim.id} className="toggle-row">
                                            <div className="toggle-row__info">
                                              <span className="toggle-row__label">{anim.label}</span>
                                              <span className="toggle-row__desc">{anim.desc}</span>
                                            </div>
                                            <label className="switch-wrap">
                                              <input 
                                                type="checkbox" 
                                                className="anim-toggle" 
                                                checked={customization.animations[anim.id as keyof typeof customization.animations] || false}
                                                onChange={(e) => updateAnimation(anim.id, e.target.checked)}
                                              />
                                              <span className="switch-slider" />
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                            </div>
                          )}
                        </div>

                        {/* Style Group: Typography */}
                        <div className={`style-group ${activeStyleGroup === 'typography' ? 'is-active' : ''}`}>
                          <button 
                            className="style-group__header" 
                            type="button" 
                            onClick={() => setActiveStyleGroup(activeStyleGroup === 'typography' ? null : 'typography')}
                            aria-expanded={activeStyleGroup === 'typography'}
                          >
                            <span className="style-group__icon">
                              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 5h10M10 5v10M7 15h6" />
                              </svg>
                            </span>
                            <span className="style-group__text">
                              <span className="style-group__title">Typography</span>
                              <span className="style-group__current">{customization.typography}</span>
                            </span>
                            <svg className="style-group__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 7.5l5 5 5-5" />
                            </svg>
                          </button>
                          {activeStyleGroup === 'typography' && (
                            <div className="style-group__body" style={{ display: 'block' }}>
                              
                              {/* Accordion Typography */}
                              <div className={`accordion-item ${activeAccordionItem === 'typography' ? 'is-open' : ''}`}>
                                <button 
                                  className="accordion-header" 
                                  type="button"
                                  onClick={() => setActiveAccordionItem(activeAccordionItem === 'typography' ? null : 'typography')}
                                >
                                  <span className="accordion-header__icon">
                                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M5 5h10M10 5v10M7 15h6" />
                                    </svg>
                                  </span>
                                  <span className="accordion-header__text">
                                    <span className="accordion-header__title">Typography</span>
                                    <span className="accordion-header__current">{customization.typography}</span>
                                  </span>
                                  <svg className="accordion-header__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 7.5l5 5 5-5" />
                                  </svg>
                                </button>
                                {activeAccordionItem === 'typography' && (
                                  <div className="accordion-body" style={{ display: 'block' }}>
                                    <div className="accordion-body__inner">
                                      <p className="accordion-body__desc">Typography accent for your card.</p>
                                      <div className="option-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                        {[
                                          { font: 'DM Sans', preview: 'Modern and balanced' },
                                          { font: 'Inter', preview: 'Sleek tech interface' },
                                          { font: 'Poppins', preview: 'Bold geometric elegance' },
                                          { font: 'Manrope', preview: 'Clean corporate type' },
                                          { font: 'Playfair Display', preview: 'High luxury editorial' },
                                          { font: 'Plus Jakarta Sans', preview: 'Vibrant start-up feel' }
                                        ].map(f => (
                                          <div 
                                            key={f.font} 
                                            onClick={() => updateCustomization({ typography: f.font })}
                                            className={`font-btn ${customization.typography === f.font ? 'is-selected' : ''}`}
                                            style={{ fontFamily: `"${f.font}", sans-serif` }}
                                          >
                                            <span className="font-btn__name">{f.font === 'Plus Jakarta Sans' ? 'Plus Jakarta' : f.font}</span>
                                            <span className="font-btn__preview">{f.preview}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                            </div>
                          )}
                        </div>

                        {/* Style Group: Branding */}
                        <div className={`style-group ${activeStyleGroup === 'branding' ? 'is-active' : ''}`}>
                          <button 
                            className="style-group__header" 
                            type="button" 
                            onClick={() => setActiveStyleGroup(activeStyleGroup === 'branding' ? null : 'branding')}
                            aria-expanded={activeStyleGroup === 'branding'}
                          >
                            <span className="style-group__icon">
                              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="10" cy="10" r="6.5" />
                                <path d="M10 6.5v3.2l2.2 2.2" />
                              </svg>
                            </span>
                            <span className="style-group__text">
                              <span className="style-group__title">Branding</span>
                              <span className="style-group__current">Shape &amp; logo</span>
                            </span>
                            <svg className="style-group__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 7.5l5 5 5-5" />
                            </svg>
                          </button>
                          {activeStyleGroup === 'branding' && (
                            <div className="style-group__body" style={{ display: 'block' }}>
                              
                              {/* Accordion Shape & Border */}
                              <div className={`accordion-item ${activeAccordionItem === 'shape' ? 'is-open' : ''}`}>
                                <button 
                                  className="accordion-header" 
                                  type="button"
                                  onClick={() => setActiveAccordionItem(activeAccordionItem === 'shape' ? null : 'shape')}
                                >
                                  <span className="accordion-header__icon">
                                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="10" cy="10" r="6.5" />
                                    </svg>
                                  </span>
                                  <span className="accordion-header__text">
                                    <span className="accordion-header__title">Profile Photo Shape</span>
                                    <span className="accordion-header__current" style={{ textTransform: 'capitalize' }}>{customization.profileShape.replace('-', ' ')}</span>
                                  </span>
                                  <svg className="accordion-header__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 7.5l5 5 5-5" />
                                  </svg>
                                </button>
                                {activeAccordionItem === 'shape' && (
                                  <div className="accordion-body" style={{ display: 'block' }}>
                                    <div className="accordion-body__inner">
                                      <p className="accordion-body__desc">Choose the outline shape of your profile picture.</p>
                                      <div className="option-grid">
                                        {[
                                          { id: 'circle', label: 'Circle' },
                                          { id: 'rounded-square', label: 'Rounded Sq' },
                                          { id: 'square', label: 'Square' },
                                          { id: 'hexagon', label: 'Hexagon' },
                                          { id: 'diamond', label: 'Diamond' },
                                          { id: 'premium-frame', label: 'Premium Frame' }
                                        ].map(shape => (
                                          <div 
                                            key={shape.id} 
                                            onClick={() => updateCustomization({ profileShape: shape.id })}
                                            className={`option-card ${customization.profileShape === shape.id ? 'is-selected' : ''}`}
                                          >
                                            <div className={`mini-shape ${shape.id}`} />
                                            <span className="option-card__label">{shape.label}</span>
                                          </div>
                                        ))}
                                      </div>

                                      <p className="accordion-body__desc" style={{ marginTop: 18 }}>Profile border treatment.</p>
                                      <div className="option-grid">
                                        {[
                                          { id: 'none', label: 'No Border' },
                                          { id: 'white', label: 'White' },
                                          { id: 'gradient', label: 'Gradient' },
                                          { id: 'glow', label: 'Glow' },
                                          { id: 'premium-ring', label: 'Premium Ring' }
                                        ].map(border => (
                                          <div 
                                            key={border.id} 
                                            onClick={() => updateCustomization({ profileBorder: border.id })}
                                            className={`option-card ${customization.profileBorder === border.id ? 'is-selected' : ''}`}
                                          >
                                            <div className={`mini-border ${border.id}`} />
                                            <span className="option-card__label">{border.label}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Accordion Logo Position */}
                              <div className={`accordion-item ${activeAccordionItem === 'logo-position' ? 'is-open' : ''}`}>
                                <button 
                                  className="accordion-header" 
                                  type="button"
                                  onClick={() => setActiveAccordionItem(activeAccordionItem === 'logo-position' ? null : 'logo-position')}
                                >
                                  <span className="accordion-header__icon">
                                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x="3" y="4" width="14" height="12" rx="1.5" />
                                      <path d="M6 8h2M6 11h6" />
                                    </svg>
                                  </span>
                                  <span className="accordion-header__text">
                                    <span className="accordion-header__title">Logo Position</span>
                                    <span className="accordion-header__current" style={{ textTransform: 'capitalize' }}>{customization.logoPosition}</span>
                                  </span>
                                  <svg className="accordion-header__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 7.5l5 5 5-5" />
                                  </svg>
                                </button>
                                {activeAccordionItem === 'logo-position' && (
                                  <div className="accordion-body" style={{ display: 'block' }}>
                                    <div className="accordion-body__inner">
                                      <p className="accordion-body__desc">Determine where the company logo badge is aligned.</p>
                                      <div className="option-grid">
                                        {[
                                          { id: 'top-left', label: 'Top Left' },
                                          { id: 'top-right', label: 'Top Right' },
                                          { id: 'center', label: 'Center' },
                                          { id: 'bottom-left', label: 'Bottom Left' },
                                          { id: 'bottom-right', label: 'Bottom Right' },
                                          { id: 'hidden', label: 'Hidden' }
                                        ].map(pos => (
                                          <div 
                                            key={pos.id} 
                                            onClick={() => updateCustomization({ logoPosition: pos.id })}
                                            className={`option-card ${customization.logoPosition === pos.id ? 'is-selected' : ''}`}
                                          >
                                            <span className="option-card__label">{pos.label}</span>
                                            <div className="option-card__indicator" />
                                          </div>
                                        ))}
                                      </div>

                                      <p className="accordion-body__desc" style={{ marginTop: 18 }}>Logo size.</p>
                                      <div className="slider-container">
                                        <div className="slider-row">
                                          <input 
                                            type="range" 
                                            className="studio-slider" 
                                            min="50" 
                                            max="150" 
                                            value={customization.logoSize} 
                                            onChange={(e) => updateCustomization({ logoSize: parseInt(e.target.value) })}
                                          />
                                          <span className="slider-value">{customization.logoSize}%</span>
                                        </div>
                                        <div className="slider-labels">
                                          <span>50%</span>
                                          <span>150%</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Continue Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                    <button 
                      onClick={() => setCurrentStep(2)}
                      className="btn-primary" 
                      id="step1ContinueBtn" 
                      type="button" 
                      style={{ width: '100%', justifyContent: 'center', padding: '14px 28px' }}
                    >
                      Continue to Style
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 10h12M11 5l5 5-5 5" />
                      </svg>
                    </button>
                  </div>

                </div>

                {/* Right Panel: AI Design Suggestions */}
                <div className="studio-right">
                  <div className="studio-section" style={{ position: 'sticky', top: 16 }}>
                    <div className="studio-section__header">
                      <span className="studio-section__title">✨ AI Design Studio</span>
                    </div>
                    <p className="studio-section__desc">Select curated layout configurations to instantly transform your card.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {AI_PRESETS.map(preset => (
                        <div key={preset.id} className="ai-preset-card">
                          <div className="ai-preset-card__header">
                            <span className="ai-preset-card__title">{preset.title}</span>
                            <span className="ai-preset-card__badge">{preset.badge}</span>
                          </div>
                          <div className="ai-preset-card__tags">
                            {preset.tags.map(t => (
                              <span key={t} className="ai-preset-card__tag">{t}</span>
                            ))}
                          </div>
                          <button 
                            type="button" 
                            className="ai-preset-card__btn"
                            onClick={() => handleAiPresetClick(preset)}
                          >
                            Apply Design
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: Brand */}
          {currentStep === 2 && (
            <div className="step-panel is-active" id="stepPanel2">
              <div className="panel brand-panel-container">
                
                {/* Brand Color Section */}
                <div className="brand-section">
                  <h4 className="brand-section-title brand-color-title">Brand color</h4>
                  <div className="color-picker-wrap">
                    <div className="hue-slider-wrap">
                      <input 
                        type="range" 
                        className="hue-slider" 
                        min="0" 
                        max="360" 
                        value={hexToHue(applyInstantly ? brandColor : pendingBrandColor)} 
                        onChange={handleSliderChange}
                      />
                      <div 
                        className="hue-thumb" 
                        style={{ left: `${(hexToHue(applyInstantly ? brandColor : pendingBrandColor) / 360) * 100}%` }} 
                      />
                    </div>
                    <div className="color-meta-row">
                      <div 
                        className="color-preview-swatch" 
                        style={{ backgroundColor: applyInstantly ? brandColor : pendingBrandColor }} 
                      />
                      <input 
                        className="color-hex-input" 
                        value={applyInstantly ? brandColor : pendingBrandColor} 
                        onChange={handleHexChange} 
                        maxLength={7} 
                        spellCheck="false" 
                      />
                      <button 
                        onClick={handleEyedropper}
                        className="eyedropper-btn" 
                        type="button" 
                        title="Pick color from screen"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                          <path d="m2 22 1-1c.5-.5.5-1.3 0-1.8L16.2 6.4c1.1-1.1 2.9-1.1 4 0l.4.4c1.1 1.1 1.1 2.9 0 4L7.8 23c-.5.5-1.3.5-1.8 0Z" />
                          <path d="m14 4 6 6" />
                          <path d="m5 17-3 3" />
                        </svg>
                      </button>
                    </div>
                    <div className="preset-swatches">
                      {BRAND_SWATCHES.map(hex => (
                        <button 
                          key={hex}
                          onClick={() => handleSwatchClick(hex)}
                          className={`swatch-btn ${(applyInstantly ? brandColor : pendingBrandColor).toLowerCase() === hex.toLowerCase() ? 'is-active' : ''}`}
                          style={{ backgroundColor: hex }}
                          type="button"
                          aria-label={`Select color ${hex}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Popular Gradients Section */}
                <div className="brand-section">
                  <h4 className="brand-section-title">Popular gradients</h4>
                  <div className="gradient-grid">
                    {POPULAR_GRADIENTS.map(grad => {
                      const isSelected = applyInstantly ? (activeGradientId === grad.id) : (pendingGradientId === grad.id);
                      return (
                        <div 
                          key={grad.id}
                          onClick={() => handleGradientClick(grad)}
                          className={`gradient-card ${isSelected ? 'is-selected' : ''}`}
                        >
                          <div className="gradient-thumb" style={{ background: grad.gradient }} />
                          <span className="gradient-name">{grad.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Style Templates Section */}
                <div className="brand-section">
                  <h4 className="brand-section-title">Card style templates</h4>
                  <div className="template-grid">
                    {STYLE_TEMPLATES.map(temp => {
                      const isSelected = applyInstantly ? (activeTemplateId === temp.id) : (pendingTemplateId === temp.id);
                      const grad = POPULAR_GRADIENTS.find(g => g.id === temp.gradientId);
                      const bgStyle = temp.gradient 
                        ? temp.gradient 
                        : (grad ? grad.gradient : temp.accent);
                      return (
                        <div 
                          key={temp.id}
                          onClick={() => handleTemplateClick(temp)}
                          className={`template-card ${isSelected ? 'is-selected' : ''}`}
                        >
                          <div className="template-thumb" style={{ background: bgStyle }} />
                          <span className="template-name">{temp.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              <footer className="step-nav">
                <div className="toggle-container">
                  <label className="switch-wrap">
                    <input 
                      type="checkbox" 
                      checked={applyInstantly} 
                      onChange={handleApplyToggle}
                    />
                    <span className="switch-slider" />
                  </label>
                  <div className="toggle-text-wrap">
                    <span className="toggle-title">Apply changes instantly</span>
                    <span className="toggle-desc">See your changes in real time on the preview.</span>
                  </div>
                </div>
                <div className="step-nav-actions">
                  <button onClick={() => setCurrentStep(1)} className="btn-secondary" type="button">Back</button>
                  <button onClick={handleStep2Continue} className="btn-primary" type="button">
                    Continue
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 10h12M11 5l5 5-5 5" />
                    </svg>
                  </button>
                </div>
              </footer>
            </div>
          )}

          {/* STEP 3: Complete Profile Details */}
          {currentStep === 3 && (
            <div className="step-panel is-active">
              <div className="step3-layout">
                
                {/* Main Accordion Lists */}
                <div className="step3-main">
                  
                  {Object.entries(ACCORDION_GROUPS).map(([groupKey, groupItems]) => {
                    const isOpen = activeAccordions[groupKey] ?? false;
                    return (
                      <div key={groupKey} className={`accordion ${isOpen ? 'is-open' : ''}`}>
                        <div className="accordion-header" onClick={() => setActiveAccordions({ ...activeAccordions, [groupKey]: !isOpen })}>
                          <div className="accordion-icon">
                            {renderIcon(groupKey === 'basic' ? 'user' : groupKey === 'contact' ? 'mail' : groupKey === 'social' ? 'link' : 'chat')}
                          </div>
                          <span className="accordion-title">
                            {groupKey === 'basic' && 'Basic Information'}
                            {groupKey === 'contact' && 'Contact Information'}
                            {groupKey === 'social' && 'Social Profiles'}
                            {groupKey === 'messaging' && 'Messaging Apps'}
                          </span>
                          <div className="accordion-chevron">
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                              <path d="M5 8l5 5 5-5" />
                            </svg>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="accordion-content">
                            <div className="accordion-fields-grid">
                              {groupItems.map((item) => {
                                const filled = item.isName
                                  ? !!(firstName || lastName)
                                  : !!fields[item.key]?.value;

                                const valueText = item.isName
                                  ? [firstName, lastName].filter(Boolean).join(' ') || 'Add name'
                                  : fields[item.key]?.value || `Add ${item.label}`;

                                const iconColor = filled ? (SOCIAL_COLORS[item.key] || 'var(--coral)') : 'var(--ink-3)';
                                const iconBgColor = ICON_BG_COLORS[item.key] || ICON_BG_COLORS[item.icon] || (filled ? '#F0FDF4' : '#f5f3f0');

                                return (
                                  <div key={item.key} className={`field-card ${filled ? 'is-active' : 'is-inactive'}`} onClick={() => openFieldModal(item.key)}>
                                    <div className="field-card__icon" style={{ background: iconBgColor, color: iconColor }}>
                                      {renderIcon(item.icon, { style: { width: 12, height: 12, color: iconColor } })}
                                    </div>
                                    <div className="field-card__info">
                                      <div className="field-card__label">{item.label}</div>
                                      <div className="field-card__value">{valueText}</div>
                                    </div>
                                    <div className="field-card__action">
                                      {filled ? (
                                        <svg viewBox="0 0 20 20" fill="none" stroke="#38A169" strokeWidth="2.5" strokeLinecap="round" style={{ width: 10, height: 10 }}>
                                          <path d="M4.5 10.3l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      ) : (
                                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 10, height: 10 }}>
                                          <path d="M10 4.5v11M4.5 10h11" />
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {groupKey === 'social' && (
                              <button className="dashed-add-btn" type="button" onClick={() => alert('Custom social link configurations coming soon!')}>
                                {renderIcon('plus', { style: { width: 14, height: 14 } })}
                                Add Custom Social Link
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Custom Fields Accordion */}
                  <div className={`accordion ${activeAccordions['custom'] ? 'is-open' : ''}`} data-type="custom">
                    <div className="accordion-header" onClick={() => setActiveAccordions({ ...activeAccordions, custom: !activeAccordions['custom'] })}>
                      <div className="accordion-icon" style={{ background: '#FAF5FF', color: '#805AD5' }}>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 16, height: 16 }}>
                          <rect x="3.5" y="4.5" width="13" height="12" rx="1.6" />
                          <path d="M7 4.5v-1.5M13 4.5v-1.5M3.5 8.5h13M7 12h2M11 12h2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <span className="accordion-title">Custom Fields</span>
                      <div className="accordion-chevron">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                          <path d="M5 8l5 5 5-5" />
                        </svg>
                      </div>
                    </div>
                    {activeAccordions['custom'] && (
                      <div className="accordion-content">
                        <button className="dashed-add-btn" type="button" onClick={() => alert('Custom fields coming soon!')}>
                          {renderIcon('plus', { style: { width: 14, height: 14 } })}
                          Add Custom Field
                        </button>
                      </div>
                    )}
                  </div>

                </div>

                {/* Sidebar Cards */}
                <div className="step3-sidebar">
                  
                  {/* Completion Card */}
                  <div className="sidebar-card">
                    <div className="sidebar-card__title">Profile Completion</div>
                    <div className="completion-card-content">
                      <div className="completion-circle-wrap">
                        <svg className="completion-circle-svg" width="100" height="100" viewBox="0 0 100 100">
                          <circle className="completion-circle-bg" cx="50" cy="50" r="45" />
                          <circle className="completion-circle-fill" cx="50" cy="50" r="45" stroke={gradientStart} strokeDasharray="283" strokeDashoffset={283 * (1 - completionPercentage / 100)} />
                        </svg>
                        <div className="completion-circle-text">
                          <span className="completion-pct">{completionPercentage}%</span>
                          <span className="completion-lbl">Complete</span>
                        </div>
                      </div>

                      <div className="completion-checklist">
                        {COMPLETION_STEPS.map((step) => {
                          const done = step.check();
                          return (
                            <div key={step.label} className={`checklist-item ${done ? 'is-done' : 'is-pending'}`}>
                              <div className="checklist-item__label">
                                <div className="checklist-item__dot">
                                  {done && renderIcon('check', { style: { width: 8, height: 8 } })}
                                </div>
                                {step.label}
                              </div>
                              <div className="checklist-item__status">
                                {done ? (
                                  renderIcon('check', { style: { width: 12, height: 12 } })
                                ) : (
                                  <svg viewBox="0 0 20 20" fill="none" style={{ width: 12, height: 12 }}>
                                    <circle cx="10" cy="10" r="7" stroke="#F0C060" strokeWidth="1.8" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="completion-remaining">
                        {doneCount === COMPLETION_STEPS.length ? '🎉 Profile complete!' : `${COMPLETION_STEPS.length - doneCount} step(s) remaining`}
                      </div>
                    </div>
                  </div>

                  {/* Quick Add Card */}
                  <div className="sidebar-card">
                    <div className="sidebar-card__title">Quick Add</div>
                    <p style={{ fontSize: 11, color: 'var(--ink-3)', margin: '-8px 0 14px' }}>Add popular fields quickly</p>
                    <div className="quick-add-grid">
                      {QUICK_ADD_FIELDS.map((f) => (
                        <button key={f.key} onClick={() => openFieldModal(f.key)} className="quick-add-pill" type="button">
                          <span className="quick-add-pill__icon">{renderIcon(f.icon, { style: { width: 12, height: 12 } })}</span>
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tips Sidebar Card */}
                  <div className="tip-card-sidebar">
                    <div className="tip-card-sidebar__icon">{renderIcon('alert')}</div>
                    <div>
                      <div className="tip-card-sidebar__title">Tip</div>
                      <div className="tip-card-sidebar__text">Add more details to make it easier for people to connect with you.</div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Step 3 Footer Nav */}
              <footer className="step-nav" style={{ marginTop: 24 }}>
                <div className="step-nav-actions" style={{ gap: 10 }}>
                  <button onClick={() => setCurrentStep(2)} className="btn-secondary" type="button">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, marginRight: 4, display: 'inline-block' }}>
                      <path d="M16 10H4M9 5l-5 5 5 5" />
                    </svg>
                    Back
                  </button>
                  <button onClick={saveCard} className="btn-secondary" type="button" style={{ gap: 7 }}>
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginRight: 4, display: 'inline-block' }}>
                      <path d="M15.5 17H4.5A1.5 1.5 0 013 15.5V4.5A1.5 1.5 0 014.5 3H13l4 4v8.5A1.5 1.5 0 0115.5 17z" />
                      <path d="M13 17v-6H7v6M7 3v4h5" />
                    </svg>
                    Save Draft
                  </button>
                </div>
                <button onClick={() => {
                  if (!isAuthenticated || !user) {
                    setShowAuthGate(true);
                    return;
                  }
                  alert('Congratulations! Your digital business card has been published.');
                }} className="btn-primary" type="button">
                  Continue
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, marginLeft: 4, display: 'inline-block' }}>
                    <path d="M4 10h12M11 5l5 5-5 5" />
                  </svg>
                </button>
              </footer>
            </div>
          )}

        </section>
      </main>

      {/* ── MODALS FOR DYNAMIC INPUTS ── */}
      {activeModalKey && (
        <div className="modal-overlay is-open">
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-head">
              <h3 className="modal-title">
                {activeModalKey === 'name' ? 'Name' : getFieldConfig(activeModalKey)?.label}
              </h3>
              <button onClick={() => setActiveModalKey(null)} className="modal-close" type="button">×</button>
            </div>
            
            <div className="modal-body">
              {activeModalKey === 'name' ? (
                /* Name Modal Body */
                <div className="form-row form-row--split">
                  <div style={{ flex: 1 }}>
                    <label className="form-label">First name</label>
                    <input className="form-input" value={modalValue} onChange={(e) => setModalValue(e.target.value)} placeholder="First name" required />
                    {!modalValue.trim() && (
                      <div className="form-error" style={{ display: 'flex', gap: 4, alignItems: 'center', color: '#E53E3E', fontSize: 10, marginTop: 4 }}>
                        {renderIcon('alert', { style: { width: 10, height: 10 } })}
                        <span>Required</span>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Last name</label>
                    <input className="form-input" value={modalLabel} onChange={(e) => setModalLabel(e.target.value)} placeholder="Last name" />
                  </div>
                </div>
              ) : getFieldConfig(activeModalKey)?.modal === 'phone' ? (
                /* Phone Modal Body */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="form-row phone-row" style={{ display: 'flex', gap: 8 }}>
                    <select className="country-select" value={modalCountry} onChange={(e) => setModalCountry(e.target.value)} style={{ background: '#FAF7F2', border: '1px solid #E2D9D0', padding: 8, borderRadius: 8, fontSize: 12 }}>
                      <option value="+1">US +1</option>
                      <option value="+44">GB +44</option>
                      <option value="+91">IN +91</option>
                      <option value="+61">AU +61</option>
                      <option value="+971">AE +971</option>
                      <option value="+65">SG +65</option>
                    </select>
                    <input className="form-input" style={{ flex: 1 }} value={modalValue} onChange={(e) => setModalValue(e.target.value)} placeholder="(201) 555-0123" required />
                    <input className="form-input" style={{ width: 60 }} value={modalExt} onChange={(e) => setModalExt(e.target.value)} placeholder="Ext." />
                  </div>
                  {!modalValue.trim() && (
                    <div className="form-error" style={{ display: 'flex', gap: 4, alignItems: 'center', color: '#E53E3E', fontSize: 10 }}>
                      {renderIcon('alert', { style: { width: 10, height: 10 } })}
                      <span>Required</span>
                    </div>
                  )}
                  <label className="checkbox-row" style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11, color: 'var(--ink-2)' }}>
                    <input type="checkbox" defaultChecked /> International format
                  </label>
                  <div className="form-row">
                    <label className="form-label">Label</label>
                    <input className="form-input" value={modalLabel} onChange={(e) => setModalLabel(e.target.value)} placeholder="Mobile" />
                    <p className="suggest-label">Suggestions:</p>
                    <div className="chip-row">
                      {['Cell', 'Mobile', 'Work', 'Home'].map((s) => (
                        <button key={s} onClick={() => setModalLabel(s)} className={`chip ${modalLabel === s ? 'is-active' : ''}`} type="button">{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* General Text Field Body */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="form-row">
                    <label className="form-label">{getFieldConfig(activeModalKey)?.label}</label>
                    <input className="form-input" value={modalValue} onChange={(e) => setModalValue(e.target.value)} placeholder={getFieldConfig(activeModalKey)?.placeholder} required />
                    {!modalValue.trim() && (
                      <div className="form-error" style={{ display: 'flex', gap: 4, alignItems: 'center', color: '#E53E3E', fontSize: 10, marginTop: 4 }}>
                        {renderIcon('alert', { style: { width: 10, height: 10 } })}
                        <span>Required</span>
                      </div>
                    )}
                  </div>
                  {getFieldConfig(activeModalKey)?.suggestions && (
                    <div className="form-row">
                      <label className="form-label">Label (optional)</label>
                      <input className="form-input" value={modalLabel} onChange={(e) => setModalLabel(e.target.value)} placeholder={getFieldConfig(activeModalKey)?.label} />
                      <p className="suggest-label">Suggestions:</p>
                      <div className="chip-row">
                        {getFieldConfig(activeModalKey)?.suggestions?.map((s) => (
                          <button key={s} onClick={() => setModalLabel(s)} className={`chip ${modalLabel === s ? 'is-active' : ''}`} type="button">{s}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-foot">
              <button onClick={deleteModalField} className="icon-btn" type="button" title="Delete field">
                🗑
              </button>
              <div className="modal-foot-actions">
                <button onClick={() => setActiveModalKey(null)} className="btn-ghost" type="button">Cancel</button>
                <button onClick={saveModalField} className="btn-modal-primary" type="button">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Auth Gate Modal */}
      {showAuthGate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(28, 20, 16, 0.70)', backdropFilter: 'blur(8px)',
          zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{
            background: '#FAF7F2', borderRadius: 20, maxWidth: 420, width: '100%', overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(107,26,42,0.3)', animation: 'fadeUp 0.4s ease',
          }}>
            {/* Gradient Header */}
            <div style={{
              background: 'linear-gradient(135deg, #6B1A2A, #8B2535)', padding: '32px 28px 24px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(201,168,76,0.15)' }} />
              <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(184,92,110,0.2)' }} />
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12, background: '#C9A84C', margin: '0 auto 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#6B1A2A', fontWeight: 700,
                }}>✦</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                  Save Your Card
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                  Sign in or create a free account to save your beautiful card and access it from anywhere.
                </p>
              </div>
            </div>

            {/* Features */}
            <div style={{ padding: '22px 28px 8px' }}>
              {[
                { icon: '💾', text: 'Save & manage unlimited business cards' },
                { icon: '✉️', text: 'Generate email signatures instantly' },
                { icon: '📊', text: 'Track card views & analytics' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', fontSize: 13.5, color: '#1C1410', fontWeight: 500 }}>
                  <span style={{ fontSize: 18 }}>{f.icon}</span> {f.text}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ padding: '16px 28px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/login?redirect=/create-card" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'linear-gradient(135deg, #6B1A2A, #8B2535)', color: '#fff', border: 'none',
                padding: '13px 20px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                textDecoration: 'none', boxShadow: '0 4px 16px rgba(107,26,42,0.25)',
                transition: 'all 0.2s',
              }}>
                Sign In to Save
              </Link>
              <Link href="/login?redirect=/create-card" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'transparent', color: '#6B1A2A', border: '1.5px solid #6B1A2A',
                padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                textDecoration: 'none', transition: 'all 0.2s',
              }}>
                Create Free Account
              </Link>
              <button onClick={() => setShowAuthGate(false)} style={{
                background: 'none', border: 'none', color: '#7A6860', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', padding: '8px 0', marginTop: 4,
              }}>
                Continue without saving →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
