export function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style>
  :root {
    --bg: #0b1117;
    --card: #121b24;
    --panel: #17232e;
    --border: #2a3a48;
    --text: #edf4f5;
    --muted: #91a4ad;
    --accent: #4fd1c5;
    --accent-hover: #78e0d4;
    --accent-ink: #062522;
    --ok: #3ecf8e;
    --err: #ff6b6b;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Segoe UI", Tahoma, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }
  .card {
    width: 100%;
    max-width: 720px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 36px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, .22);
  }
  .eyebrow { color: var(--accent); font-size: 11px; font-weight: 700; letter-spacing: .14em; margin-bottom: 10px; }
  h1 {
    font-size: 28px;
    line-height: 1.1;
    margin: 0 0 8px;
  }
  p.subtitle {
    color: var(--muted);
    margin: 0 0 28px;
    font-size: 14px;
    line-height: 1.55;
  }
  .tool { padding-top: 4px; }
  .tool + .tool { border-top: 1px solid var(--border); margin-top: 34px; padding-top: 30px; }
  .tool-heading { margin-bottom: 18px; }
  .tool-heading h2 { font-size: 18px; margin: 0 0 6px; }
  .tool-heading p { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.5; }
  .dropzone {
    border: 1px dashed var(--border);
    border-radius: 10px;
    padding: 34px 20px;
    text-align: center;
    cursor: pointer;
    background: rgba(255,255,255,.015);
    transition: border-color .15s ease, background .15s ease, transform .15s ease;
  }
  .dropzone.dragover {
    border-color: var(--accent);
    background: rgba(79, 209, 197, .08);
    transform: translateY(-1px);
  }
  .dropzone svg { margin-bottom: 12px; opacity: .8; }
  .dropzone .main-text { font-size: 15px; margin-bottom: 4px; }
  .dropzone .sub-text { font-size: 13px; color: var(--muted); }
  input[type=file] { display: none; }
  .field { margin-top: 18px; }
  .path-label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--muted);
}
.path-input {
  width: 100%;
  padding: 11px 13px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
}
.path-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(79,209,197,.12); }
.path-input::placeholder { color: #607480; }
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
    background: var(--panel);
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
    color: var(--accent-ink);
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: background .15s ease, transform .15s ease;
  }
  button:hover:not(:disabled), .btn:hover { background: var(--accent-hover); transform: translateY(-1px); }
  button:disabled { opacity: .5; cursor: not-allowed; }
  .btn.secondary { background: transparent; border: 1px solid var(--border); color: var(--text); }
  .btn.secondary:hover { background: var(--panel); }
  .result-list { display: flex; flex-direction: column; gap: 10px; margin: 24px 0; }
  .result-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--panel);
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
  .stack-actions { display: flex; gap: 10px; }
  .stack-actions .btn { flex: 1; }
  .result-actions { display: flex; align-items: center; gap: 14px; }
  @media (max-width: 560px) {
    body { padding: 18px 12px; align-items: flex-start; }
    .card { padding: 24px 18px; }
    h1 { font-size: 24px; }
    .stack-actions { flex-direction: column; }
  }
</style>
</head>
<body>
  <div class="card">
    ${body}
  </div>
</body>
</html>`;
}
