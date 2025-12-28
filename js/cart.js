// Cart Management System
class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.init();
  }

  // Load cart from localStorage
  loadCart() {
    const savedCart = localStorage.getItem("hoodrevenge-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem("hoodrevenge-cart", JSON.stringify(this.cart));
    this.updateCartCount();
  }

  // Add item to cart
  addItem(product) {
    const existingItem = this.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    this.saveCart();
    this.renderCart();
    this.showAddedNotification(product.name);
  }

  // Remove item from cart
  removeItem(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.saveCart();
    this.renderCart();
  }

  // Update item quantity
  updateQuantity(productId, newQuantity) {
    const item = this.cart.find((item) => item.id === productId);
    if (item) {
      if (newQuantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = newQuantity;
        this.saveCart();
        this.renderCart();
      }
    }
  }

  // Get cart total
  getTotal() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // Get cart count
  getCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Update cart count in navbar
  updateCartCount() {
    const cartCountElements = document.querySelectorAll("#cart-count");
    const count = this.getCount();
    cartCountElements.forEach((element) => {
      element.textContent = count;
    });
  }

  // Show notification when item added
  showAddedNotification(productName) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "cart-notification";
    notification.innerHTML = `
      <p><strong>${productName}</strong> added to cart!</p>
    `;

    // Add notification styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #2c2c2c;
      color: white;
      padding: 1rem 2rem;
      border-radius: 10px;
      z-index: 10000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Render cart on cart page
  renderCart() {
    const cartList = document.getElementById("cart-list");
    const emptyCart = document.getElementById("empty-cart");
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (!cartList) return; // Not on cart page

    if (this.cart.length === 0) {
      // Show empty cart
      emptyCart.style.display = "block";
      cartList.style.display = "none";
      if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
      // Show cart items
      emptyCart.style.display = "none";
      cartList.style.display = "block";
      if (checkoutBtn) checkoutBtn.disabled = false;

      // Render cart items
      cartList.innerHTML = this.cart
        .map(
          (item) => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="item-image">
          <div class="item-details">
            <h3>${item.name}</h3>
            <p>Premium Streetwear</p>
            <div class="item-price">$${item.price.toFixed(2)}</div>
            <div class="quantity-controls">
              <button class="quantity-btn minus" data-id="${item.id}">-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item" data-id="${item.id}">Remove</button>
          </div>
          <div class="item-actions">
            <div class="item-total">$${(item.price * item.quantity).toFixed(
              2
            )}</div>
          </div>
        </div>
      `
        )
        .join("");

      // Add event listeners for cart controls
      this.addCartEventListeners();
    }

    // Update totals
    const subtotal = this.getTotal();
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    if (subtotalElement)
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
  }

  // Add event listeners for cart page controls
  addCartEventListeners() {
    // Quantity buttons
    document.querySelectorAll(".quantity-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.dataset.id;
        const isPlus = e.target.classList.contains("plus");
        const item = this.cart.find((item) => item.id === productId);

        if (item) {
          const newQuantity = isPlus ? item.quantity + 1 : item.quantity - 1;
          this.updateQuantity(productId, newQuantity);
        }
      });
    });

    // Remove buttons
    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.dataset.id;
        this.removeItem(productId);
      });
    });
  }

  // Initialize cart
  init() {
    this.updateCartCount();

    // If on cart page, render cart
    if (document.getElementById("cart-list")) {
      this.renderCart();
    }

    // Add checkout functionality
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        alert("Checkout functionality coming soon! 🚀");
      });
    }
  }
}

// Initialize cart when page loads
document.addEventListener("DOMContentLoaded", function () {
  window.cartManager = new CartManager();
});
