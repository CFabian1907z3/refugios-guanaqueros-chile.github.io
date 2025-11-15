/* 
╔═══════════════════════════════════════════════════════════╗
║  CARRUSELES DE GALERÍA - Refugio de Guanaqueros          ║
║  ────────────────────────────────────────────────────────  ║
║  Este archivo controla:                                   ║
║  • Carruseles fade de las galerías de refugios           ║
║  • Navegación manual (botones prev/next)                 ║
║  • Auto-avance automático cada 5 segundos                ║
║  • Soporte para múltiples carruseles en la misma página  ║
║                                                            ║
║  ⚠️ Cada carrusel debe tener un ID único                  ║
╚═══════════════════════════════════════════════════════════╝
*/

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== CONFIGURACIÓN ==========
    const CAROUSEL_CONFIG = {
        autoPlayInterval: 5000,   // 5 segundos
        transitionDuration: 1000, // 1 segundo
        pauseOnHover: true,       // Pausar al pasar el mouse
        enableSwipe: true         // Habilitar swipe en móvil
    };
    
    // Objeto para almacenar el estado de cada carrusel
    const carousels = {};
    
    // ========== FUNCIÓN PRINCIPAL DE CARRUSEL ==========
    
    /**
     * Mueve el carrusel a la siguiente/anterior diapositiva
     * @param {string} carouselId - ID del contenedor del carrusel
     * @param {number} direction - -1 para anterior, 1 para siguiente
     */
    window.moveSlide = function(carouselId, direction) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) {
            console.warn('⚠️ Carrusel no encontrado:', carouselId);
            return;
        }
        
        const slides = carousel.querySelectorAll('.carousel-slide');
        if (slides.length === 0) {
            console.warn('⚠️ No hay slides en el carrusel:', carouselId);
            return;
        }
        
        // Inicializar estado si no existe
        if (!carousels[carouselId]) {
            carousels[carouselId] = {
                currentIndex: 0,
                autoPlayTimer: null
            };
        }
        
        const state = carousels[carouselId];
        const oldIndex = state.currentIndex;
        
        // Calcular nuevo índice
        let newIndex = oldIndex + direction;
        if (newIndex < 0) {
            newIndex = slides.length - 1;
        } else if (newIndex >= slides.length) {
            newIndex = 0;
        }
        
        // Actualizar clases
        if (oldIndex !== newIndex) {
            slides[oldIndex].classList.remove('active');
            slides[newIndex].classList.add('active');
            state.currentIndex = newIndex;
        }
        
        // Reiniciar auto-play después de interacción manual
        resetAutoPlay(carouselId);
    };
    
    // ========== AUTO-PLAY ==========
    
    /**
     * Inicia el auto-play de un carrusel
     * @param {string} carouselId - ID del carrusel
     */
    function startAutoPlay(carouselId) {
        if (!carousels[carouselId]) {
            carousels[carouselId] = {
                currentIndex: 0,
                autoPlayTimer: null
            };
        }
        
        const state = carousels[carouselId];
        
        // Limpiar timer existente
        if (state.autoPlayTimer) {
            clearInterval(state.autoPlayTimer);
        }
        
        // Iniciar nuevo timer
        state.autoPlayTimer = setInterval(() => {
            window.moveSlide(carouselId, 1);
        }, CAROUSEL_CONFIG.autoPlayInterval);
    }
    
    /**
     * Detiene el auto-play de un carrusel
     * @param {string} carouselId - ID del carrusel
     */
    function stopAutoPlay(carouselId) {
        if (carousels[carouselId] && carousels[carouselId].autoPlayTimer) {
            clearInterval(carousels[carouselId].autoPlayTimer);
            carousels[carouselId].autoPlayTimer = null;
        }
    }
    
    /**
     * Reinicia el auto-play de un carrusel
     * @param {string} carouselId - ID del carrusel
     */
    function resetAutoPlay(carouselId) {
        stopAutoPlay(carouselId);
        startAutoPlay(carouselId);
    }
    
    // ========== INICIALIZAR CARRUSELES ==========
    
    /**
     * Encuentra e inicializa todos los carruseles en la página
     */
    function initializeCarousels() {
        const carouselContainers = document.querySelectorAll('.carousel-container[id]');
        
        carouselContainers.forEach(container => {
            const carouselId = container.id;
            
            // Iniciar auto-play
            startAutoPlay(carouselId);
            
            // Pausar en hover (si está habilitado)
            if (CAROUSEL_CONFIG.pauseOnHover) {
                container.addEventListener('mouseenter', () => {
                    stopAutoPlay(carouselId);
                });
                
                container.addEventListener('mouseleave', () => {
                    startAutoPlay(carouselId);
                });
            }
            
            // Soporte para swipe en móvil
            if (CAROUSEL_CONFIG.enableSwipe) {
                enableSwipeGestures(carouselId, container);
            }
            
            console.log('🎠 Carrusel inicializado:', carouselId);
        });
        
        console.log('✅ Total de carruseles:', carouselContainers.length);
    }
    
    // Inicializar todos los carruseles
    initializeCarousels();
    
    // ========== SOPORTE PARA SWIPE (MÓVIL) ==========
    
    /**
     * Habilita gestos de swipe en carruseles para móvil
     * @param {string} carouselId - ID del carrusel
     * @param {HTMLElement} container - Elemento contenedor
     */
    function enableSwipeGestures(carouselId, container) {
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50; // Distancia mínima para considerar swipe
        
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(carouselId);
        }, { passive: true });
        
        function handleSwipe(carouselId) {
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    // Swipe right = slide anterior
                    window.moveSlide(carouselId, -1);
                } else {
                    // Swipe left = slide siguiente
                    window.moveSlide(carouselId, 1);
                }
            }
        }
    }
    
    // ========== NAVEGACIÓN CON TECLADO ==========
    
    /**
     * Permite navegar carruseles con flechas del teclado
     */
    function enableKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Encontrar el carrusel visible en el viewport
            const carouselContainers = document.querySelectorAll('.carousel-container[id]');
            
            carouselContainers.forEach(container => {
                if (isElementInViewport(container)) {
                    const carouselId = container.id;
                    
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        window.moveSlide(carouselId, -1);
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        window.moveSlide(carouselId, 1);
                    }
                }
            });
        });
    }
    
    // Habilitar navegación con teclado
    enableKeyboardNavigation();
    
    // ========== UTILIDADES ==========
    
    /**
     * Verifica si un elemento está en el viewport
     * @param {HTMLElement} element - Elemento a verificar
     * @returns {boolean}
     */
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // ========== PAUSAR/REANUDAR GLOBAL ==========
    
    /**
     * Detener todos los carruseles (útil para performance)
     */
    window.stopAllCarousels = function() {
        Object.keys(carousels).forEach(carouselId => {
            stopAutoPlay(carouselId);
        });
        console.log('⏸️ Todos los carruseles pausados');
    };
    
    /**
     * Reanudar todos los carruseles
     */
    window.startAllCarousels = function() {
        Object.keys(carousels).forEach(carouselId => {
            startAutoPlay(carouselId);
        });
        console.log('▶️ Todos los carruseles reanudados');
    };
    
    // ========== LIMPIEZA AL SALIR DE LA PÁGINA ==========
    
    // Detener todos los carruseles al salir de la página
    window.addEventListener('beforeunload', () => {
        window.stopAllCarousels();
    });
    
    // Pausar carruseles cuando la pestaña no está activa
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.stopAllCarousels();
        } else {
            window.startAllCarousels();
        }
    });
    
    console.log('🎠 Sistema de carruseles listo');
    
});