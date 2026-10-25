# OCS EDU — Promosi V2

Buka **index.html** dengan Chrome atau Edge. Semua aset lokal; tidak perlu menjalankan server atau menginstal package untuk menonton.

- Format: 1080 × 1920, vertikal 9:16, 35 detik.
- Audio: musik instrumental original kampanye OCS EDU, tanpa voice-over.
- Jika browser memblokir autoplay bersuara, klik sekali pada video untuk mulai.
- Spasi: putar/jeda. R: ulang. Video mengulang otomatis.
- Review dengan `index.html?debug=1`; tampilan bersih yang berhenti di awal dengan `index.html?clean=1`.
- Video MP4 hasil render tersedia di `promosi-ocs-edu-v2-2k.mp4` (1440 × 2560 2K QHD, 60 FPS, H.264 High CRF 16 + AAC 48 kHz).
- Untuk render ulang video: `node scripts/render-video.mjs`.
- Review animasi HTML dapat dibuka langsung via `index.html?debug=1`.

## Konsep

**Tur produk — Terhubung untuk tumbuh.** Tema hubungan guru, siswa, dan orang tua dipertahankan dari V1. V2 menggunakan tangkapan UI aplikasi asli dan komponen yang dirakit ulang untuk animasi detail.

| Waktu | Visual / aksi | Pesan |
|---|---|---|
| 0–3,5 | Dashboard guru desktop, perspektif mendatar | Sekolah, saling terhubung |
| 3,5–7 | Beralih ke portal guru mobile, gulir ke jadwal | Mengajar lebih terarah |
| 7–10 | Kartu jadwal Matematika Wajib terangkat; detail muncul bertahap | Jadwal dan konteks kelas terlihat |
| 10–15,5 | Ruang belajar siswa; kartu LMS terangkat, progres terisi | Ruang belajar, selalu dekat |
| 15,5–18 | Sentuhan pada Lanjutkan Belajar membuka tampilan detail | Alur penggunaan nyata |
| 18–21 | Panel Progress Belajar 75% di atas medan ungu | Belajar terus berjalan |
| 21–25 | Portal orang tua bergulir ke capaian akademik | Orang tua ikut memantau |
| 25–29 | Rapor terangkat: rata-rata 79.8, predikat B, mapel unggulan | Informasi perkembangan anak |
| 29–32 | Tiga portal tersusun dalam satu komposisi | Satu sekolah, semua terhubung |
| 32–35 | Logo dan wordmark | Terhubung untuk tumbuh |

## Arah visual

- Perasaan: dekat, jelas, tepercaya.
- Konsep terpilih: tur produk berselang klaim (bang-motion #19); lebih tepat untuk menunjukkan UI asli dibanding estafet benda atau tipografi dominan.
- Ungu tombol aplikasi `#6025C9`, putih panel, Inter mengikuti UI OCS EDU.
- Lavender `#F4F1FC` merupakan turunan ungu untuk latar; mint mengambil warna status/progres aplikasi.
- Plus Jakarta Sans untuk judul; tanpa stiker atau sorotan kata dekoratif.
- Latar: cahaya lembut bergerak dan bidang melingkar; medan ungu saat menyoroti progres dan penutup.
- Gerak utama: satu bingkai mobile bertahan, perpindahan di dalam layar, kartu UI keluar dari layar. Transisi desktop/mobile memakai perspektif 3D; penutup memakai susunan tiga perangkat.

## Sumber tampilan dan batas adaptasi

Tangkapan lokal diambil pada **21 Oktober 2026** dari `http://ocs-edu.test`, menggunakan akun yang diberikan pengguna. Tidak ada perubahan data akademik, presensi, tugas, nilai, atau pembayaran. Navigasi ke materi dapat tercatat sebagai kunjungan oleh aplikasi.

| Aset | Sumber |
|---|---|
| `guru-dashboard-1440.png`, `guru-dashboard-430.png` | `/portal/guru` |
| `guru-mengajar-430.png` | Bagian Jadwal Mengajar Hari Ini pada portal guru |
| `siswa-lms-430.png` | Bagian Ruang Belajar & Materi LMS pada `/portal/siswa` |
| `siswa-materi-430.png` | Detail kelas Matematika Wajib pada `/learning/courses/...` |
| `ortu-dashboard-430.png` | `/portal/parent` |
| `ortu-rapor-430.png` | Bagian Capaian Akademik & E-Rapor pada portal orang tua |
| `ocs-edu-icon.png` | Aset logo OCS EDU dari project landing page |

Kartu jadwal, LMS, progres, modul bab, dan rapor yang diperbesar dibuat sebagai HTML agar dapat bergerak per komponen. Label dan nilai diambil dari layar sumber; spacing dan susunan tertentu disesuaikan untuk video vertikal. Animasi progres mengungkap nilai yang sudah ada, bukan memperagakan perubahan nilai atau penyelesaian tugas baru. Konten uji coba (dummy text) pada detail materi telah digantikan dengan kartu modul pembelajaran autentik yang representatif.

Guru dan siswa pada promo memperlihatkan contoh penggunaan per peran; ini bukan rekaman satu transaksi yang mengubah data lintas akun. Nama sekolah dan profil berasal dari data lokal yang disediakan. Tidak ada kata sandi, cookie, atau token sesi di paket.

Tidak diperlukan gambar AI baru: aset showcase V2 berasal dari aplikasi, sedangkan ornamen dan animasi dibuat dengan CSS/SVG.

Navbar mobile dirakit ulang menggunakan HTML/SVG di atas area layar yang dipotong, sehingga potongan navbar dan bayangan dari screenshot lama tidak tampil saat pergantian halaman. Latar navbar putih solid, dengan menu per peran:

- Guru: Beranda, Akademik, E-Learning, Kesiswaan.
- Siswa: Beranda, Akademik, LMS, Tagihan.
- Orang tua: Beranda, Anak Saya, Tagihan.

Ketiga ponsel pada penutup memiliki tepi bawah yang sejajar, dengan ukuran dan kemiringan masing-masing dipertahankan. HTML, preview, dan MP4 diperbarui; ZIP tidak dibuat atau diperbarui.

## Berkas kerja

- `index.html`: visual, komponen, timeline deterministik, pemutar audio.
- `assets/`: tangkapan asli, logo, font lokal, GSAP, audio dan lisensi font.
- `scripts/capture.mjs`: alat capture lokal; kredensial dibaca dari stdin, tidak disimpan. Path dependensi mengacu pada workspace lokal pembuat.
- `scripts/review.mjs`: pemeriksaan keyframe, teks, audio, kontrol, pengulangan, tampilan mobile dan offline; menggunakan dependency yang sudah tersedia di project landing page.
- `review/contact-sheet.jpg`: ringkasan visual keyframe.
- `review/verification.json`: hasil pemeriksaan terakhir.

Pemeriksaan terakhir lulus: 17 keyframe, menu dan tab aktif ketiga peran, navbar tanpa bayangan/filter, kesejajaran tepi bawah ponsel penutup (selisih kurang dari 1 px), batas aman judul, sentuhan tepat pada tombol LMS, kesamaan piksel saat seek berulang, viewport 390 × 844, pemutaran/jeda/ulang, sinkronisasi audio, pengulangan otomatis, penahanan autoplay bersuara, dan pemuatan offline. Tidak ditemukan error JavaScript selama pemeriksaan. Ini memverifikasi promo; bukan pengujian fungsional seluruh aplikasi OCS EDU.

Timeline tersedia melalui `window.OPENER`: `seek(detik)`, `play()`, `pause()`, `tl`, `W`, `H`, `DURATION`, `ready`. Semua keadaan visual berasal dari waktu timeline; tidak bergantung pada jam sistem atau angka acak.

Dibuat memakai [bang-motion](https://github.com/bangtutorial/bang-motion). GSAP 3.12.5 disertakan lokal dengan header lisensinya. Font Inter dan Plus Jakarta Sans memakai SIL Open Font License, tersedia di folder assets.
