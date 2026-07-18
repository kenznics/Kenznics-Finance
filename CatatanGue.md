[ BACKEND: Express + Prisma ] 🧑‍💻
       ▲
       │ (Mengirim data berupa teks JSON via Express Route)
       ▼
[ FRONTEND ENGINE: TypeScript DOM ] 🌐
       │ 1. Mengambil data transaksi dari Backend menggunakan 'fetch()'
       │ 2. Memasukkan data angka tersebut ke variabel JavaScript
       │ 3. Menyuntikkan variabel data ke dalam kode string HTML
       ▼
[ VISUAL ENGINE: Tailwind CSS ] 🎨
       │ Mengatur agar angka dan teks dari TypeScript tadi dibungkus 
       │ dalam kotak visual yang cantik (misal: 'bg-emerald-600' jika untung).

⚛️ CATATAN INSTALASI: FRONTEND REACT TS (VITE)
Catatan ini disimpan sebagai langkah persiapan awal sebelum migrasi dari Vanilla TypeScript ke React.js (Fase 2).

🛠️ Langkah-Langkah Pembuatan Proyek Baru:
1. Membuat Folder Proyek (Template React + TypeScript):
   Jalankan perintah ini di dalam folder utama workspace (`Belajar-BackEnd/`):
   npm create vite@latest frontend-react -- --template react-ts
2. Pindah ke Folder Proyek Baru:
   cd frontend-react + jangan lupa npm install