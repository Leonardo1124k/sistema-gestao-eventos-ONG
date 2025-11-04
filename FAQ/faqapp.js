// Módulo principal
const FAQApp = (function() {
    // Configurações
    const config = {
        animationSpeed: 300,
        loadingDelay: 300
    };
/*.*/
    // Elementos DOM
    const elements = {
        faqQuestions: document.querySelectorAll('.faq-question'),
        categoryButtons: document.querySelectorAll('.category-btn'),
        faqItems: document.querySelectorAll('.faq-item'),
        navToggle: document.querySelector('.nav-toggle'),
        nav: document.querySelector('nav'),
        backToTop: document.querySelector('.back-to-top'),
        loading: document.querySelector('.loading')
    };
    
    // Estado da aplicação
    const state = {
        currentCategory: 'all',
        isNavOpen: false
    };
    
    // Inicialização
    function init() {
        bindEvents();
        setupIntersectionObserver();
    }
    
    // Vincular eventos
    function bindEvents() {
        // Accordion FAQ
        elements.faqQuestions.forEach(question => {
            question.addEventListener('click', toggleFAQ);
        });
        
        // Filtro por categoria
        elements.categoryButtons.forEach(button => {
            button.addEventListener('click', filterByCategory);
        });
        
        // Menu mobile
        elements.navToggle.addEventListener('click', toggleNav);
        
        // Botão voltar ao topo
        elements.backToTop.addEventListener('click', scrollToTop);
        
        // Fechar menu ao clicar em um link (mobile)
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', closeNav);
        });
    }
    
    // Toggle FAQ accordion
    function toggleFAQ(e) {
        const question = e.currentTarget;
        const item = question.parentElement;
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.icon');
        
        // Fecha todas as outras respostas abertas
        document.querySelectorAll('.faq-answer.open').forEach(openAnswer => {
            if (openAnswer !== answer) {
                openAnswer.classList.remove('open');
                openAnswer.parentElement.querySelector('.icon').classList.remove('open');
            }
        });
        
        // Alterna a resposta atual
        answer.classList.toggle('open');
        icon.classList.toggle('open');
    }
    
    // Filtrar por categoria
    function filterByCategory(e) {
        const button = e.currentTarget;
        const category = button.getAttribute('data-category');
        
        // Simular carregamento
        showLoading();
        
        // Atualiza estado
        state.currentCategory = category;
        
        // Atualiza botão ativo
        elements.categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Aplica filtro após um pequeno delay para melhor UX
        setTimeout(() => {
            filterItems(category);
            hideLoading();
        }, config.loadingDelay);
    }
    
    // Filtrar itens
    function filterItems(category) {
        elements.faqItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
                
                // Adiciona animação de entrada
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Mostrar loading
    function showLoading() {
        elements.loading.style.display = 'block';
    }
    
    // Esconder loading
    function hideLoading() {
        elements.loading.style.display = 'none';
    }
    
    // Toggle menu mobile
    function toggleNav() {
        state.isNavOpen = !state.isNavOpen;
        elements.nav.classList.toggle('active', state.isNavOpen);
        
        // Alterar ícone
        const icon = elements.navToggle.querySelector('i');
        icon.className = state.isNavOpen ? 'fas fa-times' : 'fas fa-bars';
    }
    
    // Fechar menu mobile
    function closeNav() {
        state.isNavOpen = false;
        elements.nav.classList.remove('active');
        
        // Restaurar ícone
        const icon = elements.navToggle.querySelector('i');
        icon.className = 'fas fa-bars';
    }
    
    // Scroll para o topo
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Configurar Intersection Observer para o botão voltar ao topo
    function setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    elements.backToTop.classList.remove('visible');
                } else {
                    elements.backToTop.classList.add('visible');
                }
            });
        });
        
        observer.observe(document.querySelector('header'));
    }
    
    // API pública
    return {
        init: init
    };
})();

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', FAQApp.init);