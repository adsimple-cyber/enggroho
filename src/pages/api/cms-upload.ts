import type { APIRoute } from "astro";
import { isAuthenticated } from "../../utils/auth";
import { supabase } from "../../utils/supabase";

const BUCKET = "cms-images";

// POST: upload file, return public URL
// FormData: { file: File, prefix?: string }
export const POST: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response(JSON.stringify({ error: "Gagal parse form data." }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const file = formData.get("file") as File | null;
  const prefix = (formData.get("prefix") as string) || "upload";

  if (!file || file.size === 0) {
    return new Response(JSON.stringify({ error: "File wajib diisi." }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  // Validasi tipe file
  if (!file.type.startsWith("image/")) {
    return new Response(JSON.stringify({ error: "Hanya file gambar yang diizinkan." }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  // Validasi ukuran (max 1MB)
  if (file.size > 1 * 1024 * 1024) {
    return new Response(JSON.stringify({ error: "Ukuran file maksimal 1MB." }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${prefix}-${Date.now()}.${ext}`;
  const buffer = await file.arrayBuffer();

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadErr) {
    return new Response(JSON.stringify({ error: "Upload gagal: " + uploadErr.message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return new Response(JSON.stringify({ success: true, url: urlData.publicUrl }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
};
