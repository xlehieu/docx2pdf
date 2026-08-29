import { layout } from './layout';

export interface ResultViewItem {
  name: string;
  success: boolean;
  error?: string;
  downloadUrl: string | null;
}

export function renderResultPage(items: ResultViewItem[], savedPath: string | null = null): string {
  const okCount = items.filter((i) => i.success).length;

  const savedPathBanner = savedPath
    ? `<div class="saved-banner">📁 Đã lưu PDF vào: <code>${escapeHtml(savedPath)}</code></div>`
    : '';

  const rows = items
    .map((item) => {
      const dot = item.success ? '<span class="dot ok"></span>' : '<span class="dot err"></span>';
      const badge = item.success
        ? '<span class="badge-ok">Thành công</span>'
        : `<span class="badge-err" title="${escapeHtml(item.error || '')}">Lỗi</span>`;
      const download = item.downloadUrl
        ? `<a class="download-link" href="${item.downloadUrl}" download>Tải PDF</a>`
        : '';
      return `
        <div class="result-row">
          <div class="name">${dot}<span>${escapeHtml(item.name)}</span></div>
          <div style="display:flex; align-items:center; gap:14px;">
            ${badge}
            ${download}
          </div>
        </div>`;
    })
    .join('');

  const body = `
    <h1>Kết quả convert</h1>
    <p class="summary">${okCount}/${items.length} file convert thành công</p>
    ${savedPathBanner}
    <div class="result-list">${rows}</div>
    <a class="btn secondary" href="/">Convert file khác</a>
  `;

  return layout('Kết quả convert', body);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}