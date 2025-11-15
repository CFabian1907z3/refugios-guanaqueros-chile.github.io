/* 
╔═══════════════════════════════════════════════════════════╗
║  ANIMACIONES Y EFECTOS - Refugio de Guanaqueros          ║
║  ────────────────────────────────────────────────────────  ║
║  Este archivo controla:                                   ║
║  • Fade-in de elementos al hacer scroll                  ║
║  • Intersection Observer para animaciones                ║
║  • Efectos visuales y transiciones                       ║
║                                                            ║
║  ⚠️ NO modificar threshold sin probar en móvil            ║
╚═══════════════════════════════════════════════════════════╝
*/

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== CONFIGURACIÓN ==========
    const ANIMATION_CONFIG = {
        threshold: 0.1,           // 10% del elemento debe estar visible
        rootMargin: '0px 0px -50px 0px',  // Margen de activación
        reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
    
    // ========== FADE-IN OBSERVER ==========
    
    /**
     * Observer para elementos con clase .fade-in
     * Los anima cuando entran al viewport
     */
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Elemento visible, aplicar animación
                entry.target.classList.add('is-visible');
                
                // Dejar de observar (animar solo una vez)
                fadeInObserver.unobserve(entry.target);
                
                // Log para debugging (comentar en producción)
                // console.log('✨ Elemento animado:', entry.target);
            }
        });
    }, {
        threshold: ANIMATION_CONFIG.threshold,
        rootMargin: ANIMATION_CONFIG.rootMargin
    });
    
    // Observar todos los elementos con clase .fade-in
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(el => {
        // Si el usuario prefiere movimiento reducido, mostrar inmediatamente
        if (ANIMATION_CONFIG.reduceMotion) {
            el.classList.add('is-visible');
        } else {
            fadeInObserver.observe(el);
        }
    });
    
    // ========== ANIMACIONES ADICIONALES ==========
    
    /**
     * Efecto parallax suave en el hero
     */
    function initParallaxEffect() {
        const heroSection = document.getElementById('home');
        if (!heroSection) return;
        
        // Aplicar parallax solo en desktop
        if (window.innerWidth > 1024) {
            window.addEventListener('scroll', window.throttle ? window.throttle(function() {
                const scrolled = window.scrollY;
                const parallaxSpeed = 0.5;
                heroSection.style.backgroundPositionY = (scrolled * parallaxSpeed) + 'px';
            }, 16) : function() {});
        }
    }
    
    // Inicializar parallax (comentado por defecto para mejor performance)
    // initParallaxEffect();
    
    // ========== HOVER EFFECTS ==========
    
    /**
     * Añade efectos de hover mejorados a las cards de cabañas
     */
    function enhanceCabanaCardHovers() {
        const cabanaCards = document.querySelectorAll('.cabana-card');
        
        cabanaCards.forEach(card => {
            // Efecto de inclinación sutil al hacer hover
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mousemove', function(e) {
                if (window.innerWidth > 1024) { // Solo en desktop
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((y - centerY) / centerY) * -5;
                    const rotateY = ((x - centerX) / centerX) * 5;
                    
                    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
    
    // Inicializar efectos de hover
    enhanceCabanaCardHovers();
    
    // ========== ANIMACIÓN DEL BOTÓN SCROLL DOWN ==========
    
    /**
     * Oculta el botón "scroll down" al hacer scroll
     */
    function handleScrollDownButton() {
        const scrollBtn = document.querySelector('.scroll-down-btn');
        if (!scrollBtn) return;
        
        window.addEventListener('scroll', window.throttle ? window.throttle(function() {
            const scrolled = window.scrollY;
            
            if (scrolled > 200) {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.pointerEvents = 'none';
            } else {
                scrollBtn.style.opacity = '0.7';
                scrollBtn.style.pointerEvents = 'auto';
            }
        }, 100) : function() {});
    }
    
    handleScrollDownButton();
    
    // ========== ANIMACIÓN DE NÚMEROS (CONTADORES) ==========
    
    /**
     * Anima números desde 0 hasta su valor final
     * Útil para estadísticas o números destacados
     */
    function animateNumbers() {
        const numberElements = document.querySelectorAll('[data-animate-number]');
        
        const numberObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const targetNumber = parseInt(element.getAttribute('data-animate-number'));
                    const duration = 2000; // 2 segundos
                    const steps = 60;
                    const stepValue = targetNumber / steps;
                    let currentNumber = 0;
                    
                    const timer = setInterval(() => {
                        currentNumber += stepValue;
                        if (currentNumber >= targetNumber) {
                            element.textContent = targetNumber;
                            clearInterval(timer);
                        } else {
                            element.textContent = Math.floor(currentNumber);
                        }
                    }, duration / steps);
                    
                    numberObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.5
        });
        
        numberElements.forEach(el => numberObserver.observe(el));
    }
    
    // Inicializar animación de números (si existen elementos)
    animateNumbers();
    
    // ========== LAZY LOADING DE IMÁGENES ==========
    
    /**
     * Carga diferida de imágenes para mejor performance
     * (Solo si se usan atributos data-src)
     */
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores sin IntersectionObserver
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
    
    initLazyLoading();
    
    // ========== ANIMACIÓN DE ENTRADA DESDE URL ==========
    
    /**
     * Si llegamos desde otra página, animar la sección destino
     */
    window.addEventListener('load', function() {
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                const elementsInSection = targetSection.querySelectorAll('.fade-in');
                elementsInSection.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('is-visible');
                    }, index * 100);
                });
            }
        }
    });
    
    // ========== DETECCIÓN DE MODO OSCURO ==========
    
    /**
     * Detecta preferencia de modo oscuro del sistema
     * (Por si se implementa en el futuro)
     */
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
        console.log('🌙 Usuario prefiere modo oscuro (no implementado aún)');
    }
    
    // ========== LOG DE INICIALIZACIÓN ==========
    console.log('✨ Animaciones inicializadas');
    console.log('🎭 Elementos animables:', fadeInElements.length);
    console.log('♿ Movimiento reducido:', ANIMATION_CONFIG.reduceMotion ? 'SÍ' : 'NO');
    
});