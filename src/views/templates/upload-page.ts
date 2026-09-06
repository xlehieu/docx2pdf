import { layout } from './layout';

export function renderUploadPage(errorMessage?: string): string {
  const errorHtml = errorMessage
    ? `<div class="error-banner">${escapeHtml(errorMessage)}</div>`
    : '';

  const body = `
    <div class="eyebrow">DOCUMENT WORKBENCH</div>
    <h1>Chuyển đổi và làm sạch PDF</h1>
    <p class="subtitle">Hai tác vụ thường dùng, một giao diện thống nhất. Chọn công cụ phù hợp với file của bạn.</p>
    ${errorHtml}
    <section class="tool">
      <div class="tool-heading">
        <h2>DOCX sang PDF</h2>
        <p>Kéo thả hoặc chọn nhiều file .docx để convert bằng LibreOffice.</p>
      </div>
      <form id="uploadForm" action="/upload" method="post" enctype="multipart/form-data">
      <label class="dropzone" id="dropzone" for="fileInput">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9aa3af" stroke-width="1.6">
          <path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="main-text">Kéo file .docx vào đây, hoặc bấm để chọn</div>
        <div class="sub-text">Hỗ trợ chọn nhiều file cùng lúc (tối đa 50 file)</div>
      </label>
      <input id="fileInput" type="file" name="files" accept=".docx" multiple />
      <div id="fileList"></div>

      <div class="field">
        <label class="path-label" for="outputDir">Thư mục lưu PDF</label>
        <input
          id="outputDir"
          class="path-input"
          type="text"
          name="outputDir"
          placeholder="Ví dụ: E:\\THPT NQ"
          autocomplete="off"
        />
      </div>

      <button id="submitBtn" type="submit" disabled>Convert sang PDF</button>
      <div id="loading"><div class="spinner"></div><span>Đang convert, vui lòng chờ...</span></div>
      </form>
    </section>

    <section class="tool">
      <div class="tool-heading">
        <h2>PDF có mật khẩu</h2>
        <p>Nhập mật khẩu để tạo bản sao không khóa trong thư mục mới.</p>
      </div>
      <form id="pdfCopyForm" action="/copy-pdf" method="post" enctype="multipart/form-data">
        <label class="pdf-picker" for="pdfInput">
          <span class="pdf-picker-title">Chọn file PDF có mật khẩu</span>
          <span class="pdf-picker-name" id="pdfFileName">Chưa chọn file</span>
        </label>
        <input id="pdfInput" type="file" name="pdf" accept=".pdf,application/pdf" required />

        <div class="field">
          <label class="path-label" for="pdfPassword">Mật khẩu file PDF</label>
          <input id="pdfPassword" class="path-input" type="password" name="password" required autocomplete="off" />
        </div>

        <div class="field">
          <label class="path-label" for="pdfOutputDir">Thư mục lưu bản sao PDF</label>
          <input
            id="pdfOutputDir"
            class="path-input"
            type="text"
            name="outputDir"
            placeholder="Để trống = output\\pdf\\copy"
            autocomplete="off"
          />
        </div>

        <button id="pdfSubmitBtn" type="submit" disabled>Sao chép nội dung PDF</button>
        <div id="pdfLoading"><div class="spinner"></div><span>Đang xử lý PDF, vui lòng chờ...</span></div>
      </form>
    </section>

    <style>
      .error-banner { margin-bottom: 20px !important; }
      /* Ẩn input file mặc định */
      #fileInput {
        display: none !important;
      }
      /* FIX LỖI VIỀN: Ép dropzone thành khối chuẩn, tránh bị bẻ gãy khung */
      .dropzone {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .pdf-picker {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        width: 100%;
        padding: 14px 16px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--panel);
        cursor: pointer;
      }
      .pdf-picker:hover { border-color: var(--accent); }
      .pdf-picker-title { font-size: 14px; }
      .pdf-picker-name {
        color: var(--muted);
        font-size: 13px;
        max-width: 48%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #pdfInput { display: none !important; }
      #pdfLoading {
        display: none;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
        color: var(--muted);
        font-size: 14px;
      }
      #pdfLoading.active { display: flex; }
    </style>

    <script>
      const input = document.getElementById('fileInput');
      const dropzone = document.getElementById('dropzone');
      const fileList = document.getElementById('fileList');
      const submitBtn = document.getElementById('submitBtn');
      const form = document.getElementById('uploadForm');
      const loading = document.getElementById('loading');
      const pdfInput = document.getElementById('pdfInput');
      const pdfFileName = document.getElementById('pdfFileName');
      const pdfCopyForm = document.getElementById('pdfCopyForm');
      const pdfSubmitBtn = document.getElementById('pdfSubmitBtn');
      const pdfLoading = document.getElementById('pdfLoading');

      function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      }

      function renderFiles(files) {
        fileList.innerHTML = '';
        submitBtn.disabled = files.length === 0;
        [...files].forEach((f) => {
          const row = document.createElement('div');
          row.className = 'file-row';
          row.innerHTML = '<span class="name">' + f.name + '</span><span class="size">' + formatSize(f.size) + '</span>';
          fileList.appendChild(row);
        });
      }

      input.addEventListener('change', () => renderFiles(input.files));

      ['dragenter', 'dragover'].forEach((evt) => {
        dropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          dropzone.classList.add('dragover');
        });
      });
      ['dragleave', 'drop'].forEach((evt) => {
        dropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          dropzone.classList.remove('dragover');
        });
      });
      dropzone.addEventListener('drop', (e) => {
        const dropped = e.dataTransfer.files;
        input.files = dropped;
        renderFiles(dropped);
      });

      form.addEventListener('submit', () => {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang convert...';
        loading.classList.add('active');
      });

      pdfInput.addEventListener('change', () => {
        const file = pdfInput.files[0];
        pdfFileName.textContent = file ? file.name : 'Chưa chọn file';
        pdfSubmitBtn.disabled = !file;
      });

      pdfCopyForm.addEventListener('submit', () => {
        pdfSubmitBtn.disabled = true;
        pdfSubmitBtn.textContent = 'Đang sao chép...';
        pdfLoading.classList.add('active');
      });
    </script>
  `;

  return layout('Convert DOCX sang PDF', body);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}