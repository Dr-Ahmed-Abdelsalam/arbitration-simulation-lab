import { buildLegalDocumentHtml, downloadLegalPdf, printLegalDocument } from './pdf.js';

const PROFILE_KEY = 'asl_student_profile';
const SUBMISSIONS_KEY = 'asl_student_submissions';

const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const stripUnsafeHtml = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html || '';
  template.content.querySelectorAll('script, style, iframe, object, embed, link, meta').forEach((node) => node.remove());
  template.content.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attr) => {
      if (attr.name.startsWith('on')) node.removeAttribute(attr.name);
      if (attr.name === 'style' && /expression|url\(/i.test(attr.value)) node.removeAttribute(attr.name);
    });
  });
  return template.innerHTML;
};

const today = () => new Date().toISOString().slice(0, 10);

const getSavedProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
  } catch {
    return null;
  }
};

const setSavedProfile = (profile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

const getSubmissions = () => {
  try {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  } catch {
    return [];
  }
};

const setSubmissions = (items) => {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(items));
};

const draftKeyFor = (taskId, profile) => `asl_draft_${taskId}_${profile.email || profile.studentName || 'student'}`;

export function initLegalEditor({ caseData }) {
  const root = document.getElementById('writing-lab');
  const modal = document.getElementById('student-info-modal');
  const profileForm = document.getElementById('student-info-form');
  const profileStatus = document.getElementById('student-info-status');
  let pendingTaskId = null;
  let currentTask = null;

  if (!root || !profileForm) return;

  root.innerHTML = `
    <div class="lab-task-grid">
      ${caseData.tasks
        .map(
          (task, index) => `
          <article class="lab-task-card">
            <div class="lab-task-number">${index + 1}</div>
            <h3>${esc(task.arabicTitle)}</h3>
            <p>${esc(task.prompt)}</p>
            <div class="lab-task-role"><i class="fas fa-user-tie"></i>${esc(task.role)}</div>
            <button class="continue-btn" type="button" data-open-task="${esc(task.id)}">
              <i class="fas fa-pen-nib"></i> فتح المحرر
            </button>
          </article>`
        )
        .join('')}
    </div>
    <div id="editor-shell" class="legal-editor-shell hidden"></div>
  `;

  root.querySelectorAll('[data-open-task]').forEach((button) => {
    button.addEventListener('click', () => openTask(button.dataset.openTask));
  });

  document.querySelector('[data-close-student-modal]')?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });

  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const profile = Object.fromEntries(new FormData(profileForm).entries());
    profile.updatedAt = Date.now();
    setSavedProfile(profile);
    profileStatus.textContent = 'تم حفظ بيانات الطالب.';
    profileStatus.dataset.type = 'success';
    modal?.classList.add('hidden');
    if (pendingTaskId) renderEditor(pendingTaskId);
  });

  function openTask(taskId) {
    pendingTaskId = taskId;
    const profile = getSavedProfile();
    if (!profile) {
      fillProfileDefaults();
      modal?.classList.remove('hidden');
      return;
    }
    renderEditor(taskId);
  }

  function fillProfileDefaults() {
    const saved = getSavedProfile() || {};
    const defaults = {
      studentName: '',
      studentId: '',
      email: '',
      courseName: caseData.courseName,
      instructorName: caseData.instructorName,
      caseNumber: caseData.caseNumber,
      caseTitle: caseData.caseTitle,
      institution: caseData.institution,
      applicableLaw: caseData.applicableLaw,
      seat: caseData.seat,
      language: caseData.language,
      date: today(),
      ...saved
    };

    Object.entries(defaults).forEach(([name, value]) => {
      const input = profileForm.elements.namedItem(name);
      if (input) input.value = value || '';
    });
    profileStatus.textContent = '';
  }

  function renderEditor(taskId) {
    currentTask = caseData.tasks.find((task) => task.id === taskId);
    const shell = document.getElementById('editor-shell');
    const profile = getSavedProfile();
    if (!currentTask || !shell || !profile) return;

    const draftKey = draftKeyFor(currentTask.id, profile);
    const draft = localStorage.getItem(draftKey) || currentTask.starterHtml;

    shell.classList.remove('hidden');
    shell.innerHTML = `
      <aside class="editor-brief">
        <div class="lab-panel-title"><i class="fas fa-list-check"></i> متطلبات المهمة</div>
        <h3>${esc(currentTask.arabicTitle)}</h3>
        <p>${esc(currentTask.prompt)}</p>
        <ul class="lab-list">
          ${currentTask.checklist.map((item) => `<li>${esc(item)}</li>`).join('')}
        </ul>
        <div class="ai-placeholder">
          <i class="fas fa-wand-magic-sparkles"></i>
          <span>البنية جاهزة للتقييم الآلي مستقبلًا: الصياغة، المنطق، الاكتمال، والبناء القانوني.</span>
        </div>
      </aside>
      <section class="editor-panel">
        <div class="editor-topline">
          <div>
            <div class="lab-panel-kicker">${esc(currentTask.role)}</div>
            <h3>${esc(currentTask.documentTitle)}</h3>
          </div>
          <button class="continue-btn compact-btn" type="button" data-edit-profile><i class="fas fa-id-card"></i> بيانات الطالب</button>
        </div>
        <div class="editor-toolbar" role="toolbar" aria-label="Arabic legal editor toolbar">
          <select data-format-block title="العناوين">
            <option value="p">نص</option>
            <option value="h2">عنوان رئيسي</option>
            <option value="h3">عنوان فرعي</option>
          </select>
          <button type="button" data-command="bold" title="غامق"><i class="fas fa-bold"></i></button>
          <button type="button" data-command="italic" title="مائل"><i class="fas fa-italic"></i></button>
          <button type="button" data-command="insertOrderedList" title="ترقيم"><i class="fas fa-list-ol"></i></button>
          <button type="button" data-command="insertUnorderedList" title="قائمة"><i class="fas fa-list-ul"></i></button>
          <button type="button" data-command="justifyRight" title="محاذاة يمين"><i class="fas fa-align-right"></i></button>
          <button type="button" data-command="justifyCenter" title="توسيط"><i class="fas fa-align-center"></i></button>
          <button type="button" data-command="justifyFull" title="ضبط"><i class="fas fa-align-justify"></i></button>
          <button type="button" data-command="insertTable" title="جدول"><i class="fas fa-table"></i></button>
          <button type="button" data-command="undo" title="تراجع"><i class="fas fa-rotate-left"></i></button>
          <button type="button" data-command="redo" title="إعادة"><i class="fas fa-rotate-right"></i></button>
        </div>
        <div id="legal-editor" class="legal-editor" contenteditable="true" dir="rtl" lang="ar" spellcheck="true">${draft}</div>
        <div class="editor-actions">
          <button class="continue-btn" type="button" data-save-draft><i class="fas fa-floppy-disk"></i> حفظ المسودة</button>
          <button class="continue-btn" type="button" data-submit-task><i class="fas fa-paper-plane"></i> تسليم المهمة</button>
          <button class="continue-btn" type="button" data-download-pdf><i class="fas fa-file-pdf"></i> تحميل PDF</button>
          <button class="continue-btn" type="button" data-print-pdf><i class="fas fa-print"></i> طباعة PDF</button>
        </div>
        <div id="editor-status" class="lab-status"></div>
      </section>
    `;

    bindEditor(shell, draftKey);
    shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function bindEditor(shell, draftKey) {
    const editor = shell.querySelector('#legal-editor');
    const status = shell.querySelector('#editor-status');

    const setStatus = (message, type = '') => {
      status.textContent = message || '';
      status.dataset.type = type;
    };

    shell.querySelector('[data-edit-profile]')?.addEventListener('click', () => {
      fillProfileDefaults();
      modal?.classList.remove('hidden');
    });

    shell.querySelector('[data-format-block]')?.addEventListener('change', (event) => {
      editor.focus();
      document.execCommand('formatBlock', false, event.target.value);
    });

    shell.querySelectorAll('[data-command]').forEach((button) => {
      button.addEventListener('click', () => {
        editor.focus();
        const command = button.dataset.command;
        if (command === 'insertTable') {
          document.execCommand('insertHTML', false, makeTableHtml());
          return;
        }
        document.execCommand(command, false, null);
      });
    });

    editor.addEventListener('input', () => {
      localStorage.setItem(draftKey, stripUnsafeHtml(editor.innerHTML));
      setStatus('تم حفظ المسودة تلقائيًا.', 'pending');
    });

    shell.querySelector('[data-save-draft]')?.addEventListener('click', () => {
      localStorage.setItem(draftKey, stripUnsafeHtml(editor.innerHTML));
      setStatus('تم حفظ المسودة على هذا الجهاز.', 'success');
    });

    shell.querySelector('[data-download-pdf]')?.addEventListener('click', async () => {
      const profile = getSavedProfile();
      try {
        setStatus('جاري إعداد ملف PDF...', 'pending');
        await downloadLegalPdf({
          caseData,
          profile,
          task: currentTask,
          bodyHtml: stripUnsafeHtml(editor.innerHTML)
        });
        setStatus('تم تجهيز ملف PDF.', 'success');
      } catch (error) {
        setStatus(error.message || 'تعذر إنشاء ملف PDF.', 'error');
      }
    });

    shell.querySelector('[data-print-pdf]')?.addEventListener('click', async () => {
      const profile = getSavedProfile();
      try {
        setStatus('جاري إعداد النسخة للطباعة...', 'pending');
        await printLegalDocument({
          caseData,
          profile,
          task: currentTask,
          bodyHtml: stripUnsafeHtml(editor.innerHTML)
        });
        setStatus('تم فتح النسخة للطباعة.', 'success');
      } catch (error) {
        setStatus(error.message || 'تعذر فتح النسخة للطباعة.', 'error');
      }
    });

    shell.querySelector('[data-submit-task]')?.addEventListener('click', () => {
      const profile = getSavedProfile();
      const bodyHtml = stripUnsafeHtml(editor.innerHTML);
      const documentHtml = buildLegalDocumentHtml({ caseData, profile, task: currentTask, bodyHtml });
      const submissions = getSubmissions();
      submissions.unshift({
        id: crypto.randomUUID?.() || String(Date.now()),
        platformName: caseData.platformName,
        lectureTitle: caseData.lectureTitle,
        caseNumber: profile.caseNumber || caseData.caseNumber,
        caseTitle: profile.caseTitle || caseData.caseTitle,
        taskId: currentTask.id,
        taskTitle: currentTask.arabicTitle,
        documentTitle: currentTask.documentTitle,
        studentName: profile.studentName,
        studentId: profile.studentId || '',
        email: profile.email || '',
        courseName: profile.courseName,
        instructorName: profile.instructorName,
        institution: profile.institution,
        applicableLaw: profile.applicableLaw,
        seat: profile.seat,
        language: profile.language,
        date: profile.date,
        bodyHtml,
        bodyText: editor.innerText,
        documentHtml,
        submittedAt: Date.now(),
        aiEvaluation: {
          status: 'pending',
          rubricVersion: 'commencement-arbitration-v1',
          score: null,
          comments: null
        }
      });
      setSubmissions(submissions);
      setStatus('تم حفظ التسليم محليًا. حالة التقييم بالذكاء الاصطناعي: pending.', 'success');
    });
  }
}

function makeTableHtml() {
  return `
    <table>
      <tbody>
        <tr><th>البند</th><th>البيان</th><th>المستند</th></tr>
        <tr><td>...</td><td>...</td><td>...</td></tr>
        <tr><td>...</td><td>...</td><td>...</td></tr>
      </tbody>
    </table>
  `;
}

window.aslGetStudentProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
  } catch {
    return null;
  }
};

window.aslGetStudentSubmissions = () => getSubmissions();
window.aslClearStudentWork = () => {
  const keys = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith('asl_')) keys.push(key);
  }
  keys.forEach((key) => localStorage.removeItem(key));
};
