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

    // Update nav menu colors for white background
    const navLinks = document.querySelectorAll(".nav-menu a");
    navLinks.forEach((link) => {
      link.style.color = "#2c2c2c !important";
      link.style.textShadow = "none";
    });

    // Style the cart link specifically
    const cartLink = document.querySelector(".cart-link");
    if (cartLink) {
      cartLink.style.color = "#2c2c2c !important";
      cartLink.style.background = "none";
      cartLink.style.padding = "0.5rem 1rem";
      cartLink.style.borderRadius = "25px";
      cartLink.style.border = "1px solid #2c2c2c";
      cartLink.style.transition = "all 0.3s ease";
    }

    // Add hover effects for nav links
    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", function () {
        if (!this.classList.contains("cart-link")) {
          this.style.color = "#666 !important";
        }
      });

      link.addEventListener("mouseleave", function () {
        if (!this.classList.contains("cart-link")) {
          this.style.color = "#2c2c2c !important";
        }
      });
    });

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
        return `
        <div class="checkout-item">
          <img src="${item.image}" alt="${item.name}">
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
        let formattedInputValue = value.match(/.{1,4}/g)?.join(" ") || value;

        if (formattedInputValue.length <= 19) {
          e.target.value = formattedInputValue;
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
        e.target.value = e.target.value.replace(/\D/g, "");
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

    // Step 2: Payment Processing
    updateProgressStep(2);

    const btn = document.getElementById("place-order-btn");
    btn.innerHTML = "⏳ Processing Payment...";
    btn.disabled = true;
    btn.classList.add("loading");

    try {
      console.log("💳 Processing payment...");

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("📧 Testing basic email first...");

      // Test basic email first
      const basicTest = await testBasicEmail();
      console.log("🧪 Basic test result:", basicTest);

      if (!basicTest) {
        throw new Error("Basic EmailJS test failed");
      }

      console.log("📧 Basic test passed, sending order emails...");

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
          }, 8000); // Longer delay to see the nice confirmation screen
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

  // Replace the validateCardDetails function with this relaxed version for testing
  function validateCardDetails(data) {
    console.log("🧪 TESTING MODE: Card validation relaxed");

    // Basic format checks only (not strict validation)
    const cardNumber = data.cardNumber.replace(/\s/g, "");

    // Just check if it looks like a card number
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      alert("❌ Card number must be between 13-19 digits");
      document.getElementById("cardNumber").focus();
      return false;
    }

    // Check if expiry date format is correct
    if (!data.expiryDate || !data.expiryDate.includes("/")) {
      alert("❌ Please enter expiry date in MM/YY format");
      document.getElementById("expiryDate").focus();
      return false;
    }

    // Check if CVV is present
    if (!data.cvv || data.cvv.length < 3) {
      alert("❌ Please enter a valid CVV (3-4 digits)");
      document.getElementById("cvv").focus();
      return false;
    }

    // For testing - accept any properly formatted card
    console.log("✅ Card details format accepted (testing mode)");
    return true;
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
        <div style="border-top: 1px solid #ddd; padding-top: 0.5rem; margin-top: 1rem; font-weight: bold;">
          <div style="display: flex; justify-content: space-between;">
            <span>Total (incl. VAT):</span>
            <span>R${total.toFixed(2)}</span>
          </div>
        </div>
      `;
    }

    // Show the confirmation section
    const confirmationSection = document.getElementById("order-confirmation");
    if (confirmationSection) {
      confirmationSection.style.display = "block";
      confirmationSection.classList.add("active");
    }
  }
});
