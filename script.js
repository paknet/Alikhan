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
