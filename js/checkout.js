/* filepath: js/checkout.js */
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

    // Card number formatting
    const cardNumber = document.getElementById("cardNumber");
    if (cardNumber) {
      cardNumber.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        let formattedInputValue = value.match(/.{1,4}/g)?.join(" ") || value;

        if (formattedInputValue.length <= 19) {
          e.target.value = formattedInputValue;
        }
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
      });
    }

    // CVV formatting
    const cvv = document.getElementById("cvv");
    if (cvv) {
      cvv.addEventListener("input", function (e) {
        e.target.value = e.target.value.replace(/\D/g, "");
      });
    }

    // Phone number formatting
    const phone = document.getElementById("phone");
    if (phone) {
      phone.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.startsWith("27")) {
          value = "+" + value;
        } else if (value.startsWith("0")) {
          value = "+27" + value.slice(1);
        }
        e.target.value = value;
      });
    }

    // Place order functionality
    placeOrderBtn.addEventListener("click", function (e) {
      e.preventDefault();
      processOrder();
    });
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

    const btn = document.getElementById("place-order-btn");
    btn.innerHTML = "⏳ Processing Order...";
    btn.disabled = true;

    try {
      console.log("📧 Testing basic email first...");

      // Test basic email first
      const basicTest = await testBasicEmail();
      console.log("🧪 Basic test result:", basicTest);

      if (!basicTest) {
        throw new Error("Basic EmailJS test failed");
      }

      console.log("📧 Basic test passed, sending full order email...");

      // Send full order email
      const emailSent = await sendBusinessOrderNotification(formData, cart);

      console.log("📧 Full email result:", emailSent);

      if (emailSent) {
        console.log("✅ Email sent successfully!");

        setTimeout(() => {
          localStorage.removeItem("hoodrevenge-cart");
          showOrderSuccess(formData);

          setTimeout(() => {
            alert(
              "🎉 Order confirmed! You should receive an email notification."
            );
            window.location.href = "shop.html";
          }, 2000);
        }, 1500);
      } else {
        console.error("❌ Email failed - not completing order");
        alert(
          "⚠️ Order could not be processed. Email notification failed. Please try again."
        );

        btn.innerHTML = `Place Order - ${calculateOrderTotal(cart)}`;
        btn.disabled = false;
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      alert(
        "⚠️ Order could not be processed due to an error. Please try again."
      );

      btn.innerHTML = `Place Order - ${calculateOrderTotal(cart)}`;
      btn.disabled = false;
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

  function collectFormData() {
    const selectedPayment = document.querySelector(
      'input[name="payment"]:checked'
    ).value;

    return {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      province: document.getElementById("province").value,
      postalCode: document.getElementById("postalCode").value,
      paymentMethod: selectedPayment,
      cardNumber:
        selectedPayment === "card"
          ? document.getElementById("cardNumber").value
          : null,
      expiryDate:
        selectedPayment === "card"
          ? document.getElementById("expiryDate").value
          : null,
      cvv:
        selectedPayment === "card"
          ? document.getElementById("cvv").value
          : null,
    };
  }

  function validateForm(data) {
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "province",
      "postalCode",
    ];

    for (let field of required) {
      if (!data[field] || data[field].trim() === "") {
        alert(
          `Please fill in the ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()} field.`
        );
        document.getElementById(field).focus();
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert("Please enter a valid email address.");
      document.getElementById("email").focus();
      return false;
    }

    // Validate card details if card payment selected
    if (data.paymentMethod === "card") {
      if (!data.cardNumber || data.cardNumber.replace(/\s/g, "").length < 13) {
        alert("Please enter a valid card number.");
        document.getElementById("cardNumber").focus();
        return false;
      }

      if (!data.expiryDate || data.expiryDate.length !== 5) {
        alert("Please enter a valid expiry date (MM/YY).");
        document.getElementById("expiryDate").focus();
        return false;
      }

      if (!data.cvv || data.cvv.length < 3) {
        alert("Please enter a valid CVV.");
        document.getElementById("cvv").focus();
        return false;
      }
    }

    // Apple Pay and EFT don't need additional validation
    if (data.paymentMethod === "applepay") {
      console.log("Apple Pay payment method validated");
    }

    return true;
  }

  // Add these missing functions at the end, before the closing bracket
  function showOrderSuccess(orderData) {
    const notification = document.createElement("div");
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <span style="font-size: 2rem;">🎉</span>
        <div>
          <strong>Order Confirmed!</strong>
          <br><small>Thank you ${orderData.firstName}! Check your email for details.</small>
        </div>
      </div>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #2c2c2c;
      color: white;
      padding: 2rem 2.5rem;
      border-radius: 15px;
      z-index: 10000;
      box-shadow: 0 8px 30px rgba(0,0,0,0.4);
      transform: translateX(400px);
      transition: transform 0.3s ease;
      min-width: 350px;
    `;

    document.body.appendChild(notification);
    setTimeout(() => (notification.style.transform = "translateX(0)"), 100);
  }
});
