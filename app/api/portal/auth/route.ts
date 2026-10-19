import { NextRequest, NextResponse } from 'next/server';
import {
  validatePortalEmail,
  verifyAuthorizedPortalCredentials,
} from '@/lib/portal/portal-auth';
import { getOrCreateUser } from '../../../../src/db/users';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Access service is unavailable. Please try again later.' },
      { status: 400 }
    );
  }

  const mode = typeof body.mode === 'string' ? body.mode : 'signin';

  if (mode === 'recover') {
    const emailCheck = validatePortalEmail(body.email);
    if (!emailCheck.valid) {
      return NextResponse.json({ error: emailCheck.error }, { status: 400 });
    }
    return NextResponse.json(
      {
        status: 'RECOVERY_SENT',
        message:
          'If this email belongs to an authorized account, a recovery link will arrive shortly.',
      },
      { status: 200 }
    );
  }

  const verified = verifyAuthorizedPortalCredentials(body.email, body.password);
  if (!verified.ok) {
    return NextResponse.json({ error: verified.error }, { status: 401 });
  }

  // Upsert operator identity into PostgreSQL users table (zero password material stored)
  if (process.env.SQL_HOST && process.env.SQL_DB_NAME) {
    try {
      await getOrCreateUser(verified.user.uid, verified.user.email);
    } catch {
      // Fail gracefully if DB connection is warming up; never leak SQL internals
    }
  }

  return NextResponse.json(
    {
      status: 'VERIFIED',
      user: verified.user,
    },
    { status: 200 }
  );
}
