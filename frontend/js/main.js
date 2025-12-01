// ========================
// CONFIGURAÇÕES GERAIS - CORRIGIDAS
// ========================
const CAROUSEL_AUTO_ROTATE_TIME = 5000;
const REALIZACOES_AUTO_ROTATE_TIME = 8000;
const HISTORIA_AUTO_ROTATE_TIME = 8000;
const EVENT_AUTO_ROTATE_TIME = 0; // CONSTANTE CORRETA ADICIONADA
const PARTNERS_GAP = 30;
// ========================
// FUNÇÃO UTILITÁRIA PARA PREVENIR JUMP NO MOBILE - VERSÃO REFORÇADA
// ========================
function attachControlHandler(element, handler) {
  if (!element) return;

  // Apenas variáveis básicas
  let isPointerDown = false;

  // Captura eventos de toque/clique
  element.addEventListener(
    "pointerdown",
    () => {
      isPointerDown = true;
    },
    { passive: true }
  );
  element.addEventListener(
    "touchstart",
    () => {
      isPointerDown = true;
    },
    { passive: true }
  );

  // Clique — executa o handler, mas não faz scrollTo
  element.addEventListener("click", (e) => {
    // Só bloqueia o comportamento padrão se o elemento NÃO for um link real
    const isAnchor = element.tagName === "A" && element.getAttribute("href");
    const isFormButton = element.tagName === "BUTTON" && element.type === "submit";

    if (!isAnchor && !isFormButton) {
      e.preventDefault(); // impede apenas botões JS
    }

    try {
      (e.currentTarget || element).blur();
    } catch (err) {}
    try {
      handler && handler(e);
    } catch (err) {
      console.error(err);
    }
    isPointerDown = false;
  });

  // Suporte a teclado (Enter e Espaço)
  element.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      try {
        handler && handler(e);
      } catch (err) {
        console.error(err);
      }
    }
  });
}

// ========================
// FUNÇÃO DE DEBOUNCE
// ========================
function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ========================
// REMOVIDA: stabilizeCarouselHeight (função não utilizada)
// ========================

// ========================
// FIX MOBILE LAYOUT - CORRIGIDO
// ========================
function fixMobileLayout() {
  if (window.innerWidth <= 768) {
    const containers = document.querySelectorAll(
      ".container, .hero-content, .about-content, .realizacao-conteudo, .event-content"
    );
    containers.forEach((container) => {
      container.style.margin = "0 auto";
      container.style.padding = "0 15px";
      container.style.width = "100%";
      container.style.maxWidth = "100%";
    });

    const textElements = document.querySelectorAll(
      "p, h1, h2, h3, h4, h5, h6, span, li"
    );
    textElements.forEach((el) => {
      el.style.wordWrap = "break-word";
      el.style.overflowWrap = "break-word";
    });

    const buttons = document.querySelectorAll(
      ".cta-btn, .primary-btn, .donate-btn, .btn-yellow-2, .btn-yellow, .btn"
    );

    buttons.forEach((button) => {
      button.style.minHeight = "44px";
      button.style.minWidth = "44px";
      button.style.display = "inline-flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      button.style.whiteSpace = "nowrap";
      button.style.overflow = "hidden";
      button.style.textOverflow = "ellipsis";
      button.style.maxWidth = "280px";
      button.style.width = "auto";
      button.style.margin = "6px auto";
      button.style.borderRadius = "28px";
      button.style.removeProperty("width");
    });
  } else {
    const buttonsAll = document.querySelectorAll(
      ".cta-btn, .primary-btn, .donate-btn, .btn-yellow-2, .btn-yellow, .btn"
    );
    buttonsAll.forEach((b) => {
      b.style.minWidth = "";
      b.style.minHeight = "";
      b.style.maxWidth = "";
      b.style.width = "";
      b.style.margin = "";
      b.style.borderRadius = "";
    });
  }
}

// ========================
// CORREÇÃO BOTÕES MOBILE - ATUALIZADA COM attachControlHandler
// ========================
function fixEventButtonsMobile() {
  const eventButtons = document.querySelectorAll(
    ".event-section .primary-btn, .event-section .btn-yellow"
  );
  eventButtons.forEach((button) => {
    button.style.minHeight = "44px";
    button.style.minWidth = "44px";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.textAlign = "center";
    button.style.whiteSpace = "nowrap";
    button.style.overflow = "hidden";
    button.style.textOverflow = "ellipsis";
  });

  const eventPrevBtn = document.querySelector(".event-prev");
  const eventNextBtn = document.querySelector(".event-next");

  if (eventPrevBtn) {
    eventPrevBtn.style.zIndex = "1300";
  }
  if (eventNextBtn) {
    eventNextBtn.style.zIndex = "1300";
  }

  const ctaContainers = document.querySelectorAll(".cta-buttons-2");
  ctaContainers.forEach((container) => {
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.width = "100%";
    container.style.flexWrap = "wrap";
    container.style.gap = "10px";
  });
}

// ========================
// HEADER SCROLL
// ========================
/* function initHeaderScroll() {
  const header = document.querySelector("header");
  if (!header) return;

  let lastScrollTop = 0;
  const headerHeight = header.offsetHeight;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll =
          window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(currentScroll - lastScrollTop) >= 5) {
          if (currentScroll > lastScrollTop && currentScroll > headerHeight) {
            header.style.transform = `translateY(-${headerHeight}px)`;
          } else {
            header.style.transform = `translateY(0)`;
          }
          header.style.transition = "transform 0.3s ease-out";
          header.style.zIndex = "9999";
          header.style.willChange = "transform";
          lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
} */
function initHeaderScroll() {
  const header = document.querySelector("header");
  if (!header) return;

  header.style.position = "fixed";
  header.style.top = "0";
  header.style.left = "0";
  header.style.right = "0";
  header.style.zIndex = "9999";
  header.style.transition = "none";
}

// ========================
// CLASSE CARROSSEL UNIFICADA - CORRIGIDA
// ========================
class Carousel {
  constructor(config) {
    this.container = document.querySelector(config.containerSelector);
    if (!this.container) return;

    this.itemSelector = config.itemSelector;
    this.items = document.querySelectorAll(this.itemSelector);
    this.prevBtn = document.querySelector(config.prevBtnSelector);
    this.nextBtn = document.querySelector(config.nextBtnSelector);
    this.dots = document.querySelectorAll(config.dotsSelector);
    this.autoRotateTime = config.autoRotateTime || 0;

    this.currentIndex = 0;
    this.interval = null;
    this.isAnimating = false;

    this.init();
  }

  init() {
    if (this.prevBtn) {
      attachControlHandler(this.prevBtn, () => this.prev());
    }
    if (this.nextBtn) {
      attachControlHandler(this.nextBtn, () => this.next());
    }

    this.dots.forEach((dot, index) => {
      attachControlHandler(dot, () => this.goToSlide(index));
    });

    if (this.autoRotateTime > 0) {
      this.startAutoRotate();
      this.container.addEventListener("mouseenter", () =>
        this.stopAutoRotate()
      );
      this.container.addEventListener("mouseleave", () =>
        this.startAutoRotate()
      );
      this.container.addEventListener("touchstart", () =>
        this.stopAutoRotate()
      );
    }

    this.updateSlide(0);
  }

  updateSlide(index) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.items.forEach((item) => item.classList.remove("active"));
    this.dots.forEach((dot) => dot.classList.remove("active"));

    this.currentIndex = (index + this.items.length) % this.items.length;

    this.items[this.currentIndex].classList.add("active");
    if (this.dots[this.currentIndex]) {
      this.dots[this.currentIndex].classList.add("active");
    }

    setTimeout(() => {
      this.isAnimating = false;
    }, 300);
  }

  next() {
    this.updateSlide(this.currentIndex + 1);
  }

  prev() {
    this.updateSlide(this.currentIndex - 1);
  }

  goToSlide(index) {
    this.updateSlide(index);
  }

  startAutoRotate() {
    this.stopAutoRotate();
    if (this.autoRotateTime > 0) {
      this.interval = setInterval(() => this.next(), this.autoRotateTime);
    }
  }

  stopAutoRotate() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

// ========================
// CARROSSEIS INICIALIZADOS COM CLASSE UNIFICADA
// ========================
function initMissionCarousel() {
  new Carousel({
    containerSelector: ".carousel-container",
    itemSelector: ".carousel-slide",
    prevBtnSelector: ".carousel-prev",
    nextBtnSelector: ".carousel-next",
    dotsSelector: ".carousel-dots .dot",
    autoRotateTime: CAROUSEL_AUTO_ROTATE_TIME,
  });
}

function initHistoriaCarousel() {
  new Carousel({
    containerSelector: ".historia-carousel",
    itemSelector: ".historia-item",
    prevBtnSelector: ".historia-prev",
    nextBtnSelector: ".historia-next",
    dotsSelector: ".historia-dots .dot",
    autoRotateTime: HISTORIA_AUTO_ROTATE_TIME,
  });
}

function initRealizacoesCarousel() {
  new Carousel({
    containerSelector: ".realizacoes-carousel",
    itemSelector: ".realizacao-item",
    prevBtnSelector: ".realizacoes-prev",
    nextBtnSelector: ".realizacoes-next",
    dotsSelector: ".realizacoes-dots .dot",
    autoRotateTime: REALIZACOES_AUTO_ROTATE_TIME,
  });
}

function initPartnersCarousel() {
  new Carousel({
    containerSelector: ".partners-carousel",
    itemSelector: ".partner-logo-box",
    prevBtnSelector: ".partners-prev",
    nextBtnSelector: ".partners-next",
    dotsSelector: ".partners-dots .dot",
    autoRotateTime: 0, // Não rotaciona automaticamente
  });
}

function initEventCarousel() {
  new Carousel({
    containerSelector: ".event-carousel",
    itemSelector: ".event-item",
    prevBtnSelector: ".event-prev",
    nextBtnSelector: ".event-next",
    dotsSelector: ".event-dots .dot",
    autoRotateTime: EVENT_AUTO_ROTATE_TIME,
  });
}

// ========================
// MENU MOBILE
// ========================
function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  if (!menuToggle || !navLinks) return;

  function toggleMenu() {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");

    let overlay = document.querySelector(".nav-overlay");

    if (navLinks.classList.contains("active")) {
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "nav-overlay";
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add("active"), 10);
      }
      overlay.onclick = closeMenu;
      document.body.style.overflow = "hidden";
    } else {
      closeMenu();
    }
  }

  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.classList.remove("active");
    navLinks.classList.remove("active");
    const overlay = document.querySelector(".nav-overlay");
    if (overlay) {
      overlay.classList.remove("active");
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        document.body.style.overflow = "";
      }, 300);
    } else {
      document.body.style.overflow = "";
    }
  }

  // Usando attachControlHandler para prevenir jump
  attachControlHandler(menuToggle, toggleMenu);

  navItems.forEach((item) => {
    attachControlHandler(item, (e) => {
      closeMenu();
      if (item.getAttribute("href").startsWith("#")) {
        const target = document.querySelector(item.getAttribute("href"));
        if (target) {
          e.preventDefault();
          const offsetTop =
            target.offsetTop -
            document.querySelector("header").offsetHeight -
            20;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      }
    });
  });

  window.addEventListener(
    "resize",
    debounce(() => {
      if (window.innerWidth > 768) closeMenu();
    })
  );
}

// ========================
// ANIMAÇÃO AO SCROLL
// ========================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  const animatableElements = document.querySelectorAll(
    ".about-content, .about-carousel, .realizacao-item, .historia-texto, .historia-carousel-container, .event-item, .help-column"
  );

  animatableElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// ========================
// TRATAMENTO DE ERROS E FALLBACKS
// ========================
function initErrorHandling() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("error", function () {
      this.style.display = "none";
      console.log("Imagem não carregada:", this.src);
    });
  });

  if (!window.IntersectionObserver) {
    console.warn("IntersectionObserver não suportado neste navegador");
    const animatableElements = document.querySelectorAll(
      ".about-content, .about-carousel, .realizacao-item, .historia-texto, .historia-carousel-container, .event-item, .help-column"
    );
    animatableElements.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }
}

// ========================
// NAVEGAÇÃO POR TECLADO
// ========================
function initKeyboardNavigation() {
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      const activeCarousels = document.querySelectorAll(
        ".carousel-slide.active, .realizacao-item.active, .historia-item.active, .event-item.active"
      );
      if (activeCarousels.length > 0) {
        e.preventDefault();
        const prevButton = activeCarousels[0]
          .closest(
            ".carousel-container, .realizacoes-carousel, .historia-carousel, .event-carousel"
          )
          ?.querySelector(
            ".carousel-prev, .realizacoes-prev, .historia-prev, .event-prev"
          );
        if (prevButton) prevButton.click();
      }
    }

    if (e.key === "ArrowRight") {
      const activeCarousels = document.querySelectorAll(
        ".carousel-slide.active, .realizacao-item.active, .historia-item.active, .event-item.active"
      );
      if (activeCarousels.length > 0) {
        e.preventDefault();
        const nextButton = activeCarousels[0]
          .closest(
            ".carousel-container, .realizacoes-carousel, .historia-carousel, .event-carousel"
          )
          ?.querySelector(
            ".carousel-next, .realizacoes-next, .historia-next, .event-next"
          );
        if (nextButton) nextButton.click();
      }
    }

    if (e.key === "Escape") {
      const navLinks = document.querySelector(".nav-links");
      if (navLinks && navLinks.classList.contains("active")) {
        document.querySelector(".menu-toggle")?.click();
      }
    }
  });
}

// ========================
// CONTROLE DE PERFORMANCE
// ========================
function initPerformanceControls() {
  let isScrolling = false;
  window.addEventListener("scroll", function () {
    if (!isScrolling) {
      window.requestAnimationFrame(function () {
        isScrolling = false;
      });
      isScrolling = true;
    }
  });
}

// ================================================
// INTEGRAÇÃO COM API JAVA (RESERVAS E DOAÇÕES)
// ================================================

const API_BASE_URL = 'http://localhost:8080';

/**
 * Envia dados de reserva para o endpoint /reservas da API Java.
 * @param {object} dadosDaReserva - { idUsuario, idEvento, quantidade, observacoes }
 */
async function enviarReserva(dadosDaReserva) {
  try {
    const response = await fetch(`${API_BASE_URL}/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosDaReserva),
    });

    if (!response.ok) {
      const erroTexto = await response.text();
      throw new Error(`Erro da API: ${erroTexto}`);
    }

    const reservaCriada = await response.json();
    console.log('Reserva criada com sucesso!', reservaCriada);
    alert(`Reserva confirmada! Seu código é: ${reservaCriada.codigo_reserva}`);
    return reservaCriada;

  } catch (error) {
    console.error('Falha ao enviar reserva:', error);
    alert(`Ocorreu um erro ao reservar: ${error.message}`);
    return null;
  }
}

/**
 * Envia dados de doação para o endpoint /doacoes da API Java.
 * @param {object} dadosDaDoacao - { idUsuario, idEvento, tiposItens, quantidade, descricao }
 */
async function enviarDoacao(dadosDaDoacao) {
  try {
    const response = await fetch(`${API_BASE_URL}/doacoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosDaDoacao),
    });

    if (!response.ok) {
      const erroTexto = await response.text();
      throw new Error(`Erro da API: ${erroTexto}`);
    }

    const doacaoCriada = await response.json();
    console.log('Doação registrada com sucesso!', doacaoCriada);
    alert(`Doação registrada! Seu código é: ${doacaoCriada.codigo_doacao}`);
    return doacaoCriada;

  } catch (error) {
    console.error('Falha ao enviar doação:', error);
    alert(`Ocorreu um erro ao registrar a doação: ${error.message}`);
    return null;
  }
}

// ================================================
// INICIALIZAÇÃO E EVENT LISTENERS PARA FORMULÁRIOS
// ================================================

function initFormListeners() {
    // 1. Listener para o formulário de Reserva (Talharim)
    const formReserva = document.getElementById('form-reserva-talharim');
    if (formReserva) {
        formReserva.addEventListener('submit', async (event) => {
            event.preventDefault();

            // ATENÇÃO: Os IDs de Usuário e Evento devem ser obtidos de forma segura.
            // Por enquanto, usamos 1 como exemplo.
            const dadosParaAPI = {
                idUsuario: 1, 
                idEvento: 1,  // Assumindo que o ID 1 é o evento de Talharim
                quantidade: parseInt(document.getElementById('reserva-quantidade').value),
                observacoes: document.getElementById('reserva-observacoes').value,
            };

            const resultado = await enviarReserva(dadosParaAPI);
            if (resultado) {
                formReserva.reset(); // Limpa o formulário em caso de sucesso
            }
        });
    }

    // 2. Listener para o formulário de Doação (Bazar)
    const formDoacao = document.getElementById('form-doacao-bazar');
    if (formDoacao) {
        formDoacao.addEventListener('submit', async (event) => {
            event.preventDefault();

            // ATENÇÃO: Os IDs de Usuário e Evento devem ser obtidos de forma segura.
            // Por enquanto, usamos 1 como exemplo.
            const dadosParaAPI = {
                idUsuario: 1, 
                idEvento: 2,  // Assumindo que o ID 2 é o evento de Bazar
                // O campo tiposItens deve ser um JSON String, como esperado pela API
                tiposItens: JSON.stringify({
                    roupas: document.getElementById('doacao-roupas').checked,
                    moveis: document.getElementById('doacao-moveis').checked,
                    utensilios: document.getElementById('doacao-utensilios').checked,
                    outros: document.getElementById('doacao-outros').checked,
                }),
                quantidade: parseInt(document.getElementById('doacao-quantidade').value),
                descricao: document.getElementById('doacao-descricao').value,
            };

            const resultado = await enviarDoacao(dadosParaAPI);
            if (resultado) {
                formDoacao.reset(); 
            }
        });
    }
}

// ========================
// INICIALIZAÇÃO DE TUDO
// ========================
document.addEventListener("DOMContentLoaded", () => {
  fixEventButtonsMobile();
  fixMobileLayout();
  initHeaderScroll();
  initMissionCarousel();
  initEventCarousel(); // CONSTANTE CORRIGIDA
  initHistoriaCarousel();
  initRealizacoesCarousel();
  initPartnersCarousel();
  initMobileMenu();
  initScrollAnimations();
  initErrorHandling();
  initKeyboardNavigation();
  initPerformanceControls();
  initFormListeners();
});

// ========================
// EVENTOS DE REDIMENSIONAMENTO
// ========================
window.addEventListener("resize", debounce(fixMobileLayout));
window.addEventListener("orientationchange", debounce(fixMobileLayout));

// ========================
// LOADING INICIAL
// ========================
window.addEventListener("load", function () {
  document.body.classList.add("loaded");

  setTimeout(() => {
    const loader = document.querySelector(".loading-screen");
    if (loader) {
      loader.style.display = "none";
    }
  }, 500);
});
