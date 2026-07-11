const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const slug = (value) =>
  String(value || 'document')
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

export function buildLegalDocumentHtml({ caseData, profile = {}, task, bodyHtml, createdAt = new Date() }) {
  const created = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const creationTime = created.toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });

  return `
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>${esc(task.documentTitle)} - ${esc(caseData.caseNumber)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;600;700&family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 18mm 16mm 22mm; }
    body {
      margin: 0;
      color: #111827;
      background: #ffffff;
      direction: rtl;
      font-family: "Noto Naskh Arabic", "Amiri", "IBM Plex Sans Arabic", serif;
      font-size: 13.5pt;
      line-height: 1.9;
    }
    .doc {
      width: 100%;
      max-width: 182mm;
      margin: 0 auto;
      background: #ffffff;
    }
    .doc-header {
      border-bottom: 2px solid #111827;
      padding-bottom: 10mm;
      margin-bottom: 8mm;
      text-align: center;
    }
    .platform {
      font-family: "IBM Plex Sans Arabic", sans-serif;
      font-size: 11pt;
      letter-spacing: 0;
      color: #4b5563;
    }
    h1 {
      font-size: 22pt;
      margin: 4mm 0 2mm;
      font-weight: 700;
    }
    .case-title {
      font-size: 12.5pt;
      color: #374151;
    }
    .meta {
      width: 100%;
      border-collapse: collapse;
      margin: 6mm 0 8mm;
      font-family: "IBM Plex Sans Arabic", sans-serif;
      font-size: 10.5pt;
    }
    .meta th,
    .meta td {
      border: 1px solid #d1d5db;
      padding: 2.5mm 3mm;
      vertical-align: top;
      text-align: right;
    }
    .meta th {
      width: 28%;
      background: #f3f4f6;
      font-weight: 700;
    }
    .body {
      min-height: 150mm;
    }
    .body h1, .body h2, .body h3 {
      color: #111827;
      page-break-after: avoid;
      margin: 7mm 0 3mm;
      line-height: 1.5;
    }
    .body h2 { font-size: 17pt; }
    .body h3 { font-size: 15pt; }
    .body p { margin: 0 0 3.5mm; }
    .body table {
      width: 100%;
      border-collapse: collapse;
      margin: 5mm 0;
    }
    .body td,
    .body th {
      border: 1px solid #9ca3af;
      padding: 2mm;
    }
    .signature {
      margin-top: 15mm;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16mm;
      font-family: "IBM Plex Sans Arabic", sans-serif;
      font-size: 11pt;
    }
    .signature-line {
      border-top: 1px solid #111827;
      padding-top: 3mm;
      min-height: 18mm;
    }
    .footer {
      margin-top: 12mm;
      border-top: 1px solid #d1d5db;
      padding-top: 3mm;
      color: #6b7280;
      font-family: "IBM Plex Sans Arabic", sans-serif;
      font-size: 9.5pt;
      display: flex;
      justify-content: space-between;
      gap: 8mm;
    }
  </style>
</head>
<body>
  <main class="doc">
    <header class="doc-header">
      <div class="platform">${esc(caseData.platformName)}</div>
      <h1>${esc(task.documentTitle)}</h1>
      <div class="case-title">${esc(caseData.caseNumber)} - ${esc(caseData.caseTitle)}</div>
    </header>
    <table class="meta">
      <tr><th>Platform Name</th><td>${esc(caseData.platformName)}</td></tr>
      <tr><th>Document Title</th><td>${esc(task.documentTitle)}</td></tr>
      <tr><th>Case Number</th><td>${esc(profile.caseNumber || caseData.caseNumber)}</td></tr>
      <tr><th>Case Title</th><td>${esc(profile.caseTitle || caseData.caseTitle)}</td></tr>
      <tr><th>Student Name</th><td>${esc(profile.studentName)}</td></tr>
      <tr><th>Student ID</th><td>${esc(profile.studentId || 'غير وارد')}</td></tr>
      <tr><th>Course Name</th><td>${esc(profile.courseName)}</td></tr>
      <tr><th>Instructor Name</th><td>${esc(profile.instructorName)}</td></tr>
      <tr><th>Institution</th><td>${esc(profile.institution)}</td></tr>
      <tr><th>Applicable Law</th><td>${esc(profile.applicableLaw)}</td></tr>
      <tr><th>Seat of Arbitration</th><td>${esc(profile.seat)}</td></tr>
      <tr><th>Language</th><td>${esc(profile.language)}</td></tr>
      <tr><th>Date</th><td>${esc(profile.date)}</td></tr>
      <tr><th>Creation Time</th><td>${esc(creationTime)}</td></tr>
    </table>
    <section class="body">${bodyHtml || '<p></p>'}</section>
    <section class="signature">
      <div class="signature-line">توقيع الطالب</div>
      <div class="signature-line">ملاحظات المدرب</div>
    </section>
    <footer class="footer">
      <span>Generated by Arbitration Simulation Lab</span>
      <span>Page numbers are applied by the PDF renderer/print dialog.</span>
    </footer>
  </main>
</body>
</html>`;
}

export async function downloadLegalPdf({ caseData, profile = {}, task, bodyHtml }) {
  const documentHtml = buildLegalDocumentHtml({ caseData, profile, task, bodyHtml });
  const filename = `${slug(caseData.caseNumber)}-${slug(task.documentTitle)}-${slug(profile.studentName || 'student')}.pdf`;

  if (window.html2pdf) {
    const root = document.getElementById('pdf-render-root') || document.body;
    const host = document.createElement('div');
    host.className = 'pdf-render-host';
    host.innerHTML = documentHtml;
    root.appendChild(host);

    const docElement = host.querySelector('.doc');
    const worker = window.html2pdf()
      .set({
        margin: [12, 10, 16, 10],
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      })
      .from(docElement)
      .toPdf();

    await worker.get('pdf').then((pdf) => {
      const totalPages = pdf.internal.getNumberOfPages();
      pdf.setFontSize(9);
      pdf.setTextColor(90, 90, 90);
      for (let page = 1; page <= totalPages; page += 1) {
        pdf.setPage(page);
        pdf.text(`${page} / ${totalPages}`, 105, 292, { align: 'center' });
      }
    });

    await worker.save();
    host.remove();
    return;
  }

  const printWindow = window.open('', '_blank', 'width=900,height=1200');
  if (!printWindow) throw new Error('تعذر فتح نافذة الطباعة. تحقق من إعدادات المتصفح.');
  printWindow.document.open();
  printWindow.document.write(documentHtml);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
}

export async function printLegalDocument({ caseData, profile = {}, task, bodyHtml }) {
  const documentHtml = buildLegalDocumentHtml({ caseData, profile, task, bodyHtml });
  const printWindow = window.open('', '_blank', 'width=900,height=1200');
  if (!printWindow) throw new Error('تعذر فتح نافذة الطباعة. تحقق من إعدادات المتصفح.');
  printWindow.document.open();
  printWindow.document.write(documentHtml);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
}

export function downloadHtmlFile({ html, filename }) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'arbitration-simulation-lab-document.html';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
