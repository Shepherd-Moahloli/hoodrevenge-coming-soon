console.log("🚀 CART.JS LOADED AT:", new Date().toISOString());
console.log("File timestamp:", Date.now());

// DEFINE FUNCTIONS OUTSIDE DOMContentLoaded - This is the key!
window.testRemove = function () {
  alert("Test function works! Time: " + Date.now());
  console.log("Test remove function called!");
};

window.removeItem = function (productId) {
  console.log("🗑️ Removing item with ID:", productId);

  const removeButton = event.target;
  removeButton.disabled = true;
  removeButton.textContent = "Removing...";

  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  console.log("Cart before removal:", cart);

  cart = cart.filter((item) => String(item.id) !== String(productId));

  console.log("Cart after removal:", cart);
  localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));

  showRemoveNotification();

  // CHANGE THIS LINE - use location.reload() instead of displayCart()
  setTimeout(() => {
    location.reload(); // This will refresh the whole page and show updated cart
  }, 500);
};

// Add this notification function
function showRemoveNotification() {
  const notification = document.createElement("div");
  notification.innerHTML = "✅ Item removed from cart";
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    padding: 1rem 2rem;
    border-radius: 10px;
    z-index: 10000;
    font-weight: bold;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 2000);
}

window.removeFromCart = function (productId, size) {
  alert(`REMOVING: Product ${productId}, Size ${size}`);
  console.log(`🗑️ Remove from cart: ID ${productId}, Size ${size}`);

  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  const numericProductId = parseInt(productId);

  console.log("Before removal:", cart.length, "items");

  cart = cart.filter((item) => {
    const itemId = parseInt(item.id);
    const keepItem = !(itemId === numericProductId && item.size === size);

    if (!keepItem) {
      console.log(`🎯 Found item to remove:`, item);
    }

    return keepItem;
  });

  console.log("After removal:", cart.length, "items");

  localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));

  // Reload to update display
  location.reload();
};

window.updateQuantity = function (productId, size, newQuantity) {
  console.log(
    `🔄 Update quantity: ID ${productId}, Size ${size}, New quantity: ${newQuantity}`
  );

  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  const item = cart.find((item) => item.id == productId && item.size === size);

  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId, size);
    } else {
      item.quantity = newQuantity;
      localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));
      location.reload();
    }
  }
};

window.updateSize = function (productId, oldSize, newSize) {
  console.log(`👕 Update size: ID ${productId}, from ${oldSize} to ${newSize}`);

  let cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
  const item = cart.find(
    (item) => item.id == productId && item.size === oldSize
  );

  if (item) {
    item.size = newSize;
    localStorage.setItem("hoodrevenge-cart", JSON.stringify(cart));
    location.reload();
  }
};

console.log("✅ Functions defined:", {
  testRemove: typeof window.testRemove,
  removeFromCart: typeof window.removeFromCart,
  updateQuantity: typeof window.updateQuantity,
  updateSize: typeof window.updateSize,
});

// NOW the DOMContentLoaded for page setup
document.addEventListener("DOMContentLoaded", function () {
  console.log("🛒 Cart page loaded");

  displayCartItems();
  updateCartSummary();

  function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCartMessage = document.getElementById("empty-cart");

    console.log("Cart data loaded:", cart);

    if (!cartItemsContainer) {
      console.log("Cart container not found");
      return;
    }

    if (cart.length === 0) {
      if (emptyCartMessage) emptyCartMessage.style.display = "block";
      if (cartItemsContainer) cartItemsContainer.style.display = "none";
      return;
    }

    if (emptyCartMessage) emptyCartMessage.style.display = "none";
    if (cartItemsContainer) cartItemsContainer.style.display = "block";

    cartItemsContainer.innerHTML = cart
      .map((item) => {
        let imageUrl = "images/Artboard 1.jpg";

        if (
          item.images &&
          item.images.main &&
          item.images.main !== "undefined"
        ) {
          imageUrl = item.images.main;
        }

        const price = item.price || 650;
        const size = item.size || "M";

        return `
          <div class="cart-item" data-id="${item.id}" data-size="${size}">
            <div class="item-image">
              <img src="${imageUrl}" alt="${item.name}" class="item-img" />
            </div>
            <div class="item-details">
              <h3 class="item-name">${item.name}</h3>
              <p class="item-price">R${price}</p>
              <div class="size-selection">
                <label>Size:</label>
                <select class="size-dropdown" onchange="updateSize(${
                  item.id
                }, '${size}', this.value)">
                  <option value="XS" ${
                    size === "XS" ? "selected" : ""
                  }>XS</option>
                  <option value="S" ${size === "S" ? "selected" : ""}>S</option>
                  <option value="M" ${size === "M" ? "selected" : ""}>M</option>
                  <option value="L" ${size === "L" ? "selected" : ""}>L</option>
                  <option value="XL" ${
                    size === "XL" ? "selected" : ""
                  }>XL</option>
                  <option value="XXL" ${
                    size === "XXL" ? "selected" : ""
                  }>XXL</option>
                </select>
              </div>
            </div>
            <div class="item-actions">
              <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${
                  item.id
                }, '${size}', ${item.quantity - 1})">−</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${
                  item.id
                }, '${size}', ${item.quantity + 1})">+</button>
              </div>
              <div class="item-total">R${(price * item.quantity).toFixed(
                2
              )}</div>
              <button class="remove-item" onclick="removeFromCart(${
                item.id
              }, '${size}')">REMOVE</button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");

    const subtotal = cart.reduce((total, item) => {
      const price = item.price || 650;
      return total + price * item.quantity;
    }, 0);

    const vat = subtotal * 0.15;
    const shipping = 0;
    const total = subtotal + vat + shipping;

    const subtotalElement = document.getElementById("cart-subtotal");
    const vatElement = document.getElementById("cart-vat");
    const totalElement = document.getElementById("cart-total");

    if (subtotalElement)
      subtotalElement.textContent = `R${subtotal.toFixed(2)}`;
    if (vatElement) vatElement.textContent = `R${vat.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `R${total.toFixed(2)}`;
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("hoodrevenge-cart") || "[]");
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);

    const cartCountElements = document.querySelectorAll("#cart-count");
    cartCountElements.forEach((element) => {
      element.textContent = count;
    });

    console.log(`🔢 Cart count updated to: ${count}`);
  }

  updateCartCount();
});
