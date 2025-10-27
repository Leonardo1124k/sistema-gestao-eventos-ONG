// ========================
// CONFIGURAÇÕES GERAIS
// ========================
const CAROUSEL_AUTO_ROTATE_TIME = 5000;
const REALIZACOES_AUTO_ROTATE_TIME = 8000;
const HISTORIA_AUTO_ROTATE_TIME = 8000;
const PARTNERS_GAP = 30; // gap entre logos

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
// CORREÇÃO ALTURA DINÂMICA DOS CARROSSÉIS
// ========================

/* Helper: calcula a maior altura entre os slides e define min-height no wrapper */
function stabilizeCarouselHeight(wrapperSelector, slideSelector) {
    const wrapper = document.querySelector(wrapperSelector);
    if (!wrapper) return;
    const slides = wrapper.querySelectorAll(slideSelector);
    if (!slides.length) return;

    const width = Math.max(wrapper.clientWidth, 320);
    let maxHeight = 0;

    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.width = width + 'px';
        clone.style.height = 'auto';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        document.body.appendChild(clone);
        const h = clone.getBoundingClientRect().height;
        if (h > maxHeight) maxHeight = h;
        document.body.removeChild(clone);
    });

    if (maxHeight > 0) {
        wrapper.style.minHeight = Math.ceil(maxHeight) + 'px';
    }
}

// ========================
// FIX MOBILE LAYOUT
// ========================
function fixMobileLayout() {
    if (window.innerWidth <= 768) {
        const containers = document.querySelectorAll('.container, .hero-content, .about-content, .realizacao-conteudo, .event-content');
        containers.forEach(container => {
            container.style.margin = '0 auto';
            container.style.padding = '0 15px';
            container.style.width = '100%';
            container.style.maxWidth = '100%';
        });

        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, li');
        textElements.forEach(el => {
            el.style.wordWrap = 'break-word';
            el.style.overflowWrap = 'break-word';
        });

        /* IMPORTANT: não selecionar os botões dos carrosséis aqui (evita esticá-los).
           Excluímos os controles do carrossel usando :not(...) */
        const buttons = document.querySelectorAll(
            'button:not(.carousel-prev):not(.carousel-next):not(.realizacoes-prev):not(.realizacoes-next):not(.event-prev):not(.event-next):not(.historia-prev):not(.historia-next):not(.partners-prev):not(.partners-next), .btn, .cta-btn, .primary-btn'
        );

        buttons.forEach(button => {
            // estilos úteis para botões de ação (CTAs), sem forçar largura fixa
            button.style.minHeight = '44px';
            button.style.minWidth = '44px';
            button.style.display = 'inline-flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.style.whiteSpace = 'nowrap';
            button.style.overflow = 'hidden';
            button.style.textOverflow = 'ellipsis';
            button.style.maxWidth = '280px';
            button.style.width = 'auto';
            button.style.margin = '6px auto';
            button.style.borderRadius = '28px'; // define pill para CTAs
            // remover possíveis larguras conflitantes
            button.style.removeProperty('width');
        });
    } else {
        // limpa estilos inline quando sair do mobile (opcional)
        const buttonsAll = document.querySelectorAll('button, .btn, .cta-btn, .primary-btn');
        buttonsAll.forEach(b => {
            b.style.minWidth = '';
            b.style.minHeight = '';
            b.style.maxWidth = '';
            b.style.width = '';
            b.style.margin = '';
            b.style.borderRadius = '';
        });
    }
}

// ========================
// CORREÇÃO BOTÕES MOBILE
// ========================
function fixEventButtonsMobile() {
    const eventButtons = document.querySelectorAll('.event-section .primary-btn, .event-section .btn-yellow');
    eventButtons.forEach(button => {
        button.style.minHeight = '44px';
        button.style.minWidth = '44px';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.textAlign = 'center';
        button.style.whiteSpace = 'nowrap';
        button.style.overflow = 'hidden';
        button.style.textOverflow = 'ellipsis';
    });

    const eventPrevBtn = document.querySelector('.event-prev');
    const eventNextBtn = document.querySelector('.event-next');

    if (eventPrevBtn) {
        eventPrevBtn.style.zIndex = '1000';
        eventPrevBtn.style.position = 'absolute';
    }
    if (eventNextBtn) {
        eventNextBtn.style.zIndex = '1000';
        eventNextBtn.style.position = 'absolute';
    }

    const ctaContainers = document.querySelectorAll('.cta-buttons-2');
    ctaContainers.forEach(container => {
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.width = '100%';
        container.style.flexWrap = 'wrap';
        container.style.gap = '10px';
    });
}

// ========================
// HEADER SCROLL
// ========================
function initHeaderScroll() {
    const header = document.querySelector("header");
    if (!header) return;

    let lastScrollTop = 0;
    const headerHeight = header.offsetHeight;
    let ticking = false;

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

                if (Math.abs(currentScroll - lastScrollTop) >= 5) {
                    if (currentScroll > lastScrollTop && currentScroll > headerHeight) {
                        header.style.transform = `translateY(-${headerHeight}px)`;
                    } else {
                        header.style.transform = `translateY(0)`;
                    }
                    header.style.transition = "transform 0.3s ease-out";
                    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ========================
// CARROSSEIS GENÉRICOS
// ========================
function initCarousel(carouselSelector, slideSelector, prevBtnSelector, nextBtnSelector, dotSelector, autoTime) {
    const carousel = document.querySelector(carouselSelector);
    if (!carousel) return;

    const slides = document.querySelectorAll(slideSelector);
    const prevBtn = document.querySelector(prevBtnSelector);
    const nextBtn = document.querySelector(nextBtnSelector);
    const dots = document.querySelectorAll(dotSelector);

    if (slides.length === 0) return;

    let currentIndex = 0;
    let interval;

    function updateSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');
            slide.style.display = ''; // não força display, deixa CSS controlar (usa posicionamento absoluto)
        });
        dots.forEach(dot => dot.classList.remove('active'));

        currentIndex = (index + slides.length) % slides.length;
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        const nextIndex = (currentIndex + 1) % slides.length;

        slides[prevIndex]?.classList.add('prev');
        slides[currentIndex]?.classList.add('active');
        slides[nextIndex]?.classList.add('next');

        if (dots[currentIndex]) dots[currentIndex].classList.add('active');

        // garante altura estável após trocar slide
        stabilizeCarouselHeight(carouselSelector, slideSelector);
    }

    function nextSlide() { updateSlide(currentIndex + 1); }
    function prevSlide() { updateSlide(currentIndex - 1); }

    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.currentTarget.blur(); clearInterval(interval); nextSlide(); startAutoRotate(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.currentTarget.blur(); clearInterval(interval); prevSlide(); startAutoRotate(); });
    dots.forEach((dot, i) => dot.addEventListener('click', (e) => { e.preventDefault(); dot.blur(); clearInterval(interval); updateSlide(i); startAutoRotate(); }));

    function startAutoRotate() {
        clearInterval(interval);
        interval = setInterval(nextSlide, autoTime);
    }

    // estabiliza ao iniciar e no resize
    updateSlide(0);
    stabilizeCarouselHeight(carouselSelector, slideSelector);
    startAutoRotate();

    window.addEventListener('resize', debounce(() => stabilizeCarouselHeight(carouselSelector, slideSelector), 150));
}

// ========================
// CARROSSEL REALIZAÇÕES
// ========================
function initRealizacoesCarousel() {
    const carouselSelector = '.realizacoes-carousel';
    const itemSelector = '.realizacao-item';
    const wrapper = document.querySelector(carouselSelector);
    if (!wrapper) return;

    const items = wrapper.querySelectorAll(itemSelector);
    const prevBtn = document.querySelector('.realizacoes-prev');
    const nextBtn = document.querySelector('.realizacoes-next');
    if (items.length === 0) return;

    let currentIndex = 0;
    let interval;

    function showItem(index) {
        items.forEach(item => item.classList.remove('active'));
        currentIndex = (index + items.length) % items.length;
        items[currentIndex].classList.add('active');

        // estabiliza altura ao mostrar item
        stabilizeCarouselHeight(carouselSelector, itemSelector);
    }

    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.currentTarget.blur(); clearInterval(interval); showItem(currentIndex + 1); startAutoRotate(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.currentTarget.blur(); clearInterval(interval); showItem(currentIndex - 1); startAutoRotate(); });

    function startAutoRotate() {
        clearInterval(interval);
        interval = setInterval(() => showItem(currentIndex + 1), REALIZACOES_AUTO_ROTATE_TIME);
    }

    showItem(0);
    stabilizeCarouselHeight(carouselSelector, itemSelector);
    startAutoRotate();

    window.addEventListener('resize', debounce(() => stabilizeCarouselHeight(carouselSelector, itemSelector), 150));
}

// ========================
// CARROSSEL HISTÓRIA
// ========================
function initHistoriaCarousel() {
    const carouselSelector = '.historia-carousel';
    const itemSelector = '.carousel-item';
    const wrapper = document.querySelector(carouselSelector);
    if (!wrapper) return;

    const items = wrapper.querySelectorAll(itemSelector);
    const prevBtn = document.querySelector('.historia-prev');
    const nextBtn = document.querySelector('.historia-next');
    const dots = document.querySelectorAll('.historia-dots .dot');
    if (items.length === 0) return;

    let currentIndex = 0;
    let interval;

    function updateSlide(index) {
        items.forEach((item, i) => {
            item.classList.remove('active');
            item.style.display = '';
        });
        dots.forEach(dot => dot.classList.remove('active'));

        currentIndex = (index + items.length) % items.length;
        items[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');

        // estabiliza altura ao mostrar item
        stabilizeCarouselHeight(carouselSelector, itemSelector);
    }

    function nextSlide() { updateSlide(currentIndex + 1); }
    function prevSlide() { updateSlide(currentIndex - 1); }

    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.currentTarget.blur(); clearInterval(interval); nextSlide(); startAutoRotate(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.currentTarget.blur(); clearInterval(interval); prevSlide(); startAutoRotate(); });
    dots.forEach((dot, i) => dot.addEventListener('click', (e) => { e.preventDefault(); dot.blur(); clearInterval(interval); updateSlide(i); startAutoRotate(); }));

    function startAutoRotate() {
        clearInterval(interval);
        interval = setInterval(nextSlide, HISTORIA_AUTO_ROTATE_TIME);
    }

    updateSlide(0);
    stabilizeCarouselHeight(carouselSelector, itemSelector);
    startAutoRotate();

    window.addEventListener('resize', debounce(() => stabilizeCarouselHeight(carouselSelector, itemSelector), 150));
}

// ========================
// CARROSSEL PARCEIROS
// ========================
function initPartnersCarousel() {
    const carousel = document.querySelector('.partners-carousel');
    if (!carousel) return;

    const grid = document.querySelector('.partners-grid');
    const items = document.querySelectorAll('.partner-logo-box');
    const prevBtn = document.querySelector('.partners-prev');
    const nextBtn = document.querySelector('.partners-next');
    if (!grid || items.length < 3) return;

    let itemWidth = items[0].offsetWidth + PARTNERS_GAP;
    let currentIndex = 0;
    const visibleItems = Math.floor(carousel.offsetWidth / itemWidth);
    let interval;

    // Clone itens iniciais para efeito infinito
    items.forEach((item, index) => {
        if (index < visibleItems) {
            grid.appendChild(item.cloneNode(true));
        }
    });

    function updateCarousel() {
        grid.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        grid.style.transition = 'transform 0.5s ease';

        if (currentIndex >= items.length) {
            setTimeout(() => { grid.style.transition = 'none'; currentIndex = 0; grid.style.transform = `translateX(0)`; }, 500);
        }
        if (currentIndex < 0) {
            setTimeout(() => { grid.style.transition = 'none'; currentIndex = items.length - 1; grid.style.transform = `translateX(-${currentIndex * itemWidth}px)`; }, 500);
        }
    }

    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.currentTarget.blur(); currentIndex++; updateCarousel(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.currentTarget.blur(); currentIndex--; updateCarousel(); });

    function startAutoRotate() {
        clearInterval(interval);
        interval = setInterval(() => { currentIndex++; updateCarousel(); }, CAROUSEL_AUTO_ROTATE_TIME);
    }

    updateCarousel();
    startAutoRotate();

    window.addEventListener('resize', debounce(() => {
        const newItemWidth = items[0].offsetWidth + PARTNERS_GAP;
        currentIndex = Math.round(currentIndex * itemWidth / newItemWidth);
        itemWidth = newItemWidth;
        updateCarousel();
    }));
}

// ========================
// MENU MOBILE & SMOOTH SCROLL
// ========================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (!menuToggle) return;
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');

        let overlay = document.querySelector('.nav-overlay');
        if (navLinks.classList.contains('active')) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'nav-overlay';
                document.body.appendChild(overlay);
                setTimeout(() => overlay.classList.add('active'), 10);
            }
            overlay.onclick = closeMenu;
            document.body.style.overflow = 'hidden';
        } else {
            closeMenu();
        }
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', toggleMenu);
    navItems.forEach(item => item.addEventListener('click', e => {
        closeMenu();
        if (item.getAttribute('href').startsWith('#')) {
            const target = document.querySelector(item.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - document.querySelector('header').offsetHeight - 20;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        }
    }));

    window.addEventListener('resize', debounce(() => { if (window.innerWidth > 768) closeMenu(); }));
}

// ========================
// INICIALIZAÇÃO DE TUDO
// ========================
document.addEventListener('DOMContentLoaded', () => {
    fixEventButtonsMobile();
    fixMobileLayout();
    initHeaderScroll();
    initCarousel('.carousel-container', '.carousel-slide', '.carousel-prev', '.carousel-next', '.dot', CAROUSEL_AUTO_ROTATE_TIME);
    initCarousel('.event-carousel', '.event-item', '.event-prev', '.event-next', '.event-dots .dot', REALIZACOES_AUTO_ROTATE_TIME);
    initHistoriaCarousel();
    initRealizacoesCarousel();
    initPartnersCarousel();
    initMobileMenu();
});

window.addEventListener('resize', debounce(fixMobileLayout));
window.addEventListener('orientationchange', debounce(fixMobileLayout));