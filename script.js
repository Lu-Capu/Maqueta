/* ============================================================
   script.js — Animaciones suaves y funcionalidad básica
   Plantilla corporativa reutilizable.
   Efectos: reveal al hacer scroll, header con sombra,
   contador del nav, y envío del formulario.
============================================================ */

/* 1. HEADER CON SOMBRA AL HACER SCROLL --------------------- */
const header = document.querySelector(".header");

function toggleHeaderShadow() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", toggleHeaderShadow, { passive: true });
toggleHeaderShadow();

/* 2. REVEAL SUAVE AL ENTRAR EN PANTALLA --------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const revealItems = document.querySelectorAll("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
        revealItems.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    // rootMargin: solo recorta un 10% por abajo. Así el elemento se activa
    // apenas asoma en pantalla (desde el borde superior hasta casi el
    // inferior), sin depender de que cruce justo la franja central.
    // Esto evita que, al hacer clic en el menú (scroll suave/animado),
    // la animación ya se haya disparado y terminado antes de que el
    // usuario "llegue" visualmente a la sección.
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    revealItems.forEach((el, index) => {
        if (el.dataset.revealDelay) {
            el.style.transitionDelay = `${el.dataset.revealDelay}ms`;
        }
        revealObserver.observe(el);
    });
});

/* 3. ENLACES DE NAVEGACIÓN ACTIVOS (scrollspy simple) ------- */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".header__nav-link");

function setActiveLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (scrollPos >= top && scrollPos < bottom) {
            navLinks.forEach((link) => {
                link.classList.toggle(
                    "is-active",
                    link.getAttribute("href") === `#${section.id}`
                );
            });
        }
    });
}

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();

/* 4. ENVÍO DEL FORMULARIO (feedback suave) ------------------ */
const form = document.querySelector(".contact__form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = "¡Mensaje enviado!";
    button.disabled = true;
    button.classList.add("btn--sent");
    form.reset();

    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove("btn--sent");
    }, 2500);
});