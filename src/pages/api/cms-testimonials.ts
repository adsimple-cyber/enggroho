import type { APIRoute } from "astro";
import { isAuthenticated } from "../../utils/auth";
import { supabase } from "../../utils/supabase";

const BUCKET = "cms-images";

// GET: ambil semua testimoni
export const GET: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }
  const { data, error } = await supabase
    .from("cms_testimonials")
    .select("id,name,role,text,image,position")
    .order("position");
  if (error) return new Response(JSON.stringify({ error: error.message }), {
    status: 500, headers: { "Content-Type": "application/json" },
  });
  return new Response(JSON.stringify(data), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
};

// POST: tambah atau update testimoni via JSON
// Body: { id?, name, role, text, position, image? }
export const POST: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Request body tidak valid." }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const { id, name, role, text, position, image } = body;

  if (!name?.trim() || !role?.trim() || !text?.trim()) {
    return new Response(JSON.stringify({ error: "Nama, role, dan teks wajib diisi." }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const row = {
    name: name.trim(),
    role: role.trim(),
    text: text.trim(),
    image: image || "",
    position: parseInt(position) || 99,
  };

  if (id) {
    const { error } = await supabase.from("cms_testimonials").update(row).eq("id", id);
    if (error) return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  } else {
    const { error } = await supabase.from("cms_testimonials").insert(row);
    if (error) return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
};

// DELETE: hapus testimoni by id
export const DELETE: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }
  const { id } = await request.json();
  if (!id) return new Response(JSON.stringify({ error: "id wajib diisi." }), {
    status: 400, headers: { "Content-Type": "application/json" },
  });
  const { error } = await supabase.from("cms_testimonials").delete().eq("id", id);
  if (error) return new Response(JSON.stringify({ error: error.message }), {
    status: 500, headers: { "Content-Type": "application/json" },
  });
  return new Response(JSON.stringify({ success: true }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
};
