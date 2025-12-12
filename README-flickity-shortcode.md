# Gallery Shortcodes para WordPress

Estos shortcodes replican la funcionalidad del slider Angular `gallery-horizontal` para WordPress. Incluyen tanto sliders con Flickity como galerías con scroll horizontal.

## Instalación

### Opción 1: Archivos Separados (Recomendado)

1. **Sube los archivos a tu tema:**
   - `flickity-slider.css` → `/wp-content/themes/tu-tema/flickity-slider.css`
   - `flickity-slider.js` → `/wp-content/themes/tu-tema/flickity-slider.js`
   - `horizontal-scroll-gallery.css` → `/wp-content/themes/tu-tema/horizontal-scroll-gallery.css`
   - `flickity-slider-shortcode-final.php` → Copia el contenido a tu `functions.php`
   - `horizontal-scroll-gallery-shortcode.php` → Copia el contenido a tu `functions.php`

2. **Verifica las rutas:** Asegúrate de que las rutas en el código coincidan con la ubicación de tus archivos.

### Opción 2: Todo en functions.php

1. Copia el contenido del archivo `flickity-slider-shortcodes-separados.php` y pégalo en tu archivo `functions.php` de tu tema de WordPress.

## Estructura de Archivos

```
tu-tema/
├── flickity-slider.css              # Estilos del slider
├── flickity-slider.js               # JavaScript del slider
├── horizontal-scroll-gallery.css    # Estilos de la galería horizontal
└── functions.php                    # Contiene el código PHP de los shortcodes
```

## Ventajas de Archivos Separados

✅ **Mejor rendimiento** - Los archivos se cargan solo cuando se necesitan
✅ **Más fácil de mantener** - CSS y JS separados del PHP
✅ **Caché optimizado** - Los navegadores pueden cachear los archivos estáticos
✅ **Debugging más fácil** - Puedes editar cada archivo por separado
✅ **Mejor organización** - Código más limpio y estructurado

## Shortcodes Disponibles

### `[flickity_slider_archive]` - Slider para Páginas de Archivo
**Usa:** Featured Image (imagen destacada)
**Auto-detecta:** Post type automáticamente en páginas de archivo

**Atributos disponibles:**
- `post_type` - Tipo de post personalizado (auto-detectado en archive, por defecto: 'proyectos')
- `posts_per_page` - Número de posts a mostrar (por defecto: -1 = todos)
- `category` - Slug de la categoría a filtrar (opcional, solo si existe la taxonomía)
- `class` - Clases CSS adicionales
- `autoplay` - Reproducción automática (true/false, por defecto: false)
- `autoplay_delay` - Delay entre slides en ms (por defecto: 5000)
- `height` - Altura del slider (auto/big/altura específica, por defecto: auto)
- `image_size` - Tamaño de imagen de WordPress (por defecto: 'large')
- `link_to_post` - Enlazar imágenes al post individual (true/false, por defecto: true)

**Navegación:** Solo drag/swipe (sin botones ni puntos)

### `[flickity_slider_single]` - Slider para Páginas Single
**Usa:** Campo JetEngine del post actual (con fallback a Featured Image)
**Funciona:** En cualquier página single, muestra las imágenes del meta field del post actual

**Atributos disponibles:**
- `meta_field` - Nombre del campo meta que contiene las imágenes (por defecto: 'imagenes')
- `class` - Clases CSS adicionales
- `autoplay` - Reproducción automática (true/false, por defecto: false)
- `autoplay_delay` - Delay entre slides en ms (por defecto: 5000)
- `height` - Altura del slider (auto/big/altura específica, por defecto: auto)
- `image_size` - Tamaño de imagen de WordPress (por defecto: 'large')
- `link_to_post` - Enlazar imágenes al post individual (true/false, por defecto: false)
- `fallback_to_featured` - Usar featured image si no hay meta field (true/false, por defecto: true)
- `elementor_template` - ID del template de Elementor para mostrar como primer slide (opcional)

**Navegación:** Solo drag/swipe (sin botones ni puntos)

### `[horizontal_scroll_gallery]` - Galería con Scroll Horizontal
**Usa:** Featured Image o Campo JetEngine "imagenes"
**Auto-detecta:** Post type automáticamente en páginas de archivo

**Atributos disponibles:**
- `post_type` - Tipo de post personalizado (auto-detectado en archive, por defecto: 'proyectos')
- `posts_per_page` - Número de posts a mostrar (por defecto: -1 = todos)
- `category` - Slug de la categoría a filtrar (opcional, solo si existe la taxonomía)
- `class` - Clases CSS adicionales
- `height` - Altura de la galería (auto/small/medium/large, por defecto: auto)
- `image_size` - Tamaño de imagen de WordPress (por defecto: 'large')
- `link_to_post` - Enlazar imágenes al post individual (true/false, por defecto: true)
- `use_jetengine_field` - Usar campo JetEngine "imagenes" (true/false, por defecto: false)
- `exclude_current` - Excluir el post actual (true/false, por defecto: false)

**Navegación:** Scroll horizontal nativo del navegador

## Ejemplos de Uso

### Slider de Archivo (Featured Image)
```
[flickity_slider_archive]
```

### Slider de Archivo de Colecciones
```
[flickity_slider_archive post_type="colecciones"]
```

### Slider de Archivo con Configuración Personalizada
```
[flickity_slider_archive post_type="proyectos" posts_per_page="12" autoplay="true" height="big"]
```

### Slider de Single (Campo JetEngine "imagenes")
```
[flickity_slider_single]
```

### Slider de Single de Colecciones
```
[flickity_slider_single post_type="colecciones"]
```

### Slider de Single con Configuración Personalizada
```
[flickity_slider_single post_type="proyectos" posts_per_page="8"]
```

### Galería Horizontal Básica (Featured Image)
```
[horizontal_scroll_gallery]
```

### Galería Horizontal de Colecciones
```
[horizontal_scroll_gallery post_type="colecciones"]
```

### Galería Horizontal con Campo JetEngine
```
[horizontal_scroll_gallery use_jetengine_field="true"]
```

### Galería Horizontal con Configuración Personalizada
```
[horizontal_scroll_gallery post_type="proyectos" height="medium" posts_per_page="12"]
```

### Galería Horizontal sin Enlaces
```
[horizontal_scroll_gallery link_to_post="false"]
```

## Auto-detección de Post Type

Los shortcodes ahora detectan automáticamente el post type:

### En Páginas de Archivo:
- **`[flickity_slider_archive]`** - Detecta automáticamente el CPT de la página de archivo
- **`[horizontal_scroll_gallery]`** - Detecta automáticamente el CPT de la página de archivo

### En Páginas Single:
- **`[flickity_slider_single]`** - Detecta automáticamente el CPT del post actual

### Ejemplos de Auto-detección:
```
# En página de archivo de "proyectos" - muestra proyectos automáticamente
[flickity_slider_archive]

# En página de archivo de "colecciones" - muestra colecciones automáticamente  
[horizontal_scroll_gallery]

# En single page de un proyecto - muestra otros proyectos automáticamente
[flickity_slider_single]
```

## Configuración del CPT

### Para Proyectos y Colecciones

Tu CPT debe tener:
- **Imagen destacada** configurada para cada post (para el shortcode de archive)
- **Campo JetEngine "imagenes"** configurado (para el shortcode de single)
- **Categorías** (opcional) - solo si las necesitas en el futuro

Ejemplo de registro de CPTs:
```php
function register_projects_cpts() {
    // CPT Proyectos
    register_post_type('proyectos', array(
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-portfolio',
        'labels' => array(
            'name' => 'Proyectos',
            'singular_name' => 'Proyecto'
        )
    ));
    
    // CPT Colecciones
    register_post_type('colecciones', array(
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-images-alt2',
        'labels' => array(
            'name' => 'Colecciones',
            'singular_name' => 'Colección'
        )
    ));
}
add_action('init', 'register_projects_cpts');
```

### Configuración del Campo JetEngine "imagenes"

Para el shortcode de single, necesitas configurar un campo personalizado en JetEngine:

1. Ve a **JetEngine > Meta Boxes**
2. Crea un nuevo Meta Box para tu CPT
3. Agrega un campo de tipo **Gallery** o **Media**
4. Nombra el campo como `imagenes`
5. Configúralo para que guarde múltiples imágenes

**Nota:** El shortcode de archive funcionará solo con featured images, mientras que el de single usará el campo JetEngine con fallback a featured image.

## Personalización CSS

El shortcode incluye CSS embebido que replica los estilos del componente Angular. Puedes sobrescribir estos estilos agregando CSS personalizado a tu tema:

```css
/* Personalizar altura del slider */
.main-carousel {
    height: 400px !important;
}

/* Personalizar botones */
.arrows.outside .arrow svg rect {
    stroke: #your-color !important;
}

/* Personalizar imágenes */
.carousel-cell img {
    border-radius: 10px;
}
```

## Características

✅ **CSS y JavaScript embebidos** - No necesitas cargar archivos externos
✅ **Responsive** - Adaptado para móvil, tablet y desktop
✅ **Compatible con CPT** - Funciona con cualquier Custom Post Type
✅ **Navegación personalizada** - Botones con el mismo diseño que Angular
✅ **Autoplay opcional** - Configurable por shortcode
✅ **Filtrado por categoría** - Soporte para taxonomías
✅ **Múltiples sliders** - Puedes usar varios shortcodes en la misma página
✅ **Optimización de imágenes** - Usa srcset para imágenes responsive

## Notas Técnicas

- El shortcode carga Flickity desde CDN solo cuando es necesario
- Cada slider tiene un ID único para evitar conflictos
- Los estilos están optimizados para replicar el comportamiento del componente Angular
- Compatible con temas de WordPress estándar
- No requiere jQuery (usa JavaScript vanilla)

## Troubleshooting

**El slider no aparece:**
- Verifica que tu CPT tenga posts publicados
- Asegúrate de que los posts tengan imagen destacada
- Revisa la consola del navegador para errores JavaScript

**Los botones no funcionan:**
- Verifica que Flickity se haya cargado correctamente
- Asegúrate de que no hay conflictos con otros scripts

**Estilos no se aplican:**
- Verifica que no hay CSS conflictivo en tu tema
- Usa `!important` en tus estilos personalizados si es necesario
