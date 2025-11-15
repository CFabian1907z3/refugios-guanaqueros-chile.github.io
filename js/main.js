/* 
╔═══════════════════════════════════════════════════════════╗
║  JAVASCRIPT PRINCIPAL - Refugio de Guanaqueros           ║
║  ────────────────────────────────────────────────────────  ║
║  GUÍA DE EDICIÓN:                                         ║
║  • Este archivo inicializa todas las funcionalidades     ║
║  • NO modificar a menos que sepas JavaScript             ║
║  • Para cambios específicos, edita los archivos:        ║
║    - navigation.js (menú y navegación)                   ║
║    - animations.js (efectos visuales)                     ║
║    - carousel.js (galerías)                              ║
║    - contact-form.js (formulario)                        ║
╚═══════════════════════════════════════════════════════════╝
*/

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========  INICIALIZACIÓN  ==========
    console.log('🏖️ Refugio de Guanaqueros - Sitio Web Cargado');
    
    // Año actual en el footer
    updateCopyrightYear();
    
    // Inicializar menú móvil
    initMobileMenu();
    
    // Mensaje de bienvenida en consola
    console.log('%c¡Bienvenido al sitio de Refugio de Guanaqueros!', 
                'color: #0077B6; font-size: 16px; font-weight: bold;');
    
});

// ========== FUNCIONES AUXILIARES ==========

/**
 * Actualiza el año en el footer automáticamente
 */
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Inicializa el menú móvil (toggle)
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuButton || !mobileMenu) {
        console.warn('⚠️ Elementos del menú móvil no encontrados');
        return;
    }
    
    // Toggle del menú al hacer clic en el botón hamburguesa
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        
        // Cambiar icono hamburguesa <-> X
        const icon = mobileMenuButton.querySelector('i');
        if (icon) {
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
    });
    
    // Cerrar menú al hacer clic en un enlace
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickOnButton = mobileMenuButton.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnButton && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

// ========== UTILIDADES GLOBALES ==========

/**
 * Scroll suave a una sección
 * @param {string} sectionId - ID de la sección (sin #)
 */
window.smoothScrollTo = function(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

/**
 * Detecta si un elemento está visible en el viewport
 * @param {HTMLElement} element - Elemento a verificar
 * @returns {boolean}
 */
window.isElementInViewport = function(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// ========== MANEJO DE ERRORES GLOBALES ==========

// Capturar errores de carga de recursos
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('⚠️ Error cargando imagen:', e.target.src);
        // Opcional: Mostrar imagen placeholder
        // e.target.src = 'ruta/a/imagen/placeholder.jpg';
    }
}, true);

// ========== PREVENCIÓN DE SCROLL HORIZONTAL ==========

// Prevenir que elementos causen scroll horizontal
function preventHorizontalScroll() {
    const body = document.body;
    const html = document.documentElement;
    
    // Asegurar que no hay overflow horizontal
    body.style.overflowX = 'hidden';
    html.style.overflowX = 'hidden';
}

// Ejecutar al cargar y al redimensionar
preventHorizontalScroll();
window.addEventListener('resize', preventHorizontalScroll);

// ========== OPTIMIZACIÓN DE PERFORMANCE ==========

// Throttle para eventos que se disparan muchas veces
function throttle(func, wait) {
    let timeout;
    let lastRan;
    return function executedFunction(...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                if ((Date.now() - lastRan) >= wait) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, wait - (Date.now() - lastRan));
        }
    };
}

// Exportar throttle para uso en otros scripts
window.throttle = throttle;

// ========== DETECCIÓN DE DISPOSITIVO ==========

// Detectar si es dispositivo móvil
window.isMobile = function() {
    return window.innerWidth <= 768;
};

// Detectar si es tablet
window.isTablet = function() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
};

// Detectar si es desktop
window.isDesktop = function() {
    return window.innerWidth > 1024;
};

// ========== LOGGING DE INFORMACIÓN DEL SITIO ==========

console.log('📱 Dispositivo:', window.isMobile() ? 'Móvil' : window.isTablet() ? 'Tablet' : 'Desktop');
console.log('📐 Viewport:', window.innerWidth + 'x' + window.innerHeight);
console.log('🌐 Navegador:', navigator.userAgent.split(')')[0].split('(')[1] || 'Desconocido');