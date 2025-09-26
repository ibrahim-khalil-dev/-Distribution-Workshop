// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const nav = document.querySelector(".nav")

  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener("click", () => {
      nav.classList.toggle("active")
      mobileMenuBtn.classList.toggle("active")
    })

    // Close menu when clicking on nav links
    const navLinks = nav.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active")
        mobileMenuBtn.classList.remove("active")
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        nav.classList.remove("active")
        mobileMenuBtn.classList.remove("active")
      }
    })
  }
})

// Header scroll effect (optional enhancement)
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
  } else {
    header.style.boxShadow = "none"
  }
})
