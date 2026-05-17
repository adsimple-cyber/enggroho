import { createHash, createHmac, randomBytes } from "crypto";
import { readAdmin, writeAdmin, adminExists, type AdminRow } from "./storage";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 jam

export function hashPassword(password: string, salt: string): string {
  return createHash("sha256").update(password + salt).digest("hex");
}

function signToken(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export async function loadAdmin(): Promise<AdminRow> {
  const existing = await readAdmin();

  if (!existing) {
    // Buat default admin pertama kali
    const salt = randomBytes(16).toString("hex");
    const passwordHash = hashPassword("enggroho2025", salt);
    const tokenSalt = randomBytes(32).toString("hex");
    const defaultAdmin: AdminRow = {
      username: "admin",
      password_hash: passwordHash,
      salt,
      token_salt: tokenSalt,
    };
    await writeAdmin(defaultAdmin);
    return defaultAdmin;
  }

  return existing;
}

export async function saveAdmin(username: string, password: string): Promise<void> {
  const salt = randomBytes(16).toString("hex");
  const password_hash = hashPassword(password, salt);
  const token_salt = randomBytes(32).toString("hex");
  await writeAdmin({ username, password_hash, salt, token_salt });
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const admin = await loadAdmin();
  if (username !== admin.username) return false;
  return hashPassword(password, admin.salt) === admin.password_hash;
}

export async function createToken(): Promise<string> {
  const admin = await loadAdmin();
  const issuedAt = Date.now();
  const payload = `${issuedAt}:${admin.username}`;
  const sig = signToken(payload, admin.token_salt);
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export async function isValidToken(token: string | undefined): Promise<boolean> {
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

    const admin = await loadAdmin();
    if (username !== admin.username) return false;

    const expected = signToken(`${issuedAt}:${username}`, admin.token_salt);
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

export async function isAuthenticated(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = getTokenFromCookies(cookieHeader);
  return isValidToken(token);
}
