const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress span");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const sections = [...document.querySelectorAll("main section[id]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});

const desktopNavigation = window.matchMedia("(min-width: 761px)");
desktopNavigation.addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

let scrollFrame;
const updateScrollState = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
  scrollFrame = undefined;
};

window.addEventListener("scroll", () => {
  if (!scrollFrame) {
    scrollFrame = window.requestAnimationFrame(updateScrollState);
  }
}, { passive: true });

const revealItems = document.querySelectorAll(".reveal");
if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

if ("IntersectionObserver" in window) {
  const activeSectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-28% 0px -58%", threshold: [0.05, 0.25, 0.5] });
  sections.forEach((section) => activeSectionObserver.observe(section));
}

const deviceScene = document.querySelector("[data-device-scene]");
const finePointer = window.matchMedia("(pointer: fine)");
if (deviceScene && finePointer.matches && !reducedMotion.matches) {
  deviceScene.addEventListener("pointermove", (event) => {
    const bounds = deviceScene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    deviceScene.style.setProperty("--ry", `${8 + x * 9}deg`);
    deviceScene.style.setProperty("--rx", `${-4 - y * 7}deg`);
  });
  deviceScene.addEventListener("pointerleave", () => {
    deviceScene.style.setProperty("--ry", "8deg");
    deviceScene.style.setProperty("--rx", "-4deg");
  });
}

document.querySelectorAll("[data-year]").forEach((item) => {
  item.textContent = String(new Date().getFullYear());
});

updateScrollState();
