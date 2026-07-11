import re

filepath = r"c:\Users\srila\Downloads\CardCraft-main\CardCraft-main\next-app\public\editor.html"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Change Topbar Logo link
content = content.replace('<a class="topbar-logo" href="#">', '<a class="topbar-logo" href="/dashboard">')

# 2. Add customization into defaultState()
original_default_state = """            function defaultState() {
                // Logo: exactly matching Image 2 — CC mark + "CardCraft" inline
                const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 52"><text x="2" y="42" font-family="Georgia,serif" font-weight="900" font-size="48" fill="#FF6B6B">CC</text><text x="108" y="38" font-family="Georgia,serif" font-weight="700" font-size="24" fill="#1a1510">CardCraft</text></svg>`;
                const logoUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(logoSvg);
                const coverSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 155"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffb09a"/><stop offset="40%" stop-color="#f07070"/><stop offset="100%" stop-color="#f090a0"/></linearGradient></defs><rect fill="url(#g)" width="400" height="155"/><path d="M-40 100 Q80 30 200 90 T440 60" stroke="rgba(255,255,255,.16)" stroke-width="36" fill="none" stroke-linecap="round"/><path d="M-40 130 Q100 60 240 110 T460 85" stroke="rgba(255,255,255,.09)" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M60 -10 Q130 60 90 130 T110 170" stroke="rgba(255,200,180,.13)" stroke-width="40" fill="none" stroke-linecap="round"/></svg>`;
                const coverUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coverSvg);
                return { brandColor: "#FF4D4D", images: { logo: { url: logoUrl }, profile: { url: "https://i.pravatar.cc/200?img=11" }, cover: { url: coverUrl } }, name: { first: "Davis", last: "Gouse" }, fields: { jobTitle: { label: "", value: "UI/UX Designer" }, email: { label: "Work", value: "davis@example.com" }, phone: { label: "Mobile", value: "+1 (555) 987-6543", countryCode: "+1", extension: "" }, address: { label: "Office", value: "San Francisco, CA" }, companyUrl: { label: "", value: "davisgouse.com" } } };
            }"""

replacement_default_state = """            function defaultState() {
                // Logo: exactly matching Image 2 — CC mark + "CardCraft" inline
                const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 52"><text x="2" y="42" font-family="Georgia,serif" font-weight="900" font-size="48" fill="#FF6B6B">CC</text><text x="108" y="38" font-family="Georgia,serif" font-weight="700" font-size="24" fill="#1a1510">CardCraft</text></svg>`;
                const logoUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(logoSvg);
                const coverSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 155"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffb09a"/><stop offset="40%" stop-color="#f07070"/><stop offset="100%" stop-color="#f090a0"/></linearGradient></defs><rect fill="url(#g)" width="400" height="155"/><path d="M-40 100 Q80 30 200 90 T440 60" stroke="rgba(255,255,255,.16)" stroke-width="36" fill="none" stroke-linecap="round"/><path d="M-40 130 Q100 60 240 110 T460 85" stroke="rgba(255,255,255,.09)" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M60 -10 Q130 60 90 130 T110 170" stroke="rgba(255,200,180,.13)" stroke-width="40" fill="none" stroke-linecap="round"/></svg>`;
                const coverUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coverSvg);
                return { 
                    brandColor: "#FF4D4D", 
                    images: { logo: { url: logoUrl }, profile: { url: "https://i.pravatar.cc/200?img=11" }, cover: { url: coverUrl } }, 
                    name: { first: "Davis", last: "Gouse" }, 
                    fields: { jobTitle: { label: "", value: "UI/UX Designer" }, email: { label: "Work", value: "davis@example.com" }, phone: { label: "Mobile", value: "+1 (555) 987-6543", countryCode: "+1", extension: "" }, address: { label: "Office", value: "San Francisco, CA" }, companyUrl: { label: "", value: "davisgouse.com" } },
                    customization: {
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
                    }
                };
            }"""

content = content.replace(original_default_state, replacement_default_state)

# 3. Clean up the manual state.customization assignment right after state = defaultState()
customization_pattern = r"// Default Customization properties\s+state\.customization = \{[\s\S]*?\};"
content = re.sub(customization_pattern, "", content)

# 4. Replace apiGetCard, apiSaveCard, and uploadToCloudinary
original_api_block = """            async function apiGetCard() { const r = await fetch(`${CFG.API_BASE_URL}/cards/${USER_ID}`); if (r.status === 404) return null; if (!r.ok) throw new Error("load failed"); return r.json(); }
            async function apiSaveCard(p) { const r = await fetch(`${CFG.API_BASE_URL}/cards/${USER_ID}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) }); if (!r.ok) throw new Error("save failed"); return r.json(); }
            async function uploadToCloudinary(file) { const fd = new FormData(); fd.append("file", file); fd.append("upload_preset", CFG.CLOUDINARY_UPLOAD_PRESET); const r = await fetch(`https://api.cloudinary.com/v1_1/${CFG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: fd }); if (!r.ok) throw new Error("upload failed"); return r.json(); }"""

replacement_api_block = """            let CARD_ID = new URLSearchParams(window.location.search).get('edit') || null;

            function getAuthUser() {
                try {
                    const u = localStorage.getItem('cardcraft_user');
                    return u ? JSON.parse(u) : null;
                } catch(e) {
                    return null;
                }
            }

            function mapDbCardToState(card) {
                if (!card) return null;
                const nameParts = (card.fullName || "").split(" ");
                const first = nameParts[0] || "";
                const last = nameParts.slice(1).join(" ") || "";
                
                const fieldsArray = [
                    { type: 'jobTitle', label: '', value: card.jobTitle || '' },
                    { type: 'email', label: 'Work', value: card.email || '' },
                    { type: 'phone', label: 'Mobile', value: card.phone || '' },
                    { type: 'companyUrl', label: '', value: card.website || '' },
                    { type: 'companyName', label: '', value: card.company || '' },
                    { type: 'department', label: '', value: card.department || '' },
                    { type: 'linkedin', label: '', value: card.linkedin || '' },
                    { type: 'twitter', label: '', value: card.twitter || '' },
                    { type: 'github', label: '', value: card.github || '' }
                ].filter(f => f.value);

                return {
                    brandColor: card.designData?.brandColor || "#FF4D4D",
                    images: card.designData?.images || defaultState().images,
                    name: { first, last },
                    fields: fieldsArray,
                    customization: card.designData?.customization || state.customization
                };
            }

            async function apiGetCard() {
                const user = getAuthUser();
                if (!user) return null;

                const headers = { 'Authorization': `Bearer ${user.token}` };
                if (CARD_ID) {
                    const r = await fetch(`${CFG.API_BASE_URL}/cards/${CARD_ID}`, { headers });
                    if (r.status === 404) return null;
                    if (!r.ok) throw new Error("load failed");
                    const card = await r.json();
                    
                    if (card && card.designData && card.designData.brandColor) {
                        return {
                            brandColor: card.designData.brandColor,
                            images: card.designData.images,
                            name: card.designData.name,
                            fields: card.designData.fields,
                            customization: card.designData.customization || state.customization
                        };
                    }
                    return mapDbCardToState(card);
                }
                return null;
            }

            async function apiSaveCard(p) {
                const user = getAuthUser();
                if (!user) return null;

                const mappedCard = {
                    cardName: p.cardName || `${p.name.first || ''} ${p.name.last || ''}'s Card`.trim() || "My Business Card",
                    fullName: `${p.name.first || ''} ${p.name.last || ''}`.trim() || "New Card",
                    jobTitle: p.fields.find(f => f.type === 'jobTitle')?.value || '',
                    company: p.fields.find(f => f.type === 'companyName')?.value || p.fields.find(f => f.type === 'company')?.value || '',
                    department: p.fields.find(f => f.type === 'department')?.value || '',
                    email: p.fields.find(f => f.type === 'email')?.value || '',
                    phone: p.fields.find(f => f.type === 'phone')?.value || '',
                    website: p.fields.find(f => f.type === 'companyUrl')?.value || p.fields.find(f => f.type === 'website')?.value || '',
                    linkedin: p.fields.find(f => f.type === 'linkedin')?.value || '',
                    twitter: p.fields.find(f => f.type === 'twitter')?.value || p.fields.find(f => f.type === 'x')?.value || '',
                    github: p.fields.find(f => f.type === 'github')?.value || '',
                    template: p.customization?.cardTemplate || 'modern',
                    designData: {
                        brandColor: p.brandColor,
                        images: p.images,
                        name: p.name,
                        fields: p.fields,
                        customization: p.customization || state.customization
                    }
                };

                const headers = { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                };
                
                if (CARD_ID) {
                    const r = await fetch(`${CFG.API_BASE_URL}/cards/${CARD_ID}`, { 
                        method: "PUT", 
                        headers, 
                        body: JSON.stringify(mappedCard) 
                    });
                    if (!r.ok) throw new Error("save failed");
                    return r.json();
                } else {
                    const r = await fetch(`${CFG.API_BASE_URL}/cards`, { 
                        method: "POST", 
                        headers, 
                        body: JSON.stringify(mappedCard) 
                    });
                    if (!r.ok) throw new Error("create failed");
                    const saved = await r.json();
                    if (saved && saved._id) {
                        CARD_ID = saved._id;
                        const newUrl = window.location.pathname + `?edit=${CARD_ID}`;
                        window.history.replaceState({ path: newUrl }, '', newUrl);
                    }
                    return saved;
                }
            }

            async function uploadToCloudinary(file) { const fd = new FormData(); fd.append("file", file); fd.append("upload_preset", CFG.CLOUDINARY_UPLOAD_PRESET); const r = await fetch(`https://api.cloudinary.com/v1_1/${CFG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: fd }); if (!r.ok) throw new Error("upload failed"); return r.json(); }

            function fileToBase64(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            }"""

content = content.replace(original_api_block, replacement_api_block)

# 5. Replace scheduleSave
original_schedule_save = """            let saveTimer = null;
            function scheduleSave() {
                setSaveStatus("saving"); clearTimeout(saveTimer);
                // Persist a local copy immediately so UI can render from cache
                try { localStorage.setItem(`cc_card_${USER_ID}`, JSON.stringify({ brandColor: state.brandColor, images: state.images, name: state.name, fields: Object.entries(state.fields).map(([type, data], i) => ({ type, order: i, ...data })) })); } catch (e) { /* ignore */ }
                saveTimer = setTimeout(async () => {
                    try {
                        await apiSaveCard({ brandColor: state.brandColor, images: state.images, name: state.name, fields: Object.entries(state.fields).map(([type, data], i) => ({ type, order: i, ...data })) });
                        setSaveStatus("saved");
                    }
                    catch (e) { console.error(e); setSaveStatus("error"); }
                }, 600);
            }"""

replacement_schedule_save = """            let saveTimer = null;
            function scheduleSave() {
                setSaveStatus("saving"); clearTimeout(saveTimer);
                // Persist a local copy immediately so UI can render from cache
                try {
                    const cacheKey = CARD_ID ? `cc_card_${CARD_ID}` : `cc_card_${USER_ID}`;
                    localStorage.setItem(cacheKey, JSON.stringify({ brandColor: state.brandColor, images: state.images, name: state.name, fields: Object.entries(state.fields).map(([type, data], i) => ({ type, order: i, ...data })) }));
                } catch (e) { /* ignore */ }
                saveTimer = setTimeout(async () => {
                    try {
                        await apiSaveCard({ brandColor: state.brandColor, images: state.images, name: state.name, fields: Object.entries(state.fields).map(([type, data], i) => ({ type, order: i, ...data })) });
                        setSaveStatus("saved");
                    }
                    catch (e) { console.error(e); setSaveStatus("error"); }
                }, 600);
            }"""

content = content.replace(original_schedule_save, replacement_schedule_save)

# 6. Replace loadLocalCard and init
original_load_and_init = """            function loadLocalCard() {
                try {
                    const raw = localStorage.getItem(`cc_card_${USER_ID}`);
                    if (!raw) return null;
                    const ex = JSON.parse(raw);
                    const s = { brandColor: ex.brandColor || state.brandColor, images: ex.images || state.images, name: ex.name || state.name, fields: {}, customization: state.customization };
                    (ex.fields || []).forEach(f => { s.fields[f.type] = { label: f.label, value: f.value, countryCode: f.countryCode, extension: f.extension }; });
                    return s;
                } catch (e) { return null; }
            }

            /* ── INIT ── */
            (async function init() {
                // First render cached local state immediately to avoid visible delay
                try {
                    const cached = loadLocalCard();
                    if (cached) { state = cached; renderAll(); }
                } catch (e) { /* ignore */ }

                // Then fetch authoritative server copy and update when ready
                try {
                    const ex = await apiGetCard();
                    if (ex) {
                        state = { brandColor: ex.brandColor || state.brandColor, images: ex.images || state.images, name: ex.name || state.name, fields: {}, customization: state.customization };
                        (ex.fields || []).forEach(f => { state.fields[f.type] = { label: f.label, value: f.value, countryCode: f.countryCode, extension: f.extension }; });
                        setSaveStatus("saved");
                        renderAll();
                    }
                } catch (e) {/* First run or no API – keep local/default state */ }"""

replacement_load_and_init = """            function loadLocalCard() {
                try {
                    const cacheKey = CARD_ID ? `cc_card_${CARD_ID}` : `cc_card_${USER_ID}`;
                    const raw = localStorage.getItem(cacheKey);
                    if (!raw) return null;
                    const ex = JSON.parse(raw);
                    const s = { brandColor: ex.brandColor || state.brandColor, images: ex.images || state.images, name: ex.name || state.name, fields: {}, customization: state.customization };
                    (ex.fields || []).forEach(f => { s.fields[f.type] = { label: f.label, value: f.value, countryCode: f.countryCode, extension: f.extension }; });
                    return s;
                } catch (e) { return null; }
            }

            /* ── INIT ── */
            (async function init() {
                // Render cached local state immediately to avoid visible delay (only if editing existing card or guest draft)
                try {
                    const user = getAuthUser();
                    if (CARD_ID || !user) {
                        const cached = loadLocalCard();
                        if (cached) { state = cached; renderAll(); }
                    } else {
                        // Logged in user creating new card: start fresh
                        state = defaultState();
                        renderAll();
                    }
                } catch (e) { /* ignore */ }

                // Then fetch authoritative server copy and update when ready
                try {
                    const ex = await apiGetCard();
                    if (ex) {
                        state = { brandColor: ex.brandColor || state.brandColor, images: ex.images || state.images, name: ex.name || state.name, fields: {}, customization: state.customization };
                        (ex.fields || []).forEach(f => { state.fields[f.type] = { label: f.label, value: f.value, countryCode: f.countryCode, extension: f.extension }; });
                        setSaveStatus("saved");
                        renderAll();
                    }
                } catch (e) {/* First run or no API – keep local/default state */ }"""

content = content.replace(original_load_and_init, replacement_load_and_init)

# 7. Replace imageFileInput listener with base64 fallback
original_file_input = """            document.getElementById("coverEditBtn").addEventListener("click", () => { pendingKey = "cover"; document.getElementById("imageFileInput").click(); });
            document.getElementById("imageFileInput").addEventListener("change", async (e) => {
                const file = e.target.files[0]; e.target.value = "";
                if (!file || !pendingKey) return;
                const key = pendingKey;
                const local = URL.createObjectURL(file);
                updateTilePreview(key, local);
                state.images[key] = { url: local }; renderAll();
                try {
                    const res = await uploadToCloudinary(file);
                    state.images[key] = { url: res.secure_url, publicId: res.public_id };
                    updateTilePreview(key, res.secure_url); scheduleSave();
                } catch (err) { console.error(err); }
            });"""

replacement_file_input = """            document.getElementById("coverEditBtn").addEventListener("click", () => { pendingKey = "cover"; document.getElementById("imageFileInput").click(); });
            document.getElementById("imageFileInput").addEventListener("change", async (e) => {
                const file = e.target.files[0]; e.target.value = "";
                if (!file || !pendingKey) return;
                const key = pendingKey;
                const local = URL.createObjectURL(file);
                updateTilePreview(key, local);
                state.images[key] = { url: local }; renderAll();
                try {
                    let uploadUrl = local;
                    try {
                        const res = await uploadToCloudinary(file);
                        uploadUrl = res.secure_url;
                        state.images[key] = { url: res.secure_url, publicId: res.public_id };
                    } catch (cloudinaryErr) {
                        console.log("Cloudinary upload failed, falling back to base64...");
                        const base64 = await fileToBase64(file);
                        uploadUrl = base64;
                        state.images[key] = { url: base64 };
                    }
                    updateTilePreview(key, uploadUrl); scheduleSave();
                } catch (err) { console.error(err); }
            });"""

content = content.replace(original_file_input, replacement_file_input)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied successfully!")
