// PayFast Integration for HoodRevenge (CLIENT-SIDE ONLY)
const PAYFAST_CONFIG = {
  merchant_id: "33273073", // optional to keep public, remove if you prefer
  sandbox_url: "https://sandbox.payfast.co.za/eng/process",
  live_url: "https://www.payfast.co.za/eng/process",
  return_url: "https://hoodrevenge.co.za/payment-success.html",
  cancel_url: "https://hoodrevenge.co.za/payment-cancelled.html",
  notify_url: "https://hoodrevenge.co.za/payment-notify.php",
};

function initiatePayFastPayment(orderData) {
  console.log("🚀 Sending order to server for PayFast:", orderData);

  // POST order data to server endpoint that holds merchant_key securely
  fetch("/create-payfast-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  })
    .then((res) => res.text())
    .then((html) => {
      // open server-rendered page (auto-submits to PayFast)
      const win = window.open("", "_blank");
      win.document.open();
      win.document.write(html);
      win.document.close();
    })
    .catch((err) => {
      console.error("Error initiating PayFast payment:", err);
      alert("Payment initiation failed. Please try again.");
    });
}

window.initiatePayFastPayment = initiatePayFastPayment;
window.PAYFAST_CONFIG = PAYFAST_CONFIG;

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Choose sandbox or live
const PAYFAST_URL =
  process.env.PAYFAST_ENV === "LIVE"
    ? process.env.PAYFAST_LIVE_URL || "https://www.payfast.co.za/eng/process"
    : process.env.PAYFAST_SANDBOX_URL ||
      "https://sandbox.payfast.co.za/eng/process";

app.post("/create-payfast-payment", (req, res) => {
  const order = req.body || {};
  const fields = {
    merchant_id: process.env.MERCHANT_ID,
    merchant_key: process.env.MERCHANT_KEY, // SECRET - server only
    amount: (order.total || 0).toFixed(2),
    item_name: `HoodRevenge Order #${Date.now()}`,
    item_description: (order.items || [])
      .map((i) => `${i.name} x${i.quantity}`)
      .join(", "),
    name_first: order.customer?.firstName || "",
    name_last: order.customer?.lastName || "",
    email_address: order.customer?.email || "",
    return_url: process.env.RETURN_URL,
    cancel_url: process.env.CANCEL_URL,
    notify_url: process.env.NOTIFY_URL,
  };

  const inputs = Object.keys(fields)
    .map(
      (k) =>
        `<input type="hidden" name="${k}" value="${String(fields[k] || "")}">`,
    )
    .join("\n");

  const html = `<!doctype html>
  <html><head><meta charset="utf-8"><title>Redirecting to PayFast</title></head>
  <body>
    <form id="pf" action="${PAYFAST_URL}" method="POST">
      ${inputs}
    </form>
    <script>document.getElementById('pf').submit();</script>
  </body></html>`;

  res.send(html);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`PayFast helper server listening on http://localhost:${PORT}`),
);
