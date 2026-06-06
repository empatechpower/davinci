import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

const pool =
  global.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") global.__pgPool = pool;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Params = any[];

export async function query<T = unknown>(
  sql: string,
  params?: Params
): Promise<T[]> {
  const { rows } = await pool.query(sql, params);
  return rows as T[];
}

export async function queryOne<T = unknown>(
  sql: string,
  params?: Params
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(sql: string, params?: Params): Promise<void> {
  await pool.query(sql, params);
}
