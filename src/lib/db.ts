import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { PLANS, PROVIDERS } from "./seed-data";
import type { Plan, Policy, Provider } from "./types";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "nextinsurance.db");

// Survive Turbopack HMR re-evaluation in dev: keep one handle per process.
const g = globalThis as unknown as { __nidb?: DatabaseSync };

function init(): DatabaseSync {
  fs.mkdirSync(DB_DIR, { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS providers (
      id TEXT PRIMARY KEY,
      json TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      json TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS policies (
      id TEXT PRIMARY KEY,
      uid TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_policies_uid ON policies(uid);
    CREATE INDEX IF NOT EXISTS idx_plans_type ON plans(type);
  `);

  const count = db.prepare("SELECT COUNT(*) AS n FROM plans").get() as { n: number };
  if (count.n === 0) {
    const insProvider = db.prepare("INSERT OR REPLACE INTO providers (id, json) VALUES (?, ?)");
    const insPlan = db.prepare("INSERT OR REPLACE INTO plans (id, type, json) VALUES (?, ?, ?)");
    db.exec("BEGIN");
    for (const provider of PROVIDERS) insProvider.run(provider.id, JSON.stringify(provider));
    for (const plan of PLANS) insPlan.run(plan.id, plan.type, JSON.stringify(plan));
    db.exec("COMMIT");
  }
  return db;
}

export function getDb(): DatabaseSync {
  g.__nidb ??= init();
  return g.__nidb;
}

export function allProviders(): Provider[] {
  const rows = getDb().prepare("SELECT json FROM providers").all() as { json: string }[];
  return rows.map((r) => JSON.parse(r.json));
}

export function allPlans(): Plan[] {
  const rows = getDb().prepare("SELECT json FROM plans").all() as { json: string }[];
  return rows.map((r) => JSON.parse(r.json));
}

export function plansByTypes(types: string[]): Plan[] {
  if (types.length === 0) return [];
  const placeholders = types.map(() => "?").join(",");
  const rows = getDb()
    .prepare(`SELECT json FROM plans WHERE type IN (${placeholders})`)
    .all(...types) as { json: string }[];
  return rows.map((r) => JSON.parse(r.json));
}

export function planById(id: string): Plan | null {
  const row = getDb().prepare("SELECT json FROM plans WHERE id = ?").get(id) as
    | { json: string }
    | undefined;
  return row ? JSON.parse(row.json) : null;
}

export function providerById(id: string): Provider | null {
  const row = getDb().prepare("SELECT json FROM providers WHERE id = ?").get(id) as
    | { json: string }
    | undefined;
  return row ? JSON.parse(row.json) : null;
}

export function insertPolicy(policy: Policy): void {
  getDb()
    .prepare("INSERT INTO policies (id, uid, plan_id, json, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(policy.id, policy.uid, policy.planId, JSON.stringify(policy), new Date().toISOString());
}

export function policiesByUid(uid: string): Policy[] {
  const rows = getDb()
    .prepare("SELECT json FROM policies WHERE uid = ? ORDER BY created_at DESC")
    .all(uid) as { json: string }[];
  return rows.map((r) => JSON.parse(r.json));
}
