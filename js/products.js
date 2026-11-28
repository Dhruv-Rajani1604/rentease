// Local copy of the products, used only if the server cannot be reached
const localProducts = [
  {
    id: 1,
    name: "Queen Bed",
    category: "furniture",
    rent: 1200,
    deposit: 3000,
    image: "images/bed.jpg",
    alt: "Queen bed with wooden frame",
  },
  {
    id: 2,
    name: "3-Seater Sofa",
    category: "furniture",
    rent: 1500,
    deposit: 4000,
    image: "images/sofa.jpg",
    alt: "Three-seater fabric sofa",
  },
  {
    id: 3,
    name: "Dining Table",
    category: "furniture",
    rent: 800,
    deposit: 2000,
    image: "images/dining-table.jpg",
    alt: "Four-seater dining table",
  },
  {
    id: 4,
    name: "Study Table",
    category: "furniture",
    rent: 600,
    deposit: 1500,
    image: "images/study-table.jpg",
    alt: "Wooden study table with a drawer",
  },
  {
    id: 5,
    name: "Double-Door Fridge",
    category: "appliances",
    rent: 1400,
    deposit: 3500,
    image: "images/fridge.jpg",
    alt: "Double-door fridge",
  },
  {
    id: 6,
    name: "Washing Machine",
    category: "appliances",
    rent: 1000,
    deposit: 2500,
    image: "images/washing-machine.jpg",
    alt: "Front-load washing machine",
  },
  {
    id: 7,
    name: '43" Smart TV',
    category: "appliances",
    rent: 1100,
    deposit: 2800,
    image: "images/tv.jpg",
    alt: "43-inch smart TV",
  },
  {
    id: 8,
    name: "Microwave Oven",
    category: "appliances",
    rent: 400,
    deposit: 1000,
    image: "images/microwave.jpg",
    alt: "Microwave oven on a kitchen counter",
  },
];

// The list the page is showing. Starts as the local copy, then the server's copy replaces it.
let products = localProducts;

// Current filter settings
let searchText = "";
let selectedCategory = "all";

const searchBox = document.getElementById("search");
const chips = document.querySelectorAll(".chip");
const furnitureGrid = document.getElementById("furniture-grid");
const applianceGrid = document.getElementById("appliance-grid");
const noResults = document.getElementById("no-results");

function money(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function cardHTML(product) {
  return `
    <article class="card">
      <img src="${product.image}" alt="${product.alt}">
      <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
      <p class="price">${money(product.rent)} / month</p>
      <p class="meta">Deposit ${money(product.deposit)}</p>
    </article>`;
}

// Returns only the products that match both the search text and the category
function filteredProducts() {
  const text = searchText.trim().toLowerCase();
  return products.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesText = p.name.toLowerCase().includes(text);
    return matchesCategory && matchesText;
  });
}

function showProducts() {
  const list = filteredProducts();
  const furniture = list.filter((p) => p.category === "furniture");
  const appliances = list.filter((p) => p.category === "appliances");

  furnitureGrid.innerHTML = furniture.map(cardHTML).join("");
  applianceGrid.innerHTML = appliances.map(cardHTML).join("");

  // Hide a section heading and grid when it has nothing to show
  furnitureGrid.previousElementSibling.style.display = furniture.length
    ? ""
    : "none";
  applianceGrid.previousElementSibling.style.display = appliances.length
    ? ""
    : "none";

  noResults.style.display = list.length ? "none" : "block";
}

function highlightChip() {
  chips.forEach((chip) => {
    const isActive = chip.dataset.category === selectedCategory;
    chip.setAttribute("aria-pressed", isActive);
  });
}

// Fetches the product list from the server.
// If the server is off or the request fails, the local copy stays in use.
async function loadProducts() {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Server returned status " + response.status);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Unexpected data from server");
    }
    products = data;
    console.log("Products loaded from the server");
  } catch (error) {
    products = localProducts;
    console.warn("Using the local product list:", error.message);
  }
}

// Search: redraw on every keystroke
searchBox.addEventListener("input", () => {
  searchText = searchBox.value;
  showProducts();
});

// Category buttons: set the category, highlight the active one, redraw
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    selectedCategory = chip.dataset.category;
    highlightChip();
    showProducts();
  });
});

// Show the local cards straight away, then replace them with the server's list
highlightChip();
showProducts();

loadProducts().then(showProducts);
