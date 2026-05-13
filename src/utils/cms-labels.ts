// Struktur CMS baru dengan grouping, label deskriptif, dan urutan sesuai tampilan landing page.

export interface FieldDef {
  key: string;
  label: string;
  hint?: string;
}

export interface GroupDef {
  title: string;
  fields: FieldDef[];
}

export interface SectionDef {
  id: string;
  label: string;
  icon: string;
  groups: GroupDef[];
}

// Urutan section persis seperti di landing page (atas ke bawah)
export const sections: SectionDef[] = [
  {
    id: "nav",
    label: "Navigasi Header",
    icon: "compass",
    groups: [
      {
        title: "Menu Navigasi",
        fields: [
          { key: "nav_about", label: "Menu 1 — Tentang", hint: "Label menu yang merujuk ke section Tentang/About" },
          { key: "nav_method", label: "Menu 2 — Metode", hint: "Label menu yang merujuk ke section Metode" },
          { key: "nav_testi", label: "Menu 3 — Testimoni", hint: "Label menu yang merujuk ke section Testimoni" },
          { key: "nav_mentor", label: "Menu 4 — Mentor", hint: "Label menu yang merujuk ke section Mentor" },
        ],
      },
      {
        title: "Tombol Aksi Header",
        fields: [
          { key: "nav_cta", label: "Teks Tombol Konsultasi (di header kanan atas)" },
        ],
      },
    ],
  },
  {
    id: "hero",
    label: "Hero (Pembuka)",
    icon: "star",
    groups: [
      {
        title: "Badge & Judul Utama",
        fields: [
          { key: "hero_badge", label: "Badge Kecil di Atas Judul", hint: "Contoh: Global Career Accelerator" },
          { key: "hero_title", label: "Headline Utama", hint: "Boleh pakai format tebal/miring" },
          { key: "hero_desc", label: "Deskripsi di Bawah Judul" },
        ],
      },
      {
        title: "Tombol Aksi (CTA)",
        fields: [
          { key: "hero_cta", label: "Tombol Utama (WhatsApp)", hint: "Contoh: Mulai Perjalanan Anda" },
          { key: "hero_calendly", label: "Tombol Kedua (Calendly)", hint: "Contoh: Jadwalkan Pertemuan" },
        ],
      },
      {
        title: "Social Proof",
        fields: [
          { key: "hero_trust", label: "Teks Dipercaya Oleh...", hint: "Teks kecil di bawah tombol, di samping foto-foto avatar" },
        ],
      },
      {
        title: "Kartu Floating (kanan atas gambar)",
        fields: [
          { key: "hero_card_label", label: "Kartu Floating — Label Atas", hint: "Contoh: Career Growth" },
          { key: "hero_card_value", label: "Kartu Floating — Teks Besar", hint: "Contoh: Accelerated" },
        ],
      },
    ],
  },
  {
    id: "approach",
    label: "Metode Belajar",
    icon: "target",
    groups: [
      {
        title: "Header Section",
        fields: [
          { key: "section_approach_badge", label: "Badge Kecil di Atas Judul" },
          { key: "section_approach_title", label: "Judul Section" },
        ],
      },
      {
        title: "Kartu 1 — Ultra Personalized",
        fields: [
          { key: "approach_card1_title", label: "Judul Kartu" },
          { key: "approach_card1_desc", label: "Deskripsi Kartu" },
        ],
      },
      {
        title: "Kartu 2 — Cognitive Context",
        fields: [
          { key: "approach_card2_title", label: "Judul Kartu" },
          { key: "approach_card2_desc", label: "Deskripsi Kartu" },
        ],
      },
      {
        title: "Kartu 3 — Unlimited Support",
        fields: [
          { key: "approach_card3_title", label: "Judul Kartu" },
          { key: "approach_card3_desc", label: "Deskripsi Kartu" },
        ],
      },
    ],
  },
  {
    id: "why",
    label: "Kenapa Enggroho",
    icon: "help",
    groups: [
      {
        title: "Header Section",
        fields: [
          { key: "section_why_badge", label: "Badge Kecil" },
          { key: "section_why_title", label: "Judul Section" },
          { key: "section_why_subtitle", label: "Subtitle di Bawah Judul" },
        ],
      },
      {
        title: "Paragraf Penjelasan",
        fields: [
          { key: "why_main_desc", label: "Paragraf Utama" },
          { key: "why_extra_desc1", label: "Paragraf Tambahan 1" },
          { key: "why_extra_desc2", label: "Paragraf Tambahan 2" },
        ],
      },
      {
        title: "Fitur 1 — Online",
        fields: [
          { key: "why_feat1_title", label: "Judul" },
          { key: "why_feat1_desc", label: "Deskripsi" },
        ],
      },
      {
        title: "Fitur 2 — Jadwal Fleksibel",
        fields: [
          { key: "why_feat2_title", label: "Judul" },
          { key: "why_feat2_desc", label: "Deskripsi" },
        ],
      },
      {
        title: "Fitur 3 — 24/7 Support",
        fields: [
          { key: "why_feat3_title", label: "Judul" },
          { key: "why_feat3_desc", label: "Deskripsi" },
        ],
      },
      {
        title: "Fitur 4 — Sertifikat",
        fields: [
          { key: "why_feat4_title", label: "Judul" },
          { key: "why_feat4_desc", label: "Deskripsi" },
        ],
      },
      {
        title: "Fitur 5 — Fokus Dunia Kerja",
        fields: [
          { key: "why_feat5_title", label: "Judul" },
          { key: "why_feat5_desc", label: "Deskripsi" },
        ],
      },
      {
        title: "Fitur 6 — Mentoring",
        fields: [
          { key: "why_feat6_title", label: "Judul" },
          { key: "why_feat6_desc", label: "Deskripsi" },
        ],
      },
      {
        title: "Fitur 7 — Progress Terukur",
        fields: [
          { key: "why_feat7_title", label: "Judul" },
          { key: "why_feat7_desc", label: "Deskripsi" },
        ],
      },
    ],
  },
  {
    id: "stats",
    label: "Statistik (Angka Pencapaian)",
    icon: "chart",
    groups: [
      {
        title: "Alumni Aktif",
        fields: [
          { key: "stats_alumni_val", label: "Angka", hint: "Contoh: 50+" },
          { key: "stats_alumni", label: "Keterangan" },
        ],
      },
      {
        title: "Tahun Pengalaman",
        fields: [
          { key: "stats_experience_val", label: "Angka", hint: "Contoh: 5+" },
          { key: "stats_experience", label: "Keterangan" },
        ],
      },
      {
        title: "Tingkat Kepuasan",
        fields: [
          { key: "stats_satisfaction_val", label: "Angka", hint: "Contoh: 98%" },
          { key: "stats_satisfaction", label: "Keterangan" },
        ],
      },
      {
        title: "Industri Dilayani",
        fields: [
          { key: "stats_industries_val", label: "Angka", hint: "Contoh: 15+" },
          { key: "stats_industries", label: "Keterangan" },
        ],
      },
    ],
  },
  {
    id: "how",
    label: "Alur Belajar (Timeline)",
    icon: "refresh",
    groups: [
      {
        title: "Header Section",
        fields: [
          { key: "section_how_badge", label: "Badge Kecil" },
          { key: "section_how_title", label: "Judul Section" },
          { key: "section_how_desc", label: "Deskripsi Section" },
        ],
      },
      {
        title: "Langkah 1",
        fields: [
          { key: "step1_badge", label: "Label Kecil", hint: "Contoh: Langkah Pertama" },
          { key: "step1_title", label: "Judul Langkah" },
          { key: "step1_desc", label: "Deskripsi Langkah" },
        ],
      },
      {
        title: "Langkah 2",
        fields: [
          { key: "step2_badge", label: "Label Kecil" },
          { key: "step2_title", label: "Judul Langkah" },
          { key: "step2_desc", label: "Deskripsi Langkah" },
        ],
      },
      {
        title: "Langkah 3",
        fields: [
          { key: "step3_badge", label: "Label Kecil" },
          { key: "step3_title", label: "Judul Langkah" },
          { key: "step3_desc", label: "Deskripsi Langkah" },
        ],
      },
      {
        title: "Langkah 4",
        fields: [
          { key: "step4_badge", label: "Label Kecil" },
          { key: "step4_title", label: "Judul Langkah" },
          { key: "step4_desc", label: "Deskripsi Langkah" },
        ],
      },
    ],
  },
  {
    id: "fitur",
    label: "Fitur Unggulan (Bento Grid)",
    icon: "sparkle",
    groups: [
      {
        title: "Header Section",
        fields: [
          { key: "section_fitur_title", label: "Judul Section" },
        ],
      },
      {
        title: "Kartu Besar — Ready for Global Stage",
        fields: [
          { key: "fitur_card_large_title", label: "Judul Kartu" },
          { key: "fitur_card_large_desc", label: "Deskripsi Kartu" },
        ],
      },
      {
        title: "Kartu — Live Session",
        fields: [
          { key: "fitur_live_title", label: "Judul" },
          { key: "fitur_live_desc", label: "Deskripsi" },
        ],
      },
      {
        title: "Kartu — Custom Material",
        fields: [
          { key: "fitur_custom_title", label: "Judul" },
          { key: "fitur_custom_desc", label: "Deskripsi" },
        ],
      },
      {
        title: "Kartu — Speaking Practice",
        fields: [
          { key: "fitur_practice_title", label: "Judul" },
          { key: "fitur_practice_desc", label: "Deskripsi" },
        ],
      },
      {
        title: "Kartu — Progress Report",
        fields: [
          { key: "fitur_report_title", label: "Judul" },
          { key: "fitur_report_desc", label: "Deskripsi" },
        ],
      },
      {
        title: "Kartu — Listening Drill",
        fields: [
          { key: "fitur_listening_title", label: "Judul" },
          { key: "fitur_listening_desc", label: "Deskripsi" },
        ],
      },
      {
        title: "Kartu — Business Writing",
        fields: [
          { key: "fitur_writing_title", label: "Judul" },
          { key: "fitur_writing_desc", label: "Deskripsi" },
        ],
      },
    ],
  },
  {
    id: "benefits",
    label: "Manfaat Bergabung",
    icon: "trophy",
    groups: [
      {
        title: "Header Section",
        fields: [
          { key: "section_benefits_badge", label: "Badge Kecil" },
          { key: "section_benefits_title", label: "Judul Section" },
        ],
      },
      {
        title: "Daftar Manfaat",
        fields: [
          { key: "benefit1", label: "Manfaat 1" },
          { key: "benefit2", label: "Manfaat 2" },
          { key: "benefit3", label: "Manfaat 3" },
          { key: "benefit4", label: "Manfaat 4" },
          { key: "benefit5", label: "Manfaat 5" },
          { key: "benefit6", label: "Manfaat 6" },
          { key: "benefit7", label: "Manfaat 7" },
          { key: "benefit8", label: "Manfaat 8" },
          { key: "benefit9", label: "Manfaat 9" },
        ],
      },
    ],
  },
  {
    id: "guarantee",
    label: "Garansi",
    icon: "shield",
    groups: [
      {
        title: "Header Section",
        fields: [
          { key: "section_guarantee_badge", label: "Badge Kecil" },
          { key: "section_guarantee_title", label: "Judul Section" },
          { key: "section_guarantee_subtitle", label: "Subtitle" },
        ],
      },
      {
        title: "Paragraf Garansi",
        fields: [
          { key: "section_guarantee_desc1", label: "Paragraf 1" },
          { key: "section_guarantee_desc2", label: "Paragraf 2" },
          { key: "section_guarantee_desc3", label: "Paragraf 3" },
        ],
      },
    ],
  },
  {
    id: "faq",
    label: "FAQ",
    icon: "chat",
    groups: [
      {
        title: "Header Section",
        fields: [
          { key: "section_faq_title", label: "Judul Section" },
        ],
      },
      {
        title: "FAQ 1",
        fields: [
          { key: "faq_q1", label: "Pertanyaan" },
          { key: "faq_a1", label: "Jawaban" },
        ],
      },
      {
        title: "FAQ 2",
        fields: [
          { key: "faq_q2", label: "Pertanyaan" },
          { key: "faq_a2", label: "Jawaban" },
        ],
      },
      {
        title: "FAQ 3",
        fields: [
          { key: "faq_q3", label: "Pertanyaan" },
          { key: "faq_a3", label: "Jawaban" },
        ],
      },
      {
        title: "FAQ 4",
        fields: [
          { key: "faq_q4", label: "Pertanyaan" },
          { key: "faq_a4", label: "Jawaban" },
        ],
      },
      {
        title: "FAQ 5",
        fields: [
          { key: "faq_q5", label: "Pertanyaan" },
          { key: "faq_a5", label: "Jawaban" },
        ],
      },
      {
        title: "FAQ 6",
        fields: [
          { key: "faq_q6", label: "Pertanyaan" },
          { key: "faq_a6", label: "Jawaban" },
        ],
      },
    ],
  },
  {
    id: "testi",
    label: "Testimoni",
    icon: "star2",
    groups: [
      {
        title: "Header & Tombol",
        fields: [
          { key: "section_testi_title", label: "Judul Section" },
          { key: "section_testi_subtitle", label: "Subtitle" },
          { key: "testi_porto_btn", label: "Teks Tombol Portfolio" },
        ],
      },
    ],
  },
  {
    id: "mentor",
    label: "Mentor",
    icon: "user",
    groups: [
      {
        title: "Profil Utama",
        fields: [
          { key: "mentor_badge", label: "Badge Kecil" },
          { key: "mentor_name", label: "Nama Mentor" },
          { key: "mentor_role", label: "Role / Jabatan" },
          { key: "mentor_desc", label: "Deskripsi Mentor" },
        ],
      },
      {
        title: "Keahlian 1",
        fields: [
          { key: "mentor_feat1_title", label: "Judul" },
          { key: "mentor_feat1_desc", label: "Deskripsi" },
        ],
      },
      {
        title: "Keahlian 2",
        fields: [
          { key: "mentor_feat2_title", label: "Judul" },
          { key: "mentor_feat2_desc", label: "Deskripsi" },
        ],
      },
    ],
  },
  {
    id: "cta",
    label: "CTA Akhir (Sebelum Footer)",
    icon: "megaphone",
    groups: [
      {
        title: "Konten CTA",
        fields: [
          { key: "section_cta_title", label: "Judul CTA" },
          { key: "section_cta_desc", label: "Deskripsi CTA" },
        ],
      },
    ],
  },
  {
    id: "footer",
    label: "Footer & Lain-lain",
    icon: "down",
    groups: [
      {
        title: "Footer",
        fields: [
          { key: "footer_desc", label: "Deskripsi Footer" },
          { key: "footer_rights", label: "Teks Copyright" },
        ],
      },
      {
        title: "Notifikasi Popup",
        fields: [
          { key: "just_now", label: "Teks 'Baru Saja'", hint: "Muncul di popup notifikasi social proof" },
        ],
      },
    ],
  },
];

// Set keys yang pakai rich text editor
export const richTextKeys = new Set<string>([
  "hero_title", "hero_desc", "hero_trust",
  "section_why_title", "section_why_subtitle",
  "why_main_desc", "why_extra_desc1", "why_extra_desc2",
  "approach_card1_desc", "approach_card2_desc", "approach_card3_desc",
  "section_how_desc",
  "step1_desc", "step2_desc", "step3_desc", "step4_desc",
  "why_feat5_desc", "why_feat6_desc", "why_feat7_desc",
  "fitur_card_large_desc", "fitur_practice_desc", "fitur_writing_desc",
  "benefit1", "benefit2", "benefit3", "benefit4", "benefit5",
  "benefit6", "benefit7", "benefit8", "benefit9",
  "section_guarantee_desc1", "section_guarantee_desc2", "section_guarantee_desc3",
  "section_cta_desc",
  "faq_a1", "faq_a2", "faq_a3", "faq_a4", "faq_a5", "faq_a6",
  "mentor_desc", "mentor_feat1_desc", "mentor_feat2_desc",
  "footer_desc",
]);

// Build a label lookup for convenience
export const labels: Record<string, string> = {};
for (const section of sections) {
  for (const group of section.groups) {
    for (const field of group.fields) {
      labels[field.key] = field.label;
    }
  }
}
