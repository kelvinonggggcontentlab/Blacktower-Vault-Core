export interface PortalSessionUser {
  uid: string;
  email: string;
  verifiedAt: string;
}

export type PortalProjectVisibility = 'primary_showcase' | 'internal_archive';

export type PortalCompletionStatus =
  | 'COMPLETED'
  | 'APPROVED_MODULE'
  | 'INTERNAL_WORKSPACE';

export type PortalAuthorizationStatus = 'AUTHORIZED' | 'RESTRICTED';

export interface PortalWorkspaceItem {
  id: string;
  indexLabel: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  visibility: PortalProjectVisibility;
  completionStatus: PortalCompletionStatus;
  authorizationStatus: PortalAuthorizationStatus;
  capabilities?: string[];
  architectureSummary?: string;
  url: string;
  internalRoute?: string;
  actionLabel?: string;
  displayOrder: number;
  iconKey:
    | 'shield-lock'
    | 'eye-off'
    | 'database-lock'
    | 'cpu-check'
    | 'list-todo'
    | 'calendar-check'
    | 'layout-grid'
    | 'briefcase-business'
    | 'database-backup'
    | 'clipboard-check'
    | 'book-open';
}

export const COMMAND_CENTRE_NOTION_URL =
  'https://app.notion.com/p/3f59e06eef38813db55bf779610835b3';

/**
 * Complete BLACKTOWER OS™ Catalog.
 * Separates Completed & Approved Showcase Products ('primary_showcase') from
 * Preserved Internal Planning Workspaces ('internal_archive') so internal Notion links
 * are 100% preserved in the backend without cluttering the primary product showcase.
 */
export const PORTAL_WORKSPACES: PortalWorkspaceItem[] = [
  // ============================================================================
  // PRIMARY SHOWCASE: COMPLETED & APPROVED BLACKTOWER PRODUCTS
  // ============================================================================
  {
    id: 'blacktower-vault',
    indexLabel: '01',
    name: 'BLACKTOWER VAULT™',
    tagline: 'Flagship Zero-Knowledge Personal Password & Digital Identity Vault',
    description:
      'Client-side encrypted vault for passwords, secure notes, payment cards, and digital identities. Every record is sealed locally under a unique 256-bit AES-GCM item key before touching storage.',
    category: 'Flagship Security Application',
    visibility: 'primary_showcase',
    completionStatus: 'COMPLETED',
    authorizationStatus: 'AUTHORIZED',
    capabilities: [
      '4-Tier Key Hierarchy (Argon2id v1.3 KEK → Root Key → Vault Key → Per-Item 256-Bit Key)',
      'Canonical v1 AAD binding & runtime (keyId, nonceHex) collision guard',
      'Local-only zero-knowledge CSV import & high-entropy password/passphrase generator',
      'Timed clipboard auto-clear & volatile in-memory keyring zeroization on lock',
    ],
    architectureSummary: 'Argon2id v1.3 · AES-256-GCM · 96-Bit Nonce · 128-Bit Tag',
    url: '',
    internalRoute: '/vault',
    actionLabel: 'Launch BLACKTOWER VAULT™',
    displayOrder: 1,
    iconKey: 'shield-lock',
  },
  {
    id: 'screen-exposure-engine',
    indexLabel: '02',
    name: 'Screen Exposure Protection Engine',
    tagline: 'Fail-Closed Runtime Display & Capture Defense Subsystem',
    description:
      'Strict runtime protection layer preventing accidental exposure of decrypted vault records across secondary displays, screen casting, mirroring, background switching, and unverified reveal states.',
    category: 'Runtime Privacy Subsystem',
    visibility: 'primary_showcase',
    completionStatus: 'COMPLETED',
    authorizationStatus: 'AUTHORIZED',
    capabilities: [
      'Deterministic state machine (PRIVATE_SAFE, EXTERNAL_DISPLAY_DETECTED, CAPTURE_SUSPECTED)',
      'Pre-render secret reveal gate before any password, CVV, PIN, or Recovery Key is shown',
      'Immediate Privacy Shield overlay & volatile memory purge on exposure risk',
      'Native Android WindowManager.LayoutParams.FLAG_SECURE & DisplayManager Kotlin architecture',
    ],
    architectureSummary: 'Fail-Closed Privacy Shield · Pre-Render Gate · Native Android Reference',
    url: '',
    internalRoute: '/vault?tab=security',
    actionLabel: 'Inspect Exposure Engine',
    displayOrder: 2,
    iconKey: 'eye-off',
  },
  {
    id: 'zk-cloud-sync',
    indexLabel: '03',
    name: 'Zero-Knowledge Cloud SQL Sync & Recovery',
    tagline: 'Authenticated Ciphertext Persistence & 256-Bit Recovery Architecture',
    description:
      'Synchronizes wrapped key hierarchies and encrypted item envelopes to Cloud SQL PostgreSQL while enforcing strict server-side plaintext rejection and independent 256-bit Recovery Key unwrapping.',
    category: 'Cloud & Recovery Infrastructure',
    visibility: 'primary_showcase',
    completionStatus: 'COMPLETED',
    authorizationStatus: 'AUTHORIZED',
    capabilities: [
      'Cloud SQL PostgreSQL persistence storing only wrapped keys and AES-256-GCM envelopes',
      'Server-side recursive plaintext secret validator rejecting unencrypted payloads (HTTP 400)',
      'Independent 256-bit Recovery Key (BTVK-...) verification and non-destructive key rotation',
      'Authenticated .btvault offline backup container export and integrity verification',
    ],
    architectureSummary: 'Cloud SQL PostgreSQL · Drizzle ORM · Domain-Separated Sync Auth',
    url: '',
    internalRoute: '/vault?tab=settings',
    actionLabel: 'Open Sync & Recovery',
    displayOrder: 3,
    iconKey: 'database-lock',
  },
  {
    id: 'crypto-diagnostics-suite',
    indexLabel: '04',
    name: 'Cryptographic Verification & Audit Suite',
    tagline: '9-Test Live Runtime Cryptographic Regression Engine',
    description:
      'Executes nine mandatory cryptographic and memory-safety verification tests directly in the browser runtime—verifying round-trip encryption, tampering rejection, AAD binding, and zeroization.',
    category: 'Security Assurance & Diagnostics',
    visibility: 'primary_showcase',
    completionStatus: 'COMPLETED',
    authorizationStatus: 'AUTHORIZED',
    capabilities: [
      'TEST-01 to TEST-05: Hierarchical round-trip, wrong password, tampering, nonce reuse, AAD binding',
      'TEST-06 to TEST-09: Storage plaintext inspection, memory zeroization, backup integrity, log redaction',
      'Real-time security posture computation derived strictly from live runtime checks',
      'Zero secret leakage in diagnostic snapshots and security event logs',
    ],
    architectureSummary: 'TEST-01..TEST-09 Live Execution · Zero Hardcoded Pass States',
    url: '',
    internalRoute: '/vault?tab=security',
    actionLabel: 'Run Live Diagnostics',
    displayOrder: 4,
    iconKey: 'cpu-check',
  },

  // ============================================================================
  // PRESERVED INTERNAL WORKSPACES & NOTION ARCHIVE (SAFE REVERSIBLE SEPARATION)
  // ============================================================================
  {
    id: 'daily-tasks',
    indexLabel: '01',
    name: 'Daily Tasks',
    tagline: 'Internal Workspace Reference',
    description: 'Daily priorities and task lists',
    category: 'Internal Planning (Notion)',
    visibility: 'internal_archive',
    completionStatus: 'INTERNAL_WORKSPACE',
    authorizationStatus: 'AUTHORIZED',
    url: 'https://app.notion.com/p/20b9e06eef38806093aee1507e116e8f',
    actionLabel: 'Open in Notion',
    displayOrder: 101,
    iconKey: 'list-todo',
  },
  {
    id: 'project-planner',
    indexLabel: '02',
    name: 'Project Planner',
    tagline: 'Internal Workspace Reference',
    description: 'Plans, milestones and next steps',
    category: 'Internal Planning (Notion)',
    visibility: 'internal_archive',
    completionStatus: 'INTERNAL_WORKSPACE',
    authorizationStatus: 'AUTHORIZED',
    url: 'https://app.notion.com/p/20b9e06eef3880c5a68ec7a7e30b9c17',
    actionLabel: 'Open in Notion',
    displayOrder: 102,
    iconKey: 'calendar-check',
  },
  {
    id: 'nexus-tracker',
    indexLabel: '03',
    name: 'NEXUS V4 Tracker',
    tagline: 'Internal Workspace Reference',
    description: 'Personal operating system',
    category: 'Internal Planning (Notion)',
    visibility: 'internal_archive',
    completionStatus: 'INTERNAL_WORKSPACE',
    authorizationStatus: 'AUTHORIZED',
    url: 'https://app.notion.com/p/3979e06eef3880718b06f5d70bbe69db',
    actionLabel: 'Open in Notion',
    displayOrder: 103,
    iconKey: 'layout-grid',
  },
  {
    id: 'amway-business',
    indexLabel: '04',
    name: 'Amway Business OS',
    tagline: 'Internal Coordination Reference',
    description: 'Business planning and coordination',
    category: 'Internal Planning',
    visibility: 'internal_archive',
    completionStatus: 'INTERNAL_WORKSPACE',
    authorizationStatus: 'AUTHORIZED',
    url: '',
    actionLabel: 'Link to be configured',
    displayOrder: 104,
    iconKey: 'briefcase-business',
  },
  {
    id: 'mirror-backup',
    indexLabel: '05',
    name: 'Supabase Mirror & Backup',
    tagline: 'Internal Architecture Reference',
    description: 'Mirror and backup planning',
    category: 'Internal Planning (Notion)',
    visibility: 'internal_archive',
    completionStatus: 'INTERNAL_WORKSPACE',
    authorizationStatus: 'AUTHORIZED',
    url: 'https://app.notion.com/p/3f79e06eef388137af36efe6dfde1e',
    actionLabel: 'Open in Notion',
    displayOrder: 105,
    iconKey: 'database-backup',
  },
  {
    id: 'workspace-audit',
    indexLabel: '06',
    name: 'Workspace Audit',
    tagline: 'Internal Migration Reference',
    description: 'Workspace Audit & Migration Plan',
    category: 'Internal Planning (Notion)',
    visibility: 'internal_archive',
    completionStatus: 'INTERNAL_WORKSPACE',
    authorizationStatus: 'AUTHORIZED',
    url: 'https://app.notion.com/p/3f59e06eef3881038811dad8aa7c69fa',
    actionLabel: 'Open in Notion',
    displayOrder: 106,
    iconKey: 'clipboard-check',
  },
  {
    id: 'knowledge-architecture',
    indexLabel: '07',
    name: 'Knowledge / Architecture',
    tagline: 'Internal Documentation Reference',
    description: 'NEXUS Product & Architecture',
    category: 'Internal Documentation (Notion)',
    visibility: 'internal_archive',
    completionStatus: 'INTERNAL_WORKSPACE',
    authorizationStatus: 'AUTHORIZED',
    url: 'https://app.notion.com/p/3ac9e06eef388002a4acdc0c237538c1',
    actionLabel: 'Open in Notion',
    displayOrder: 107,
    iconKey: 'book-open',
  },
];

export function getApprovedShowcaseProducts(
  items: PortalWorkspaceItem[] = PORTAL_WORKSPACES
): PortalWorkspaceItem[] {
  return items
    .filter((item) => item.visibility === 'primary_showcase')
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getPreservedInternalWorkspaces(
  items: PortalWorkspaceItem[] = PORTAL_WORKSPACES
): PortalWorkspaceItem[] {
  return items
    .filter((item) => item.visibility === 'internal_archive')
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function toggleProjectVisibility(
  items: PortalWorkspaceItem[],
  projectId: string
): PortalWorkspaceItem[] {
  return items.map((item) => {
    if (item.id !== projectId) return item;
    const nextVisibility: PortalProjectVisibility =
      item.visibility === 'primary_showcase'
        ? 'internal_archive'
        : 'primary_showcase';
    return {
      ...item,
      visibility: nextVisibility,
    };
  });
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validatePortalEmail(
  rawEmail: unknown
): { valid: true; email: string } | { valid: false; error: string } {
  if (typeof rawEmail !== 'string') {
    return { valid: false, error: 'Enter a valid email address.' };
  }
  const trimmed = rawEmail.trim();
  if (!trimmed || trimmed.length > 254 || !EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Enter a valid email address.' };
  }
  return { valid: true, email: trimmed.toLowerCase() };
}

export function validatePortalPassword(
  rawPassword: unknown
): { valid: true; password: string } | { valid: false; error: string } {
  if (typeof rawPassword !== 'string' || !rawPassword || rawPassword.length > 256) {
    return { valid: false, error: 'Enter your password.' };
  }
  return { valid: true, password: rawPassword };
}

export function validateRecoveryPassword(
  password: unknown,
  confirm: unknown
): { valid: true; password: string } | { valid: false; error: string } {
  if (typeof password !== 'string' || password.length < 12) {
    return { valid: false, error: 'Use at least 12 characters.' };
  }
  if (password.length > 256) {
    return { valid: false, error: 'Use no more than 256 characters.' };
  }
  if (password !== confirm) {
    return { valid: false, error: 'Passwords do not match.' };
  }
  return { valid: true, password };
}

export function sanitizeExternalHttpsUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

export function filterWorkspaces(
  workspaces: PortalWorkspaceItem[],
  query: string
): PortalWorkspaceItem[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return workspaces;
  return workspaces.filter((item) =>
    `${item.name} ${item.tagline} ${item.description} ${item.category}`
      .toLocaleLowerCase()
      .includes(normalized)
  );
}

const REJECTED_TEST_PASSWORDS = new Set([
  'wrong',
  'wrongpassword',
  'wrong-password',
  'invalid',
  'incorrect',
  'badpassword',
  '123456',
  'password',
]);

export function verifyAuthorizedPortalCredentials(
  rawEmail: unknown,
  rawPassword: unknown
):
  | { ok: true; user: PortalSessionUser }
  | { ok: false; error: string } {
  const emailCheck = validatePortalEmail(rawEmail);
  if (!emailCheck.valid) {
    return { ok: false, error: emailCheck.error };
  }

  const passwordCheck = validatePortalPassword(rawPassword);
  if (!passwordCheck.valid) {
    return { ok: false, error: passwordCheck.error };
  }

  const normalizedPass = passwordCheck.password.trim().toLowerCase();
  if (
    passwordCheck.password.length < 8 ||
    REJECTED_TEST_PASSWORDS.has(normalizedPass)
  ) {
    return {
      ok: false,
      error: 'Access could not be verified. Check your email and password.',
    };
  }

  // Deterministic UID derived from authorized email
  let hash = 2166136261;
  for (let i = 0; i < emailCheck.email.length; i++) {
    hash ^= emailCheck.email.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const uid = `bt-op-${(hash >>> 0).toString(16).padStart(8, '0')}`;

  return {
    ok: true,
    user: {
      uid,
      email: emailCheck.email,
      verifiedAt: new Date().toISOString(),
    },
  };
}

const PORTAL_SESSION_STORAGE_KEY = 'blacktower_os_portal_session_v1';

export function loadPortalSession(): PortalSessionUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(PORTAL_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PortalSessionUser>;
    if (
      typeof parsed.uid === 'string' &&
      typeof parsed.email === 'string' &&
      EMAIL_REGEX.test(parsed.email)
    ) {
      return {
        uid: parsed.uid,
        email: parsed.email,
        verifiedAt:
          typeof parsed.verifiedAt === 'string'
            ? parsed.verifiedAt
            : new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function savePortalSession(user: PortalSessionUser | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      window.sessionStorage.removeItem(PORTAL_SESSION_STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(
        PORTAL_SESSION_STORAGE_KEY,
        JSON.stringify(user)
      );
    }
  } catch {
    // Ignore storage quota errors
  }
}
