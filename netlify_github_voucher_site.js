ZIP Contents (ready-to-upload):

voucher-site/
├── index.html
├── script.js
└── netlify/
    └── functions/
        └── verify-voucher.js

---

index.html:
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Voucher Checker</title>
  </head>
  <body>
    <h2>Enter Voucher</h2>
    <input id="voucher" placeholder="Voucher code">
    <button onclick="checkVoucher()">Check</button>
    <p id="result"></p>
    <script src="script.js"></script>
  </body>
</html>

---

script.js:
async function checkVoucher() {
  const code = document.getElementById("voucher").value.trim();
  const result = document.getElementById("result");
  result.textContent = "Checking...";

  const res = await fetch("/.netlify/functions/verify-voucher", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  });

  const data = await res.json();
  if (data.valid) {
    result.textContent = `✅ Valid! Profile: ${data.profile}`;
  } else {
    result.textContent = "❌ Invalid voucher!";
  }
}

---

netlify/functions/verify-voucher.js:
import fetch from "node-fetch";

export async function handler(event) {
  const { code } = JSON.parse(event.body || "{}");
  if (!code) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing code" }) };
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const owner = "paknet";
  const repo = "vouchers.db";

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/vouchers.json`,
      {
        headers: { Authorization: `token ${githubToken}` }
      }
    );

    const data = await res.json();
    const fileContent = Buffer.from(data.content, "base64").toString("utf8");
    const vouchers = JSON.parse(fileContent);

    const profile = vouchers[code];
    const valid = !!profile;

    return {
      statusCode: 200,
      body: JSON.stringify({ valid, profile: valid ? profile : null })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
