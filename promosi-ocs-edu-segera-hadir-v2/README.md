# OCS EDU — Segera Hadir / Paper & Print

Animasi 18 detik, vertikal 1080 × 1920. Buka [index.html](index.html) dengan Chrome atau Edge. Logo, font, library, musik, dan efek suara tersedia lokal sehingga animasi bisa dibuka tanpa internet.

- Klik atau tekan Spasi untuk memulai jika browser menahan autoplay bersuara. Klik/Spasi berikutnya untuk putar atau jeda.
- Tekan R untuk mengulang. Animasi berulang otomatis setelah selesai.
- `?debug=1` menampilkan kontrol waktu; `?clean=1` menahan animasi pada awal untuk pengambilan gambar.
- [Contact sheet](review/contact-sheet.jpg), [preview ponsel](review/mobile-preview.png), dan [hasil pemeriksaan](review/verification.json) tersedia untuk review.

## Konsep dan style brief

**Kabar Baru untuk Sekolahmu.** Sebuah amplop ungu membawa kabar OCS EDU. Catatan, agenda, ilustrasi buku, dan pensil keluar lalu tersusun di sekitar pengumuman kertas. Cap “Segera hadir” menjadi puncak gerak; catatan tulisan tangan menutup pesan.

Arah yang dipertimbangkan: surat dalam amplop, agenda lipat, dan kolase tipografi. Arah amplop dipilih sesuai konsep yang disetujui karena memberi hubungan aksi yang jelas dari pembuka sampai penutup.

Sidik jari: **estafet amplop/kertas · satu meja/empat babak · amplop/catatan/poster/cap · pembuka amplop mendarat · penutup cap dan catatan**.

- Palet: kertas krem `#F7F2E8`, ungu OCS `#6025C9`, lavender `#E8DDF8`, tinta gelap `#292235`.
- Fraunces untuk headline dan cap, Caveat untuk catatan tulisan tangan, Plus Jakarta Sans untuk wordmark dan informasi kecil.
- Tekstur serat kertas, ujung sobek, garis lipatan, selotip, dan bayangan benda membangun kedalaman di satu meja.
- Gerak: benda melayang mengikuti busur, berputar, mendarat, dan saling menutupi. Kamera bergeser perlahan; cap memberi hentakan singkat.
- Latar tetap hidup melalui gerak cahaya dan pergeseran kamera. Transisi berlangsung melalui perpindahan benda dalam komposisi yang sama.
- Logo menggunakan aset asli OCS EDU. Buku, pensil, amplop, cap, dan kertas dibuat dengan HTML/CSS/SVG; tidak memerlukan gambar AI.

## Rundown

| Detik | Aksi | Pesan |
|---|---|---|
| 0–3 | Amplop ungu meluncur dan mendarat | Ada kabar baru |
| 3–7 | Amplop membuka; catatan dan alat sekolah keluar | Untuk sekolahmu |
| 7–11 | Lembar pengumuman terbuka, logo terlihat, selotip mendarat | OCS EDU |
| 11–15 | Cap turun pada detik 11,55, meninggalkan tinta, lalu terangkat | Segera hadir |
| 15–17 | Catatan CTA muncul dengan sapuan tulisan tangan | Ikuti kabar terbaru |
| 17–18 | Susunan kertas menyusut dan melipat menuju pengulangan | — |

## Audio dan sumber aset

Musik instrumental menggunakan aset kampanye yang sudah ada di `../promosi-ocs-edu-segera-hadir/assets/teaser-music.wav`, dicampur pada volume lebih rendah dengan efek kertas dan hentakan cap sintetis. Campuran stereo 48 kHz berdurasi 18 detik disimpan sebagai `assets/paper-print-music.wav`; tanpa narasi. Efek cap dimulai pada 11,55 detik, sama dengan awal munculnya tinta. Sumber musik diwarisi dari workspace, tanpa lisensi baru yang ditambahkan oleh varian ini.

`scripts/compose-audio.py` membuat ulang campuran menggunakan sumber teaser sebelumnya. Kebisingan kertas memakai seed tetap; amplitudo puncak hasil campuran sekitar 0,587, di bawah batas clipping.

Fraunces dan Caveat diunduh dari Google Fonts; URL sumber tercatat di `assets/font-sources.json`. Plus Jakarta Sans, logo, dan GSAP 3.12.5 disalin dari aset teaser sebelumnya. Lisensi OFL masing-masing font disertakan dalam folder assets. `scripts/fetch-fonts.mjs` menyediakan pengambilan ulang font dan lisensinya jika diperlukan; pemutaran tidak mengakses jaringan.

Arsitektur opener diadaptasi dari skill [bang-motion](https://github.com/bangtutorial/bang-motion), dengan atribusi starter MIT di HTML. Pesan tidak mencantumkan tanggal rilis atau klaim fitur baru tertentu.

## Pemeliharaan dan verifikasi

`window.OPENER` menyediakan `W`, `H`, `DURATION`, `tl`, `ready`, `seek(detik)`, `play()`, `pause()`, dan `restart()`. Seluruh posisi visual dihitung dari waktu timeline, termasuk tekstur yang memakai seed tetap, agar seek dan pengambilan frame konsisten.

Jalankan `node scripts/review.mjs` dari folder ini untuk memeriksa hasil. Script menggunakan Puppeteer dan Sharp yang tersedia di project landing-page lokal serta Chrome pada instalasi Windows ini. Jalur dependensi dapat disesuaikan bila project dipindahkan; HTML sendiri tidak memerlukan Node.

Pemeriksaan mencakup 16 keyframe, batas teks, font dan gambar lokal, viewport 390 × 844, waktu muncul tinta, seek deterministik, durasi audio, putar/jeda, loop, pemuatan offline, dan autoplay yang memerlukan gestur. Hasil terperinci disimpan di `review/verification.json`. Pembatalan permintaan audio saat seek/reload dicatat terpisah dari kegagalan aset.
