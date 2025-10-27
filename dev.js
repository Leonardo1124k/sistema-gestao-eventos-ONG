// Header aparecer/desaparecer ao rolar
document.addEventListener("DOMContentLoaded", function () {
  let lastScrollTop = 0;
  const header = document.querySelector("header");
  
  if (header) {
    const headerHeight = header.offsetHeight;
    let ticking = false;

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

          if (Math.abs(currentScroll - lastScrollTop) < 5) {
            ticking = false;
            return;
          }

          if (currentScroll > lastScrollTop && currentScroll > headerHeight) {
            header.style.transform = `translateY(-${headerHeight}px)`;
            header.style.transition = "transform 0.3s ease-out";
          } else {
            header.style.transform = "translateY(0)";
            header.style.transition = "transform 0.3s ease-out";
          }

          lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
});

// Carrossel Missão/Visão/Valores
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel-container');
  if (!carousel) return;

  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dots = document.querySelectorAll('.dot');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let interval;

  function updateSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev', 'next');
      if (i === index) slide.classList.add('active');
      else if (i < index) slide.classList.add('prev');
      else slide.classList.add('next');
    });

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');

    currentIndex = index;
  }

  function nextSlide() {
    updateSlide((currentIndex + 1) % slides.length);
  }

  function prevSlide() {
    updateSlide((currentIndex - 1 + slides.length) % slides.length);
  }

  function startAutoRotate() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    startAutoRotate();
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    startAutoRotate();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateSlide(index);
      startAutoRotate();
    });
  });

  carousel.addEventListener('mouseenter', () => clearInterval(interval));
  carousel.addEventListener('mouseleave', startAutoRotate);

  updateSlide(0);
  startAutoRotate();
});

// Seção Realizações
document.addEventListener('DOMContentLoaded', function () {
  const realizacoesCarousel = document.querySelector('.realizacoes-carousel');
  if (!realizacoesCarousel) return;

  const items = document.querySelectorAll('.realizacao-item');
  const dots = document.querySelectorAll('.realizacoes-dot');
  const prevBtn = document.querySelector('.realizacoes-prev');
  const nextBtn = document.querySelector('.realizacoes-next');

  if (items.length === 0) return;

  let currentIndex = 0;
  let interval;

  function showItem(index) {
    items.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentIndex = (index + items.length) % items.length;

    items[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    clearInterval(interval);
    showItem(currentIndex + 1);
    startAutoRotate();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    clearInterval(interval);
    showItem(currentIndex - 1);
    startAutoRotate();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      showItem(index);
      startAutoRotate();
    });
  });

  function startAutoRotate() {
    clearInterval(interval);
    interval = setInterval(() => showItem(currentIndex + 1), 8000);
  }

  realizacoesCarousel.addEventListener('mouseenter', () => clearInterval(interval));
  realizacoesCarousel.addEventListener('mouseleave', startAutoRotate);

  showItem(0);
  startAutoRotate();
});

// Carrossel de Parceiros
function initPartnersCarousel() {
  const carousel = document.querySelector('.partners-carousel');
  if (!carousel) return;

  const grid = document.querySelector('.partners-grid');
  const items = document.querySelectorAll('.partner-logo-box');
  const prevBtn = document.querySelector('.partners-prev');
  const nextBtn = document.querySelector('.partners-next');

  if (!grid || items.length < 3) return;

  let itemWidth = items[0].offsetWidth + 30;
  let currentIndex = 0;
  const visibleItems = Math.floor(carousel.offsetWidth / itemWidth);
  let interval;

  items.forEach((item, index) => {
    if (index < visibleItems) {
      const clone = item.cloneNode(true);
      grid.appendChild(clone);
    }
  });

  function updateCarousel() {
    grid.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    grid.style.transition = 'transform 0.5s ease';

    if (currentIndex >= items.length) {
      setTimeout(() => {
        grid.style.transition = 'none';
        currentIndex = 0;
        grid.style.transform = `translateX(0)`;
      }, 500);
    }

    if (currentIndex < 0) {
      setTimeout(() => {
        grid.style.transition = 'none';
        currentIndex = items.length - 1;
        grid.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
      }, 500);
    }
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    currentIndex++;
    updateCarousel();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    currentIndex--;
    updateCarousel();
  });

  function startAutoRotate() {
    clearInterval(interval);
    interval = setInterval(() => {
      currentIndex++;
      updateCarousel();
    }, 5000);
  }

  updateCarousel();
  startAutoRotate();

  window.addEventListener('resize', () => {
    const newItemWidth = items[0].offsetWidth + 30;
    currentIndex = Math.round(currentIndex * itemWidth / newItemWidth);
    itemWidth = newItemWidth;
    updateCarousel();
  });
}

// Carrossel de Eventos
document.addEventListener('DOMContentLoaded', function () {
  const eventCarousel = document.querySelector('.event-carousel');
  if (!eventCarousel) return;

  const items = document.querySelectorAll('.event-item');
  const dots = document.querySelectorAll('.event-dots .dot');
  const prevBtn = document.querySelector('.event-prev');
  const nextBtn = document.querySelector('.event-next');

  if (items.length === 0) return;

  let currentIndex = 0;
  let interval;

  function showItem(index) {
    items.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentIndex = (index + items.length) % items.length;

    items[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    clearInterval(interval);
    showItem(currentIndex + 1);
    startAutoRotate();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    clearInterval(interval);
    showItem(currentIndex - 1);
    startAutoRotate();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      showItem(index);
      startAutoRotate();
    });
  });

  function startAutoRotate() {
    clearInterval(interval);
    interval = setInterval(() => showItem(currentIndex + 1), 8000);
  }

  eventCarousel.addEventListener('mouseenter', () => clearInterval(interval));
  eventCarousel.addEventListener('mouseleave', startAutoRotate);

  showItem(0);
  startAutoRotate();
});

// Carrossel Nossa História
document.addEventListener('DOMContentLoaded', function () {
  const historiaCarousel = document.querySelector('.historia-carousel');
  if (!historiaCarousel) return;

  const items = document.querySelectorAll('.historia-carousel .carousel-item');
  const dots = document.querySelectorAll('.historia-dots .dot');
  const prevBtn = document.querySelector('.historia-prev');
  const nextBtn = document.querySelector('.historia-next');

  if (items.length === 0) return;

  let currentIndex = 0;
  let interval;

  function showItem(index) {
    items.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentIndex = (index + items.length) % items.length;

    items[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    clearInterval(interval);
    showItem(currentIndex + 1);
    startAutoRotate();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    clearInterval(interval);
    showItem(currentIndex - 1);
    startAutoRotate();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      showItem(index);
      startAutoRotate();
    });
  });

  function startAutoRotate() {
    clearInterval(interval);
    interval = setInterval(() => showItem(currentIndex + 1), 8000);
  }

  historiaCarousel.addEventListener('mouseenter', () => clearInterval(interval));
  historiaCarousel.addEventListener('mouseleave', startAutoRotate);

  showItem(0);
  startAutoRotate();
});

// Menu Mobile
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.createElement('div');
  menuToggle.className = 'menu-toggle';
  menuToggle.innerHTML = '<span></span><span></span><span></span>';

  const header = document.querySelector('header .container');
  if (!header) return;

  header.appendChild(menuToggle);

  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  menuToggle.addEventListener('click', function () {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');

      if (this.getAttribute('href').startsWith('#')) {
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });

          setTimeout(() => {
            targetElement.focus();
          }, 1000);
        }
      }
    });
  });
});

// Inicializa carrossel de parceiros
document.addEventListener('DOMContentLoaded', initPartnersCarousel);