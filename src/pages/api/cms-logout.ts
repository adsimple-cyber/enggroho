import type { APIRoute } from "astro";

export const POST: APIRoute = async () => {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // Hapus cookie dengan Max-Age=0 dan tanggal expired di masa lalu
      "Set-Cookie": `cms_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    },
  });
};

// Kalau user akses /api/cms-logout via GET (misal ketik di browser), redirect ke login
export const GET: APIRoute = async () => {
  return new Response(null, {
    status: 302,
    headers: { Location: "/admin" },
  });
};
