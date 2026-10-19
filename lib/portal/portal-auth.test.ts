import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMMAND_CENTRE_NOTION_URL,
  PORTAL_WORKSPACES,
  filterWorkspaces,
  getApprovedShowcaseProducts,
  getPreservedInternalWorkspaces,
  sanitizeExternalHttpsUrl,
  toggleProjectVisibility,
  validatePortalEmail,
  validatePortalPassword,
  validateRecoveryPassword,
  verifyAuthorizedPortalCredentials,
} from './portal-auth.ts';

test('validatePortalEmail trims, lowercases, and rejects malformed addresses', () => {
  const ok = validatePortalEmail('  KelvinOng.Private@Outlook.My  ');
  assert.equal(ok.valid, true);
  if (ok.valid) {
    assert.equal(ok.email, 'kelvinong.private@outlook.my');
  }

  assert.equal(validatePortalEmail('').valid, false);
  assert.equal(validatePortalEmail('not-an-email').valid, false);
  assert.equal(validatePortalEmail('missing@domain').valid, false);
});

test('validatePortalPassword enforces non-empty bounds', () => {
  assert.equal(validatePortalPassword('').valid, false);
  assert.equal(validatePortalPassword('a'.repeat(257)).valid, false);
  const valid = validatePortalPassword('Blacktower!Master#2026');
  assert.equal(valid.valid, true);
});

test('validateRecoveryPassword enforces minimum 12 chars and matching confirmation', () => {
  const short = validateRecoveryPassword('short123', 'short123');
  assert.equal(short.valid, false);
  if (!short.valid) {
    assert.equal(short.error, 'Use at least 12 characters.');
  }

  const mismatch = validateRecoveryPassword(
    'Blacktower!Master#2026',
    'Different!Master#2026'
  );
  assert.equal(mismatch.valid, false);
  if (!mismatch.valid) {
    assert.equal(mismatch.error, 'Passwords do not match.');
  }

  const valid = validateRecoveryPassword(
    'Blacktower!Master#2026',
    'Blacktower!Master#2026'
  );
  assert.equal(valid.valid, true);
});

test('verifyAuthorizedPortalCredentials rejects invalid/short passwords and accepts valid operator credentials', () => {
  const bad = verifyAuthorizedPortalCredentials(
    'kelvinong.private@outlook.my',
    'wrong'
  );
  assert.equal(bad.ok, false);
  if (!bad.ok) {
    assert.equal(
      bad.error,
      'Access could not be verified. Check your email and password.'
    );
  }

  const good = verifyAuthorizedPortalCredentials(
    'kelvinong.private@outlook.my',
    'Blacktower!Master#2026'
  );
  assert.equal(good.ok, true);
  if (good.ok) {
    assert.equal(good.user.email, 'kelvinong.private@outlook.my');
    assert.match(good.user.uid, /^bt-op-[0-9a-f]{8}$/);
  }
});

test('sanitizeExternalHttpsUrl allows clean https URLs and blocks unsafe protocols or embedded credentials', () => {
  assert.equal(
    sanitizeExternalHttpsUrl(
      'https://app.notion.com/p/20b9e06eef38806093aee1507e116e8f'
    ),
    'https://app.notion.com/p/20b9e06eef38806093aee1507e116e8f'
  );
  assert.equal(sanitizeExternalHttpsUrl('javascript:alert(1)'), null);
  assert.equal(sanitizeExternalHttpsUrl('http://insecure.example.com'), null);
  assert.equal(
    sanitizeExternalHttpsUrl('https://user:pass@example.com/secret'),
    null
  );
  assert.equal(sanitizeExternalHttpsUrl(''), null);
});

test('Showcase-First separation: primary showcase displays completed BLACKTOWER products while preserving all 7 Notion workspaces in archive', () => {
  const showcase = getApprovedShowcaseProducts(PORTAL_WORKSPACES);
  const internalArchive = getPreservedInternalWorkspaces(PORTAL_WORKSPACES);

  assert.equal(showcase.length, 4);
  assert.equal(showcase[0].id, 'blacktower-vault');
  assert.equal(showcase[0].completionStatus, 'COMPLETED');
  assert.equal(showcase[0].internalRoute, '/vault');

  // Verify all 7 original Notion/internal workspace records + Command Centre URL are preserved
  assert.equal(internalArchive.length, 7);
  assert.ok(COMMAND_CENTRE_NOTION_URL.startsWith('https://app.notion.com/'));

  const preservedIds = internalArchive.map((i) => i.id);
  assert.deepEqual(preservedIds, [
    'daily-tasks',
    'project-planner',
    'nexus-tracker',
    'amway-business',
    'mirror-backup',
    'workspace-audit',
    'knowledge-architecture',
  ]);
});

test('toggleProjectVisibility safely and reversibly moves records between primary showcase and internal archive', () => {
  const toggled = toggleProjectVisibility(PORTAL_WORKSPACES, 'nexus-tracker');
  const promoted = toggled.find((i) => i.id === 'nexus-tracker');
  assert.equal(promoted?.visibility, 'primary_showcase');

  const reverted = toggleProjectVisibility(toggled, 'nexus-tracker');
  const restored = reverted.find((i) => i.id === 'nexus-tracker');
  assert.equal(restored?.visibility, 'internal_archive');
});

test('filterWorkspaces filters by name, tagline, description, and category case-insensitively', () => {
  const vaultMatches = filterWorkspaces(PORTAL_WORKSPACES, 'zero-knowledge');
  assert.ok(vaultMatches.some((w) => w.id === 'blacktower-vault'));

  const auditMatches = filterWorkspaces(PORTAL_WORKSPACES, 'migration');
  assert.equal(auditMatches.length, 1);
  assert.equal(auditMatches[0].id, 'workspace-audit');
});
