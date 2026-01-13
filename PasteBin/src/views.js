export function homePage() {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Pastebin</title>
</head>
<body style="
  margin:0;
  min-height:100vh;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  display:flex;
  align-items:center;
  justify-content:center;
  color:white;
">

  <div style="
    width: 620px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(14px);
    border-radius: 18px;
    padding: 28px;
    box-shadow: 0 25px 70px rgba(0,0,0,0.5);
  ">
    
    <h1 style="margin:0 0 16px 0; font-size:28px;">Pastebin</h1>

    <textarea id="content" placeholder="Write your paste here..." style="
      width:100%;
      min-height:120px;
      max-height:400px;
      background:#0f172a;
      border:1px solid #334155;
      border-radius:12px;
      padding:14px;
      color:white;
      font-size:15px;
      outline:none;
      resize:vertical;
      box-sizing:border-box;
    "></textarea>

    <div style="display:flex; gap:12px; margin-top:14px;">
      <input id="ttl" placeholder="TTL seconds (optional)" style="
        flex:1;
        background:#0f172a;
        border:1px solid #334155;
        border-radius:10px;
        padding:12px;
        color:white;
        outline:none;
      "/>

      <input id="views" placeholder="Max views (optional)" style="
        flex:1;
        background:#0f172a;
        border:1px solid #334155;
        border-radius:10px;
        padding:12px;
        color:white;
        outline:none;
      "/>
    </div>

    <button onclick="createPaste()" style="
      width:100%;
      margin-top:18px;
      padding:14px;
      border:none;
      border-radius:14px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color:white;
      font-size:16px;
      font-weight:600;
      cursor:pointer;
      box-shadow: 0 10px 30px rgba(99,102,241,0.4);
    ">
      Create Paste
    </button>

    <div id="result" style="margin-top:16px; font-size:14px;"></div>
  </div>

<script>
async function createPaste() {
  const content = document.getElementById("content").value;
  const ttl = document.getElementById("ttl").value;
  const views = document.getElementById("views").value;
  const result = document.getElementById("result");

  const body = { content };
  if (ttl) body.ttl_seconds = Number(ttl);
  if (views) body.max_views = Number(views);

  try {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      result.innerHTML = "<span style='color:#f87171'>" + (data.error || "Error") + "</span>";
      return;
    }

    result.innerHTML = \`
      <div style="color:#a7f3d0;">Paste created</div>
      <a href="\${data.url}" style="color:#93c5fd;">\${data.url}</a>
    \`;
  } catch {
    result.innerHTML = "<span style='color:#f87171'>Server error</span>";
  }
}
</script>
</body>
</html>
`;
}

export function pastePage(content) {
  return `
<!DOCTYPE html>
<html>
<body style="
  margin:0;
  min-height:100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color:white;
  font-family: 'Segoe UI', system-ui, sans-serif;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
">

  <div style="
    width: 700px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(14px);
    border-radius: 18px;
    padding: 28px;
    box-shadow: 0 25px 70px rgba(0,0,0,0.5);
  ">
    <pre style="
      margin:0;
      white-space:pre-wrap;
      word-break:break-word;
      font-size:15px;
      line-height:1.6;
    ">${content.replace(/</g, "&lt;")}</pre>
  </div>

</body>
</html>
`;
}