# SmartHome Vision — Empat Lapisan Sistem

Explainer vertikal **1080 × 1920**, durasi **78,73 detik**, mengikuti VO MiniMax yang disediakan pengguna. Buka [index.html](index.html) langsung di Chrome atau Edge. Seluruh aset, font, library, dan audio tersedia lokal.

- Klik atau tekan **Spasi** untuk memulai jika autoplay bersuara ditahan browser; klik/Spasi berikutnya untuk jeda atau melanjutkan.
- **R** mengulang dari awal. Animasi dan audio berulang otomatis.
- `?debug=1` membuka kontrol waktu; `?clean=1` menahan animasi pada awal.
- [Preview rangkaian frame](review/contact-sheet.jpg), [preview mobile](review/mobile-preview.png), dan [hasil verifikasi](review/verification.json).
- [Naskah VO dan cue](vo-script.md) memuat teks pilihan pengguna serta pemetaan waktu.

## Konsep dan style brief

**Visi sebuah rumah, empat lapisan sistem.** Pembuka memperlihatkan kamera rumah yang tersebar ke beberapa aplikasi. Dunia terangkat menjadi empat lapisan isometrik: Ingestion, AI Vision, Data & Security, serta Presentation. Kamera menyusuri setiap lapisan; perintah dari aplikasi kembali menuju perangkat. Pada penutup, susunan sistem kembali terlihat bersama identitas produk.

Perasaan: jelas, ingin tahu, optimistis. Gaya **cartoon collage / isometrik 2.5D**, dengan rumah ilustrasi cetak, properti vektor, bidang semiopak, bayangan lembut, dan gerak data. Satu rig dunia menghubungkan semua bagian; tidak menggunakan urutan section/slide yang ditukar dengan fade.

- Palet dari `smarthome-vision/apps/mobile/lib/core/theme/app_colors.dart`: biru `#0066FF`, latar `#F8FAFC`, tinta `#0F172A`, oranye `#EA580C`, hijau `#16A34A`.
- Font: Bricolage Grotesque untuk headline/nama lapisan; Caveat untuk anotasi; Plus Jakarta Sans untuk UI demonstrasi.
- Latar: cahaya biru/teal berlapis di atas putih hangat, grid tipis dan grain yang bergerak deterministik.
- Gerak identitas: empat lapisan membuka dan merapat, paket data bergerak di antara komponen.
- Ukuran shot berubah mengikuti isi VO. Tampilan keseluruhan dipakai saat pengenalan dan penutup; detail diperbesar saat dijelaskan.
- Musik elektronik instrumental orisinal dan efek prosedural ringan, dengan ducking mengikuti suara pengguna. Tidak ada musik berlisensi pihak ketiga yang ditambahkan.

## Rundown aktual

| Waktu | Fokus |
|---|---|
| 0–7,05 | Rumah, kamera, dan aplikasi terpisah |
| 7,05–15,38 | Penyatuan konsep dan pengungkapan empat lapisan |
| 15,38–24,39 | Kamera, aliran frame, go2rtc bridge |
| 24,39–37,45 | Deteksi, kendaraan, orang/paket, zona dan konsep profil wajah |
| 37,45–46,56 | Event store, SQLite, komputer lokal dan akses pemilik |
| 46,56–64,01 | UI demonstrasi, HOUSE, GATE dan kartu plat |
| 64,01–72,15 | Konsep D-Pad, lampu dan kembali ke posisi jaga |
| 72,15–78,73 | Sistem merapat dan CTA |

## Aset, suara, dan batas representasi

`assets/voiceover.wav` adalah salinan WAV pengguna. `assets/soundtrack.wav` mencampurkan VO tersebut dengan musik/SFX orisinal, tanpa time-stretch. Hasil analisis audio tersimpan di `review/audio-report.json`. WAV dipilih agar sumber pengolahan tidak melewati kompresi lossy baru.

Rumah `assets/house-cutout.png` dibuat dengan built-in imagegen. Prompt lengkap tersedia di [assets/image-prompt.md](assets/image-prompt.md). Alpha asli dipertahankan. CCTV, kendaraan, orang, paket, chip, database, dan simbol akses dibuat sebagai SVG lokal. Simbol rumah/lensa pada judul adalah identitas visual khusus video ini, bukan klaim logo resmi yang sudah ada dalam aplikasi.

UI mengikuti kategori dan warna aplikasi (pantauan, ringkasan, aktivitas, zona), tetapi dirakit ulang untuk video dengan **data demonstrasi**. Kontrol hardware dan profil wajah adalah ilustrasi target; tidak ada transaksi, login atau perubahan konfigurasi CCTV nyata. Ilustrasi tokoh dibuat sintetis, tidak memakai wajah keluarga pengguna. Diagram empat lapisan menyederhanakan arsitektur konseptual; bukan diagram panggilan runtime yang lengkap.

Narasi dipertahankan sesuai pilihan pengguna dan menggambarkan visi sistem akhir. Caption status **Visi pengembangan • Prototipe pribadi**, anotasi target integrasi/fitur, dan catatan penutup menyertai visual. Tidak ada benchmark atau bukti baru untuk klaim zero latency, enkripsi semua data, dukungan semua merek, pengenalan wajah, atau kebijakan langganan. Tidak ditambahkan persentase akurasi atau tanggal rilis.

Font diunduh dari Google Fonts; lisensi OFL dan URL tersedia dalam `assets/`. GSAP 3.12.5 disimpan lokal dengan header lisensinya. Dibangun dengan [bang-motion](https://github.com/bangtutorial/bang-motion), mengadaptasi rig `starter-explainer-kartun.html` (MIT).

## Pemeliharaan

Sumber: `src/props.mjs` (properti SVG), `src/styles.css`, `src/animation.js`, dan komposisi dalam `scripts/build.mjs`. Jalankan:

```text
node scripts/build.mjs
python scripts/mix-audio.py
node scripts/review.mjs
node scripts/render-video.mjs
```

Build menyatukan markup, CSS dan animasi ke `index.html`; penonton tidak memerlukan Node/Python/server. Pengambilan ulang font opsional: `node scripts/prepare-assets.mjs`. Audio mix memakai NumPy/SciPy. Review memakai Puppeteer dan Sharp yang terpasang di project landing-page pada komputer ini; jalur dependensi/Chrome perlu disesuaikan jika pindah komputer.

`window.OPENER` menyediakan `W`, `H`, `DURATION`, `tl`, `ready`, `seek(seconds)`, `seekFrame(seconds)`, `play()`, `pause()`, `restart()`. Audio menjadi acuan waktu selama pemutaran; seek tetap deterministik untuk ekspor.

Review memeriksa 20 keyframe, batas headline, mobile 390 × 844, seek berulang, durasi/sinkron audio, putar/jeda, loop, autoplay yang ditahan sampai gestur, dan pemuatan offline. Frame penuh terpilih disimpan bersama contact sheet. Transkripsi otomatis di `review/vo-alignment.json` hanya alat bantu timing dan mengandung kesalahan ejaan dari ASR; sumber suara asli dan naskah pengguna tetap acuan.
