class MobileStillsCarousel {
  constructor() {
    this.carousel = document.querySelector(".stills-grid")
    this.items = document.querySelectorAll(".still-item")
    this.currentIndex = 0
    this.totalItems = this.items.length
    this.isAnimating = false
    this.isMobile = false

    this.init()
  }

  init() {
    this.checkMobile()
    this.setupEventListeners()

    // Initialize on page load
    if (this.isMobile) {
      this.setupMobileCarousel()
    }
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 768
  }

  setupEventListeners() {
    // Resize listener
    window.addEventListener("resize", () => {
      const wasMobile = this.isMobile
      this.checkMobile()

      if (wasMobile !== this.isMobile) {
        if (this.isMobile) {
          this.setupMobileCarousel()
        } else {
          this.resetDesktopLayout()
        }
      }
    })
  }

  setupMobileCarousel() {
    if (!this.isMobile) return

    // Create carousel wrapper if it doesn't exist
    if (!document.querySelector(".mobile-carousel-wrapper")) {
      const wrapper = document.createElement("div")
      wrapper.className = "mobile-carousel-wrapper"

      // Create navigation buttons
      const prevBtn = document.createElement("button")
      prevBtn.className = "mobile-carousel-nav mobile-carousel-prev"
      prevBtn.innerHTML = "‹"
      prevBtn.setAttribute("aria-label", "Previous image")

      const nextBtn = document.createElement("button")
      nextBtn.className = "mobile-carousel-nav mobile-carousel-next"
      nextBtn.innerHTML = "›"
      nextBtn.setAttribute("aria-label", "Next image")

      // Wrap the carousel
      this.carousel.parentNode.insertBefore(wrapper, this.carousel)
      wrapper.appendChild(prevBtn)
      wrapper.appendChild(this.carousel)
      wrapper.appendChild(nextBtn)

      // Create dots indicator
      const dotsContainer = document.createElement("div")
      dotsContainer.className = "mobile-carousel-dots"
      for (let i = 0; i < this.totalItems; i++) {
        const dot = document.createElement("button")
        dot.className = `mobile-carousel-dot ${i === 0 ? "active" : ""}`
        dot.setAttribute("aria-label", `Go to image ${i + 1}`)
        dot.addEventListener("click", () => this.goToSlide(i))
        dotsContainer.appendChild(dot)
      }
      wrapper.appendChild(dotsContainer)

      // Add event listeners
      prevBtn.addEventListener("click", () => this.prevSlide())
      nextBtn.addEventListener("click", () => this.nextSlide())

      // Touch/swipe support
      this.addTouchSupport()

      // Keyboard navigation
      this.addKeyboardSupport()
    }

    this.updateCarousel()
  }

  addTouchSupport() {
    let startX = 0
    let endX = 0
    let startY = 0
    let endY = 0

    this.carousel.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
      },
      { passive: true },
    )

    this.carousel.addEventListener(
      "touchend",
      (e) => {
        endX = e.changedTouches[0].clientX
        endY = e.changedTouches[0].clientY
        this.handleSwipe(startX, endX, startY, endY)
      },
      { passive: true },
    )
  }

  addKeyboardSupport() {
    document.addEventListener("keydown", (e) => {
      if (this.isMobile && document.activeElement.closest(".mobile-carousel-wrapper")) {
        if (e.key === "ArrowLeft") {
          e.preventDefault()
          this.prevSlide()
        }
        if (e.key === "ArrowRight") {
          e.preventDefault()
          this.nextSlide()
        }
      }
    })
  }

  handleSwipe(startX, endX, startY, endY) {
    const threshold = 50
    const diffX = startX - endX
    const diffY = Math.abs(startY - endY)

    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(diffX) > threshold && diffY < threshold) {
      if (diffX > 0) {
        this.nextSlide()
      } else {
        this.prevSlide()
      }
    }
  }

  nextSlide() {
    if (this.isAnimating || !this.isMobile) return
    this.currentIndex = (this.currentIndex + 1) % this.totalItems
    this.updateCarousel()
  }

  prevSlide() {
    if (this.isAnimating || !this.isMobile) return
    this.currentIndex = this.currentIndex === 0 ? this.totalItems - 1 : this.currentIndex - 1
    this.updateCarousel()
  }

  goToSlide(index) {
    if (this.isAnimating || index === this.currentIndex || !this.isMobile) return
    this.currentIndex = index
    this.updateCarousel()
  }

  updateCarousel() {
    if (!this.isMobile) return

    this.isAnimating = true

    // Update transform
    const translateX = -this.currentIndex * 100
    this.carousel.style.transform = `translateX(${translateX}%)`

    // Update dots
    const dots = document.querySelectorAll(".mobile-carousel-dot")
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex)
    })

    // Update navigation buttons state
    const prevBtn = document.querySelector(".mobile-carousel-prev")
    const nextBtn = document.querySelector(".mobile-carousel-next")

    if (prevBtn && nextBtn) {
      prevBtn.style.opacity = this.currentIndex === 0 ? "0.6" : "1"
      nextBtn.style.opacity = this.currentIndex === this.totalItems - 1 ? "0.6" : "1"
    }

    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false
    }, 350)
  }

  resetDesktopLayout() {
    const wrapper = document.querySelector(".mobile-carousel-wrapper")
    if (wrapper) {
      // Move carousel back to original position
      const stillsSection = wrapper.parentNode
      stillsSection.insertBefore(this.carousel, wrapper)
      wrapper.remove()
    }

    // Reset any transforms
    this.carousel.style.transform = ""
    this.currentIndex = 0
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MobileStillsCarousel()
})
