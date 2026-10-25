# OCS EDU — Segera Hadir

Teaser 18 detik, vertikal 1080 × 1920. Buka **index.html** dengan Chrome atau Edge; font, logo, library, dan musik tersedia lokal.

- Musik instrumental, tanpa narasi. Jika autoplay bersuara diblokir, klik pada video atau tekan Spasi untuk memulai.
- Spasi atau klik: putar/jeda. R: ulang. Video berulang otomatis.
- Tambahkan `?debug=1` untuk kontrol waktu dan `?clean=1` untuk menahan video pada awal.
- Preview keyframe ada di `review/contact-sheet.jpg`; preview ponsel ada di `review/mobile-preview.png`.

## Konsep dan style brief

Tema: teaser pengenalan OCS EDU. Perasaan: penasaran, dekat, siap menyambut.

Tiga arah yang dipertimbangkan: makro simbol berlapis dengan kilasan UI; tipografi yang membentuk wordmark; celah siluet yang membuka portal. Dipilih **makro simbol berlapis**, mengikuti konsep yang disetujui: simbol asli menjadi penghubung dari awal sampai penutup, sehingga ketiga peran terasa berada dalam satu produk.

Sidik jari: **makro simbol · empat babak · simbol / portal / simbol / brand · pembuka detail logo · penutup Segera hadir**. Berbeda dari tur UI V2: video ini membuka lewat bentuk logo, memberi kilasan singkat, lalu kembali ke identitas brand.

- Ungu utama `#6025C9`: tombol aplikasi OCS EDU. Latar `#120A23`: turunan gelap ungu untuk ruang teaser. Mint `#B9F8DF`: turunan lembut hijau status aplikasi untuk aksen teks.
- Plus Jakarta Sans untuk headline dan wordmark; Inter untuk komponen portal.
- Penekanan teks dengan warna mint; tanpa tanda baca pada frasa pendek.
- Latar: ungu gelap dengan cahaya radial dan tekstur halus. Bentuk logo besar bergerak perlahan sebagai lapisan belakang.
- Objek: logo berlapis dengan permukaan gradien; portal memakai permukaan putih mengikuti UI aplikasi.
- Tanda tangan gerak: lapisan membuka dan menutup. Portal mengikuti satu lintasan di sekitar simbol.
- Transisi: portal masuk dari kedalaman secara beririsan, lalu menyusut ke simbol. Kilau singkat saat logo menyatu menjadi momen utama.

## Rundown

| Detik | Aksi utama | Teks |
|---|---|---|
| 0–3,6 | Logo berlapis terlihat dari dekat lalu membuka ruang | Ada yang baru |
| 3,6–9,9 | Kilasan jadwal guru, LMS siswa, dan capaian akademik orang tua | Untuk sekolahmu |
| 9,9–12,8 | Portal menutup, logo menyatu dan bergeser ke posisi brand | OCS EDU |
| 12,8–17,1 | Identitas dan pesan rilis tampil penuh, latar tetap bergerak | Segera hadir · Ikuti kabar terbaru |
| 17,1–18 | Logo mendekat kembali untuk transisi pengulangan | — |

## Sumber dan adaptasi

Logo asli, font lokal, dan musik kampanye berasal dari aset OCS EDU yang telah tersedia di workspace. Musik dipotong menjadi 18 detik dengan fade awal/akhir; tidak ada voice-over baru. Bentuk logo menggunakan piksel aset asli sebagai mask, bukan digambar ulang. Mask ditanam sebagai data URI agar bisa tampil lewat `file://` tanpa pengaturan browser khusus.

Cuplikan portal dibuat ulang sebagai HTML berdasarkan komponen OCS EDU yang telah ditampilkan di V2: jadwal mengajar, kartu LMS, dan capaian akademik. Header disederhanakan, identitas akun dibuat generik, dan ukuran komponen disesuaikan untuk teaser. Angka 75% dan 79.8 serta nama mata pelajaran adalah contoh dari materi showcase; animasi hanya mengungkap contoh data tersebut. Video ini bukan rekaman transaksi atau simulasi perubahan nilai akademik.

Pesan rilis tidak menyebut tanggal, fitur baru tertentu, platform listing, atau ketersediaan aplikasi di toko aplikasi. Tidak ada aset gambar AI baru.

## Pemeliharaan

Jalankan perintah berikut untuk mengekspor dan mengonversi video ke MP4 2K (1440 × 2560 @ 60fps):
```text
node scripts/review.mjs
node scripts/render-video.mjs
```

`window.OPENER` menyediakan `W`, `H`, `DURATION`, `tl`, `ready`, `seek(detik)`, `play()`, `pause()`, dan `restart()`. Seluruh visual bergantung pada waktu timeline untuk preview dan ekspor deterministik.

`scripts/review.mjs` memeriksa keyframe, batas teks, sentuhan LMS, seek berulang, viewport mobile, audio dan loop, pemuatan offline, serta penahanan autoplay sampai gestur pengguna. Script memakai Puppeteer yang sudah tersedia pada project landing page lokal. Hasil terakhir disimpan dalam `review/verification.json`.

Pemeriksaan terakhir lulus: 15 keyframe, viewport 390 × 844, sentuhan berada di tombol LMS, seek berulang menghasilkan piksel identik, audio dan timeline berdurasi 18 detik, serta pemutaran dan pengulangan berjalan. Tidak ditemukan error JavaScript atau aset gagal dimuat. Pembatalan permintaan audio saat seek/reload dicatat terpisah sebagai perilaku streaming browser.

Jika logo diganti, jalankan `node scripts/embed-logo.mjs` untuk menyegarkan mask dalam HTML. Lisensi font tersedia di folder assets. Dibangun dengan [bang-motion](https://github.com/bangtutorial/bang-motion); arsitektur starter memakai lisensi MIT.
