const express = require("express");
const cors = require("cors");
require("dotenv").config(); // ensure this exists near top
console.log(
  "Loaded MERCHANT_KEY:",
  process.env.MERCHANT_KEY
    ? process.env.MERCHANT_KEY.slice(0, 2) +
        "***" +
        process.env.MERCHANT_KEY.slice(-2)
    : "<<none>>",
);

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
  console.log("POST /create-payfast-payment received:", JSON.stringify(order)); // <-- add this line
  const fields = {
    merchant_id: process.env.MERCHANT_ID,
    merchant_key: process.env.MERCHANT_KEY, // SECRET - keep server only
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

  const merchantKey =
    process.env.MERCHANT_KEY || "REPLACE_WITH_YOUR_SECRET_KEY";

  const html = `<!doctype html>
  <html><head><meta charset="utf-8"><title>Redirecting to PayFast</title></head>
  <body>
    <form id="pf" action="${PAYFAST_URL}" method="POST">
      <input type="hidden" name="merchant_id" value="${process.env.MERCHANT_ID}">
      <input type="hidden" name="merchant_key" value="${fields.merchant_key || merchantKey}">
      <input type="hidden" name="amount" value="${(order.total || 0).toFixed(2)}">
      <input type="hidden" name="item_name" value="HoodRevenge Order #${Date.now()}">
      <input type="hidden" name="item_description" value="${(order.items || [])
        .map((i) => `${i.name} x${i.quantity}`)
        .join(", ")}">
      <input type="hidden" name="name_first" value="${order.customer?.firstName || ""}">
      <input type="hidden" name="name_last" value="${order.customer?.lastName || ""}">
      <input type="hidden" name="email_address" value="${order.customer?.email || ""}">
      <input type="hidden" name="return_url" value="${process.env.RETURN_URL}">
      <input type="hidden" name="cancel_url" value="${process.env.CANCEL_URL}">
      <input type="hidden" name="notify_url" value="${process.env.NOTIFY_URL}">
    </form>
    <script>document.getElementById('pf').submit();</script>
  </body></html>`;

  res.send(html);
});

// simple health check for GET /
app.get("/", (req, res) => {
  res.send(
    "PayFast helper server is running. Use POST /create-payfast-payment to test.",
  );
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`PayFast helper server listening on http://localhost:${PORT}`),
);
