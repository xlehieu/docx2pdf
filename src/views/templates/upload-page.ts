import { layout } from './layout'; 
 
export function renderUploadPage(errorMessage?: string): string { 
  const errorHtml = errorMessage 
    ? `<div class="error-banner">${escapeHtml(errorMessage)}</div>` 
    : ''; 
 
  const body = ` 
    <h1>Convert DOCX &rarr; PDF</h1> 
    <p class="subtitle">Kéo thả hoặc chọn nhiều file .docx, hệ thống sẽ convert bằng LibreOffice.</p> 
    ${errorHtml} 
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
 
      <label class="path-label" for="outputDir">Lưu PDF vào đường dẫn (để trống = lưu tạm trên server)</label> 
      <input 
        id="outputDir" 
        class="path-input" 
        type="text" 
        name="outputDir" 
        placeholder="Ví dụ: E:\\THPT NQ" 
        autocomplete="off" 
      /> 
 
      <button id="submitBtn" type="submit" disabled>Convert sang PDF</button> 
      <div id="loading"><div class="spinner"></div><span>Đang convert, vui lòng chờ...</span></div> 
    </form> 
 
    <style>
      /* Khoảng cách cho banner lỗi */
      .error-banner {
        margin-bottom: 20px !important;
      }
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
    </style>

    <script> 
      const input = document.getElementById('fileInput'); 
      const dropzone = document.getElementById('dropzone'); 
      const fileList = document.getElementById('fileList'); 
      const submitBtn = document.getElementById('submitBtn'); 
      const form = document.getElementById('uploadForm'); 
      const loading = document.getElementById('loading'); 
 
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