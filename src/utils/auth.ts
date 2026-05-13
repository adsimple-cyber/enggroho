import { createHash, createHmac, randomBytes } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// Resolve dari project root, bukan dari file TS yg sudah di-bundle.
const ADMIN_PATH = join(process.cwd(), "src/data/admin.json");

interface AdminData {
  username: string;
  passwordHash: string;
  salt: string;
  tokenSalt: string; // Di-rotate saat ganti credentials → invalidate token lama
}

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 jam

export function hashPassword(password: string, salt: string): string {
  return createHash("sha256").update(password + salt).digest("hex");
}

function signToken(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

// Simple in-memory cache untuk admin data — di-invalidate setiap kali saveAdmin dipanggil.
// Menghindari disk read berulang per request (isValidToken + verifyCredentials + createToken).
let _adminCache: AdminData | null = null;

export function loadAdmin(): AdminData {
  if (_adminCache) return _adminCache;

  if (!existsSync(ADMIN_PATH)) {
    // Default credentials: admin / enggroho2025
    const salt = randomBytes(16).toString("hex");
    const passwordHash = hashPassword("enggroho2025", salt);
    const tokenSalt = randomBytes(32).toString("hex");
    const defaultAdmin: AdminData = { username: "admin", passwordHash, salt, tokenSalt };
    writeFileSync(ADMIN_PATH, JSON.stringify(defaultAdmin, null, 2), "utf-8");
    _adminCache = defaultAdmin;
    return defaultAdmin;
  }

  const raw = JSON.parse(readFileSync(ADMIN_PATH, "utf-8"));
  // Auto-upgrade format lama (tanpa tokenSalt) — invalidate session lama
  if (!raw.tokenSalt) {
    raw.tokenSalt = randomBytes(32).toString("hex");
    writeFileSync(ADMIN_PATH, JSON.stringify(raw, null, 2), "utf-8");
  }
  _adminCache = raw;
  return raw;
}

export function saveAdmin(username: string, password: string): void {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);
  // Rotasi tokenSalt untuk invalidate semua session yang sedang aktif
  const tokenSalt = randomBytes(32).toString("hex");
  const data: AdminData = { username, passwordHash, salt, tokenSalt };
  writeFileSync(ADMIN_PATH, JSON.stringify(data, null, 2), "utf-8");
  // Invalidate cache agar loadAdmin() baca data terbaru
  _adminCache = data;
}

export function verifyCredentials(username: string, password: string): boolean {
  const admin = loadAdmin();
  if (username !== admin.username) return false;
  const hash = hashPassword(password, admin.salt);
  return hash === admin.passwordHash;
}

/**
 * Token format: base64(`${issuedAt}:${username}:${signature}`)
 * Signature = HMAC-SHA256(`${issuedAt}:${username}`, tokenSalt)
 * - Terikat ke username (user tertentu)
 * - Punya timestamp untuk validate expiry
 * - Signed dengan tokenSalt (rotated saat ganti credentials)
 */
export function createToken(): string {
  const admin = loadAdmin();
  const issuedAt = Date.now();
  const payload = `${issuedAt}:${admin.username}`;
  const sig = signToken(payload, admin.tokenSalt);
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    // Format: `${issuedAt}:${username}:${signature}`
    // issuedAt = numeric, signature = 64-char hex, username = everything in between
    const firstColon = decoded.indexOf(":");
    const lastColon = decoded.lastIndexOf(":");
    if (firstColon === -1 || lastColon === -1 || firstColon === lastColon) return false;

    const issuedAtStr = decoded.slice(0, firstColon);
    const username = decoded.slice(firstColon + 1, lastColon);
    const sig = decoded.slice(lastColon + 1);

    const issuedAt = parseInt(issuedAtStr, 10);
    if (!issuedAt || Number.isNaN(issuedAt)) return false;

    // Check expiry
    if (Date.now() - issuedAt > TOKEN_TTL_MS) return false;

    // Signature harus 64 char hex (SHA-256 output)
    if (!/^[0-9a-f]{64}$/.test(sig)) return false;

    const admin = loadAdmin();

    // Username harus match (kalau diganti, token invalid)
    if (username !== admin.username) return false;

    // Verify signature dengan tokenSalt terbaru
    const expected = signToken(`${issuedAt}:${username}`, admin.tokenSalt);
    return sig === expected;
  } catch {
    return false;
  }
}

export function getTokenFromCookies(cookieHeader: string): string | undefined {
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k.trim(), v.join("=")];
    })
  );
  return cookies["cms_token"];
}

export function isAuthenticated(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = getTokenFromCookies(cookieHeader);
  return isValidToken(token);
}
