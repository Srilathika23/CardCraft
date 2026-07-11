filepath = r"c:\Users\srila\Downloads\CardCraft-main\CardCraft-main\next-app\public\editor.html"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update QR code profileUrl in showLandingOverlay
original_qr_line = 'const profileUrl = `https://cardcraft.id/${USER_ID}`;'
replacement_qr_line = 'const profileUrl = CARD_ID ? `${window.location.origin}/card/${CARD_ID}` : `${window.location.origin}/card/guest`;'

content = content.replace(original_qr_line, replacement_qr_line, 1) # first occurrence

# 2. Update profileUrl in copyLinkBtn click handler
content = content.replace(original_qr_line, replacement_qr_line, 1) # second occurrence

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("QR and copy link patch applied successfully!")
