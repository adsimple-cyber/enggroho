import type { APIRoute } from "astro";
import { verifyCredentials, createToken } from "../../utils/auth";

export const POST: APIRoute = async ({ request }) => {
  // Validate Content-Type
  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return new Response(JSON.stringify({ success: false, message: "Content-Type harus application/json." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, message: "Request body tidak valid." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body || typeof body !== "object") {
    return new Response(JSON.stringify({ success: false, message: "Request body tidak valid." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { username, password } = body as Record<string, unknown>;

  if (typeof username !== "string" || typeof password !== "string" ||
      username.trim().length === 0 || password.length === 0) {
    return new Response(JSON.stringify({ success: false, message: "Username dan password wajib diisi." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (verifyCredentials(username.trim(), password)) {
    const token = createToken();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `cms_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
      },
    });
  }

  // Delay kecil untuk memperlambat brute force
  await new Promise((r) => setTimeout(r, 400));

  return new Response(JSON.stringify({ success: false, message: "Username atau password salah." }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
};
