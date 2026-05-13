import type { APIRoute } from "astro";
import { readFileSync, writeFileSync, existsSync, renameSync } from "fs";
import { join } from "path";
import { isAuthenticated } from "../../utils/auth";

const CONTENT_PATH = join(process.cwd(), "src/data/content.json");

function atomicWrite(path: string, data: string) {
  const tmp = path + ".tmp";
  writeFileSync(tmp, data, "utf-8");
  renameSync(tmp, path);
}

export const GET: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const content = readFileSync(CONTENT_PATH, "utf-8");
    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Gagal membaca konten." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || !body.id || !body.en) {
      return new Response(JSON.stringify({ error: "Format data tidak valid: butuh objek { id, en }." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (typeof body.id !== "object" || Array.isArray(body.id) ||
        typeof body.en !== "object" || Array.isArray(body.en)) {
      return new Response(JSON.stringify({ error: "Field id dan en harus berupa objek." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Baca konten yang ada → merge, bukan replace. Ini menjaga key yg tidak dikirim (social_proofs, dll)
    let existing: Record<string, any> = { id: {}, en: {} };
    if (existsSync(CONTENT_PATH)) {
      try {
        const parsed = JSON.parse(readFileSync(CONTENT_PATH, "utf-8"));
        if (parsed && typeof parsed === "object") {
          existing = parsed;
          if (!existing.id || typeof existing.id !== "object") existing.id = {};
          if (!existing.en || typeof existing.en !== "object") existing.en = {};
        }
      } catch {
        // Kalau file corrupt, abort dan kembalikan error
        return new Response(JSON.stringify({ error: "File konten rusak. Hubungi admin." }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Sanitize incoming: pastikan setiap value string (bukan object/array)
    const sanitize = (obj: Record<string, any>) => {
      const out: Record<string, string> = {};
      for (const key in obj) {
        const val = obj[key];
        if (typeof val === "string") out[key] = val;
        // Kalau user kirim bukan string, skip (don't break existing data)
      }
      return out;
    };

    const merged = {
      ...existing,
      id: { ...existing.id, ...sanitize(body.id) },
      en: { ...existing.en, ...sanitize(body.en) },
    };

    // Atomic write — hindari data corrupt kalau crash mid-write
    atomicWrite(CONTENT_PATH, JSON.stringify(merged, null, 2));

    return new Response(JSON.stringify({ success: true, message: "Konten berhasil disimpan." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Gagal menyimpan konten." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
