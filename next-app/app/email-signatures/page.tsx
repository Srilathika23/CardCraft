'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import QRCode from 'qrcode';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Mail,
  Phone,
  Globe,
  Copy,
  Check,
  Send,
  Sparkles,
  Laptop,
  ChevronDown,
  ExternalLink,
  FileCode,
  Share2,
  Inbox,
  ArrowRight,
  Info,
  Layers,
  User,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/app/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function EmailSignaturePage() {
  const { user, isAuthenticated } = useAuth();
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [includeQr, setIncludeQr] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Navigation active state
  const [activeTab, setActiveTab] = useState<'info' | 'socials' | 'style'>('info');

  // Input states for signature builder
  const [fullName, setFullName] = useState('Alexandra Thorne');
  const [jobTitle, setJobTitle] = useState('Director of Wealth Management');
  const [company, setCompany] = useState('Aurelia Group');
  const [phone, setPhone] = useState('+1 (555) 782-9011');
  const [email, setEmail] = useState('a.thorne@aureliagroup.com');
  const [website, setWebsite] = useState('www.aureliagroup.com');
  const [cardId, setCardId] = useState('alexandra-thorne');
  
  // Social links
  const [linkedin, setLinkedin] = useState('https://linkedin.com/in/alexandra-thorne');
  const [twitter, setTwitter] = useState('https://twitter.com/alexandra_thorne');
  const [github, setGithub] = useState('https://github.com/alexandra-thorne');

  // Custom styling states
  const [layoutStyle, setLayoutStyle] = useState<'premium' | 'minimalist' | 'banner'>('premium');
  const [themeColor, setThemeColor] = useState<'burgundy' | 'gold' | 'ink'>('burgundy');

  // Highlight/Flash state for micro-interactions
  const [lastUpdatedField, setLastUpdatedField] = useState<string | null>(null);
  const [updateTimers, setUpdateTimers] = useState<Record<string, NodeJS.Timeout>>({});

  // Copy and Share actions states
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyHtmlSuccess, setCopyHtmlSuccess] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('Great connecting with you! Please find my digital business card and signature attached below.');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error' | null; message: string; previewUrl?: string }>({
    type: null,
    message: ''
  });

  // FAQ states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Connection status state
  const [backendOnline, setBackendOnline] = useState(false);

  // Check connection to backend on mount
  useEffect(() => {
    fetch(API_BASE.replace('/api', ''))
      .then(res => {
        if (res.ok) setBackendOnline(true);
      })
      .catch(() => setBackendOnline(false));
  }, []);

  // Generate QR Code dynamically client-side for builder preview
  useEffect(() => {
    let qrValue = '';
    
    if (cardId && cardId !== 'preview' && cardId !== 'alexandra-thorne') {
      qrValue = `${window.location.origin}/card/${cardId}`;
    } else {
      let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;${fullName || ''};;;\nFN:${fullName || ''}\n`;
      if (jobTitle) vcard += `TITLE:${jobTitle}\n`;
      if (company) vcard += `ORG:${company}\n`;
      if (email) vcard += `EMAIL;TYPE=PREF,INTERNET:${email}\n`;
      if (phone) vcard += `TEL;TYPE=CELL,VOICE:${phone}\n`;
      if (website) vcard += `URL:${website}\n`;
      if (linkedin) vcard += `URL;type=linkedin:${linkedin}\n`;
      if (twitter) vcard += `URL;type=x:${twitter}\n`;
      if (github) vcard += `URL;type=github:${github}\n`;
      vcard += 'END:VCARD';
      qrValue = vcard;
    }

    const primaryColorHex = themeColor === 'burgundy' ? '#6B1A2A' : themeColor === 'gold' ? '#C9A84C' : '#1C1410';

    QRCode.toDataURL(qrValue, {
      color: {
        dark: primaryColorHex,
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
  }, [fullName, jobTitle, company, phone, email, website, linkedin, twitter, github, cardId, themeColor]);

  // Trigger preview element highlight animation
  const triggerHighlight = (field: string) => {
    setLastUpdatedField(field);
    
    if (updateTimers[field]) {
      clearTimeout(updateTimers[field]);
    }
    
    const timer = setTimeout(() => {
      setLastUpdatedField(null);
    }, 700);
    
    setUpdateTimers(prev => ({
      ...prev,
      [field]: timer
    }));
  };

  // Compile the signature HTML for raw copying / email preview
  const getSignatureHtml = () => {
    const primaryColor = themeColor === 'burgundy' ? '#6B1A2A' : themeColor === 'gold' ? '#C9A84C' : '#1C1410';
    const accentColor = '#C9A84C'; // Champagne Gold Accent
    const borderColor = '#E2D9D0'; // Warm border
    const textMuted = '#7A6860';
    const textDark = '#1C1410';

    let socialsHtml = '';
    if (linkedin) socialsHtml += `<a href="${linkedin}" style="color:${accentColor}; text-decoration:none; margin-right:12px; font-weight:600; font-size:13px;" target="_blank">LinkedIn</a>`;
    if (twitter) socialsHtml += `<a href="${twitter}" style="color:${accentColor}; text-decoration:none; margin-right:12px; font-weight:600; font-size:13px;" target="_blank">X</a>`;
    if (github) socialsHtml += `<a href="${github}" style="color:${accentColor}; text-decoration:none; font-weight:600; font-size:13px;" target="_blank">GitHub</a>`;

    let qrDataText = '';
    if (cardId && cardId !== 'preview' && cardId !== 'alexandra-thorne') {
      qrDataText = `${window.location.origin}/card/${cardId}`;
    } else {
      let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;${fullName || ''};;;\nFN:${fullName || ''}\n`;
      if (jobTitle) vcard += `TITLE:${jobTitle}\n`;
      if (company) vcard += `ORG:${company}\n`;
      if (email) vcard += `EMAIL;TYPE=PREF,INTERNET:${email}\n`;
      if (phone) vcard += `TEL;TYPE=CELL,VOICE:${phone}\n`;
      if (website) vcard += `URL:${website}\n`;
      if (linkedin) vcard += `URL;type=linkedin:${linkedin}\n`;
      if (twitter) vcard += `URL;type=x:${twitter}\n`;
      if (github) vcard += `URL;type=github:${github}\n`;
      vcard += 'END:VCARD';
      qrDataText = vcard;
    }
    const qrImgUrl = `${API_BASE}/cards/qr/generate?data=${encodeURIComponent(qrDataText)}&color=${encodeURIComponent(primaryColor)}`;

    if (layoutStyle === 'premium') {
      return `
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width:500px; color:${textDark};">
          <tr>
            <!-- Left Side Solid Accent Bar -->
            <td style="width:4px; background-color:${primaryColor}; border-radius:2px; padding:0;"></td>
            
            <!-- Right Side Main Content -->
            <td style="padding:4px 0 4px 18px; vertical-align:top;">
              <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td>
                    <h3 style="margin:0; font-size:18px; font-weight:700; color:${primaryColor}; letter-spacing:0.5px; line-height:1.2;">${fullName}</h3>
                    ${jobTitle ? `<div style="font-size:13px; font-weight:600; color:${accentColor}; margin-top:2px;">${jobTitle}</div>` : ''}
                    ${company ? `<div style="font-size:13px; color:${textMuted}; font-weight:500; margin-top:1px;">${company}</div>` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:12px;">
                    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:13px; color:${textDark};">
                      ${phone ? `<tr><td style="padding-bottom:3px;"><span style="color:${primaryColor}; font-weight:600; margin-right:6px;">P:</span><a href="tel:${phone}" style="color:${textDark}; text-decoration:none;">${phone}</a></td></tr>` : ''}
                      ${email ? `<tr><td style="padding-bottom:3px;"><span style="color:${primaryColor}; font-weight:600; margin-right:6px;">E:</span><a href="mailto:${email}" style="color:${textDark}; text-decoration:none;">${email}</a></td></tr>` : ''}
                      ${website ? `<tr><td style="padding-bottom:3px;"><span style="color:${primaryColor}; font-weight:600; margin-right:6px;">W:</span><a href="https://${website}" style="color:${textDark}; text-decoration:none;" target="_blank">${website}</a></td></tr>` : ''}
                    </table>
                  </td>
                </tr>
                ${socialsHtml ? `
                <tr>
                  <td style="padding-top:12px; border-top:1px solid ${borderColor}; margin-top:8px;">
                    ${socialsHtml}
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding-top:14px;">
                    <a href="http://localhost:3000/cards/${cardId || 'preview'}" style="background-color:${accentColor}; color:#1C1410; font-size:11px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; text-decoration:none; padding:8px 16px; border-radius:4px; display:inline-block; border-collapse:collapse;" target="_blank">
                      View Digital Business Card
                    </a>
                  </td>
                </tr>
              </table>
            </td>

            ${includeQr ? `
            <!-- QR Code Column -->
            <td style="padding-left:18px; border-left:1px solid ${borderColor}; vertical-align:middle; text-align:center; width:90px;">
              <img src="${qrImgUrl}" width="80" height="80" style="display:block; border:none; margin:0 auto;" alt="Scan QR Code" />
              <div style="font-size: 8px; color: ${textMuted}; text-align: center; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family:-apple-system, BlinkMacSystemFont, sans-serif;">Scan Contact</div>
            </td>
            ` : ''}
          </tr>
        </table>
      `;
    } else if (layoutStyle === 'minimalist') {
      return `
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width:500px; color:${textDark};">
          <tr>
            <td style="padding:0; vertical-align:top;">
              <div style="font-size:16px; font-weight:700; color:${textDark};">${fullName}</div>
              ${jobTitle ? `<div style="font-size:12px; color:${textMuted}; font-style:italic; margin-top:1px;">${jobTitle} at ${company}</div>` : ''}
              
              <div style="font-size:12px; margin-top:8px; line-height:1.5;">
                ${phone ? `<span style="margin-right:12px;"><a href="tel:${phone}" style="color:${textDark}; text-decoration:none;">${phone}</a></span>` : ''}
                ${email ? `<span style="margin-right:12px;"><a href="mailto:${email}" style="color:${textDark}; text-decoration:none;">${email}</a></span>` : ''}
                ${website ? `<span><a href="https://${website}" style="color:${textDark}; text-decoration:none;" target="_blank">${website}</a></span>` : ''}
              </div>
              
              ${socialsHtml ? `<div style="margin-top:6px;">${socialsHtml}</div>` : ''}
              
              <div style="margin-top:10px; font-size:11px;">
                <a href="http://localhost:3000/cards/${cardId || 'preview'}" style="color:${primaryColor}; text-decoration:underline; font-weight:600;" target="_blank">CardCraft Digital Business Card &rarr;</a>
              </div>
            </td>

            ${includeQr ? `
            <!-- QR Code Column -->
            <td style="padding-left:18px; border-left:1px solid ${borderColor}; vertical-align:middle; text-align:center; width:90px;">
              <img src="${qrImgUrl}" width="80" height="80" style="display:block; border:none; margin:0 auto;" alt="Scan QR Code" />
              <div style="font-size: 8px; color: ${textMuted}; text-align: center; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family:-apple-system, BlinkMacSystemFont, sans-serif;">Scan Contact</div>
            </td>
            ` : ''}
          </tr>
        </table>
      `;
    } else { // Banner Layout
      return `
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width:480px; border:1px solid ${borderColor}; border-radius:8px; overflow:hidden;">
          <tr>
            <td style="background-color:${primaryColor}; padding:16px 20px; color:#FAF7F2;">
              <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                <tr>
                  <td>
                    <div style="font-size:16px; font-weight:700; color:#FAF7F2;">${fullName}</div>
                    <div style="font-size:12px; color:#FAF7F2; opacity:0.8; margin-top:2px;">${jobTitle} | ${company}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px; background-color:#ffffff;">
              <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; font-size:12px; line-height:1.6; color:${textDark};">
                <tr>
                  <td style="vertical-align:top;">
                    ${phone ? `<div><strong style="color:${textMuted};">Cell:</strong> <a href="tel:${phone}" style="color:${textDark}; text-decoration:none;">${phone}</a></div>` : ''}
                    ${email ? `<div><strong style="color:${textMuted};">Email:</strong> <a href="mailto:${email}" style="color:${textDark}; text-decoration:none;">${email}</a></div>` : ''}
                    ${website ? `<div><strong style="color:${textMuted};">Web:</strong> <a href="https://${website}" style="color:${textDark}; text-decoration:none;" target="_blank">${website}</a></div>` : ''}
                  </td>
                  ${includeQr ? `
                  <!-- QR Code Column -->
                  <td style="padding-left:16px; border-left:1px solid ${borderColor}; vertical-align:middle; text-align:center; width:90px;">
                    <img src="${qrImgUrl}" width="80" height="80" style="display:block; border:none; margin:0 auto;" alt="Scan QR Code" />
                    <div style="font-size: 8px; color: ${textMuted}; text-align: center; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family:-apple-system, BlinkMacSystemFont, sans-serif;">Scan Contact</div>
                  </td>
                  ` : ''}
                </tr>
                ${socialsHtml ? `
                <tr>
                  <td colspan="${includeQr ? 2 : 1}" style="padding-top:10px; border-top:1px solid ${borderColor}; margin-top:8px;">
                    ${socialsHtml}
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td colspan="${includeQr ? 2 : 1}" style="padding-top:12px;">
                    <a href="http://localhost:3000/cards/${cardId || 'preview'}" style="color:${primaryColor}; font-weight:bold; text-decoration:none;" target="_blank">Connect with me on CardCraft &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
    }
  };

  // Modern Rich Text Copy Action
  const handleCopyRichText = async () => {
    if (!isAuthenticated || !user) {
      setShowAuthGate(true);
      return;
    }
    const container = document.getElementById('signature-render-container');
    if (!container) return;

    try {
      const htmlContent = getSignatureHtml();
      const plainText = `${fullName}\n${jobTitle} | ${company}\nPhone: ${phone}\nEmail: ${email}\nWebsite: ${website}\nCardCraft Digital Card: http://localhost:3000/cards/${cardId || 'preview'}`;
      
      const blobHtml = new Blob([htmlContent], { type: 'text/html' });
      const blobText = new Blob([plainText], { type: 'text/plain' });
      
      const clipboardData = [
        new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText
        })
      ];

      await navigator.clipboard.write(clipboardData);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback
      const range = document.createRange();
      range.selectNode(container);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (e) {
        console.error('Fallback copy failed', e);
      }
      window.getSelection()?.removeAllRanges();
    }
  };

  // Raw HTML Source Copy Action
  const handleCopyRawHtml = async () => {
    if (!isAuthenticated || !user) {
      setShowAuthGate(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(getSignatureHtml().trim());
      setCopyHtmlSuccess(true);
      setTimeout(() => setCopyHtmlSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy html source', err);
    }
  };

  // Send Signature/Card via Email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) return;

    setSendingEmail(true);
    setEmailStatus({ type: null, message: '' });

    try {
      const res = await fetch(`${API_BASE}/auth/email-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          senderName: fullName,
          senderTitle: jobTitle,
          senderCompany: company,
          senderPhone: phone,
          senderEmail: email,
          senderWebsite: website,
          cardId: cardId,
          socialLinks: {
            linkedin,
            twitter,
            github
          },
          message: emailMessage
        })
      });

      const data = await res.json();

      if (res.ok) {
        setEmailStatus({
          type: 'success',
          message: data.message,
          previewUrl: data.previewUrl
        });
        setRecipientEmail('');
      } else {
        setEmailStatus({
          type: 'error',
          message: data.message || 'Failed to send email.'
        });
      }
    } catch (err) {
      console.error('Mail dispatch error:', err);
      setEmailStatus({
        type: 'error',
        message: 'Network connection failed. Make sure the backend server is running on port 5000.'
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleOpenMailApp = async () => {
    // 1. Copy the rich signature to clipboard
    await handleCopyRichText();
    
    // 2. Format mailto link
    const subject = `Contact Info: ${fullName}`;
    const body = `${emailMessage}\n\n[Paste (Ctrl+V) your signature here]`;
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // 3. Open mail client
    window.location.href = mailtoUrl;
    
    // 4. Set success message
    setEmailStatus({
      type: 'success',
      message: 'Signature copied to clipboard! Opening your default mail app... simply paste (Ctrl+V) it in the email body.'
    });
    
    // Clear recipient email
    setRecipientEmail('');
  };

  const faqData = [
    {
      q: "What is an email signature?",
      a: "An email signature is a block of styled text and links appended to the bottom of outgoing emails. It establishes your professional identity, presents key contact links, and makes it easy for recipients to connect with you."
    },
    {
      q: "How do I add my generated signature to Gmail?",
      a: "Click the 'Copy Signature' button to copy the signature to your clipboard. Open Gmail, go to Settings (cog icon) > See all settings. Scroll down to the 'Signature' section, click '+ Create new', name it, and paste (Ctrl+V or Cmd+V) directly into the editor box. Select your new signature under Signature Defaults, then scroll to the bottom and click 'Save Changes'."
    },
    {
      q: "How do I add my generated signature to Outlook?",
      a: "Copy your signature using the 'Copy Signature' button. Open Outlook, go to File > Options > Mail > Signatures. Click 'New', name the signature, and paste the copied signature into the Edit Signature text area. Click 'OK' to save."
    },
    {
      q: "Can I link my signature to my CardCraft Digital Card?",
      a: "Yes! Simply enter your Card ID in the builder. The generator automatically embeds a premium gold button: 'View Digital Business Card'. When clicked, it routes recipients straight to your full card, allowing them to download your contact file (.vcf) or connect with you."
    },
    {
      q: "How does the 'Email my Card' testing work?",
      a: "Since custom SMTP server details are not configured by default, the CardCraft backend creates a temporary test inbox via Ethereal Email. When you hit send, the backend mails the signature card and generates a temporary link. You can click this link directly in the app to see exactly how your premium email signature renders in an inbox!"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1410] font-sans antialiased selection:bg-[#6B1A2A] selection:text-white animate-in fade-in duration-500">
      
      <Header />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-[#FAF7F2] pt-32 pb-20 border-b border-[#E2D9D0]">
        
        {/* Decorative background shapes with slow pulse */}
        <div className="absolute top-1/4 left-1/10 h-72 w-72 rounded-full bg-[#6B1A2A]/5 blur-3xl pointer-events-none animate-pulse duration-4000" />
        <div className="absolute bottom-1/4 right-1/10 h-80 w-80 rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none animate-pulse duration-6000" />
        
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 relative z-10">

          <h1 className="text-4xl font-extrabold tracking-tight text-[#6B1A2A] sm:text-5xl md:text-6xl max-w-3xl mx-auto leading-tight animate-in slide-in-from-bottom duration-500">
            Free Email Signature Generator
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#7A6860] leading-relaxed animate-in slide-in-from-bottom-2 duration-650">
            Instantly convert your digital business card into a gorgeous, high-end email signature. Ensure every connection gets your details in a single click, direct from their inbox.
          </p>
          
          <div className="mt-8 flex justify-center gap-4 animate-in slide-in-from-bottom-3 duration-800">
            <a href="#signature-studio">
              <Button className="bg-[#6B1A2A] hover:bg-[#8B2535] text-white font-semibold px-6 py-6 text-base rounded-lg shadow-lg shadow-[#6B1A2A]/10 border-0 flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95">
                Open Builder Studio
                <ArrowRight className="h-4 w-4 text-[#C9A84C]" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Studio Container */}
      <section id="signature-studio" className="py-20 bg-[#F2EDE6]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#6B1A2A]">Signature Design Studio</h2>
              <p className="text-sm text-[#7A6860] mt-2">Customize your professional profile details, pick templates and copy or email the result.</p>
            </div>
            {/* Backend connection status badge */}
            <div className="inline-flex self-center md:self-auto items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-white border border-[#E2D9D0] text-[#7A6860]">
              <span className={`h-2 w-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
              Server Status: {backendOnline ? 'Online' : 'Offline (Simulating Email)'}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            
            {/* Left Column: Builder Controls (5 columns) */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="border border-[#E2D9D0] bg-[#FAF7F2] shadow-md transition-all duration-300">
                
                {/* Control Tabs Header */}
                <div className="grid grid-cols-3 border-b border-[#E2D9D0] bg-[#FAF7F2] rounded-t-lg relative">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`flex items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer ${
                      activeTab === 'info'
                        ? 'border-[#6B1A2A] text-[#6B1A2A] bg-[#FAF7F2]'
                        : 'border-transparent text-[#7A6860] hover:text-[#1C1410] hover:bg-[#F2EDE6]/50'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Profile Info
                  </button>
                  <button
                    onClick={() => setActiveTab('socials')}
                    className={`flex items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer ${
                      activeTab === 'socials'
                        ? 'border-[#6B1A2A] text-[#6B1A2A] bg-[#FAF7F2]'
                        : 'border-transparent text-[#7A6860] hover:text-[#1C1410] hover:bg-[#F2EDE6]/50'
                    }`}
                  >
                    <Share2 className="h-4 w-4" />
                    Socials
                  </button>
                  <button
                    onClick={() => setActiveTab('style')}
                    className={`flex items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all duration-200 cursor-pointer ${
                      activeTab === 'style'
                        ? 'border-[#6B1A2A] text-[#6B1A2A] bg-[#FAF7F2]'
                        : 'border-transparent text-[#7A6860] hover:text-[#1C1410] hover:bg-[#F2EDE6]/50'
                    }`}
                  >
                    <Sliders className="h-4 w-4" />
                    Templates
                  </button>
                </div>

                <CardContent className="p-6">
                  
                  {/* Tab 1: Profile Info */}
                  <div className={`space-y-4 transition-all duration-350 ${activeTab === 'info' ? 'block animate-in fade-in slide-in-from-bottom-2 duration-300' : 'hidden'}`}>
                    <div className="space-y-1">
                      <Label htmlFor="sig-name" className="text-xs font-semibold text-[#7A6860]">Full Name</Label>
                      <Input
                        id="sig-name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          triggerHighlight('name');
                        }}
                        className="bg-[#FAF7F2] border-[#E2D9D0] text-[#1C1410] focus-visible:ring-[#6B1A2A] focus:border-[#6B1A2A] transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="sig-title" className="text-xs font-semibold text-[#7A6860]">Job Title</Label>
                      <Input
                        id="sig-title"
                        value={jobTitle}
                        onChange={(e) => {
                          setJobTitle(e.target.value);
                          triggerHighlight('title');
                        }}
                        className="bg-[#FAF7F2] border-[#E2D9D0] text-[#1C1410] focus-visible:ring-[#6B1A2A] focus:border-[#6B1A2A] transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="sig-company" className="text-xs font-semibold text-[#7A6860]">Company Name</Label>
                      <Input
                        id="sig-company"
                        value={company}
                        onChange={(e) => {
                          setCompany(e.target.value);
                          triggerHighlight('company');
                        }}
                        className="bg-[#FAF7F2] border-[#E2D9D0] text-[#1C1410] focus-visible:ring-[#6B1A2A] focus:border-[#6B1A2A] transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="sig-phone" className="text-xs font-semibold text-[#7A6860]">Phone Number</Label>
                      <Input
                        id="sig-phone"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          triggerHighlight('phone');
                        }}
                        className="bg-[#FAF7F2] border-[#E2D9D0] text-[#1C1410] focus-visible:ring-[#6B1A2A] focus:border-[#6B1A2A] transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="sig-email" className="text-xs font-semibold text-[#7A6860]">Email Address</Label>
                      <Input
                        id="sig-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          triggerHighlight('email');
                        }}
                        className="bg-[#FAF7F2] border-[#E2D9D0] text-[#1C1410] focus-visible:ring-[#6B1A2A] focus:border-[#6B1A2A] transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="sig-website" className="text-xs font-semibold text-[#7A6860]">Website Link</Label>
                      <Input
                        id="sig-website"
                        value={website}
                        onChange={(e) => {
                          setWebsite(e.target.value);
                          triggerHighlight('website');
                        }}
                        className="bg-[#FAF7F2] border-[#E2D9D0] text-[#1C1410] focus-visible:ring-[#6B1A2A] focus:border-[#6B1A2A] transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1 pt-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7A6860]">
                        <Info className="h-3.5 w-3.5 text-[#C9A84C]" />
                        CardCraft ID
                      </div>
                      <Input
                        id="sig-card-id"
                        value={cardId}
                        onChange={(e) => {
                          setCardId(e.target.value);
                          triggerHighlight('card-link');
                        }}
                        placeholder="e.g. yourname"
                        className="bg-[#FAF7F2] border-[#E2D9D0] text-[#1C1410] focus-visible:ring-[#6B1A2A] focus:border-[#6B1A2A] transition-all duration-200"
                      />
                      <p className="text-[10px] text-[#7A6860]">Embeds a button to redirect connection back to your card.</p>
                    </div>
                  </div>

                  {/* Tab 2: Social Links */}
                  <div className={`space-y-4 transition-all duration-350 ${activeTab === 'socials' ? 'block animate-in fade-in slide-in-from-bottom-2 duration-300' : 'hidden'}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-[#6B1A2A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                        <Label htmlFor="sig-linkedin" className="text-xs font-semibold text-[#7A6860]">LinkedIn Profile URL</Label>
                      </div>
                      <Input
                        id="sig-linkedin"
                        value={linkedin}
                        onChange={(e) => {
                          setLinkedin(e.target.value);
                          triggerHighlight('socials');
                        }}
                        className="bg-[#FAF7F2] border-[#E2D9D0] text-[#1C1410] focus-visible:ring-[#6B1A2A] focus:border-[#6B1A2A] transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-[#6B1A2A] fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <Label htmlFor="sig-twitter" className="text-xs font-semibold text-[#7A6860]">X / Twitter Profile URL</Label>
                      </div>
                      <Input
                        id="sig-twitter"
                        value={twitter}
                        onChange={(e) => {
                          setTwitter(e.target.value);
                          triggerHighlight('socials');
                        }}
                        className="bg-[#FAF7F2] border-[#E2D9D0] text-[#1C1410] focus-visible:ring-[#6B1A2A] focus:border-[#6B1A2A] transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-[#6B1A2A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                        <Label htmlFor="sig-github" className="text-xs font-semibold text-[#7A6860]">GitHub Profile URL</Label>
                      </div>
                      <Input
                        id="sig-github"
                        value={github}
                        onChange={(e) => {
                          setGithub(e.target.value);
                          triggerHighlight('socials');
                        }}
                        className="bg-[#FAF7F2] border-[#E2D9D0] text-[#1C1410] focus-visible:ring-[#6B1A2A] focus:border-[#6B1A2A] transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Tab 3: Templates & Style */}
                  <div className={`space-y-6 transition-all duration-350 ${activeTab === 'style' ? 'block animate-in fade-in slide-in-from-bottom-2 duration-300' : 'hidden'}`}>
                    {/* Layout Options */}
                    <div className="space-y-3">
                      <Label className="text-xs font-semibold text-[#7A6860] uppercase tracking-wider block">Signature Layout</Label>
                      <div className="grid grid-cols-1 gap-2.5">
                        <button
                          onClick={() => {
                            setLayoutStyle('premium');
                            triggerHighlight('layout');
                          }}
                          className={`flex items-center gap-3 p-3.5 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
                            layoutStyle === 'premium'
                              ? 'border-[#6B1A2A] bg-[#6B1A2A]/5 text-[#6B1A2A]'
                              : 'border-[#E2D9D0] bg-[#FAF7F2] text-[#1C1410] hover:bg-[#F2EDE6]/50'
                          }`}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current">
                            {layoutStyle === 'premium' && <span className="h-2.5 w-2.5 rounded-full bg-[#6B1A2A]" />}
                          </span>
                          <div>
                            <div className="text-xs font-bold">Classic Premium (Solid Side Accent)</div>
                            <div className="text-[10px] text-[#7A6860] mt-0.5">Vertical accent bar, bold color name, gold action button.</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            setLayoutStyle('minimalist');
                            triggerHighlight('layout');
                          }}
                          className={`flex items-center gap-3 p-3.5 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
                            layoutStyle === 'minimalist'
                              ? 'border-[#6B1A2A] bg-[#6B1A2A]/5 text-[#6B1A2A]'
                              : 'border-[#E2D9D0] bg-[#FAF7F2] text-[#1C1410] hover:bg-[#F2EDE6]/50'
                          }`}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current">
                            {layoutStyle === 'minimalist' && <span className="h-2.5 w-2.5 rounded-full bg-[#6B1A2A]" />}
                          </span>
                          <div>
                            <div className="text-xs font-bold">Modern Minimalist</div>
                            <div className="text-[10px] text-[#7A6860] mt-0.5">Simple structured text layout, inline dividers, thin spacing.</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setLayoutStyle('banner');
                            triggerHighlight('layout');
                          }}
                          className={`flex items-center gap-3 p-3.5 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
                            layoutStyle === 'banner'
                              ? 'border-[#6B1A2A] bg-[#6B1A2A]/5 text-[#6B1A2A]'
                              : 'border-[#E2D9D0] bg-[#FAF7F2] text-[#1C1410] hover:bg-[#F2EDE6]/50'
                          }`}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current">
                            {layoutStyle === 'banner' && <span className="h-2.5 w-2.5 rounded-full bg-[#6B1A2A]" />}
                          </span>
                          <div>
                            <div className="text-xs font-bold">Luxury Header Block</div>
                            <div className="text-[10px] text-[#7A6860] mt-0.5">Solid colored header bar containing name/title with detailed grid below.</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Theme Colors */}
                    <div className="space-y-3 pt-2">
                      <Label className="text-xs font-semibold text-[#7A6860] uppercase tracking-wider block">Theme Brand Color</Label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setThemeColor('burgundy');
                            triggerHighlight('color');
                          }}
                          className={`group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#6B1A2A] border-2 cursor-pointer transition-all duration-300 ${
                            themeColor === 'burgundy' ? 'border-[#C9A84C] scale-110 shadow-md' : 'border-[#E2D9D0] hover:scale-105'
                          }`}
                          title="Deep Burgundy"
                        >
                          {themeColor === 'burgundy' && <Check className="h-4 w-4 text-white" />}
                        </button>
                        
                        <button
                          onClick={() => {
                            setThemeColor('gold');
                            triggerHighlight('color');
                          }}
                          className={`group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A84C] border-2 cursor-pointer transition-all duration-300 ${
                            themeColor === 'gold' ? 'border-[#6B1A2A] scale-110 shadow-md' : 'border-[#E2D9D0] hover:scale-105'
                          }`}
                          title="Champagne Gold"
                        >
                          {themeColor === 'gold' && <Check className="h-4 w-4 text-white" />}
                        </button>

                        <button
                          onClick={() => {
                            setThemeColor('ink');
                            triggerHighlight('color');
                          }}
                          className={`group relative flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1410] border-2 cursor-pointer transition-all duration-300 ${
                            themeColor === 'ink' ? 'border-[#C9A84C] scale-110 shadow-md' : 'border-[#E2D9D0] hover:scale-105'
                          }`}
                          title="Ink Black"
                        >
                          {themeColor === 'ink' && <Check className="h-4 w-4 text-[#FAF7F2]" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-[#7A6860]">Changes the main colored typography and dividers in your template.</p>
                    </div>

                    {/* QR Code Toggle Switch Option */}
                    <div className="space-y-3 pt-4 border-t border-[#E2D9D0]">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-xs font-semibold text-[#7A6860] uppercase tracking-wider block">Include QR Code</Label>
                          <span className="text-[10px] text-[#7A6860] mt-0.5 block">Embeds a scannable contact QR in your signature.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeQr}
                            onChange={(e) => {
                              setIncludeQr(e.target.checked);
                              triggerHighlight('layout');
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:bg-gray-300 peer-checked:bg-[#6B1A2A]" />
                        </label>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>

            {/* Right Column: Live Interactive Preview (7 columns) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Simulated Mail Client */}
              <div className="rounded-xl border border-[#E2D9D0] bg-white shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                
                {/* Mailbox Header */}
                <div className="bg-[#F2EDE6] px-5 py-3.5 border-b border-[#E2D9D0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-[#6B1A2A]/40" />
                    <span className="flex h-3 w-3 rounded-full bg-[#C9A84C]/60" />
                    <span className="flex h-3 w-3 rounded-full bg-[#7A6860]/30" />
                    <span className="text-xs font-semibold text-[#7A6860] ml-3 select-none">New Message</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#7A6860]">
                    <Laptop className="h-3.5 w-3.5" />
                    <span>Live Preview</span>
                  </div>
                </div>

                {/* Simulated Mail Headers */}
                <div className="px-6 py-4 border-b border-[#E2D9D0]/60 space-y-2 bg-[#FAF7F2]/40 text-sm text-[#1C1410]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#7A6860] w-12 select-none">To:</span>
                    <span className="text-xs text-[#1C1410] bg-[#FAF7F2] border border-[#E2D9D0] px-2 py-0.5 rounded">connections@cardcraft.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#7A6860] w-12 select-none">Subject:</span>
                    <span className="text-xs text-[#1C1410] font-medium">Hello - Business Card & Signature Attached</span>
                  </div>
                </div>

                {/* Simulated Mail Body Canvas */}
                <div className="p-8 min-h-[300px] bg-white flex flex-col justify-between relative">
                  
                  {/* Email content message */}
                  <div className="text-sm text-[#1C1410] space-y-3 leading-relaxed">
                    <p>Dear Valued Partner,</p>
                    <p>It was a pleasure meeting with you recently. Let's stay in touch. Below are my complete details and connection links. Feel free to save my card file or add me to your business network.</p>
                    <p className="text-[#7A6860]">Kind regards,</p>
                  </div>

                  {/* Rendered Signature Block */}
                  <div className="pt-8 border-t border-dashed border-[#E2D9D0]/60 mt-10 relative">
                    
                    {/* Live JSX preview with micro-interactive highlights */}
                    <div id="signature-preview-interactive" className="transition-all duration-300">
                      
                      {layoutStyle === 'premium' && (
                        <div className="flex items-center gap-6">
                          <div className="flex gap-4">
                            <div className={`w-1 rounded-sm shrink-0 transition-all duration-300 ${
                              themeColor === 'burgundy' ? 'bg-[#6B1A2A]' : themeColor === 'gold' ? 'bg-[#C9A84C]' : 'bg-[#1C1410]'
                            } ${lastUpdatedField === 'layout' || lastUpdatedField === 'color' ? 'scale-y-110 shadow-md ring-1 ring-[#C9A84C]' : ''}`} />
                            
                            <div className="space-y-3">
                              <div>
                                <h3 className={`text-lg font-bold leading-tight transition-all duration-300 ${
                                  themeColor === 'burgundy' ? 'text-[#6B1A2A]' : themeColor === 'gold' ? 'text-[#C9A84C]' : 'text-[#1C1410]'
                                } ${lastUpdatedField === 'name' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''}`}>
                                  {fullName}
                                </h3>
                                {jobTitle && (
                                  <div className={`text-xs font-semibold mt-1 transition-all duration-300 text-[#C9A84C] ${
                                    lastUpdatedField === 'title' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''
                                  }`}>
                                    {jobTitle}
                                  </div>
                                )}
                                {company && (
                                  <div className={`text-xs text-[#7A6860] font-medium transition-all duration-300 ${
                                    lastUpdatedField === 'company' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''
                                  }`}>
                                    {company}
                                  </div>
                                )}
                              </div>

                              <div className="text-xs space-y-1 text-[#1C1410]">
                                {phone && (
                                  <div className={`flex items-center gap-1.5 transition-all duration-300 ${
                                    lastUpdatedField === 'phone' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''
                                  }`}>
                                    <span className={`font-semibold ${themeColor === 'burgundy' ? 'text-[#6B1A2A]' : themeColor === 'gold' ? 'text-[#C9A84C]' : 'text-[#1C1410]'}`}>P:</span>
                                    <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
                                  </div>
                                )}
                                {email && (
                                  <div className={`flex items-center gap-1.5 transition-all duration-300 ${
                                    lastUpdatedField === 'email' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''
                                  }`}>
                                    <span className={`font-semibold ${themeColor === 'burgundy' ? 'text-[#6B1A2A]' : themeColor === 'gold' ? 'text-[#C9A84C]' : 'text-[#1C1410]'}`}>E:</span>
                                    <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                                  </div>
                                )}
                                {website && (
                                  <div className={`flex items-center gap-1.5 transition-all duration-300 ${
                                    lastUpdatedField === 'website' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''
                                  }`}>
                                    <span className={`font-semibold ${themeColor === 'burgundy' ? 'text-[#6B1A2A]' : themeColor === 'gold' ? 'text-[#C9A84C]' : 'text-[#1C1410]'}`}>W:</span>
                                    <a href={`https://${website}`} target="_blank" className="hover:underline">{website}</a>
                                  </div>
                                )}
                              </div>

                              {(linkedin || twitter || github) && (
                                <div className={`flex items-center gap-3 pt-2 border-t border-[#E2D9D0] transition-all duration-300 ${
                                  lastUpdatedField === 'socials' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''
                                }`}>
                                  {linkedin && <a href={linkedin} target="_blank" className="text-xs font-semibold text-[#C9A84C] hover:underline">LinkedIn</a>}
                                  {twitter && <a href={twitter} target="_blank" className="text-xs font-semibold text-[#C9A84C] hover:underline">X</a>}
                                  {github && <a href={github} target="_blank" className="text-xs font-semibold text-[#C9A84C] hover:underline">GitHub</a>}
                                </div>
                              )}

                              <div className={`pt-2 transition-all duration-300 ${lastUpdatedField === 'card-link' ? 'scale-105 shadow-sm' : ''}`}>
                                <a href={`http://localhost:3000/cards/${cardId || 'preview'}`} target="_blank" className="inline-block bg-[#C9A84C] hover:bg-[#C9A84C]/95 text-[#1C1410] text-[10px] font-bold tracking-wider uppercase px-4 py-2 rounded shadow-sm hover:scale-105 transition-all">
                                  View Digital Business Card
                                </a>
                              </div>
                            </div>
                          </div>
                          {includeQr && qrDataUrl && (
                            <div className="pl-6 border-l border-[#E2D9D0] flex flex-col items-center shrink-0">
                              <img src={qrDataUrl} alt="QR Code" className="w-20 h-20 object-contain" />
                              <span className="text-[8px] text-[#7A6860] font-bold uppercase tracking-wider mt-1">Scan Contact</span>
                            </div>
                          )}
                        </div>
                      )}

                      {layoutStyle === 'minimalist' && (
                        <div className="flex items-center justify-between gap-6">
                          <div className="space-y-2">
                            <div>
                              <div className={`text-base font-bold text-[#1C1410] transition-all duration-300 ${
                                lastUpdatedField === 'name' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''
                              }`}>{fullName}</div>
                              {(jobTitle || company) && (
                                <div className={`text-xs text-[#7A6860] font-medium italic mt-0.5 transition-all duration-300 ${
                                  lastUpdatedField === 'title' || lastUpdatedField === 'company' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''
                                }`}>
                                  {jobTitle} at {company}
                                </div>
                              )}
                            </div>
                            
                            <div className="text-xs space-y-1 text-[#1C1410]">
                              {phone && (
                                <div className={`transition-all duration-300 ${lastUpdatedField === 'phone' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''}`}>
                                  <span className={`font-semibold ${themeColor === 'burgundy' ? 'text-[#6B1A2A]' : themeColor === 'gold' ? 'text-[#C9A84C]' : 'text-[#1C1410]'}`}>Phone:</span> {phone}
                                </div>
                              )}
                              {email && (
                                <div className={`transition-all duration-300 ${lastUpdatedField === 'email' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''}`}>
                                  <span className={`font-semibold ${themeColor === 'burgundy' ? 'text-[#6B1A2A]' : themeColor === 'gold' ? 'text-[#C9A84C]' : 'text-[#1C1410]'}`}>Email:</span> {email}
                                </div>
                              )}
                              {website && (
                                <div className={`transition-all duration-300 ${lastUpdatedField === 'website' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''}`}>
                                  <span className={`font-semibold ${themeColor === 'burgundy' ? 'text-[#6B1A2A]' : themeColor === 'gold' ? 'text-[#C9A84C]' : 'text-[#1C1410]'}`}>Website:</span> {website}
                                </div>
                              )}
                            </div>

                            {(linkedin || twitter || github) && (
                              <div className={`flex items-center gap-3 pt-1.5 transition-all duration-300 ${
                                lastUpdatedField === 'socials' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''
                              }`}>
                                {linkedin && <a href={linkedin} target="_blank" className="text-xs font-semibold text-[#C9A84C] hover:underline">LinkedIn</a>}
                                {twitter && <a href={twitter} target="_blank" className="text-xs font-semibold text-[#C9A84C] hover:underline">X</a>}
                                {github && <a href={github} target="_blank" className="text-xs font-semibold text-[#C9A84C] hover:underline">GitHub</a>}
                              </div>
                            )}

                            <div className={`pt-1 transition-all duration-300 ${lastUpdatedField === 'card-link' ? 'scale-102 px-1' : ''}`}>
                              <a href={`http://localhost:3000/cards/${cardId || 'preview'}`} target="_blank" className={`text-xs font-semibold underline hover:opacity-85 ${
                                themeColor === 'burgundy' ? 'text-[#6B1A2A]' : themeColor === 'gold' ? 'text-[#C9A84C]' : 'text-[#1C1410]'
                              }`}>
                                CardCraft Digital Business Card &rarr;
                              </a>
                            </div>
                          </div>
                          {includeQr && qrDataUrl && (
                            <div className="pl-6 border-l border-[#E2D9D0] flex flex-col items-center shrink-0">
                              <img src={qrDataUrl} alt="QR Code" className="w-20 h-20 object-contain" />
                              <span className="text-[8px] text-[#7A6860] font-bold uppercase tracking-wider mt-1">Scan Contact</span>
                            </div>
                          )}
                        </div>
                      )}

                      {layoutStyle === 'banner' && (
                        <div className="rounded-lg border border-[#E2D9D0] overflow-hidden max-w-sm shadow-sm transition-all duration-300">
                          <div className={`p-4 text-[#FAF7F2] transition-all duration-300 ${
                            themeColor === 'burgundy' ? 'bg-[#6B1A2A]' : themeColor === 'gold' ? 'bg-[#C9A84C]' : 'bg-[#1C1410]'
                          } ${lastUpdatedField === 'name' || lastUpdatedField === 'title' || lastUpdatedField === 'company' || lastUpdatedField === 'color' ? 'ring-1 ring-[#C9A84C]/60 shadow' : ''}`}>
                            <div className="font-bold text-base">{fullName}</div>
                            <div className="text-[11px] opacity-80 mt-1">{jobTitle} | {company}</div>
                          </div>
                          
                          <div className="p-4 bg-white flex items-center justify-between gap-6">
                            <div className="space-y-2 text-xs text-[#1C1410] flex-1">
                              {phone && (
                                <div className={`transition-all duration-300 ${lastUpdatedField === 'phone' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''}`}>
                                  <strong className="text-[#7A6860]">Cell:</strong> {phone}
                                </div>
                              )}
                              {email && (
                                <div className={`transition-all duration-300 ${lastUpdatedField === 'email' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''}`}>
                                  <strong className="text-[#7A6860]">Email:</strong> {email}
                                </div>
                              )}
                              {website && (
                                <div className={`transition-all duration-300 ${lastUpdatedField === 'website' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''}`}>
                                  <strong className="text-[#7A6860]">Web:</strong> {website}
                                </div>
                              )}

                              {(linkedin || twitter || github) && (
                                <div className={`flex items-center gap-3 pt-2 border-t border-[#E2D9D0]/80 transition-all duration-300 ${
                                  lastUpdatedField === 'socials' ? 'bg-[#C9A84C]/25 scale-102 px-1 rounded ring-1 ring-[#C9A84C]' : ''
                                }`}>
                                  {linkedin && <a href={linkedin} target="_blank" className="text-xs font-semibold text-[#C9A84C] hover:underline">LinkedIn</a>}
                                  {twitter && <a href={twitter} target="_blank" className="text-xs font-semibold text-[#C9A84C] hover:underline">X</a>}
                                  {github && <a href={github} target="_blank" className="text-xs font-semibold text-[#C9A84C] hover:underline">GitHub</a>}
                                </div>
                              )}

                              <div className={`pt-1.5 transition-all duration-300 ${lastUpdatedField === 'card-link' ? 'scale-102 px-1' : ''}`}>
                                <a href={`http://localhost:3000/cards/${cardId || 'preview'}`} target="_blank" className={`font-semibold hover:opacity-85 ${
                                  themeColor === 'burgundy' ? 'text-[#6B1A2A]' : themeColor === 'gold' ? 'text-[#C9A84C]' : 'text-[#1C1410]'
                                }`}>
                                  Connect with me on CardCraft &rarr;
                                </a>
                              </div>
                            </div>
                            {includeQr && qrDataUrl && (
                              <div className="pl-4 border-l border-[#E2D9D0] flex flex-col items-center shrink-0">
                                <img src={qrDataUrl} alt="QR Code" className="w-16 h-16 object-contain" />
                                <span className="text-[8px] text-[#7A6860] font-bold uppercase tracking-wider mt-1">Scan Contact</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Hidden Container for Copying Elements */}
                    <div id="signature-render-container" className="hidden" dangerouslySetInnerHTML={{ __html: getSignatureHtml() }} />
                  </div>

                </div>
              </div>

              {/* Action Buttons Panel */}
              <div className="flex flex-col sm:flex-row gap-3.5">
                
                <Button
                  onClick={handleCopyRichText}
                  className="flex-1 bg-[#6B1A2A] hover:bg-[#8B2535] text-white font-semibold py-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-103 active:scale-97 shadow-md shadow-[#6B1A2A]/10 border-0 flex items-center justify-center gap-2"
                >
                  {copySuccess ? (
                    <>
                      <Check className="h-5 w-5 text-[#C9A84C] animate-bounce" />
                      Signature Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      Copy Signature (Gmail / Outlook)
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleCopyRawHtml}
                  variant="outline"
                  className="border-[#E2D9D0] bg-white hover:bg-[#F2EDE6] text-[#7A6860] hover:text-[#1C1410] font-semibold py-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-103 active:scale-97 flex items-center justify-center gap-2"
                >
                  {copyHtmlSuccess ? (
                    <>
                      <Check className="h-5 w-5 text-[#6B1A2A]" />
                      HTML Copied!
                    </>
                  ) : (
                    <>
                      <FileCode className="h-5 w-5" />
                      Copy HTML Source
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => {
                    if (!isAuthenticated || !user) {
                      setShowAuthGate(true);
                      return;
                    }
                    setShowEmailModal(true);
                    setEmailStatus({ type: null, message: '' });
                  }}
                  className="bg-[#C9A84C] hover:bg-[#c9a84c]/90 text-[#1C1410] hover:text-[#1C1410] font-bold py-6 px-6 rounded-lg cursor-pointer transition-all duration-300 hover:scale-103 active:scale-97 flex items-center justify-center gap-2 border-0 shadow-md shadow-[#C9A84C]/10"
                >
                  <Send className="h-5 w-5" />
                  Email Card
                </Button>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Email Dispatcher Dialog (Overlay Modal) */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-xl border border-[#E2D9D0] bg-[#FAF7F2] p-6 shadow-2xl animate-in zoom-in-95 duration-250">
            
            {/* Close modal */}
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full border border-[#E2D9D0] bg-[#FAF7F2] text-[#7A6860] hover:text-[#1C1410] flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-all duration-150"
            >
              &times;
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[#6B1A2A]/10 flex items-center justify-center text-[#6B1A2A]">
                <Send className="h-4 w-4" />
              </div>
              <h3 className="text-xl font-bold text-[#6B1A2A]">Email Your Digital Signature Card</h3>
            </div>

            <p className="text-xs text-[#7A6860] mb-6">
              Prepare a pre-filled email to share your digital business card and signature. We'll open your default mail application and copy the signature to your clipboard.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); handleOpenMailApp(); }} className="space-y-4">
              
              <div className="space-y-1.5">
                <Label htmlFor="send-to-email" className="text-xs font-semibold text-[#7A6860]">Recipient's Email Address</Label>
                <Input
                  id="send-to-email"
                  type="email"
                  placeholder="contact@company.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="bg-[#FAF7F2] border-[#E2D9D0] text-[#1C1410] focus-visible:ring-[#6B1A2A]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="send-message" className="text-xs font-semibold text-[#7A6860]">Personal Message</Label>
                <textarea
                  id="send-message"
                  rows={3}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full rounded-md border border-[#E2D9D0] bg-[#FAF7F2] px-3 py-2 text-sm text-[#1C1410] placeholder-[#7A6860] focus-visible:ring-1 focus-visible:ring-[#6B1A2A] outline-none"
                />
              </div>

              {/* Feedback messages with bounce entry */}
              {emailStatus.type === 'success' && (
                <div className="space-y-2 animate-in zoom-in-95 duration-200">
                  <div className="flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 shadow-sm">
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" />
                    <div className="space-y-1.5">
                      <p className="font-semibold">{emailStatus.message}</p>
                      {emailStatus.previewUrl && (
                        <div>
                          <a
                            href={emailStatus.previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-bold text-emerald-700 underline hover:text-emerald-900"
                          >
                            Click to View Sent Email Sandbox
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {emailStatus.type === 'error' && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 animate-in shake duration-300">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-600" />
                  <span>{emailStatus.message}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2D9D0]">
                <Button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  variant="outline"
                  className="border-[#E2D9D0] hover:bg-[#F2EDE6] text-[#7A6860] cursor-pointer rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#6B1A2A] hover:bg-[#8B2535] text-white font-semibold px-6 py-2 shadow-md border-0 cursor-pointer rounded-full text-xs"
                >
                  Open in Mail App
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Solutions / Features Blocks Section */}
      <section id="features" className="py-24 border-t border-b border-[#E2D9D0] bg-[#FAF7F2] scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-[#6B1A2A] sm:text-4xl">
              Professional Signatures Made Simple
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#7A6860] text-sm">
              Empower your email with CardCraft's interactive card linking, designed to elevate your professional network.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            
            {/* Feature 1 */}
            <div className="rounded-2xl border border-[#E2D9D0] bg-[#F2EDE6]/40 p-8 space-y-4 hover:shadow-xl hover:-translate-y-2 hover:border-[#C9A84C]/45 transition-all duration-350 group">
              <div className="h-10 w-10 rounded-xl bg-[#6B1A2A]/5 flex items-center justify-center text-[#6B1A2A] group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#6B1A2A]">Build in Minutes</h3>
              <p className="text-sm text-[#7A6860] leading-relaxed">
                Add profile details, insert company branding, and pick a custom layout. No coding or layout design background required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-[#E2D9D0] bg-[#F2EDE6]/40 p-8 space-y-4 hover:shadow-xl hover:-translate-y-2 hover:border-[#C9A84C]/45 transition-all duration-350 group">
              <div className="h-10 w-10 rounded-xl bg-[#6B1A2A]/5 flex items-center justify-center text-[#C9A84C] group-hover:scale-110 transition-transform duration-300">
                <Inbox className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#6B1A2A]">Direct to Contacts</h3>
              <p className="text-sm text-[#7A6860] leading-relaxed">
                Embedded CTA buttons link recipients straight to your live card, allowing them to download your contact file (.vcf) in one tap.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-[#E2D9D0] bg-[#F2EDE6]/40 p-8 space-y-4 hover:shadow-xl hover:-translate-y-2 hover:border-[#C9A84C]/45 transition-all duration-350 group">
              <div className="h-10 w-10 rounded-xl bg-[#6B1A2A]/5 flex items-center justify-center text-[#B85C6E] group-hover:scale-110 transition-transform duration-300">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-[#6B1A2A]">Centralized Team Branding</h3>
              <p className="text-sm text-[#7A6860] leading-relaxed">
                Ensure visual alignment across the entire organization. Push logo, color theme, or disclaimer changes instantly from one portal.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* Accordion / Setup Guide */}
      <section id="how-it-works" className="py-24 bg-[#F2EDE6]/30 scroll-mt-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-[#6B1A2A]">Frequently Asked Questions</h2>
            <p className="text-[#7A6860] text-sm mt-3">Learn how to configure your signature and maximize your digital card sharing.</p>
          </div>

          <div id="faq" className="space-y-4 scroll-mt-16">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-[#E2D9D0] bg-[#FAF7F2] overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left font-semibold text-[#1C1410] hover:bg-[#F2EDE6]/20 transition-all cursor-pointer"
                >
                  <span className="text-sm md:text-base text-[#6B1A2A]">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#7A6860] transition-transform duration-300 ${
                      openFaqIndex === index ? 'rotate-180 text-[#6B1A2A]' : ''
                    }`}
                  />
                </button>
                
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openFaqIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-1 text-sm text-[#7A6860] leading-relaxed border-t border-[#E2D9D0]/40">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Auth Gate Modal */}
      {showAuthGate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(28, 20, 16, 0.70)', backdropFilter: 'blur(8px)',
          zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{
            background: '#FAF7F2', borderRadius: 20, maxWidth: 420, width: '100%', overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(107,26,42,0.3)', animation: 'fadeUp 0.4s ease', margin: 'auto'
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
                  Save Your Signature
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                  Sign in or create a free account to save your beautiful email signature card and access it from anywhere.
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
              <Link href="/login?redirect=/email-signatures" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'linear-gradient(135deg, #6B1A2A, #8B2535)', color: '#fff', border: 'none',
                padding: '13px 20px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                textDecoration: 'none', boxShadow: '0 4px 16px rgba(107,26,42,0.25)',
                transition: 'all 0.2s', textAlign: 'center'
              }}>
                Sign In to Save
              </Link>
              <Link href="/login?redirect=/email-signatures" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'transparent', color: '#6B1A2A', border: '1.5px solid #6B1A2A',
                padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                textDecoration: 'none', transition: 'all 0.2s', textAlign: 'center'
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
