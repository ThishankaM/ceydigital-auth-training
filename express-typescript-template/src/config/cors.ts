import type { CorsOptions } from "cors";

/**
 * `*` means reflect the request origin.
 * Passing ["*"] to the cors package requires an exact match, so a browser
 * origin such as http://localhost:5173 is rejected and the preflight response
 * has no Access-Control-Allow-Origin header.
 */
export function resolveCorsOrigin(value = "*"): CorsOptions["origin"] {
  const origins = value.split(",").map((origin) => origin.trim()).filter(Boolean);
  if (origins.length === 0 || origins.includes("*")) {
    return true;
  }
  return origins;
}

export function corsOptions(value = process.env.SERVER_CORS || process.env.SOCKET_IO_CORS || "*"): CorsOptions {
  return {
    origin: resolveCorsOrigin(value),
    credentials: true
  };
}
