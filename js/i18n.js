/* ══════════════════════════════════════════════════
   KUBEQUEST — Internationalization
   ══════════════════════════════════════════════════ */

let currentLang = localStorage.getItem('kubequest_lang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('kubequest_lang', lang);
  document.documentElement.lang = lang;
  updateAllText();
  renderLeaderboard();
  // Update flag buttons
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
}

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

/* ===================================================
   UI STRINGS
=================================================== */
const I18N = {
  en: {
    // Intro
    subtitle: 'Kubernetes Training Simulator',
    tagline: 'Master Kubernetes — from pods to full cluster.',
    start: 'START MISSION ▶',
    // Difficulty
    recruit: 'RECRUIT',
    engineer: 'ENGINEER',
    architect: 'ARCHITECT',
    recruit_desc: 'Starting from scratch? Begin here. Vocabulary, core concepts, architecture.',
    engineer_desc: 'You know the basics. Commands, workloads, networking, configuration.',
    architect_desc: 'Expert level. Security, RBAC, advanced scheduling, real-world scenarios.',
    per_question: '/ question',
    lives: 'lives',
    life: 'life',
    mcq: 'MCQ',
    mixed: 'Mixed',
    expert: 'Expert',
    // Leaderboard
    leaderboard: 'LEADERBOARD',
    lb_all: 'ALL',
    lb_empty: 'No games recorded yet. Play your first match!',
    lb_rank: '#',
    // HUD
    score: 'SCORE',
    combo: 'COMBO',
    // Question types
    qtype_mcq: 'MCQ',
    qtype_tf: 'TRUE / FALSE',
    qtype_order: 'ORDER',
    qtype_fill: 'TYPE-IN',
    btn_true: 'TRUE',
    btn_false: 'FALSE',
    fill_placeholder: 'Your answer...',
    fill_submit: 'SUBMIT ↵',
    order_submit: 'SUBMIT ORDER ↵',
    // Feedback
    correct: 'Correct!',
    incorrect: 'Incorrect',
    no_lives: 'No lives left!',
    next_question: 'NEXT QUESTION ▶',
    view_results: 'VIEW RESULTS ▶',
    minus_life: '-1 LIFE',
    // Results
    result_score: 'Score',
    result_correct: 'Correct',
    result_combo: 'Best combo',
    result_time: 'Avg. time',
    accuracy: 'Accuracy',
    speed: 'Speed',
    game_history: '⎈ GAME HISTORY',
    menu: 'MENU',
    play_again: 'PLAY AGAIN ▶',
    new_badge: 'NEW',
    history_empty: 'No games recorded yet.',
    // Grades
    grade_S: 'ABSOLUTE PERFECTION',
    grade_Ap: 'OUTSTANDING',
    grade_A: 'EXCELLENT',
    grade_Am: 'VERY GOOD',
    grade_Bp: 'GOOD +',
    grade_B: 'GOOD',
    grade_Bm: 'FAIR',
    grade_Cp: 'PASSABLE +',
    grade_C: 'PASSABLE',
    grade_Cm: 'INSUFFICIENT',
    grade_Dp: 'NEEDS WORK',
    grade_D: 'TRY AGAIN',
    msg_S: "Perfect score! You've mastered Kubernetes at an extraordinary level. You're ready for any interview.",
    msg_Ap: "Near perfect! A few rare points to polish, but your level is truly impressive.",
    msg_A: "Excellent level! Your K8s knowledge is solid. Keep it up.",
    msg_Am: "Great work! A slight review on a few points and you'll nail it.",
    msg_Bp: "Good level, just below excellent. Review the missed questions.",
    msg_B: "Good job! The foundations are there, keep practicing the shaky areas.",
    msg_Bm: "Pretty good, but some gaps to fill. Review the cheatsheet.",
    msg_Cp: "Room for improvement. Focus on Architecture and Networking topics.",
    msg_C: "Gaps to fill. Re-read the cheatsheet, especially the failed sections.",
    msg_Cm: "Fundamentals need strengthening. Try again in RECRUIT mode to consolidate basics.",
    msg_Dp: "Insufficient level. Re-read all the concepts before trying again.",
    msg_D: "Don't panic! Kubernetes takes practice. Start with the basics in RECRUIT mode.",
  },
  fr: {
    subtitle: "Simulateur d'entraînement Kubernetes",
    tagline: 'Maîtrise Kubernetes — du pod au cluster complet.',
    start: 'LANCER LA MISSION ▶',
    recruit: 'RECRUE',
    engineer: 'INGÉNIEUR',
    architect: 'ARCHITECTE',
    recruit_desc: 'Tu pars de zéro ? Commence ici. Vocabulaire, concepts de base, architecture.',
    engineer_desc: 'Tu connais les bases. Commandes, workloads, réseau, configuration.',
    architect_desc: 'Niveau expert. Sécurité, RBAC, scheduling avancé, cas réels.',
    per_question: '/ question',
    lives: 'vies',
    life: 'vie',
    mcq: 'QCM',
    mixed: 'Mixte',
    expert: 'Expert',
    leaderboard: 'CLASSEMENT',
    lb_all: 'TOUS',
    lb_empty: 'Aucune partie enregistrée. Lance ta première partie !',
    lb_rank: '#',
    score: 'SCORE',
    combo: 'COMBO',
    qtype_mcq: 'QCM',
    qtype_tf: 'VRAI / FAUX',
    qtype_order: 'ORDRE',
    qtype_fill: 'SAISIE',
    btn_true: 'VRAI',
    btn_false: 'FAUX',
    fill_placeholder: 'Votre réponse...',
    fill_submit: 'VALIDER ↵',
    order_submit: "VALIDER L'ORDRE ↵",
    correct: 'Correct !',
    incorrect: 'Incorrect',
    no_lives: 'Plus de vies !',
    next_question: 'QUESTION SUIVANTE ▶',
    view_results: 'VOIR LES RÉSULTATS ▶',
    minus_life: '-1 VIE',
    result_score: 'Score',
    result_correct: 'Bonnes réponses',
    result_combo: 'Meilleur combo',
    result_time: 'Temps moyen',
    accuracy: 'Précision',
    speed: 'Rapidité',
    game_history: '⎈ HISTORIQUE DES PARTIES',
    menu: 'MENU',
    play_again: 'REJOUER ▶',
    new_badge: 'NOUVEAU',
    history_empty: "Aucune partie enregistrée pour l'instant.",
    grade_S: 'PERFECTION ABSOLUE',
    grade_Ap: 'REMARQUABLE',
    grade_A: 'EXCELLENT',
    grade_Am: 'TRÈS BIEN',
    grade_Bp: 'BIEN +',
    grade_B: 'BIEN',
    grade_Bm: 'ASSEZ BIEN',
    grade_Cp: 'PASSABLE +',
    grade_C: 'PASSABLE',
    grade_Cm: 'INSUFFISANT',
    grade_Dp: 'TRÈS INSUFFISANT',
    grade_D: 'À RECOMMENCER',
    msg_S: "Score parfait ! Tu maîtrises Kubernetes à un niveau hors norme. Tu es prêt pour n'importe quel entretien.",
    msg_Ap: "Quasi parfait ! Quelques rares points à peaufiner, mais ton niveau est vraiment impressionnant.",
    msg_A: "Excellent niveau ! Tes connaissances K8s sont solides. Continue ainsi.",
    msg_Am: "Très bon travail ! Une légère révision sur quelques points et ce sera parfait.",
    msg_Bp: "Bon niveau, juste en dessous de l'excellent. Revois les questions manquées.",
    msg_B: "Bon travail ! Les bases sont là, continue à pratiquer les zones hésitantes.",
    msg_Bm: "Plutôt bien, mais quelques lacunes à combler. Relis la cheatsheet.",
    msg_Cp: "Des progrès à faire. Concentre-toi sur les thèmes Architecture et Réseau.",
    msg_C: "Des lacunes à combler. Relis la cheatsheet, notamment les sections non réussies.",
    msg_Cm: "Des bases à renforcer. Recommence en mode RECRUE pour consolider les fondamentaux.",
    msg_Dp: "Niveau insuffisant. Relis l'ensemble des concepts avant de retenter.",
    msg_D: "Pas de panique ! Kubernetes, ça s'apprend. Commence par les bases avec le mode RECRUE.",
  }
};

/* ===================================================
   UPDATE STATIC TEXT IN DOM
=================================================== */
function updateAllText() {
  // Intro
  document.getElementById('txt-subtitle').textContent = t('subtitle');
  document.getElementById('txt-tagline').textContent = t('tagline');
  document.getElementById('txt-start').textContent = t('start');
  // Difficulty cards
  document.getElementById('txt-recruit').textContent = t('recruit');
  document.getElementById('txt-engineer').textContent = t('engineer');
  document.getElementById('txt-architect').textContent = t('architect');
  document.getElementById('txt-recruit-desc').textContent = t('recruit_desc');
  document.getElementById('txt-engineer-desc').textContent = t('engineer_desc');
  document.getElementById('txt-architect-desc').textContent = t('architect_desc');
  // Diff tags
  document.getElementById('txt-recruit-lives').textContent = '3 ' + t('lives');
  document.getElementById('txt-engineer-lives').textContent = '2 ' + t('lives');
  document.getElementById('txt-architect-lives').textContent = '1 ' + t('life');
  document.getElementById('txt-recruit-type').textContent = t('mcq');
  document.getElementById('txt-engineer-type').textContent = t('mixed');
  document.getElementById('txt-architect-type').textContent = t('expert');
  // Leaderboard
  document.getElementById('txt-leaderboard').textContent = '🏆 ' + t('leaderboard');
  document.getElementById('txt-lb-all').textContent = t('lb_all');
  // HUD
  document.getElementById('txt-hud-score').textContent = t('score');
  document.getElementById('txt-hud-combo').textContent = t('combo');
  // Results
  document.getElementById('txt-res-score-label').textContent = t('result_score');
  document.getElementById('txt-res-correct-label').textContent = t('result_correct');
  document.getElementById('txt-res-combo-label').textContent = t('result_combo');
  document.getElementById('txt-res-time-label').textContent = t('result_time');
  document.getElementById('txt-accuracy').textContent = t('accuracy');
  document.getElementById('txt-speed').textContent = t('speed');
  document.getElementById('txt-history-title').textContent = t('game_history');
  document.getElementById('txt-menu').textContent = t('menu');
  document.getElementById('txt-play-again').textContent = t('play_again');
}
