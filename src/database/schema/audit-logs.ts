import { relations } from 'drizzle-orm';
import { inet, jsonb, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { baseFields } from './base';
import { organizations } from './organizations';
import { users } from './users';

export const auditLogs = pgTable('audit_logs', {
  ...baseFields,
  userId: uuid('user_id').references(() => users.id),
  tableName: varchar('table_name', { length: 100 }).notNull(),
  recordId: uuid('record_id').notNull(),
  action: varchar('action', { length: 50 }).notNull(), // create, update, delete, restore
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
});

// Relations
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  organization: one(organizations, {
    fields: [auditLogs.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// Types
export type AuditLog = typeof auditLogs.$inferSelect;
export type CreateAuditLog = typeof auditLogs.$inferInsert;
