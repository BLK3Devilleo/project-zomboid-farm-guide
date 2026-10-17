import { z } from 'zod';

// Esquema de validación para el token de Google
export const GoogleAuthSchema = z.object({
  credential: z
    .string({ required_error: 'El token de credencial de Google es obligatorio' })
    .min(20, 'Token de Google inválido')
    .max(4096, 'Token de Google excede longitud permitida'),
});

// Extrae de forma segura el mensaje de error de Zod v3 o v4
export function getZodErrorMessage(error) {
  if (!error) return 'Datos inválidos';
  if (Array.isArray(error.issues) && error.issues.length > 0) {
    return error.issues[0].message;
  }
  if (Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors[0].message;
  }
  return error.message || 'Datos inválidos';
}

// Expresión regular para IPv4, IPv6 o Dominio/Host válido
const IP_OR_HOSTNAME_REGEX =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$|^[a-zA-Z0-9.-]+$/;

// Esquema de validación estricta para crear servidores
export const CreateServerSchema = z.object({
  name: z
    .string({ required_error: 'El nombre del servidor es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(64, 'El nombre no puede exceder 64 caracteres'),
  ip: z
    .string({ required_error: 'La dirección IP o Dominio es obligatoria' })
    .trim()
    .min(3, 'La dirección IP o Dominio debe tener al menos 3 caracteres')
    .max(128, 'La dirección IP o Dominio no puede exceder 128 caracteres')
    .refine(
      (val) => IP_OR_HOSTNAME_REGEX.test(val),
      { message: 'Formato de IP o Dominio inválido (ej: 142.44.215.89 o play.servidor.com)' }
    ),
  port: z.coerce
    .number({ required_error: 'El puerto es obligatorio' })
    .int('El puerto debe ser un número entero')
    .min(1024, 'El puerto debe estar entre 1024 y 65535')
    .max(65535, 'El puerto no puede ser mayor a 65535')
    .default(16261),
  region: z.enum(['LATAM', 'ES', 'España', 'NA', 'EU', 'GLOBAL'], {
    errorMap: () => ({ message: 'Región inválida. Opciones: LATAM, España, NA, EU, GLOBAL' }),
  }).default('LATAM'),
  gamemode: z.enum(['PvE', 'PvP', 'Hardcore', 'Rol', 'Roleplay'], {
    errorMap: () => ({ message: 'Modo inválido. Opciones: PvE, PvP, Hardcore, Roleplay' }),
  }).default('PvE'),
  loot_multiplier: z.string().trim().max(32).default('Normal'),
  zombie_speed: z.string().trim().max(32).default('Fast Shamblers'),
  pvp_rules: z.string().trim().max(64).default('Desactivado'),
  max_players: z.coerce
    .number()
    .int()
    .min(1, 'El cupo mínimo es 1 jugador')
    .max(128, 'El cupo máximo permitido es 128')
    .default(32),
  description: z
    .string()
    .trim()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .default(''),
  rules: z
    .string()
    .trim()
    .max(800, 'Las reglas no pueden exceder 800 caracteres')
    .default(''),
  discord_url: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || val.startsWith('http://') || val.startsWith('https://'),
      { message: 'El enlace debe ser una URL válida que inicie con http:// o https://' }
    ),
  banner_url: z
    .string()
    .trim()
    .max(1024)
    .optional()
    .default('/spiffo/spiffo_character.png'),
  gallery_images: z
    .array(z.string().trim().max(1024))
    .optional()
    .default([]),
  tags: z
    .array(z.string().trim().max(32))
    .max(12, 'Máximo 12 etiquetas permitidas')
    .default([]),
});

// Esquema de validación para votos
export const VoteServerSchema = z.object({
  id: z
    .string({ required_error: 'El identificador del servidor es obligatorio' })
    .regex(/^srv-[a-zA-Z0-9_-]+$/, 'ID de servidor malformado'),
});

// Esquema para actualización de roles administrativos
export const UpdateUserRoleSchema = z.object({
  userId: z.string().min(1, 'El ID de usuario es obligatorio'),
  role: z.enum(['super_admin', 'admin', 'moderador', 'usuario'], {
    errorMap: () => ({ message: 'Rol inválido' }),
  }),
});

// Esquema para actualizar perfil de jugador PZ
export const UpdateProfileSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, 'El apodo debe tener al menos 2 caracteres')
    .max(30, 'El apodo no puede exceder 30 caracteres')
    .optional(),
  profession: z
    .string()
    .trim()
    .max(40)
    .default('Desempleado'),
  playstyle: z
    .string()
    .trim()
    .max(30)
    .default('PvE'),
  discord_tag: z
    .string()
    .trim()
    .max(36, 'El tag de Discord no puede exceder 36 caracteres')
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .trim()
    .max(300, 'El lema o bio no puede exceder 300 caracteres')
    .optional()
    .or(z.literal('')),
  avatar_pz: z
    .string()
    .trim()
    .default('spiffo_combat.png'),
  xp: z.coerce.number().int().min(0).max(1000000).optional(),
  completed_milestones: z.array(z.string().trim().max(100)).optional(),
  active_route: z.string().trim().max(100).optional(),
});

// Esquema para mensajes del chat de radio en vivo
export const ChatMessageSchema = z.object({
  message: z
    .string({ required_error: 'El mensaje es obligatorio' })
    .trim()
    .min(1, 'El mensaje no puede estar vacío')
    .max(280, 'El mensaje no puede exceder 280 caracteres'),
  server_ref_id: z
    .string()
    .optional()
    .or(z.literal('')),
});

