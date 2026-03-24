/* ══════════════════════════════════════════════════
   KUBEQUEST — Game Logic
   ══════════════════════════════════════════════════ */

/* ===================================================
   GAME STATE
=================================================== */
let state = {
  diff: 'engineer',
  questions: [],
  current: 0,
  score: 0,
  combo: 1,
  bestCombo: 1,
  lives: 2,
  maxLives: 2,
  timer: null,
  timeLeft: 12,
  maxTime: 12,
  startTime: 0,
  totalTime: 0,
  correct: 0,
  answerTimes: [],
  answered: false,
  dragSrc: null,
};

let gameHistory = [];
try { gameHistory = JSON.parse(localStorage.getItem('kubequest_history') || '[]'); } catch (e) {}

let lbFilter = 'all';

const diffConfig = {
  recruit:   { time: 15, lives: 3, label: 'RECRUIT',   key: 'recruit' },
  engineer:  { time: 12, lives: 2, label: 'ENGINEER',  key: 'engineer' },
  architect: { time: 8,  lives: 1, label: 'ARCHITECT', key: 'architect' },
};

/* ===================================================
   GRADING SYSTEM
=================================================== */
function computeGrade(acc) {
  if (acc >= 97) return 'S';
  if (acc >= 93) return 'A+';
  if (acc >= 87) return 'A';
  if (acc >= 82) return 'A-';
  if (acc >= 77) return 'B+';
  if (acc >= 72) return 'B';
  if (acc >= 67) return 'B-';
  if (acc >= 62) return 'C+';
  if (acc >= 57) return 'C';
  if (acc >= 50) return 'C-';
  if (acc >= 40) return 'D+';
  return 'D';
}

const GRADE_MEDAL = {
  'S': 'medal-s', 'A+': 'medal-ap', 'A': 'medal-a', 'A-': 'medal-am',
  'B+': 'medal-bp', 'B': 'medal-b', 'B-': 'medal-bm',
  'C+': 'medal-cp', 'C': 'medal-c', 'C-': 'medal-cm',
  'D+': 'medal-dp', 'D': 'medal-d',
};

const GRADE_SMALL = {
  'S': 'gs', 'A+': 'gap', 'A': 'ga', 'A-': 'gam',
  'B+': 'gbp', 'B': 'gb', 'B-': 'gbm',
  'C+': 'gcp', 'C': 'gc', 'C-': 'gcm',
  'D+': 'gdp', 'D': 'gd',
};

const GRADE_KEY = {
  'S': 'grade_S', 'A+': 'grade_Ap', 'A': 'grade_A', 'A-': 'grade_Am',
  'B+': 'grade_Bp', 'B': 'grade_B', 'B-': 'grade_Bm',
  'C+': 'grade_Cp', 'C': 'grade_C', 'C-': 'grade_Cm',
  'D+': 'grade_Dp', 'D': 'grade_D',
};

const MSG_KEY = {
  'S': 'msg_S', 'A+': 'msg_Ap', 'A': 'msg_A', 'A-': 'msg_Am',
  'B+': 'msg_Bp', 'B': 'msg_B', 'B-': 'msg_Bm',
  'C+': 'msg_Cp', 'C': 'msg_C', 'C-': 'msg_Cm',
  'D+': 'msg_Dp', 'D': 'msg_D',
};

/* ===================================================
   NAVIGATION
=================================================== */
function selectDiff(d, el) {
  state.diff = d;
  document.querySelectorAll('.diff-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function goIntro() {
  show('intro');
  renderLeaderboard();
}

function show(s) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  document.getElementById('screen-' + s).classList.add('active');
}

/* ===================================================
   START GAME
=================================================== */
function startGame() {
  const cfg = diffConfig[state.diff];
  const pool = [...getQuestions(state.diff)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  state.questions = pool.slice(0, 20);
  state.current = 0;
  state.score = 0;
  state.combo = 1;
  state.bestCombo = 1;
  state.lives = cfg.lives;
  state.maxLives = cfg.lives;
  state.maxTime = cfg.time;
  state.correct = 0;
  state.totalTime = 0;
  state.answerTimes = [];
  state.answered = false;
  document.getElementById('hud-diff-badge').textContent = t(state.diff);
  document.getElementById('hud-diff-badge').className = 'hud-diff diff-' + state.diff;
  updateHUD();
  show('game');
  loadQuestion();
}

/* ===================================================
   LOAD QUESTION
=================================================== */
function loadQuestion() {
  if (state.current >= state.questions.length) { endGame(); return; }
  const q = state.questions[state.current];
  state.answered = false;
  state.startTime = Date.now();
  updateHUD();
  const area = document.getElementById('game-area');
  area.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'question-header';
  const tBadge = { qcm: 'qtype-qcm', tf: 'qtype-vrai', order: 'qtype-ordre', fill: 'qtype-type' };
  const tLabelKey = { qcm: 'qtype_mcq', tf: 'qtype_tf', order: 'qtype_order', fill: 'qtype_fill' };
  header.innerHTML = `<span class="q-number">Q${state.current + 1} / ${state.questions.length}</span><span class="q-category">${q.category}</span><span class="q-type-badge ${tBadge[q.type] || 'qtype-qcm'}">${t(tLabelKey[q.type]) || 'MCQ'}</span>`;
  area.appendChild(header);

  const card = document.createElement('div');
  card.className = 'question-card';
  card.id = 'q-card';
  card.innerHTML = `<div class="question-text">${q.question}</div>${q.hint ? `<div class="question-hint">💡 ${q.hint}</div>` : ''}`;
  area.appendChild(card);

  if (q.type === 'qcm') buildQCM(q, area);
  else if (q.type === 'tf') buildTF(q, area);
  else if (q.type === 'order') buildOrder(q, area);
  else if (q.type === 'fill') buildFill(q, area);
  startTimer();
}

/* ===================================================
   QUESTION TYPE BUILDERS
=================================================== */
function buildQCM(q, area) {
  const grid = document.createElement('div');
  grid.className = 'options-grid';
  ['A', 'B', 'C', 'D'].forEach((l, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-letter">${l}</span>${q.options[i]}`;
    btn.onclick = () => answerQCM(i, q);
    grid.appendChild(btn);
  });
  area.appendChild(grid);
}

function answerQCM(i, q) {
  if (state.answered) return;
  stopTimer();
  state.answered = true;
  const ok = i === q.answer;
  document.querySelectorAll('.option-btn').forEach((b, idx) => {
    b.disabled = true;
    if (idx === q.answer) b.classList.add('correct');
    else if (idx === i && !ok) b.classList.add('wrong');
  });
  handleResult(ok, q);
}

function buildTF(q, area) {
  const grid = document.createElement('div');
  grid.className = 'tf-grid';
  [t('btn_true'), t('btn_false')].forEach((lbl, i) => {
    const btn = document.createElement('button');
    btn.className = `tf-btn ${i === 0 ? 'true-btn' : 'false-btn'}`;
    btn.textContent = lbl;
    btn.onclick = () => {
      if (state.answered) return;
      stopTimer();
      state.answered = true;
      const chosen = (i === 0), ok = chosen === q.answer;
      document.querySelectorAll('.tf-btn').forEach((b, bi) => {
        b.disabled = true;
        const bv = (bi === 0);
        if (bv === q.answer) b.classList.add('correct');
        else if (bv === chosen && !ok) b.classList.add('wrong');
      });
      handleResult(ok, q);
    };
    grid.appendChild(btn);
  });
  area.appendChild(grid);
}

function buildFill(q, area) {
  const wrap = document.createElement('div');
  wrap.className = 'fill-wrap';
  wrap.innerHTML = `<input class="fill-input" id="fill-input" placeholder="${t('fill_placeholder')}" autocomplete="off"><br><button class="fill-submit" onclick="submitFill()">${t('fill_submit')}</button>`;
  area.appendChild(wrap);
  setTimeout(() => {
    const inp = document.getElementById('fill-input');
    if (inp) {
      inp.focus();
      inp.onkeydown = e => { if (e.key === 'Enter') submitFill(); };
    }
  }, 100);
}

function submitFill() {
  if (state.answered) return;
  const q = state.questions[state.current], inp = document.getElementById('fill-input');
  if (!inp) return;
  const val = inp.value.trim().toLowerCase(), exp = q.answer.toString().toLowerCase();
  const ok = val === exp || (q.alts && q.alts.some(a => val === a.toLowerCase()));
  stopTimer();
  state.answered = true;
  inp.disabled = true;
  inp.classList.add(ok ? 'correct' : 'wrong');
  if (!ok) inp.value = inp.value + '  →  ' + q.answer;
  handleResult(ok, q);
}

function buildOrder(q, area) {
  const wrap = document.createElement('div');
  wrap.className = 'order-wrap';
  const shuffled = [...q.items.map((txt, i) => ({ text: txt, orig: i }))];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  wrap.innerHTML = `<div class="order-list" id="order-list"></div><button class="order-submit" onclick="submitOrder()">${t('order_submit')}</button>`;
  area.appendChild(wrap);
  const list = wrap.querySelector('#order-list');
  shuffled.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'order-item';
    el.draggable = true;
    el.dataset.orig = item.orig;
    el.innerHTML = `<span class="order-drag-icon">⠿</span><span class="order-num">${i + 1}</span>${item.text}`;
    el.ondragstart = e => { state.dragSrc = el; el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; };
    el.ondragend = () => el.classList.remove('dragging');
    el.ondragover = e => { e.preventDefault(); el.classList.add('over'); };
    el.ondragleave = () => el.classList.remove('over');
    el.ondrop = e => {
      e.preventDefault();
      el.classList.remove('over');
      if (state.dragSrc !== el) {
        const items = [...list.children], si = items.indexOf(state.dragSrc), di = items.indexOf(el);
        if (si < di) list.insertBefore(state.dragSrc, el.nextSibling);
        else list.insertBefore(state.dragSrc, el);
        updateOrderNums();
      }
    };
    list.appendChild(el);
  });
}

function updateOrderNums() {
  document.querySelectorAll('#order-list .order-item').forEach((el, i) => {
    el.querySelector('.order-num').textContent = i + 1;
  });
}

function submitOrder() {
  if (state.answered) return;
  const q = state.questions[state.current];
  const items = [...document.querySelectorAll('#order-list .order-item')];
  const userOrder = items.map(el => parseInt(el.dataset.orig));
  const ok = JSON.stringify(userOrder) === JSON.stringify(q.answer);
  stopTimer();
  state.answered = true;
  document.querySelector('.order-submit').disabled = true;
  handleResult(ok, q);
}

/* ===================================================
   RESULT LOGIC
=================================================== */
function handleResult(correct, q) {
  const elapsed = (Date.now() - state.startTime) / 1000;
  state.answerTimes.push(elapsed);
  state.totalTime += elapsed;
  const card = document.getElementById('q-card');
  if (correct) {
    state.correct++;
    const pts = 100 + Math.max(0, Math.floor((state.maxTime - elapsed) * 10)) + state.combo * 50;
    state.score += pts;
    state.combo++;
    if (state.combo > state.bestCombo) state.bestCombo = state.combo;
    card.classList.add('flash-correct');
    showXP('+' + pts, true);
    document.getElementById('hud-combo').classList.add('bump');
    setTimeout(() => document.getElementById('hud-combo').classList.remove('bump'), 200);
  } else {
    state.combo = 1;
    state.lives--;
    card.classList.add('flash-wrong');
    showXP(t('minus_life'), false);
    if (state.lives <= 0) { showFeedback(q, correct); return; }
  }
  updateHUD();
  showFeedback(q, correct);
}

function showFeedback(q, correct) {
  const area = document.getElementById('game-area');
  const fb = document.createElement('div');
  fb.className = `feedback-bar ${correct ? 'correct-fb' : 'wrong-fb'}`;
  const over = state.lives <= 0;
  fb.innerHTML = `<span class="feedback-icon">${correct ? '✓' : '✗'}</span><div><div class="feedback-title">${correct ? t('correct') : (over ? t('no_lives') : t('incorrect'))}</div><div class="feedback-explain">${q.explain}</div>${q.code ? `<code class="feedback-code">${q.code}</code>` : ''}</div>`;
  area.appendChild(fb);
  const btn = document.createElement('button');
  btn.className = 'next-btn';
  if (over) {
    btn.textContent = t('view_results');
    btn.onclick = endGame;
  } else if (state.current >= state.questions.length - 1) {
    btn.textContent = t('view_results');
    btn.onclick = () => { state.current++; endGame(); };
  } else {
    btn.textContent = t('next_question');
    btn.onclick = () => { state.current++; loadQuestion(); };
  }
  area.appendChild(btn);
}

function showXP(text, pos) {
  const el = document.createElement('div');
  el.className = `xp-float ${pos ? 'pos' : 'neg'}`;
  el.textContent = text;
  el.style.cssText = `left:${Math.random() * 40 + 30}%;top:${Math.random() * 20 + 20}%`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

/* ===================================================
   TIMER
=================================================== */
function startTimer() {
  stopTimer();
  state.timeLeft = state.maxTime;
  updateTimer();
  state.timer = setInterval(() => {
    state.timeLeft--;
    updateTimer();
    if (state.timeLeft <= 0) {
      stopTimer();
      if (!state.answered) {
        state.answered = true;
        state.combo = 1;
        state.lives--;
        updateHUD();
        document.querySelectorAll('.option-btn,.tf-btn,.fill-submit,.order-submit').forEach(b => b.disabled = true);
        showFeedback(state.questions[state.current], false);
      }
    }
  }, 1000);
}

function stopTimer() {
  if (state.timer) { clearInterval(state.timer); state.timer = null; }
}

function updateTimer() {
  const el = document.getElementById('hud-timer');
  el.textContent = state.timeLeft;
  if (state.timeLeft <= 3) el.className = 'hud-timer urgent';
  else if (state.timeLeft <= Math.ceil(state.maxTime * .4)) el.className = 'hud-timer warning';
  else el.className = 'hud-timer ok';
}

/* ===================================================
   HUD
=================================================== */
function updateHUD() {
  document.getElementById('hud-score-val').textContent = state.score.toLocaleString('en-US');
  document.getElementById('hud-combo-val').textContent = '×' + state.combo;
  const total = state.questions.length, pct = Math.round((state.current / total) * 100);
  document.getElementById('prog-label').textContent = `Question ${state.current + 1} / ${total}`;
  document.getElementById('prog-pct').textContent = pct + '%';
  document.getElementById('prog-fill').style.width = pct + '%';
  document.getElementById('hud-lives').textContent = '❤️'.repeat(Math.max(0, state.lives)) + '🖤'.repeat(Math.max(0, state.maxLives - state.lives));
}

/* ===================================================
   LEADERBOARD (intro screen)
=================================================== */
function setLbFilter(filter, el) {
  lbFilter = filter;
  document.querySelectorAll('.lb-filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderLeaderboard();
}

function renderLeaderboard() {
  const el = document.getElementById('leaderboard-list');
  if (!el) return;
  el.innerHTML = '';

  let filtered = [...gameHistory];
  if (lbFilter !== 'all') {
    filtered = filtered.filter(e => e.diffKey === lbFilter);
  }
  // Sort by score descending
  filtered.sort((a, b) => b.score - a.score);
  // Top 10
  filtered = filtered.slice(0, 10);

  if (!filtered.length) {
    el.innerHTML = `<div class="history-empty">${t('lb_empty')}</div>`;
    return;
  }

  const diffCls = { recruit: 'diff-recruit', engineer: 'diff-engineer', architect: 'diff-architect' };
  filtered.forEach((e, i) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
    item.innerHTML = `<span class="hi-num">${medal}</span><span class="hi-grade ${GRADE_SMALL[e.grade] || 'gd'}">${e.grade}</span><div class="hi-info"><span class="hi-score">${e.score.toLocaleString('en-US')} pts</span><span class="hi-acc">${e.correct}/${e.total} · ${e.acc}%</span></div><span class="hi-diff ${diffCls[e.diffKey] || ''}">${e.diff}</span><span class="hi-date">${e.date} ${e.time}</span>`;
    el.appendChild(item);
  });
}

/* ===================================================
   END GAME
=================================================== */
function endGame() {
  stopTimer();
  show('results');
  const total = state.questions.length;
  const acc = Math.round((state.correct / total) * 100);
  const avgTime = state.answerTimes.length > 0 ? (state.totalTime / state.answerTimes.length).toFixed(1) : state.maxTime;
  const speedPct = Math.max(0, Math.min(100, Math.round(100 - ((parseFloat(avgTime) / state.maxTime) * 100))));
  const grade = computeGrade(acc);

  document.getElementById('res-title').textContent = t(GRADE_KEY[grade]) || 'RESULTS';
  const gradeEl = document.getElementById('res-grade');
  gradeEl.textContent = grade;
  gradeEl.className = 'result-grade ' + (GRADE_MEDAL[grade] || 'medal-d');
  document.getElementById('res-score').textContent = state.score.toLocaleString('en-US');
  document.getElementById('res-correct').textContent = `${state.correct} / ${total}`;
  document.getElementById('res-combo').textContent = '×' + state.bestCombo;
  document.getElementById('res-time').textContent = avgTime + 's';
  document.getElementById('res-acc').textContent = acc + '%';
  document.getElementById('res-speed').textContent = speedPct + '%';
  document.getElementById('res-msg').textContent = t(MSG_KEY[grade]) || '';
  setTimeout(() => {
    document.getElementById('res-acc-fill').style.width = acc + '%';
    document.getElementById('res-speed-fill').style.width = speedPct + '%';
  }, 200);

  // Save history
  const now = new Date();
  const entry = {
    grade, score: state.score, correct: state.correct, total, acc,
    diff: diffConfig[state.diff].label, diffKey: state.diff,
    date: now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    ts: Date.now(),
  };
  gameHistory.unshift(entry);
  if (gameHistory.length > 50) gameHistory = gameHistory.slice(0, 50);
  try { localStorage.setItem('kubequest_history', JSON.stringify(gameHistory)); } catch (e) {}
  renderHistory(entry.ts);
}

function renderHistory(currentTs) {
  const el = document.getElementById('history-list');
  el.innerHTML = '';
  if (!gameHistory.length) {
    el.innerHTML = `<div class="history-empty">${t('history_empty')}</div>`;
    return;
  }
  const diffCls = { recruit: 'diff-recruit', engineer: 'diff-engineer', architect: 'diff-architect' };
  gameHistory.slice(0, 10).forEach((e, i) => {
    const item = document.createElement('div');
    const isCur = e.ts === currentTs;
    item.className = 'history-item' + (isCur ? ' current-run' : '');
    item.innerHTML = `<span class="hi-num">#${i + 1}</span><span class="hi-grade ${GRADE_SMALL[e.grade] || 'gd'}">${e.grade}</span><div class="hi-info"><span class="hi-score">${e.score.toLocaleString('en-US')} pts</span><span class="hi-acc">${e.correct}/${e.total} · ${e.acc}%</span></div><span class="hi-diff ${diffCls[e.diffKey] || ''}">${e.diff}</span><span class="hi-date">${e.date} ${e.time}</span>${isCur ? `<span class="hi-new">${t('new_badge')}</span>` : ''}`;
    el.appendChild(item);
  });
}

/* ===================================================
   INIT
=================================================== */
document.addEventListener('DOMContentLoaded', () => {
  updateAllText();
  renderLeaderboard();
  // Set active lang button
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === currentLang);
  });
});
