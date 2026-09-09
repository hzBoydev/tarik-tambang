/* ============================================================
   TARIK TAMBANG DIGITAL – script.js
   Multiplayer Online via Firebase Realtime Database
   With Host Master Password, Real Rope Rules, & Admin Panel
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

// Init Firebase (using compat SDK loaded via <script> tags)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ═══════════════════════════════════════════════════════════
   🔐 HOST MASTER PASSWORD (Default: HOST123, tersinkron dari Firebase)
   ═══════════════════════════════════════════════════════════ */
let hostMasterPassword = "HOST123";
let pendingHostAction = null; // 'create-room' | 'admin'

/* ═══════════════════════════════════════════════════════════
   📚 DEFAULT BANK SOAL PANCASILA (20 Soal)
   ═══════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════
   🗃️ SESSION STATE
   ═══════════════════════════════════════════════════════════ */
let myRole = null;   // 'host' | 'player'
let myTeam = null;   // 'A' | 'B'  (players only)
let roomCode = null;
let roomRef = null;
let selectedTeam = 'A';    // team picker state on join screen
let hasAnswered = false;  // player: answered current question?
let localTimerInterval = null;
let isProcessing = false;  // host: currently processing an answer?
let answerWatcherRef = null;
let lastRenderedQ = -1;     // track which question was last rendered (prevent flicker)
let currentScreen = 'home';

/* ═══════════════════════════════════════════════════════════
   🧭 NAVIGATION
   ═══════════════════════════════════════════════════════════ */
const ALL_SCREENS = [
  'home', 'create-room', 'host-lobby', 'join-room',
  'player-lobby', 'spectator', 'player-game', 'result', 'admin'
];

function showScreen(name) {
  currentScreen = name;
  ALL_SCREENS.forEach(s => {
    const el = document.getElementById(`screen-${s}`);
    if (el) el.classList.toggle('active', s === name);
  });
}

function goToCreateRoom() { showScreen('create-room'); }
function goToJoinRoom() { showScreen('join-room'); }

function goHome() {
  stopLocalTimer();
  detachListeners();
  myRole = myTeam = roomCode = roomRef = null;
  hasAnswered = isProcessing = false;
  lastRenderedQ = -1;
  stopConfetti();
  window.history.replaceState({}, '', window.location.pathname);
  showScreen('home');
}

/* ═══════════════════════════════════════════════════════════
   🔐 HOST PASSWORD PROMPT & MODAL LOGIC
   ═══════════════════════════════════════════════════════════ */
function promptHostPassword(action) {
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
    const action = pendingHostAction;
    closeHostPassModal();
    if (action === 'create-room') {
      goToCreateRoom();
    } else if (action === 'admin') {
      openAdminPanel();
    }
  } else {
    if (err) err.textContent = '❌ Password Host salah!';
    if (input) input.focus();
  }
}

// Support Enter key on Host Password modal
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
  const btn = document.getElementById('btn-create-room');
  btn.disabled = true;
  btn.textContent = '⏳ Membuat room...';

  const code = generateCode();
  const winTarget = Math.max(3, Math.min(10, parseInt(document.getElementById('cr-win-target').value) || 5));
  const timerDuration = Math.max(5, Math.min(30, parseInt(document.getElementById('cr-timer').value) || 15));

  const roomData = {
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    status: 'lobby',
    settings: {
      winTarget,
      timerDuration,
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

    // Populate host lobby UI
    document.getElementById('host-room-code').textContent = code;
    document.getElementById('spec-room-badge').textContent = `Room: ${code}`;
    const base = window.location.origin + window.location.pathname;
    document.getElementById('link-team-a').value = `${base}?room=${code}&team=A`;
    document.getElementById('link-team-b').value = `${base}?room=${code}&team=B`;

    window.history.replaceState({}, '', `?room=${code}&role=host`);
    showScreen('host-lobby');
    listenToRoom(code);

  } catch (err) {
    alert('❌ Gagal membuat room: ' + err.message + '\n\nPastikan koneksi internet / Firebase aktif!');
    btn.disabled = false;
    btn.textContent = '🚀 Buat Room';
  }
}

function copyLink(team) {
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
   🎮 JOIN ROOM (PLAYER)
   ═══════════════════════════════════════════════════════════ */
function pickTeam(team) {
  selectedTeam = team;
  document.getElementById('pick-team-a').classList.toggle('active', team === 'A');
  document.getElementById('pick-team-b').classList.toggle('active', team === 'B');
}

async function joinRoom() {
  const code = document.getElementById('join-code').value.trim().toUpperCase();
  const errEl = document.getElementById('join-error');
  errEl.textContent = '';

  if (code.length !== 6) {
    errEl.textContent = '⚠️ Kode room harus 6 karakter.';
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
      errEl.textContent = '⚠️ Room tidak ditemukan. Periksa kode.';
      if (joinBtn) { joinBtn.disabled = false; joinBtn.textContent = '🚀 Masuk'; }
      return;
    }

    const roomData = snap.val();
    if (roomData.status === 'finished') {
      errEl.textContent = '⚠️ Room sudah selesai.';
      if (joinBtn) { joinBtn.disabled = false; joinBtn.textContent = '🚀 Masuk'; }
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

    const teamDisplayName = team === 'A' 
      ? (roomData.settings?.teamNames?.A || 'TIM A') + ' 🔴'
      : (roomData.settings?.teamNames?.B || 'TIM B') + ' 🔵';

    // Set player lobby UI
    document.getElementById('pl-team-badge').textContent = teamDisplayName;
    document.getElementById('pl-team-badge').className = `pl-team-badge ${team === 'A' ? 'badge-a' : 'badge-b'}`;
    document.getElementById('pl-room-code').textContent = code;

    window.history.replaceState({}, '', `?room=${code}&team=${team}`);
    showScreen('player-lobby');
    listenToRoom(code);

    // If game already started, go straight to player game
    if (roomData.status === 'playing') {
      showScreen('player-game');
      document.getElementById('pg-team-badge').textContent = teamDisplayName;
      document.getElementById('pg-team-badge').className = `pg-team-badge ${team === 'A' ? 'team-a' : 'team-b'}`;
    }

  } catch (err) {
    errEl.textContent = '⚠️ Gagal bergabung: ' + err.message;
    if (joinBtn) { joinBtn.disabled = false; joinBtn.textContent = '🚀 Masuk'; }
  }
}

/* ═══════════════════════════════════════════════════════════
   📡 FIREBASE LISTENER (all roles)
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

  // Always sync lobby status indicators
  syncTeamStatus(teams, settings);

  // HOST: enable start button when both joined
  if (myRole === 'host' && currentScreen === 'host-lobby') {
    const bothJoined = teams?.A?.joined && teams?.B?.joined;
    const startBtn = document.getElementById('btn-host-start');
    const hintEl = document.getElementById('start-hint-text');
    if (startBtn) startBtn.disabled = !bothJoined;
    if (hintEl) {
      hintEl.textContent = bothJoined
        ? '✅ Kedua tim siap! Tekan Mulai Game.'
        : 'Menunggu kedua tim bergabung...';
    }
  }

  // HANDLE GAME STATUS
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

  // Host lobby status
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
  // Player lobby status
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
  btn.textContent = '⏳ Memulai...';

  const settSnap = await db.ref(`rooms/${roomCode}/settings`).get();
  const settings = settSnap.val();

  // Shuffle question indices based on dynamicQuestionBank length
  const qOrder = shuffle([...Array(dynamicQuestionBank.length).keys()]);

  const gameData = {
    questionOrder: qOrder,
    currentQ: 0,
    ropePos: 0,
    scoreA: 0,
    scoreB: 0,
    answered: false,
    answeredBy: null,
    selectedIdx: null,
    pendingAnswer: null,
    lastResult: null,
    timeLeft: settings.timerDuration,
    timeout: false,
    timerRunning: false,
    winner: null,
  };

  await db.ref(`rooms/${roomCode}`).update({ status: 'playing', game: gameData });

  showScreen('spectator');
  document.getElementById('spec-room-badge').textContent = `Room: ${roomCode}`;
  setupHostAnswerWatcher();
  setTimeout(() => startHostTimer(settings.timerDuration), 600);
}

/* ═══════════════════════════════════════════════════════════
   ⏱ HOST: TIMER
   ═══════════════════════════════════════════════════════════ */
function startHostTimer(timerDuration) {
  stopLocalTimer();

  db.ref(`rooms/${roomCode}/game/timeLeft`).get().then(snap => {
    let timeLeft = snap.val() ?? timerDuration;

    localTimerInterval = setInterval(async () => {
      timeLeft--;

      if (timeLeft <= 0) {
        stopLocalTimer();
        // Timeout: no one answered
        await db.ref(`rooms/${roomCode}/game`).transaction(g => {
          if (!g || g.answered) return undefined; // abort if already answered
          g.answered = true;
          g.timeout = true;
          g.timeLeft = 0;
          g.timerRunning = false;
          const qObj = dynamicQuestionBank[g.questionOrder?.[g.currentQ]];
          g.lastResult = {
            type: 'timeout',
            message: '⏰ WAKTU HABIS!\nTidak ada yang menjawab.',
            correctIdx: qObj?.answer ?? -1
          };
          return g;
        });
        setTimeout(() => advanceQuestion(), 2500);
      } else {
        db.ref(`rooms/${roomCode}/game/timeLeft`).set(timeLeft);
      }
    }, 1000);
  });
}

function stopLocalTimer() {
  if (localTimerInterval) {
    clearInterval(localTimerInterval);
    localTimerInterval = null;
  }
}

/* ═══════════════════════════════════════════════════════════
   👁 HOST: WATCH FOR PLAYER ANSWERS
   ═══════════════════════════════════════════════════════════ */
function setupHostAnswerWatcher() {
  if (answerWatcherRef) answerWatcherRef.off();
  answerWatcherRef = db.ref(`rooms/${roomCode}/game/pendingAnswer`);
  answerWatcherRef.on('value', snap => {
    const answer = snap.val();
    if (answer && !isProcessing) {
      isProcessing = true;
      stopLocalTimer();
      hostProcessAnswer(answer.team, answer.idx);
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   ⚡ REALISTIC TUG-OF-WAR ANSWER PROCESSING
   - If Correct: team gets +1 & pulls rope to itself
   - If Wrong: OPPONENT team gets +1 & pulls rope to opponent!
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

  let scoreA = game.scoreA;
  let scoreB = game.scoreB;
  let ropePos = game.ropePos;

  const otherTeam = (team === 'A' ? 'B' : 'A');
  const nameA = settings?.teamNames?.A || 'Tim A';
  const nameB = settings?.teamNames?.B || 'Tim B';
  const answeredTeamName = team === 'A' ? nameA : nameB;
  const opponentTeamName = otherTeam === 'A' ? nameA : nameB;

  if (isCorrect) {
    // Correct answer: points and rope to the team that answered
    if (team === 'A') { scoreA++; ropePos--; }
    else { scoreB++; ropePos++; }
  } else {
    // Wrong answer: OPPONENT gets the point & rope moves to opponent!
    if (team === 'A') { scoreB++; ropePos++; }
    else { scoreA++; ropePos--; }
  }

  const winTarget = settings.winTarget;
  let winner = null;
  if (ropePos <= -winTarget) winner = 'A';
  if (ropePos >= winTarget) winner = 'B';

  const lastResult = {
    type: isCorrect ? 'correct' : 'wrong',
    team,
    otherTeam,
    idx,
    correctIdx: q.answer,
    message: isCorrect
      ? `✅ BENAR!\n${answeredTeamName} mendapat +1 poin & menarik tali!`
      : `❌ SALAH!\n+1 Poin & tarikan tali diberikan ke ${opponentTeamName}!\nJawaban benar: ${LABELS[q.answer]}`,
    winner,
  };

  await db.ref(`rooms/${roomCode}`).update({
    'game/answered': true,
    'game/answeredBy': team,
    'game/selectedIdx': idx,
    'game/scoreA': scoreA,
    'game/scoreB': scoreB,
    'game/ropePos': ropePos,
    'game/lastResult': lastResult,
    'game/timerRunning': false,
  });

  if (winner) {
    setTimeout(() => endGameOnFirebase(winner, scoreA, scoreB, settings), 2800);
  } else {
    setTimeout(() => advanceQuestion(), 2600);
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
    // All questions done
    const winner = game.scoreA > game.scoreB ? 'A'
      : game.scoreB > game.scoreA ? 'B'
        : 'draw';
    endGameOnFirebase(winner, game.scoreA, game.scoreB, settings);
    return;
  }

  await db.ref(`rooms/${roomCode}/game`).update({
    currentQ: nextQ,
    answered: false,
    answeredBy: null,
    selectedIdx: null,
    pendingAnswer: null,
    lastResult: null,
    timeout: false,
    timerRunning: false,
    timeLeft: settings.timerDuration,
  });

  isProcessing = false;
  startHostTimer(settings.timerDuration);
}

async function endGameOnFirebase(winner, scoreA, scoreB, settings) {
  stopLocalTimer();
  
  await db.ref(`rooms/${roomCode}`).update({
    status: 'finished',
    'game/winner': winner,
    'game/scoreA': scoreA,
    'game/scoreB': scoreB,
  });

  // Log to history in Firebase
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
      winner: winner
    });
  } catch (err) {
    console.error('History log error:', err);
  }
}

/* ═══════════════════════════════════════════════════════════
   🖥 SPECTATOR UI (Host view)
   ═══════════════════════════════════════════════════════════ */
function updateSpectatorUI(game, settings) {
  const nameA = settings?.teamNames?.A || 'Tim A';
  const nameB = settings?.teamNames?.B || 'Tim B';

  // Team names
  document.getElementById('spec-team-name-a').textContent = `${nameA.toUpperCase()} 🔴`;
  document.getElementById('spec-team-name-b').textContent = `${nameB.toUpperCase()} 🔵`;
  document.getElementById('spec-rope-label-a').textContent = `← ${nameA}`;
  document.getElementById('spec-rope-label-b').textContent = `${nameB} →`;

  // Scores
  document.getElementById('spec-score-a').textContent = game.scoreA ?? 0;
  document.getElementById('spec-score-b').textContent = game.scoreB ?? 0;

  // Question counter
  const total = game.questionOrder?.length ?? dynamicQuestionBank.length;
  document.getElementById('spec-counter').textContent = `Soal ${(game.currentQ ?? 0) + 1} / ${total}`;
  document.getElementById('spec-q-number').textContent = `Soal ${(game.currentQ ?? 0) + 1}`;

  // Timer
  const tLeft = game.timeLeft ?? settings.timerDuration;
  const maxT = settings.timerDuration;
  document.getElementById('spec-timer-text').textContent = tLeft;
  const arc = document.getElementById('spec-timer-arc');
  arc.style.strokeDashoffset = 163.36 * (1 - tLeft / maxT);
  arc.classList.toggle('urgent', tLeft <= 5);

  // Question text
  if (game.questionOrder) {
    const qIdx = game.questionOrder[game.currentQ];
    const q = dynamicQuestionBank[qIdx];
    if (q) {
      document.getElementById('spec-q-text').textContent = q.q;

      // Render choices (only re-render when question changes)
      if (lastRenderedQ !== game.currentQ) {
        lastRenderedQ = game.currentQ;
        renderSpecChoices(q.choices);
      }

      // Apply answer highlighting when answered
      if (game.answered && game.lastResult) {
        applySpecChoiceResult(game.selectedIdx, q.answer, game.answeredBy, game.lastResult.type);
      }
    }
  }

  // Rope
  updateRopeKnot('spec-rope-knot', game.ropePos ?? 0, settings.winTarget);

  // Feedback overlay
  if (game.lastResult) {
    showSpecFeedback(game.lastResult);
  } else {
    hideSpecFeedback();
  }

  // Status bar
  updateSpecStatusBar(game, settings);
}

function renderSpecChoices(choices) {
  const grid = document.getElementById('spec-choices-grid');
  if (!grid) return;
  grid.innerHTML = '';
  choices.forEach((text, i) => {
    const div = document.createElement('div');
    div.className = 'choice-btn spec-choice';
    div.id = `spec-choice-${i}`;
    div.innerHTML = `<span class="choice-label">${LABELS[i]}</span><span class="choice-text">${text}</span>`;
    grid.appendChild(div);
  });
}

function applySpecChoiceResult(selectedIdx, correctIdx, team, type) {
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`spec-choice-${i}`);
    if (!btn) continue;
    btn.className = 'choice-btn spec-choice';
    if (i === correctIdx) btn.classList.add('correct');
    if (i === selectedIdx && i !== correctIdx) btn.classList.add('wrong', `answered-${team?.toLowerCase()}`);
    if (i === selectedIdx && i === correctIdx) btn.classList.add(`answered-${team?.toLowerCase()}`);
  }
}

function updateSpecStatusBar(game, settings) {
  const bar = document.getElementById('spec-status-bar');
  if (!bar) return;
  const nameA = settings?.teamNames?.A || 'Tim A';
  const nameB = settings?.teamNames?.B || 'Tim B';
  const ansTeamName = game.answeredBy === 'A' ? nameA : nameB;
  const oppTeamName = game.answeredBy === 'A' ? nameB : nameA;

  if (!game.answered && !game.timeout) {
    bar.textContent = '⏳ Menunggu jawaban dari tim pemain...';
    bar.className = 'status-bar';
  } else if (game.lastResult?.type === 'timeout') {
    bar.textContent = '⏰ Waktu habis! Tidak ada yang menjawab.';
    bar.className = 'status-bar';
  } else if (game.lastResult?.type === 'correct') {
    bar.textContent = `✅ ${ansTeamName.toUpperCase()} BENAR! (+1 poin & menarik tali)`;
    bar.className = `status-bar ${game.answeredBy === 'A' ? 'status-a' : 'status-b'}`;
  } else {
    bar.textContent = `❌ ${ansTeamName.toUpperCase()} SALAH! (+1 poin & tarikan tali untuk ${oppTeamName})`;
    bar.className = 'status-bar status-neutral';
  }
}

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

/* ═══════════════════════════════════════════════════════════
   📱 PLAYER GAME UI
   ═══════════════════════════════════════════════════════════ */
function updatePlayerUI(game, settings) {
  if (!game.questionOrder) return;

  const qIdx = game.questionOrder[game.currentQ];
  const q = dynamicQuestionBank[qIdx];
  if (!q) return;

  // Counter
  document.getElementById('pg-counter').textContent = `Soal ${(game.currentQ ?? 0) + 1}/${game.questionOrder.length}`;

  // Timer
  const tLeft = game.timeLeft ?? settings.timerDuration;
  const maxT = settings.timerDuration;
  document.getElementById('pg-timer-text').textContent = tLeft;
  const pgArc = document.getElementById('pg-timer-arc');
  pgArc.style.strokeDashoffset = 163.36 * (1 - tLeft / maxT);
  pgArc.classList.toggle('urgent', tLeft <= 5);

  // New question: reset + re-render choices
  if (lastRenderedQ !== game.currentQ) {
    lastRenderedQ = game.currentQ;
    hasAnswered = false;
    document.getElementById('pg-q-text').textContent = q.q;
    renderPlayerChoices(q.choices, false, -1, -1, null);
    document.getElementById('pg-status-bar').textContent = '⏳ Siap menjawab...';
    document.getElementById('pg-status-bar').className = 'pg-status';
  }

  // Show result when answered
  if (game.answered && game.lastResult) {
    applyPlayerChoiceResult(game.selectedIdx, q.answer, game.answeredBy, game.lastResult.type);

    const bar = document.getElementById('pg-status-bar');
    const type = game.lastResult.type;
    const oppTeam = myTeam === 'A' ? 'B' : 'A';
    const nameOpp = settings?.teamNames?.[oppTeam] || `Tim ${oppTeam}`;

    if (type === 'timeout') {
      bar.textContent = `⏰ Waktu habis! Jawaban benar: ${LABELS[q.answer]}`;
      bar.className = 'pg-status';
    } else if (game.answeredBy === myTeam) {
      if (type === 'correct') {
        bar.textContent = '✅ Jawaban BENAR! +1 poin untuk tim kamu & menarik tali!';
        bar.className = 'pg-status pg-correct';
      } else {
        bar.textContent = `❌ Jawaban SALAH! +1 poin & tali tertarik ke ${nameOpp}! (Kunci: ${LABELS[q.answer]})`;
        bar.className = 'pg-status pg-wrong';
      }
    } else {
      // Opponent answered
      if (type === 'correct') {
        bar.textContent = `⚡ ${nameOpp} menjawab BENAR! (+1 poin untuk lawan)`;
        bar.className = 'pg-status pg-wrong';
      } else {
        bar.textContent = `🎉 ${nameOpp} menjawab SALAH! Poin +1 & tarikan tali diberikan ke tim kamu!`;
        bar.className = 'pg-status pg-correct';
      }
    }
  }
}

function renderPlayerChoices(choices, disabled, selectedIdx, correctIdx, type) {
  const grid = document.getElementById('pg-choices-grid');
  if (!grid) return;
  grid.innerHTML = '';
  choices.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'pg-choice-btn';
    btn.id = `pg-choice-${i}`;
    btn.dataset.idx = i;
    btn.innerHTML = `<span class="pg-choice-label">${LABELS[i]}</span><span class="pg-choice-text">${text}</span>`;
    if (disabled) {
      btn.disabled = true;
    } else {
      btn.addEventListener('click', () => submitAnswer(i));
    }
    grid.appendChild(btn);
  });
}

function applyPlayerChoiceResult(selectedIdx, correctIdx, answeredBy, type) {
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`pg-choice-${i}`);
    if (!btn) continue;
    btn.disabled = true;
    btn.className = 'pg-choice-btn';
    if (i === correctIdx) btn.classList.add('correct');
    if (i === selectedIdx && i !== correctIdx) btn.classList.add('wrong');
  }
}

/* ═══════════════════════════════════════════════════════════
   📤 PLAYER: SUBMIT ANSWER
   ═══════════════════════════════════════════════════════════ */
function submitAnswer(idx) {
  if (hasAnswered || !roomCode || myRole !== 'player') return;
  hasAnswered = true;

  document.querySelectorAll('.pg-choice-btn').forEach(b => b.disabled = true);
  const selBtn = document.getElementById(`pg-choice-${idx}`);
  if (selBtn) selBtn.classList.add('selected-pending');

  db.ref(`rooms/${roomCode}/game`).transaction(game => {
    if (!game || game.answered || game.pendingAnswer) return undefined;
    game.answered = true;
    game.answeredBy = myTeam;
    game.selectedIdx = idx;
    game.pendingAnswer = { team: myTeam, idx };
    game.timerRunning = false;
    return game;
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
  const nameA = settings?.teamNames?.A || 'Tim A';
  const nameB = settings?.teamNames?.B || 'Tim B';

  const trophy = document.getElementById('result-trophy');
  const title = document.getElementById('result-title');
  const sub = document.getElementById('result-subtitle');

  document.getElementById('final-name-a').textContent = `${nameA.toUpperCase()} 🔴`;
  document.getElementById('final-name-b').textContent = `${nameB.toUpperCase()} 🔵`;
  document.getElementById('final-score-a').textContent = scoreA;
  document.getElementById('final-score-b').textContent = scoreB;

  title.style.background = '';
  title.style.webkitBackgroundClip = '';
  title.style.webkitTextFillColor = '';

  if (winner === 'A') {
    trophy.textContent = '🏆';
    title.textContent = `🔴 ${nameA.toUpperCase()} MENANG!`;
    sub.textContent = `Selamat! ${nameA} berhasil menarik tali ke garis kemenangan!`;
    title.style.background = 'linear-gradient(135deg,#ff4757,#ff6b81)';
    title.style.webkitBackgroundClip = 'text';
    title.style.webkitTextFillColor = 'transparent';
    launchConfetti();
  } else if (winner === 'B') {
    trophy.textContent = '🏆';
    title.textContent = `🔵 ${nameB.toUpperCase()} MENANG!`;
    sub.textContent = `Selamat! ${nameB} berhasil menarik tali ke garis kemenangan!`;
    title.style.background = 'linear-gradient(135deg,#2f9ceb,#74c0fc)';
    title.style.webkitBackgroundClip = 'text';
    title.style.webkitTextFillColor = 'transparent';
    launchConfetti();
  } else if (scoreA > scoreB) {
    trophy.textContent = '🏆';
    title.textContent = `🔴 ${nameA.toUpperCase()} MENANG!`;
    sub.textContent = `Semua soal selesai. ${nameA} unggul dengan poin lebih banyak!`;
    launchConfetti();
  } else if (scoreB > scoreA) {
    trophy.textContent = `🔵 ${nameB.toUpperCase()} MENANG!`;
    sub.textContent = `Semua soal selesai. ${nameB} unggul dengan poin lebih banyak!`;
    launchConfetti();
  } else {
    trophy.textContent = '🤝';
    title.textContent = '🤝 PERTANDINGAN SERI!';
    sub.textContent = 'Kedua tim memiliki skor yang sama kuat!';
  }

  document.getElementById('btn-play-again').style.display = myRole === 'host' ? '' : 'none';
  showScreen('result');
}

async function playAgain() {
  if (myRole !== 'host') return;
  isProcessing = false;
  hasAnswered = false;
  lastRenderedQ = -1;
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
  document.getElementById('start-hint-text').textContent = '✅ Kedua tim siap! Tekan Mulai Game.';
  listenToRoom(roomCode);
}

/* ═══════════════════════════════════════════════════════════
   🪢 ROPE KNOT POSITION
   ═══════════════════════════════════════════════════════════ */
function updateRopeKnot(id, ropePos, winTarget) {
  const knot = document.getElementById(id);
  if (!knot) return;
  const max = winTarget ?? 5;
  const pct = (ropePos + max) / (max * 2);
  const clamped = Math.max(0, Math.min(1, pct));
  knot.style.left = `${clamped * 100}%`;
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
  setTimeout(stopConfetti, 5000);
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
   ⚙️ ADMIN PANEL CONTROLLER & FIREBASE CRUD
   ═══════════════════════════════════════════════════════════ */
function openAdminPanel() {
  showScreen('admin');
  switchAdminTab('questions');
  renderAdminQuestions();
  
  // Fill team names & host pass form
  document.getElementById('admin-team-a-name').value = customTeamNames.A || "Tim A";
  document.getElementById('admin-team-b-name').value = customTeamNames.B || "Tim B";
  const passField = document.getElementById('admin-host-pass-new');
  if (passField) passField.value = hostMasterPassword;
  document.getElementById('team-save-status').textContent = '';

  loadAdminHistory();
}

function switchAdminTab(tabName) {
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

/* --- QUESTION MANAGEMENT --- */
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
            <span>${c} ${cIdx === item.answer ? '✓ (Benar)' : ''}</span>
          </div>
        `).join('')}
      </div>
    `;
    listEl.appendChild(card);
  });

  if (shownCount === 0) {
    listEl.innerHTML = `<div class="empty-state">Tidak ada soal yang sesuai dengan pencarian "${filter}".</div>`;
  }
}

function filterAdminQuestions() {
  const searchInput = document.getElementById('admin-q-search');
  renderAdminQuestions(searchInput ? searchInput.value : '');
}

function openAddQuestionModal() {
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
      renderAdminQuestions();
      alert('✅ Bank soal berhasil di-reset ke 20 soal default!');
    } catch (err) {
      alert('❌ Gagal reset: ' + err.message);
    }
  }
}

/* --- SETTINGS (TEAM NAMES & HOST PASS) MANAGEMENT --- */
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
    statusEl.textContent = '✅ Pengaturan berhasil disimpan!';
    setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
  } catch (err) {
    statusEl.textContent = '❌ Gagal menyimpan: ' + err.message;
  }
}

function saveTeamNames() {
  return saveAdminSettings();
}

/* --- HISTORY MANAGEMENT --- */
async function loadAdminHistory() {
  const listEl = document.getElementById('admin-history-list');
  const countEl = document.getElementById('admin-hist-count');
  if (!listEl) return;

  listEl.innerHTML = '<div class="empty-state">⏳ Memuat riwayat pertandingan...</div>';

  try {
    const snap = await db.ref('history').limitToLast(50).get();
    if (!snap.exists()) {
      listEl.innerHTML = '<div class="empty-state">Belum ada riwayat pertandingan.</div>';
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
  if (confirm('Hapus seluruh riwayat pertandingan? Tindakan ini tidak bisa dibatalkan.')) {
    try {
      await db.ref('history').remove();
      loadAdminHistory();
    } catch (err) {
      alert('❌ Gagal menghapus riwayat: ' + err.message);
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   🌐 SYNC INITIAL QUESTIONS & SETTINGS FROM FIREBASE
   ═══════════════════════════════════════════════════════════ */
async function initFirebaseDataSync() {
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
      // Seed default questions
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

/* ═══════════════════════════════════════════════════════════
   🌐 URL PARAM HANDLING ON PAGE LOAD
   ═══════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', async () => {
  await initFirebaseDataSync();

  const params = new URLSearchParams(window.location.search);
  const room = params.get('room');
  const team = params.get('team');
  const role = params.get('role');

  if (room && team) {
    selectedTeam = team.toUpperCase();
    document.getElementById('join-code').value = room;
    pickTeam(selectedTeam);
    joinRoomByCode(room, selectedTeam);
  } else {
    showScreen('home');
  }
});
