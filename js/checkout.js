/* filepath: js/checkout.js */
// Clean Checkout JavaScript - PROFESSIONAL VERSION WITH VALIDATION
console.log("🛒 Checkout.js loaded");

// Add error styling CSS + Professional notification styles
const errorStyles = `
  .form-error {
    color: #dc3545 !important;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
    font-weight: 500;
  }
  
  .input-error {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
  }
  
  .form-group {
    position: relative;
    margin-bottom: 1.5rem;
  }

  /* Professional Error Notification */
  .error-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #dc3545;
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    z-index: 10000;
    max-width: 400px;
    transform: translateX(450px);
    transition: transform 0.3s ease-in-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .error-notification.show {
    transform: translateX(0);
  }

  .error-notification .notification-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .error-notification .notification-title {
    font-weight: 600;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .error-notification .notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .error-notification .notification-close:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .error-notification .notification-message {
    font-size: 14px;
    line-height: 1.4;
    opacity: 0.95;
  }

  .error-notification .error-icon {
    font-size: 18px;
  }

  /* Success notification variant */
  .success-notification {
    background: #28a745;
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);

// South African Cities by Province
const SA_CITIES = {
  "Western Cape": [
    "Cape Town",
    "Stellenbosch",
    "Paarl",
    "George",
    "Mossel Bay",
    "Worcester",
    "Hermanus",
  ],
  Gauteng: [
    "Johannesburg",
    "Pretoria",
    "Soweto",
    "Sandton",
    "Randburg",
    "Roodepoort",
    "Benoni",
    "Boksburg",
  ],
  "KwaZulu-Natal": [
    "Durban",
    "Pietermaritzburg",
    "Newcastle",
    "Richards Bay",
    "Ladysmith",
    "Pinetown",
  ],
  "Eastern Cape": [
    "Port Elizabeth",
    "East London",
    "Uitenhage",
    "King William's Town",
    "Mthatha",
    "Grahamstown",
  ],
  Limpopo: [
    "Polokwane",
    "Tzaneen",
    "Phalaborwa",
    "Musina",
    "Thohoyandou",
    "Giyani",
  ],
  Mpumalanga: [
    "Nelspruit",
    "Witbank",
    "Secunda",
    "Middelburg",
    "Ermelo",
    "Standerton",
  ],
  "North West": [
    "Rustenburg",
    "Klerksdorp",
    "Potchefstroom",
    "Mahikeng",
    "Brits",
  ],
  "Free State": [
    "Bloemfontein",
    "Welkom",
    "Kroonstad",
    "Bethlehem",
    "Sasolburg",
  ],
  "Northern Cape": ["Kimberley", "Upington", "Kuruman", "Springbok", "De Aar"],
};

document.addEventListener("DOMContentLoaded", function () {
  console.log("🔥 Initializing checkout page");

  // Load checkout data
  loadCheckoutData();

  // Setup form interactions
  setupFormHandlers();

  // Setup real-time validation
  setupRealTimeValidation();

  // Setup PayFast button
  setupPaymentButton();

  // Update cart count
  updateCartCount();
});

// Professional notification function
function showNotification(message, type = "error", duration = 6000) {
  // Remove existing notification
  const existingNotification = document.querySelector(
    ".error-notification, .success-notification"
  );
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className =
    type === "error"
      ? "error-notification"
      : "error-notification success-notification";

  const icon = type === "error" ? "⚠️" : "✅";
  const title = type === "error" ? "Form Validation Error" : "Success";

  notification.innerHTML = `
    <div class="notification-header">
      <div class="notification-title">
        <span class="error-icon">${icon}</span>
        ${title}
      </div>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
    <div class="notification-message">${message}</div>
  `;

  // Add to page
  document.body.appendChild(notification);

  // Show with animation
  setTimeout(() => notification.classList.add("show"), 100);

  // Auto-remove after duration
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }
  }, duration);

  console.log(`📢 ${type.toUpperCase()} notification:`, message);
}

function setupFormHandlers() {
  // Province change handler
  const provinceSelect = document.getElementById("province");
  const citySelect = document.getElementById("city");

  if (provinceSelect && citySelect) {
    provinceSelect.addEventListener("change", function () {
      const selectedProvince = this.value;
      console.log("Province changed:", selectedProvince);

      // Clear city options
      citySelect.innerHTML = '<option value="">Select City</option>';

      // Add cities for selected province
      if (selectedProvince && SA_CITIES[selectedProvince]) {
        SA_CITIES[selectedProvince].forEach((city) => {
          const option = document.createElement("option");
          option.value = city;
          option.textContent = city;
          citySelect.appendChild(option);
        });

        // Enable city dropdown
        citySelect.disabled = false;
        clearError("city");
        console.log("✅ Cities loaded for", selectedProvince);
      } else {
        citySelect.disabled = true;
      }
    });

    // Initially disable city dropdown
    citySelect.disabled = true;
  }
}

function setupRealTimeValidation() {
  // Email validation
  const emailField = document.getElementById("email");
  if (emailField) {
    emailField.addEventListener("blur", function () {
      validateEmail(this.value, "email");
    });

    emailField.addEventListener("input", function () {
      clearError("email");
    });
  }

  // Phone number validation - SA Format (+27 + 9 digits, no leading 0)
  const phoneField = document.getElementById("phone");
  if (phoneField) {
    // Set default value and placeholder
    phoneField.value = "+27 ";
    phoneField.placeholder = "+27 XX XXX XXXX";
    phoneField.setAttribute("maxlength", "13"); // +27 + space + 9 digits

    // Handle input - only allow 9 digits after +27, no leading 0
    phoneField.addEventListener("input", function (e) {
      let value = e.target.value;

      // Always ensure it starts with +27
      if (!value.startsWith("+27 ")) {
        value = "+27 ";
      }

      // Get the part after +27
      let numberPart = value.substring(4);

      // Remove any non-digit characters from the number part
      numberPart = numberPart.replace(/[^\d]/g, "");

      // Don't allow leading 0
      if (numberPart.startsWith("0")) {
        numberPart = numberPart.substring(1);
      }

      // Limit to 9 digits
      if (numberPart.length > 9) {
        numberPart = numberPart.substring(0, 9);
      }

      // Reconstruct the full number
      e.target.value = "+27 " + numberPart;
      clearError("phone");
    });

    // Prevent cursor from going before +27
    phoneField.addEventListener("keydown", function (e) {
      const cursorPosition = e.target.selectionStart;

      // Don't allow deletion of +27 part
      if (
        (e.key === "Backspace" || e.key === "Delete") &&
        cursorPosition <= 4
      ) {
        e.preventDefault();
      }
    });

    // Prevent cursor from being placed before +27
    phoneField.addEventListener("click", function (e) {
      const cursorPosition = e.target.selectionStart;
      if (cursorPosition < 4) {
        e.target.setSelectionRange(4, 4);
      }
    });

    phoneField.addEventListener("blur", function () {
      validatePhone(this.value, "phone");
    });
  }

  // First name validation
  const firstNameField = document.getElementById("firstName");
  if (firstNameField) {
    firstNameField.addEventListener("blur", function () {
      validateRequired(this.value, "firstName", "First name is required");
    });

    firstNameField.addEventListener("input", function () {
      clearError("firstName");
    });
  }

  // Last name validation
  const lastNameField = document.getElementById("lastName");
  if (lastNameField) {
    lastNameField.addEventListener("blur", function () {
      validateRequired(this.value, "lastName", "Last name is required");
    });

    lastNameField.addEventListener("input", function () {
      clearError("lastName");
    });
  }

  // Postal code validation with placeholder
  const postalCodeField = document.getElementById("postalCode");
  if (postalCodeField) {
    // Set placeholder for postal code
    postalCodeField.placeholder = "1234";

    postalCodeField.addEventListener("input", function (e) {
      // Only allow numbers, max 4 digits
      e.target.value = e.target.value.replace(/[^\d]/g, "").substring(0, 4);
      clearError("postalCode");
    });

    postalCodeField.addEventListener("blur", function () {
      validatePostalCode(this.value, "postalCode");
    });
  }
}

function validateEmail(email, fieldId) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    showError(fieldId, "Email address is required");
    return false;
  }

  if (!emailRegex.test(email)) {
    showError(fieldId, "Please enter a valid email address");
    return false;
  }

  clearError(fieldId);
  return true;
}

function validatePhone(phone, fieldId) {
  if (!phone || phone.trim() === "+27 ") {
    showError(fieldId, "Phone number is required");
    return false;
  }

  // Check if it starts with +27
  if (!phone.startsWith("+27 ")) {
    showError(fieldId, "Phone number must start with +27");
    return false;
  }

  // Get the number part after +27
  const numberPart = phone.substring(4).replace(/\s/g, "");

  // Check if exactly 9 digits
  if (numberPart.length !== 9) {
    showError(fieldId, "Phone number must have exactly 9 digits after +27");
    return false;
  }

  // Check if all digits and doesn't start with 0
  if (!/^\d{9}$/.test(numberPart)) {
    showError(fieldId, "Phone number can only contain digits");
    return false;
  }

  if (numberPart.startsWith("0")) {
    showError(fieldId, "Phone number cannot start with 0 after +27");
    return false;
  }

  clearError(fieldId);
  return true;
}

function validateRequired(value, fieldId, message) {
  if (!value || value.trim() === "") {
    showError(fieldId, message);
    return false;
  }

  clearError(fieldId);
  return true;
}

function validatePostalCode(code, fieldId) {
  if (!code) {
    showError(fieldId, "Postal code is required");
    return false;
  }

  if (code.length !== 4) {
    showError(fieldId, "Postal code must be 4 digits");
    return false;
  }

  clearError(fieldId);
  return true;
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const formGroup = field.closest(".form-group");

  // Add error class to input
  field.classList.add("input-error");

  // Remove existing error message
  const existingError = formGroup.querySelector(".form-error");
  if (existingError) {
    existingError.remove();
  }

  // Create and add new error message
  const errorElement = document.createElement("div");
  errorElement.className = "form-error";
  errorElement.textContent = message;

  // Insert after the input field
  field.parentNode.insertBefore(errorElement, field.nextSibling);

  console.log(`❌ Validation error for ${fieldId}: ${message}`);
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const formGroup = field.closest(".form-group");

  // Remove error class
  field.classList.remove("input-error");

  // Remove error message
  const errorElement = formGroup.querySelector(".form-error");
  if (errorElement) {
    errorElement.remove();
  }
}

function setupPaymentButton() {
  const payButton = document.getElementById("payfast-checkout-btn");

  if (payButton) {
    payButton.addEventListener("click", processCheckout);
    console.log("✅ Payment button ready");
  }
}

function loadCheckoutData() {
  const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

  if (cart.length === 0) {
    showNotification(
      "Your cart is empty! Redirecting to cart page...",
      "error",
      3000
    );
    setTimeout(() => (window.location.href = "cart.html"), 3000);
    return;
  }

  displayOrderSummary(cart);
  calculateTotals(cart);
}

function displayOrderSummary(cart) {
  const container = document.getElementById("checkout-items");

  if (!container) {
    console.error("Order summary container not found");
    return;
  }

  container.innerHTML = cart
    .map((item) => {
      const price = item.price || 650;
      const image = item.images ? item.images.main : "images/default.jpg";

      return `
      <div class="checkout-item" style="display: flex; gap: 15px; margin-bottom: 15px; padding: 15px; border: 1px solid #eee; border-radius: 8px;">
        <img src="${image}" alt="${
        item.name
      }" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 5px 0; font-size: 16px;">${item.name}</h4>
          <p style="margin: 0; color: #666; font-size: 14px;">Size: ${
            item.size || "M"
          } • Qty: ${item.quantity}</p>
          <p style="margin: 5px 0 0 0; font-weight: bold; color: #2c2c2c;">R${(
            price * item.quantity
          ).toFixed(2)}</p>
        </div>
      </div>
    `;
    })
    .join("");

  console.log("✅ Order summary displayed");
}

function calculateTotals(cart) {
  const subtotal = cart.reduce((sum, item) => {
    const price = item.price || 650;
    return sum + price * item.quantity;
  }, 0);

  const vat = subtotal * 0.15; // 15% VAT
  const shipping = 0; // FREE shipping
  const total = subtotal + vat + shipping;

  // Update totals display to match what PayFast receives
  updateElement("checkout-subtotal", `R${subtotal.toFixed(2)}`);
  updateElement("checkout-vat", `R${vat.toFixed(2)}`);
  updateElement("checkout-shipping", "FREE");
  updateElement("checkout-total", `R${total.toFixed(2)}`);

  // 🔥 UPDATE PayFast button text with correct total
  updateElement(
    "payfast-amount",
    `Pay Securely with PayFast - R${total.toFixed(2)}`
  );
  updateElement("button-total", `R${total.toFixed(2)}`);

  console.log(
    "💰 Totals calculated - Subtotal:",
    subtotal,
    "VAT:",
    vat,
    "Total:",
    total
  );

  // Store totals globally for PayFast integration
  window.checkoutTotals = { subtotal, vat, shipping, total };
}

function processCheckout() {
  console.log("🚀 Processing checkout");

  // Clear all previous errors
  document.querySelectorAll(".form-error").forEach((error) => error.remove());
  document
    .querySelectorAll(".input-error")
    .forEach((input) => input.classList.remove("input-error"));

  // Collect and validate form data
  const formData = {
    firstName: getValue("firstName"),
    lastName: getValue("lastName"),
    email: getValue("email"),
    phone: getValue("phone"),
    province: getValue("province"),
    city: getValue("city"),
    postalCode: getValue("postalCode"),
  };

  console.log("📋 Form data collected:", formData); // DEBUG LOG

  let isValid = true;
  let errorCount = 0;

  // Validate all fields and count errors
  if (
    !validateRequired(formData.firstName, "firstName", "First name is required")
  ) {
    isValid = false;
    errorCount++;
  }
  if (
    !validateRequired(formData.lastName, "lastName", "Last name is required")
  ) {
    isValid = false;
    errorCount++;
  }
  if (!validateEmail(formData.email, "email")) {
    isValid = false;
    errorCount++;
  }
  if (!validatePhone(formData.phone, "phone")) {
    isValid = false;
    errorCount++;
  }
  if (
    !validateRequired(formData.province, "province", "Please select a province")
  ) {
    isValid = false;
    errorCount++;
  }
  if (!validateRequired(formData.city, "city", "Please select a city")) {
    isValid = false;
    errorCount++;
  }
  if (!validatePostalCode(formData.postalCode, "postalCode")) {
    isValid = false;
    errorCount++;
  }

  if (!isValid) {
    const errorMessage = `Please fix ${errorCount} error${
      errorCount > 1 ? "s" : ""
    } in the form before continuing. Check the highlighted fields above.`;
    showNotification(errorMessage, "error", 8000);

    const firstErrorField = document.querySelector(".input-error");
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      firstErrorField.focus();
    }
    return;
  }

  // 🔥 FIXED: Pass formData directly (not order object)
  console.log("✅ Validation passed, calling PayFast with formData:", formData);
  initiatePayFastPayment(formData); // PASS formData, not order!
}

// ALSO UPDATE your initiatePayFastPayment function:
function initiatePayFastPayment(customerData) {
  console.log("💳 PayFast called with customer data:", customerData);

  const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // 🔥 Use the stored totals from calculateTotals function
  const totals = window.checkoutTotals || {
    subtotal: 650,
    vat: 97.5,
    shipping: 0,
    total: 747.5,
  };

  console.log(`📊 Using stored pricing breakdown:
    Subtotal: R${totals.subtotal.toFixed(2)}
    Shipping: R${totals.shipping.toFixed(2)} (FREE)
    VAT (15%): R${totals.vat.toFixed(2)}
    TOTAL: R${totals.total.toFixed(2)}`);

  // 🔥 PayFast Official Form Data Structure
  const payFastData = {
    cmd: "_paynow",
    receiver: "33273073",

    // 🎯 Use the correct calculated total
    amount: totals.total.toFixed(2),
    item_name: `HoodRevenge Order #${Date.now()}`,
    item_description: cart
      .map((item) => `${item.name} (${item.size}) x${item.quantity}`)
      .join(", "),

    // Customer details
    name_first: customerData.firstName,
    name_last: customerData.lastName,
    email_address: customerData.email,

    // Return URLs
    return_url: "https://hoodrevenge.co.za/payment-success.html",
    cancel_url: "https://hoodrevenge.co.za/payment-cancelled.html",
    notify_url: "https://hoodrevenge.co.za/payment-notify",

    // Shipping address
    address_line1: `${customerData.firstName} ${customerData.lastName}`,
    address_line2: customerData.phone,
    shipping_city: customerData.city,
    shipping_region: customerData.province,
    postal_code: customerData.postalCode,

    custom_quantity: "1",
  };

  console.log("💳 PayFast Data with CORRECT total:", payFastData);

  // Save order for success page
  localStorage.setItem(
    "pending-order",
    JSON.stringify({
      customer: customerData,
      items: cart,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      vat: totals.vat,
      total: totals.total,
      orderNumber: `HR${Date.now()}`,
    })
  );

  showNotification(
    "Redirecting to PayFast secure checkout...",
    "success",
    3000
  );

  createPayFastForm(payFastData);
}

// Add PayFast's official validation functions at the top of your file
function shippingRequiredPayFast(formReference) {
  let cont = true;
  for (let i = 0; i < formReference.elements.length; i++) {
    if (formReference.elements[i].className !== "shipping") continue;
    if (formReference.elements[i].name === "line2") continue;
    if (!cont) continue;

    if (formReference.elements[i].name === "country") {
      if (formReference.elements[i].selectedIndex === 0) {
        cont = false;
        alert("Select a country");
      }
    } else {
      if (
        0 === formReference.elements[i].value.length ||
        /^\s*$/.test(formReference.elements[i].value)
      ) {
        cont = false;
        alert("Complete all the mandatory address fields");
      }
    }
  }
  return cont;
}

function customQuantitiesPayFast(formReference) {
  formReference["amount"].value =
    formReference["amount"].value * formReference["custom_quantity"].value;
  return true;
}

function actionPayFastJavascript(formReference) {
  let shippingValid = shippingRequiredPayFast(formReference);
  let shippingValidOrOff =
    typeof shippingValid !== "undefined" ? shippingValid : true;
  let customValid = shippingValidOrOff
    ? customQuantitiesPayFast(formReference)
    : false;

  if (typeof shippingValid !== "undefined" && !shippingValid) {
    return false;
  }
  if (typeof customValid !== "undefined" && !customValid) {
    return false;
  }
  return true;
}

// Update your createPayFastForm function to include PayFast's validation
function createPayFastForm(data) {
  // Remove any existing form
  const existingForm = document.getElementById("payfast-form");
  if (existingForm) {
    existingForm.remove();
  }

  // Create PayFast official form with their exact structure AND validation
  const form = document.createElement("form");
  form.id = "payfast-form";
  form.method = "POST";
  form.name = "PayFastPayNowForm";
  form.action = "https://payment.payfast.io/eng/process";
  form.style.display = "none";

  // Add PayFast's onsubmit validation
  form.onsubmit = function () {
    return actionPayFastJavascript(this);
  };

  // Create PayFast official form structure with EXACT field names
  form.innerHTML = `
    <!-- PayFast required fields in their exact format -->
    <input required type="hidden" name="cmd" value="_paynow">
    <input required type="hidden" name="receiver" pattern="[0-9]" value="33273073">
    <input type="hidden" name="return_url" value="${data.return_url}">
    <input type="hidden" name="cancel_url" value="${data.cancel_url}">
    <input type="hidden" name="notify_url" value="${data.notify_url}">
    <input required type="hidden" name="amount" value="${data.amount}">
    <input required type="hidden" name="item_name" maxlength="255" value="${
      data.item_name
    }">
    <input type="hidden" name="item_description" maxlength="255" value="${
      data.item_description
    }">
    
    <!-- Quantity field (set to 1 since amount is pre-calculated) -->
    <input required type="hidden" name="custom_quantity" value="1">
    
    <!-- Shipping address fields (using PayFast's exact field names) -->
    <input type="hidden" name="line1" class="shipping" value="${
      data.address_line1
    }">
    <input type="hidden" name="line2" class="shipping" value="${
      data.address_line2 || ""
    }">
    <input type="hidden" name="city" class="shipping" value="${
      data.shipping_city
    }">
    <input type="hidden" name="region" class="shipping" value="${
      data.shipping_region
    }">
    <input type="hidden" name="country" class="shipping" value="South Africa">
    <input type="hidden" name="code" class="shipping" value="${
      data.postal_code
    }">
    
    <!-- Customer name fields -->
    <input type="hidden" name="name_first" value="${data.name_first}">
    <input type="hidden" name="name_last" value="${data.name_last}">
    <input type="hidden" name="email_address" value="${data.email_address}">
  `;

  document.body.appendChild(form);

  console.log("🚀 Submitting PayFast OFFICIAL form with validation");
  console.log("📋 Form action:", form.action);
  console.log("📋 Form data being sent:", data);

  form.submit();
}

// Helper functions
function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

function updateElement(id, content) {
  const element = document.getElementById(id);
  if (element) element.textContent = content;
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartElement = document.getElementById("cart-count");
  if (cartElement) cartElement.textContent = count;
}

console.log("✅ Checkout system ready with professional validation");
