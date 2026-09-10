/* ============================================================
   TARIK TAMBANG QUIZ – script.js
   Multiplayer Online via Firebase Realtime Database
   With 5s Reading Phase, Turn Mechanics, Audio & Room Settings
   ============================================================ */

/* ═══════════════════════════════════════════════════════════
   🔥 FIREBASE CONFIGURATION
   ═══════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════
   🔐 HOST MASTER PASSWORD & QUESTION BANK
   ═══════════════════════════════════════════════════════════ */
let hostMasterPassword = "HOST123";
let pendingHostAction = null; // 'create-room' | 'admin'

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
const LABELS = ['A', 'B', 'C', 'D'];
const READING_DURATION = 5; // 5 seconds dedicated reading / preview phase

/* ═══════════════════════════════════════════════════════════
   🗃️ SESSION STATE
   ═══════════════════════════════════════════════════════════ */
let myRole = null;   // 'host' | 'player'
let myTeam = null;   // 'A' | 'B' (players only)
let roomCode = null;
let roomRef = null;
let selectedTeam = 'A';
let hasAnswered = false;
let localTimerInterval = null;
let isProcessing = false;
let answerWatcherRef = null;
let lastRenderedQ = -1;
let lastPhase = null;
let currentScreen = 'home';

/* ═══════════════════════════════════════════════════════════
   🧭 SCREEN NAVIGATION
   ═══════════════════════════════════════════════════════════ */
const ALL_SCREENS = [
  'home', 'create-room', 'host-lobby', 'join-room',
  'player-lobby', 'spectator', 'player-game', 'result'
];

let currentJoinRoomListener = null;

function showScreen(name) {
  if (name !== 'join-room' && currentJoinRoomListener) {
    currentJoinRoomListener.off();
    currentJoinRoomListener = null;
  }
  currentScreen = name;
  ALL_SCREENS.forEach(s => {
    const el = document.getElementById(`screen-${s}`);
    if (el) el.classList.toggle('active', s === name);
  });
}

function goToCreateRoom() {
  if (window.Sound) Sound.play('click');
  showScreen('create-room');
}

function goToJoinRoom() {
  if (window.Sound) Sound.play('click');
  resetTeamPickers();
  const joinInput = document.getElementById('join-code');
  if (joinInput) {
    joinInput.value = '';
  }
  const errEl = document.getElementById('join-error');
  if (errEl) errEl.textContent = '';
  showScreen('join-room');
}

function goHome() {
  if (window.Sound) Sound.play('click');
  stopLocalTimer();
  detachListeners();
  if (currentJoinRoomListener) {
    currentJoinRoomListener.off();
    currentJoinRoomListener = null;
  }
  myRole = myTeam = roomCode = roomRef = null;
  hasAnswered = isProcessing = false;
  lastRenderedQ = -1;
  lastPhase = null;
  stopConfetti();
  window.history.replaceState({}, '', window.location.pathname);
  showScreen('home');
}

/* ═══════════════════════════════════════════════════════════
   🔐 HOST PASSWORD MODAL
   ═══════════════════════════════════════════════════════════ */
function promptHostPassword(action) {
  if (window.Sound) Sound.play('click');
  pendingHostAction = action;
  const modal = document.getElementById('modal-host-password');
  const input = document.getElementById('input-host-pass');
  const err = document.getElementById('host-pass-error');
  
  if (err) err.textContent = '';
  if (input) {
    input.value = '';
    input.type = 'password';
  }
  if (modal) {
    modal.classList.add('active');
    setTimeout(() => input && input.focus(), 100);
  }
}

function closeHostPassModal() {
  const modal = document.getElementById('modal-host-password');
  if (modal) modal.classList.remove('active');
  pendingHostAction = null;
}

function togglePassVisibility() {
  const input = document.getElementById('input-host-pass');
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

function submitHostPassword() {
  const input = document.getElementById('input-host-pass');
  const err = document.getElementById('host-pass-error');
  const val = (input ? input.value : '').trim().toUpperCase();

  if (val === hostMasterPassword.trim().toUpperCase()) {
    if (window.Sound) Sound.play('start');
    const action = pendingHostAction;
    closeHostPassModal();
    if (action === 'create-room') {
      goToCreateRoom();
    }
  } else {
    if (window.Sound) Sound.play('wrong');
    if (err) err.textContent = '❌ Password Host salah!';
    if (input) input.focus();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const passModal = document.getElementById('modal-host-password');
    if (passModal && passModal.classList.contains('active')) {
      submitHostPassword();
    }
  }
});

/* ═══════════════════════════════════════════════════════════
   🎲 ROOM CODE GENERATOR
   ═══════════════════════════════════════════════════════════ */
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/* ═══════════════════════════════════════════════════════════
   🏠 CREATE ROOM (HOST)
   ═══════════════════════════════════════════════════════════ */
async function createRoom() {
  if (window.Sound) Sound.play('click');
  const btn = document.getElementById('btn-create-room');
  btn.disabled = true;
  btn.textContent = '⏳ Menyiapkan Room...';

  const code = generateCode();
  const qCountSetting = parseInt(document.getElementById('cr-q-count').value) || 10;
  const winTarget = Math.max(3, Math.min(10, parseInt(document.getElementById('cr-win-target').value) || 5));
  const totalTimer = Math.max(10, Math.min(30, parseInt(document.getElementById('cr-timer').value) || 15));

  const roomData = {
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    status: 'lobby',
    settings: {
      questionCount: qCountSetting,
      winTarget,
      timerDuration: totalTimer, // Total duration per question
      teamNames: {
        A: customTeamNames.A || "Tim A",
        B: customTeamNames.B || "Tim B"
      }
    },
    teams: {
      A: { joined: false },
      B: { joined: false }
    },
    game: null
  };

  try {
    await db.ref(`rooms/${code}`).set(roomData);
    roomCode = code;
    myRole = 'host';
    roomRef = db.ref(`rooms/${code}`);

    document.getElementById('host-room-code').textContent = code;
    const specBadge = document.getElementById('spec-room-badge');
    if (specBadge) specBadge.textContent = `Room: ${code}`;
    const base = window.location.origin + window.location.pathname;
    document.getElementById('link-team-a').value = `${base}?room=${code}&team=A`;
    document.getElementById('link-team-b').value = `${base}?room=${code}&team=B`;

    window.history.replaceState({}, '', `?room=${code}&role=host`);
    showScreen('host-lobby');
    listenToRoom(code);

    if (window.Sound) Sound.play('start');

  } catch (err) {
    alert('❌ Gagal membuat room: ' + err.message);
    btn.disabled = false;
    btn.textContent = '🚀 Buat Room Pertandingan';
  }
}

function copyLink(team) {
  if (window.Sound) Sound.play('click');
  const input = document.getElementById(`link-team-${team.toLowerCase()}`);
  const btn = document.getElementById(`copy-${team.toLowerCase()}`);
  navigator.clipboard.writeText(input.value).then(() => {
    btn.textContent = '✅ Disalin!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '📋 Copy';
      btn.classList.remove('copied');
    }, 2000);
  });
}

/* ═══════════════════════════════════════════════════════════
   🎮 JOIN ROOM & LIVE TEAM AVAILABILITY
   ═══════════════════════════════════════════════════════════ */
function resetTeamPickers() {
  const btnA = document.getElementById('pick-team-a');
  const btnB = document.getElementById('pick-team-b');
  const joinBtn = document.getElementById('btn-join-room');
  const errEl = document.getElementById('join-error');

  if (btnA) {
    btnA.disabled = false;
    btnA.classList.remove('occupied');
    btnA.innerHTML = `<span class="team-pick-emoji">🔴</span><span>Tim A</span>`;
  }
  if (btnB) {
    btnB.disabled = false;
    btnB.classList.remove('occupied');
    btnB.innerHTML = `<span class="team-pick-emoji">🔵</span><span>Tim B</span>`;
  }
  if (joinBtn) joinBtn.disabled = false;
  if (errEl && errEl.textContent.includes('penuh')) errEl.textContent = '';
}

function onJoinCodeInput(val) {
  const code = (val || '').trim().toUpperCase();
  const joinInput = document.getElementById('join-code');
  if (joinInput && joinInput.value !== code) {
    joinInput.value = code;
  }
  const errEl = document.getElementById('join-error');
  if (errEl) errEl.textContent = '';

  if (currentJoinRoomListener) {
    currentJoinRoomListener.off();
    currentJoinRoomListener = null;
  }

  if (code.length === 6) {
    checkTeamAvailability(code);
  } else {
    resetTeamPickers();
  }
}

function checkTeamAvailability(code) {
  if (currentJoinRoomListener) {
    currentJoinRoomListener.off();
  }

  currentJoinRoomListener = db.ref(`rooms/${code}`);
  currentJoinRoomListener.on('value', snap => {
    if (!snap.exists()) {
      resetTeamPickers();
      return;
    }

    const roomData = snap.val();
    const teams = roomData.teams || {};
    const aJoined = !!teams.A?.joined;
    const bJoined = !!teams.B?.joined;
    const nameA = roomData.settings?.teamNames?.A || 'Tim A';
    const nameB = roomData.settings?.teamNames?.B || 'Tim B';

    const btnA = document.getElementById('pick-team-a');
    const btnB = document.getElementById('pick-team-b');
    const errEl = document.getElementById('join-error');
    const joinBtn = document.getElementById('btn-join-room');

    if (btnA) {
      btnA.disabled = aJoined;
      btnA.classList.toggle('occupied', aJoined);
      btnA.innerHTML = aJoined
        ? `<span class="team-pick-emoji">🔴</span><span>${nameA}</span><span class="team-status-tag">⛔ Sudah Dipilih</span>`
        : `<span class="team-pick-emoji">🔴</span><span>${nameA}</span>`;
    }

    if (btnB) {
      btnB.disabled = bJoined;
      btnB.classList.toggle('occupied', bJoined);
      btnB.innerHTML = bJoined
        ? `<span class="team-pick-emoji">🔵</span><span>${nameB}</span><span class="team-status-tag">⛔ Sudah Dipilih</span>`
        : `<span class="team-pick-emoji">🔵</span><span>${nameB}</span>`;
    }

    if (aJoined && bJoined) {
      if (errEl) errEl.textContent = '⚠️ Room ini sudah penuh (kedua tim sudah terisi)!';
      if (joinBtn) joinBtn.disabled = true;
    } else {
      if (errEl && errEl.textContent.includes('penuh')) errEl.textContent = '';
      if (joinBtn) joinBtn.disabled = false;

      // Auto switch if currently selected team is occupied
      if (selectedTeam === 'A' && aJoined && !bJoined) {
        pickTeam('B');
      } else if (selectedTeam === 'B' && bJoined && !aJoined) {
        pickTeam('A');
      }
    }
  });
}

function pickTeam(team) {
  const btn = document.getElementById(`pick-team-${team.toLowerCase()}`);
  if (btn && btn.disabled) return;

  if (window.Sound) Sound.play('click');
  selectedTeam = team;
  document.getElementById('pick-team-a').classList.toggle('active', team === 'A');
  document.getElementById('pick-team-b').classList.toggle('active', team === 'B');
}

async function joinRoom() {
  if (window.Sound) Sound.play('click');
  const code = document.getElementById('join-code').value.trim().toUpperCase();
  const errEl = document.getElementById('join-error');
  errEl.textContent = '';

  if (code.length !== 6) {
    errEl.textContent = '⚠️ Kode room harus 6 huruf/angka.';
    return;
  }
  await joinRoomByCode(code, selectedTeam);
}

async function joinRoomByCode(code, team) {
  const errEl = document.getElementById('join-error');
  const joinBtn = document.getElementById('btn-join-room');
  if (joinBtn) { joinBtn.disabled = true; joinBtn.textContent = '⏳ Bergabung...'; }

  try {
    const snap = await db.ref(`rooms/${code}`).get();
    if (!snap.exists()) {
      errEl.textContent = '⚠️ Room tidak ditemukan. Periksa kembali kodenya.';
      if (joinBtn) { joinBtn.disabled = false; joinBtn.textContent = '🚀 Masuk Pertandingan'; }
      return;
    }

    const roomData = snap.val();
    if (roomData.status === 'finished') {
      errEl.textContent = '⚠️ Pertandingan room ini sudah selesai.';
      if (joinBtn) { joinBtn.disabled = false; joinBtn.textContent = '🚀 Masuk Pertandingan'; }
      return;
    }

    // Check if selected team is already taken by another player
    if (roomData.teams?.[team]?.joined) {
      const takenName = team === 'A'
        ? (roomData.settings?.teamNames?.A || 'Tim A')
        : (roomData.settings?.teamNames?.B || 'Tim B');
      errEl.textContent = `⚠️ ${takenName} sudah dipilih oleh pemain lain! Silakan pilih tim yang masih kosong.`;
      if (joinBtn) { joinBtn.disabled = false; joinBtn.textContent = '🚀 Masuk Pertandingan'; }
      // Update picker status immediately
      if (currentJoinRoomListener) {
        checkTeamAvailability(code);
      }
      return;
    }

    // Mark team as joined
    await db.ref(`rooms/${code}/teams/${team}/joined`).set(true);

    roomCode = code;
    myRole = 'player';
    myTeam = team;
    roomRef = db.ref(`rooms/${code}`);
    hasAnswered = false;
    lastRenderedQ = -1;
    lastPhase = null;

    const teamDisplayName = team === 'A' 
      ? (roomData.settings?.teamNames?.A || 'TIM A') + ' 🔴'
      : (roomData.settings?.teamNames?.B || 'TIM B') + ' 🔵';

    document.getElementById('pl-team-badge').textContent = teamDisplayName;
    document.getElementById('pl-team-badge').className = `pl-team-badge ${team === 'A' ? 'badge-a' : 'badge-b'}`;
    document.getElementById('pl-room-code').textContent = code;

    window.history.replaceState({}, '', `?room=${code}&team=${team}`);
    showScreen('player-lobby');
    listenToRoom(code);

    if (window.Sound) Sound.play('start');

    if (roomData.status === 'playing') {
      showScreen('player-game');
      document.getElementById('pg-team-badge').textContent = teamDisplayName;
      document.getElementById('pg-team-badge').className = `pg-team-badge ${team === 'A' ? 'team-a' : 'team-b'}`;
    }

  } catch (err) {
    errEl.textContent = '⚠️ Gagal bergabung: ' + err.message;
    if (joinBtn) { joinBtn.disabled = false; joinBtn.textContent = '🚀 Masuk Pertandingan'; }
  }
}

/* ═══════════════════════════════════════════════════════════
   📡 FIREBASE LISTENER (Host & Player sync)
   ═══════════════════════════════════════════════════════════ */
function listenToRoom(code) {
  detachListeners();
  roomRef = db.ref(`rooms/${code}`);
  roomRef.on('value', snap => {
    if (!snap.exists()) return;
    handleRoomUpdate(snap.val());
  });
}

function detachListeners() {
  if (roomRef) roomRef.off();
  if (answerWatcherRef) { answerWatcherRef.off(); answerWatcherRef = null; }
}

function handleRoomUpdate(data) {
  const { status, teams, game, settings } = data;

  syncTeamStatus(teams, settings);

  // Host Lobby button enable
  if (myRole === 'host' && currentScreen === 'host-lobby') {
    const bothJoined = teams?.A?.joined && teams?.B?.joined;
    const startBtn = document.getElementById('btn-host-start');
    const hintEl = document.getElementById('start-hint-text');
    if (startBtn) startBtn.disabled = !bothJoined;
    if (hintEl) {
      hintEl.textContent = bothJoined
        ? '✅ Kedua tim siap! Tekan Mulai Game Sekarang.'
        : 'Menunggu kedua tim bergabung...';
    }
  }

  // Active Game Status
  if (status === 'playing' && game) {
    if (myRole === 'host') {
      if (currentScreen !== 'spectator') {
        showScreen('spectator');
        setupHostAnswerWatcher();
      }
      updateSpectatorUI(game, settings);
    } else if (myRole === 'player') {
      const teamDisplayName = myTeam === 'A'
        ? (settings?.teamNames?.A || 'TIM A') + ' 🔴'
        : (settings?.teamNames?.B || 'TIM B') + ' 🔵';

      if (currentScreen === 'player-lobby' || currentScreen === 'join-room') {
        showScreen('player-game');
        document.getElementById('pg-team-badge').textContent = teamDisplayName;
        document.getElementById('pg-team-badge').className = `pg-team-badge ${myTeam === 'A' ? 'team-a' : 'team-b'}`;
      }
      if (currentScreen === 'player-game') {
        updatePlayerUI(game, settings);
      }
    }
  } else if (status === 'finished' && game) {
    stopLocalTimer();
    showResultScreen(game, settings);
  }
}

function syncTeamStatus(teams, settings) {
  const nameA = settings?.teamNames?.A || 'Tim A';
  const nameB = settings?.teamNames?.B || 'Tim B';

  const hsA = document.getElementById('host-status-a');
  const hsB = document.getElementById('host-status-b');
  if (hsA) {
    const j = teams?.A?.joined;
    hsA.querySelector('.ps-name').textContent = nameA;
    hsA.querySelector('.ps-icon').textContent = j ? '✅' : '⏳';
    hsA.querySelector('.ps-status').textContent = j ? 'Sudah bergabung!' : 'Menunggu...';
    hsA.classList.toggle('joined', !!j);
  }
  if (hsB) {
    const j = teams?.B?.joined;
    hsB.querySelector('.ps-name').textContent = nameB;
    hsB.querySelector('.ps-icon').textContent = j ? '✅' : '⏳';
    hsB.querySelector('.ps-status').textContent = j ? 'Sudah bergabung!' : 'Menunggu...';
    hsB.classList.toggle('joined', !!j);
  }

  const plA = document.getElementById('pl-status-a');
  const plB = document.getElementById('pl-status-b');
  if (plA) {
    plA.querySelector('.pl-player-name').textContent = nameA;
    plA.querySelector('.pl-player-icon').textContent = teams?.A?.joined ? '✅' : '⏳';
  }
  if (plB) {
    plB.querySelector('.pl-player-name').textContent = nameB;
    plB.querySelector('.pl-player-icon').textContent = teams?.B?.joined ? '✅' : '⏳';
  }
}

/* ═══════════════════════════════════════════════════════════
   ▶ HOST: START GAME
   ═══════════════════════════════════════════════════════════ */
async function hostStartGame() {
  if (!roomCode) return;
  const btn = document.getElementById('btn-host-start');
  btn.disabled = true;
  btn.textContent = '⏳ Memulai Pertandingan...';

  const settSnap = await db.ref(`rooms/${roomCode}/settings`).get();
  const settings = settSnap.val();

  // Pick question order according to question count limit
  const fullShuffled = shuffle([...Array(dynamicQuestionBank.length).keys()]);
  const maxQ = Math.min(settings.questionCount || 10, dynamicQuestionBank.length);
  const qOrder = fullShuffled.slice(0, maxQ);

  const answerDuration = Math.max(5, settings.timerDuration - READING_DURATION);

  const gameData = {
    questionOrder: qOrder,
    currentQ: 0,
    phase: 'reading', // 'reading' (5s) | 'answering' | 'review'
    readingTimeLeft: READING_DURATION,
    answeringTimeLeft: answerDuration,
    ropePos: 0,
    scoreA: 0,
    scoreB: 0,
    totalTimeA: 0,
    answerCountA: 0,
    totalTimeB: 0,
    answerCountB: 0,
    teamAStatus: 'waiting', // 'waiting' | 'wrong' | 'correct'
    teamBStatus: 'waiting',
    pendingAnswer: null,
    lastResult: null,
    winner: null,
    winReason: null
  };

  await db.ref(`rooms/${roomCode}`).update({ status: 'playing', game: gameData });

  showScreen('spectator');
  const specBadge = document.getElementById('spec-room-badge');
  if (specBadge) specBadge.textContent = `Room: ${roomCode}`;
  setupHostAnswerWatcher();

  if (window.Sound) {
    Sound.play('start');
    Sound.startBGM();
  }

  setTimeout(() => startTwoPhaseHostTimer(settings.timerDuration), 600);
}

/* ═══════════════════════════════════════════════════════════
   ⏱ TWO-PHASE HOST TIMER (5s Reading + Answering Phase)
   ═══════════════════════════════════════════════════════════ */
function startTwoPhaseHostTimer(totalDuration) {
  stopLocalTimer();

  let phase = 'reading';
  let readingLeft = READING_DURATION;
  let answeringLeft = Math.max(5, totalDuration - READING_DURATION);

  localTimerInterval = setInterval(async () => {
    if (phase === 'reading') {
      readingLeft--;
      if (readingLeft <= 0) {
        // Transition to answering phase
        phase = 'answering';
        if (window.Sound) Sound.play('go');
        await db.ref(`rooms/${roomCode}/game`).update({
          phase: 'answering',
          readingTimeLeft: 0,
          answeringTimeLeft: answeringLeft
        });
      } else {
        db.ref(`rooms/${roomCode}/game/readingTimeLeft`).set(readingLeft);
      }
    } else if (phase === 'answering') {
      answeringLeft--;
      if (answeringLeft <= 0) {
        // Time out
        stopLocalTimer();
        await handleTimeoutExpiration();
      } else {
        db.ref(`rooms/${roomCode}/game/answeringTimeLeft`).set(answeringLeft);
      }
    }
  }, 1000);
}

async function handleTimeoutExpiration() {
  const snap = await db.ref(`rooms/${roomCode}/game`).get();
  const game = snap.val();
  if (!game || game.phase === 'review') return;

  const qObj = dynamicQuestionBank[game.questionOrder?.[game.currentQ]];
  const lastResult = {
    type: 'timeout',
    message: `⏰ WAKTU HABIS!\nJawaban yang benar: ${LABELS[qObj?.answer]}`,
    correctIdx: qObj?.answer ?? -1
  };

  await db.ref(`rooms/${roomCode}/game`).update({
    phase: 'review',
    answeringTimeLeft: 0,
    lastResult: lastResult
  });

  setTimeout(() => advanceQuestion(), 2800);
}

function stopLocalTimer() {
  if (localTimerInterval) {
    clearInterval(localTimerInterval);
    localTimerInterval = null;
  }
}

/* ═══════════════════════════════════════════════════════════
   👁 HOST: ANSWER WATCHER
   ═══════════════════════════════════════════════════════════ */
function setupHostAnswerWatcher() {
  if (answerWatcherRef) answerWatcherRef.off();
  answerWatcherRef = db.ref(`rooms/${roomCode}/game/pendingAnswer`);
  answerWatcherRef.on('value', snap => {
    const answer = snap.val();
    if (answer && !isProcessing) {
      isProcessing = true;
      hostProcessAnswer(answer.team, answer.idx);
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   ⚡ TURN MECHANICS & WRONG ANSWER PENALTY
   - Correct: +1 score, pulls rope, ends question!
   - Wrong: Rope shifts 1 step to opponent (penalty), opponent can still answer!
   ═══════════════════════════════════════════════════════════ */
async function hostProcessAnswer(team, idx) {
  const snap = await db.ref(`rooms/${roomCode}/game`).get();
  const game = snap.val();
  const settSnap = await db.ref(`rooms/${roomCode}/settings`).get();
  const settings = settSnap.val();
  if (!game || !game.questionOrder) { isProcessing = false; return; }

  const qIdx = game.questionOrder[game.currentQ];
  const q = dynamicQuestionBank[qIdx];
  const isCorrect = (idx === q.answer);

  let scoreA = game.scoreA ?? 0;
  let scoreB = game.scoreB ?? 0;
  let ropePos = game.ropePos ?? 0;
  let teamAStatus = game.teamAStatus ?? 'waiting';
  let teamBStatus = game.teamBStatus ?? 'waiting';

  // Calculate answering response time
  const maxAnswerTime = Math.max(5, settings.timerDuration - READING_DURATION);
  const currentLeft = game.answeringTimeLeft ?? maxAnswerTime;
  const timeSpent = Math.max(0.5, maxAnswerTime - currentLeft);

  let totalTimeA = game.totalTimeA ?? 0;
  let answerCountA = game.answerCountA ?? 0;
  let totalTimeB = game.totalTimeB ?? 0;
  let answerCountB = game.answerCountB ?? 0;

  if (team === 'A') {
    totalTimeA += timeSpent;
    answerCountA++;
  } else {
    totalTimeB += timeSpent;
    answerCountB++;
  }

  const otherTeam = (team === 'A' ? 'B' : 'A');
  const nameA = settings?.teamNames?.A || 'Tim A';
  const nameB = settings?.teamNames?.B || 'Tim B';
  const answeredTeamName = team === 'A' ? nameA : nameB;
  const opponentTeamName = otherTeam === 'A' ? nameA : nameB;

  if (isCorrect) {
    // CORRECT: Team gets point + pulls rope
    if (team === 'A') { scoreA++; ropePos--; teamAStatus = 'correct'; }
    else { scoreB++; ropePos++; teamBStatus = 'correct'; }

    stopLocalTimer();

    const winTarget = settings.winTarget;
    let winner = null;
    let winReason = null;
    if (ropePos <= -winTarget) { winner = 'A'; winReason = 'knockout'; }
    if (ropePos >= winTarget) { winner = 'B'; winReason = 'knockout'; }

    const lastResult = {
      type: 'correct',
      team,
      idx,
      correctIdx: q.answer,
      message: `✅ BENAR!\n${answeredTeamName} mendapat +1 poin & menarik tali!`,
      winner
    };

    await db.ref(`rooms/${roomCode}/game`).update({
      phase: 'review',
      scoreA,
      scoreB,
      totalTimeA,
      answerCountA,
      totalTimeB,
      answerCountB,
      ropePos,
      teamAStatus,
      teamBStatus,
      lastResult,
      pendingAnswer: null
    });

    if (winner) {
      setTimeout(() => endGameOnFirebase(winner, scoreA, scoreB, settings, winReason, totalTimeA, answerCountA, totalTimeB, answerCountB), 2800);
    } else {
      setTimeout(() => advanceQuestion(), 2600);
    }

  } else {
    // WRONG: Tambang TETAP (tidak bergerak). Hanya ubah status tim menjadi 'wrong'
    if (team === 'A') {
      teamAStatus = 'wrong';
    } else {
      teamBStatus = 'wrong';
    }

    const bothWrong = (teamAStatus === 'wrong' && teamBStatus === 'wrong');

    if (bothWrong) {
      stopLocalTimer();

      const lastResult = {
        type: 'wrong',
        team,
        idx,
        correctIdx: q.answer,
        message: `❌ KEDUA TIM SALAH!\nSoal lanjut ke nomor berikutnya.\nKunci: ${LABELS[q.answer]}`
      };

      await db.ref(`rooms/${roomCode}/game`).update({
        phase: 'review',
        totalTimeA,
        answerCountA,
        totalTimeB,
        answerCountB,
        ropePos,
        teamAStatus,
        teamBStatus,
        lastResult,
        pendingAnswer: null
      });

      setTimeout(() => advanceQuestion(), 2800);

    } else {
      // One team wrong, opponent STILL HAS A CHANCE! Tambang tetap tidak berpindah.
      const lastResult = {
        type: 'turn_chance',
        team,
        idx,
        correctIdx: q.answer,
        message: `❌ ${answeredTeamName} SALAH!\nKesempatan untuk ${opponentTeamName} menjawab!`
      };

      await db.ref(`rooms/${roomCode}/game`).update({
        totalTimeA,
        answerCountA,
        totalTimeB,
        answerCountB,
        ropePos,
        teamAStatus,
        teamBStatus,
        lastResult,
        pendingAnswer: null
      });

      isProcessing = false; // Allow second team to answer
    }
  }
}

async function advanceQuestion() {
  const snap = await db.ref(`rooms/${roomCode}/game`).get();
  const game = snap.val();
  if (!game) return;

  const settSnap = await db.ref(`rooms/${roomCode}/settings`).get();
  const settings = settSnap.val();
  const nextQ = game.currentQ + 1;

  if (nextQ >= (game.questionOrder?.length ?? 0)) {
    // All questions finished! Decide winner (Points OR Speed Tiebreaker)
    let winner = null;
    let winReason = null;
    const scoreA = game.scoreA ?? 0;
    const scoreB = game.scoreB ?? 0;

    const avgA = (game.answerCountA > 0) ? (game.totalTimeA / game.answerCountA) : 999;
    const avgB = (game.answerCountB > 0) ? (game.totalTimeB / game.answerCountB) : 999;

    if (scoreA > scoreB) {
      winner = 'A';
      winReason = 'points';
    } else if (scoreB > scoreA) {
      winner = 'B';
      winReason = 'points';
    } else {
      // SCORE IS TIED! SPEED TIEBREAKER:
      if (avgA < avgB) {
        winner = 'A';
        winReason = 'speed_tiebreaker';
      } else if (avgB < avgA) {
        winner = 'B';
        winReason = 'speed_tiebreaker';
      } else {
        winner = 'draw';
        winReason = 'draw';
      }
    }

    endGameOnFirebase(winner, scoreA, scoreB, settings, winReason, game.totalTimeA, game.answerCountA, game.totalTimeB, game.answerCountB);
    return;
  }

  const answerDuration = Math.max(5, settings.timerDuration - READING_DURATION);

  await db.ref(`rooms/${roomCode}/game`).update({
    currentQ: nextQ,
    phase: 'reading',
    readingTimeLeft: READING_DURATION,
    answeringTimeLeft: answerDuration,
    teamAStatus: 'waiting',
    teamBStatus: 'waiting',
    pendingAnswer: null,
    lastResult: null
  });

  isProcessing = false;
  hasAnswered = false;
  startTwoPhaseHostTimer(settings.timerDuration);
}

async function endGameOnFirebase(winner, scoreA, scoreB, settings, winReason = 'points', totalTimeA = 0, countA = 0, totalTimeB = 0, countB = 0) {
  stopLocalTimer();
  
  const avgA = countA > 0 ? (totalTimeA / countA) : 0;
  const avgB = countB > 0 ? (totalTimeB / countB) : 0;

  await db.ref(`rooms/${roomCode}`).update({
    status: 'finished',
    'game/winner': winner,
    'game/winReason': winReason,
    'game/scoreA': scoreA,
    'game/scoreB': scoreB,
    'game/avgSpeedA': avgA,
    'game/avgSpeedB': avgB,
  });

  try {
    const nameA = settings?.teamNames?.A || 'Tim A';
    const nameB = settings?.teamNames?.B || 'Tim B';
    await db.ref('history').push({
      roomCode: roomCode,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      teamA: nameA,
      teamB: nameB,
      scoreA: scoreA,
      scoreB: scoreB,
      winner: winner,
      winReason: winReason,
      avgSpeedA: avgA.toFixed(1),
      avgSpeedB: avgB.toFixed(1)
    });
  } catch (err) {
    console.error('History log error:', err);
  }
}

/* ═══════════════════════════════════════════════════════════
   🖥 SPECTATOR UI (Host Arena)
   ═══════════════════════════════════════════════════════════ */
function updateSpectatorUI(game, settings) {
  const nameA = settings?.teamNames?.A || 'Tim A';
  const nameB = settings?.teamNames?.B || 'Tim B';

  document.getElementById('spec-team-name-a').textContent = `${nameA.toUpperCase()} 🔴`;
  document.getElementById('spec-team-name-b').textContent = `${nameB.toUpperCase()} 🔵`;
  document.getElementById('spec-rope-label-a').textContent = `← ${nameA}`;
  document.getElementById('spec-rope-label-b').textContent = `${nameB} →`;
  document.getElementById('spec-char-label-a').textContent = nameA;
  document.getElementById('spec-char-label-b').textContent = nameB;

  document.getElementById('spec-score-a').textContent = game.scoreA ?? 0;
  document.getElementById('spec-score-b').textContent = game.scoreB ?? 0;

  const totalQ = game.questionOrder?.length ?? 10;
  document.getElementById('spec-counter').textContent = `Soal ${(game.currentQ ?? 0) + 1} / ${totalQ}`;
  document.getElementById('spec-q-number').textContent = `Soal ${(game.currentQ ?? 0) + 1}`;

  // Phase & Timer Ring
  const phaseBadge = document.getElementById('spec-phase-badge');
  const timerArc = document.getElementById('spec-timer-arc');
  const timerText = document.getElementById('spec-timer-text');

  if (game.phase === 'reading') {
    const rLeft = game.readingTimeLeft ?? READING_DURATION;
    phaseBadge.textContent = `📖 WAKTU MEMBACA SOAL (${rLeft}s)`;
    phaseBadge.className = 'phase-indicator-badge reading';
    timerText.textContent = rLeft;
    timerArc.className = 'timer-arc reading-phase';
    timerArc.style.strokeDashoffset = 163.36 * (1 - rLeft / READING_DURATION);
  } else {
    const aLeft = game.answeringTimeLeft ?? (settings.timerDuration - READING_DURATION);
    const maxA = Math.max(5, settings.timerDuration - READING_DURATION);
    phaseBadge.textContent = `⚡ WAKTU MENJAWAB! (${aLeft}s)`;
    phaseBadge.className = 'phase-indicator-badge answering';
    timerText.textContent = aLeft;
    timerArc.className = `timer-arc ${aLeft <= 4 ? 'urgent' : ''}`;
    timerArc.style.strokeDashoffset = 163.36 * (1 - aLeft / maxA);
  }

  // Question & Choices
  if (game.questionOrder) {
    const qIdx = game.questionOrder[game.currentQ];
    const q = dynamicQuestionBank[qIdx];
    if (q) {
      document.getElementById('spec-q-text').textContent = q.q;

      if (lastRenderedQ !== game.currentQ || lastPhase !== game.phase) {
        lastRenderedQ = game.currentQ;
        lastPhase = game.phase;
        renderSpecChoices(q.choices, game.phase);
      }

      if (game.lastResult) {
        applySpecChoiceResult(game.lastResult, q.answer);
      }
    }
  }

  // Rope Knot & Pull Animations
  updateRopeKnot('spec-rope-knot', game.ropePos ?? 0, settings.winTarget);

  // Status Bar
  updateSpecStatusBar(game, settings);

  // Feedback Overlay
  if (game.lastResult && game.phase === 'review') {
    showSpecFeedback(game.lastResult);
  } else {
    hideSpecFeedback();
  }
}

function renderSpecChoices(choices, phase) {
  const grid = document.getElementById('spec-choices-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (phase === 'reading') {
    grid.innerHTML = `
      <div class="choices-locked-overlay">
        <span class="lock-icon">🔒</span>
        <div class="lock-title">Pilihan Jawaban Segera Terbuka...</div>
        <div class="lock-desc">Gunakan 5 detik ini untuk membaca soal dengan seksama!</div>
      </div>
    `;
    return;
  }

  choices.forEach((text, i) => {
    const div = document.createElement('div');
    div.className = 'choice-btn spec-choice';
    div.id = `spec-choice-${i}`;
    div.innerHTML = `<span class="choice-label">${LABELS[i]}</span><span class="choice-text">${text}</span>`;
    grid.appendChild(div);
  });
}

function applySpecChoiceResult(lastResult, correctIdx) {
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`spec-choice-${i}`);
    if (!btn) continue;
    if (i === correctIdx) btn.classList.add('correct');
    if (i === lastResult.idx && i !== correctIdx) btn.classList.add('wrong');
  }
}

function updateSpecStatusBar(game, settings) {
  const bar = document.getElementById('spec-status-bar');
  if (!bar) return;
  const nameA = settings?.teamNames?.A || 'Tim A';
  const nameB = settings?.teamNames?.B || 'Tim B';

  if (game.phase === 'reading') {
    bar.textContent = '📖 Fase membaca soal... Pilihan jawaban akan terbuka sebentar lagi.';
    bar.className = 'status-bar';
  } else if (game.lastResult?.type === 'turn_chance') {
    const wrongTeam = game.lastResult.team === 'A' ? nameA : nameB;
    const chanceTeam = game.lastResult.team === 'A' ? nameB : nameA;
    bar.textContent = `⚡ ${wrongTeam} salah! Kesempatan untuk ${chanceTeam} menjawab!`;
    bar.className = 'status-bar status-turn-chance';
  } else if (game.lastResult?.type === 'correct') {
    const winTeam = game.lastResult.team === 'A' ? nameA : nameB;
    bar.textContent = `✅ ${winTeam} BENAR! (+1 Poin & menarik tali)`;
    bar.className = `status-bar ${game.lastResult.team === 'A' ? 'status-a' : 'status-b'}`;
  } else if (game.lastResult?.type === 'timeout') {
    bar.textContent = '⏰ Waktu habis! Tidak ada tim yang berhasil menjawab.';
    bar.className = 'status-bar';
  } else {
    bar.textContent = '⚡ Waktu menjawab! Tim mana yang paling cepat & tepat?';
    bar.className = 'status-bar';
  }
}

let lastProcessedResultKey = null;

function showSpecFeedback(result) {
  const overlay = document.getElementById('spec-feedback-overlay');
  const content = document.getElementById('spec-feedback-content');
  if (!overlay || !content) return;
  content.className = `feedback-content feedback-${result.type}`;
  content.innerHTML = (result.message || '').replace(/\n/g, '<br>');
  overlay.classList.add('show');
}

function hideSpecFeedback() {
  document.getElementById('spec-feedback-overlay')?.classList.remove('show');
}

function showPlayerFeedback(game, settings, q) {
  const overlay = document.getElementById('pg-feedback-overlay');
  const content = document.getElementById('pg-feedback-content');
  if (!overlay || !content) return;

  const result = game.lastResult;
  if (!result) {
    hidePlayerFeedback();
    return;
  }

  const resultKey = `${game.currentQ}_${result.type}_${result.team}_${result.idx}`;
  const isNewResult = (lastProcessedResultKey !== resultKey);
  lastProcessedResultKey = resultKey;

  const myAnswered = (result.team === myTeam);
  const nameA = settings?.teamNames?.A || 'Tim A';
  const nameB = settings?.teamNames?.B || 'Tim B';
  const myTeamName = myTeam === 'A' ? nameA : nameB;
  const oppTeamName = myTeam === 'A' ? nameB : nameA;

  let title = '';
  let sub = '';
  let typeClass = 'feedback-wrong';

  if (result.type === 'correct') {
    if (myAnswered) {
      typeClass = 'feedback-correct';
      title = '🎉 JAWABAN BENAR!';
      sub = `Hebat! ${myTeamName} mendapat +1 poin & menarik tali!`;
      if (isNewResult && window.Sound) Sound.play('correct');
    } else {
      typeClass = 'feedback-wrong';
      title = '⚡ LAWAN BENAR!';
      sub = `${oppTeamName} berhasil menjawab dengan benar & menarik tali.`;
      if (isNewResult && window.Sound) Sound.play('wrong');
    }
  } else if (result.type === 'turn_chance') {
    if (myAnswered) {
      typeClass = 'feedback-wrong';
      title = '❌ JAWABAN KAMU SALAH!';
      sub = `<span style="color:#ffd32a; font-size:1.1em; display:inline-block; margin-top:6px;">⏳ Tunggu tim lawan menjawab...</span>`;
      if (isNewResult && window.Sound) Sound.play('wrong');
    } else {
      typeClass = 'feedback-correct';
      title = '⚡ LAWAN SALAH!';
      sub = `<span style="color:#10b981; font-size:1.1em; display:inline-block; margin-top:6px;">🎯 Giliran tim kamu menjawab sekarang!</span>`;
      if (isNewResult && window.Sound) Sound.play('go');
      setTimeout(() => hidePlayerFeedback(), 2000);
    }
  } else if (result.type === 'wrong') {
    typeClass = 'feedback-wrong';
    if (myAnswered) {
      title = '❌ JAWABAN SALAH!';
      sub = `Jawaban yang benar: <strong>${LABELS[q?.answer]}</strong>`;
    } else {
      title = '❌ KEDUA TIM SALAH!';
      sub = `Jawaban yang benar: <strong>${LABELS[q?.answer]}</strong>`;
    }
    if (isNewResult && window.Sound) Sound.play('wrong');
  } else if (result.type === 'timeout') {
    typeClass = 'feedback-wrong';
    title = '⏰ WAKTU HABIS!';
    sub = `Jawaban yang benar: <strong>${LABELS[q?.answer]}</strong>`;
  }

  content.className = `feedback-content ${typeClass}`;
  content.innerHTML = `<div style="font-size:1.25em; margin-bottom:8px;">${title}</div><div style="font-size:0.95em;">${sub}</div>`;
  overlay.classList.add('show');
}

function hidePlayerFeedback() {
  document.getElementById('pg-feedback-overlay')?.classList.remove('show');
}

/* ═══════════════════════════════════════════════════════════
   📱 PLAYER GAME UI
   ═══════════════════════════════════════════════════════════ */
function updatePlayerUI(game, settings) {
  if (!game.questionOrder) return;

  const qIdx = game.questionOrder[game.currentQ];
  const q = dynamicQuestionBank[qIdx];
  if (!q) return;

  // Counter
  const totalQ = game.questionOrder.length;
  document.getElementById('pg-counter').textContent = `Soal ${(game.currentQ ?? 0) + 1}/${totalQ}`;

  // Phase & Timer Ring
  const phaseBadge = document.getElementById('pg-phase-badge');
  const timerArc = document.getElementById('pg-timer-arc');
  const timerText = document.getElementById('pg-timer-text');

  if (game.phase === 'reading') {
    hidePlayerFeedback();
    const rLeft = game.readingTimeLeft ?? READING_DURATION;
    phaseBadge.textContent = `📖 BACA SOAL (${rLeft}s)`;
    phaseBadge.className = 'phase-indicator-badge reading';
    timerText.textContent = rLeft;
    timerArc.className = 'timer-arc reading-phase';
    timerArc.style.strokeDashoffset = 163.36 * (1 - rLeft / READING_DURATION);
  } else {
    const aLeft = game.answeringTimeLeft ?? (settings.timerDuration - READING_DURATION);
    const maxA = Math.max(5, settings.timerDuration - READING_DURATION);
    phaseBadge.textContent = `⚡ WAKTU JAWAB! (${aLeft}s)`;
    phaseBadge.className = 'phase-indicator-badge answering';
    timerText.textContent = aLeft;
    timerArc.className = `timer-arc ${aLeft <= 4 ? 'urgent' : ''}`;
    timerArc.style.strokeDashoffset = 163.36 * (1 - aLeft / maxA);
  }

  // Question & Choices Re-render
  if (lastRenderedQ !== game.currentQ || lastPhase !== game.phase) {
    lastRenderedQ = game.currentQ;
    lastPhase = game.phase;
    hasAnswered = false;
    hidePlayerFeedback();
    document.getElementById('pg-q-text').textContent = q.q;
    renderPlayerChoices(q.choices, game.phase, game);
  }

  // Player Feedback Popups
  if (game.lastResult) {
    showPlayerFeedback(game, settings, q);
  } else if (game.phase === 'reading' || game.phase === 'answering') {
    if (!game.lastResult) hidePlayerFeedback();
  }

  // Lock team choices if this team already answered wrong
  const myStatus = myTeam === 'A' ? game.teamAStatus : game.teamBStatus;
  if (myStatus === 'wrong' && game.phase === 'answering') {
    document.querySelectorAll('.pg-choice-btn').forEach(b => b.disabled = true);
    const bar = document.getElementById('pg-status-bar');
    bar.textContent = '❌ Jawaban kamu salah! Menunggu tim lawan menjawab...';
    bar.className = 'pg-status pg-wrong';
  } else if (game.lastResult?.type === 'turn_chance' && myStatus === 'waiting') {
    const bar = document.getElementById('pg-status-bar');
    bar.textContent = '⚡ Tim lawan salah! Sekarang giliran kamu menjawab!';
    bar.className = 'pg-status pg-correct';
  }
}

function renderPlayerChoices(choices, phase, game) {
  const grid = document.getElementById('pg-choices-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (phase === 'reading') {
    grid.innerHTML = `
      <div class="choices-locked-overlay">
        <span class="lock-icon">🔒</span>
        <div class="lock-title">Persiapan Membaca Soal</div>
        <div class="lock-desc">Pilihan jawaban akan terbuka otomatis setelah 5 detik!</div>
      </div>
    `;
    document.getElementById('pg-status-bar').textContent = '📖 Baca soal dengan seksama...';
    document.getElementById('pg-status-bar').className = 'pg-status';
    return;
  }

  const myStatus = myTeam === 'A' ? game.teamAStatus : game.teamBStatus;
  const isLocked = myStatus === 'wrong';

  choices.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'pg-choice-btn';
    btn.id = `pg-choice-${i}`;
    btn.dataset.idx = i;
    btn.innerHTML = `<span class="pg-choice-label">${LABELS[i]}</span><span class="pg-choice-text">${text}</span>`;
    
    if (isLocked) {
      btn.disabled = true;
    } else {
      btn.addEventListener('click', () => submitAnswer(i));
    }
    grid.appendChild(btn);
  });

  document.getElementById('pg-status-bar').textContent = isLocked ? '❌ Terkunci' : '⚡ Pilih jawaban sekarang!';
  document.getElementById('pg-status-bar').className = 'pg-status';
}

/* ═══════════════════════════════════════════════════════════
   📤 PLAYER: SUBMIT ANSWER
   ═══════════════════════════════════════════════════════════ */
function submitAnswer(idx) {
  if (hasAnswered || !roomCode || myRole !== 'player') return;
  if (window.Sound) Sound.play('click');
  hasAnswered = true;

  document.querySelectorAll('.pg-choice-btn').forEach(b => b.disabled = true);
  const selBtn = document.getElementById(`pg-choice-${idx}`);
  if (selBtn) selBtn.classList.add('selected-pending');

  db.ref(`rooms/${roomCode}/game/pendingAnswer`).set({
    team: myTeam,
    idx: idx
  }).catch(err => {
    console.error('Submit answer error:', err);
    hasAnswered = false;
  });
}

/* ═══════════════════════════════════════════════════════════
   🏆 RESULT SCREEN
   ═══════════════════════════════════════════════════════════ */
function showResultScreen(game, settings) {
  stopLocalTimer();

  const scoreA = game.scoreA ?? 0;
  const scoreB = game.scoreB ?? 0;
  const winner = game.winner;
  const winReason = game.winReason;
  const nameA = settings?.teamNames?.A || 'Tim A';
  const nameB = settings?.teamNames?.B || 'Tim B';

  const avgSpeedA = (game.avgSpeedA !== undefined) 
    ? Number(game.avgSpeedA)
    : (game.answerCountA > 0 ? (game.totalTimeA / game.answerCountA) : 0);
  const avgSpeedB = (game.avgSpeedB !== undefined)
    ? Number(game.avgSpeedB)
    : (game.answerCountB > 0 ? (game.totalTimeB / game.answerCountB) : 0);

  const trophy = document.getElementById('result-trophy');
  const title = document.getElementById('result-title');
  const sub = document.getElementById('result-subtitle');

  document.getElementById('final-name-a').textContent = `${nameA.toUpperCase()} 🔴`;
  document.getElementById('final-name-b').textContent = `${nameB.toUpperCase()} 🔵`;
  document.getElementById('final-score-a').textContent = scoreA;
  document.getElementById('final-score-b').textContent = scoreB;

  const speedAEl = document.getElementById('final-speed-a');
  const speedBEl = document.getElementById('final-speed-b');
  if (speedAEl) speedAEl.textContent = `⚡ Rata-rata: ${avgSpeedA > 0 ? avgSpeedA.toFixed(1) + 's' : '-'}`;
  if (speedBEl) speedBEl.textContent = `⚡ Rata-rata: ${avgSpeedB > 0 ? avgSpeedB.toFixed(1) + 's' : '-'}`;

  if (myRole === 'player') {
    // 📱 PLAYER VIEW
    if (winner === 'draw') {
      trophy.textContent = '🤝';
      title.textContent = '🤝 PERTANDINGAN SERI!';
      sub.textContent = `Pertandingan berakhir imbang (${scoreA} - ${scoreB})!`;
    } else if (winner === myTeam) {
      trophy.textContent = '🏆';
      title.textContent = '🎉 TIM ANDA MENANG!';
      if (winReason === 'speed_tiebreaker') {
        sub.textContent = `Luar biasa! Skor imbang (${scoreA} - ${scoreB}), namun Tim Anda menang karena kecepatan menjawab lebih unggul!`;
      } else if (winReason === 'knockout') {
        sub.textContent = `Hebat sekali! Tim Anda berhasil menarik tali melewati batas garis kemenangan!`;
      } else {
        sub.textContent = `Selamat! Tim Anda berhasil mengalahkan lawan dan memenangkan pertandingan!`;
      }
      if (window.Sound) Sound.play('victory');
      launchConfetti();
    } else {
      trophy.textContent = '😢';
      title.textContent = '😢 TIM ANDA KALAH';
      if (winReason === 'speed_tiebreaker') {
        sub.textContent = `Skor imbang (${scoreA} - ${scoreB}), namun tim lawan memiliki kecepatan menjawab lebih cepat.`;
      } else if (winReason === 'knockout') {
        sub.textContent = `Tim lawan berhasil menarik tali melewati garis batas. Tetap semangat!`;
      } else {
        sub.textContent = `Jangan berkecil hati! Tingkatkan kekompakan dan kecepatan di pertandingan berikutnya!`;
      }
      if (window.Sound) Sound.play('wrong');
    }
  } else {
    // 🖥️ HOST / SPECTATOR VIEW
    if (winner === 'A') {
      trophy.textContent = '🏆';
      title.textContent = `🔴 ${nameA.toUpperCase()} MENANG!`;
      if (winReason === 'speed_tiebreaker') {
        sub.textContent = `Skor imbang ${scoreA} - ${scoreB}! ${nameA} menang karena lebih cepat menjawab (${avgSpeedA.toFixed(1)}s vs ${avgSpeedB.toFixed(1)}s)!`;
      } else if (winReason === 'knockout') {
        sub.textContent = `Luar biasa! ${nameA} berhasil menarik tali melewati garis kemenangan!`;
      } else {
        sub.textContent = `Selamat! ${nameA} berhasil memenangkan pertandingan (${scoreA} vs ${scoreB})!`;
      }
      if (window.Sound) Sound.play('victory');
      launchConfetti();
    } else if (winner === 'B') {
      trophy.textContent = '🏆';
      title.textContent = `🔵 ${nameB.toUpperCase()} MENANG!`;
      if (winReason === 'speed_tiebreaker') {
        sub.textContent = `Skor imbang ${scoreA} - ${scoreB}! ${nameB} menang karena lebih cepat menjawab (${avgSpeedB.toFixed(1)}s vs ${avgSpeedA.toFixed(1)}s)!`;
      } else if (winReason === 'knockout') {
        sub.textContent = `Luar biasa! ${nameB} berhasil menarik tali melewati garis kemenangan!`;
      } else {
        sub.textContent = `Selamat! ${nameB} berhasil memenangkan pertandingan (${scoreB} vs ${scoreA})!`;
      }
      if (window.Sound) Sound.play('victory');
      launchConfetti();
    } else {
      trophy.textContent = '🤝';
      title.textContent = '🤝 PERTANDINGAN SERI!';
      sub.textContent = `Kedua tim memiliki skor dan kecepatan yang sama kuat (${scoreA} - ${scoreB})!`;
    }
  }

  document.getElementById('btn-play-again').style.display = myRole === 'host' ? '' : 'none';
  showScreen('result');
}

async function playAgain() {
  if (myRole !== 'host') return;
  if (window.Sound) Sound.play('click');
  isProcessing = false;
  hasAnswered = false;
  lastRenderedQ = -1;
  lastPhase = null;
  stopConfetti();
  stopLocalTimer();

  await db.ref(`rooms/${roomCode}`).update({
    status: 'lobby',
    game: null,
    'teams/A/joined': true,
    'teams/B/joined': true,
  });

  showScreen('host-lobby');
  document.getElementById('host-room-code').textContent = roomCode;
  document.getElementById('btn-host-start').disabled = false;
  document.getElementById('start-hint-text').textContent = '✅ Kedua tim siap! Tekan Mulai Game Sekarang.';
  listenToRoom(roomCode);
}

/* ═══════════════════════════════════════════════════════════
   🪢 ROPE KNOT POSITION & CARTOON PULLERS
   ═══════════════════════════════════════════════════════════ */
function updateRopeKnot(id, ropePos, winTarget) {
  const knot = document.getElementById(id);
  if (!knot) return;
  const max = winTarget ?? 5;
  const pct = (ropePos + max) / (max * 2);
  const clamped = Math.max(0, Math.min(1, pct));
  knot.style.left = `${clamped * 100}%`;

  // Animate pulling cartoon squads
  const squadA = document.getElementById('squad-a');
  const squadB = document.getElementById('squad-b');
  if (squadA && squadB) {
    squadA.classList.remove('pulling-lead', 'pulling-struggle');
    squadB.classList.remove('pulling-lead', 'pulling-struggle');
    if (ropePos < 0) {
      squadA.classList.add('pulling-lead');
      squadB.classList.add('pulling-struggle');
    } else if (ropePos > 0) {
      squadB.classList.add('pulling-lead');
      squadA.classList.add('pulling-struggle');
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   🎉 CONFETTI ENGINE
   ═══════════════════════════════════════════════════════════ */
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiAnimId = null;

function launchConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiParticles = [];
  const colors = ['#ff4757', '#2f9ceb', '#ffd700', '#2ecc71', '#ff9f43', '#a29bfe', '#fd79a8'];
  for (let i = 0; i < 200; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      r: Math.random() * 8 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      d: Math.random() * 180,
      speed: Math.random() * 3 + 1.5,
      tilt: Math.random() * 10 - 5,
      tiltSpeed: Math.random() * 0.1 + 0.05,
    });
  }
  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
  animateConfetti();
  setTimeout(stopConfetti, 6000);
}

function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  let alive = false;
  confettiParticles.forEach(p => {
    p.y += p.speed;
    p.x += Math.sin(p.d * Math.PI / 180) * 1.2;
    p.d += 1;
    p.tilt += p.tiltSpeed;
    if (p.y < confettiCanvas.height + 20) alive = true;
    ctx.save();
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.r, p.r * 0.4, p.tilt, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  if (alive) confettiAnimId = requestAnimationFrame(animateConfetti);
}

function stopConfetti() {
  cancelAnimationFrame(confettiAnimId);
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

window.addEventListener('resize', () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});

/* ═══════════════════════════════════════════════════════════
   🔀 SHUFFLE (Fisher-Yates)
   ═══════════════════════════════════════════════════════════ */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ═══════════════════════════════════════════════════════════
   🌐 SYNC INITIAL QUESTIONS & SETTINGS FROM FIREBASE
   ═══════════════════════════════════════════════════════════ */
async function initFirebaseDataSync() {
  try {
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

    const teamSnap = await db.ref('admin/settings/teamNames').get();
    if (teamSnap.exists()) {
      customTeamNames = teamSnap.val();
    }

    const passSnap = await db.ref('admin/settings/hostPassword').get();
    if (passSnap.exists()) {
      hostMasterPassword = passSnap.val();
    }
  } catch (e) {
    console.warn('Firebase init sync warning:', e);
  }
}

/* ═══════════════════════════════════════════════════════════
   🌐 URL PARAM HANDLING ON PAGE LOAD
   ═══════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', async () => {
  await initFirebaseDataSync();

  const params = new URLSearchParams(window.location.search);
  const room = params.get('room');
  const team = params.get('team');

  if (room && team) {
    selectedTeam = team.toUpperCase();
    document.getElementById('join-code').value = room;
    pickTeam(selectedTeam);
    joinRoomByCode(room, selectedTeam);
  } else {
    showScreen('home');
  }
});
