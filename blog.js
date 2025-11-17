// blog.js

// ========== MOBILE NAV TOGGLE ==========
const navToggle = document.getElementById("navToggle");
const navbar = document.getElementById("navbar");

if (navToggle && navbar) {
  navToggle.addEventListener("click", () => {
    navbar.classList.toggle("open");
  });
}

// Close mobile nav when clicking a link (on small screens)
const navLinks = document.querySelectorAll(".nav-link[href^='#']");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetEl = document.querySelector(targetId);

    if (targetEl) {
      const headerOffset = 72; // approximate sticky header height
      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    // Close the nav on mobile after navigating
    if (window.innerWidth <= 768) {
      navbar.classList.remove("open");
    }
  });
});

// ========== ACTIVE LINK ON SCROLL ==========
const sections = document.querySelectorAll("section[data-section]");
const allNavLinks = document.querySelectorAll(".nav-link[href^='#']");

function setActiveNavLink() {
  let currentId = null;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    // Section considered active when its top is in upper half of viewport
    if (rect.top <= window.innerHeight * 0.35 && rect.bottom > window.innerHeight * 0.25) {
      currentId = "#" + section.id;
    }
  });

  if (!currentId) return;

  allNavLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === currentId);
  });
}

window.addEventListener("scroll", setActiveNavLink);
window.addEventListener("load", setActiveNavLink);

// ========== FOOTER YEAR ==========
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}