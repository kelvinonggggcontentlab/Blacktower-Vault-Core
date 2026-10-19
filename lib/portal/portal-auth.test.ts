import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PORTAL_WORKSPACES,
  filterWorkspaces,
  sanitizeExternalHttpsUrl,
  validatePortalEmail,
  validatePortalPassword,
  validateRecoveryPassword,
  verifyAuthorizedPortalCredentials,
} from './portal-auth.ts';

test('validatePortalEmail enforces exact reference email rules', () => {
  assert.deepEqual(validatePortalEmail(''), {
    valid: false,
    error: 'Enter a valid email address.',
  });
  assert.deepEqual(validatePortalEmail('not-an-email'), {
    valid: false,
    error: 'Enter a valid email address.',
  });
  const ok = validatePortalEmail('  KelvinOng.Private@outlook.my ');
  assert.equal(ok.valid, true);
  if (ok.valid) {
    assert.equal(ok.email, 'kelvinong.private@outlook.my');
  }
});

test('validatePortalPassword enforces exact reference password rules', () => {
  assert.deepEqual(validatePortalPassword(''), {
    valid: false,
    error: 'Enter your password.',
  });
  const ok = validatePortalPassword('BrutalSecurity#2026');
  assert.equal(ok.valid, true);
});

test('validateRecoveryPassword enforces 12-character minimum and confirmation match', () => {
  assert.deepEqual(validateRecoveryPassword('short', 'short'), {
    valid: false,
    error: 'Use at least 12 characters.',
  });
  assert.deepEqual(
    validateRecoveryPassword('ValidPassword123!', 'MismatchPassword123!'),
    {
      valid: false,
      error: 'Passwords do not match.',
    }
  );
  const ok = validateRecoveryPassword('ValidPassword123!', 'ValidPassword123!');
  assert.equal(ok.valid, true);
});

test('verifyAuthorizedPortalCredentials rejects weak/wrong passwords and authorizes valid operator credentials', () => {
  const badEmail = verifyAuthorizedPortalCredentials('bad', 'ValidPassword123!');
  assert.equal(badEmail.ok, false);
  if (!badEmail.ok) {
    assert.equal(badEmail.error, 'Enter a valid email address.');
  }

  const badPass = verifyAuthorizedPortalCredentials(
    'kelvinong.private@outlook.my',
    'wrongpassword'
  );
  assert.equal(badPass.ok, false);
  if (!badPass.ok) {
    assert.equal(
      badPass.error,
      'Access could not be verified. Check your email and password.'
    );
  }

  const validAuth = verifyAuthorizedPortalCredentials(
    'kelvinong.private@outlook.my',
    'BlacktowerCommand#2026'
  );
  assert.equal(validAuth.ok, true);
  if (validAuth.ok) {
    assert.equal(validAuth.user.email, 'kelvinong.private@outlook.my');
    assert.match(validAuth.user.uid, /^bt-op-[0-9a-f]{8}$/);
  }
});

test('filterWorkspaces filters by name and description case-insensitively', () => {
  const all = filterWorkspaces(PORTAL_WORKSPACES, '');
  assert.equal(all.length, PORTAL_WORKSPACES.length);

  const vaultMatch = filterWorkspaces(PORTAL_WORKSPACES, 'vault');
  assert.equal(vaultMatch.length, 1);
  assert.equal(vaultMatch[0].id, 'blacktower-vault');

  const notionMatch = filterWorkspaces(PORTAL_WORKSPACES, 'milestone');
  assert.equal(notionMatch.length, 1);
  assert.equal(notionMatch[0].id, 'project-planner');

  const emptyMatch = filterWorkspaces(PORTAL_WORKSPACES, 'nonexistent-xyz-999');
  assert.equal(emptyMatch.length, 0);
});

test('sanitizeExternalHttpsUrl allows only clean https URLs without embedded credentials', () => {
  assert.equal(
    sanitizeExternalHttpsUrl('https://app.notion.com/p/20b9e06eef38806093aee1507e116e8f'),
    'https://app.notion.com/p/20b9e06eef38806093aee1507e116e8f'
  );
  assert.equal(sanitizeExternalHttpsUrl('http://insecure.example.com'), null);
  assert.equal(sanitizeExternalHttpsUrl('https://user:pass@example.com'), null);
  assert.equal(sanitizeExternalHttpsUrl('javascript:alert(1)'), null);
  assert.equal(sanitizeExternalHttpsUrl(''), null);
});
