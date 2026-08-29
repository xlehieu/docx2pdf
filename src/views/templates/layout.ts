export function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style>
  :root {
    --bg: #0f1115;
    --card: #171a21;
    --border: #262b35;
    --text: #e8eaed;
    --muted: #9aa3af;
    --accent: #5b8cff;
    --accent-hover: #7ea0ff;
    --ok: #3ecf8e;
    --err: #ff6b6b;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .card {
    width: 100%;
    max-width: 640px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
  }
  h1 {
    font-size: 20px;
    margin: 0 0 4px;
  }
  p.subtitle {
    color: var(--muted);
    margin: 0 0 24px;
    font-size: 14px;
  }
  .dropzone {
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color .15s ease, background .15s ease;
  }
  .dropzone.dragover {
    border-color: var(--accent);
    background: rgba(91, 140, 255, 0.08);
  }
  .dropzone svg { margin-bottom: 12px; opacity: .8; }
  .dropzone .main-text { font-size: 15px; margin-bottom: 4px; }
  .dropzone .sub-text { font-size: 13px; color: var(--muted); }
  input[type=file] { display: none; }
  .path-label {
  display: block;
  margin-top: 20px;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--muted);
}
.path-input {
  width: 100%;
  padding: 10px 14px;
  background: #1d212b;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
}
.path-input:focus {
  outline: none;
  border-color: var(--accent);
}
.path-input::placeholder { color: #5c6472; }
  #fileList {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .file-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #1d212b;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
  }
  .file-row .name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 8px; }
  .file-row .size { color: var(--muted); flex-shrink: 0; }
  button, .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    margin-top: 20px;
    padding: 12px 20px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: background .15s ease;
  }
  button:hover, .btn:hover { background: var(--accent-hover); }
  button:disabled { opacity: .5; cursor: not-allowed; }
  .btn.secondary { background: transparent; border: 1px solid var(--border); color: var(--text); }
  .btn.secondary:hover { background: #1d212b; }
  .result-list { display: flex; flex-direction: column; gap: 10px; margin: 24px 0; }
  .result-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #1d212b;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 14px;
  }
  .result-row .name { display: flex; align-items: center; gap: 10px; overflow: hidden; }
  .result-row .name span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .badge-ok { color: var(--ok); font-weight: 600; font-size: 13px; }
  .badge-err { color: var(--err); font-weight: 600; font-size: 13px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .dot.ok { background: var(--ok); }
  .dot.err { background: var(--err); }
  .download-link { color: var(--accent); text-decoration: none; font-weight: 600; font-size: 13px; flex-shrink: 0; }
  .download-link:hover { text-decoration: underline; }
  .error-banner {
    background: rgba(255,107,107,0.1);
    border: 1px solid rgba(255,107,107,0.3);
    color: var(--err);
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 20px;
  }
  .summary { color: var(--muted); font-size: 13px; margin-bottom: 8px; }
  .saved-banner {
  background: rgba(62,207,142,0.1);
  border: 1px solid rgba(62,207,142,0.3);
  color: var(--ok);
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  margin-bottom: 20px;
  word-break: break-all;
}
.saved-banner code { color: var(--text); font-family: "SF Mono", Menlo, monospace; }
  #loading {
    display: none;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    color: var(--muted);
    font-size: 14px;
  }
  #loading.active { display: flex; }
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>
  <div class="card">
    ${body}
  </div>
</body>
</html>`;
}
