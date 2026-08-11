# FireGuard Supabase Setup (Roman English)

## Zaroori security step

Jo secret key chat mein share hui thi woh compromised samjhi jayegi. Supabase
Dashboard mein us key ko revoke karo aur nayi `sb_secret_...` key banao. Nayi
key ko chat, GitHub, screenshot ya ZIP mein share mat karna.

## Local Codespace setup

Project folder open karo:

```bash
cd /workspaces/fireguard-ai/fireguard-ai-app
```

Safe template copy karo:

```bash
cp .env.example .env.local
nano .env.local
```

`SUPABASE_SERVICE_ROLE_KEY=` ke baad apni **new rotated secret key** paste karo.
Save karne ke liye `Ctrl+O`, `Enter`, phir `Ctrl+X` press karo.

Key ko print kiye baghair check karo:

```bash
grep -q '^SUPABASE_SERVICE_ROLE_KEY=.' .env.local && echo "Service key found" || echo "Service key missing"
```

Development server restart karo:

```bash
rm -rf .next
npm install
npm run dev
```

New terminal mein API test karo:

```bash
curl -s http://localhost:3000/api/locations
```

Sahi connection par response mein `"success":true` aur `"total":202` aana
chahiye. Us ke baad `3089` search website par matching location show karega,
agar yeh value `locations` table ke kisi searchable column mein mojood hai.

## Vercel production setup

Vercel project mein `Settings > Environment Variables` open karo aur yeh do
variables add karo:

```text
SUPABASE_URL=https://magpoxmpqlxhifegzwqd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_NEW_ROTATED_SECRET_KEY
```

`SUPABASE_SERVICE_ROLE_KEY` ko Production, Preview aur Development ke liye add
karo. Is variable ke naam ke aage `NEXT_PUBLIC_` bilkul mat lagana. Variables
save karne ke baad latest deployment ko Redeploy karo.

## Database security

Supabase Dashboard ke SQL Editor mein `supabase-setup.sql` ek dafa run karo.
Is se browser ka direct table access band rahega; website ka secure server route
aur authenticated admin upload phir bhi secret key ke through kaam karega.

## Excel columns

Admin upload file mein yeh headings exact honi chahiye:

```text
SNO | District_Code | District_Name | Code | Door_Name | Zone
```

Upload successful hone ke baad home page refresh karo. FACP Locations aur
Uploaded Data dono updated row count show karenge.

## Upload behavior

Admin upload append-only hai. Existing Supabase rows delete nahi hoti. Uploaded
file mein jo location pehle se same `District_Code`, `District_Name`, `Code`,
`Door_Name` aur `Zone` ke saath mojood ho woh duplicate skip hoti hai. Sirf new
location insert hoti hai.
