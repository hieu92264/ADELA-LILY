const partials = {
  header: new URL("../parts/header.html", import.meta.url),
  hero: new URL("../parts/hero.html", import.meta.url),
  stats: new URL("../parts/stats.html", import.meta.url),
  about: new URL("../parts/about.html", import.meta.url),
  difference: new URL("../parts/difference.html", import.meta.url),
  process: new URL("../parts/process.html", import.meta.url),
  tutors: new URL("../parts/tutors.html", import.meta.url),
  commitments: new URL("../parts/commitments.html", import.meta.url),
  parent: new URL("../parts/parent.html", import.meta.url),
  program: new URL("../parts/program.html", import.meta.url),
  studentResult: new URL("../parts/student-result.html", import.meta.url),
  signup: new URL("../parts/signup.html", import.meta.url),
  footer: new URL("../parts/footer.html", import.meta.url),
  floatingContact: new URL("../parts/floating-contact.html", import.meta.url),
};

async function injectPartials() {
  const targets = document.querySelectorAll("[data-include]");

  await Promise.all(
    [...targets].map(async (target) => {
      const key = target.dataset.include;
      const url = partials[key];

      if (!url) return;

      const response = await fetch(url);
      target.innerHTML = await response.text();
    })
  );

  bindNavigation();
  bindHeroSlider();
  bindHeroModal();
  bindCountdowns();
  bindTypewriters();
  bindStatsReveal();
  bindTutorsSlider();
  bindStudentResultSlider();
  bindCommitmentsReveal();
}

function bindNavigation() {
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (!menuButton || !mobileMenu) return;

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("hidden", isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      mobileMenu.classList.add("hidden");
    });
  });
}

function bindHeroSlider() {
  const slider = document.querySelector("[data-hero-slider]");
  const slides = document.querySelectorAll(
    "[data-hero-slider] [data-hero-image]"
  );

  if (!slider || !slides.length) return;

  let currentIndex = 0;

  window.setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  }, 2500);
}

function bindHeroModal() {
  const modal = document.querySelector("[data-hero-modal]");
  const modalImage = document.querySelector("[data-hero-modal-image]");
  const closeButton = document.querySelector("[data-hero-close]");
  const slides = document.querySelectorAll("[data-hero-image]");

  if (!modal || !modalImage || !closeButton || !slides.length) return;

  slides.forEach((slide) => {
    slide.addEventListener("click", () => {
      const image = slide.dataset.heroImage;

      modalImage.src = image;
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.style.overflow = "hidden";
    });
  });

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    modalImage.src = "";
    document.body.style.overflow = "";
  }

  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}

function bindCountdowns() {
  const countdowns = document.querySelectorAll("[data-countdown]");

  countdowns.forEach((countdown) => {
    const duration = Number(countdown.dataset.countdownDuration || 0);
    const daysEl = countdown.querySelector("[data-countdown-days]");
    const hoursEl = countdown.querySelector("[data-countdown-hours]");
    const minutesEl = countdown.querySelector("[data-countdown-minutes]");
    const secondsEl = countdown.querySelector("[data-countdown-seconds]");

    if (!duration || !daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    let endTime = Date.now() + duration * 1000;

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function render() {
      let remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

      if (remaining === 0) {
        endTime = Date.now() + duration * 1000;
        remaining = duration;
      }

      const days = Math.floor(remaining / 86400);
      const hours = Math.floor((remaining % 86400) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
    }

    render();
    window.setInterval(render, 1000);
  });
}

function bindTypewriters() {
  const targets = document.querySelectorAll("[data-typewriter]");

  targets.forEach((target) => {
    const text = target.dataset.typewriterText || "";
    let index = 0;
    let deleting = false;

    function tick() {
      target.textContent = text.slice(0, index);

      if (!deleting && index < text.length) {
        index += 1;
        window.setTimeout(tick, 90);
        return;
      }

      if (!deleting && index === text.length) {
        deleting = true;
        window.setTimeout(tick, 1200);
        return;
      }

      if (deleting && index > 0) {
        index -= 1;
        window.setTimeout(tick, 45);
        return;
      }

      deleting = false;
      window.setTimeout(tick, 500);
    }

    tick();
  });
}

function bindStatsReveal() {
  const lists = document.querySelectorAll("[data-stats-list]");

  lists.forEach((list) => {
    const cards = [...list.querySelectorAll("[data-stats-card]")];

    if (!cards.length) return;

    function revealCards() {
      cards.forEach((card, index) => {
        window.setTimeout(() => {
          card.classList.add("is-visible");
        }, index * 180);
      });
    }

    if (!("IntersectionObserver" in window)) {
      revealCards();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          revealCards();
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
      }
    );

    observer.observe(list);
  });
}

function bindTutorsSlider() {
  const sliders = document.querySelectorAll("[data-tutors-slider]");

  sliders.forEach((slider) => {
    const track = slider.querySelector("[data-tutors-track]");
    const prevButton = slider.querySelector("[data-tutors-prev]");
    const nextButton = slider.querySelector("[data-tutors-next]");
    const cards = [...slider.querySelectorAll("[data-tutor-card]")];

    if (!track || !cards.length) return;

    let index = 0;
    let autoTimer;

    function visibleCount() {
      return window.matchMedia("(min-width: 1024px)").matches ? 3 : 1;
    }

    function update() {
      const maxIndex = Math.max(0, cards.length - visibleCount());
      index = Math.min(index, maxIndex);
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = Number.parseFloat(getComputedStyle(track).columnGap || 0);

      track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
    }

    function goNext() {
      const maxIndex = Math.max(0, cards.length - visibleCount());
      index = index >= maxIndex ? 0 : index + 1;
      update();
    }

    function goPrev() {
      const maxIndex = Math.max(0, cards.length - visibleCount());
      index = index <= 0 ? maxIndex : index - 1;
      update();
    }

    function startAuto() {
      stopAuto();
      autoTimer = window.setInterval(goNext, 1500);
    }

    function stopAuto() {
      if (autoTimer) {
        window.clearInterval(autoTimer);
      }
    }

    prevButton?.addEventListener("click", () => {
      goPrev();
      startAuto();
    });

    nextButton?.addEventListener("click", () => {
      goNext();
      startAuto();
    });

    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);
    window.addEventListener("resize", update);
    update();
    startAuto();
  });
}

function bindStudentResultSlider() {
  const sliders = document.querySelectorAll("[data-student-result-slider]");

  sliders.forEach((slider) => {
    const track = slider.querySelector("[data-student-result-track]");
    const prevButton = slider.querySelector("[data-student-result-prev]");
    const nextButton = slider.querySelector("[data-student-result-next]");
    const cards = [...slider.querySelectorAll(".student-result-video")];

    if (!track || !cards.length) return;

    let index = 0;
    let autoTimer;

    function visibleCount() {
      return window.matchMedia("(min-width: 768px)").matches ? 2 : 1;
    }

    function maxIndex() {
      return Math.max(0, cards.length - visibleCount());
    }

    function update() {
      index = Math.min(index, maxIndex());
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = Number.parseFloat(getComputedStyle(track).columnGap || 0);

      track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
    }

    function goNext() {
      index = index >= maxIndex() ? 0 : index + 1;
      update();
    }

    function goPrev() {
      index = index <= 0 ? maxIndex() : index - 1;
      update();
    }

    function startAuto() {
      stopAuto();
      autoTimer = window.setInterval(goNext, 2800);
    }

    function stopAuto() {
      if (autoTimer) {
        window.clearInterval(autoTimer);
      }
    }

    prevButton?.addEventListener("click", () => {
      goPrev();
      startAuto();
    });

    nextButton?.addEventListener("click", () => {
      goNext();
      startAuto();
    });

    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);
    window.addEventListener("resize", update);
    update();
    startAuto();
  });
}

function bindCommitmentsReveal() {
  const grid = document.querySelector("[data-commitments-grid]");

  if (!grid) return;

  const cards = [...grid.querySelectorAll("[data-commit-reveal]")];

  if (!cards.length) return;

  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        cards.forEach((card, index) => {
          window.setTimeout(() => {
            card.classList.add("is-visible");
          }, index * 150);
        });

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
    }
  );

  observer.observe(grid);
}

injectPartials();
