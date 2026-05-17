import { supabase } from "./supabase";
import { readFileSync } from "fs";
import { join } from "path";

const SRC_CONTENT = join(process.cwd(), "src/data/content.json");

// ─── CONTENT ────────────────────────────────────────────────────────────────

export async function readContent(): Promise<string> {
  const { data, error } = await supabase
    .from("cms_content").select("data").eq("id", 1).single();
  if (error || !data) return readFileSync(SRC_CONTENT, "utf-8");
  return JSON.stringify(data.data);
}

export async function writeContent(json: string): Promise<void> {
  const parsed = JSON.parse(json);
  const { error } = await supabase
    .from("cms_content")
    .upsert({ id: 1, data: parsed, updated_at: new Date().toISOString() });
  if (error) throw new Error("Gagal menyimpan konten: " + error.message);
}

export async function contentExists(): Promise<boolean> {
  const { data } = await supabase.from("cms_content").select("id").eq("id", 1).single();
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
    .eq("id", 1).single();
  if (error || !data) return null;
  return data as AdminRow;
}

export async function writeAdmin(row: AdminRow): Promise<void> {
  const { error } = await supabase.from("cms_admin").upsert({ id: 1, ...row });
  if (error) throw new Error("Gagal menyimpan admin: " + error.message);
}

export async function adminExists(): Promise<boolean> {
  const { data } = await supabase.from("cms_admin").select("id").eq("id", 1).single();
  return !!data;
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────

export interface TestimonialRow {
  id?: number;
  name: string;
  role: string;
  text: string;
  image: string;
  position: number;
}

export async function readTestimonials(): Promise<TestimonialRow[]> {
  const { data, error } = await supabase
    .from("cms_testimonials")
    .select("id,name,role,text,image,position")
    .order("position");
  if (error || !data) return [];
  return data as TestimonialRow[];
}

// ─── IMAGES ──────────────────────────────────────────────────────────────────

export interface ImageRow {
  key: string;
  url: string;
}

export async function readImages(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("cms_images").select("key,url");
  if (error || !data) return { hero: "/hero.png", mentor: "/Agung.png", og: "/og-image.png" };
  return Object.fromEntries(data.map((r: ImageRow) => [r.key, r.url]));
}
