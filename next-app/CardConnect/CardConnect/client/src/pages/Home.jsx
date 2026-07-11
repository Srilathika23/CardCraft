import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ctaBgPhoto from "../assets/cta-bg-photo.jpg";
import featuresBgVideo from "../assets/features-bg-video.mp4";
import storyVideo from "../assets/founder-story-video.mp4";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
   Burgundy-Ivory Premium System
   Primary:   #6B1A2A  (deep burgundy)
   Mid:       #8B2535  (burgundy mid)
   Warm:      #B85C6E  (rose-burgundy)
   Ivory:     #FAF7F2  (warm ivory bg)
   Paper:     #F2EDE6  (parchment surface)
   Gold:      #C9A84C  (champagne gold accent)
   Ink:       #1C1410  (near-black ink)
   Muted:     #7A6860  (warm muted text)
   Border:    #E2D9D0  (warm border)
──────────────────────────────────────────────────────────────────────────── */
const T = {
  primary:   "#6B1A2A",
  mid:       "#8B2535",
  warm:      "#B85C6E",
  ivory:     "#FAF7F2",
  paper:     "#F2EDE6",
  gold:      "#C9A84C",
  ink:       "#1C1410",
  muted:     "#7A6860",
  border:    "#E2D9D0",
  white:     "#FFFFFF",
  darkPanel: "#180D10",
};

const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: ${T.ivory}; color: ${T.ink}; -webkit-font-smoothing: antialiased; }
  ::selection { background: rgba(107,26,42,0.15); }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes cardFlip { from { transform: rotateY(0deg); } to { transform: rotateY(180deg); } }
  @keyframes pulseGlow { 0%,100% { box-shadow: 0 32px 72px rgba(28,20,16,0.20); } 50% { box-shadow: 0 36px 80px rgba(107,26,42,0.28); } }
  @keyframes copiedPop { 0% { opacity:0; transform:translateY(4px) scale(0.92); } 100% { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes tabProgress { from { width: 0%; } to { width: 100%; } }
  @media (max-width: 768px) {
    .hero-grid   { grid-template-columns: 1fr !important; }
    .feature-grid{ grid-template-columns: 1fr !important; }
    .methods-grid{ grid-template-columns: repeat(2,1fr) !important; }
    .teams-grid  { grid-template-columns: repeat(2,1fr) !important; }
    .founder-grid{ grid-template-columns: 1fr !important; text-align: center; }
    .founder-grid > div:first-child { justify-self: center; }
    .footer-grid { grid-template-columns: 1fr 1fr !important; }
    .compare-grid { grid-template-columns: 1.4fr 1fr 1fr 1fr !important; font-size: 0.92em; }
    .nav-links   { display: none !important; }
    .hero-right  { display: none !important; }
  }
  @media (max-width: 480px) {
    .methods-grid { grid-template-columns: 1fr !important; }
    .teams-grid   { grid-template-columns: 1fr !important; }
    .compare-grid { grid-template-columns: 1.3fr 0.8fr 0.8fr 0.8fr !important; }
  }
`;

// ── Scroll-reveal wrapper ─────────────────────────────────────────────────────
function Reveal({ children, delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  const map = { up: "translateY(32px)", left: "translateX(-32px)", right: "translateX(32px)", scale: "scale(0.94)" };
  return (
    <div ref={ref} style={{ height: "100%", opacity: visible ? 1 : 0, transform: visible ? "none" : map[direction], transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Occupation profiles (shared by headline + hero card) ─────────────────────
const OCCUPATION_PROFILES = [
  { occupation: "Product Designer",  name: "Alex Morgan",   company: "Nova Studio",   gradient: `linear-gradient(135deg, ${T.primary}, ${T.mid})`,       accent: T.primary },
  { occupation: "Sales Executive",   name: "Priya Sharma",  company: "TechVault",     gradient: `linear-gradient(135deg, #5A3040, #8B5A6A)`,             accent: "#8B5A6A" },
  { occupation: "Startup Founder",   name: "Jordan Lee",    company: "Luminary",      gradient: `linear-gradient(135deg, #2E4A38, #4A7A5A)`,             accent: "#4A7A5A" },
  { occupation: "Marketing Lead",    name: "Sam Rivera",    company: "Elevate Co",    gradient: `linear-gradient(135deg, #4A3020, #7A5A38)`,             accent: "#7A5A38" },
  { occupation: "Software Engineer", name: "Chris Park",    company: "ByteForge",     gradient: `linear-gradient(135deg, #2A3A5A, #4A6A9A)`,             accent: "#4A6A9A" },
  { occupation: "Creative Director", name: "Maya Chen",     company: "Studio Arc",    gradient: `linear-gradient(135deg, #5A2A4A, #9A4A7A)`,             accent: "#9A4A7A" },
  { occupation: "Consultant",        name: "Elena Brooks",  company: "Northbridge",   gradient: `linear-gradient(135deg, #3A4A3A, #6A8A6A)`,             accent: "#6A8A6A" },
  { occupation: "Entrepreneur",      name: "Dev Patel",     company: "Launchpad",     gradient: `linear-gradient(135deg, #4A3A20, #8A6A30)`,             accent: "#8A6A30" },
];

function TypedTitle({ profileIdx, onProfileChange }) {
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  const target = OCCUPATION_PROFILES[profileIdx].occupation;
  useEffect(() => {
    let t;
    if (!del && txt.length < target.length) t = setTimeout(() => setTxt(target.slice(0, txt.length + 1)), 72);
    else if (!del && txt.length === target.length) t = setTimeout(() => setDel(true), 1900);
    else if (del && txt.length > 0) t = setTimeout(() => setTxt(txt.slice(0, -1)), 38);
    else if (del && txt.length === 0) {
      setDel(false);
      onProfileChange((profileIdx + 1) % OCCUPATION_PROFILES.length);
    }
    return () => clearTimeout(t);
  }, [txt, del, target, profileIdx, onProfileChange]);
  useEffect(() => { setTxt(""); setDel(false); }, [profileIdx]);
  return (
    <em style={{ fontStyle: "italic", color: T.primary }}>
      {txt}<span style={{ animation: "blink 1s step-end infinite" }}>|</span>
    </em>
  );
}

// ── Animated Counter ──────────────────────────────────────────────────────────
function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const o = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const t0 = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - t0) / duration, 1);
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Eyebrow label ─────────────────────────────────────────────────────────────
function Eyebrow({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, justifyContent: "center" }}>
      <div style={{ width: 32, height: 1, background: T.gold }} />
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: T.gold }}>
        {children}
      </span>
      <div style={{ width: 32, height: 1, background: T.gold }} />
    </div>
  );
}

// ── QR back face ──────────────────────────────────────────────────────────────
function CardQRBack({ name, gradient, onFlipBack }) {
  const cells = [0,1,2,5,6,7,10,12,14,17,18,19,22,23,24,28,29,31,35,38,41,42,45,46];
  return (
    <div style={{ width: 288, borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 72px rgba(28,20,16,0.20)", background: T.white, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
      <div style={{ background: gradient, padding: "24px", textAlign: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>Scan to connect</div>
        <div style={{ color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600 }}>{name}</div>
      </div>
      <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ width: 120, height: 120, background: T.paper, borderRadius: 14, padding: 10, boxShadow: "inset 0 0 0 2px rgba(107,26,42,0.08)" }}>
          <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
            {Array.from({ length: 49 }).map((_, i) => (
              <div key={i} style={{ background: cells.includes(i) ? T.ink : "transparent", borderRadius: 1 }} />
            ))}
          </div>
        </div>
        <p style={{ fontSize: 11.5, color: T.muted, textAlign: "center", lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>
          Point any camera here — no app required
        </p>
        <button onClick={onFlipBack} style={{ background: "transparent", border: `1.5px solid ${T.border}`, color: T.ink, borderRadius: 100, padding: "8px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif" }}>
          ← Back to card
        </button>
      </div>
    </div>
  );
}

// ── Mock Business Card (interactive) ─────────────────────────────────────────
function MockCard({ gradient, name = "Alex Morgan", role = "Product Designer", company = "Nova Studio", interactive = false, flipped = false, onFlip, onSave, saved = false, style = {} }) {
  const [copied, setCopied] = useState(null);
  const contacts = [
    { icon: "✉", text: `${name.toLowerCase().replace(" ", ".")}@${company.toLowerCase().replace(" ", "")}.com`, label: "Email" },
    { icon: "◻", text: "+1 (555) 234-5678", label: "Phone" },
    { icon: "◉", text: `www.${company.toLowerCase().replace(" ", "")}.com`, label: "Website" },
  ];
  const copy = (text, label) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1600);
  };
  return (
    <div style={{ width: 288, borderRadius: 20, overflow: "hidden", boxShadow: interactive ? undefined : "0 32px 72px rgba(28,20,16,0.20)", background: T.white, transition: "box-shadow 0.3s", ...style }}>
      <div style={{ background: gradient, padding: "28px 24px 24px", position: "relative", overflow: "hidden" }}>
        {interactive && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at var(--mx,50%) var(--my,30%), rgba(255,255,255,0.18) 0%, transparent 55%)", pointerEvents: "none" }} />}
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.22)", border: "2.5px solid rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 14, fontFamily: "'Cormorant Garamond', serif", transition: "transform 0.4s ease" }}>
          {name[0]}
        </div>
        <div style={{ color: "#fff", fontWeight: 600, fontSize: 17, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.02em" }}>{name}</div>
        <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 12.5, marginTop: 3, fontFamily: "'Inter', sans-serif", fontWeight: 400, transition: "opacity 0.35s" }}>{role} · {company}</div>
      </div>
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10, background: T.white }}>
        {contacts.map(({ icon, text, label }) => (
          <div
            key={label}
            onClick={interactive ? () => copy(text, label) : undefined}
            style={{
              display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: T.muted,
              fontFamily: "'Inter', sans-serif", padding: "6px 8px", margin: "0 -8px",
              borderRadius: 8, cursor: interactive ? "pointer" : "default",
              transition: "background 0.2s, transform 0.2s",
              position: "relative",
            }}
            onMouseEnter={interactive ? e => { e.currentTarget.style.background = "rgba(107,26,42,0.05)"; e.currentTarget.style.transform = "translateX(4px)"; } : undefined}
            onMouseLeave={interactive ? e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateX(0)"; } : undefined}
          >
            <span style={{ fontSize: 10, color: T.primary }}>{icon}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{text}</span>
            {interactive && copied === label && (
              <span style={{ fontSize: 10, fontWeight: 600, color: T.primary, animation: "copiedPop 0.25s ease both" }}>Copied!</span>
            )}
          </div>
        ))}
        <button
          onClick={interactive ? onSave : undefined}
          style={{
            marginTop: 6, background: saved ? T.gold : gradient, color: saved ? T.ink : "#fff",
            border: "none", borderRadius: 8, padding: "10px", fontWeight: 600, fontSize: 12.5,
            cursor: interactive ? "pointer" : "default", width: "100%", fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.04em", transition: "all 0.35s ease", transform: saved ? "scale(0.98)" : "scale(1)",
          }}
        >
          {saved ? "✓ Contact saved — tap for QR" : "Save Contact"}
        </button>
      </div>
    </div>
  );
}

// ── Fingerprint SVG background ────────────────────────────────────────────────
// Real fingerprint = tightly packed elliptical ridges that loop around a core,
// with bifurcations, ridge endings, and a characteristic whorl/loop shape.
function FingerprintBg() {
  const cx = 280, cy = 295; // slightly below center (fingerprint core sits higher)
  const color = "rgba(107,26,42,";

  // Build fingerprint ridge paths: ellipses flattened vertically (rx >> ry),
  // broken into arc segments with gaps to simulate ridge endings & bifurcations.
  // Each ring = upper arc + lower arc with different sweep to create loop shape.
  const ridges = [];

  // Core whorl — innermost tight loops
  const coreRings = [
    { rx: 10, ry: 6  },
    { rx: 20, ry: 12 },
    { rx: 31, ry: 18 },
    { rx: 43, ry: 25 },
    { rx: 56, ry: 33 },
  ];
  coreRings.forEach(({ rx, ry }, i) => {
    const opacity = 0.18 + i * 0.02;
    // Full ellipse path broken into two halves with small gap for ridge endings
    ridges.push(
      <path key={`core-${i}`}
        d={`M ${cx - rx} ${cy}
            A ${rx} ${ry} 0 1 1 ${cx + rx} ${cy}
            M ${cx + rx} ${cy}
            A ${rx} ${ry} 0 0 1 ${cx - rx + 3} ${cy}`}
        fill="none"
        stroke={`${color}${opacity})`}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    );
  });

  // Middle ridges — elongated ovals that start looping outward
  const midRings = [
    { rx: 72,  ry: 44,  gapW: 8,  dy: -4  },
    { rx: 89,  ry: 56,  gapW: 10, dy: -6  },
    { rx: 108, ry: 68,  gapW: 12, dy: -8  },
    { rx: 128, ry: 82,  gapW: 15, dy: -10 },
    { rx: 150, ry: 96,  gapW: 18, dy: -12 },
    { rx: 173, ry: 111, gapW: 22, dy: -14 },
    { rx: 197, ry: 126, gapW: 26, dy: -16 },
  ];
  midRings.forEach(({ rx, ry, gapW, dy }, i) => {
    const opacity = 0.11 + i * 0.012;
    const cyShifted = cy + dy;
    // Upper arc from left to right (large arc)
    ridges.push(
      <path key={`mid-top-${i}`}
        d={`M ${cx - rx + gapW} ${cyShifted}
            A ${rx} ${ry} 0 1 1 ${cx + rx - gapW} ${cyShifted}`}
        fill="none"
        stroke={`${color}${opacity})`}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    );
    // Lower arc — slightly different curvature (flatter) to mimic real ridge flow
    ridges.push(
      <path key={`mid-bot-${i}`}
        d={`M ${cx + rx - gapW} ${cyShifted}
            A ${rx} ${ry * 0.72} 0 0 1 ${cx - rx + gapW} ${cyShifted}`}
        fill="none"
        stroke={`${color}${(opacity * 0.85).toFixed(3)})`}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    );
  });

  // Outer ridges — very wide ellipses that extend to edges, open at bottom
  const outerRings = [
    { rx: 224, ry: 143, gapW: 36, dy: -18, openBot: 0.55 },
    { rx: 252, ry: 161, gapW: 44, dy: -20, openBot: 0.50 },
    { rx: 282, ry: 180, gapW: 54, dy: -22, openBot: 0.45 },
    { rx: 312, ry: 199, gapW: 65, dy: -24, openBot: 0.38 },
    { rx: 344, ry: 218, gapW: 78, dy: -26, openBot: 0.30 },
  ];
  outerRings.forEach(({ rx, ry, gapW, dy, openBot }, i) => {
    const opacity = 0.065 + i * 0.008;
    const cyShifted = cy + dy;
    // Upper arc only (no closed bottom — outer ridges trail off)
    ridges.push(
      <path key={`out-${i}`}
        d={`M ${cx - rx + gapW} ${cyShifted}
            A ${rx} ${ry} 0 1 1 ${cx + rx - gapW} ${cyShifted}`}
        fill="none"
        stroke={`${color}${opacity})`}
        strokeWidth={1.3}
        strokeLinecap="round"
      />
    );
    // Partial lower arc (only sides, not full bottom)
    const partRx = rx * openBot;
    ridges.push(
      <path key={`out-bot-${i}`}
        d={`M ${cx + rx - gapW} ${cyShifted}
            A ${rx} ${ry * 0.6} 0 0 1 ${cx + partRx} ${cyShifted + ry * 0.5}
            M ${cx - rx + gapW} ${cyShifted}
            A ${rx} ${ry * 0.6} 0 0 0 ${cx - partRx} ${cyShifted + ry * 0.5}`}
        fill="none"
        stroke={`${color}${(opacity * 0.7).toFixed(3)})`}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    );
  });

  return (
    <svg
      viewBox="0 0 560 590"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      aria-hidden="true"
    >
      {ridges}
    </svg>
  );
}

// ── Interactive hero card showcase — phone mockup ─────────────────────────────
function InteractiveCardShowcase({ profileIdx, onProfileChange }) {
  const [floatY, setFloatY] = useState(0);

  const profile = OCCUPATION_PROFILES[profileIdx];

  // Gentle float animation
  useEffect(() => {
    let f;
    const animate = t => { setFloatY(Math.sin(t / 1800) * 9); f = requestAnimationFrame(animate); };
    f = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(f);
  }, []);

  // Avatar initials color per profile
  const avatarColors = ["#7B3A48","#5A3A70","#3A5A48","#6A4A28","#3A4A6A","#6A3A5A","#3A5A3A","#6A5A28"];
  const avatarBg = avatarColors[profileIdx % avatarColors.length];

  return (
    <div
      className="hero-right"
      style={{
        position: "relative", minHeight: 600,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ── Fingerprint background ── */}
      <FingerprintBg />

      {/* ── Soft radial glow behind phone ── */}
      <div style={{
        position: "absolute", width: 420, height: 420, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(107,26,42,0.09) 0%, transparent 68%)`,
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }} />

      {/* ── Phone shell ── */}
      <div style={{
        position: "relative", zIndex: 10,
        width: 270, height: 560,
        borderRadius: 48,
        background: "linear-gradient(170deg, #1A1010 0%, #120808 100%)",
        boxShadow: "0 56px 100px rgba(28,20,16,0.40), 0 12px 32px rgba(107,26,42,0.22), inset 0 1px 0 rgba(255,255,255,0.07)",
        border: "7px solid #0C0606",
        padding: 5,
        transform: `translateY(${floatY}px)`,
        transition: "transform 0.1s linear",
      }}>
        {/* Dynamic Island notch */}
        <div style={{
          position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
          width: 88, height: 24,
          background: "#0C0606", borderRadius: 100, zIndex: 20,
        }} />

        {/* Screen */}
        <div style={{
          width: "100%", height: "100%",
          borderRadius: 43,
          background: T.white,
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>

          {/* Header — burgundy strip with avatar overlapping */}
          <div style={{
            height: 170, flexShrink: 0, position: "relative",
            background: profile.gradient,
          }}>
            {/* Subtle shine overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, transparent 60%)",
              pointerEvents: "none",
            }} />

            {/* Status row */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 18px 0",
            }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.75)", fontFamily: "'Inter',sans-serif" }}>9:41</span>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end" }}>
                  {[6,9,12,15].map((h,i) => <div key={i} style={{ width: 3, height: h, background: "rgba(255,255,255,0.75)", borderRadius: 2 }} />)}
                </div>
                <div style={{ width: 16, height: 10, border: "1.5px solid rgba(255,255,255,0.75)", borderRadius: 3, position: "relative" }}>
                  <div style={{ position: "absolute", left: 2, top: 1.5, width: 8, height: 5, background: "rgba(255,255,255,0.75)", borderRadius: 1 }} />
                  <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 3, height: 5, background: "rgba(255,255,255,0.4)", borderRadius: 1 }} />
                </div>
              </div>
            </div>

            {/* Floating avatar — overlaps strip */}
            <div style={{
              position: "absolute", bottom: -36, left: 22,
              width: 72, height: 72, borderRadius: "50%",
              background: avatarBg,
              border: `3.5px solid ${T.white}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Cormorant Garamond',serif", fontWeight: 700,
              color: "#fff", fontSize: 28,
              boxShadow: "0 6px 20px rgba(28,20,16,0.22)",
              zIndex: 5,
              transition: "background 0.5s ease",
            }}>
              {profile.name[0]}
            </div>
          </div>

          {/* Card body */}
          <div style={{
            flex: 1, padding: "48px 22px 22px",
            display: "flex", flexDirection: "column", gap: 0,
            background: T.white,
          }}>
            {/* Name */}
            <div style={{
              fontFamily: "'Cormorant Garamond',serif", fontWeight: 700,
              fontSize: 22, color: T.ink, letterSpacing: "-0.01em",
              lineHeight: 1.15, marginBottom: 6,
              transition: "all 0.4s ease",
            }}>
              {profile.name}
            </div>

            {/* Role + company */}
            <div style={{
              fontSize: 13, color: T.muted, fontFamily: "'Inter',sans-serif",
              lineHeight: 1.55, marginBottom: 20,
              transition: "all 0.4s ease",
            }}>
              {profile.occupation} @ {profile.company}
            </div>

            {/* Icon action buttons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {[
                { icon: "🔗", label: "Link" },
                { icon: "✉", label: "Email" },
                { icon: "📱", label: "Phone" },
              ].map(btn => (
                <div key={btn.label} style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: profile.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, cursor: "pointer",
                  boxShadow: `0 4px 12px rgba(107,26,42,0.25)`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(107,26,42,0.38)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(107,26,42,0.25)"; }}
                >
                  {btn.icon}
                </div>
              ))}
            </div>

            {/* NFC Active badge */}
            <div style={{
              background: "rgba(107,26,42,0.05)",
              border: `1px solid rgba(107,26,42,0.12)`,
              borderRadius: 16, padding: "18px 16px",
              textAlign: "center",
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 10,
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: T.primary,
                fontFamily: "'Inter',sans-serif", letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}>NFC Active</div>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                border: `2px solid rgba(107,26,42,0.20)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                {/* Pulse rings */}
                <div style={{
                  position: "absolute", inset: -8, borderRadius: "50%",
                  border: `1.5px solid rgba(107,26,42,0.12)`,
                  animation: "nfcRing 2s ease-out infinite",
                }} />
                <div style={{
                  position: "absolute", inset: -16, borderRadius: "50%",
                  border: `1px solid rgba(107,26,42,0.07)`,
                  animation: "nfcRing 2s ease-out infinite 0.5s",
                }} />
                {/* Contactless icon arcs */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 12 Q8 8 12 8 Q16 8 18 12" stroke={T.primary} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5"/>
                  <path d="M8 12 Q9.5 9.5 12 9.5 Q14.5 9.5 16 12" stroke={T.primary} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.75"/>
                  <path d="M10 12 Q11 11 12 11 Q13 11 14 12" stroke={T.primary} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                  <circle cx="12" cy="14.5" r="1.2" fill={T.primary}/>
                </svg>
              </div>
            </div>

            {/* Bottom home indicator */}
            <div style={{
              width: 100, height: 4, borderRadius: 100,
              background: "rgba(28,20,16,0.18)", margin: "14px auto 0",
            }} />
          </div>
        </div>
      </div>

      {/* ── NFC left card REMOVED ── */}
      {/* ── AI Score top-right REMOVED ── */}
      {/* ── Analytics bottom-right REMOVED ── */}
      {/* ── Hint pill REMOVED ── */}

      <style>{`
        @keyframes nfcRing {
          0%   { opacity: 1;  transform: scale(1); }
          100% { opacity: 0;  transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "0 2.5rem", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(250,247,242,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${T.border}` : "none",
      transition: "all 0.35s ease",
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: T.gold, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 19, lineHeight: 1 }}>C</span>
        </div>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 21, color: T.ink, letterSpacing: "0.01em" }}>CardCraft</span>
      </Link>

      {/* Links */}
      <div className="nav-links" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {[
          { label: "Features", href: "#features" },
          { label: "For Teams", href: "#for-teams" },
          { label: "Share Anywhere", href: "#share-anywhere" },
          { label: "FAQ", href: "#faq" },
        ].map(item => (
          <a key={item.label} href={item.href} style={{ color: T.muted, textDecoration: "none", fontSize: 13.5, fontWeight: 500, letterSpacing: "0.02em", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = T.primary} onMouseLeave={e => e.target.style.color = T.muted}>{item.label}</a>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link to="/login" style={{ color: T.muted, textDecoration: "none", fontSize: 13.5, fontWeight: 500, padding: "8px 16px" }}>Sign in</Link>
        <Link to="/register" style={{
          background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`,
          color: "#fff", textDecoration: "none", fontSize: 13.5, fontWeight: 600,
          padding: "10px 22px", borderRadius: 100,
          boxShadow: `0 4px 18px rgba(107,26,42,0.28)`,
          transition: "all 0.2s", letterSpacing: "0.02em",
        }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = `0 8px 24px rgba(107,26,42,0.38)`; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 18px rgba(107,26,42,0.28)`; }}>
          Get started
        </Link>
      </div>
    </nav>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const [profileIdx, setProfileIdx] = useState(0);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "108px 2.5rem 48px",
      background: `linear-gradient(160deg, ${T.ivory} 0%, ${T.white} 55%, ${T.paper} 100%)`,
      position: "relative", overflow: "hidden",
    }}>
      {/* Soft ambient blobs */}
      <div style={{ position: "absolute", top: "8%", right: "3%", width: 640, height: 640, borderRadius: "50%", background: `radial-gradient(circle, rgba(107,26,42,0.055) 0%, transparent 68%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "2%", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 68%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1140, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="hero-grid">
        {/* Left */}
        <div style={{ animation: "fadeUp 0.9s ease both" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            border: `1px solid rgba(201,168,76,0.4)`,
            background: "rgba(201,168,76,0.07)",
            borderRadius: 100, padding: "6px 16px",
            marginBottom: 32, fontSize: 12, color: T.gold, fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase",
            fontFamily: "'Inter', sans-serif",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.gold, display: "inline-block" }} />
            Trusted by 4M+ professionals
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(3rem,5.5vw,5rem)",
            fontWeight: 600, color: T.ink,
            lineHeight: 1.04, letterSpacing: "-0.02em",
            marginBottom: 28,
          }}>
            The digital card for<br />every <TypedTitle profileIdx={profileIdx} onProfileChange={setProfileIdx} />
          </h1>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 17, lineHeight: 1.75,
            color: T.muted, marginBottom: 44, maxWidth: 460,
            fontWeight: 400,
          }}>
            Share who you are, capture who they are, and never lose the context.
            One link. Every detail. Always up to date.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 52 }}>
            <Link to="/register" style={{
              background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`,
              color: "#fff", textDecoration: "none",
              padding: "15px 34px", borderRadius: 100,
              fontWeight: 600, fontSize: 15,
              boxShadow: `0 8px 28px rgba(107,26,42,0.30)`,
              transition: "all 0.25s", letterSpacing: "0.02em",
              fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 14px 36px rgba(107,26,42,0.40)`; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 8px 28px rgba(107,26,42,0.30)`; }}>
              Create my card — free
            </Link>
            <a href="#for-teams" style={{
              border: `1.5px solid ${T.border}`, color: T.ink,
              textDecoration: "none", padding: "15px 34px",
              borderRadius: 100, fontWeight: 500, fontSize: 15,
              background: "transparent", transition: "all 0.22s",
              fontFamily: "'Inter', sans-serif",
              display: "inline-block",
            }}
              onMouseEnter={e => { e.target.style.borderColor = T.primary; e.target.style.color = T.primary; }}
              onMouseLeave={e => { e.target.style.borderColor = T.border; e.target.style.color = T.ink; }}>
              For teams →
            </a>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex" }}>
              {["A","B","C","D","E"].map((l, i) => (
                <div key={l} style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: [`#7B3A48`, `#9B5A2E`, `#5A6B3A`, `#3A5A7B`, `#7B5A3A`][i],
                  border: `2.5px solid ${T.ivory}`, marginLeft: i > 0 ? -9 : 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 600, fontSize: 11.5,
                  fontFamily: "'Inter', sans-serif",
                }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ color: T.gold, fontSize: 12, letterSpacing: "0.08em" }}>★★★★★</div>
              <div style={{ color: T.muted, fontSize: 12, marginTop: 2, fontFamily: "'Inter', sans-serif" }}>4.9 / 5 from 150K+ reviews</div>
            </div>
          </div>
        </div>

        {/* Right — interactive card showcase */}
        <InteractiveCardShowcase profileIdx={profileIdx} onProfileChange={setProfileIdx} />
      </div>
    </section>
  );
}

// ── LOGO MARQUEE ──────────────────────────────────────────────────────────────


// ── FEATURE TABS ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "share",     icon: "↗", label: "Share your card",    heading: "One card. Every channel.",        body: "Share via QR code, link, email, or SMS. Recipients need no app — your card opens in their browser, details ready to save.", grad: `linear-gradient(135deg, ${T.primary}, ${T.mid})` },
  { id: "capture",  icon: "◉", label: "Capture contacts",   heading: "Never lose a lead again.",        body: "Scan a badge, a paper card, or let contacts share back. CardCraft auto-enriches missing details for every new contact.", grad: `linear-gradient(135deg, ${T.primary}, ${T.mid})` },
  { id: "analytics",icon: "▲", label: "Track analytics",    heading: "See who's looking.",              body: "Know when your card is viewed, shared, or saved. Track every touchpoint — who opened it, from where, and when.", grad: `linear-gradient(135deg, ${T.primary}, ${T.mid})` },
  { id: "teams",    icon: "⊞", label: "Manage your team",   heading: "Brand consistency at scale.",     body: "Issue cards to your entire team in seconds. Lock in logo, colors, and fonts. Update anyone's details instantly.", grad: `linear-gradient(135deg, ${T.primary}, ${T.mid})` },
];

function FeatureTabs() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(a => (a + 1) % TABS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <section style={{ position: "relative", padding: "40px 2.5rem", overflow: "hidden" }} id="features">
      {/* Background video */}
      <video
        autoPlay loop muted playsInline
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 40%", zIndex: 0,
        }}
      >
        <source src={featuresBgVideo} type="video/mp4" />
      </video>

      {/* Light ivory scrim — keeps dark text readable while video shows through */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: `linear-gradient(170deg, rgba(242,237,230,0.22) 0%, rgba(242,237,230,0.18) 55%, rgba(242,237,230,0.28) 100%)`,
      }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1140, margin: "0 auto" }}>
        <Reveal>
          <Eyebrow>How it works</Eyebrow>
          <h2 style={{ textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem,4vw,3.2rem)", fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.12, marginBottom: 24, textShadow: "0 2px 24px rgba(0,0,0,0.65)" }}>
            Everything you need to network smarter
          </h2>
        </Reveal>

        {/* Tab pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 44 }}>
          {TABS.map((t, i) => (
            <button key={t.id} onClick={() => setActive(i)} style={{
              position: "relative",
              padding: "10px 22px", borderRadius: 100,
              border: active === i ? "none" : `1.5px solid rgba(255,255,255,0.35)`,
              background: active === i ? tab.grad : "rgba(255,255,255,0.15)",
              color: active === i ? "#fff" : "rgba(255,255,255,0.9)",
              fontWeight: 600, fontSize: 13.5, cursor: "pointer",
              transition: "all 0.28s", display: "flex", alignItems: "center", gap: 7,
              fontFamily: "'Inter', sans-serif", letterSpacing: "0.01em",
              boxShadow: active === i ? "none" : "0 2px 10px rgba(28,20,16,0.08)",
              overflow: "hidden",
            }}>
              <span style={{ fontSize: 12 }}>{t.icon}</span> {t.label}
              {active === i && (
                <span key={`progress-${active}`} style={{
                  position: "absolute", bottom: 0, left: 0, height: 2.5,
                  background: "rgba(255,255,255,0.65)",
                  animation: "tabProgress 5s linear forwards",
                  width: "0%",
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }} className="feature-grid">
          <div>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff", marginBottom: 24 }}>
              {tab.icon}
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", marginBottom: 18, lineHeight: 1.15, textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}>
              {tab.heading}
            </h3>
            <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 16, lineHeight: 1.8, marginBottom: 36, fontFamily: "'Inter', sans-serif", textShadow: "0 1px 10px rgba(0,0,0,0.55)" }}>{tab.body}</p>
            <Link to="/register" style={{
              display: "inline-block", background: tab.grad, color: "#fff",
              textDecoration: "none", padding: "13px 30px", borderRadius: 100,
              fontWeight: 600, fontSize: 14, transition: "transform 0.2s",
              boxShadow: `0 6px 20px rgba(107,26,42,0.22)`, fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
              Get started →
            </Link>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <MockCard gradient={tab.grad} name={tab.id === "share" ? "Alex Morgan" : tab.id === "capture" ? "Priya Sharma" : tab.id === "analytics" ? "Jordan Lee" : "Sam Rivera"} role={tab.id === "share" ? "Product Designer" : tab.id === "capture" ? "VP of Sales" : tab.id === "analytics" ? "Founder & CEO" : "Head of Marketing"} company={tab.id === "share" ? "Nova Studio" : tab.id === "capture" ? "TechVault" : tab.id === "analytics" ? "Luminary" : "Elevate Co"} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── TEAMS SHOWCASE — illustrations ──────────────────────────────────────────
function BrandStackIllustration() {
  const people = [
    { name: "Edgar Wallas", role: "Chief Technology Officer", initial: "E" },
    { name: "Sophie Jones", role: "SVP, Product & Platform Str.", initial: "S" },
    { name: "Mary Bridger", role: "Customer Success Manager", initial: "M" },
  ];
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "22px 14px 0" }}>
      {people.map((p, i) => (
        <div key={p.name} style={{
          position: "absolute",
          left: `${14 + i * 28}%`,
          bottom: 0,
          width: "62%",
          maxWidth: 168,
          zIndex: i,
          transform: `translateX(-50%) rotate(${(i - 1) * 4}deg)`,
          borderRadius: "14px 14px 0 0",
          overflow: "hidden",
          boxShadow: i === 1 ? "0 12px 30px rgba(28,20,16,0.18)" : "0 6px 18px rgba(28,20,16,0.10)",
          background: T.white,
        }}>
          <div style={{ background: `linear-gradient(160deg, ${T.warm} 0%, ${T.primary} 100%)`, height: 58, position: "relative" }}>
            <div style={{ position: "absolute", top: 8, right: 8, fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.04em" }}>CardCraft</div>
          </div>
          <div style={{ padding: "0 10px 10px", marginTop: -20 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${T.gold}, ${T.warm})`, border: `3px solid ${T.white}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "'Cormorant Garamond', serif", marginBottom: 6 }}>
              {p.initial}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.ink, fontFamily: "'Cormorant Garamond', serif" }}>{p.name}</div>
            <div style={{ fontSize: 7.5, color: T.muted, fontFamily: "'Inter', sans-serif", marginBottom: 6, lineHeight: 1.3 }}>{p.role}</div>
            {i === 1 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 7, color: T.muted, fontFamily: "'Inter', sans-serif", padding: "3px 0", borderTop: `1px solid ${T.border}` }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(107,26,42,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: T.primary, fontSize: 6 }}>☏</span>
                  (646) 555-0224
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 7, color: T.muted, fontFamily: "'Inter', sans-serif", padding: "3px 0", borderTop: `1px solid ${T.border}` }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(107,26,42,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: T.primary, fontSize: 6 }}>⬡</span>
                  cardcraft.co
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function LeadCaptureIllustration() {
  const leads = [
    { name: "Roy McAllister", role: "Head of Engineering", dim: true },
    { name: "Charli Berkley", role: "Founder & CEO", dim: false },
    { name: "Steven Rice", role: "Co-Founder & Chief Strateg…", dim: true },
  ];
  return (
    <div style={{ width: "100%", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.muted, fontFamily: "'Inter', sans-serif", fontWeight: 600, padding: "0 4px 4px", borderBottom: `1px solid ${T.border}` }}>
        <span>Lead name</span>
      </div>
      {leads.map(l => (
        <div key={l.name} style={{
          display: "flex", alignItems: "center", gap: 10,
          background: l.dim ? "transparent" : T.white,
          borderRadius: 12, padding: "8px 10px",
          boxShadow: l.dim ? "none" : "0 6px 18px rgba(28,20,16,0.10)",
          opacity: l.dim ? 0.45 : 1,
        }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: l.dim ? T.border : `linear-gradient(135deg, ${T.gold}, ${T.warm})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12, fontFamily: "'Cormorant Garamond', serif", flexShrink: 0 }}>
            {l.name[0]}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: T.ink, fontFamily: "'Cormorant Garamond', serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.name}</div>
            <div style={{ fontSize: 8.5, color: T.muted, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.role}</div>
          </div>
        </div>
      ))}
      <div style={{ fontSize: 8.5, color: T.muted, fontFamily: "'Inter', sans-serif", marginTop: 2, opacity: 0.5 }}>19 Leads</div>
    </div>
  );
}

function ContextChatIllustration() {
  return (
    <div style={{ width: "100%", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ background: "rgba(255,255,255,0.55)", borderRadius: "14px 14px 14px 4px", padding: "10px 13px", maxWidth: "88%", boxShadow: "0 4px 14px rgba(28,20,16,0.06)" }}>
        <div style={{ fontSize: 10.5, color: T.ink, fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: 1.4 }}>
          Follow up with Alfie Tyler.<br />Knows our <span style={{ color: T.primary }}>✦</span>
        </div>
      </div>
      <div style={{ background: T.white, borderRadius: 16, padding: "12px 14px", boxShadow: "0 10px 26px rgba(28,20,16,0.14)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${T.gold}, ${T.warm})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "'Cormorant Garamond', serif", flexShrink: 0 }}>C</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.ink, fontFamily: "'Cormorant Garamond', serif" }}>Charli Berkley</div>
          <div style={{ fontSize: 8.5, color: T.muted, fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>📍 Miami, Florida &nbsp;📅 12 April 2026</div>
        </div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.55)", borderRadius: "14px 14px 4px 14px", padding: "10px 13px", maxWidth: "85%", alignSelf: "flex-end", boxShadow: "0 4px 14px rgba(28,20,16,0.06)" }}>
        <div style={{ fontSize: 10.5, color: T.ink, fontFamily: "'Inter', sans-serif", fontWeight: 600, lineHeight: 1.4 }}>
          Does Salsa class every other week. Str <span style={{ color: T.primary }}>✦</span>
        </div>
      </div>
    </div>
  );
}

function CRMStackIllustration() {
  const contacts = [
    { name: "Roy McAllister", role: "Head of Engineering" },
    { name: "Charli Berkley", role: "Founder & CEO" },
    { name: "Grant Sullivan", role: "Founder & Exec…" },
  ];
  return (
    <div style={{ width: "100%", padding: "16px 14px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 7, marginBottom: 10 }}>
        {["⬡", "◈", "▷"].map((ic, i) => (
          <div key={i} style={{ width: 26, height: 26, borderRadius: 7, background: [T.white, "#DCEEF5", "#E8E2F5"][i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: [T.warm, "#3A7A9A", "#6A4A9A"][i], boxShadow: "0 2px 8px rgba(28,20,16,0.08)" }}>{ic}</div>
        ))}
      </div>
      <div style={{ background: T.white, borderRadius: 14, padding: "12px 14px", boxShadow: "0 14px 32px rgba(28,20,16,0.14)" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 14, color: T.ink, marginBottom: 8 }}>Contacts</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 7.5, color: T.muted, fontFamily: "'Inter', sans-serif", fontWeight: 600, paddingBottom: 5, borderBottom: `1px solid ${T.border}` }}>
          <span>Name</span><span>Job title</span>
        </div>
        {contacts.map(c => (
          <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: `linear-gradient(135deg, ${T.gold}, ${T.warm})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 8, fontFamily: "'Cormorant Garamond', serif", flexShrink: 0 }}>{c.name[0]}</div>
              <span style={{ fontSize: 8.5, fontWeight: 600, color: T.ink, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
            </div>
            <span style={{ fontSize: 7, color: "#fff", background: T.gold, borderRadius: 100, padding: "2px 6px", fontFamily: "'Inter', sans-serif", fontWeight: 600, flexShrink: 0 }}>Synced</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamsShowcase() {
  const cards = [
    { id: "brand",   bg: "#DCEEF5", title: "Show up on brand",   desc: "Every introduction your team makes, consistent and up to date.",       illustration: <BrandStackIllustration /> },
    { id: "leads",   bg: T.paper,   title: "Capture every lead", desc: "Every new contact, captured and enriched instantly by AI.",             illustration: <LeadCaptureIllustration /> },
    { id: "context", bg: "#F5DCEA", title: "Keep the context",   desc: "Every in-person conversation, saved with the contact by AI.",          illustration: <ContextChatIllustration /> },
    { id: "stack",   bg: "#EDE8E3", title: "Connect your stack", desc: "Every contact with context, straight into your CRM and tools.",        illustration: <CRMStackIllustration /> },
  ];
  return (
    <section id="for-teams" style={{ padding: "40px 2.5rem", background: T.ivory }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <Reveal>
          <h2 style={{ textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem,4.2vw,3.4rem)", fontWeight: 600, color: T.ink, letterSpacing: "-0.02em", marginBottom: 18, lineHeight: 1.14 }}>
            Stack the cards<br />in your team's favor
          </h2>
          <p style={{ textAlign: "center", color: T.muted, fontSize: 16, maxWidth: 480, margin: "0 auto 24px", lineHeight: 1.75, fontFamily: "'Inter', sans-serif" }}>
            Everything your team needs to meet well and follow up better.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="teams-grid">
          {cards.map((card, i) => (
            <Reveal key={card.id} delay={i * 70}>
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{
                  background: card.bg, borderRadius: 20, overflow: "hidden",
                  height: 280, display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "transform 0.24s, box-shadow 0.24s", cursor: "pointer",
                  boxShadow: "0 2px 12px rgba(28,20,16,0.06)", marginBottom: 20,
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(28,20,16,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(28,20,16,0.06)"; }}>
                  {card.illustration}
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 19, color: T.ink, marginBottom: 8, letterSpacing: "0.01em" }}>{card.title}</h3>
                <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65, fontFamily: "'Inter', sans-serif" }}>{card.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── SHARE METHODS — Bento Grid ────────────────────────────────────────────────
function QRIllustration() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {/* QR code mock */}
      <div style={{ width: 88, height: 88, background: T.white, borderRadius: 12, padding: 8, boxShadow: "0 4px 18px rgba(28,20,16,0.12)" }}>
        <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
          {Array.from({ length: 49 }).map((_, i) => {
            const corner = (r, c) => (r < 3 && c < 3) || (r < 3 && c > 3) || (r > 3 && c < 3);
            const row = Math.floor(i / 7), col = i % 7;
            const filled = corner(row, col) || Math.random() > 0.5;
            return <div key={i} style={{ background: filled ? T.ink : "transparent", borderRadius: 1 }} />;
          })}
        </div>
      </div>
      {/* Profile chip */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, background: T.white, borderRadius: 100, padding: "8px 16px 8px 8px", boxShadow: "0 4px 14px rgba(28,20,16,0.10)" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${T.warm}, ${T.primary})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "'Cormorant Garamond', serif" }}>C</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, fontFamily: "'Inter', sans-serif" }}>Charli Berkley</div>
          <div style={{ fontSize: 10, color: T.muted, fontFamily: "'Inter', sans-serif" }}>Product Designer</div>
        </div>
      </div>
    </div>
  );
}

function NFCIllustration() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        width: 200, height: 126, borderRadius: 14,
        background: `linear-gradient(135deg, ${T.primary} 0%, ${T.mid} 60%, ${T.warm} 100%)`,
        boxShadow: "0 20px 48px rgba(107,26,42,0.30)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "14px 18px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", top: 10, right: 14, width: 22, height: 22, opacity: 0.6 }}>
          <div style={{ width: 22, height: 22, border: "2px solid rgba(255,255,255,0.7)", borderRadius: "50%", position: "absolute" }} />
          <div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.5)", borderRadius: "50%", position: "absolute", top: 3, left: 3 }} />
        </div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>CardCraft</div>
        <div style={{ color: "#fff", fontWeight: 600, fontSize: 13, fontFamily: "'Cormorant Garamond', serif" }}>Alex Morgan</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 9.5, fontFamily: "'Inter', sans-serif" }}>Product Designer · Nova Studio</div>
      </div>
    </div>
  );
}

function EmailSigIllustration() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ background: T.white, borderRadius: 14, padding: "16px 18px", boxShadow: "0 6px 24px rgba(28,20,16,0.10)", width: 210 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${T.warm}, ${T.primary})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "'Cormorant Garamond', serif", flexShrink: 0 }}>S</div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, fontFamily: "'Inter', sans-serif" }}>Steph Kim</div>
            <div style={{ fontSize: 10, color: T.muted, fontFamily: "'Inter', sans-serif" }}>Chief Artisan Glasshouse</div>
          </div>
        </div>
        {["+1 (415) 555-0167", "steph@blot.com"].map((v, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10.5, color: T.muted, fontFamily: "'Inter', sans-serif", padding: "4px 0", borderTop: `1px solid ${T.border}` }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.primary, flexShrink: 0 }} />
            {v}
          </div>
        ))}
      </div>
    </div>
  );
}

function VirtualBgIllustration() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 210, height: 118, borderRadius: 12, background: `linear-gradient(135deg, ${T.paper} 0%, #e8d8d8 100%)`, overflow: "hidden", position: "relative", boxShadow: "0 8px 28px rgba(107,26,42,0.14)" }}>
        {/* 4 video tiles */}
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position: "absolute",
            top: i < 2 ? "4%" : "52%",
            left: i % 2 === 0 ? "3%" : "52%",
            width: "44%", height: "42%",
            borderRadius: 6, overflow: "hidden",
            background: [T.paper, "#d4c0c4", "#c4d0d4", T.border][i],
          }}>
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: [T.primary, T.muted, T.warm, T.gold][i], opacity: 0.6 }} />
            </div>
          </div>
        ))}
        {/* Card badge overlay */}
        <div style={{ position: "absolute", bottom: 6, right: 6, background: T.white, borderRadius: 8, padding: "4px 8px", boxShadow: "0 2px 10px rgba(28,20,16,0.15)", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 7, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>C</div>
          <span style={{ fontSize: 8.5, fontWeight: 600, color: T.ink, fontFamily: "'Inter', sans-serif" }}>Steven Rice</span>
        </div>
      </div>
    </div>
  );
}

function WalletIllustration() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ background: T.white, borderRadius: 14, padding: "14px 16px", boxShadow: "0 6px 24px rgba(28,20,16,0.10)", width: 180, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: T.gold, fontSize: 10, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif" }}>C</span>
          </div>
          <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.06em", color: T.muted, textTransform: "uppercase" }}>Work</span>
        </div>
        {[["NAME","Grant Sullivan"],["JOB TITLE","Founder & Executive Director"],["COMPANY","Common Earth Project"]].map(([label, val]) => (
          <div key={label} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 7.5, fontWeight: 600, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 1 }}>{label}</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: T.ink }}>{val}</div>
          </div>
        ))}
        <div style={{ marginTop: 8, height: 3, borderRadius: 100, background: `linear-gradient(135deg, ${T.primary}, ${T.warm})` }} />
      </div>
    </div>
  );
}

function WatchIllustration() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative" }}>
        {/* Watch band top */}
        <div style={{ width: 52, height: 20, background: T.primary, borderRadius: "6px 6px 0 0", margin: "0 auto" }} />
        {/* Watch body */}
        <div style={{ width: 76, height: 90, borderRadius: 22, background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 32px rgba(28,20,16,0.28)" }}>
          <div style={{ width: 60, height: 74, borderRadius: 16, background: T.white, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: 6 }}>
            {/* Tiny QR */}
            <div style={{ width: 36, height: 36, background: T.ink, borderRadius: 4, padding: 3 }}>
              <div style={{ width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 1 }}>
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} style={{ background: [0,1,2,5,6,7,10,12,14,17,18,19,22,23,24].includes(i) ? T.white : "transparent", borderRadius: 0.5 }} />
                ))}
              </div>
            </div>
            <div style={{ fontSize: 7, fontWeight: 600, color: T.ink, fontFamily: "'Inter', sans-serif", textAlign: "center" }}>Scan to<br/>connect</div>
          </div>
        </div>
        {/* Watch band bottom */}
        <div style={{ width: 52, height: 20, background: T.primary, borderRadius: "0 0 6px 6px", margin: "0 auto" }} />
      </div>
    </div>
  );
}

function WidgetIllustration() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 180, background: T.ink, borderRadius: 32, padding: "10px", boxShadow: "0 12px 36px rgba(28,20,16,0.24)" }}>
        <div style={{ background: T.white, borderRadius: 24, padding: "14px 12px", display: "flex", alignItems: "center", gap: 10 }}>
          {/* QR side */}
          <div style={{ width: 52, height: 52, background: T.paper, borderRadius: 10, flexShrink: 0, padding: 5, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 1 }}>
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} style={{ background: [0,1,2,5,6,7,10,12,14,17,18,19,22,23,24].includes(i) ? T.ink : "transparent", borderRadius: 0.5 }} />
            ))}
          </div>
          {/* Profile side */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: `linear-gradient(135deg, ${T.warm}, ${T.primary})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", flexShrink: 0 }}>S</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: T.ink, fontFamily: "'Inter', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Sophie Jones</div>
            </div>
            <div style={{ fontSize: 8.5, color: T.muted, fontFamily: "'Inter', sans-serif", lineHeight: 1.4 }}>VP Product & Platform Strategy</div>
            <div style={{ display: "inline-block", marginTop: 5, fontSize: 7.5, fontWeight: 600, color: "#fff", background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`, borderRadius: 100, padding: "2px 8px", fontFamily: "'Inter', sans-serif" }}>Connect</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareMethods() {
  const cards = [
    {
      id: "qr",
      bg: "#DCEEF5",
      title: "QR Code",
      desc: null,
      illustration: <QRIllustration />,
      span: 1,
    },
    {
      id: "nfc",
      bg: T.paper,
      title: "NFC Cards",
      desc: null,
      illustration: <NFCIllustration />,
      span: 1,
    },
    {
      id: "email",
      bg: "#F5DCEA",
      title: "Email Signatures",
      desc: null,
      illustration: <EmailSigIllustration />,
      span: 1,
    },
    {
      id: "virtual",
      bg: "#EDE8E3",
      title: "Virtual Backgrounds",
      desc: null,
      illustration: <VirtualBgIllustration />,
      span: 1,
    },
    {
      id: "widgets",
      bg: T.border,
      title: "Widgets",
      desc: null,
      illustration: <WidgetIllustration />,
      span: 1,
    },
    {
      id: "cta",
      bg: T.primary,
      title: null,
      desc: null,
      illustration: null,
      span: 1,
      cta: true,
    },
  ];

  return (
    <section id="share-anywhere" style={{ padding: "40px 2.5rem", background: T.ivory }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <Reveal>
          <Eyebrow>Share anywhere</Eyebrow>
          <h2 style={{ textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 600, color: T.ink, letterSpacing: "-0.02em", marginBottom: 14, lineHeight: 1.15 }}>
            Scan it. Tap it. Link it.{" "}
            <em style={{ fontStyle: "italic", color: T.primary }}>CardCraft it.</em>
          </h2>
          <p style={{ textAlign: "center", color: T.muted, fontSize: 16, maxWidth: 520, margin: "0 auto 24px", lineHeight: 1.75, fontFamily: "'Inter', sans-serif" }}>
            One account, endless ways to share. Pick whatever works for the moment.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="methods-grid">
          {cards.map((card, i) => (
            <Reveal key={card.id} delay={i * 55}>
              {card.cta ? (
                /* CTA tile */
                <div style={{
                  background: T.primary, borderRadius: 20, padding: "32px 28px",
                  height: "100%", minHeight: 220,
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  cursor: "pointer", transition: "transform 0.24s, box-shadow 0.24s",
                  boxShadow: `0 8px 28px rgba(107,26,42,0.22)`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 18px 44px rgba(107,26,42,0.32)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 28px rgba(107,26,42,0.22)`; }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.9rem,2.5vw,2.4rem)", fontWeight: 600, color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                    Create my card
                  </h3>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff" }}>→</div>
                  </div>
                </div>
              ) : (
                /* Feature tile */
                <div style={{
                  background: card.bg, borderRadius: 20, overflow: "hidden",
                  height: "100%", minHeight: 220,
                  display: "flex", flexDirection: "column",
                  transition: "transform 0.24s, box-shadow 0.24s", cursor: "pointer",
                  boxShadow: "0 2px 12px rgba(28,20,16,0.06)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(28,20,16,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(28,20,16,0.06)"; }}>
                  {/* Illustration area */}
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 20px 14px" }}>
                    {card.illustration}
                  </div>
                  {/* Footer */}
                  <div style={{ padding: "14px 20px 18px", borderTop: `1px solid ${card.dark ? "rgba(255,255,255,0.08)" : "rgba(28,20,16,0.07)"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 17, color: card.dark ? T.ivory : T.ink, letterSpacing: "0.01em", marginBottom: card.desc ? 6 : 0 }}>
                          {card.title}
                        </div>
                        {card.desc && (
                          <p style={{ fontSize: 12, color: card.dark ? "#9A8880" : T.muted, lineHeight: 1.6, fontFamily: "'Inter', sans-serif", maxWidth: 180 }}>{card.desc}</p>
                        )}
                      </div>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: card.dark ? "rgba(255,255,255,0.1)" : "rgba(28,20,16,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: card.dark ? T.ivory : T.ink, flexShrink: 0, marginLeft: 8, marginTop: 2 }}>→</div>
                    </div>
                  </div>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


// ── CTA BANNER ────────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section style={{ position: "relative", padding: "0", overflow: "hidden", minHeight: 560, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Background photo */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `url(${ctaBgPhoto})`,
        backgroundSize: "cover",
        backgroundPosition: "center 38%",
      }} />

      {/* Dark scrim with a touch of burgundy warmth — keeps text readable, photo still clearly visible */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: `linear-gradient(170deg, rgba(20,8,11,0.55) 0%, rgba(60,18,26,0.30) 45%, rgba(20,8,11,0.62) 100%)`,
      }} />

      <Reveal>
        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: 760, margin: "0 auto", textAlign: "center",
          padding: "120px 32px",
        }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)", marginBottom: 20, textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>Start today — free forever</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem,5vw,3.6rem)", fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 22, textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>
            For contacts that stay in contact
          </h2>
          <p style={{ color: "rgba(255,255,255,0.92)", fontSize: 17, lineHeight: 1.7, fontFamily: "'Inter', sans-serif", maxWidth: 480, margin: "0 auto 44px", textShadow: "0 2px 14px rgba(0,0,0,0.45)" }}>
            Create your free digital business card in under 60 seconds. No printing. No limits.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" style={{
              background: T.ivory, color: T.primary,
              textDecoration: "none", padding: "15px 34px",
              borderRadius: 100, fontWeight: 700, fontSize: 15,
              boxShadow: "0 8px 24px rgba(0,0,0,0.30)", transition: "transform 0.2s",
              fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
              Create my card — free
            </Link>
            <a href="#for-teams" style={{
              border: "1.5px solid rgba(255,255,255,0.55)", color: "#fff",
              textDecoration: "none", padding: "15px 34px",
              borderRadius: 100, fontWeight: 500, fontSize: 15,
              background: "rgba(255,255,255,0.10)", transition: "background 0.2s",
              fontFamily: "'Inter', sans-serif",
              display: "inline-block",
            }}
              onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.20)"}
              onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.10)"}>
              For teams →
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ── COMPARISON TABLE ──────────────────────────────────────────────────────────
const COMPARISON_ROWS = [
  { label: "Cost after setup",        cardcraft: "Free, always",              paper: "Reprint every change",        others: "Monthly subscription" },
  { label: "Updates after printing",  cardcraft: "Instant, unlimited",        paper: "Not possible",                others: "Usually instant" },
  { label: "Works without their app", cardcraft: true,                       paper: true,                            others: false },
  { label: "Contact analytics",       cardcraft: true,                       paper: false,                           others: "Paid tier only" },
  { label: "CRM auto-sync",           cardcraft: true,                       paper: false,                           others: "Limited" },
  { label: "Team brand controls",     cardcraft: true,                       paper: false,                           others: "Paid tier only" },
  { label: "Eco-friendly",            cardcraft: true,                       paper: false,                           others: true },
];

function ComparisonCell({ value }) {
  if (value === true) {
    return <span style={{ color: "#4A7A5A", fontSize: 18, fontWeight: 700 }}>✓</span>;
  }
  if (value === false) {
    return <span style={{ color: T.muted, fontSize: 18, opacity: 0.45 }}>—</span>;
  }
  return <span style={{ fontSize: 13.5, color: T.muted, fontFamily: "'Inter', sans-serif", lineHeight: 1.4 }}>{value}</span>;
}

// ── STORY VIDEO ───────────────────────────────────────────────────────────────
function ComparisonTable() {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.5 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  return (
    <section style={{ padding: "40px 2.5rem", background: T.ivory }}>
      <div style={{ maxWidth: 940, margin: "0 auto" }}>
        <Reveal direction="scale">
          <div style={{
            borderRadius: 22, overflow: "hidden",
            boxShadow: "0 24px 60px rgba(28,20,16,0.12)",
            lineHeight: 0,
          }}>
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              style={{ width: "100%", display: "block", background: T.darkPanel }}
            >
              <source src={storyVideo} type="video/mp4" />
            </video>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "How do I create a digital business card?",
    a: "Creating your CardCraft card takes under 60 seconds. Sign up, add your contact details and a photo, choose your card style, and you're ready to share. No design experience needed.",
  },
  {
    q: "Is CardCraft free to use?",
    a: "Yes — CardCraft is free forever for individuals. You get unlimited sharing, QR codes, and email signatures. Upgrade to Premium or Business for advanced customisation, analytics, and CRM integrations.",
  },
  {
    q: "What if the person I'm sharing with doesn't have the app?",
    a: "They don't need the app at all. Your card opens in any browser, and they can save your details directly to their phone contacts with one tap.",
  },
  {
    q: "How does CardCraft integrate with my CRM?",
    a: "CardCraft Business syncs directly with HubSpot, Salesforce, Microsoft Dynamics, and more. New contacts flow straight into your pipeline with tags and context automatically applied.",
  },
  {
    q: "How do NFC business cards work?",
    a: "NFC cards have a chip linked to your CardCraft profile. Tap the card on any compatible smartphone to instantly open your digital card — no scanning required. It really is like magic.",
  },
  {
    q: "Can I manage cards for my entire team?",
    a: "Yes — CardCraft Business lets admins issue, update, and manage cards for an unlimited team. Lock in brand guidelines, update anyone's details instantly, and track performance across the team.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ padding: "40px 2.5rem", background: T.ivory }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, justifyContent: "center" }}>
            <div style={{ width: 28, height: 1, background: T.gold }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: T.gold, fontFamily: "'Inter',sans-serif" }}>FAQ</span>
            <div style={{ width: 28, height: 1, background: T.gold }} />
          </div>
          <h2 style={{ textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 600, color: T.ink, letterSpacing: "-0.02em", marginBottom: 24, lineHeight: 1.15 }}>
            Frequently asked questions
          </h2>
        </Reveal>

        {FAQS.map((item, i) => (
          <Reveal key={i} delay={i * 40}>
            <div style={{ borderBottom: `1px solid ${T.border}` }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%", background: "none", border: "none",
                  padding: "22px 0", display: "flex", justifyContent: "space-between",
                  alignItems: "center", cursor: "pointer", textAlign: "left", gap: 20,
                }}
              >
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: T.ink, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
                  {item.q}
                </span>
                <span style={{
                  fontSize: 22, color: T.primary, fontWeight: 300, flexShrink: 0,
                  transition: "transform 0.35s ease",
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  display: "inline-block",
                }}>
                  +
                </span>
              </button>
              <div style={{
                maxHeight: open === i ? 240 : 0,
                overflow: "hidden",
                transition: "max-height 0.42s cubic-bezier(0.4,0,0.2,1)",
              }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 15,
                  color: T.muted, lineHeight: 1.82, paddingBottom: 24,
                  paddingRight: 40,
                }}>
                  {item.a}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
// ── FOUNDER STORY ─────────────────────────────────────────────────────────────
function FounderStory() {
  return (
    <section style={{ padding: "56px 2.5rem", background: T.paper }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <Reveal>
          <div style={{
            display: "grid", gridTemplateColumns: "auto 1fr", gap: 28,
            alignItems: "flex-start",
          }} className="founder-grid">
            {/* Avatar */}
            <div style={{
              width: 84, height: 84, borderRadius: "50%",
              background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 10px 28px rgba(107,26,42,0.22)",
            }}>
              <span style={{ color: T.gold, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 32 }}>C</span>
            </div>

            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.gold, marginBottom: 14 }}>
                Why we built CardCraft
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.4rem,2.2vw,1.8rem)", fontStyle: "italic", color: T.ink, lineHeight: 1.5, marginBottom: 20 }}>
                "I kept a drawer full of business cards I'd never look at again — and gave out cards that went straight into someone else's drawer. We built CardCraft so the only thing exchanged is the connection, not a piece of paper."
              </p>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: T.ink }}>
                Founder & CEO, CardCraft
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: T.muted, marginTop: 2 }}>
                Building in the open — we're a small team just getting started.
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const socials = [
    { label: "LinkedIn", href: "#", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.27c-.96 0-1.75-.79-1.75-1.76s.79-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76zm13.5 10.27h-3v-4.5c0-1.07-.02-2.45-1.49-2.45-1.5 0-1.73 1.17-1.73 2.37v4.58h-3v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z"/></svg>
    )},
    { label: "Instagram", href: "#", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.67-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07zm0 5.46c-2.97 0-5.38 2.41-5.38 5.38s2.41 5.38 5.38 5.38 5.38-2.41 5.38-5.38-2.41-5.38-5.38-5.38zm0 8.87c-1.93 0-3.49-1.56-3.49-3.49s1.56-3.49 3.49-3.49 3.49 1.56 3.49 3.49-1.56 3.49-3.49 3.49zm6.85-9.08c0 .7-.56 1.25-1.25 1.25s-1.25-.56-1.25-1.25.56-1.25 1.25-1.25 1.25.56 1.25 1.25z"/></svg>
    )},
    { label: "GitHub", href: "#", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.63 0-12 5.37-12 12 0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5.99.11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.41 1.02.01 2.04.14 3 .41 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.22.7.83.58 4.76-1.59 8.2-6.08 8.2-11.38 0-6.63-5.37-12-12-12z"/></svg>
    )},
    { label: "Twitter", href: "#", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.15h3.68l-8.04 9.19 9.46 12.51h-7.41l-5.8-7.59-6.64 7.59h-3.68l8.6-9.83-9.07-11.87h7.6l5.24 6.93zm-1.29 19.5h2.04l-13.17-17.42h-2.19z"/></svg>
    )},
  ];
  return (
    <footer style={{ background: `linear-gradient(155deg, #2A161C 0%, ${T.darkPanel} 100%)`, padding: "64px 2.5rem 36px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: T.gold, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 18 }}>C</span>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 19, color: T.ivory }}>CardCraft</span>
          </div>
          <p style={{ color: "#9A8880", fontSize: 14, lineHeight: 1.75, maxWidth: 460, fontFamily: "'Inter', sans-serif", marginBottom: 26 }}>
            The premium digital business card platform for modern professionals.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            {socials.map(s => (
              <a key={s.label} href={s.href} aria-label={s.label} style={{
                width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#9A8880", transition: "background 0.2s, color 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = T.gold; e.currentTarget.style.color = T.ink; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#9A8880"; e.currentTarget.style.transform = "translateY(0)"; }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #26161C", paddingTop: 24, display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: "#5A4840", fontSize: 13, fontFamily: "'Inter', sans-serif", textAlign: "center" }}>
            © 2026 CardCraft. All rights reserved. — Crafted for networkers who mean business.
          </span>
        </div>
      </div>
    </footer>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{FONT_IMPORT}</style>
      <Navbar />
      <Hero />
      <FeatureTabs />
      <TeamsShowcase />
      <ShareMethods />
      <ComparisonTable />
      <FAQ />
      <CTABanner />
      <FounderStory />
      <Footer />
    </div>
  );
}