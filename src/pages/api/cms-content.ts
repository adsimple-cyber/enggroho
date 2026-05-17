import type { APIRoute } from "astro";
import { isAuthenticated } from "../../utils/auth";
import { readContent, writeContent, contentExists } from "../../utils/storage";

export const GET: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const content = await readContent();
    return new Response(content, {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Gagal membaca konten." }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || !body.id || !body.en ||
        typeof body.id !== "object" || Array.isArray(body.id) ||
        typeof body.en !== "object" || Array.isArray(body.en)) {
      return new Response(JSON.stringify({ error: "Format data tidak valid." }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    // Baca existing → merge
    let existing: Record<string, any> = { id: {}, en: {} };
    if (await contentExists()) {
      try {
        const raw = await readContent();
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          existing = parsed;
          if (!existing.id || typeof existing.id !== "object") existing.id = {};
          if (!existing.en || typeof existing.en !== "object") existing.en = {};
        }
      } catch { /* pakai existing kosong */ }
    }

    const sanitize = (obj: Record<string, any>) => {
      const out: Record<string, string> = {};
      for (const key in obj) {
        if (typeof obj[key] === "string") out[key] = obj[key];
      }
      return out;
    };

    const merged = {
      ...existing,
      id: { ...existing.id, ...sanitize(body.id) },
      en: { ...existing.en, ...sanitize(body.en) },
    };

    await writeContent(JSON.stringify(merged, null, 2));

    return new Response(JSON.stringify({ success: true, message: "Konten berhasil disimpan." }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Gagal menyimpan konten." }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
};
