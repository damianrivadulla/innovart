/**
 * Flickity Slider JavaScript para WordPress
 * Basado en la lógica del componente Angular gallery-horizontal
 */

function initializeFlickitySliders() {
    // Inicializar todos los sliders
    document.querySelectorAll('.main-carousel, .single-carousel').forEach(function(carousel) {
        var sliderId = carousel.id;
        
        console.log('Inicializando slider:', sliderId);
        console.log('Elementos encontrados:', carousel.querySelectorAll('.carousel-cell').length);
        
        // Inicializar Flickity básico
        var flickity = new Flickity(carousel, {
            cellAlign: "left",
            draggable: true,
            pageDots: false,
            contain: true,
            freeScroll: true,
            prevNextButtons: false,
            autoPlay: false,
            resize: true
        });
        
        // Redimensionar después de que las imágenes se carguen
        setTimeout(function() {
            flickity.resize();
        }, 500);
        
        // También redimensionar cuando todas las imágenes estén cargadas
        var imagesLoaded = 0;
        var totalImages = carousel.querySelectorAll('.carousel-cell img').length;
        
        if (totalImages > 0) {
            carousel.querySelectorAll('.carousel-cell img').forEach(function(img) {
                img.onload = function() {
                    imagesLoaded++;
                    if (imagesLoaded === totalImages) {
                        setTimeout(function() {
                            flickity.resize();
                        }, 100);
                    }
                };
                
                if (img.complete) {
                    img.onload();
                }
            });
        }
        
        // Manejar clicks en las celdas para navegar al post
        flickity.on('staticClick', function(event, pointer, cellElement, cellIndex) {
            if (cellIndex !== undefined && cellElement) {
                var postUrl = cellElement.getAttribute('data-post-url');
                if (postUrl) {
                    window.location.href = postUrl;
                }
            }
        });

        // Eventos de cambio de slide
        flickity.on('select', function() {
            console.log('Selected slide:', flickity.selectedIndex);
        });
        
        // Redimensionar cuando cambie el tamaño de la ventana
        window.addEventListener('resize', function() {
            setTimeout(function() {
                flickity.resize();
            }, 100);
        });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeFlickitySliders();
});

// Reinicializar cuando se carga contenido dinámicamente (AJAX, etc.)
if (typeof jQuery !== 'undefined') {
    jQuery(document).on('ready', function() {
        initializeFlickitySliders();
    });
}
