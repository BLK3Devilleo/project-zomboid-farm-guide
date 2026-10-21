import { queryD1 } from './d1Client';
import { broadcastLog } from './sseLogger';

let isBootstrapped = false;

async function getTableColumns(tableName) {
  try {
    const rows = await queryD1(`PRAGMA table_info(${tableName})`);
    if (Array.isArray(rows)) {
      return new Set(rows.map((r) => r.name.toLowerCase()));
    }
  } catch (err) {
    // Si la tabla aún no existe, table_info retornará vacío
  }
  return new Set();
}

/**
 * Inicializador DDL Idempotente y Migrador en Caliente para Cloudflare D1.
 * Inspecciona el esquema existente antes de alterar tablas para garantizar 0 errores de duplicidad.
 */
export async function ensureProductionTables() {
  if (isBootstrapped) return;

  try {
    // 1. Tabla de Usuarios y Progresión
    await queryD1(`
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
      )
    `);

    // 2. Tabla de Votos en Servidores
    await queryD1(`
      CREATE TABLE IF NOT EXISTS server_votes (
        user_id TEXT NOT NULL,
        server_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, server_id),
        FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
      )
    `);

    // 3. Tabla de Reseñas de Servidores (3 Estrellas)
    await queryD1(`
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
      )
    `);

    // 4. Tabla de Comentarios Normalizados del Foro
    await queryD1(`
      CREATE TABLE IF NOT EXISTS forum_comments (
        id TEXT PRIMARY KEY,
        thread_id TEXT NOT NULL,
        parent_id TEXT,
        author_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_badge TEXT DEFAULT '[SUPERVIVIENTE]',
        author_color TEXT DEFAULT '#38bdf8',
        content TEXT NOT NULL,
        upvotes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (thread_id) REFERENCES forum_threads(id) ON DELETE CASCADE
      )
    `);

    // 5. Tabla de Votos Únicos en el Foro
    await queryD1(`
      CREATE TABLE IF NOT EXISTS forum_votes (
        user_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        thread_id TEXT,
        target_type TEXT DEFAULT 'thread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, target_id)
      )
    `);

    // 6. Migraciones condicionales con inspección previa (Cero errores de duplicidad)
    const userCols = await getTableColumns('users');
    if (userCols.size > 0) {
      if (!userCols.has('xp')) await queryD1("ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 0");
      if (!userCols.has('completed_milestones')) await queryD1("ALTER TABLE users ADD COLUMN completed_milestones TEXT DEFAULT '[]'");
      if (!userCols.has('active_route')) await queryD1("ALTER TABLE users ADD COLUMN active_route TEXT");
      if (!userCols.has('nickname')) await queryD1("ALTER TABLE users ADD COLUMN nickname TEXT");
      if (!userCols.has('profession')) await queryD1("ALTER TABLE users ADD COLUMN profession TEXT DEFAULT 'Desempleado'");
      if (!userCols.has('playstyle')) await queryD1("ALTER TABLE users ADD COLUMN playstyle TEXT DEFAULT 'PvE'");
      if (!userCols.has('discord_tag')) await queryD1("ALTER TABLE users ADD COLUMN discord_tag TEXT");
      if (!userCols.has('bio')) await queryD1("ALTER TABLE users ADD COLUMN bio TEXT");
      if (!userCols.has('avatar_pz')) await queryD1("ALTER TABLE users ADD COLUMN avatar_pz TEXT DEFAULT 'spiffo_combat.png'");
    }

    const reviewCols = await getTableColumns('server_reviews');
    if (reviewCols.size > 0) {
      if (!reviewCols.has('user_role')) await queryD1("ALTER TABLE server_reviews ADD COLUMN user_role TEXT DEFAULT 'usuario'");
      if (!reviewCols.has('updated_at')) await queryD1("ALTER TABLE server_reviews ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
    }

    const voteCols = await getTableColumns('forum_votes');
    if (voteCols.size > 0) {
      if (!voteCols.has('thread_id')) await queryD1("ALTER TABLE forum_votes ADD COLUMN thread_id TEXT");
      if (!voteCols.has('target_id')) await queryD1("ALTER TABLE forum_votes ADD COLUMN target_id TEXT");
      if (!voteCols.has('target_type')) await queryD1("ALTER TABLE forum_votes ADD COLUMN target_type TEXT DEFAULT 'thread'");
    }

    // Sincronizar thread_id <-> target_id para compatibilidad total de votos
    try {
      await queryD1("UPDATE forum_votes SET thread_id = target_id WHERE (thread_id IS NULL OR thread_id = '') AND target_id IS NOT NULL");
    } catch (e) {}

    try {
      await queryD1("UPDATE forum_votes SET target_id = thread_id WHERE (target_id IS NULL OR target_id = '') AND thread_id IS NOT NULL");
    } catch (e) {}

    // Saneamiento de banners locales /uploads/ que quedaron huérfanos tras reiniciar el contenedor
    try {
      await queryD1("UPDATE servers SET banner_url = '/spiffo/spiffo_character.png' WHERE banner_url LIKE '/uploads/%'");
    } catch (e) {}

    // 7. Índices de aceleración
    await queryD1(`CREATE INDEX IF NOT EXISTS idx_server_reviews_server ON server_reviews(server_id)`);
    await queryD1(`CREATE INDEX IF NOT EXISTS idx_forum_comments_thread ON forum_comments(thread_id)`);

    isBootstrapped = true;
    broadcastLog('info', '[DB-BOOTSTRAP] Esquema e índices de Cloudflare D1 verificados y sincronizados.');
  } catch (err) {
    console.warn('Advertencia en ensureProductionTables (D1 Bootstrap):', err.message);
  }
}
