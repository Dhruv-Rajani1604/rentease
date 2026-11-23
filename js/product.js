const products = [
  {
    id: 1,
    name: "Queen Bed",
    category: "furniture",
    rent: 1200,
    deposit: 3000,
    image: "images/bed.jpg",
    alt: "Queen bed with wooden frame",
    desc: "A solid queen bed frame that is easy to assemble and move.",
  },
  {
    id: 2,
    name: "3-Seater Sofa",
    category: "furniture",
    rent: 1500,
    deposit: 4000,
    image: "images/sofa.jpg",
    alt: "Three-seater fabric sofa",
    desc: "A comfortable three-seater fabric sofa for living rooms.",
  },
  {
    id: 3,
    name: "Dining Table",
    category: "furniture",
    rent: 800,
    deposit: 2000,
    image: "images/dining-table.jpg",
    alt: "Four-seater dining table",
    desc: "A four-seater dining table with a clean, natural finish.",
  },
  {
    id: 4,
    name: "Study Table",
    category: "furniture",
    rent: 600,
    deposit: 1500,
    image: "images/study-table.jpg",
    alt: "Wooden study table with a drawer",
    desc: "A compact study table with a drawer, ideal for students.",
  },
  {
    id: 5,
    name: "Double-Door Fridge",
    category: "appliances",
    rent: 1400,
    deposit: 3500,
    image: "images/fridge.jpg",
    alt: "Double-door fridge",
    desc: "A double-door fridge with frost-free cooling.",
  },
  {
    id: 6,
    name: "Washing Machine",
    category: "appliances",
    rent: 1000,
    deposit: 2500,
    image: "images/washing-machine.jpg",
    alt: "Front-load washing machine",
    desc: "A front-load washing machine with a quick-wash cycle.",
  },
  {
    id: 7,
    name: '43" Smart TV',
    category: "appliances",
    rent: 1100,
    deposit: 2800,
    image: "images/tv.jpg",
    alt: "43-inch smart TV",
    desc: "A 43-inch smart TV with streaming apps built in.",
  },
  {
    id: 8,
    name: "Microwave Oven",
    category: "appliances",
    rent: 400,
    deposit: 1000,
    image: "images/microwave.jpg",
    alt: "Microwave oven on a kitchen counter",
    desc: "A microwave oven with a grill function, ideal for small kitchens.",
  },
];

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
const product = products.find((p) => p.id === id);

const content = document.getElementById("product-content");
const notFound = document.getElementById("not-found");

function money(amount) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

// Discount for each rental period
function discountFor(months) {
  if (months === 12) return 0.1;
  if (months === 6) return 0.05;
  return 0;
}

function monthlyFor(p, months) {
  return p.rent * (1 - discountFor(months));
}

function selectedMonths() {
  return Number(document.querySelector('input[name="tenure"]:checked').value);
}

function updateCalc() {
  const months = selectedMonths();
  const monthly = monthlyFor(product, months);
  const total = monthly * months;
  const saving = (product.rent - monthly) * months;

  document.getElementById("monthly-price").textContent =
    money(monthly) + " / month";
  document.getElementById("calc-monthly").textContent = money(monthly);
  document.getElementById("calc-total").textContent = money(total);
  document.getElementById("calc-deposit").textContent = money(product.deposit);
  document.getElementById("calc-saving").textContent = money(saving);
}

function showProduct() {
  if (!product) {
    content.style.display = "none";
    notFound.style.display = "block";
    return;
  }

  document.title = product.name + " - RentEase";
  document.getElementById("crumb").textContent = product.name;
  document.getElementById("product-image").src = product.image;
  document.getElementById("product-image").alt = product.alt;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-desc").textContent = product.desc;
  document.getElementById("deposit").textContent =
    "Security deposit: " + money(product.deposit);

  document.querySelectorAll('input[name="tenure"]').forEach((input) => {
    input.addEventListener("change", updateCalc);
  });

  updateCalc();
}

showProduct();
