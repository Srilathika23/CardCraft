import re

filepath = r"c:\Users\srila\Downloads\CardCraft-main\CardCraft-main\next-app\app\page.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add import
import_str = 'import Link from "next/link";'
new_import_str = 'import Link from "next/link";\nimport { useAuth } from "@/app/context/AuthContext";'
content = content.replace(import_str, new_import_str)

# 2. Modify Navbar
original_navbar_start = """function Navbar() {
  const [scrolled, setScrolled] = useState(false);"""

replacement_navbar_start = """function Navbar() {
  const { isAuthenticated } = useAuth();
  const getStartedHref = isAuthenticated ? "/dashboard" : "/login";
  const [scrolled, setScrolled] = useState(false);"""

content = content.replace(original_navbar_start, replacement_navbar_start)

# In Navbar, replace the Get started link:
# Find: <Link href="/create-card" ... style info ...> Get started </Link> inside Navbar
# We will do a targeted replacement of:
navbar_link_search = """        <Link href="/create-card" style={{
          background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`,
          color: "#fff", textDecoration: "none", fontSize: 13.5, fontWeight: 600,
          padding: "10px 22px", borderRadius: 100,
          boxShadow: `0 4px 18px rgba(107,26,42,0.28)`,
          transition: "all 0.2s", letterSpacing: "0.02em",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 8px 24px rgba(107,26,42,0.38)`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 4px 18px rgba(107,26,42,0.28)`;
          }}>
          Get started
        </Link>"""

navbar_link_replace = """        <Link href={getStartedHref} style={{
          background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`,
          color: "#fff", textDecoration: "none", fontSize: 13.5, fontWeight: 600,
          padding: "10px 22px", borderRadius: 100,
          boxShadow: `0 4px 18px rgba(107,26,42,0.28)`,
          transition: "all 0.2s", letterSpacing: "0.02em",
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 8px 24px rgba(107,26,42,0.38)`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 4px 18px rgba(107,26,42,0.28)`;
          }}>
          Get started
        </Link>"""

content = content.replace(navbar_link_search, navbar_link_replace)

# 3. Modify Hero
original_hero_start = """function Hero({ profileIdx, setProfileIdx }: HeroProps) {"""

replacement_hero_start = """function Hero({ profileIdx, setProfileIdx }: HeroProps) {
  const { isAuthenticated } = useAuth();
  const createCardHref = isAuthenticated ? "/create-card" : "/login?redirect=/create-card";"""

content = content.replace(original_hero_start, replacement_hero_start)

# In Hero, replace "Create my card — free" link:
hero_link_search = """            <Link href="/create-card" style={{
              background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`,
              color: "#fff", textDecoration: "none",
              padding: "15px 34px", borderRadius: 100,
              fontWeight: 600, fontSize: 15,
              boxShadow: `0 8px 28px rgba(107,26,42,0.30)`,
              transition: "all 0.25s", letterSpacing: "0.02em",
              fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 14px 36px rgba(107,26,42,0.40)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 8px 28px rgba(107,26,42,0.30)`;
              }}>
              Create my card — free
            </Link>"""

hero_link_replace = """            <Link href={createCardHref} style={{
              background: `linear-gradient(135deg, ${T.primary}, ${T.mid})`,
              color: "#fff", textDecoration: "none",
              padding: "15px 34px", borderRadius: 100,
              fontWeight: 600, fontSize: 15,
              boxShadow: `0 8px 28px rgba(107,26,42,0.30)`,
              transition: "all 0.25s", letterSpacing: "0.02em",
              fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 14px 36px rgba(107,26,42,0.40)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 8px 28px rgba(107,26,42,0.30)`;
              }}>
              Create my card — free
            </Link>"""

content = content.replace(hero_link_search, hero_link_replace)

# 4. Modify FeatureTabs
original_featuretabs_start = """function FeatureTabs() {"""

replacement_featuretabs_start = """function FeatureTabs() {
  const { isAuthenticated } = useAuth();
  const getStartedHref = isAuthenticated ? "/dashboard" : "/login";"""

content = content.replace(original_featuretabs_start, replacement_featuretabs_start)

featuretabs_link_search = """            <Link href="/create-card" style={{
              display: "inline-block", background: tab.grad, color: "#fff",
              textDecoration: "none", padding: "13px 30px", borderRadius: 100,
              fontWeight: 600, fontSize: 14, transition: "transform 0.2s",
              boxShadow: `0 6px 20px rgba(107,26,42,0.22)`, fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
              Get started →
            </Link>"""

featuretabs_link_replace = """            <Link href={getStartedHref} style={{
              display: "inline-block", background: tab.grad, color: "#fff",
              textDecoration: "none", padding: "13px 30px", borderRadius: 100,
              fontWeight: 600, fontSize: 14, transition: "transform 0.2s",
              boxShadow: `0 6px 20px rgba(107,26,42,0.22)`, fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
              Get started →
            </Link>"""

content = content.replace(featuretabs_link_search, featuretabs_link_replace)

# 5. Modify ShareMethods
original_sharemethods_start = """function ShareMethods() {
  const cards = ["""

replacement_sharemethods_start = """function ShareMethods() {
  const { isAuthenticated } = useAuth();
  const createCardHref = isAuthenticated ? "/create-card" : "/login?redirect=/create-card";
  const cards = ["""

content = content.replace(original_sharemethods_start, replacement_sharemethods_start)

# Inside cards array: replace the '/create-card' strings
# We want to replace specifically NFC Cards, Virtual Backgrounds, and CTA cards:
content = content.replace('href: "/create-card",\n    },\n    {\n      id: "email",', 'href: createCardHref,\n    },\n    {\n      id: "email",')
content = content.replace('href: "/create-card",\n    },\n    {\n      id: "widgets",', 'href: createCardHref,\n    },\n    {\n      id: "widgets",')
content = content.replace('cta: true,\n      href: "/create-card",\n    },', 'cta: true,\n      href: createCardHref,\n    },')

# In ShareMethods return, replace the `<Link href="/create-card" ...>`
share_cta_link_search = """              {card.cta ? (
                <Link href="/create-card" style={{ textDecoration: "none" }}>"""

share_cta_link_replace = """              {card.cta ? (
                <Link href={createCardHref} style={{ textDecoration: "none" }}>"""

content = content.replace(share_cta_link_search, share_cta_link_replace)

# 6. Modify CTABanner
original_ctabanner_start = """function CTABanner() {"""

replacement_ctabanner_start = """function CTABanner() {
  const { isAuthenticated } = useAuth();
  const createCardHref = isAuthenticated ? "/create-card" : "/login?redirect=/create-card";"""

content = content.replace(original_ctabanner_start, replacement_ctabanner_start)

ctabanner_link_search = """          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/create-card" style={{
              background: T.ivory, color: T.primary,
              textDecoration: "none", padding: "15px 34px",
              borderRadius: 100, fontWeight: 700, fontSize: 15,
              boxShadow: "0 8px 24px rgba(0,0,0,0.30)", transition: "transform 0.2s",
              fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.transform = "translateY(0)"; }}>
              Create my card — free
            </Link>"""

ctabanner_link_replace = """          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={createCardHref} style={{
              background: T.ivory, color: T.primary,
              textDecoration: "none", padding: "15px 34px",
              borderRadius: 100, fontWeight: 700, fontSize: 15,
              boxShadow: "0 8px 24px rgba(0,0,0,0.30)", transition: "transform 0.2s",
              fontFamily: "'Inter', sans-serif",
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.transform = "translateY(0)"; }}>
              Create my card — free
            </Link>"""

content = content.replace(ctabanner_link_search, ctabanner_link_replace)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Landing page patch applied successfully!")
