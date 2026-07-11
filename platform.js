import { LAB_CASE } from './case-file.js';
import { renderCasePages } from './case-renderer.js';
import { initLegalEditor } from './legal-editor.js';

const ready = (callback) => {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback);
  else callback();
};

ready(async () => {
  window.aslCaseData = LAB_CASE;

  try {
    renderCasePages(LAB_CASE);
    enhanceSimulationSlide(LAB_CASE);
  } catch (error) {
    console.error('Case rendering failed:', error);
  }

  try {
    initLegalEditor({ caseData: LAB_CASE });
  } catch (error) {
    console.error('Legal editor failed to initialize:', error);
  }

});

function enhanceSimulationSlide(caseData) {
  const slide = document.getElementById('slide-56');
  if (!slide) return;

  const title = slide.querySelector('.slide-title');
  const desc = slide.querySelector('.slide-desc');
  const scenario = slide.querySelector('.sim-scenario p');

  if (title) title.textContent = 'محاكاة بدء إجراءات التحكيم';
  if (desc) desc.textContent = `طبّق المحاضرة على ${caseData.shortTitle}: من دراسة الملف إلى طلب التحكيم والرد والأمر الإجرائي الأول.`;
  if (scenario) scenario.textContent = caseData.summary;

  const roles = slide.querySelector('.simulation-roles');
  if (roles && !slide.querySelector('.lab-sim-actions')) {
    const actions = document.createElement('div');
    actions.className = 'lab-actions-row lab-sim-actions';
    actions.innerHTML = `
      <button class="continue-btn" type="button" onclick="goToSlide(57)"><i class="fas fa-folder-open"></i> ملف القضية</button>
      <button class="continue-btn" type="button" onclick="goToSlide(58)"><i class="fas fa-file-contract"></i> شرط التحكيم</button>
      <button class="continue-btn" type="button" onclick="goToSlide(60)"><i class="fas fa-pen-nib"></i> تمارين الصياغة</button>
    `;
    roles.insertAdjacentElement('afterend', actions);
  }

  window.startSimulation = (role) => renderRoleWorkflow(role, caseData);
}

function renderRoleWorkflow(role, caseData) {
  const simArea = document.getElementById('simulation-area');
  if (!simArea) return;

  const roleNames = {
    claimant: 'محامي المدعية',
    respondent: 'محامي المدعى عليها',
    arbitrator: 'هيئة التحكيم',
    secretary: 'أمين سر المركز'
  };

  const workflows = {
    claimant: [
      ['تحقق من شرط التحكيم', `استند إلى شرط CRCICA ومقر القاهرة واللغة العربية في عقد ${caseData.contract.title}.`],
      ['أثبت استيفاء التسوية الودية', 'اربط إخطار 20 سبتمبر واجتماعي 3 و12 أكتوبر بانقضاء مهلة 21 يومًا.'],
      ['حدد تاريخ بدء الإجراءات', 'اجعل 18 نوفمبر 2025 تاريخًا مقترحًا لإيداع/إخطار طلب التحكيم.'],
      ['صغ الطلبات الأولية', 'اطلب شهادة الدفع، أوامر التغيير، تمديد المدة، أثر خطاب الضمان، الفوائد والمصاريف.'],
      ['أرفق المستندات الجوهرية', 'العقد، شهادة الدفع، أوامر التغيير، محاضر الاجتماعات، وإخطار تسييل الضمان.']
    ],
    respondent: [
      ['راجع الاختصاص والقبول', 'اختبر أثر شرط التسوية الودية وعرض بعض المطالبات على المهندس قبل التحكيم.'],
      ['أجب على الوقائع تحديدًا', 'ميز بين التأخير المنسوب للمدعية والتأخير الناتج عن تسليم الموقع أو التغييرات.'],
      ['أثبت الدفوع الفنية', 'استند إلى تقارير غرف المضخات وبرنامج الموارد وغرامات التأخير.'],
      ['صغ الطلبات المقابلة', 'اطلب غرامات التأخير وتكاليف الإصلاح مع حفظ الحق في طلبات إضافية.'],
      ['اقترح تنظيمًا إجرائيًا', 'اطلب جدولًا يتيح تبادل المستندات الفنية والخبرة إن لزم.']
    ],
    arbitrator: [
      ['ثبت بيانات التحكيم', 'القواعد، المقر، اللغة، القانون الواجب التطبيق، ووسائل الإخطار.'],
      ['حدد نطاق النزاع', 'لا تفصل في الموضوع، بل سجل المطالبات والدفوع والطلبات المقابلة.'],
      ['نظم تبادل المذكرات', 'ضع مواعيد طلب التحكيم المفصل والرد والرد على الطلبات المقابلة.'],
      ['اضبط الإثبات والمستندات', 'حدد صيغة الملفات، الترجمة عند اللزوم، وسرية المستندات الفنية.'],
      ['احفظ ضمانات الدفاع', 'المساواة، حق الرد، وإمكانية تعديل الجدول بقرار من الهيئة.']
    ],
    secretary: [
      ['سجل الطلب', 'افتح ملف ASL-ARB-2026-001 وتحقق من بيانات الأطراف وسداد رسوم التسجيل.'],
      ['تابع الإخطارات', 'أثبت وسيلة وتاريخ إرسال وتسلم طلب التحكيم وفق بيانات العقد.'],
      ['أنشئ ملف المستندات', 'صنف العقد والمراسلات والإخطارات والمستندات الفنية في سجل واحد.'],
      ['نسق تشكيل الهيئة', 'تابع تسمية المحكمين وقبول المهمة والإفصاحات.'],
      ['حضر الجلسة الإجرائية', 'اجمع مقترحات الأطراف للجدول الإجرائي وأرسل مشروع الأمر الأول.']
    ]
  };

  simArea.innerHTML = `
    <div class="sim-scenario">
      <div class="ss-title"><i class="fas fa-user"></i> دورك: ${roleNames[role] || 'مشارك'}</div>
      <p>${caseData.caseNumber} - ${caseData.caseTitle}</p>
    </div>
    <div id="sim-steps"></div>
    <div class="lab-actions-row">
      <button class="continue-btn" type="button" onclick="startSimulation('${role}')"><i class="fas fa-redo"></i> إعادة</button>
      <button class="continue-btn" type="button" onclick="goToSlide(57)"><i class="fas fa-folder-open"></i> ملف القضية</button>
      <button class="continue-btn" type="button" onclick="goToSlide(60)"><i class="fas fa-pen-nib"></i> مهمة الصياغة</button>
      <button class="continue-btn" type="button" onclick="document.getElementById('simulation-area').classList.add('hidden')"><i class="fas fa-times"></i> إغلاق</button>
    </div>
  `;

  simArea.classList.remove('hidden');
  const container = document.getElementById('sim-steps');
  (workflows[role] || []).forEach(([title, desc], index) => {
    setTimeout(() => {
      const item = document.createElement('div');
      item.className = 'sim-step';
      item.innerHTML = `
        <div class="sim-step-num">${index + 1}</div>
        <div>
          <div class="sim-step-title">${title}</div>
          <div class="sim-step-desc">${desc}</div>
        </div>
      `;
      container.appendChild(item);
    }, index * 220);
  });
}
