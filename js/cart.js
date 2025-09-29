// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartTableBody = document.getElementById("cart-items");
const subtotalEl = document.getElementById("cart-subtotal");
const shippingEl = document.getElementById("cart-shipping");
const totalEl = document.getElementById("cart-total");

const shippingRate = 1000; // Example: ₦1000 flat shipping

function renderCart() {
  cartTableBody.innerHTML = "";

  let subtotal = 0;

  cart.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    const row = `
      <tr>
        <td class="align-middle">
          <img src="${item.image}" alt="" style="width: 50px;"> ${item.name}
        </td>
        <td class="align-middle">₦${item.price.toLocaleString()}</td>
        <td class="align-middle">
          <input type="number" min="1" value="${item.quantity}" 
            onchange="updateQuantity(${index}, this.value)" style="width:60px;">
        </td>
        <td class="align-middle">₦${lineTotal.toLocaleString()}</td>
        <td class="align-middle">
          <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">
            <i class="fa fa-times"></i>
          </button>
        </td>
      </tr>
    `;
    cartTableBody.innerHTML += row;
  });

  let shipping = subtotal > 0 ? shippingRate : 0;
  let total = subtotal + shipping;

  subtotalEl.innerText = `₦${subtotal.toLocaleString()}`;
  shippingEl.innerText = `₦${shipping.toLocaleString()}`;
  totalEl.innerText = `₦${total.toLocaleString()}`;
}

function updateQuantity(index, qty) {
  cart[index].quantity = parseInt(qty);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Initialize
renderCart();
