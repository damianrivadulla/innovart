<?php
/**
 * Flickity Slider Shortcodes para WordPress
 * Basado en la lógica del componente Angular gallery-horizontal
 * 
 * Shortcodes:
 * - [flickity_slider_archive] - Para páginas de archivo (usa featured image)
 * - [flickity_slider_single] - Para páginas single (usa campo JetEngine "imagenes")
 */

// Registrar los shortcodes
add_shortcode('flickity_slider_archive', 'flickity_slider_archive_shortcode');
add_shortcode('flickity_slider_single', 'flickity_slider_single_shortcode');

// Función para registrar los scripts de Flickity
function enqueue_flickity_assets() {
    // Solo cargar en páginas que usen el shortcode
    global $post;
    if (is_a($post, 'WP_Post') && (has_shortcode($post->post_content, 'flickity_slider_archive') || has_shortcode($post->post_content, 'flickity_slider_single'))) {
        // Cargar Flickity desde CDN
        wp_enqueue_style('flickity-css', 'https://unpkg.com/flickity@2/dist/flickity.min.css');
        wp_enqueue_script('flickity-js', 'https://unpkg.com/flickity@2/dist/flickity.pkgd.min.js', array(), '2.3.0', true);
        
        // Cargar nuestros archivos personalizados
        wp_enqueue_style('flickity-slider-custom', get_template_directory_uri() . '/flickity-slider.css', array('flickity-css'), '1.0.0');
        wp_enqueue_script('flickity-slider-custom', get_template_directory_uri() . '/flickity-slider.js', array('flickity-js'), '1.0.0', true);
    }
}
add_action('wp_enqueue_scripts', 'enqueue_flickity_assets');

// Shortcode específico para páginas de archivo (usa featured image)
function flickity_slider_archive_shortcode($atts) {
    // Detectar automáticamente el post type si estamos en una página de archivo
    $auto_post_type = '';
    if (is_archive()) {
        global $wp_query;
        if (isset($wp_query->query_vars['post_type'])) {
            $auto_post_type = $wp_query->query_vars['post_type'];
        }
    }

    // Atributos por defecto para archive
    $atts = shortcode_atts(array(
        'post_type' => $auto_post_type ?: 'proyectos', // Usar el detectado o 'proyectos' por defecto
        'posts_per_page' => -1,
        'category' => '',
        'class' => '',
        'autoplay' => 'false',
        'autoplay_delay' => '5000',
        'height' => 'auto',
        'image_size' => 'large',
        'link_to_post' => 'true'
    ), $atts);

    // Query para obtener los posts
    $args = array(
        'post_type' => $atts['post_type'],
        'posts_per_page' => intval($atts['posts_per_page']),
        'post_status' => 'publish'
    );

    // Si se especifica una categoría (opcional)
    if (!empty($atts['category'])) {
        $taxonomy = $atts['post_type'] . '_category';
        if (taxonomy_exists($taxonomy)) {
            $args['tax_query'] = array(
                array(
                    'taxonomy' => $taxonomy,
                    'field' => 'slug',
                    'terms' => $atts['category']
                )
            );
        }
    }

    $posts = get_posts($args);

    if (empty($posts)) {
        return '<p>No se encontraron elementos para mostrar.</p>';
    }

    // Generar ID único para este slider
    $slider_id = 'flickity-slider-archive-' . uniqid();

    // Determinar clases CSS
    $carousel_class = 'main-carousel';
    if (!empty($atts['class'])) {
        $carousel_class .= ' ' . esc_attr($atts['class']);
    }
    if ($atts['height'] === 'big') {
        $carousel_class .= ' big';
    }

    // Determinar altura del slider
    $height_style = '';
    if ($atts['height'] !== 'auto' && $atts['height'] !== 'big') {
        $height_style = 'style="height: ' . esc_attr($atts['height']) . ';"';
    }

    // Iniciar el output
    ob_start();
    ?>

    <!-- HTML del Slider -->
    <div class="flickity-slider-container" <?php echo $height_style; ?>>
        <div id="<?php echo esc_attr($slider_id); ?>" class="<?php echo esc_attr($carousel_class); ?>">
            <?php foreach ($posts as $post): ?>
                <div class="carousel-cell" data-post-id="<?php echo esc_attr($post->ID); ?>" data-post-url="<?php echo esc_url(get_permalink($post->ID)); ?>">
                    <?php 
                    // ARCHIVE: Usar featured image
                    $thumbnail_id = get_post_thumbnail_id($post->ID);
                    if ($thumbnail_id) {
                        $image = wp_get_attachment_image_src($thumbnail_id, $atts['image_size']);
                        $image_srcset = wp_get_attachment_image_srcset($thumbnail_id, $atts['image_size']);
                        $image_alt = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
                        
                        if ($image) {
                            if ($atts['link_to_post'] === 'true') {
                                echo '<a href="' . esc_url(get_permalink($post->ID)) . '" class="project-link">';
                            }
                            echo '<img src="' . esc_url($image[0]) . '"';
                            if ($image_srcset) {
                                echo ' srcset="' . esc_attr($image_srcset) . '"';
                            }
                            if ($image_alt) {
                                echo ' alt="' . esc_attr($image_alt) . '"';
                            } else {
                                echo ' alt="' . esc_attr($post->post_title) . '"';
                            }
                            echo '>';
                            if ($atts['link_to_post'] === 'true') {
                                echo '</a>';
                            }
                        }
                    } else {
                        // Imagen por defecto si no hay imagen destacada
                        if ($atts['link_to_post'] === 'true') {
                            echo '<a href="' . esc_url(get_permalink($post->ID)) . '" class="project-link">';
                        }
                        echo '<img src="' . get_template_directory_uri() . '/assets/images/placeholder.jpg" alt="' . esc_attr($post->post_title) . '">';
                        if ($atts['link_to_post'] === 'true') {
                            echo '</a>';
                        }
                    }
                    ?>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Sin botones de navegación - Solo drag/swipe -->
    </div>

    <?php
    return ob_get_clean();
}

// Shortcode específico para páginas single (usa campo JetEngine "imagenes" del post actual)
function flickity_slider_single_shortcode($atts) {
    // Obtener el post actual
    global $post;
    if (!$post) {
        return '<p>No se puede obtener información del post actual.</p>';
    }

    // Atributos por defecto para single
    $atts = shortcode_atts(array(
        'meta_field' => 'imagenes', // Campo meta a usar
        'class' => '',
        'autoplay' => 'false',
        'autoplay_delay' => '5000',
        'height' => 'auto',
        'image_size' => 'large',
        'link_to_post' => 'false', // Por defecto no enlazar en single
        'fallback_to_featured' => 'true', // Usar featured image como fallback
        'elementor_template' => '' // ID del template de Elementor para primer slide
    ), $atts);

    // Obtener las imágenes del meta field
    $imagenes_field = get_post_meta($post->ID, $atts['meta_field'], true);
    $image_ids = array();

    if (!empty($imagenes_field)) {
        // Si es un array de IDs de imágenes
        if (is_array($imagenes_field)) {
            $image_ids = $imagenes_field;
        } else {
            // Si es un string con IDs separados por comas
            $image_ids = explode(',', $imagenes_field);
            $image_ids = array_map('trim', $image_ids);
        }
        
        // Limpiar IDs vacíos
        $image_ids = array_filter($image_ids, function($id) {
            return !empty($id) && is_numeric($id);
        });
    }

    // Si no hay imágenes en el meta field y está habilitado el fallback
    if (empty($image_ids) && $atts['fallback_to_featured'] === 'true') {
        $thumbnail_id = get_post_thumbnail_id($post->ID);
        if ($thumbnail_id) {
            $image_ids = array($thumbnail_id);
        }
    }

    if (empty($image_ids)) {
        return '<p>No se encontraron imágenes para mostrar.</p>';
    }

    // Generar ID único para este slider
    $slider_id = 'flickity-slider-single-' . uniqid();

    // Determinar clases CSS
    $carousel_class = 'single-carousel';
    if (!empty($atts['class'])) {
        $carousel_class .= ' ' . esc_attr($atts['class']);
    }
    if ($atts['height'] === 'big') {
        $carousel_class .= ' big';
    }

    // Determinar altura del slider
    $height_style = '';
    if ($atts['height'] !== 'auto' && $atts['height'] !== 'big') {
        $height_style = 'style="height: ' . esc_attr($atts['height']) . ';"';
    }

    // Iniciar el output
    ob_start();
    ?>

            <!-- HTML del Slider -->
            <div class="flickity-slider-container" <?php echo $height_style; ?>>
                <div id="<?php echo esc_attr($slider_id); ?>" class="<?php echo esc_attr($carousel_class); ?>">
                    
                    <?php 
                    // Si se especifica un template de Elementor, agregarlo como primer slide
                    if (!empty($atts['elementor_template'])) {
                        $template_id = intval($atts['elementor_template']);
                        
                        // Verificar que el template existe
                        if (get_post_status($template_id) === 'publish') {
                            echo '<div class="carousel-cell template-cell">';
                            
                            // Renderizar el template de Elementor
                            echo \Elementor\Plugin::instance()->frontend->get_builder_content_for_display($template_id);
                            
                            echo '</div>';
                        }
                    }
                    ?>
                    
                    <?php foreach ($image_ids as $image_id): ?>
                <div class="carousel-cell" data-image-id="<?php echo esc_attr($image_id); ?>">
                    <?php 
                    $image = wp_get_attachment_image_src($image_id, $atts['image_size']);
                    $image_srcset = wp_get_attachment_image_srcset($image_id, $atts['image_size']);
                    $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
                    
                    if ($image) {
                        if ($atts['link_to_post'] === 'true') {
                            echo '<a href="' . esc_url(get_permalink($post->ID)) . '" class="project-link">';
                        }
                        echo '<img src="' . esc_url($image[0]) . '"';
                        if ($image_srcset) {
                            echo ' srcset="' . esc_attr($image_srcset) . '"';
                        }
                        if ($image_alt) {
                            echo ' alt="' . esc_attr($image_alt) . '"';
                        } else {
                            echo ' alt="' . esc_attr($post->post_title) . '"';
                        }
                        echo '>';
                        if ($atts['link_to_post'] === 'true') {
                            echo '</a>';
                        }
                    }
                    ?>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Sin botones de navegación - Solo drag/swipe -->
    </div>

    <?php
    return ob_get_clean();
}

?>
