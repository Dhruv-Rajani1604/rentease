const ORDERS_KEY = "rentease-orders";

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

// Escapes text the user typed (such as the address) before it goes into the page
function esc(text) {
  return String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

function money(amount) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

function fmt(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// The date the rental ends: delivery date plus the number of months
function endDate(delivery, months) {
  const d = new Date(delivery);
  d.setMonth(d.getMonth() + months);
  return d;
}

function render() {
  const list = document.getElementById("orders");
  const emptyMessage = document.getElementById("no-orders");
  const orders = loadOrders().slice().reverse(); // newest first

  if (orders.length === 0) {
    list.innerHTML = "";
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";
  list.innerHTML = orders
    .map(
      (o) => `
    <article class="panel" style="margin-bottom: 16px">
      <div class="cart-item">
        <div>
          <span class="status">Active</span>
          <h3>Order placed ${fmt(o.placed)}</h3>
          <p class="meta">Delivery to ${esc(o.address)} on ${fmt(o.delivery)}</p>
        </div>
        <div>
          <p class="price">${money(o.monthly)} / month</p>
          <p class="meta">Deposits ${money(o.deposits)}</p>
        </div>
      </div>

      ${o.items
        .map(
          (i) => `
        <div class="cart-item" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #fed7aa">
          <div>
            <strong>${esc(i.name)}</strong>
            <p class="meta">${i.months} months · ends ${fmt(endDate(o.delivery, i.months))}</p>
          </div>
          <div>
            <p class="price">${money(i.monthly)} / month</p>
          </div>
          <button class="btn-outline">Request maintenance</button>
        </div>`,
        )
        .join("")}
    </article>`,
    )
    .join("");
}

render();
