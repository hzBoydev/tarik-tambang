# 🔥 Panduan Setup Firebase – Tarik Tambang Digital

## Kenapa Perlu Firebase?
Firebase digunakan sebagai backend real-time gratis agar game bisa dimainkan secara online dari device yang berbeda.

---

## Langkah 1: Buat Akun & Project Firebase

1. Buka **https://firebase.google.com**
2. Klik **"Get started"** → Login dengan akun Google
3. Klik **"Create a project"**
4. Nama project: `tarik-tambang` (bebas)
5. Matikan Google Analytics (tidak perlu) → **Create project**

---

## Langkah 2: Aktifkan Realtime Database

1. Di sidebar kiri klik **"Build"** → **"Realtime Database"**
2. Klik **"Create Database"**
3. Pilih lokasi server: **Singapore (asia-southeast1)** ← penting untuk latency rendah di Indonesia
4. Pilih mode: **"Start in test mode"** (bisa baca/tulis bebas)
5. Klik **Enable**

> ⚠️ **Test mode** berlaku 30 hari. Setelah itu perlu update Rules. Untuk sementara ini cukup.

---

## Langkah 3: Ambil Config Keys

1. Di sidebar klik ikon ⚙️ (Project Settings)
2. Scroll ke bawah ke bagian **"Your apps"**
3. Klik **"</> Web"** (tambah web app)
4. Nama app: `tarik-tambang-web`
5. **Jangan centang** Firebase Hosting
6. Klik **"Register app"**

Kamu akan dapat kode seperti ini:

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain:        "tarik-tambang-xxxxx.firebaseapp.com",
  databaseURL:       "https://tarik-tambang-xxxxx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "tarik-tambang-xxxxx",
  storageBucket:     "tarik-tambang-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId:             "1:123456789012:web:xxxxxxxxxxxxxxxx"
};
```

---

## Langkah 4: Paste Config ke script.js

Buka file `script.js`, cari bagian ini di baris paling atas:

```javascript
const firebaseConfig = {
  apiKey:            "GANTI_API_KEY_ANDA",
  authDomain:        "GANTI_PROJECT_ID.firebaseapp.com",
  ...
};
```

**Ganti seluruh isi** dengan config yang kamu dapat dari langkah 3.

---

## Langkah 5: Update Database Rules (Opsional tapi Direkomendasikan)

Di Firebase Console → Realtime Database → **Rules**, ganti dengan:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true
      }
    },
    "admin": {
      ".read": true,
      ".write": true
    },
    "history": {
      ".read": true,
      ".write": true
    }
  }
}
```

Atau cara paling mudah (mode bebas):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Klik **Publish**.

---

## Langkah 6: Test!

1. Buka game di browser: `http://localhost:PORT` (atau IP lokal)
2. Klik **"Buat Room"** → isi setting → klik **"Buat Room"**
3. Jika berhasil, kode room akan muncul ✅
4. Jika error muncul, pastikan config Firebase sudah diisi dengan benar

---

## Cara Main Multiplayer

| Device | Yang Dilakukan |
|--------|----------------|
| 🖥️ **Host** | Buka game → Buat Room → dapat kode → Share link ke Tim A & B → Mulai Game → Spectate |
| 📱 **Tim A** | Buka link dari host → otomatis masuk sebagai Tim A → jawab soal |
| 📱 **Tim B** | Buka link dari host → otomatis masuk sebagai Tim B → jawab soal |

### Link Sharing
- Link Tim A: `http://IP_KAMU/?room=KODE&team=A`
- Link Tim B: `http://IP_KAMU/?room=KODE&team=B`

Untuk bermain di jaringan yang berbeda (internet), game perlu di-deploy ke hosting (Netlify, GitHub Pages, dll).

---

## Troubleshooting

| Error | Solusi |
|-------|--------|
| `Firebase: Error (auth/...)` | Pastikan `apiKey` sudah benar |
| `PERMISSION_DENIED` | Pastikan Database Rules sudah di-set ke test mode |
| `databaseURL` error | Pastikan URL database diisi dengan benar, cek di Firebase Console |
| Room tidak ditemukan | Pastikan kode 6 karakter, huruf kapital |
