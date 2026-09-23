CREATE DATABASE express_ts_db;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- for express.js sessions store
CREATE TABLE IF NOT EXISTS pg_sessions (
    sid    VARCHAR      NOT NULL
        CONSTRAINT pg_sessions_pkey
            PRIMARY KEY,
    sess   JSON         NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);
