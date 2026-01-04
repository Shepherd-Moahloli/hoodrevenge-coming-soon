/* filepath: js/checkout.js */
// Add this CSS for error styling at the top of the file
const errorStyles = `
  .form-error {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
  }
  
  .input-error {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
  }
  
  .form-group {
    position: relative;
    margin-bottom: 1.5rem;
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = errorStyles;
document.head.appendChild(styleSheet);

// South African Provinces and Cities data
const SA_LOCATIONS = {
  "Western Cape": [
    "Cape Town",
    "Stellenbosch",
    "Paarl",
    "George",
    "Mossel Bay",
    "Worcester",
    "Hermanus",
    "Knysna",
    "Oudtshoorn",
    "Caledon",
    "Swellendam",
    "Robertson",
    "Vredenburg",
    "Malmesbury",
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
    "Germiston",
    "Kempton Park",
    "Springs",
    "Alberton",
    "Edenvale",
    "Midrand",
    "Centurion",
  ],
  "KwaZulu-Natal": [
    "Durban",
    "Pietermaritzburg",
    "Newcastle",
    "Richards Bay",
    "Ladysmith",
    "Pinetown",
    "Chatsworth",
    "Umlazi",
    "Port Shepstone",
    "Margate",
    "Empangeni",
    "Vryheid",
    "Dundee",
    "Estcourt",
  ],
  "Eastern Cape": [
    "Port Elizabeth",
    "East London",
    "Uitenhage",
    "King William's Town",
    "Mthatha",
    "Grahamstown",
    "Queenstown",
    "Bhisho",
    "Port Alfred",
    "Somerset East",
    "Cradock",
    "Fort Beaufort",
    "Alice",
  ],
  Limpopo: [
    "Polokwane",
    "Tzaneen",
    "Phalaborwa",
    "Musina",
    "Thohoyandou",
    "Giyani",
    "Louis Trichardt",
    "Mokopane",
    "Bela-Bela",
    "Hoedspruit",
  ],
  Mpumalanga: [
    "Nelspruit",
    "Witbank",
    "Secunda",
    "Middelburg",
    "Ermelo",
    "Standerton",
    "Sabie",
    "White River",
    "Hazyview",
    "Barberton",
  ],
  "North West": [
    "Rustenburg",
    "Klerksdorp",
    "Potchefstroom",
    "Mahikeng",
    "Brits",
    "Stilfontein",
    "Carletonville",
    "Lichtenburg",
  ],
  "Free State": [
    "Bloemfontein",
    "Welkom",
    "Kroonstad",
    "Bethlehem",
    "Sasolburg",
    "Virginia",
    "Parys",
    "Vredefort",
    "Phuthaditjhaba",
    "Harrismith",
  ],
  "Northern Cape": [
    "Kimberley",
    "Upington",
    "Kuruman",
    "Springbok",
    "De Aar",
    "Postmasburg",
    "Calvinia",
    "Carnarvon",
    "Prieska",
  ],
};

// ENVIRONMENT CONFIGURATION
const CONFIG = {
  // Change this to 'production' when going live
  environment: "development", // or 'production'

  development: {
    paymentProcessor: "simulation",
    emailNotifications: true,
    debugMode: true,
    businessEmail: "shepherdmoahloli122@gmail.com",
  },

  production: {
    paymentProcessor: "fnb-paygate", // FNB's system
    paygate: {
      paygate_id: "YOUR_FNB_PAYGATE_ID", // They'll provide this
      secret_key: "YOUR_FNB_SECRET_KEY", // They'll provide this
      api_url: "https://secure.fnb.co.za/payweb3/initiate.trans", // Or similar
    },
  },
};

// Get current environment config
function getConfig() {
  return CONFIG[CONFIG.environment];
}

// Checkout Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  console.log("🛒 Checkout page loaded");

  // Initialize EmailJS with YOUR public key (get this from Integration tab)
  emailjs.init("09sByCKovb1T8PmSe"); // Replace with your actual public key

  // Override navbar scroll behavior for checkout page
  initCheckoutNavbar();

  loadCheckoutData();
  initializePaymentMethods();
  initializeFormValidation();
  initializeCheckoutProgress();

  function initCheckoutNavbar() {
    const navbar = document.querySelector(".navbar");
    const logo = document.querySelector(".logo img");

    // Set initial state for checkout (white background page)
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.backdropFilter = "blur(15px)";
    navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";

    // Cart link hover effect
    if (cartLink) {
      cartLink.addEventListener("mouseenter", function () {
        this.style.background = "#2c2c2c";
        this.style.color = "#ffffff !important";
      });

      cartLink.addEventListener("mouseleave", function () {
        this.style.background = "none";
        this.style.color = "#2c2c2c !important";
      });
    }

    // Scroll behavior - keep black logo and consistent styling throughout
    window.addEventListener("scroll", function () {
      if (window.scrollY > 100) {
        navbar.classList.add("scrolled");
        if (logo) {
          logo.src = "images/hood-logo-black.png"; // Stay black
        }

        // Maintain black text on scroll
        navLinks.forEach((link) => {
          link.style.color = "#2c2c2c !important";
        });
      } else {
        navbar.classList.remove("scrolled");
        if (logo) {
          logo.src = "images/hood-logo-black.png"; // Stay black
        }

        // Maintain black text when not scrolled
        navLinks.forEach((link) => {
          link.style.color = "#2c2c2c !important";
        });
      }
    });
  }

  function loadCheckoutData() {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

    if (cart.length === 0) {
      // Redirect to cart if empty
      window.location.href = "cart.html";
      return;
    }

    // Update cart count
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
      cartCountElement.textContent = count;
    }

    // Display checkout items
    displayCheckoutItems(cart);

    // Calculate and display totals
    calculateTotals(cart);
  }

  function displayCheckoutItems(cart) {
    const checkoutItems = document.getElementById("checkout-items");

    checkoutItems.innerHTML = cart
      .map((item) => {
        const price = item.price || 650;
        const imageUrl = item.images ? item.images.main : item.image;
        return `
        <div class="checkout-item">
          <img src="${imageUrl}" alt="${item.name}">
          <div class="item-info">
            <h4>${item.name}</h4>
            <p>Size: ${item.size || "M"} • Qty: ${item.quantity}</p>
          </div>
          <div class="item-price">R${(price * item.quantity).toFixed(2)}</div>
        </div>
      `;
      })
      .join("");
  }

  function calculateTotals(cart) {
    const subtotal = cart.reduce((total, item) => {
      const price = item.price || 650;
      return total + price * item.quantity;
    }, 0);

    const vat = subtotal * 0.15; // 15% VAT for South Africa
    const shipping = 0; // Free shipping
    const total = subtotal + vat + shipping;

    // Update display
    document.getElementById(
      "checkout-subtotal"
    ).textContent = `R${subtotal.toFixed(2)}`;
    document.getElementById("checkout-vat").textContent = `R${vat.toFixed(2)}`;
    document.getElementById("checkout-total").textContent = `R${total.toFixed(
      2
    )}`;

    // Update button text
    document.getElementById(
      "place-order-btn"
    ).innerHTML = `Place Order - R${total.toFixed(2)}`;
  }

  function initializePaymentMethods() {
    const paymentOptions = document.querySelectorAll(".payment-option");
    const cardDetails = document.getElementById("card-details");
    const eftDetails = document.getElementById("eft-details");

    paymentOptions.forEach((option) => {
      option.addEventListener("click", function () {
        // Remove active class from all options
        paymentOptions.forEach((opt) => opt.classList.remove("active"));

        // Add active class to clicked option
        this.classList.add("active");

        // Check the radio button
        const radio = this.querySelector('input[type="radio"]');
        radio.checked = true;

        // Show/hide payment details
        const method = this.dataset.method;

        cardDetails.style.display = method === "card" ? "block" : "none";
        eftDetails.style.display = method === "eft" ? "block" : "none";

        if (method === "eft") {
          generateOrderReference();
        }

        if (method === "applepay") {
          // Handle Apple Pay selection
          console.log("Apple Pay selected");
          // Apple Pay doesn't need additional details form
        }
      });
    });
  }

  function generateOrderReference() {
    const timestamp = Date.now().toString().slice(-6);
    const reference = `HR-2025-${timestamp}`;
    document.getElementById("orderReference").textContent = reference;
  }

  function initializeFormValidation() {
    const form = document.getElementById("checkout-form");
    const placeOrderBtn = document.getElementById("place-order-btn");

    // Initialize province and city dropdowns
    initializeLocationDropdowns();

    // Phone number formatting with SA validation
    const phone = document.getElementById("phone");
    if (phone) {
      // Set placeholder to show format
      phone.placeholder = "+27 XX XXX XXXX";

      phone.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");

        // Always start with +27
        if (value.length > 0) {
          if (value.startsWith("27")) {
            value = value.substring(2); // Remove 27 if user typed it
          }
          if (value.startsWith("0")) {
            value = value.substring(1); // Remove leading 0
          }

          // Limit to 9 digits after +27
          value = value.substring(0, 9);

          // Format as +27 XX XXX XXXX
          if (value.length > 0) {
            if (value.length <= 2) {
              e.target.value = `+27 ${value}`;
            } else if (value.length <= 5) {
              e.target.value = `+27 ${value.slice(0, 2)} ${value.slice(2)}`;
            } else {
              e.target.value = `+27 ${value.slice(0, 2)} ${value.slice(
                2,
                5
              )} ${value.slice(5)}`;
            }
          } else {
            e.target.value = "+27 ";
          }
        } else {
          e.target.value = "+27 ";
        }

        // Clear error when user starts typing
        clearFieldError(e.target);
      });

      // Set initial value
      if (!phone.value || phone.value === "") {
        phone.value = "+27 ";
      }
    }

    // Postal Code validation (4 digits only)
    const postalCode = document.getElementById("postalCode");
    if (postalCode) {
      postalCode.placeholder = "e.g. 7800";
      postalCode.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, ""); // Only numbers
        value = value.substring(0, 4); // Limit to 4 digits
        e.target.value = value;
        clearFieldError(e.target);
      });
    }

    // Card number formatting
    const cardNumber = document.getElementById("cardNumber");
    if (cardNumber) {
      cardNumber.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

        // Limit to 19 digits max
        value = value.substring(0, 19);

        // Format with spaces every 4 digits
        let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;

        e.target.value = formattedValue;

        // Real-time validation feedback
        if (value.length >= 13) {
          const cardType = getCardType(value);
          const isValid = luhnCheck(value);

          if (isValid && cardType !== "unknown") {
            e.target.classList.remove("input-error");
            e.target.classList.add("input-valid");
            showCardTypeIcon(cardType);
          } else {
            e.target.classList.add("input-error");
            e.target.classList.remove("input-valid");
            hideCardTypeIcon();
          }
        } else {
          e.target.classList.remove("input-error", "input-valid");
          hideCardTypeIcon();
        }

        clearFieldError(e.target);
      });
    }

    // Expiry date formatting
    const expiryDate = document.getElementById("expiryDate");
    if (expiryDate) {
      expiryDate.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 2) {
          value = value.slice(0, 2) + "/" + value.slice(2, 4);
        }
        e.target.value = value;
        clearFieldError(e.target);
      });
    }

    // CVV formatting
    const cvv = document.getElementById("cvv");
    if (cvv) {
      cvv.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");

        // Get current card number to determine CVV length
        const cardNumberField = document.getElementById("cardNumber");
        const cardNumber = cardNumberField
          ? cardNumberField.value.replace(/\s/g, "")
          : "";
        const cardType = getCardType(cardNumber);

        // Limit CVV length based on card type
        const maxLength = cardType === "amex" ? 4 : 3;
        value = value.substring(0, maxLength);

        e.target.value = value;

        // Update placeholder based on card type
        e.target.placeholder = cardType === "amex" ? "1234" : "123";

        // Real-time validation
        if (value.length === maxLength) {
          e.target.classList.remove("input-error");
          e.target.classList.add("input-valid");
        } else if (value.length > 0) {
          e.target.classList.add("input-error");
          e.target.classList.remove("input-valid");
        } else {
          e.target.classList.remove("input-error", "input-valid");
        }

        clearFieldError(e.target);
      });
    }

    // Add real-time validation for other fields
    const textFields = ["firstName", "lastName", "email", "address"];
    textFields.forEach((fieldName) => {
      const field = document.getElementById(fieldName);
      if (field) {
        field.addEventListener("input", function (e) {
          clearFieldError(e.target);
        });

        field.addEventListener("blur", function (e) {
          validateSingleField(fieldName, e.target.value);
        });
      }
    });

    // Place order functionality
    placeOrderBtn.addEventListener("click", function (e) {
      e.preventDefault();
      processOrder();
    });
  }

  // Initialize Province and City dropdowns
  function initializeLocationDropdowns() {
    const provinceSelect = document.getElementById("province");
    const citySelect = document.getElementById("city");

    if (!provinceSelect || !citySelect) return;

    // Clear existing options
    provinceSelect.innerHTML = '<option value="">Select Province</option>';
    citySelect.innerHTML = '<option value="">Select City</option>';
    citySelect.disabled = true;

    // Populate provinces
    Object.keys(SA_LOCATIONS).forEach((province) => {
      const option = document.createElement("option");
      option.value = province;
      option.textContent = province;
      provinceSelect.appendChild(option);
    });

    // Handle province selection
    provinceSelect.addEventListener("change", function () {
      const selectedProvince = this.value;
      citySelect.innerHTML = '<option value="">Select City</option>';

      if (selectedProvince && SA_LOCATIONS[selectedProvince]) {
        citySelect.disabled = false;

        SA_LOCATIONS[selectedProvince].forEach((city) => {
          const option = document.createElement("option");
          option.value = city;
          option.textContent = city;
          citySelect.appendChild(option);
        });

        clearFieldError(provinceSelect);
      } else {
        citySelect.disabled = true;
      }

      // Clear city selection when province changes
      citySelect.value = "";
    });

    // Handle city selection
    citySelect.addEventListener("change", function () {
      if (this.value) {
        clearFieldError(this);
      }
    });
  }

  // Enhanced form validation with error display
  function validateForm(data) {
    let isValid = true;
    clearAllErrors();

    // Required text fields
    const requiredFields = {
      firstName: "First name",
      lastName: "Last name",
      email: "Email address",
      address: "Street address",
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!data[field] || data[field].trim() === "") {
        showFieldError(field, `${label} is required`);
        isValid = false;
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      showFieldError("email", "Please enter a valid email address");
      isValid = false;
    }

    // Phone validation (must be +27 + 9 digits)
    if (!data.phone || data.phone.replace(/\D/g, "").length !== 11) {
      // +27 + 9 digits = 11 total
      showFieldError(
        "phone",
        "Please enter a valid SA phone number (+27 XX XXX XXXX)"
      );
      isValid = false;
    }

    // Province validation
    if (!data.province) {
      showFieldError("province", "Please select a province");
      isValid = false;
    }

    // City validation
    if (!data.city) {
      showFieldError("city", "Please select a city");
      isValid = false;
    }

    // Postal code validation (must be exactly 4 digits)
    if (!data.postalCode || data.postalCode.length !== 4) {
      showFieldError("postalCode", "Postal code must be exactly 4 digits");
      isValid = false;
    }

    // Payment method specific validation
    if (data.paymentMethod === "card") {
      const cardNumber = data.cardNumber.replace(/\s/g, "");

      if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
        showFieldError("cardNumber", "Please enter a valid card number");
        isValid = false;
      }

      if (!data.expiryDate || data.expiryDate.length !== 5) {
        showFieldError("expiryDate", "Please enter expiry date (MM/YY)");
        isValid = false;
      }

      if (!data.cvv || data.cvv.length < 3) {
        showFieldError("cvv", "Please enter a valid CVV");
        isValid = false;
      }
    }

    return isValid;
  }

  // Validate individual field
  function validateSingleField(fieldName, value) {
    let isValid = true;

    switch (fieldName) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          showFieldError(fieldName, "Please enter a valid email address");
          isValid = false;
        }
        break;
      case "firstName":
      case "lastName":
        if (value && value.length < 2) {
          showFieldError(fieldName, "Must be at least 2 characters");
          isValid = false;
        }
        break;
    }

    return isValid;
  }

  // Show field error
  function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;

    // Add error styling to field
    field.classList.add("input-error");

    // Remove existing error message
    const existingError = field.parentNode.querySelector(".form-error");
    if (existingError) {
      existingError.remove();
    }

    // Create and append error message
    const errorElement = document.createElement("div");
    errorElement.className = "form-error";
    errorElement.textContent = message;

    // Insert after the field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  }

  // Clear field error
  function clearFieldError(field) {
    field.classList.remove("input-error");
    const errorElement = field.parentNode.querySelector(".form-error");
    if (errorElement) {
      errorElement.remove();
    }
  }

  // Clear all errors
  function clearAllErrors() {
    const errorFields = document.querySelectorAll(".input-error");
    const errorMessages = document.querySelectorAll(".form-error");

    errorFields.forEach((field) => field.classList.remove("input-error"));
    errorMessages.forEach((msg) => msg.remove());
  }

  // Update collectFormData to handle new structure
  function collectFormData() {
    const selectedPayment = document.querySelector(
      'input[name="payment"]:checked'
    );

    if (!selectedPayment) {
      alert("Please select a payment method");
      return null;
    }

    return {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      province: document.getElementById("province").value,
      postalCode: document.getElementById("postalCode").value,
      paymentMethod: selectedPayment.value,
      cardNumber:
        selectedPayment.value === "card"
          ? document.getElementById("cardNumber").value
          : null,
      expiryDate:
        selectedPayment.value === "card"
          ? document.getElementById("expiryDate").value
          : null,
      cvv:
        selectedPayment.value === "card"
          ? document.getElementById("cvv").value
          : null,
    };
  }

  // Update both functions with the CORRECT template ID
  function testBasicEmail() {
    const testData = {
      to_email: "shepherdmoahloli122@gmail.com",
      message: "Test from website",
      from_name: "Website Test",
    };

    console.log("🧪 Testing basic email...");

    return (
      emailjs
        .send("service_nl2859l", "template_tcmqj74", testData) // ✅ CORRECT TEMPLATE ID
        //                      ^^^^^^^^^^^^^^^^^
        //                      This is your actual template ID!
        .then((response) => {
          console.log("✅ Basic test SUCCESS:", response);
          return true;
        })
        .catch((error) => {
          console.error("❌ Basic test FAILED:", error);
          return false;
        })
    );
  }

  // Update processOrder to test basic email first
  async function processOrder() {
    const formData = collectFormData();
    const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

    if (!validateForm(formData)) {
      return;
    }

    if (formData.paymentMethod === "card") {
      if (!validateCardDetails(formData)) {
        return;
      }
    }

    try {
      console.log("💳 Starting payment validation...");

      // Step 2: Payment Processing
      updateProgressStep(2);

      const btn = document.getElementById("place-order-btn");
      btn.innerHTML = "⏳ Validating Card...";
      btn.disabled = true;
      btn.classList.add("loading");

      // Enhanced card validation
      if (formData.paymentMethod === "card") {
        if (!validateCardDetails(formData)) {
          // Reset button state
          btn.innerHTML = `Place Order - ${calculateOrderTotal(cart)}`;
          btn.disabled = false;
          btn.classList.remove("loading");
          updateProgressStep(1);
          return;
        }

        // Process payment
        btn.innerHTML = "💳 Processing Payment...";
        const cartTotal = calculateOrderTotal(cart);
        const paymentResult = await processPayment(formData, cartTotal);

        if (!paymentResult.success) {
          // Handle payment failure
          handlePaymentError(paymentResult, btn, cart);
          return;
        }

        // Payment successful - store transaction details
        console.log("✅ Payment successful!");
        console.log("💰 Transaction ID:", paymentResult.transactionId);
        console.log("🔐 Auth Code:", paymentResult.authCode);

        // Add payment info to form data for email
        formData.transactionId = paymentResult.transactionId;
        formData.authCode = paymentResult.authCode;
        formData.chargedAmount = paymentResult.chargedAmount;
      }

      // Continue with email sending...
      btn.innerHTML = "📧 Sending Confirmation...";

      // Send business notification email (to you)
      const businessEmailSent = await sendBusinessOrderNotification(
        formData,
        cart
      );
      console.log("📧 Business email result:", businessEmailSent);

      // Send customer confirmation email (to customer)
      const customerEmailSent = await sendCustomerConfirmation(formData, cart);
      console.log("📧 Customer email result:", customerEmailSent);

      // As long as business email is sent, order is successful
      if (businessEmailSent) {
        console.log("✅ Business email sent successfully!");

        // Step 3: Confirmation
        updateProgressStep(3);
        btn.innerHTML = "✅ Order Confirmed!";
        btn.classList.remove("loading");
        btn.classList.add("success-animation");

        if (customerEmailSent) {
          console.log("✅ Customer email also sent!");
        } else {
          console.log("⚠️ Customer email failed, but order still processed");
        }

        setTimeout(() => {
          localStorage.removeItem("hoodrevenge-cart");
          showOrderSuccess(formData);

          // ❌ REMOVED THE ALERT POPUP - Just redirect after delay
          setTimeout(() => {
            window.location.href = "shop.html";
          }, 10000); // 10 seconds
        }, 2000);
      } else {
        console.error("❌ Business email failed - not completing order");
        alert(
          "⚠️ Order could not be processed. Email notification failed. Please try again."
        );

        // Reset to step 1
        updateProgressStep(1);
        btn.innerHTML = `Place Order - ${calculateOrderTotal(cart)}`;
        btn.disabled = false;
        btn.classList.remove("loading");
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      alert(
        "⚠️ Order could not be processed due to an error. Please try again."
      );

      // Reset to step 1
      updateProgressStep(1);
      btn.innerHTML = `Place Order - ${calculateOrderTotal(cart)}`;
      btn.disabled = false;
      btn.classList.remove("loading");
    }
  }

  // Add this BEFORE the processOrder function

  // PAYMENT PROCESSING SIMULATION
  async function processPayment(formData, cartTotal) {
    console.log("💳 Processing payment...");

    // Extract numeric total (remove 'R' and convert to number)
    const totalAmount = parseFloat(cartTotal.replace("R", ""));
    console.log(`💰 Total amount to charge: R${totalAmount}`);

    // Simulate different payment scenarios based on card number
    const cardNumber = formData.cardNumber.replace(/\s/g, "");
    const lastFourDigits = cardNumber.slice(-4);

    // SIMULATE DIFFERENT CARD SCENARIOS
    const paymentResult = await simulateCardPayment(
      cardNumber,
      totalAmount,
      formData
    );

    return paymentResult;
  }

  // REALISTIC PAYMENT SIMULATION
  async function simulateCardPayment(cardNumber, amount, formData) {
    console.log("🏦 Contacting bank for authorization...");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const lastFour = cardNumber.slice(-4);

    // SIMULATION RULES based on last 4 digits of card:
    // 0000-2999: Successful payment
    // 3000-4999: Insufficient funds
    // 5000-6999: Card declined/blocked
    // 7000-8999: Network/technical error
    // 9000-9999: Successful payment with bonus

    const lastFourNum = parseInt(lastFour);

    if (lastFourNum >= 0 && lastFourNum <= 2999) {
      // SUCCESS - Sufficient funds
      return {
        success: true,
        transactionId: generateTransactionId(),
        authCode: generateAuthCode(),
        message: "Payment successful",
        accountBalance: generateRandomBalance(amount + 1000), // Simulate balance after payment
        chargedAmount: amount,
      };
    } else if (lastFourNum >= 3000 && lastFourNum <= 4999) {
      // INSUFFICIENT FUNDS
      const availableBalance = Math.random() * (amount - 50); // Random amount less than total
      return {
        success: false,
        error: "INSUFFICIENT_FUNDS",
        message: `Insufficient funds. Available: R${availableBalance.toFixed(
          2
        )}, Required: R${amount.toFixed(2)}`,
        availableBalance: availableBalance,
        requiredAmount: amount,
      };
    } else if (lastFourNum >= 5000 && lastFourNum <= 6999) {
      // CARD DECLINED
      return {
        success: false,
        error: "CARD_DECLINED",
        message:
          "Card declined. Please contact your bank or try a different payment method.",
      };
    } else if (lastFourNum >= 7000 && lastFourNum <= 8999) {
      // TECHNICAL ERROR
      return {
        success: false,
        error: "TECHNICAL_ERROR",
        message: "Technical error occurred. Please try again in a few minutes.",
      };
    } else {
      // SUCCESS WITH BONUS MESSAGE
      return {
        success: true,
        transactionId: generateTransactionId(),
        authCode: generateAuthCode(),
        message: "Payment successful! Thank you for choosing HoodRevenge.",
        accountBalance: generateRandomBalance(amount + 2000),
        chargedAmount: amount,
        bonus: true,
      };
    }
  }

  // UTILITY FUNCTIONS
  function generateTransactionId() {
    return "HR" + Date.now().toString() + Math.floor(Math.random() * 1000);
  }

  function generateAuthCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  function generateRandomBalance(minBalance) {
    return minBalance + Math.random() * 5000; // Add random amount above minimum
  }

  // Replace the existing validateCardDetails function with this comprehensive version:
  function validateCardDetails(data) {
    console.log("💳 Validating card details...");

    clearAllErrors(); // Clear previous errors

    const cardNumber = data.cardNumber.replace(/\s/g, "");
    let isValid = true;

    // 1. CARD NUMBER VALIDATION
    if (!validateCardNumber(cardNumber)) {
      showFieldError(
        "cardNumber",
        "Invalid card number. Please check your card details."
      );
      isValid = false;
    }

    // 2. EXPIRY DATE VALIDATION
    if (!validateExpiryDate(data.expiryDate)) {
      showFieldError(
        "expiryDate",
        "Invalid or expired card. Please check expiry date."
      );
      isValid = false;
    }

    // 3. CVV VALIDATION
    if (!validateCVV(data.cvv, cardNumber)) {
      showFieldError(
        "cvv",
        "Invalid CVV. Please check your card security code."
      );
      isValid = false;
    }

    // 4. CARDHOLDER NAME VALIDATION (if you add this field)
    const cardholderName = `${data.firstName} ${data.lastName}`.toUpperCase();
    if (cardholderName.length < 3) {
      showFieldError("firstName", "Cardholder name is required.");
      isValid = false;
    }

    return isValid;
  }

  // ADVANCED CARD NUMBER VALIDATION using Luhn Algorithm
  function validateCardNumber(cardNumber) {
    // Remove all spaces and non-digits
    const cleanNumber = cardNumber.replace(/\D/g, "");

    // Check length (13-19 digits for most cards)
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return false;
    }

    // Identify card type and validate accordingly
    const cardType = getCardType(cleanNumber);
    console.log("💳 Detected card type:", cardType);

    if (cardType === "unknown") {
      return false;
    }

    // Luhn Algorithm validation
    return luhnCheck(cleanNumber);
  }

  // CARD TYPE DETECTION
  function getCardType(cardNumber) {
    const patterns = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard:
        /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      dinersclub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
      jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cardNumber)) {
        return type;
      }
    }

    return "unknown";
  }

  // LUHN ALGORITHM - Industry standard for card validation
  function luhnCheck(cardNumber) {
    let sum = 0;
    let alternate = false;

    // Process digits from right to left
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let n = parseInt(cardNumber.charAt(i), 10);

      if (alternate) {
        n *= 2;
        if (n > 9) {
          n = (n % 10) + 1;
        }
      }

      sum += n;
      alternate = !alternate;
    }

    return sum % 10 === 0;
  }

  // EXPIRY DATE VALIDATION
  function validateExpiryDate(expiryDate) {
    if (!expiryDate || !expiryDate.includes("/")) {
      return false;
    }

    const [month, year] = expiryDate.split("/");

    // Check format
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return false;
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt("20" + year, 10); // Convert YY to 20YY

    // Validate month range
    if (monthNum < 1 || monthNum > 12) {
      return false;
    }

    // Check if card is expired
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed

    if (
      yearNum < currentYear ||
      (yearNum === currentYear && monthNum < currentMonth)
    ) {
      return false;
    }

    // Don't allow cards expiring more than 10 years in future
    if (yearNum > currentYear + 10) {
      return false;
    }

    return true;
  }

  // CVV VALIDATION
  function validateCVV(cvv, cardNumber) {
    if (!cvv) return false;

    const cardType = getCardType(cardNumber);

    // American Express has 4-digit CVV, others have 3-digit
    if (cardType === "amex") {
      return /^\d{4}$/.test(cvv);
    } else {
      return /^\d{3}$/.test(cvv);
    }
  }

  // Enhanced function that sends to both you AND the customer
  async function sendOrderEmails(orderData, cartItems) {
    try {
      // Send order notification to YOU (business owner)
      const businessEmailSent = await sendBusinessOrderNotification(
        orderData,
        cartItems
      );

      // Send confirmation to CUSTOMER (optional)
      const customerEmailSent = await sendCustomerConfirmation(
        orderData,
        cartItems
      );

      return businessEmailSent; // As long as YOU get notified, it's successful
    } catch (error) {
      console.error("Email sending failed:", error);
      return false;
    }
  }

  // Update sendBusinessOrderNotification with EXTENSIVE debugging
  function sendBusinessOrderNotification(orderData, cartItems) {
    console.log("🔥 EMAIL DEBUG START");
    console.log("📧 EmailJS object:", emailjs);
    console.log("📧 EmailJS send function:", typeof emailjs.send);
    console.log("📧 Order Data received:", orderData);
    console.log("📧 Cart Items received:", cartItems);

    // Test calculateOrderTotal function
    console.log(
      "🧮 Testing calculateOrderTotal:",
      calculateOrderTotal(cartItems)
    );

    const emailData = {
      to_email: "shepherdmoahloli122@gmail.com",
      customer_name: `${orderData.firstName} ${orderData.lastName}`,
      customer_email: orderData.email,
      customer_phone: orderData.phone,
      shipping_address: `${orderData.address}, ${orderData.city}, ${orderData.province} ${orderData.postalCode}`,
      payment_method: orderData.paymentMethod.toUpperCase(),
      order_items: cartItems
        .map(
          (item) =>
            `${item.name} - Size: ${item.size || "M"} - Qty: ${
              item.quantity
            } - R${item.price || 650}`
        )
        .join("\n"),
      order_total: calculateOrderTotal(cartItems),
      order_date: new Date().toLocaleDateString(),
      reply_to: orderData.email,
    };

    console.log("📧 COMPLETE EMAIL DATA:");
    console.log(JSON.stringify(emailData, null, 2));

    console.log("📧 Service ID: 'service_nl2859l'");
    console.log("📧 Template ID: 'template_tcmqj74'"); // ✅ CORRECT TEMPLATE ID
    console.log("📧 Public Key initialized:", !!emailjs.init);

    // Check if EmailJS is available
    if (typeof emailjs === "undefined") {
      console.error("❌ EmailJS not loaded!");
      return Promise.resolve(false);
    }

    console.log("🚀 Attempting to send email...");

    return (
      emailjs
        .send("service_nl2859l", "template_tcmqj74", emailData) // ✅ CORRECT TEMPLATE ID
        //                      ^^^^^^^^^^^^^^^^^
        //                      This is your actual template ID!
        .then(function (response) {
          console.log("🎉 EMAIL SUCCESS!");
          console.log("📧 Success Response:", response);
          return true;
        })
        .catch(function (error) {
          console.error("💥 EMAIL COMPLETE FAILURE!");
          console.error("❌ Error Object:", error);

          // Try to extract more info
          if (error.text) console.error("❌ Error Text:", error.text);
          if (error.status) console.error("❌ Error Status:", error.status);
          if (error.message) console.error("❌ Error Message:", error.message);

          return false;
        })
    );
  }

  // Add the missing calculateOrderTotal function
  function calculateOrderTotal(cartItems) {
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.price || 650;
      return total + price * item.quantity;
    }, 0);

    const vat = subtotal * 0.15; // 15% VAT
    const shipping = 0; // Free shipping
    const total = subtotal + vat + shipping;

    return `R${total.toFixed(2)}`;
  }

  // Send customer confirmation email - WITH DEBUGGING
  function sendCustomerConfirmation(orderData, cartItems) {
    console.log("📧 Sending customer confirmation email...");
    console.log("📧 Customer email address:", orderData.email);

    const customerEmailData = {
      to_email: orderData.email,
      customer_name: orderData.firstName,
      order_items: cartItems
        .map(
          (item) =>
            `${item.name} - Size: ${item.size || "M"} - Qty: ${
              item.quantity
            } - R${item.price || 650}`
        )
        .join("\n"),
      order_total: calculateOrderTotal(cartItems),
      order_date: new Date().toLocaleDateString(),
      shipping_address: `${orderData.address}, ${orderData.city}, ${orderData.province} ${orderData.postalCode}`,
      payment_method: orderData.paymentMethod.toUpperCase(),
    };

    console.log("📧 CUSTOMER EMAIL DATA:");
    console.log(JSON.stringify(customerEmailData, null, 2));

    return emailjs
      .send(
        "service_nl2859l",
        "template_51d2rvf", // ✅ Your customer template ID
        customerEmailData
      )
      .then(function (response) {
        console.log(
          "✅ Customer confirmation email sent successfully:",
          response
        );
        return true;
      })
      .catch(function (error) {
        console.error("❌ Customer confirmation email FAILED:");
        console.error("Error details:", error);
        if (error.text) console.error("Error text:", error.text);
        if (error.status) console.error("Error status:", error.status);
        return false;
      });
  }

  // Checkout Progress Management
  function initializeCheckoutProgress() {
    updateProgressStep(1); // Start at step 1

    // Add progress line element
    const stepsContainer = document.querySelector(".checkout-steps");
    if (stepsContainer && !stepsContainer.querySelector(".progress-line")) {
      const progressLine = document.createElement("div");
      progressLine.className = "progress-line";
      stepsContainer.appendChild(progressLine);
    }
  }

  // Update the updateProgressStep function with better centering
  function updateProgressStep(currentStep) {
    console.log(`🔄 Updating progress to step ${currentStep}`);

    const steps = document.querySelectorAll(".step");
    const progressLine = document.querySelector(".progress-line");

    steps.forEach((step, index) => {
      const stepNumber = index + 1;

      // Remove all classes first
      step.classList.remove("active", "completed");

      if (stepNumber < currentStep) {
        step.classList.add("completed");
      } else if (stepNumber === currentStep) {
        step.classList.add("active");
      }
    });

    // Update progress line with PERFECT centering
    if (progressLine) {
      const stepsContainer = document.querySelector(".checkout-steps");
      if (stepsContainer) {
        // Get the actual positions of step circles
        const firstStep = steps[0];
        const lastStep = steps[steps.length - 1];

        if (firstStep && lastStep) {
          // Calculate the total distance between first and last step centers
          const containerRect = stepsContainer.getBoundingClientRect();
          const firstRect = firstStep
            .querySelector(".step-number")
            .getBoundingClientRect();
          const lastRect = lastStep
            .querySelector(".step-number")
            .getBoundingClientRect();

          // Calculate the distance between centers
          const totalDistance =
            lastRect.left +
            lastRect.width / 2 -
            (firstRect.left + firstRect.width / 2);
          const containerWidth = containerRect.width - 2 * 32; // Account for padding

          // Calculate progress percentage more accurately
          let progressWidth = 0;

          if (currentStep === 1) {
            progressWidth = 0;
          } else if (currentStep === 2) {
            progressWidth = 50; // Exactly halfway
          } else if (currentStep === 3) {
            progressWidth = 100; // Complete
          }

          progressLine.style.width = `${progressWidth}%`;
        }
      }
    }

    // Show appropriate section
    showCheckoutSection(currentStep);
  }

  function showCheckoutSection(step) {
    const sections = document.querySelectorAll(".checkout-section");

    sections.forEach((section, index) => {
      section.classList.remove("active");

      // Add slight delay for smooth transition
      setTimeout(() => {
        if (index + 1 === step) {
          section.classList.add("active");
        }
      }, 100);
    });
  }

  // Order Confirmation Section HTML
  const orderConfirmationHTML = `
  <!-- Order Confirmation Section -->
  <section class="checkout-section" id="order-confirmation" style="display: none">
    <div class="confirmation-container">
      <div class="confirmation-content">
        <!-- Success Animation -->
        <div class="success-icon">
          <div class="checkmark">
            <svg viewBox="0 0 52 52">
              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark-check" fill="none" d="m14.1,27.2l7.1,7.2 16.7-16.8"/>
            </svg>
          </div>
        </div>
        
        <!-- Success Message -->
        <h1 class="confirmation-title">Thank You!</h1>
        <h2 class="confirmation-subtitle">Your order has been confirmed</h2>
        
        <div class="confirmation-details">
          <p class="confirmation-message">
            🎉 <strong>Thank you for shopping with HoodRevenge!</strong>
          </p>
          
          <div class="confirmation-info">
            <div class="info-item">
              <span class="info-icon">📧</span>
              <p>We've sent you a confirmation email with all the details</p>
            </div>
            
            <div class="info-item">
              <span class="info-icon">📞</span>
              <p>We'll be in touch with you within 24 hours about your order</p>
            </div>
            
            <div class="info-item">
              <span class="info-icon">🚚</span>
              <p>Your items will be processed and shipped within 1-3 business days</p>
            </div>
          </div>
        </div>
        
        <div class="confirmation-actions">
          <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
          <a href="contact.html" class="btn btn-outline">Contact Us</a>
        </div>
        
        <!-- Order Summary Preview -->
        <div class="order-preview">
          <h4>Order Summary</h4>
          <div id="confirmation-order-items">
            <!-- Will be populated by JavaScript -->
          </div>
        </div>
      </div>
    </div>
  </section>
  `;

  // Inject the order confirmation HTML into the page
  document.body.insertAdjacentHTML("beforeend", orderConfirmationHTML);

  // Function to show the order confirmation section
  function showOrderSuccess(orderData) {
    // Hide the main checkout content
    const checkoutContent = document.querySelector(".checkout-content");
    const checkoutHeader = document.querySelector(".checkout-header");

    if (checkoutContent) checkoutContent.style.display = "none";
    if (checkoutHeader) checkoutHeader.style.display = "none";

    // Get cart items
    const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

    // Populate order preview
    const orderItemsContainer = document.getElementById(
      "confirmation-order-items"
    );
    if (orderItemsContainer && cart.length > 0) {
      orderItemsContainer.innerHTML = cart
        .map(
          (item) => `
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>${item.name} (${item.size || "M"}) × ${item.quantity}</span>
            <span>R${((item.price || 650) * item.quantity).toFixed(2)}</span>
          </div>
        `
        )
        .join("");

      // Add total
      const total =
        cart.reduce(
          (sum, item) => sum + (item.price || 650) * item.quantity,
          0
        ) * 1.15;
      orderItemsContainer.innerHTML += `
        <div style="display: flex; justify-content: space-between; font-weight: bold; margin-top: 0.5rem;">
          <span>Total</span>
          <span>R${total.toFixed(2)}</span>
        </div>
      `;
    }

    // Show the confirmation section
    const confirmationSection = document.getElementById("order-confirmation");
    if (confirmationSection) {
      confirmationSection.style.display = "block";
    }

    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // PRODUCTION: Replace simulation with real PayGate integration
  async function processRealPayment(formData, cartTotal) {
    console.log("💳 Processing REAL payment via PayGate...");

    const totalAmount = parseFloat(cartTotal.replace("R", ""));

    // PayGate API call structure (you'll get these from FNB)
    const paymentData = {
      // FNB PayGate credentials (you'll get these after approval)
      paygate_id: "YOUR_PAYGATE_ID", // From FNB
      reference: generateTransactionId(),
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: "ZAR",
      return_url: `${window.location.origin}/checkout-success.html`,
      transaction_date: new Date().toISOString().slice(0, 19).replace("T", " "),

      // Customer details
      email: formData.email,

      // Security checksum (PayGate requires this)
      checksum: generatePayGateChecksum({
        paygate_id: "YOUR_PAYGATE_ID",
        reference: generateTransactionId(),
        amount: Math.round(totalAmount * 100),
        currency: "ZAR",
      }),
    };

    try {
      // Make secure API call to PayGate
      const response = await fetch(
        "https://secure.paygate.co.za/payweb3/initiate.trans",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(paymentData),
        }
      );

      const result = await response.text();
      console.log("PayGate Response:", result);

      // Parse PayGate response
      const responseData = parsePayGateResponse(result);

      if (responseData.pay_request_id) {
        // Redirect to PayGate payment page
        window.location.href = `https://secure.paygate.co.za/payweb3/process.trans?PAY_REQUEST_ID=${responseData.pay_request_id}`;
        return { success: true, redirect: true };
      } else {
        return {
          success: false,
          error: "PAYMENT_INITIATION_FAILED",
          message: "Could not initiate payment. Please try again.",
        };
      }
    } catch (error) {
      console.error("PayGate API Error:", error);
      return {
        success: false,
        error: "NETWORK_ERROR",
        message: "Network error. Please check your connection and try again.",
      };
    }
  }

  // PayGate checksum generator (security requirement)
  function generatePayGateChecksum(data) {
    // You'll get the secret key from FNB
    const secret = "YOUR_PAYGATE_SECRET"; // From FNB

    // Create string for hashing
    const checksumString = Object.values(data).join("") + secret;

    // Generate MD5 hash (PayGate requirement)
    return md5(checksumString);
  }

  // Simple MD5 function for checksums (or use crypto-js library)
  function md5(string) {
    // You can use the crypto-js library or implement MD5
    // For now, returning placeholder - install crypto-js for production
    return "placeholder_checksum";
  }

  // Parse PayGate response
  function parsePayGateResponse(responseString) {
    const params = new URLSearchParams(responseString);
    return {
      pay_request_id: params.get("PAY_REQUEST_ID"),
      reference: params.get("REFERENCE"),
      checksum: params.get("CHECKSUM"),
    };
  }
});
