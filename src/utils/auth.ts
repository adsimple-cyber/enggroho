import { createHash, createHmac, randomBytes } from "crypto";
import { readAdmin, writeAdmin, adminExists } from "./storage";

interface AdminData {
  username: string;
  passwordHash: string;
  salt: string;
  tokenSalt: string;
}

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 jam

export function hashPassword(password: string, salt: string): string {
  return createHash("sha256").update(password + salt).digest("hex");
}

function signToken(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

// In-memory cache — di-invalidate setiap kali saveAdmin dipanggil
let _adminCache: AdminData | null = null;

export function loadAdmin(): AdminData {
  if (_adminCache) return _adminCache;

  if (!adminExists()) {
    const salt = randomBytes(16).toString("hex");
    const passwordHash = hashPassword("enggroho2025", salt);
    const tokenSalt = randomBytes(32).toString("hex");
    const defaultAdmin: AdminData = { username: "admin", passwordHash, salt, tokenSalt };
    writeAdmin(JSON.stringify(defaultAdmin, null, 2));
    _adminCache = defaultAdmin;
    return defaultAdmin;
  }

  const raw = JSON.parse(readAdmin());
  if (!raw.tokenSalt) {
    raw.tokenSalt = randomBytes(32).toString("hex");
    writeAdmin(JSON.stringify(raw, null, 2));
  }
  _adminCache = raw;
  return raw;
}

export function saveAdmin(username: string, password: string): void {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt);
  const tokenSalt = randomBytes(32).toString("hex");
  const data: AdminData = { username, passwordHash, salt, tokenSalt };
  writeAdmin(JSON.stringify(data, null, 2));
  _adminCache = data;
}

export function verifyCredentials(username: string, password: string): boolean {
  const admin = loadAdmin();
  if (username !== admin.username) return false;
  return hashPassword(password, admin.salt) === admin.passwordHash;
}

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
    const firstColon = decoded.indexOf(":");
    const lastColon = decoded.lastIndexOf(":");
    if (firstColon === -1 || lastColon === -1 || firstColon === lastColon) return false;

    const issuedAtStr = decoded.slice(0, firstColon);
    const username = decoded.slice(firstColon + 1, lastColon);
    const sig = decoded.slice(lastColon + 1);

    const issuedAt = parseInt(issuedAtStr, 10);
    if (!issuedAt || Number.isNaN(issuedAt)) return false;
    if (Date.now() - issuedAt > TOKEN_TTL_MS) return false;
    if (!/^[0-9a-f]{64}$/.test(sig)) return false;

    const admin = loadAdmin();
    if (username !== admin.username) return false;

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
