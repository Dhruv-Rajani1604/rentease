const products = [
  { id: 1, name: "Queen Bed", category: "furniture", rent: 1200, deposit: 3000, image: "images/bed.jpg", alt: "Queen bed with wooden frame" },
  { id: 2, name: "3-Seater Sofa", category: "furniture", rent: 1500, deposit: 4000, image: "images/sofa.jpg", alt: "Three-seater fabric sofa" },
  { id: 3, name: "Dining Table", category: "furniture", rent: 800, deposit: 2000, image: "images/dining-table.jpg", alt: "Four-seater dining table" },
  { id: 4, name: "Study Table", category: "furniture", rent: 600, deposit: 1500, image: "images/study-table.jpg", alt: "Wooden study table with a drawer" },
  { id: 5, name: "Double-Door Fridge", category: "appliances", rent: 1400, deposit: 3500, image: "images/fridge.jpg", alt: "Double-door fridge" },
  { id: 6, name: "Washing Machine", category: "appliances", rent: 1000, deposit: 2500, image: "images/washing-machine.jpg", alt: "Front-load washing machine" },
  { id: 7, name: "43\" Smart TV", category: "appliances", rent: 1100, deposit: 2800, image: "images/tv.jpg", alt: "43-inch smart TV" },
  { id: 8, name: "Microwave Oven", category: "appliances", rent: 400, deposit: 1000, image: "images/microwave.jpg", alt: "Microwave oven on a kitchen counter" }
];

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

function showProducts() {
  const furnitureGrid = document.getElementById("furniture-grid");
  const applianceGrid = document.getElementById("appliance-grid");

  furnitureGrid.innerHTML = products
    .filter(p => p.category === "furniture")
    .map(cardHTML)
    .join("");

  applianceGrid.innerHTML = products
    .filter(p => p.category === "appliances")
    .map(cardHTML)
    .join("");
}

showProducts();