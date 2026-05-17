import type { APIRoute } from "astro";
import { isAuthenticated, loadAdmin, saveAdmin, verifyCredentials, createToken } from "../../utils/auth";

export const GET: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }
  const admin = await loadAdmin();
  return new Response(JSON.stringify({ username: admin.username }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();
  const { currentPassword, newUsername, newPassword } = body;

  if (!currentPassword || typeof currentPassword !== "string") {
    return new Response(JSON.stringify({ error: "Password saat ini wajib diisi." }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }
  if (!newUsername || typeof newUsername !== "string" || newUsername.trim().length < 3) {
    return new Response(JSON.stringify({ error: "Username minimal 3 karakter." }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const admin = await loadAdmin();
  if (!await verifyCredentials(admin.username, currentPassword)) {
    return new Response(JSON.stringify({ error: "Password saat ini salah." }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }

  const passwordToSave = newPassword && typeof newPassword === "string" && newPassword.length >= 6
    ? newPassword : currentPassword;

  await saveAdmin(newUsername.trim(), passwordToSave);
  const newToken = await createToken();

  return new Response(JSON.stringify({ success: true, message: "Akun berhasil diperbarui." }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `cms_token=${newToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
    },
  });
};
