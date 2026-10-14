import { NextResponse } from 'next/server';
import { getSessionUser, hasRequiredRole } from '../../../lib/session';
import { queryD1 } from '../../../lib/d1Client';
import { UpdateUserRoleSchema, getZodErrorMessage } from '../../../lib/validations';

// GET: Listar usuarios registrados (Solo staff: moderador, admin o super_admin)
export async function GET(request) {
  const sessionUser = await getSessionUser(request);
  if (!sessionUser || !hasRequiredRole(sessionUser.role, 'moderador')) {
    return NextResponse.json({ success: false, error: 'Acceso no autorizado' }, { status: 403 });
  }

  try {
    const users = await queryD1('SELECT id, email, name, picture, role, created_at, last_login FROM users ORDER BY created_at DESC');
    return NextResponse.json({ success: true, users: users || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Cambiar rol de usuario (Solo super_admin)
export async function PATCH(request) {
  const sessionUser = await getSessionUser(request);
  if (!sessionUser || sessionUser.role !== 'super_admin') {
    return NextResponse.json(
      { success: false, error: 'Solo el Super Administrador puede reasignar roles de usuario.' },
      { status: 403 }
    );
  }

  try {
    const rawBody = await request.json().catch(() => ({}));
    const parseResult = UpdateUserRoleSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: getZodErrorMessage(parseResult.error) },
        { status: 400 }
      );
    }

    const { userId, role } = parseResult.data;

    await queryD1('UPDATE users SET role = ? WHERE id = ?', [role, userId]);

    return NextResponse.json({
      success: true,
      message: `Rol de usuario actualizado a ${role} con éxito.`,
    });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
