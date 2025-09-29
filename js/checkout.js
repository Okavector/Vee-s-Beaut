document.addEventListener("DOMContentLoaded", function () {
  // Grab the correct container for order items
  const checkoutProducts = document.getElementById("checkout-products"); 
  const subtotalEl = document.getElementById("checkout-subtotal");
  const shippingEl = document.getElementById("checkout-shipping");
  const totalEl = document.getElementById("checkout-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let subtotal = 0;
  const shipping = 1000; // ₦ shipping fee

  // Clear previous content (if any)
  checkoutProducts.innerHTML = '';

  if (cart.length === 0) {
    checkoutProducts.innerHTML = `<p>Your cart is empty</p>`;
  } else {
    cart.forEach(item => {
      const lineTotal = item.price * item.quantity;
      subtotal += lineTotal;

      const productDiv = document.createElement("div");
      productDiv.classList.add("d-flex", "justify-content-between");

      productDiv.innerHTML = `
        <p>${item.name} x ${item.quantity}</p>
        <p>₦${lineTotal.toLocaleString()}</p>
      `;

      checkoutProducts.appendChild(productDiv);
    });
  }

  // Update totals
  subtotalEl.textContent = `₦${subtotal.toLocaleString()}`;
  shippingEl.textContent = `₦${cart.length > 0 ? shipping.toLocaleString() : 0}`;
  totalEl.textContent = `₦${(subtotal + (cart.length > 0 ? shipping : 0)).toLocaleString()}`;
});


