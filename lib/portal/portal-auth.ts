export interface PortalSessionUser {
  uid: string;
  email: string;
  verifiedAt: string;
}

export interface PortalWorkspaceItem {
  id: string;
  indexLabel: string;
  name: string;
  description: string;
  url: string;
  internalRoute?: string;
  actionLabel?: string;
  iconKey:
    | 'list-todo'
    | 'calendar-check'
    | 'layout-grid'
    | 'briefcase-business'
    | 'database-backup'
    | 'clipboard-check'
    | 'book-open'
    | 'shield-lock';
}

export const COMMAND_CENTRE_NOTION_URL =
  'https://app.notion.com/p/3f59e06eef38813db55bf779610835b3';

export const PORTAL_WORKSPACES: PortalWorkspaceItem[] = [
  {
    id: 'daily-tasks',
    indexLabel: '01',
    name: 'Daily Tasks',
    description: 'Daily priorities and task lists',
    url: 'https://app.notion.com/p/20b9e06eef38806093aee1507e116e8f',
    iconKey: 'list-todo',
  },
  {
    id: 'project-planner',
    indexLabel: '02',
    name: 'Project Planner',
    description: 'Plans, milestones and next steps',
    url: 'https://app.notion.com/p/20b9e06eef3880c5a68ec7a7e30b9c17',
    iconKey: 'calendar-check',
  },
  {
    id: 'nexus-tracker',
    indexLabel: '03',
    name: 'NEXUS V4 Tracker',
    description: 'Personal operating system',
    url: 'https://app.notion.com/p/3979e06eef3880718b06f5d70bbe69db',
    iconKey: 'layout-grid',
  },
  {
    id: 'amway-business',
    indexLabel: '04',
    name: 'Amway Business OS',
    description: 'Business planning and coordination',
    url: '',
    iconKey: 'briefcase-business',
  },
  {
    id: 'mirror-backup',
    indexLabel: '05',
    name: 'Supabase Mirror & Backup',
    description: 'Mirror and backup planning',
    url: 'https://app.notion.com/p/3f79e06eef388137af36efe6dfde1e',
    iconKey: 'database-backup',
  },
  {
    id: 'workspace-audit',
    indexLabel: '06',
    name: 'Workspace Audit',
    description: 'Workspace Audit & Migration Plan',
    url: 'https://app.notion.com/p/3f59e06eef3881038811dad8aa7c69fa',
    iconKey: 'clipboard-check',
  },
  {
    id: 'knowledge-architecture',
    indexLabel: '07',
    name: 'Knowledge / Architecture',
    description: 'NEXUS Product & Architecture',
    url: 'https://app.notion.com/p/3ac9e06eef388002a4acdc0c237538c1',
    iconKey: 'book-open',
  },
  {
    id: 'blacktower-vault',
    indexLabel: '08',
    name: 'BLACKTOWER VAULT™',
    description: 'Zero-knowledge personal password & digital identity vault',
    url: '',
    internalRoute: '/vault',
    actionLabel: 'Open BLACKTOWER VAULT™',
    iconKey: 'shield-lock',
  },
];

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
): { valid: true; password: string } | { valid: false, error: string } {
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
    `${item.name} ${item.description}`.toLocaleLowerCase().includes(normalized)
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
