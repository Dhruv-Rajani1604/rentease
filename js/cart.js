// Cart storage and display, saved in the browser with localStorage
const Cart = {
  key: "rentease-cart",

  money(amount) {
    return "₹" + Math.round(amount).toLocaleString("en-IN");
  },

  // Discount for each rental period
  discount(months) {
    if (months === 12) return 0.1;
    if (months === 6) return 0.05;
    return 0;
  },

  load() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch (e) {
      return [];
    }
  },

  save(items) {
    localStorage.setItem(this.key, JSON.stringify(items));
  },

  // Adds an item, or updates the period if the product is already in the cart.
  // Returns "added" or "updated".
  add(item) {
    const items = this.load();
    const index = items.findIndex((x) => x.id === item.id);
    if (index >= 0) {
      items[index].months = item.months;
      this.save(items);
      return "updated";
    }
    items.push(item);
    this.save(items);
    return "added";
  },

  remove(index) {
    const items = this.load();
    items.splice(index, 1);
    this.save(items);
  },

  monthlyFor(item) {
    return item.rent * (1 - this.discount(item.months));
  },

  totals(items) {
    const monthly = items.reduce((sum, item) => sum + this.monthlyFor(item), 0);
    const deposits = items.reduce((sum, item) => sum + item.deposit, 0);
    return { monthly, deposits, payNow: monthly + deposits };
  },
};

// Draws the cart on cart.html. Does nothing on other pages.
function renderCart() {
  const list = document.getElementById("cart-items");
  if (!list) return;

  const items = Cart.load();
  const emptyMessage = document.getElementById("empty-cart");
  const summary = document.getElementById("summary");

  if (items.length === 0) {
    list.innerHTML = "";
    emptyMessage.style.display = "block";
    summary.style.display = "none";
    return;
  }

  emptyMessage.style.display = "none";
  summary.style.display = "";

  list.innerHTML = items
    .map(
      (item, i) => `
    <div class="panel" style="margin-bottom: 16px">
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <p class="meta">${item.months} months</p>
        </div>
        <div>
          <p class="price">${Cart.money(Cart.monthlyFor(item))} / month</p>
          <p class="meta">Deposit ${Cart.money(item.deposit)}</p>
        </div>
        <button class="btn-small" data-remove="${i}">Remove</button>
      </div>
    </div>`,
    )
    .join("");

  const totals = Cart.totals(items);
  document.getElementById("sum-monthly").textContent = Cart.money(
    totals.monthly,
  );
  document.getElementById("sum-deposits").textContent = Cart.money(
    totals.deposits,
  );
  document.getElementById("sum-paynow").textContent = Cart.money(totals.payNow);
}

// Remove buttons
document.addEventListener("click", (e) => {
  const button = e.target.closest("[data-remove]");
  if (!button) return;
  Cart.remove(Number(button.dataset.remove));
  renderCart();
});

renderCart();
