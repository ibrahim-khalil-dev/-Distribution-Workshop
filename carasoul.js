class StillsCarousel {
  constructor() {
    this.carousel = document.querySelector(".stills-grid")
    this.container = document.querySelector(".stills-carousel-container")
    this.items = document.querySelectorAll(".still-item")
    this.prevBtn = document.querySelector(".carousel-prev")
    this.nextBtn = document.querySelector(".carousel-next")
    this.dots = document.querySelectorAll(".carousel-dot")

    this.currentIndex = 0
    this.totalItems = this.items.length
    this.isAnimating = false
    this.isMobile = false

    this.init()
  }

  init() {
    this.checkMobile()
    this.addEventListeners()
    this.updateCarousel()

    // Listen for window resize
    window.addEventListener("resize", () => {
      this.checkMobile()
      this.updateCarousel()
    })
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 768
  }

  addEventListeners() {
    // Navigation buttons
    if (this.prevBtn && this.nextBtn) {
      this.prevBtn.addEventListener("click", () => this.prevSlide())
      this.nextBtn.addEventListener("click", () => this.nextSlide())
    }

    // Dots navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index))
    })

    // Touch/swipe support
    let startX = 0
    let endX = 0
    let startY = 0
    let endY = 0

    if (this.carousel) {
      this.carousel.addEventListener(
        "touchstart",
        (e) => {
          if (!this.isMobile) return
          startX = e.touches[0].clientX
          startY = e.touches[0].clientY
        },
        { passive: true },
      )

      this.carousel.addEventListener(
        "touchend",
        (e) => {
          if (!this.isMobile) return
          endX = e.changedTouches[0].clientX
          endY = e.changedTouches[0].clientY
          this.handleSwipe(startX, endX, startY, endY)
        },
        { passive: true },
      )
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!this.isMobile) return

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        this.prevSlide()
      }
      if (e.key === "ArrowRight") {
        e.preventDefault()
        this.nextSlide()
      }
    })
  }

  handleSwipe(startX, endX, startY, endY) {
    const threshold = 50
    const diffX = startX - endX
    const diffY = Math.abs(startY - endY)

    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(diffX) > threshold && diffY < 100) {
      if (diffX > 0) {
        this.nextSlide()
      } else {
        this.prevSlide()
      }
    }
  }

  nextSlide() {
    if (!this.isMobile || this.isAnimating) return

    this.currentIndex = (this.currentIndex + 1) % this.totalItems
    this.updateCarousel()
  }

  prevSlide() {
    if (!this.isMobile || this.isAnimating) return

    this.currentIndex = this.currentIndex === 0 ? this.totalItems - 1 : this.currentIndex - 1
    this.updateCarousel()
  }

  goToSlide(index) {
    if (!this.isMobile || this.isAnimating || index === this.currentIndex) return

    this.currentIndex = index
    this.updateCarousel()
  }

  updateCarousel() {
    if (!this.carousel) return

    if (this.isMobile) {
      // Mobile: Apply carousel transform
      this.isAnimating = true

      const translateX = -this.currentIndex * 100
      this.carousel.style.transform = `translateX(${translateX}%)`

      // Update dots
      this.dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === this.currentIndex)
      })

      // Update navigation buttons opacity
      if (this.prevBtn && this.nextBtn) {
        this.prevBtn.style.opacity = this.currentIndex === 0 ? "0.6" : "1"
        this.nextBtn.style.opacity = this.currentIndex === this.totalItems - 1 ? "0.6" : "1"
      }

      setTimeout(() => {
        this.isAnimating = false
      }, 400)
    } else {
      // Desktop: Reset to grid layout
      this.carousel.style.transform = ""
    }
  }

  // Auto-play functionality (optional)
  startAutoPlay(interval = 5000) {
    if (!this.isMobile) return

    this.autoPlayInterval = setInterval(() => {
      this.nextSlide()
    }, interval)
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
    }
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const stillsCarousel = new StillsCarousel()

  // Optional: Start auto-play on mobile
  // stillsCarousel.startAutoPlay(4000);

  // Pause auto-play when user interacts
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stillsCarousel.stopAutoPlay()
    }
  })
})
