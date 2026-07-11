const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const list = (items) => `<ul class="lab-list">${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;

export function renderCasePages(caseData) {
  renderOverview(caseData);
  renderContract(caseData);
  renderDocuments(caseData);
}

function renderOverview(caseData) {
  const overview = document.getElementById('case-overview');
  const timeline = document.getElementById('case-timeline');
  if (!overview || !timeline) return;

  overview.innerHTML = `
    <article class="lab-panel lab-panel-span">
      <div class="lab-panel-title"><i class="fas fa-scale-balanced"></i> ${esc(caseData.caseTitle)}</div>
      <p>${esc(caseData.summary)}</p>
      <div class="lab-meta-grid">
        <span><strong>المؤسسة:</strong> ${esc(caseData.institution)}</span>
        <span><strong>القانون:</strong> ${esc(caseData.applicableLaw)}</span>
        <span><strong>المقر:</strong> ${esc(caseData.seat)}</span>
        <span><strong>اللغة:</strong> ${esc(caseData.language)}</span>
      </div>
    </article>
    ${caseData.parties
      .map(
        (party) => `
        <article class="lab-panel">
          <div class="lab-panel-kicker">${esc(party.role)}</div>
          <h3>${esc(party.name)}</h3>
          <p>${esc(party.description)}</p>
          <div class="lab-mini-line"><i class="fas fa-location-dot"></i>${esc(party.address)}</div>
          <div class="lab-mini-line"><i class="fas fa-user-tie"></i>${esc(party.representative)}</div>
          <p class="lab-muted">${esc(party.position)}</p>
        </article>`
      )
      .join('')}
    <article class="lab-panel">
      <div class="lab-panel-title"><i class="fas fa-file-invoice-dollar"></i> مطالبات المدعية</div>
      ${list(caseData.claims.claimant)}
    </article>
    <article class="lab-panel">
      <div class="lab-panel-title"><i class="fas fa-shield-halved"></i> دفوع وطلبات المدعى عليها</div>
      ${list(caseData.claims.respondent)}
    </article>
    <article class="lab-panel lab-panel-span">
      <div class="lab-panel-title"><i class="fas fa-circle-question"></i> المسائل القانونية</div>
      ${list(caseData.legalIssues)}
    </article>
  `;

  timeline.innerHTML = `
    <div class="lab-panel-title"><i class="fas fa-timeline"></i> الخط الزمني للنزاع</div>
    <div class="lab-timeline-list">
      ${caseData.timeline
        .map(
          (item, index) => `
          <div class="lab-timeline-item">
            <div class="lab-timeline-num">${index + 1}</div>
            <div>
              <div class="lab-timeline-date">${esc(item.date)}</div>
              <div class="lab-timeline-event">${esc(item.event)}</div>
            </div>
          </div>`
        )
        .join('')}
    </div>
  `;
}

function renderContract(caseData) {
  const root = document.getElementById('contract-view');
  if (!root) return;

  root.innerHTML = `
    <div class="lab-section-grid">
      <article class="lab-panel">
        <div class="lab-panel-title"><i class="fas fa-file-signature"></i> بيانات العقد</div>
        <div class="lab-meta-stack">
          <span><strong>العقد:</strong> ${esc(caseData.contract.title)}</span>
          <span><strong>التاريخ:</strong> ${esc(caseData.contract.date)}</span>
          <span><strong>القيمة:</strong> ${esc(caseData.contract.price)}</span>
          <span><strong>تاريخ الإنجاز:</strong> ${esc(caseData.contract.completionDate)}</span>
        </div>
      </article>
      <article class="lab-panel">
        <div class="lab-panel-title"><i class="fas fa-helmet-safety"></i> نطاق الأعمال</div>
        <p>${esc(caseData.contract.scope)}</p>
      </article>
      <article class="lab-panel">
        <div class="lab-panel-title"><i class="fas fa-money-check-dollar"></i> الدفعات والإخطارات</div>
        <p>${esc(caseData.contract.payment)}</p>
        <p>${esc(caseData.contract.notices)}</p>
      </article>
      <article class="lab-panel">
        <div class="lab-panel-title"><i class="fas fa-handshake"></i> الإجراء السابق للتحكيم</div>
        <p>${esc(caseData.contract.preArbitration)}</p>
      </article>
      <article class="lab-panel lab-panel-span arbitration-clause">
        <div class="lab-panel-title"><i class="fas fa-gavel"></i> شرط التحكيم</div>
        <p>${esc(caseData.contract.arbitrationClause)}</p>
      </article>
    </div>
  `;
}

function renderDocuments(caseData) {
  const root = document.getElementById('documents-view');
  if (!root) return;

  root.innerHTML = `
    <div class="lab-section-grid">
      <article class="lab-panel lab-panel-span">
        <div class="lab-panel-title"><i class="fas fa-envelope-open-text"></i> المراسلات الجوهرية</div>
        <div class="lab-doc-list">
          ${caseData.correspondence
            .map(
              (item) => `
              <div class="lab-doc-item">
                <div class="lab-doc-type">${esc(item.type)}</div>
                <h3>${esc(item.title)}</h3>
                <p>${esc(item.excerpt)}</p>
              </div>`
            )
            .join('')}
        </div>
      </article>
      <article class="lab-panel">
        <div class="lab-panel-title"><i class="fas fa-bell"></i> الإخطارات</div>
        ${caseData.notices
          .map(
            (notice) => `
            <div class="lab-notice">
              <strong>${esc(notice.title)}</strong>
              <span>${esc(notice.date)}</span>
              <p>${esc(notice.legalSignificance)}</p>
            </div>`
          )
          .join('')}
      </article>
      <article class="lab-panel">
        <div class="lab-panel-title"><i class="fas fa-paperclip"></i> المستندات المؤيدة</div>
        ${list(caseData.supportingDocuments)}
      </article>
      <article class="lab-panel lab-panel-span">
        <div class="lab-panel-title"><i class="fas fa-list-check"></i> الوقائع التي ينبغي تحويلها إلى صياغة قانونية</div>
        ${list(caseData.facts)}
      </article>
    </div>
  `;
}
