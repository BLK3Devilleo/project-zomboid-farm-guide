-- KnoxOS HUD Build 42 - Cloudflare D1 Production Schema
-- SQLite Distribuido Serverless

-- 1. Tabla de Usuarios y Progresión
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  picture TEXT,
  role TEXT NOT NULL DEFAULT 'usuario' CHECK (role IN ('super_admin', 'admin', 'moderador', 'usuario')),
  nickname TEXT,
  profession TEXT DEFAULT 'Desempleado',
  playstyle TEXT DEFAULT 'PvE',
  discord_tag TEXT,
  bio TEXT,
  avatar_pz TEXT DEFAULT 'spiffo_combat.png',
  xp INTEGER NOT NULL DEFAULT 0,
  completed_milestones TEXT DEFAULT '[]',
  active_route TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Directorio de Servidores
CREATE TABLE IF NOT EXISTS servers (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  owner_email TEXT,
  name TEXT NOT NULL,
  ip TEXT NOT NULL,
  port INTEGER NOT NULL DEFAULT 16261,
  region TEXT NOT NULL DEFAULT 'LATAM',
  mode TEXT NOT NULL DEFAULT 'PvE',
  loot_tier TEXT DEFAULT 'Normal',
  max_players INTEGER NOT NULL DEFAULT 32,
  players_online INTEGER NOT NULL DEFAULT 0,
  is_online INTEGER NOT NULL DEFAULT 1,
  votes INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  discord_url TEXT,
  banner_url TEXT DEFAULT '/spiffo/spiffo_character.png',
  gallery_images TEXT DEFAULT '[]',
  tags TEXT DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Votos Únicos en Servidores (1 voto por usuario registrado)
CREATE TABLE IF NOT EXISTS server_votes (
  user_id TEXT NOT NULL,
  server_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, server_id),
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
);

-- 4. Reseñas Globales de Servidores (3 Estrellas, 1 por usuario por servidor)
CREATE TABLE IF NOT EXISTS server_reviews (
  id TEXT PRIMARY KEY,
  server_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  user_role TEXT DEFAULT 'usuario',
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 3),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE,
  UNIQUE(server_id, user_id)
);

-- 5. Anuncios y Eventos de Servidores
CREATE TABLE IF NOT EXISTS server_events (
  id TEXT PRIMARY KEY,
  server_id TEXT NOT NULL,
  server_name TEXT,
  server_ip TEXT,
  owner_id TEXT NOT NULL,
  owner_email TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  directives TEXT DEFAULT '[]',
  event_type TEXT DEFAULT 'pvp',
  type TEXT DEFAULT 'EVENTO COMUNITARIO',
  urgency TEXT DEFAULT 'MODERADA',
  tag TEXT DEFAULT 'EVENTO DE SERVIDOR',
  status TEXT DEFAULT 'PROGRAMADO',
  date_display TEXT NOT NULL,
  frequency TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
);

-- 6. Foro Comunitario: Hilos
CREATE TABLE IF NOT EXISTS forum_threads (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_badge TEXT DEFAULT '[SUPERVIVIENTE]',
  author_color TEXT DEFAULT '#38bdf8',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  takeaway TEXT,
  city TEXT DEFAULT 'Rosewood',
  day TEXT DEFAULT 'Día 1',
  tag TEXT DEFAULT 'TÁCTICA B42',
  upvotes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  comments_json TEXT DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Foro Comunitario: Comentarios Normalizados (Árbol Recursivo Infinito)
CREATE TABLE IF NOT EXISTS forum_comments (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  parent_id TEXT, -- NULL para raíz, ID de comentario para réplicas anidadas
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_badge TEXT DEFAULT '[SUPERVIVIENTE]',
  author_color TEXT DEFAULT '#38bdf8',
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (thread_id) REFERENCES forum_threads(id) ON DELETE CASCADE
);

-- 8. Votos Únicos en el Foro (Hilos y Comentarios)
CREATE TABLE IF NOT EXISTS forum_votes (
  user_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  thread_id TEXT,
  target_type TEXT NOT NULL DEFAULT 'thread' CHECK (target_type IN ('thread', 'comment')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, target_id)
);

-- 9. Transmisiones de Radio en Vivo (Chat 91.5 MHz)
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_role TEXT DEFAULT 'usuario',
  avatar TEXT,
  message TEXT NOT NULL,
  server_ref_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Índices de Alto Rendimiento
CREATE INDEX IF NOT EXISTS idx_server_votes_server ON server_votes(server_id);
CREATE INDEX IF NOT EXISTS idx_server_reviews_server ON server_reviews(server_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_thread ON forum_comments(thread_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_parent ON forum_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON chat_messages(created_at DESC);
