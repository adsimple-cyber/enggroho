import { readFileSync, existsSync } from "fs";
import { join } from "path";

const IS_VERCEL = process.env.VERCEL === "1";
const SRC_PATH = join(process.cwd(), "src/data/content.json");
const TMP_PATH = "/tmp/enggroho-content.json";

/**
 * Load translations dari disk SETIAP PEMANGGILAN.
 * Di Vercel: prioritaskan /tmp (data terbaru dari CMS), fallback ke bundled.
 * Di local: baca langsung dari src/data/content.json.
 */
function loadTranslations() {
  try {
    const path = (IS_VERCEL && existsSync(TMP_PATH)) ? TMP_PATH : SRC_PATH;
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return { id: {}, en: {} };
  }
}

// Getter yang selalu fresh — di-destructure di Astro/JS biasa tetap jalan.
// Object terbaru akan di-return tiap kali property `translations` diakses.
export const translations = new Proxy(
  {},
  {
    get(_target, prop) {
      const data = loadTranslations();
      return data[prop];
    },
    ownKeys() {
      return Object.keys(loadTranslations());
    },
    getOwnPropertyDescriptor() {
      return { enumerable: true, configurable: true };
    },
  }
);

export const testimonials = [
    {
        name: "Permadi Wisnu Aji Wardhani",
        role: "Head of Water Engineering, Multinational Company",
        text: "Bekerja sebagai staf senior pengolahan air, saya merasa karir saya telah stagnan. Setelah menyelesaikan program Enggroho, keterampilan komunikasi saya meningkat secara dramatis. Ini membawa saya ke lompatan karir ke posisi pemasaran di perusahaan multinasional yang lebih besar, di mana saya telah berhasil mendapatkan lebih banyak klien. Pengembalian investasi pada kursus ini luar biasa!",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=permadi"
    },
    {
        name: "Belva Amalia Destaty",
        role: "English First Teacher, UMS Top Graduate",
        text: "Sebagai mantan siswa SMP yang kesulitan dengan bahasa Inggris, saya tidak pernah membayangkan bisa mencapai begitu banyak. Berkat bimbingan Enggroho, saya tidak hanya menjadi lulusan terbaik di jurusan Bahasa Inggris UMS, tetapi juga mendapatkan pekerjaan impian saya di English First. Metode pengajaran yang dipersonalisasi benar-benar mengubah hubungan saya dengan bahasa.",
        image: "/testimoni/Belva Amalia Destaty.jpg"
    },
    {
        name: "Raundoh Tul Jannah",
        role: "AI Ready ASEAN-Mafindo, Jakarta",
        text: "I met Nugroho ketika saya sedang mempersiapkan keberangkatan ke acara PBB di Thailand. Nugroho berperan penting dalam membantu saya meningkatkan kemampuan bahasa Inggris dan menyiapkan pidato saya. Berkat dukungannya, saya berhasil menyampaikan pidato dengan sukses dan kemudian mendapatkan kepercayaan diri untuk bekerja full-time secara remote di tingkat internasional.",
        image: "/testimoni/Raundoh Tul Jannah.jpg"
    },
    {
        name: "Matinu Ramadhan",
        role: "Olahragawan, Australia",
        text: "Dengan latar belakang S1 olahraga, saya sedang mempersiapkan IELTS untuk mendapatkan visa kerja ke Australia. Enggroho membantu saya mencapai nilai IELTS yang memuaskan dan akhirnya saya berhasil mendapatkan visa kerja ke Australia. Pendekatan yang dipersonalisasi membuat perbedaan besar dalam perjalanan belajar bahasa saya.",
        image: "/testimoni/Matinu Ramadhan.jpg"
    },
    {
        name: "Gean Reyhan Pangerian",
        role: "Human Capital Practitioner, Jakarta",
        text: "He brought a creative approach to teaching, often using practical analogies and real-life examples that are highly relevant to different contexts and learners. His teaching style is engaging and approachable, making the learning process feel comfortable and enjoyable.",
        image: "/testimoni/Gean Reyhan Pangerian.jpg"
    },
    {
        name: "Ibnu Halim Mustofa",
        role: "Web Developer & Programmer, Australia",
        text: "Sebagai web developer dengan pengalaman 7 tahun, saya telah bekerja secara remote untuk perusahaan Australia selama 3 tahun terakhir. Namun, saya merasa stuck dan ingin naik ke posisi manajerial. Dengan bantuan Enggroho, sekarang saya sudah nyaman dalam berkomunikasi dan tinggal menunggu waktu yang tepat untuk promosi.",
        image: "/testimoni/Ibnu Halim Mustofa.jpg"
    },
    {
        name: "Dimas Noverli",
        role: "Senior Graphic Designer & Motion Designer, Jakarta",
        text: "Saya seorang Senior Graphic Designer dengan pengalaman 6 tahun, dan juga motion designer selama 2 tahun terakhir. Baru mulai belajar bahasa Inggris dan menyesal tidak ketemu Enggroho lebih awal. Setelah bertemu Enggroho, saya lebih percaya diri dan ingin mencari peluang remote job di luar negeri.",
        image: "/testimoni/Dimas Noverli.jpg"
    },
    {
        name: "Herryan Rudi Pratama",
        role: "Human Capital Assessor Coordinator, Jakarta",
        text: "Saya seorang Human Capital Assessor Coordinator di perusahaan retail top Indonesia selama 4 tahun. Dengan Enggroho, saya mempertajam bahasa Inggris saya dan ini menjadi salah satu aspek penting dalam mendapatkan promosi. Pendekatan yang terstruktur benar-benar membantu saya memajukan karir.",
        image: "/testimoni/Herryan Rudi Pratama.jpg"
    },
    {
        name: "Ines Pramita",
        role: "Assessor Officer & Recruitment Consultant, Jakarta",
        text: "Bahasa Inggris saya sudah bagus secara tekstual, dengan Enggroho, bahasa Inggris saya menjadi sangat bagus secara speaking juga. Sekarang saya siap bersaing untuk mendapatkan promosi atau mencari peluang remote di luar negeri.",
        image: "/testimoni/Ines.jpg"
    },
    {
        name: "Salma Aulia Khosibah",
        role: "Dosen PGPAUD, Semarang",
        text: "Investasi yang sangat sepadan dengan hasil! Saya adalah dosen muda yang ingin berkolaborasi dengan peneliti hebat diseluruh dunia. Enggroho berhasil membantu saya memaksimalkan Linkdln dan kemampuan bicara saya.",
        image: "/testimoni/Salma Aulia Khosibah.jpg"
    },
    {
        name: "Ririn Wahyu",
        role: "Lab team leader, Jepara",
        text: "Terimakasih Enggroho sudah membantu saya meningkatkan kepercayaan diri dan kemampuan bahasa Inggris saya! Saya akhirnya bisa pede di setiap meeting dan kunjungan lab dari supplier.",
        image: "/testimoni/Ririn Wahyu.jpg"
    },
    {
        name: "Taufik Mukti Bowo",
        role: "Chef De Cuisine, Jakarta (Hotel)",
        text: "Nugroho adalah mentor Bahasa Inggris terbaik! Tidak cuma meningkatkan bahasa Inggris saya tapi juga berhasil membuatkan CV dan custom Linkedin saya sehingga saya diterima di Hotel daerah Jakarta.",
        image: "/testimoni/Taufik Mukti Bowo.jpg"
    }
];
