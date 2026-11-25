// Saved orders live under this key in localStorage
const ORDERS_KEY = "rentease-orders";

const form = document.getElementById("checkout-form");
const emptyMessage = document.getElementById("empty-cart");
const summary = document.getElementById("checkout-summary");

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// Today's date as YYYY-MM-DD, using the local time zone
function todayText() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

// Shows or clears the error message under one field
function setError(field, message) {
  document.getElementById(field + "-error").textContent = message;
  document
    .getElementById(field)
    .setAttribute("aria-invalid", message ? "true" : "false");
}

function readForm() {
  return {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    address: document.getElementById("address").value.trim(),
    delivery: document.getElementById("delivery").value,
  };
}

// Returns true only if every field is valid
function validate(values) {
  let valid = true;
  setError("name", "");
  setError("email", "");
  setError("address", "");
  setError("delivery", "");

  if (values.name.length < 2) {
    setError("name", "Please enter your full name.");
    valid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    setError("email", "Please enter a valid email address.");
    valid = false;
  }
  if (values.address.length < 10) {
    setError("address", "Please enter a full delivery address.");
    valid = false;
  }
  if (!values.delivery) {
    setError("delivery", "Please choose a delivery date.");
    valid = false;
  } else if (values.delivery < todayText()) {
    setError("delivery", "The delivery date cannot be in the past.");
    valid = false;
  }
  return valid;
}

function renderSummary(items) {
  const totals = Cart.totals(items);
  summary.innerHTML = `
    <h2 style="font-size: 1.2rem; margin-bottom: 14px">Order summary</h2>
    ${items
      .map(
        (i) => `
      <div class="summary-row">
        <span>${i.name} (${i.months} months)</span>
        <span>${Cart.money(Cart.monthlyFor(i))}</span>
      </div>`,
      )
      .join("")}
    <div class="summary-row" style="margin-top: 12px"><span>Monthly total</span><span>${Cart.money(totals.monthly)}</span></div>
    <div class="summary-row"><span>Deposits</span><span>${Cart.money(totals.deposits)}</span></div>
    <div class="summary-row total"><span>Pay now (first month + deposits)</span><span>${Cart.money(totals.payNow)}</span></div>`;
}

// Start-up: show the cart summary, or the empty message if there's nothing to order
const items = Cart.load();
document.getElementById("delivery").min = todayText();

if (items.length === 0) {
  emptyMessage.style.display = "block";
  form.style.display = "none";
  summary.style.display = "none";
} else {
  renderSummary(items);
}

// Confirm the rental: validate, save the order, empty the cart, go to My Rentals
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const cartItems = Cart.load();
  if (cartItems.length === 0) return;

  const values = readForm();
  if (!validate(values)) return;

  const totals = Cart.totals(cartItems);
  const order = {
    id: Date.now(),
    placed: new Date().toISOString(),
    name: values.name,
    email: values.email,
    address: values.address,
    delivery: values.delivery,
    items: cartItems.map((i) => ({
      name: i.name,
      image: i.image,
      alt: i.alt,
      months: i.months,
      monthly: Math.round(Cart.monthlyFor(i)),
      deposit: i.deposit,
    })),
    monthly: Math.round(totals.monthly),
    deposits: totals.deposits,
  };

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);
  Cart.save([]);

  window.location.href = "rentals.html";
});
