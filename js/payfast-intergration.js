// PayFast Integration for HoodRevenge
const PAYFAST_CONFIG = {
  // YOUR REAL MERCHANT DETAILS
  merchant_id: "33273073",
  merchant_key: "iolpc8h7re5ve",

  // Use SANDBOX for testing until verification complete
  sandbox_url: "https://sandbox.payfast.co.za/eng/process",
  live_url: "https://www.payfast.co.za/eng/process",

  // Your website URLs
  return_url: "https://hoodrevenge.co.za/payment-success.html",
  cancel_url: "https://hoodrevenge.co.za/payment-cancelled.html",
  notify_url: "https://hoodrevenge.co.za/payment-notify.php",
};

function initiatePayFastPayment(orderData) {
  console.log("🚀 Initiating PayFast payment:", orderData);

  const payFastData = {
    // Your merchant credentials
    merchant_id: PAYFAST_CONFIG.merchant_id,
    merchant_key: PAYFAST_CONFIG.merchant_key,

    // Order details
    amount: orderData.total.toFixed(2),
    item_name: `HoodRevenge Order #${Date.now()}`,
    item_description: orderData.items
      .map((item) => `${item.name} (Size: ${item.size}) x${item.quantity}`)
      .join(", "),

    // Customer details
    name_first: orderData.customer.firstName,
    name_last: orderData.customer.lastName,
    email_address: orderData.customer.email,

    // URLs
    return_url: PAYFAST_CONFIG.return_url,
    cancel_url: PAYFAST_CONFIG.cancel_url,
    notify_url: PAYFAST_CONFIG.notify_url,

    // Payment settings
    payment_method: "cc,bt,eft", // Credit card, bank transfer, instant EFT
    subscription_type: "1", // One-time payment
  };

  // Create and submit PayFast form
  createPayFastForm(payFastData);
}

function createPayFastForm(data) {
  // Create form element
  const form = document.createElement("form");
  form.method = "POST";
  form.action = PAYFAST_CONFIG.sandbox_url; // Use sandbox for now
  form.style.display = "none";

  // Add all PayFast fields as hidden inputs
  Object.keys(data).forEach((key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = data[key];
    form.appendChild(input);
  });

  // Add form to page and submit
  document.body.appendChild(form);
  console.log("💳 Submitting PayFast form...", data);
  form.submit();

  // Clean up
  setTimeout(() => {
    if (form.parentNode) {
      document.body.removeChild(form);
    }
  }, 1000);
}

// Export for use in other files
window.initiatePayFastPayment = initiatePayFastPayment;
window.PAYFAST_CONFIG = PAYFAST_CONFIG;
