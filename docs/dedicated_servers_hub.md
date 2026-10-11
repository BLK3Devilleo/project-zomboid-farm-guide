# Dedicated Servers Hub & Ranking MVP

## Overview
The Dedicated Servers Hub (Server Directory & Ranking) provides a centralized discovery platform for Project Zomboid multiplayer communities. Players can browse, search, filter, and inspect servers, copy connection addresses (`IP:Port`) with a single click, and vote for their favorite servers. Community owners can also list their servers directly via an in-app submission modal.

## Architecture

### 1. Data Layer & Supabase Integration (`app/lib/supabaseClient.js`)
- **Dual persistence model:** Uses `@supabase/supabase-js` if environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are present in the hosting environment (Dokploy / VPS).
- **Graceful fallback:** If Supabase keys are not yet configured, the system seamlessly initializes and manages data in `localStorage` (`spiffo_servers_directory_v1`), seeded by `initialServers`.
- **Operations:**
  - `fetchServersList()`: Retrieves active servers sorted by votes.
  - `createServerEntry(serverData)`: Registers a new community server.
  - `upvoteServerEntry(serverId)`: Registers community reputation votes with optimistic client updates.

### 2. Seed Communities Database (`app/data/serversDatabase.js`)
Includes 6 diverse test servers representing major game styles:
- **Kentucky Reborn Roleplay** (RP, Whitelist, Economy, LATAM)
- **Apocalipsis Hardcore | 100% Sprinters** (Hardcore, Permadeath, Night sprinters, Spain)
- **Zona Cero: PvP & Raids de Fin de Semana** (PvP, Factions, Safezones, LATAM)
- **Supervivientes de Knox (PvE Comunitario)** (PvE, Beginners, Vehicles, LATAM)
- **España Vanilla 24/7 Puro** (Vanilla, No mods, 24/7, Spain)
- **Overhaul Militar: Brita & Blindados** (Heavy Modded, Brita weapons, APCs, NA)

### 3. Components
- **`app/components/ServerList.jsx`**: Main directory view with live search, filters (Mode, Region, Loot, Sorting), dynamic ranking badges (`#1`, `#2`, `#3`), online status dots, and one-click IP copy. Styled with the Knox CRT Emergency Terminal aesthetic: hazard stripe tabs, chamfered corner reticles, LED VU-meter bars, and audio waveform telemetry.
- **`app/components/ServerDetailModal.jsx`**: Detailed server inspection dossier modal displaying server lore, player capacity, tags, server rules checklist, quick connect pill, official Discord link, and a Cloudflare R2 media showcase with interactive gallery thumbnails.
- **`app/components/AddServerModal.jsx`**: Server registration modal with inputs for name, IP, port, region, game mode, loot density, max player slots, description, Discord link, custom tags, and Cloudflare R2 image / gallery URLs.
- **`app/components/PillNav.jsx`**: Navigation bar updated with the **"🌐 Servidores"** floating capsule tab.
- **`app/globals.css`**: Pure CSS tactical styling for server cards, CRT monitor frames, LED VU-meters, audio telemetry rows, and Cloudflare R2 gallery previews.

## How to Test
1. Open the application and click on the **"🌐 Servidores"** tab in the top navigation bar.
2. Confirm that only the server directory is displayed (isolated from the onboarding wizard).
3. Test filtering by game mode (`Roleplay`, `PvP`, `Hardcore`, `PvE`) or region (`LATAM`, `España`, `NA`).
4. Click on the frequency badge (`📻 FREQ`) of any server to verify the clipboard copy feedback toast.
5. Click on **"⭐ Votar"** to test live reputation increment.
6. Click on any card or **"Dossier →"** to inspect server rules, description, Discord button, and the Cloudflare R2 gallery showcase with thumbnail switching.
7. Click on **"➕ Enlistar Mi Servidor"** to register a new community server with banner/gallery URLs.

## Cloudflare R2 & Image Storage Architecture
- The modal and database support `banner_url` and `gallery_images: [...]` arrays.
- `next.config.mjs` is configured with wildcard `remotePatterns` to allow high-performance image optimization from Cloudflare R2 public bucket URLs and CDNs.

## Supabase Schema for Production
To bind to a live Supabase project, execute the following SQL in the Supabase SQL Editor:
```sql
CREATE TABLE servers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  ip TEXT NOT NULL,
  port INTEGER NOT NULL DEFAULT 16261,
  region TEXT NOT NULL DEFAULT 'LATAM',
  mode TEXT NOT NULL DEFAULT 'PvE',
  loot_tier TEXT NOT NULL DEFAULT 'Normal',
  players_online INTEGER DEFAULT 0,
  max_players INTEGER DEFAULT 32,
  is_online BOOLEAN DEFAULT true,
  description TEXT,
  discord_url TEXT,
  banner_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RPC for atomic voting
CREATE OR REPLACE FUNCTION increment_server_vote(server_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE servers
  SET votes = votes + 1
  WHERE id = server_id;
END;
$$ LANGUAGE plpgsql;
```
Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the environment variables on Dokploy / VPS to transition from local fallback to cloud database.

