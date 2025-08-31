# Travelgram (BETA) – enkel forklaring

## 1) Hva du har i denne mappa
- **Ferdig app** (Next.js) koblet til Supabase-en din.
- **Penere design** + **profil-sammendrag** (land, % av verden, verdensdeler).
- **Raskere bilder**: komprimering før opplasting + optimal visning.
- **Beta-modus**: søkemotorer indekserer ikke siden.

## 2) Kjør lokalt (test på din PC)
1. Åpne mappa i VS Code.
2. Terminal:
   ```bash
   npm i
   npm run dev
   ```
3. Gå til `http://localhost:3000` i nettleseren.
4. I Supabase: ha **public buckets** `post-images` og `avatars`.
5. Logg inn med magisk lenke på /login og prøv å lage innlegg.

## 3) Publiser (enkelt)
**Alternativ A – Vercel med drag&drop**
- Gå til Vercel → Opprett konto → New Project → **Import via drag & drop**.
- Når den spør om **Environment Variables**, legg inn:
  - `NEXT_PUBLIC_SUPABASE_URL` (din URL)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (din anon key)
  - `NEXT_PUBLIC_IS_STAGING` = `true` (beta, ikke indekser)
- Deploy → du får en nettadresse (f.eks. `https://dittnavn.vercel.app`).

**Alternativ B – GitHub + Vercel**
- Last opp mappa til et GitHub repo.
- På Vercel: “Import Project” → velg repoet.
- Legg inn de samme **Environment Variables** (over).

**Supabase Auth (viktig)**
- I Supabase → **Authentication → URL Configuration**:
  - **Site URL** = din Vercel-URL
  - **Additional Redirect URLs** = samme URL
  - Lagre.

## 4) Inviter testere
- Del Vercel-linken. De logger inn med e-post (magisk lenke).
- Beta er **noindex** (Google indekserer ikke).

## 5) Når du vil “gå live”
- På Vercel → Environment Variables:
  - Sett `NEXT_PUBLIC_IS_STAGING` til `false`.
- Deploy på nytt. Nå kan nettsiden indekseres.

## 6) Ytelse – hva jeg allerede har gjort
- Komprimerer bilder før opplasting (max 1920px, ~82% kvalitet).
- Viser bilder via Next/Image (laster bare det som er på skjermen).
- Indekser i databasen (ligger i `supabase/init.sql` – kan kjøres når du vil).

Spør meg hvis noe stopper – beskriv hvilket steg du står på, så sier jeg nøyaktig hvor du skal klikke og hva du skal skrive.
