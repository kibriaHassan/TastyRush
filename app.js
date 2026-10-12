const popular = [
  {
    name: "Prego Steak",
    price: 30,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
    extra: false
  },
  {
    name: "Prego Steak Pizza",
    price: 30,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    extra: false
  },
  {
    name: "Prego Ribeye",
    price: 30,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    extra: false
  },
  {
    name: "Crispy Chicken Bowl",
    price: 24,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
    extra: true
  }
];

const future = [
  {
    name: "Rusul Yerichev Japan",
    price: 50,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    extra: false
  },
  {
    name: "Valeria Boltneva Japan",
    price: 80,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80",
    extra: false
  },
  {
    name: "Duong Quach Japan",
    price: 70,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80",
    extra: false
  },
  {
    name: "Tokyo Night Ramen",
    price: 42,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    extra: true
  }
];

const money = (n) => `$${n.toFixed(2)}`;
const stars = (rating) => "★★★★★".slice(0, Math.round(rating)) + "☆☆☆☆☆".slice(Math.round(rating));

const cart = [];

function cardTemplate(item, index, group) {
  return `
    <article class="dish-card${item.extra ? " hidden-card" : ""}" data-name="${item.name.toLowerCase()}" data-group="${group}" data-extra="${item.extra}">
      <img src="${item.image}" alt="${item.name}" />
      <div class="dish-body">
        <h3>${item.name}</h3>
        <div class="dish-meta">
          <span class="price">${money(item.price)}</span>
          <span class="stars" aria-label="${item.rating} stars">${stars(item.rating)} ${item.rating}</span>
        </div>
        <button class="order-btn" type="button" data-group="${group}" data-index="${index}">Order Now</button>
      </div>
    </article>`;
}

function renderMenu() {
  document.getElementById("popular-grid").innerHTML = popular.map((item, i) => cardTemplate(item, i, "popular")).join("");
  document.getElementById("future-grid").innerHTML = future.map((item, i) => cardTemplate(item, i, "future")).join("");
}

function catalog(group) {
  return group === "popular" ? popular : future;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderCart() {
  const box = document.getElementById("cart-items");
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-count").textContent = String(count);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  document.getElementById("cart-total").textContent = money(total);
  if (!cart.length) {
    box.innerHTML = `<p class="empty">Your cart is empty. Pick something delicious.</p>`;
    return;
  }
  box.innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <img src="${item.image}" alt="" />
      <div>
        <strong>${item.name}</strong>
        <div class="qty">
          <button type="button" data-qty="-1" data-index="${index}" aria-label="Decrease">−</button>
          <span>${item.qty}</span>
          <button type="button" data-qty="1" data-index="${index}" aria-label="Increase">+</button>
        </div>
      </div>
      <span>${money(item.price * item.qty)}</span>
    </div>
  `).join("");
}

function addItem(item) {
  const found = cart.find((row) => row.name === item.name && row.image === item.image);
  if (found) found.qty += 1;
  else cart.push({ ...item, qty: 1 });
  renderCart();
  showToast(`${item.name} added`);
}

document.getElementById("year").textContent = String(new Date().getFullYear());
renderMenu();
renderCart();

document.body.addEventListener("click", (event) => {
  const order = event.target.closest(".order-btn");
  if (order) {
    const item = catalog(order.dataset.group)[Number(order.dataset.index)];
    addItem(item);
  }
  const qty = event.target.closest("[data-qty]");
  if (qty) {
    const index = Number(qty.dataset.index);
    cart[index].qty += Number(qty.dataset.qty);
    if (cart[index].qty <= 0) cart.splice(index, 1);
    renderCart();
  }
});

document.querySelectorAll(".see-more").forEach((button) => {
  button.addEventListener("click", () => {
    const cards = document.querySelectorAll(`.dish-card[data-group="${button.dataset.target}"][data-extra="true"]`);
    const opening = cards[0]?.classList.contains("hidden-card");
    cards.forEach((card) => card.classList.toggle("hidden-card", !opening));
    button.textContent = opening ? "See less" : "See more";
  });
});

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) navLinks.classList.remove("open");
});

const searchBar = document.getElementById("search-bar");
const searchInput = document.getElementById("search-input");
document.getElementById("search-toggle").addEventListener("click", () => {
  searchBar.hidden = !searchBar.hidden;
  if (!searchBar.hidden) searchInput.focus();
});
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  document.querySelectorAll(".dish-card").forEach((card) => {
    const match = !query || card.dataset.name.includes(query);
    card.classList.toggle("search-hide", !match);
  });
});

const cartDrawer = document.getElementById("cart-drawer");
document.getElementById("cart-toggle").addEventListener("click", () => {
  cartDrawer.hidden = false;
});
document.getElementById("cart-close").addEventListener("click", () => {
  cartDrawer.hidden = true;
});
cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) cartDrawer.hidden = true;
});
document.getElementById("checkout").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Add a dish first");
    return;
  }
  cart.splice(0, cart.length);
  renderCart();
  cartDrawer.hidden = true;
  showToast("Order placed. Hot food is on the way.");
});

const signin = document.getElementById("signin-modal");
const signinBtn = document.getElementById("signin-open");
document.getElementById("signin-open").addEventListener("click", () => {
  signin.hidden = false;
});
document.getElementById("signin-close").addEventListener("click", () => {
  signin.hidden = true;
});
signin.addEventListener("click", (event) => {
  if (event.target === signin) signin.hidden = true;
});
document.getElementById("signin-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("signin-email").value.trim();
  signinBtn.textContent = email.split("@")[0];
  signin.hidden = true;
  showToast("Signed in");
});

document.getElementById("subscribe-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  document.getElementById("form-note").textContent = `Subscribed with ${email}`;
  event.currentTarget.reset();
  showToast("You are on the special offer list");
});

document.getElementById("bell-btn").addEventListener("click", () => {
  showToast("No new alerts. Your next meal is the news.");
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById(button.dataset.close).hidden = true;
  });
});

document.querySelector('a[href="#privacy"]').addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("privacy").hidden = false;
});
