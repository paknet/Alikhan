// Example voucher list
const vouchers = ["VOUCHER001", "VOUCHER002", "VOUCHER003"];



function checkVoucher() {
  const voucher = document.getElementById("voucher").value.trim();

  if (vouchers.includes(voucher)) {
    alert("Voucher valid!");
  } else {
    alert("Voucher invalid or expired!");
  }
}
