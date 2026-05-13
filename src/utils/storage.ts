/**
 * Storage abstraction untuk CMS.
 *
 * Di Vercel (serverless), filesystem bersifat read-only kecuali /tmp.
 * Strategi:
 * - READ: coba /tmp dulu (data terbaru), fallback ke src/data (bundled saat build)
 * - WRITE: selalu tulis ke /tmp
 *
 * Catatan: /tmp di Vercel bersifat ephemeral per-instance. Artinya setelah
 * cold start baru, data kembali ke versi bundled. Untuk persistensi penuh
 * di production, perlu Vercel KV / Blob. Tapi untuk penggunaan CMS ringan
 * (edit lalu redeploy), ini sudah cukup.
 */

import { readFileSync, writeFileSync, existsSync, renameSync } from "fs";
import { join } from "path";

const IS_VERCEL = process.env.VERCEL === "1";

// Path sumber (bundled saat build, read-only di Vercel)
const SRC_CONTENT = join(process.cwd(), "src/data/content.json");
const SRC_ADMIN   = join(process.cwd(), "src/data/admin.json");

// Path tmp (writable di semua environment)
const TMP_CONTENT = "/tmp/enggroho-content.json";
const TMP_ADMIN   = "/tmp/enggroho-admin.json";

function getReadPath(tmpPath: string, srcPath: string): string {
  // Prioritaskan /tmp (data terbaru yang ditulis via CMS)
  if (existsSync(tmpPath)) return tmpPath;
  return srcPath;
}

function getWritePath(tmpPath: string, srcPath: string): string {
  // Di Vercel, hanya /tmp yang writable
  if (IS_VERCEL) return tmpPath;
  // Di local/standalone, tulis ke src/data langsung
  return srcPath;
}

export function readContent(): string {
  const path = getReadPath(TMP_CONTENT, SRC_CONTENT);
  return readFileSync(path, "utf-8");
}

export function writeContent(data: string): void {
  const path = getWritePath(TMP_CONTENT, SRC_CONTENT);
  const tmp = path + ".tmp";
  writeFileSync(tmp, data, "utf-8");
  renameSync(tmp, path);
}

export function contentExists(): boolean {
  return existsSync(getReadPath(TMP_CONTENT, SRC_CONTENT));
}

export function readAdmin(): string {
  const path = getReadPath(TMP_ADMIN, SRC_ADMIN);
  return readFileSync(path, "utf-8");
}

export function writeAdmin(data: string): void {
  const path = getWritePath(TMP_ADMIN, SRC_ADMIN);
  writeFileSync(path, data, "utf-8");
}

export function adminExists(): boolean {
  return existsSync(getReadPath(TMP_ADMIN, SRC_ADMIN));
}
