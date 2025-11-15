/* 
╔═══════════════════════════════════════════════════════════╗
║  NAVEGACIÓN Y HEADER - Refugio de Guanaqueros            ║
║  ────────────────────────────────────────────────────────  ║
║  Este archivo controla:                                   ║
║  • Header transparente/sólido al hacer scroll            ║
║  • Resaltado de sección activa (scrollspy)               ║
║  • Smooth scroll a secciones                             ║
║                                                            ║
║  ⚠️ NO modificar a menos que necesites cambiar la lógica  ║
╚═══════════════════════════════════════════════════════════╝
*/

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== ELEMENTOS DEL DOM ==========
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = header ? header.offsetHeight : 80;
    
    if (!header) {
        console.warn('⚠️ Header no encontrado');
        return;
    }
    
    // ========== HEADER TRANSPARENTE ==========
    
    /**
     * Controla si el header debe ser transparente o sólido
     * Transparente solo en los primeros 20px de scroll
     */
    function handleHeaderTransparency() {
        const isAtVeryTop = window.scrollY < 20;
        
        if (isAtVeryTop) {
            header.classList.add('header-transparent');
        } else {
            header.classList.remove('header-transparent');
        }
    }
    
    // Ejecutar al cargar la página
    handleHeaderTransparency();
    
    // Ejecutar al hacer scroll (con throttle para performance)
    window.addEventListener('scroll', window.throttle ? window.throttle(handleHeaderTransparency, 50) : handleHeaderTransparency);
    
    // ========== SCROLLSPY (RESALTADO DE SECCIÓN ACTIVA) ==========
    
    /**
     * Detecta qué sección está visible y resalta su enlace
     */
    function handleScrollSpy() {
        let current = '';
        const scrollY = window.scrollY;
        
        // Encontrar qué sección está visible
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 50;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Si no encontramos sección, estamos en el hero
        if (!current && scrollY < (sections[0]?.offsetTop - navbarHeight - 50)) {
            current = 'home';
        }
        
        // Actualizar clase active en los enlaces
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const linkSection = link.getAttribute('data-section') || link.getAttribute('href')?.substring(1);
            if (linkSection === current) {
                link.classList.add('active');
            }
        });
    }
    
    // Ejecutar scrollspy al cargar
    handleScrollSpy();
    
    // Ejecutar al hacer scroll
    window.addEventListener('scroll', window.throttle ? window.throttle(handleScrollSpy, 100) : handleScrollSpy);
    
    // ========== SMOOTH SCROLL ==========
    
    /**
     * Scroll suave al hacer clic en enlaces internos
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Si es solo "#", no hacer nada
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            // Si el enlace apunta a una sección en la misma página
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Scroll suave a la sección
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Actualizar URL sin recargar
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });
    
    // ========== DETECCIÓN DE SECCIÓN DESDE URL ==========
    
    /**
     * Si la URL tiene un hash (#seccion), hacer scroll a esa sección
     */
    function scrollToHashOnLoad() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        }
    }
    
    // Ejecutar al cargar la página
    scrollToHashOnLoad();
    
    // ========== MANEJO DE NAVEGACIÓN ENTRE PÁGINAS ==========
    
    /**
     * Para enlaces que van a otra página con un hash
     * Ej: desde cotiza.html hacia index.html#contacto
     */
    window.addEventListener('load', function() {
        scrollToHashOnLoad();
    });
    
    // ========== PREVENCIÓN DE HEADER FIXED EN PANTALLAS PEQUEÑAS ==========
    
    /**
     * En móviles muy pequeños, asegurar que el header no cause problemas
     */
    function adjustHeaderForSmallScreens() {
        if (window.innerWidth < 360) {
            header.style.position = 'sticky';
        } else {
            header.style.position = 'fixed';
        }
    }
    
    adjustHeaderForSmallScreens();
    window.addEventListener('resize', window.throttle ? window.throttle(adjustHeaderForSmallScreens, 200) : adjustHeaderForSmallScreens);
    
    // ========== LOG DE INICIALIZACIÓN ==========
    console.log('✅ Navegación inicializada');
    console.log('📍 Secciones detectadas:', sections.length);
    console.log('🔗 Enlaces de navegación:', navLinks.length);
    
});