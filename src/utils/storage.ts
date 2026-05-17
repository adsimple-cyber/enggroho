/**
 * Storage abstraction untuk CMS.
 * Semua data disimpan di Supabase — permanen, tidak hilang saat cold start.
 *
 * Tabel:
 * - cms_content : konten landing page (jsonb)
 * - cms_admin   : credentials login CMS
 */

import { supabase } from "./supabase";
import { readFileSync } from "fs";
import { join } from "path";

// Fallback: baca dari file lokal kalau Supabase belum ada datanya
const SRC_CONTENT = join(process.cwd(), "src/data/content.json");

// ─── CONTENT ────────────────────────────────────────────────────────────────

export async function readContent(): Promise<string> {
  const { data, error } = await supabase
    .from("cms_content")
    .select("data")
    .eq("id", 1)
    .single();

  if (error || !data) {
    // Fallback ke file lokal (bundled saat build)
    return readFileSync(SRC_CONTENT, "utf-8");
  }

  return JSON.stringify(data.data);
}

export async function writeContent(json: string): Promise<void> {
  const parsed = JSON.parse(json);

  const { error } = await supabase
    .from("cms_content")
    .upsert({ id: 1, data: parsed, updated_at: new Date().toISOString() });

  if (error) throw new Error("Gagal menyimpan konten ke Supabase: " + error.message);
}

export async function contentExists(): Promise<boolean> {
  const { data } = await supabase
    .from("cms_content")
    .select("id")
    .eq("id", 1)
    .single();
  return !!data;
}

// ─── ADMIN ───────────────────────────────────────────────────────────────────

export interface AdminRow {
  username: string;
  password_hash: string;
  salt: string;
  token_salt: string;
}

export async function readAdmin(): Promise<AdminRow | null> {
  const { data, error } = await supabase
    .from("cms_admin")
    .select("username, password_hash, salt, token_salt")
    .eq("id", 1)
    .single();

  if (error || !data) return null;
  return data as AdminRow;
}

export async function writeAdmin(row: AdminRow): Promise<void> {
  const { error } = await supabase
    .from("cms_admin")
    .upsert({ id: 1, ...row });

  if (error) throw new Error("Gagal menyimpan admin ke Supabase: " + error.message);
}

export async function adminExists(): Promise<boolean> {
  const { data } = await supabase
    .from("cms_admin")
    .select("id")
    .eq("id", 1)
    .single();
  return !!data;
}
