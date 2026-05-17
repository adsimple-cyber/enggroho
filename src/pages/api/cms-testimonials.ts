import type { APIRoute } from "astro";
import { isAuthenticated } from "../../utils/auth";
import { supabase } from "../../utils/supabase";

const BUCKET = "cms-images";

// GET: ambil semua testimoni
export const GET: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const { data, error } = await supabase
    .from("cms_testimonials")
    .select("id,name,role,text,image,position")
    .order("position");
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
};

// POST: tambah atau update testimoni (dengan optional upload foto)
export const POST: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const formData = await request.formData();
  const id = formData.get("id") as string | null;
  const name = (formData.get("name") as string)?.trim();
  const role = (formData.get("role") as string)?.trim();
  const text = (formData.get("text") as string)?.trim();
  const position = parseInt(formData.get("position") as string) || 99;
  const file = formData.get("file") as File | null;
  let imageUrl = (formData.get("image") as string) || "";

  if (!name || !role || !text) {
    return new Response(JSON.stringify({ error: "Nama, role, dan teks wajib diisi." }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  // Upload foto kalau ada
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `testi-${Date.now()}.${ext}`;
    const buffer = await file.arrayBuffer();
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: true });
    if (!uploadErr) {
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }
  }

  const row = { name, role, text, image: imageUrl, position };

  if (id) {
    // Update existing
    const { error } = await supabase.from("cms_testimonials").update(row).eq("id", parseInt(id));
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  } else {
    // Insert new
    const { error } = await supabase.from("cms_testimonials").insert(row);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};

// DELETE: hapus testimoni by id
export const DELETE: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const { id } = await request.json();
  if (!id) return new Response(JSON.stringify({ error: "id wajib diisi." }), { status: 400, headers: { "Content-Type": "application/json" } });

  const { error } = await supabase.from("cms_testimonials").delete().eq("id", id);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};
