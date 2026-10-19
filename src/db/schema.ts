import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Authenticated Users Table (Firebase Auth UID mapping).
 * Stores zero vault secrets or cryptographic keys.
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Zero-Knowledge Encrypted Vault Hierarchy Table.
 * Contains ONLY wrapped key envelopes (AES-256-GCM ciphertext + 128-bit tag),
 * Argon2id salt/parameters, and domain-separated sync verifier hashes.
 * NEVER stores Master Password, KEK, raw Root Key, raw Vault Key, or Recovery Key.
 */
export const encryptedVaults = pgTable('encrypted_vaults', {
  vaultId: text('vault_id').primaryKey(),
  userUid: text('user_uid').notNull(),
  accountId: text('account_id').notNull(),
  schemaVersion: integer('schema_version').notNull().default(1),
  revision: integer('revision').notNull().default(1),
  syncAuthVerifierHash: text('sync_auth_verifier_hash').notNull(),
  kdfProfile: text('kdf_profile').notNull(),
  kdfSaltHex: text('kdf_salt_hex').notNull(),
  kekKeyId: text('kek_key_id').notNull(),
  recoveryKeyId: text('recovery_key_id').notNull(),
  rootKeyId: text('root_key_id').notNull(),
  vaultKeyId: text('vault_key_id').notNull(),
  rootWrappedByKekJson: text('root_wrapped_by_kek_json').notNull(),
  rootWrappedByRecoveryJson: text('root_wrapped_by_recovery_json').notNull(),
  vaultKeyWrappedByRootJson: text('vault_key_wrapped_by_root_json').notNull(),
  recoveryKeyVerificationHash: text('recovery_key_verification_hash').notNull(),
  revokedDevicesJson: text('revoked_devices_json').notNull().default('[]'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Zero-Knowledge Encrypted Vault Items Table.
 * All sensitive fields (title, subtitle, folder, username, password, url,
 * notes, TOTP seeds, credit cards, identities, custom fields) are encrypted
 * client-side inside `payloadCiphertextHex` under a unique per-item 256-bit key
 * before ever reaching the server or PostgreSQL database.
 */
export const encryptedVaultItems = pgTable('encrypted_vault_items', {
  id: serial('id').primaryKey(),
  itemId: text('item_id').notNull().unique(),
  vaultId: text('vault_id')
    .references(() => encryptedVaults.vaultId, { onDelete: 'cascade' })
    .notNull(),
  revision: integer('revision').notNull().default(1),
  recordType: text('record_type').notNull(),
  schemaVersion: integer('schema_version').notNull().default(1),
  favorite: integer('favorite').notNull().default(0),
  itemKeyId: text('item_key_id').notNull(),
  wrappedItemKeyNonceHex: text('wrapped_item_key_nonce_hex').notNull(),
  wrappedItemKeyCiphertextHex: text('wrapped_item_key_ciphertext_hex').notNull(),
  payloadNonceHex: text('payload_nonce_hex').notNull(),
  payloadCiphertextHex: text('payload_ciphertext_hex').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const encryptedVaultsRelations = relations(encryptedVaults, ({ many }) => ({
  items: many(encryptedVaultItems),
}));

export const encryptedVaultItemsRelations = relations(encryptedVaultItems, ({ one }) => ({
  vault: one(encryptedVaults, {
    fields: [encryptedVaultItems.vaultId],
    references: [encryptedVaults.vaultId],
  }),
}));
