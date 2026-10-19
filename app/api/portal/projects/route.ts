import { NextRequest, NextResponse } from 'next/server';
import {
  setPortalProjectVisibility,
  syncAndListPortalProjects,
} from '../../../../src/db/portal-projects-repository';
import type { PortalProjectVisibility } from '@/lib/portal/portal-auth';

export async function GET() {
  const items = await syncAndListPortalProjects();
  return NextResponse.json({
    status: 'OK',
    items,
  });
}

export async function PATCH(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  const visibility =
    body.visibility === 'primary_showcase' ||
    body.visibility === 'internal_archive'
      ? (body.visibility as PortalProjectVisibility)
      : null;

  if (!slug || !visibility) {
    return NextResponse.json(
      { error: 'Valid slug and visibility are required.' },
      { status: 400 }
    );
  }

  const items = await setPortalProjectVisibility(slug, visibility);
  return NextResponse.json({
    status: 'UPDATED',
    items,
  });
}
