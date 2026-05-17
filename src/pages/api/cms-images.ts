import type { APIRoute } from "astro";
import { isAuthenticated } from "../../utils/auth";
import { supabase } from "../../utils/supabase";

const BUCKET = "cms-images";

// GET: ambil semua image keys
export const GET: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const { data, error } = await supabase.from("cms_images").select("key,url").order("key");
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
};

// POST: upload image baru dan update URL
export const POST: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const formData = await request.formData();
  const key = formData.get("key") as string;
  const file = formData.get("file") as File;

  if (!key || !file) {
    return new Response(JSON.stringify({ error: "key dan file wajib diisi." }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${key}-${Date.now()}.${ext}`;
  const buffer = await file.arrayBuffer();

  // Upload ke Supabase Storage
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadErr) {
    return new Response(JSON.stringify({ error: "Upload gagal: " + uploadErr.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  // Ambil public URL
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  // Update di tabel cms_images
  const { error: dbErr } = await supabase
    .from("cms_images")
    .upsert({ key, url: publicUrl, updated_at: new Date().toISOString() });

  if (dbErr) {
    return new Response(JSON.stringify({ error: "DB update gagal: " + dbErr.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ success: true, url: publicUrl }), { status: 200, headers: { "Content-Type": "application/json" } });
};
