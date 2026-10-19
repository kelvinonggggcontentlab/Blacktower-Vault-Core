import { eq } from 'drizzle-orm';
import { db } from './index.ts';
import { portalProjects } from './schema.ts';
import {
  PORTAL_WORKSPACES,
  type PortalAuthorizationStatus,
  type PortalCompletionStatus,
  type PortalProjectVisibility,
  type PortalWorkspaceItem,
} from '../../lib/portal/portal-auth.ts';

/**
 * Ensures all default BLACKTOWER OS™ showcase products and preserved internal Notion
 * workspaces exist in PostgreSQL (`portal_projects` table) without deleting or overwriting
 * operator visibility customizations.
 */
export async function syncAndListPortalProjects(): Promise<PortalWorkspaceItem[]> {
  if (!process.env.SQL_HOST || !process.env.SQL_DB_NAME) {
    return PORTAL_WORKSPACES;
  }

  try {
    const existingRows = await db.select().from(portalProjects);
    const existingBySlug = new Map(existingRows.map((row) => [row.slug, row]));

    for (const item of PORTAL_WORKSPACES) {
      if (!existingBySlug.has(item.id)) {
        await db.insert(portalProjects).values({
          slug: item.id,
          indexLabel: item.indexLabel,
          name: item.name,
          tagline: item.tagline,
          description: item.description,
          category: item.category,
          visibility: item.visibility,
          completionStatus: item.completionStatus,
          authorizationStatus: item.authorizationStatus,
          externalUrl: item.url,
          internalRoute: item.internalRoute ?? '',
          actionLabel: item.actionLabel ?? 'Open',
          iconKey: item.iconKey,
          displayOrder: item.displayOrder,
        });
      }
    }

    const updatedRows = await db.select().from(portalProjects);
    const rowBySlug = new Map(updatedRows.map((r) => [r.slug, r]));

    return PORTAL_WORKSPACES.map((item) => {
      const dbRow = rowBySlug.get(item.id);
      if (!dbRow) return item;
      return {
        ...item,
        visibility: (dbRow.visibility === 'primary_showcase'
          ? 'primary_showcase'
          : 'internal_archive') as PortalProjectVisibility,
        completionStatus: (dbRow.completionStatus ||
          item.completionStatus) as PortalCompletionStatus,
        authorizationStatus: (dbRow.authorizationStatus ||
          item.authorizationStatus) as PortalAuthorizationStatus,
      };
    });
  } catch {
    return PORTAL_WORKSPACES;
  }
}

/**
 * Safely and reversibly updates a project's visibility in PostgreSQL
 * ('primary_showcase' <-> 'internal_archive') without deleting any database rows.
 */
export async function setPortalProjectVisibility(
  slug: string,
  visibility: PortalProjectVisibility
): Promise<PortalWorkspaceItem[]> {
  if (process.env.SQL_HOST && process.env.SQL_DB_NAME) {
    try {
      await syncAndListPortalProjects();
      await db
        .update(portalProjects)
        .set({
          visibility,
          updatedAt: new Date(),
        })
        .where(eq(portalProjects.slug, slug));
    } catch {
      // Fall through to return current state
    }
  }
  return syncAndListPortalProjects();
}
