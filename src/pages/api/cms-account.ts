import type { APIRoute } from "astro";
import { isAuthenticated, loadAdmin, saveAdmin, verifyCredentials, createToken } from "../../utils/auth";

// GET: Ambil username yang sedang aktif
export const GET: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const admin = loadAdmin();
    return new Response(JSON.stringify({ username: admin.username }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Gagal membaca akun." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// POST: Update username & password
export const POST: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { currentPassword, newUsername, newPassword } = body;

    if (!currentPassword || typeof currentPassword !== "string") {
      return new Response(JSON.stringify({ error: "Password saat ini wajib diisi." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!newUsername || typeof newUsername !== "string" || newUsername.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Username minimal 3 karakter." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const admin = loadAdmin();

    // Verifikasi password saat ini terhadap admin sekarang
    if (!verifyCredentials(admin.username, currentPassword)) {
      return new Response(JSON.stringify({ error: "Password saat ini salah." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika password baru kosong, pakai password lama
    const passwordToSave = newPassword && typeof newPassword === "string" && newPassword.length > 0
      ? newPassword
      : currentPassword;

    if (passwordToSave.length < 6) {
      return new Response(JSON.stringify({ error: "Password minimal 6 karakter." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Simpan akun baru — saveAdmin otomatis rotate tokenSalt (invalidate token lama)
    saveAdmin(newUsername.trim(), passwordToSave);

    // Buat token baru supaya user tetap login dengan akun yang baru
    const newToken = createToken();

    return new Response(JSON.stringify({ success: true, message: "Akun berhasil diperbarui." }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `cms_token=${newToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Gagal memperbarui akun." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
