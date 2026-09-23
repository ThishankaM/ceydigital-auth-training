// eslint-disable-next-line @typescript-eslint/no-var-requires
const pg = require("pg");

// Prefer DATABASE_URL when individual DB_* vars are unset (common in local .env).
const pool = new pg.Pool(
  process.env.DATABASE_URL
    ? {
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.DB_MAX_CLIENTS) || 10,
      idleTimeoutMillis: 30000
    }
    : {
      user: process.env.DB_USER,
      password: String(process.env.DB_PASSWORD ?? ""),
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      max: Number(process.env.DB_MAX_CLIENTS) || 10,
      idleTimeoutMillis: 30000
    }
);

pool.on("error", (err: any) => {
  console.log("idle client error", err, err.message, err.stack);
});

export default {
  pool,
  query: (text: string, params?: any[]): Promise<any> => pool.query(text, params)
};
