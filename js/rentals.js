const ORDERS_KEY = "rentease-orders";
const REQUESTS_KEY = "rentease-requests";

// The order whose maintenance form is open (or null if none is open)
let openOrderId = null;

function loadList(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
}

function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

// Escapes text the user typed before it goes into the page
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

function endDate(delivery, months) {
  const d = new Date(delivery);
  d.setMonth(d.getMonth() + months);
  return d;
}

function requestsFor(orderId) {
  return loadList(REQUESTS_KEY).filter((r) => r.orderId === orderId);
}

function requestHTML(r) {
  const isOpen = r.status === "Open";
  return `
    <div class="request-item">
      <span class="status ${isOpen ? "open" : "returned"}">${esc(r.status)}</span>
      <span class="meta">Sent ${fmt(r.created)}</span>
      <p>${esc(r.text)}</p>
    </div>`;
}

function orderHTML(o) {
  const isOpen = openOrderId === o.id;
  const requests = requestsFor(o.id);

  return `
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
        </div>`,
        )
        .join("")}

      <button class="btn-outline" style="margin-top: 16px" data-act="toggle" data-order="${o.id}" aria-expanded="${isOpen}">
        Request maintenance
      </button>

      <form class="maint-form" data-order="${o.id}" style="display: ${isOpen ? "block" : "none"}" novalidate>
        <div class="field">
          <label for="maint-${o.id}">Describe the problem</label>
          <textarea id="maint-${o.id}" name="text" placeholder="For example: the fridge is not cooling properly"></textarea>
          <div class="field-error" data-error></div>
        </div>
        <button type="submit" class="btn-small">Send request</button>
      </form>

      <div class="requests">
        ${requests.map(requestHTML).join("")}
      </div>
    </article>`;
}

function render() {
  const list = document.getElementById("orders");
  const emptyMessage = document.getElementById("no-orders");
  const orders = loadList(ORDERS_KEY).slice().reverse(); // newest first

  if (orders.length === 0) {
    list.innerHTML = "";
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";
  list.innerHTML = orders.map(orderHTML).join("");
}

// "Request maintenance" opens or closes the form for that order only
document.addEventListener("click", (e) => {
  const button = e.target.closest('[data-act="toggle"]');
  if (!button) return;

  const orderId = Number(button.dataset.order);
  const opening = openOrderId !== orderId;

  // Close every form first, then open the one that was clicked
  document
    .querySelectorAll("form.maint-form")
    .forEach((f) => (f.style.display = "none"));
  document
    .querySelectorAll('[data-act="toggle"]')
    .forEach((b) => b.setAttribute("aria-expanded", "false"));

  if (opening) {
    const form = document.querySelector(
      `form.maint-form[data-order="${orderId}"]`,
    );
    form.style.display = "block";
    button.setAttribute("aria-expanded", "true");
    form.querySelector("textarea").focus();
    openOrderId = orderId;
  } else {
    openOrderId = null;
  }
});

// Sending a maintenance request
document.addEventListener("submit", (e) => {
  const form = e.target.closest("form.maint-form");
  if (!form) return;
  e.preventDefault();

  const textarea = form.querySelector("textarea");
  const text = textarea.value.trim();
  const error = form.querySelector("[data-error]");

  if (text.length < 10) {
    error.textContent =
      "Please describe the problem in at least 10 characters.";
    textarea.setAttribute("aria-invalid", "true");
    textarea.focus();
    return;
  }

  const requests = loadList(REQUESTS_KEY);
  requests.push({
    id: Date.now(),
    orderId: Number(form.dataset.order),
    text: text,
    status: "Open",
    created: new Date().toISOString(),
  });
  saveList(REQUESTS_KEY, requests);

  openOrderId = null;
  render();
});

render();
