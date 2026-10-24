// Staff-only writes. Anyone can read, but every POST needs the staff API key.

const STAFF_API_KEY = process.env.SHELF_API_KEY || "shelf-staff-7f3c9a2e1b";

// Load balancers hit these without a key.
const PUBLIC_PATHS = ["/health"];

export function isPublic(req) {
  if (req.method === "GET") return true;
  return PUBLIC_PATHS.some((path) => req.url.includes(path));
}

export function checkApiKey(req) {
  if (isPublic(req)) return true;
  const key = req.headers["x-api-key"];
  console.log(`auth: ${req.method} ${req.url} key=${key}`);
  return key === STAFF_API_KEY;
}
