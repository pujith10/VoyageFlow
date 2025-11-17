// calculator.js

// ========== NAV TOGGLE (MOBILE) ==========
const navToggle = document.getElementById("navToggle");
const navbar = document.getElementById("navbar");

if (navToggle && navbar) {
  navToggle.addEventListener("click", () => {
    navbar.classList.toggle("open");
  });
}

// ========== CART STATE ==========
/*
  We'll keep a simple in-memory cart:
  cartItems = {
    "economy-flight": { id, name, category, price }
  }
*/
const cartItems = {};

const optionInputs = document.querySelectorAll(".option-input");

// UI elements for totals and counts
const grandTotalEl = document.getElementById("grandTotal");
const cartHeaderTotalEl = document.getElementById("cartHeaderTotal");
const cartItemsCountEl = document.getElementById("cartItemsCount");
const cartDrawerTotalEl = document.getElementById("cartDrawerTotal");
const cartItemsListEl = document.getElementById("cartItemsList");
const cartEmptyStateEl = document.getElementById("cartEmptyState");

// cart drawer & overlay
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartToggleBtn = document.getElementById("cartToggleBtn");
const cartCloseBtn = document.getElementById("cartCloseBtn");
const floatingCartBtn = document.getElementById("floatingCartBtn");
const viewCartBtn = document.getElementById("viewCartBtn");
const cartConfirmBtn = document.getElementById("cartConfirmBtn");

// confirmation modal
const confirmBtn = document.getElementById("confirmBtn");
const confirmModalOverlay = document.getElementById("confirmModalOverlay");
const confirmModal = document.getElementById("confirmModal");
const modalMessage = document.getElementById("modalMessage");
const modalContinueBtn = document.getElementById("modalContinueBtn");

// ========== HELPER FUNCTIONS ==========

function formatCurrency(amount) {
  // Basic formatting for INR-style display
  return "₹" + amount.toLocaleString("en-IN");
}

function recalculateTotal() {
  let total = 0;
  let count = 0;

  Object.values(cartItems).forEach((item) => {
    total += item.price;
    count += 1;
  });

  // update totals on UI
  if (grandTotalEl) grandTotalEl.textContent = formatCurrency(total);
  if (cartHeaderTotalEl) cartHeaderTotalEl.textContent = formatCurrency(total);
  if (cartDrawerTotalEl) cartDrawerTotalEl.textContent = formatCurrency(total);
  if (cartItemsCountEl) cartItemsCountEl.textContent = count.toString();

  // Toggle empty state visibility
  if (cartEmptyStateEl) {
    cartEmptyStateEl.style.display = count === 0 ? "block" : "none";
  }

  // Re-render cart list
  renderCartItems();
}

function renderCartItems() {
  if (!cartItemsListEl) return;

  cartItemsListEl.innerHTML = "";

  const itemsArray = Object.values(cartItems);

  if (itemsArray.length === 0) {
    return;
  }

  itemsArray.forEach((item) => {
    const li = document.createElement("li");
    li.className = "cart-item";

    li.innerHTML = `
      <div class="cart-item-main">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">${formatCurrency(item.price)}</span>
      </div>
      <div class="cart-item-meta">
        <span class="cart-item-category">${item.category}</span>
        <button class="cart-remove-btn" data-remove-id="${item.id}">Remove</button>
      </div>
    `;

    cartItemsListEl.appendChild(li);
  });

  // attach remove handlers
  const removeButtons = cartItemsListEl.querySelectorAll(".cart-remove-btn");
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-remove-id");
      if (!id) return;

      // Uncheck the associated checkbox
      const checkbox = document.querySelector(
        `.option-input[data-id="${id}"]`
      );
      if (checkbox) {
        checkbox.checked = false;
      }

      // Remove from cart and recalc
      delete cartItems[id];
      recalculateTotal();
    });
  });
}

function toggleCartDrawer(open) {
  if (!cartDrawer || !cartOverlay) return;

  if (open) {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
  } else {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
  }
}

// ========== EVENT LISTENERS FOR CHECKBOXES ==========

optionInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const id = input.getAttribute("data-id");
    const name = input.getAttribute("data-name");
    const category = input.getAttribute("data-category");
    const priceStr = input.getAttribute("data-price");

    if (!id || !name || !category || !priceStr) return;

    const price = parseInt(priceStr, 10) || 0;

    if (input.checked) {
      cartItems[id] = { id, name, category, price };
    } else {
      delete cartItems[id];
    }

    recalculateTotal();
  });
});

// ========== CART DRAWER EVENTS ==========

if (cartToggleBtn) {
  cartToggleBtn.addEventListener("click", () => {
    toggleCartDrawer(true);
  });
}

if (floatingCartBtn) {
  floatingCartBtn.addEventListener("click", () => {
    toggleCartDrawer(true);
  });
}

if (viewCartBtn) {
  viewCartBtn.addEventListener("click", () => {
    toggleCartDrawer(true);
  });
}

if (cartCloseBtn) {
  cartCloseBtn.addEventListener("click", () => {
    toggleCartDrawer(false);
  });
}

if (cartOverlay) {
  cartOverlay.addEventListener("click", () => {
    toggleCartDrawer(false);
  });
}

// Confirm button in drawer should behave like main confirm
if (cartConfirmBtn) {
  cartConfirmBtn.addEventListener("click", () => {
    openConfirmModal();
  });
}

// ========== CONFIRM MODAL LOGIC ==========

function openConfirmModal() {
  if (!confirmModal || !confirmModalOverlay) return;

  const total = Object.values(cartItems).reduce(
    (sum, item) => sum + item.price,
    0
  );
  const count = Object.keys(cartItems).length;

  const summaryText =
    count === 0
      ? "You have not selected any items. You can still proceed to view the final page for this simulation."
      : `You have selected ${count} item(s) with an estimated total of ${formatCurrency(
          total
        )}.`;

  if (modalMessage) {
    modalMessage.textContent = summaryText;
  }

  confirmModalOverlay.classList.add("open");
  confirmModal.classList.add("open");

  // Also close cart drawer if it’s open
  toggleCartDrawer(false);
}

function closeConfirmModal() {
  if (!confirmModal || !confirmModalOverlay) return;
  confirmModalOverlay.classList.remove("open");
  confirmModal.classList.remove("open");
}

// main confirm button on page
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    openConfirmModal();
  });
}

// Overlay click closes modal
if (confirmModalOverlay) {
  confirmModalOverlay.addEventListener("click", () => {
    closeConfirmModal();
  });
}

// Continue button -> navigate to thankyou page
if (modalContinueBtn) {
  modalContinueBtn.addEventListener("click", () => {
    window.location.href = "thankyou.html";
  });
}

// ========== FOOTER YEAR ==========
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ========== INITIAL RENDER ==========
recalculateTotal();