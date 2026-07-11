/* ============================================================
   ARBITRATION INTERACTIVE LECTURE — SCRIPT.JS
   ============================================================ */

// ============================================================
// SLIDE DATA & STATE
// ============================================================
const SLIDE_INDEX_MAP = {
  0:0, 1:1,
  2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8,
  9:9, 10:10, 11:11, 12:12, 13:13, 14:14, 15:15,
  16:16, 17:17, 18:18, 19:19, 20:20, 21:21, 22:22, 23:23,
  24:24, 25:25, 26:26, 27:27, 28:28, 29:29, 30:30, 31:31, 32:32,
  33:33, 41:34, 49:35, 56:36, 57:37, 58:38, 59:39, 60:40
};

const slideIds = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,41,49,56,57,58,59,60];

let currentSlideIdx = 0;
const quizStates = {};

const searchIndex = [
  { slide: 0, title: "الصفحة الرئيسية", text: "بدء إجراءات التحكيم عرض تفاعلي احترافي الدكتور أحمد محمد عبدالسلام" },
  { slide: 1, title: "أهداف المحاضرة", text: "التمييز بين الخصومة التحكيمية والقضائية مراحل بدء الخصومة يوجد مشكله فى ال     طلب التحكيم الصفة الأهلية الدفوع الجلسة الإجرائية" },
  { slide: 2, title: "المحور الأول – ماهية الخصومة", text: "ماهية الخصومة التحكيمية طبيعتها الإجرائية تعريف" },
  { slide: 3, title: "دراسة حالة – متى بدأت الخصومة؟", text: "شركة مقاولات شرط التحكيم خطاب مطالبة تفاوض طلب تحكيم" },
  { slide: 4, title: "تعريف الخصومة التحكيمية والعناصر الخمسة", text: "رابطة إجرائية اتفاق تحكيم نزاع أطراف طلب إجراءات المواجهة حق الدفاع" },
  { slide: 5, title: "الطبيعة المركبة للتحكيم", text: "أصلها اتفاقي وظيفتها قضائية نظامها إجرائي خاص ضمانات قضائية" },
  { slide: 6, title: "التحكيم والوساطة – المقارنة", text: "وساطة تحكيم وسيط حل رضائي حكم ملزم اتفاق" },
  { slide: 7, title: "الخصومة التحكيمية مقابل القضائية", text: "مصدر السلطة قواعد إجرائية مرونة علانية سرية" },
  { slide: 8, title: "قانون المرافعات في التحكيم", text: "متى نستدعي قانون المرافعات تعيين محكم تدابير وقتية بطلان تنفيذ عصف ذهني" },
  { slide: 9, title: "المحور الثاني – الإجراءات السابقة", text: "الإجراءات السابقة اللجوء إلى التحكيم تفاوض وساطة خبير مهلة" },
  { slide: 10, title: "الطبيعة القانونية للإجراءات السابقة", text: "شرط إجرائي التزام تعاقدي اختصاص jurisdiction قبول admissibility مقبولية" },
  { slide: 11, title: "قضية C ضد D – هونغ كونغ", text: "C v D 2022 2023 هونغ كونغ إجراء تمهيدي رئيس تنفيذي 60 يوم" },
  { slide: 12, title: "قضية Emirates Trading – إنجلترا", text: "Emirates Trading Prime Mineral EWHC 2014 تفاوض ودي 4 أسابيع" },
  { slide: 13, title: "القضية السويسرية 4A_124/2014", text: "سويسرا FIDIC DAB لجنة فض منازعات 15 شهر 84 يوم" },
  { slide: 14, title: "حكم دائرة التمييز دبي 1308/2020", text: "الإمارات دبي التمييز 2021 FIDIC الكتاب الأحمر بند تحكيم صريح إحالة عامة" },
  { slide: 15, title: "أثر الغموض وصياغة الشروط", text: "غياب الشرط الشرط الغامض الملزم الوضوح التحديد الربط الجزاء" },
  { slide: 16, title: "المحور الثالث – بدء الإجراءات", text: "بدء إجراءات التحكيم تاريخ انعقاد الخصومة" },
  { slide: 17, title: "المراحل الثلاث من الاتفاق إلى الخصومة", text: "اتفاق التحكيم نشوء النزاع بدء الإجراءات المراحل الثلاث" },
  { slide: 18, title: "تاريخ بدء الخصومة التحكيمية", text: "تاريخ الإرسال التسلم العلم الفعلي التقادم الأونسيترال التحكيم المؤسسي" },
  { slide: 19, title: "الإخطار بطلب التحكيم", text: "إخطار بريد مسجل تسليم مباشر بريد إلكتروني مواجهة spam" },
  { slide: 20, title: "الآثار القانونية لبدء الإجراءات", text: "انعقاد الخصومة تحديد نطاق النزاع التقادم القانون الإجرائي الاختصاص الزمني" },
  { slide: 21, title: "ورشة عمل – الإخطار الإلكتروني والتقادم", text: "1 مارس 2 مارس 3 مارس 5 مارس تقادم بريد إلكتروني خادم" },
  { slide: 22, title: "الإشكالات العملية في مرحلة البدء", text: "الامتناع عمدًا العنوان القديم وفاة تعديل الطلبات تعدد المدعى عليهم التحكيم الإلكتروني" },
  { slide: 23, title: "اختبار المحور الثالث", text: "اختبار quiz اختيار من متعدد صح خطأ" },
  { slide: 24, title: "المحور الرابع – طلب التحكيم والرد", text: "طلب التحكيم الرد ماهية وظيفة إجرائية" },
  { slide: 25, title: "ماهية طلب التحكيم", text: "أول عمل إجرائي تحريك الخصومة الوظيفة افتتاح أطراف موضوع" },
  { slide: 26, title: "طلب التحكيم مقابل صحيفة الدعوى", text: "مقارنة يقدم استناد قواعد شكليات مرونة" },
  { slide: 27, title: "البيانات الجوهرية لطلب التحكيم", text: "أطراف اتفاق وقائع طلبات أساس قانوني محكم مستندات جوهرية تنظيمية" },
  { slide: 28, title: "تعديل طلب التحكيم", text: "تعديل زيادة إنقاص سبب قانوني وقائع سلطة تقديرية حق الدفاع" },
  { slide: 29, title: "الرد على طلب التحكيم وأثر السكوت", text: "رد وقائع طلبات دفوع مقابل محكم مواجهة سكوت إقرار" },
  { slide: 30, title: "ورشة – تعديل الطلبات أو طلب جديد؟", text: "مليون جنيه 500 ألف تعويض تعديل طلب جديد حق الدفاع" },
  { slide: 31, title: "ورشة – المدعى عليه الصامت", text: "إعلان صحيح رد غياب سكوت إقرار عبء الإثبات استمرار" },
  { slide: 32, title: "اختبار المحور الرابع", text: "اختبار صح خطأ وظيفة طلب التحكيم" },
  { slide: 33, title: "المحور الخامس – أطراف الخصومة", text: "أطراف صفة أهلية تمثيل قانوني ممثل شركة" },
  { slide: 41, title: "المحور السادس – الدفوع الأولية", text: "دفوع اختصاص قبول Kompetenz admissibility jurisdiction" },
  { slide: 49, title: "المحور السابع – الجلسة الإجرائية الأولى", text: "جلسة إجرائية أولى ضمانات تنظيم دستور الخصومة" },
  { slide: 56, title: "محاكاة التحكيم الكاملة", text: "محاكاة مدعي مدعى عليه محكم أمين سر حكم" },
  { slide: 57, title: "ملف القضية العملية", text: "قضية مقاولات عقد تصميم وتنفيذ أطراف وقائع جدول زمني مطالبات مسائل قانونية" },
  { slide: 58, title: "العقد وشرط التحكيم", text: "عقد مقاولات شرط تحكيم مركز القاهرة الإقليمي القانون المصري مقر القاهرة لغة عربية إخطار تفاوض" },
  { slide: 59, title: "المراسلات والإخطارات والمستندات", text: "إخطارات مطالبة إخلال تعليق أعمال مستندات مؤيدة شهادة دفع أوامر تغيير محاضر اجتماعات" },
  { slide: 60, title: "تمارين الصياغة القانونية", text: "طلب التحكيم الرد على طلب التحكيم الأمر الإجرائي الأول محرر قانوني PDF تقييم AI" }
];

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  updateSlideCounter();
  updateNavHighlight();
  updateProgressBars();
  createParticles();
  setupWheelNavigation();
  setupTouchNavigation();
  setupKeyboardShortcuts();
  checkSidebarState();
});

// ============================================================
// SLIDE NAVIGATION
// ============================================================
function getSlideElement(slideId) {
  return document.getElementById('slide-' + slideId);
}

function goToSlide(slideId) {
  const newIdx = slideIds.indexOf(slideId);
  if (newIdx === -1) return;

  const currentId = slideIds[currentSlideIdx];
  const currentEl = getSlideElement(currentId);
  const newEl = getSlideElement(slideId);

  if (!newEl || currentId === slideId) return;

  // Determine direction
  const goingForward = newIdx > currentSlideIdx;

  // Animate out current
  if (currentEl) {
    currentEl.classList.remove('active');
    if (goingForward) {
      currentEl.classList.add('exit-up');
      setTimeout(() => {
        currentEl.classList.remove('exit-up');
      }, 500);
    }
  }

  // Animate in new
  newEl.classList.add('active');

  currentSlideIdx = newIdx;

  setTimeout(() => {
    updateSlideCounter();
    updateNavHighlight();
    updateProgressBars();
    reinitAnimations(newEl);
  }, 50);
}

function nextSlide() {
  if (currentSlideIdx < slideIds.length - 1) {
    goToSlide(slideIds[currentSlideIdx + 1]);
  }
}

function prevSlide() {
  if (currentSlideIdx > 0) {
    goToSlide(slideIds[currentSlideIdx - 1]);
  }
}

// ============================================================
// WHEEL NAVIGATION
// ============================================================
let wheelTimeout = null;
function setupWheelNavigation() {
  const container = document.getElementById('slides-container');
  container.addEventListener('wheel', (e) => {
    const slide = document.querySelector('.slide.active');
    if (!slide) return;
    const content = slide.querySelector('.slide-content');
    if (content) {
      const atTop = content.scrollTop <= 0;
      const atBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - 5;
      if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) return;
    }
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      if (e.deltaY > 60) nextSlide();
      else if (e.deltaY < -60) prevSlide();
    }, 50);
  }, { passive: true });
}

// ============================================================
// TOUCH NAVIGATION
// ============================================================
let touchStartY = 0;
function setupTouchNavigation() {
  const container = document.getElementById('slides-container');
  container.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  container.addEventListener('touchend', (e) => {
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 60) {
      if (dy > 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (document.getElementById('search-modal') && !document.getElementById('search-modal').classList.contains('hidden')) {
      if (e.key === 'Escape') closeSearch();
      return;
    }
    switch(e.key) {
      case 'ArrowDown': case 'ArrowLeft': nextSlide(); break;
      case 'ArrowUp': case 'ArrowRight': prevSlide(); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case 's': case 'S': openSearch(); break;
      case 'd': case 'D': toggleTheme(); break;
    }
  });
}

// ============================================================
// UPDATE UI
// ============================================================
function updateSlideCounter() {
  const total = slideIds.length;
  document.getElementById('current-num').textContent = currentSlideIdx + 1;
  document.getElementById('total-num').textContent = total;
  document.getElementById('btn-prev').disabled = currentSlideIdx === 0;
  document.getElementById('btn-next').disabled = currentSlideIdx === total - 1;
}

function updateNavHighlight() {
  const currentId = slideIds[currentSlideIdx];
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    const ds = parseInt(item.dataset.slide);
    // Highlight the nav item whose slide is the last one <= currentId
    if (ds === currentId || (ds <= currentId && !item.nextElementSibling?.dataset?.slide)) {
      item.classList.add('active');
    }
  });
  // Simple: just match exact
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  const navItem = document.querySelector(`.nav-item[data-slide="${currentId}"]`);
  if (navItem) {
    navItem.classList.add('active');
  } else {
    // Find closest previous
    let closest = null;
    document.querySelectorAll('.nav-item[data-slide]').forEach(item => {
      const ds = parseInt(item.dataset.slide);
      if (ds <= currentId) closest = item;
    });
    if (closest) closest.classList.add('active');
  }
}

function updateProgressBars() {
  const pct = Math.round((currentSlideIdx / (slideIds.length - 1)) * 100);
  document.getElementById('reading-bar').style.width = pct + '%';
  document.getElementById('sidebar-progress-fill').style.width = pct + '%';
  document.getElementById('sidebar-progress-pct').textContent = pct + '%';
}

// ============================================================
// SIDEBAR
// ============================================================
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
sidebarToggle.addEventListener('click', () => {
  if (window.innerWidth <= 900) {
    sidebar.classList.toggle('mobile-open');
  } else {
    sidebar.classList.toggle('collapsed');
  }
});

document.querySelectorAll('.nav-item[data-slide]').forEach(item => {
  item.addEventListener('click', () => {
    const slideId = parseInt(item.dataset.slide);
    goToSlide(slideId);
    if (window.innerWidth <= 900) sidebar.classList.remove('mobile-open');
  });
});

function checkSidebarState() {
  if (window.innerWidth <= 900) {
    sidebar.classList.add('collapsed');
  }
}

// ============================================================
// THEME
// ============================================================
let darkMode = true;
function toggleTheme() {
  darkMode = !darkMode;
  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  document.getElementById('btn-theme').innerHTML = darkMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}
document.getElementById('btn-theme').addEventListener('click', toggleTheme);

// ============================================================
// FULLSCREEN
// ============================================================
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    document.getElementById('btn-fullscreen').innerHTML = '<i class="fas fa-compress"></i>';
  } else {
    document.exitFullscreen();
    document.getElementById('btn-fullscreen').innerHTML = '<i class="fas fa-expand"></i>';
  }
}
document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);

// ============================================================
// SEARCH
// ============================================================
function openSearch() {
  document.getElementById('search-modal').classList.remove('hidden');
  setTimeout(() => document.getElementById('search-input').focus(), 100);
}

function closeSearch() {
  document.getElementById('search-modal').classList.add('hidden');
  document.getElementById('search-input').value = '';
  document.getElementById('search-results').innerHTML = '';
}

document.getElementById('btn-search').addEventListener('click', openSearch);

document.getElementById('search-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('search-modal')) closeSearch();
});

function performSearch(query) {
  const container = document.getElementById('search-results');
  if (!query.trim()) { container.innerHTML = ''; return; }
  const q = query.trim().toLowerCase();
  const results = searchIndex.filter(item =>
    item.title.toLowerCase().includes(q) || item.text.toLowerCase().includes(q)
  );
  if (results.length === 0) {
    container.innerHTML = '<div class="no-results">لا توجد نتائج مطابقة</div>';
    return;
  }
  container.innerHTML = results.slice(0, 8).map(r => `
    <div class="search-result" onclick="goToSlide(${r.slide}); closeSearch();">
      <div class="sr-title-text">${r.title}</div>
      <div class="sr-excerpt">${r.text.substring(0, 80)}...</div>
      <span class="sr-badge">الشريحة ${slideIds.indexOf(r.slide) + 1}</span>
    </div>
  `).join('');
}

// ============================================================
// ANSWER REVEAL (Case Studies)
// ============================================================
function revealAnswer(answerId, selectedOpt, btn) {
  const container = btn.closest('.question-box');
  const answerDiv = document.getElementById(answerId);
  const correctOpt = answerDiv.dataset.correct;
  const allBtns = container.querySelectorAll('.opt-btn');

  allBtns.forEach(b => {
    const opt = b.getAttribute('onclick').match(/opt_[a-z]/)?.[0];
    if (opt === correctOpt) b.classList.add('correct-chosen');
    else if (opt === selectedOpt && opt !== correctOpt) b.classList.add('wrong-chosen');
    b.disabled = true;
  });

  answerDiv.classList.remove('hidden');
}

// ============================================================
// BRAINSTORM TOGGLE
// ============================================================
function toggleBs(el) {
  el.classList.toggle('open');
  const ans = el.nextElementSibling;
  if (ans) ans.classList.toggle('open');
}

// ============================================================
// DISCUSS TOGGLE
// ============================================================
function toggleDiscuss(el) {
  el.classList.toggle('open');
  const ans = el.nextElementSibling;
  if (ans && ans.classList.contains('discuss-a')) ans.classList.toggle('open');
}

// ============================================================
// ACCORDION
// ============================================================
function toggleAcc(head) {
  const item = head.parentElement;
  item.classList.toggle('open');
}

// ============================================================
// QUIZ ENGINE
// ============================================================
function initQuiz(quizId) {
  if (!quizStates[quizId]) {
    quizStates[quizId] = {
      currentQ: 0,
      answers: {},
      total: document.querySelectorAll(`#quiz-${quizId} .quiz-question`).length
    };
  }
}

function selectQuizOpt(optEl, quizId, qIndex) {
  initQuiz(quizId);
  const state = quizStates[quizId];
  if (state.answers[qIndex] !== undefined) return; // Already answered

  const isCorrect = optEl.dataset.correct === 'true';
  const container = optEl.closest('.quiz-question');
  const feedback = container.querySelector('.q-feedback');
  const allOpts = container.querySelectorAll('.q-opt');

  // Mark all options
  allOpts.forEach(o => {
    o.style.pointerEvents = 'none';
    if (o.dataset.correct === 'true') o.classList.add('show-correct');
  });

  if (isCorrect) {
    optEl.classList.add('chosen-correct');
    feedback.className = 'q-feedback correct-fb';
    feedback.textContent = '✓ إجابة صحيحة! أحسنت.';
  } else {
    optEl.classList.add('chosen-wrong');
    feedback.className = 'q-feedback wrong-fb';
    feedback.textContent = '✗ إجابة غير صحيحة. راجع المحتوى ثم حاول مجددًا.';
  }

  feedback.classList.remove('hidden');
  state.answers[qIndex] = isCorrect;

  // Check if all answered
  if (Object.keys(state.answers).length === state.total) {
    showScore(quizId);
  }
}

function nextQuestion(quizId) {
  initQuiz(quizId);
  const state = quizStates[quizId];
  const questions = document.querySelectorAll(`#quiz-${quizId} .quiz-question`);
  if (state.currentQ < questions.length - 1) {
    questions[state.currentQ].classList.remove('active-q');
    state.currentQ++;
    questions[state.currentQ].classList.add('active-q');
    updateDots(quizId, state.currentQ);
    updateQuizNav(quizId);
  }
}

function prevQuestion(quizId) {
  initQuiz(quizId);
  const state = quizStates[quizId];
  const questions = document.querySelectorAll(`#quiz-${quizId} .quiz-question`);
  if (state.currentQ > 0) {
    questions[state.currentQ].classList.remove('active-q');
    state.currentQ--;
    questions[state.currentQ].classList.add('active-q');
    updateDots(quizId, state.currentQ);
    updateQuizNav(quizId);
  }
}

function jumpQuestion(quizId, idx) {
  initQuiz(quizId);
  const state = quizStates[quizId];
  const questions = document.querySelectorAll(`#quiz-${quizId} .quiz-question`);
  questions[state.currentQ].classList.remove('active-q');
  state.currentQ = idx;
  questions[idx].classList.add('active-q');
  updateDots(quizId, idx);
  updateQuizNav(quizId);
}

function updateDots(quizId, activeIdx) {
  const dots = document.querySelectorAll(`#dots-${quizId} .dot`);
  dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
}

function updateQuizNav(quizId) {
  const state = quizStates[quizId];
  const questions = document.querySelectorAll(`#quiz-${quizId} .quiz-question`);
  const prevBtn = document.querySelector(`#quiz-${quizId} .quiz-prev`);
  const nextBtn = document.querySelector(`#quiz-${quizId} .quiz-next`);
  if (prevBtn) prevBtn.disabled = state.currentQ === 0;
  if (nextBtn) nextBtn.disabled = state.currentQ === questions.length - 1;
}

function showScore(quizId) {
  const state = quizStates[quizId];
  const scoreEl = document.getElementById('score-' + quizId);
  if (!scoreEl) return;
  const correct = Object.values(state.answers).filter(Boolean).length;
  const total = state.total;
  const pct = Math.round((correct / total) * 100);
  let msg = '';
  if (pct === 100) msg = '🎉 ممتاز! أجبت على جميع الأسئلة بشكل صحيح!';
  else if (pct >= 70) msg = '👍 جيد! أداء مقبول. راجع الإجابات الخاطئة.';
  else msg = '📚 يحتاج مراجعة. راجع المحتوى وحاول مجددًا.';

  scoreEl.innerHTML = `
    <div style="color: var(--accent3)">درجتك: ${correct} / ${total} (${pct}%)</div>
    <div style="font-size:14px; color: var(--text2); margin-top:8px; font-weight:400">${msg}</div>
  `;
  scoreEl.classList.remove('hidden');
}

// ============================================================
// PARTICLES
// ============================================================
function createParticles() {
  const container = document.getElementById('slide-0');
  if (!container) return;
  let particleDiv = container.querySelector('.particles');
  if (!particleDiv) return;

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    particleDiv.appendChild(p);
  }
}

// ============================================================
// SIMULATION
// ============================================================
const simulationSteps = {
  claimant: [
    { title: 'دراسة العقد واتفاق التحكيم', desc: 'تحقق من وجود شرط التحكيم وصحته وتحديد المركز المختص.' },
    { title: 'استيفاء الإجراءات السابقة', desc: 'تأكد من استيفاء أي إجراءات تمهيدية يشترطها العقد (تفاوض، إخطار).' },
    { title: 'إعداد طلب التحكيم', desc: 'أعدَّ طلبًا يتضمن: بيانات الأطراف، اتفاق التحكيم، الوقائع، الطلبات، الأساس القانوني، المستندات.' },
    { title: 'تعيين المحكم', desc: 'عيِّن محكمك وفق الاتفاق أو قواعد المركز.' },
    { title: 'إيداع الطلب وسداد الرسوم', desc: 'قدِّم طلب التحكيم للمركز مع سداد رسوم التسجيل.' },
    { title: 'الإخطار بالطلب', desc: 'تأكد من إخطار المدعى عليه إخطارًا صحيحًا وفق القانون والاتفاق.' }
  ],
  respondent: [
    { title: 'استلام إخطار التحكيم', desc: 'اقرأ طلب التحكيم بعناية وحدد مواعيد الرد.' },
    { title: 'دراسة الدفوع المتاحة', desc: 'ادرس: الدفع بعدم الاختصاص، الدفع بعدم القبول، الدفوع الموضوعية.' },
    { title: 'تعيين المحكم', desc: 'عيِّن محكمك في الميعاد المحدد.' },
    { title: 'إعداد الرد', desc: 'رد على الوقائع والطلبات، أبدِ دفوعك الشكلية والموضوعية، وقدِّم طلباتك المقابلة.' },
    { title: 'تقديم الرد والمستندات', desc: 'قدِّم ردك في الميعاد المحدد مع جميع المستندات المؤيدة.' }
  ],
  arbitrator: [
    { title: 'قبول مهمة التحكيم والإفصاح', desc: 'أفصح عن أي تعارض مصالح وأكِّد استقلالك وحيادك.' },
    { title: 'الجلسة الإجرائية الأولى', desc: 'حدِّد نطاق النزاع، جدول الإجراءات، قواعد الإثبات، مواعيد المذكرات.' },
    { title: 'إصدار الأمر الإجرائي الأول', desc: 'وثِّق كل ما اتفق عليه في الجلسة في أمر إجرائي ملزم.' },
    { title: 'إدارة الجلسات الموضوعية', desc: 'اسمع أطراف النزاع، فحص الأدلة، استجوب الشهود والخبراء.' },
    { title: 'المداولة وإصدار الحكم', desc: 'داوِل مع زملائك المحكمين وأصدر حكمًا مسببًا في حدود الطلبات.' }
  ],
  secretary: [
    { title: 'تسجيل طلب التحكيم', desc: 'سجِّل الطلب في قيود المركز وأرسل إيصال الاستلام للأطراف.' },
    { title: 'تشكيل ملف القضية', desc: 'أنشئ ملفًا يضم كل المراسلات والمستندات والوثائق.' },
    { title: 'تنسيق الجلسات', desc: 'رتِّب لمواعيد الجلسات وأخطِر الأطراف بها.' },
    { title: 'تدوين المحاضر', desc: 'دوِّن محاضر الجلسات بدقة وأرسلها للأطراف والمحكمين.' },
    { title: 'متابعة تنفيذ الأوامر الإجرائية', desc: 'تأكد من التزام الأطراف بالمواعيد والإجراءات المقررة.' },
    { title: 'أرشفة حكم التحكيم', desc: 'احتفظ بنسخة رسمية من حكم التحكيم في ملفات المركز.' }
  ]
};

function startSimulation(role) {
  const simArea = document.getElementById('simulation-area');
  const simSteps = document.getElementById('sim-steps');
  const steps = simulationSteps[role];
  const roleNames = { claimant: 'المدعي', respondent: 'المدعى عليه', arbitrator: 'المحكَّم', secretary: 'أمين السر' };

  simArea.innerHTML = `
    <div class="sim-scenario">
      <div class="ss-title"><i class="fas fa-user"></i> دورك: ${roleNames[role]}</div>
      <p>شركة البناء (أ) أبرمت عقدًا مع شركة التطوير (ب) لإنشاء مجمع تجاري. نزاع حول مستحقات مالية بقيمة 5 مليون جنيه. العقد يتضمن شرط تحكيم لدى مركز القاهرة الإقليمي.</p>
    </div>
    <div id="sim-steps"></div>
    <div style="display:flex; gap:10px; margin-top:1rem; flex-wrap:wrap;">
      <button class="continue-btn" onclick="startSimulation('${role}')"><i class="fas fa-redo"></i> إعادة</button>
      <button class="continue-btn" onclick="document.getElementById('simulation-area').classList.add('hidden')"><i class="fas fa-times"></i> إغلاق</button>
    </div>
  `;

  simArea.classList.remove('hidden');

  const container = document.getElementById('sim-steps');
  steps.forEach((step, i) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'sim-step';
      div.innerHTML = `
        <div class="sim-step-num">${i + 1}</div>
        <div>
          <div class="sim-step-title">${step.title}</div>
          <div class="sim-step-desc">${step.desc}</div>
        </div>
      `;
      container.appendChild(div);
    }, i * 300);
  });
}

// ============================================================
// RE-INIT ANIMATIONS ON SLIDE ENTER
// ============================================================
function reinitAnimations(slideEl) {
  if (!slideEl) return;
  const animEls = slideEl.querySelectorAll('.animate-card, .animate-fadeup, .stage-block, .effect-card, .prob-card');
  animEls.forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = '';
  });
}

// ============================================================
// SMOOTH SIDEBAR NAVIGATION SCROLL
// ============================================================
window.addEventListener('resize', () => {
  checkSidebarState();
});
