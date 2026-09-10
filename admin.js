/* ============================================================
   TARIK TAMBANG QUIZ – admin.js
   Dedicated Host Admin Controller & Firebase Realtime Database
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyD7TRTTFh2fgPQtWlqLeV0EfMG4AtajbkM",
  authDomain: "tarik-tambang-23c80.firebaseapp.com",
  databaseURL: "https://tarik-tambang-23c80-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tarik-tambang-23c80",
  storageBucket: "tarik-tambang-23c80.firebasestorage.app",
  messagingSenderId: "364526068319",
  appId: "1:364526068319:web:fdcd538a1724855203b1ea",
  measurementId: "G-1H4YBJH9NM"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let hostMasterPassword = "HOST123";
const LABELS = ['A', 'B', 'C', 'D'];

const DEFAULT_QUESTIONS = [
  {
    q: "Pancasila sebagai dasar negara Indonesia pertama kali diusulkan oleh Ir. Soekarno pada sidang BPUPKI tanggal…",
    choices: ["28 Mei 1945", "1 Juni 1945", "22 Juni 1945", "17 Agustus 1945"],
    answer: 1
  },
  {
    q: "Lambang negara Indonesia yang memuat Pancasila bernama…",
    choices: ["Garuda Nusantara", "Burung Garuda", "Garuda Pancasila", "Sang Saka Merah Putih"],
    answer: 2
  },
  {
    q: "Sila ke-3 Pancasila berbunyi…",
    choices: ["Kemanusiaan yang Adil dan Beradab", "Persatuan Indonesia", "Keadilan Sosial bagi Seluruh Rakyat Indonesia", "Ketuhanan Yang Maha Esa"],
    answer: 1
  },
  {
    q: "Badan yang bertugas mempersiapkan kemerdekaan Indonesia dan merumuskan dasar negara adalah…",
    choices: ["PPKI", "DPR", "BPUPKI", "MPR"],
    answer: 2
  },
  {
    q: "Lambang sila ke-1 (Ketuhanan Yang Maha Esa) pada Garuda Pancasila adalah…",
    choices: ["Pohon Beringin", "Bintang Emas", "Rantai Emas", "Kepala Banteng"],
    answer: 1
  },
  {
    q: "Piagam Jakarta ditandatangani pada tanggal…",
    choices: ["1 Juni 1945", "17 Agustus 1945", "22 Juni 1945", "18 Agustus 1945"],
    answer: 2
  },
  {
    q: "Lambang sila ke-2 (Kemanusiaan yang Adil dan Beradab) adalah…",
    choices: ["Padi dan Kapas", "Bintang", "Rantai Emas", "Pohon Beringin"],
    answer: 2
  },
  {
    q: "Tokoh yang dikenal sebagai 'Bapak Bangsa' dan menjadi presiden pertama RI adalah…",
    choices: ["Mohammad Hatta", "Ir. Soekarno", "Soepomo", "Mohammad Yamin"],
    answer: 1
  },
  {
    q: "Lambang sila ke-4 (Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan) adalah…",
    choices: ["Padi dan Kapas", "Rantai Emas", "Kepala Banteng", "Pohon Beringin"],
    answer: 2
  },
  {
    q: "PPKI mengesahkan Pancasila sebagai dasar negara pada tanggal…",
    choices: ["17 Agustus 1945", "18 Agustus 1945", "1 Juni 1945", "22 Juni 1945"],
    answer: 1
  },
  {
    q: "Lambang sila ke-5 (Keadilan Sosial bagi Seluruh Rakyat Indonesia) adalah…",
    choices: ["Bintang Emas", "Rantai Emas", "Kepala Banteng", "Padi dan Kapas"],
    answer: 3
  },
  {
    q: "Nilai Pancasila sila ke-1 diterapkan dalam kehidupan sehari-hari dengan cara…",
    choices: ["Membayar pajak tepat waktu", "Menghormati pemeluk agama lain", "Aktif bermusyawarah di desa", "Membeli produk dalam negeri"],
    answer: 1
  },
  {
    q: "Tokoh yang mengusulkan nama 'Pancasila' sebagai dasar negara adalah…",
    choices: ["Mohammad Yamin", "Soepomo", "Ir. Soekarno", "Mohammad Hatta"],
    answer: 2
  },
  {
    q: "Semboyan negara Indonesia yang tertulis di bawah Garuda Pancasila adalah…",
    choices: ["Bhineka Tunggal Ika", "Sekali Merdeka Tetap Merdeka", "Satu Nusa Satu Bangsa", "Merdeka atau Mati"],
    answer: 0
  },
  {
    q: "Penerapan nilai sila ke-3 Pancasila (Persatuan Indonesia) dalam kehidupan sehari-hari adalah…",
    choices: ["Memaksakan kehendak kepada teman", "Mengutamakan kepentingan golongan", "Menggunakan produk dalam negeri", "Bersikap pilih kasih terhadap teman"],
    answer: 2
  },
  {
    q: "Rumusan Pancasila yang sah dan berlaku sampai sekarang terdapat dalam…",
    choices: ["Piagam Jakarta", "Pembukaan UUD 1945", "Batang Tubuh UUD 1945", "Dekrit Presiden 1959"],
    answer: 1
  },
  {
    q: "Berapa total jumlah bulu pada Sayap Garuda Pancasila yang melambangkan tanggal kemerdekaan RI?",
    choices: ["17 bulu per sayap", "8 bulu per sayap", "45 bulu per sayap", "1945 bulu"],
    answer: 0
  },
  {
    q: "Musyawarah untuk mencapai mufakat merupakan penerapan nilai Pancasila sila ke…",
    choices: ["Ke-2", "Ke-3", "Ke-4", "Ke-5"],
    answer: 2
  },
  {
    q: "Lambang sila ke-3 Pancasila (Persatuan Indonesia) adalah…",
    choices: ["Rantai Emas", "Kepala Banteng", "Pohon Beringin", "Bintang Emas"],
    answer: 2
  },
  {
    q: "Warna dasar perisai pada lambang Garuda Pancasila yang melambangkan keberanian adalah…",
    choices: ["Hitam", "Merah", "Emas", "Putih"],
    answer: 1
  }
];

let dynamicQuestionBank = [...DEFAULT_QUESTIONS];
let customTeamNames = { A: "Tim A", B: "Tim B" };
let isHostAuthenticated = false;

/* ═══════════════════════════════════════════════════════════
   🔐 HOST AUTHENTICATION GATE
   ═══════════════════════════════════════════════════════════ */
function toggleGatePassVisibility() {
  const input = document.getElementById('admin-gate-pass');
  if (input) input.type = input.type === 'password' ? 'text' : 'password';
}

function submitAdminGatePass() {
  const input = document.getElementById('admin-gate-pass');
  const err = document.getElementById('admin-gate-error');
  const val = (input ? input.value : '').trim().toUpperCase();

  if (val === hostMasterPassword.trim().toUpperCase()) {
    isHostAuthenticated = true;
    if (window.Sound) Sound.play('start');
    document.getElementById('admin-auth-barrier').classList.remove('active');
    document.getElementById('admin-main-content').style.display = 'block';
    
    // Load initial data
    renderAdminQuestions();
    document.getElementById('admin-team-a-name').value = customTeamNames.A || "Tim A";
    document.getElementById('admin-team-b-name').value = customTeamNames.B || "Tim B";
    document.getElementById('admin-host-pass-new').value = hostMasterPassword;
  } else {
    if (window.Sound) Sound.play('wrong');
    if (err) err.textContent = '❌ Password Host salah! Coba lagi.';
    if (input) input.focus();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const barrier = document.getElementById('admin-auth-barrier');
    if (barrier && barrier.classList.contains('active')) {
      submitAdminGatePass();
    }
  }
});

/* ═══════════════════════════════════════════════════════════
   🗂️ TABS MANAGEMENT
   ═══════════════════════════════════════════════════════════ */
function switchAdminTab(tabName) {
  if (window.Sound) Sound.play('click');
  document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('active'));

  const btn = document.getElementById(`tab-btn-${tabName}`);
  const panel = document.getElementById(`tab-content-${tabName}`);
  if (btn) btn.classList.add('active');
  if (panel) panel.classList.add('active');

  if (tabName === 'history') {
    loadAdminHistory();
  }
}

/* ═══════════════════════════════════════════════════════════
   📚 QUESTION CRUD OPERATIONS
   ═══════════════════════════════════════════════════════════ */
function renderAdminQuestions(filter = '') {
  const listEl = document.getElementById('admin-questions-list');
  const countEl = document.getElementById('admin-q-count');
  if (!listEl) return;

  if (countEl) countEl.textContent = dynamicQuestionBank.length;

  const query = filter.toLowerCase().trim();
  listEl.innerHTML = '';

  let shownCount = 0;
  dynamicQuestionBank.forEach((item, idx) => {
    if (query && !item.q.toLowerCase().includes(query)) return;
    shownCount++;

    const card = document.createElement('div');
    card.className = 'admin-q-card';
    card.innerHTML = `
      <div class="admin-q-header">
        <div>
          <span class="admin-q-number">Soal #${idx + 1}</span>
          <h3 class="admin-q-title">${item.q}</h3>
        </div>
        <div class="admin-q-actions">
          <button class="btn-q-action btn-q-edit" onclick="openEditQuestionModal(${idx})">✏️ Edit</button>
          <button class="btn-q-action btn-q-delete" onclick="deleteQuestion(${idx})">🗑️ Hapus</button>
        </div>
      </div>
      <div class="admin-q-choices">
        ${item.choices.map((c, cIdx) => `
          <div class="admin-q-choice-item ${cIdx === item.answer ? 'is-correct' : ''}">
            <span class="choice-badge">${LABELS[cIdx]}</span>
            <span>${c} ${cIdx === item.answer ? '✓ (Kunci Benar)' : ''}</span>
          </div>
        `).join('')}
      </div>
    `;
    listEl.appendChild(card);
  });

  if (shownCount === 0) {
    listEl.innerHTML = `<div class="empty-state">Tidak ada soal yang cocok dengan "${filter}".</div>`;
  }
}

function filterAdminQuestions() {
  const searchInput = document.getElementById('admin-q-search');
  renderAdminQuestions(searchInput ? searchInput.value : '');
}

function openAddQuestionModal() {
  if (window.Sound) Sound.play('click');
  document.getElementById('qmodal-edit-index').value = '-1';
  document.getElementById('qmodal-title').textContent = 'Tambah Soal Baru';
  document.getElementById('qmodal-icon').textContent = '➕';
  document.getElementById('qmodal-question').value = '';
  document.getElementById('qmodal-choice-0').value = '';
  document.getElementById('qmodal-choice-1').value = '';
  document.getElementById('qmodal-choice-2').value = '';
  document.getElementById('qmodal-choice-3').value = '';
  document.getElementById('qmodal-radio-0').checked = true;
  document.getElementById('qmodal-error').textContent = '';

  document.getElementById('modal-question').classList.add('active');
}

function openEditQuestionModal(index) {
  if (window.Sound) Sound.play('click');
  const item = dynamicQuestionBank[index];
  if (!item) return;

  document.getElementById('qmodal-edit-index').value = index;
  document.getElementById('qmodal-title').textContent = `Edit Soal #${index + 1}`;
  document.getElementById('qmodal-icon').textContent = '✏️';
  document.getElementById('qmodal-question').value = item.q;
  document.getElementById('qmodal-choice-0').value = item.choices[0] || '';
  document.getElementById('qmodal-choice-1').value = item.choices[1] || '';
  document.getElementById('qmodal-choice-2').value = item.choices[2] || '';
  document.getElementById('qmodal-choice-3').value = item.choices[3] || '';
  
  const radio = document.getElementById(`qmodal-radio-${item.answer}`);
  if (radio) radio.checked = true;
  
  document.getElementById('qmodal-error').textContent = '';
  document.getElementById('modal-question').classList.add('active');
}

function closeQuestionModal() {
  document.getElementById('modal-question').classList.remove('active');
}

async function saveQuestionModal() {
  const editIdx = parseInt(document.getElementById('qmodal-edit-index').value);
  const qText = document.getElementById('qmodal-question').value.trim();
  const c0 = document.getElementById('qmodal-choice-0').value.trim();
  const c1 = document.getElementById('qmodal-choice-1').value.trim();
  const c2 = document.getElementById('qmodal-choice-2').value.trim();
  const c3 = document.getElementById('qmodal-choice-3').value.trim();
  const errEl = document.getElementById('qmodal-error');

  if (!qText || !c0 || !c1 || !c2 || !c3) {
    errEl.textContent = '⚠️ Harap isi pertanyaan dan semua 4 pilihan jawaban!';
    if (window.Sound) Sound.play('wrong');
    return;
  }

  const selectedRadio = document.querySelector('input[name="qmodal-correct"]:checked');
  const answerIdx = selectedRadio ? parseInt(selectedRadio.value) : 0;

  const newQuestionObj = {
    q: qText,
    choices: [c0, c1, c2, c3],
    answer: answerIdx
  };

  if (editIdx >= 0 && editIdx < dynamicQuestionBank.length) {
    dynamicQuestionBank[editIdx] = newQuestionObj;
  } else {
    dynamicQuestionBank.push(newQuestionObj);
  }

  try {
    await db.ref('admin/questions').set(dynamicQuestionBank);
    if (window.Sound) Sound.play('correct');
    closeQuestionModal();
    renderAdminQuestions();
  } catch (err) {
    errEl.textContent = '❌ Gagal menyimpan ke Firebase: ' + err.message;
  }
}

async function deleteQuestion(index) {
  if (dynamicQuestionBank.length <= 3) {
    alert('⚠️ Game membutuhkan minimal 3 soal!');
    return;
  }
  if (confirm(`Apakah Anda yakin ingin menghapus Soal #${index + 1}?`)) {
    dynamicQuestionBank.splice(index, 1);
    try {
      await db.ref('admin/questions').set(dynamicQuestionBank);
      if (window.Sound) Sound.play('correct');
      renderAdminQuestions();
    } catch (err) {
      alert('❌ Gagal menghapus: ' + err.message);
    }
  }
}

async function resetQuestionsToDefault() {
  if (confirm('Apakah Anda yakin ingin me-reset semua soal ke 20 Soal Standar Pancasila?')) {
    dynamicQuestionBank = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
    try {
      await db.ref('admin/questions').set(dynamicQuestionBank);
      if (window.Sound) Sound.play('victory');
      renderAdminQuestions();
      alert('✅ Bank soal berhasil di-reset ke 20 soal default!');
    } catch (err) {
      alert('❌ Gagal reset: ' + err.message);
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   🏷️ TEAM & PASSWORD SETTINGS
   ═══════════════════════════════════════════════════════════ */
async function saveAdminSettings() {
  const nameA = document.getElementById('admin-team-a-name').value.trim() || "Tim A";
  const nameB = document.getElementById('admin-team-b-name').value.trim() || "Tim B";
  const newPassInput = document.getElementById('admin-host-pass-new');
  const newPass = newPassInput ? newPassInput.value.trim() : "";
  const statusEl = document.getElementById('team-save-status');

  customTeamNames = { A: nameA, B: nameB };
  if (newPass) {
    hostMasterPassword = newPass;
  }

  try {
    await Promise.all([
      db.ref('admin/settings/teamNames').set(customTeamNames),
      newPass ? db.ref('admin/settings/hostPassword').set(newPass) : Promise.resolve()
    ]);
    if (window.Sound) Sound.play('correct');
    statusEl.textContent = '✅ Semua pengaturan berhasil disimpan!';
    setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
  } catch (err) {
    statusEl.textContent = '❌ Gagal menyimpan: ' + err.message;
  }
}

/* ═══════════════════════════════════════════════════════════
   📜 MATCH HISTORY LOGS
   ═══════════════════════════════════════════════════════════ */
async function loadAdminHistory() {
  const listEl = document.getElementById('admin-history-list');
  const countEl = document.getElementById('admin-hist-count');
  if (!listEl) return;

  listEl.innerHTML = '<div class="empty-state">⏳ Memuat riwayat pertandingan...</div>';

  try {
    const snap = await db.ref('history').limitToLast(50).get();
    if (!snap.exists()) {
      listEl.innerHTML = '<div class="empty-state">Belum ada riwayat pertandingan tercatat.</div>';
      if (countEl) countEl.textContent = '0';
      return;
    }

    const rawData = snap.val();
    const items = Object.keys(rawData).map(key => ({ id: key, ...rawData[key] })).reverse();
    if (countEl) countEl.textContent = items.length;

    listEl.innerHTML = '';
    items.forEach(h => {
      const dateStr = h.timestamp ? new Date(h.timestamp).toLocaleString('id-ID') : '-';
      const winnerBadge = h.winner === 'A'
        ? `<span class="hist-winner-badge hist-win-a">🏆 ${h.teamA || 'Tim A'} Menang</span>`
        : h.winner === 'B'
          ? `<span class="hist-winner-badge hist-win-b">🏆 ${h.teamB || 'Tim B'} Menang</span>`
          : `<span class="hist-winner-badge hist-win-draw">🤝 Seri</span>`;

      const card = document.createElement('div');
      card.className = 'hist-card';
      card.innerHTML = `
        <div class="hist-info">
          <span class="hist-room-code">Room: ${h.roomCode || '------'}</span>
          <span class="hist-time">📅 ${dateStr}</span>
        </div>
        <div class="hist-vs-box">
          <span class="hist-score hist-score-a">${h.scoreA ?? 0}</span>
          <span>vs</span>
          <span class="hist-score hist-score-b">${h.scoreB ?? 0}</span>
        </div>
        <div>
          ${winnerBadge}
        </div>
      `;
      listEl.appendChild(card);
    });

  } catch (err) {
    listEl.innerHTML = `<div class="empty-state">❌ Gagal memuat riwayat: ${err.message}</div>`;
  }
}

async function clearMatchHistory() {
  if (confirm('Hapus seluruh riwayat pertandingan? Tindakan ini permanen.')) {
    try {
      await db.ref('history').remove();
      if (window.Sound) Sound.play('correct');
      loadAdminHistory();
    } catch (err) {
      alert('❌ Gagal menghapus riwayat: ' + err.message);
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   🌐 SYNC INITIAL QUESTIONS & SETTINGS FROM FIREBASE
   ═══════════════════════════════════════════════════════════ */
async function initAdminSync() {
  try {
    // Sync Questions
    const qSnap = await db.ref('admin/questions').get();
    if (qSnap.exists()) {
      const data = qSnap.val();
      if (Array.isArray(data)) {
        dynamicQuestionBank = data;
      } else if (typeof data === 'object') {
        dynamicQuestionBank = Object.values(data);
      }
    } else {
      await db.ref('admin/questions').set(DEFAULT_QUESTIONS);
    }

    // Sync Team Names
    const teamSnap = await db.ref('admin/settings/teamNames').get();
    if (teamSnap.exists()) {
      customTeamNames = teamSnap.val();
    }

    // Sync Host Password
    const passSnap = await db.ref('admin/settings/hostPassword').get();
    if (passSnap.exists()) {
      hostMasterPassword = passSnap.val();
    }
  } catch (e) {
    console.warn('Firebase init sync warning (using defaults):', e);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  await initAdminSync();
  const passInput = document.getElementById('admin-gate-pass');
  if (passInput) passInput.focus();
});
