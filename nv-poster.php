<?php

/**
 * NuVous Poster
 *
 * @wordpress-plugin
 * Plugin Name:       NV Share MemID
 * Plugin URI:        https://github.com/davidfuzju/nv-share-memid
 * Description:       Get product information and generate a poster, allowing users to save the image.
 * Version:           1.0.3
 * Author:            David FU <david.fu.zju@gmail.com>
 * Author URI:        https://github.com/davidfuzju
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       nv-share-memid
 */

// Load necessary scripts after all plugins are loaded
add_action('plugins_loaded', 'nv_product_poster_initialize');

// Register plugins loaded
function nv_product_poster_initialize()
{
    add_action('woocommerce_before_single_product', 'nv_product_poster_enqueue_scripts');
}

// Enqueue necessary scripts and styles
function nv_product_poster_enqueue_scripts()
{
    if (!function_exists('nv_get_referral_url')) {
        error_log('nv_get_referral_url function not found, nv-referral-code plugin should be installed first.');
        return;
    }

    if (!is_product()) {
        error_log('nv-share-memid should be used in a single product page.');
        return;
    }

    global $product;
    $referral_url = nv_get_referral_url();
    wp_enqueue_script('html2canvas', 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', array('jquery'), null, true);
    wp_enqueue_script('qrcode', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js', array('jquery'), null, true);
    wp_enqueue_script('share-memid-generator', plugin_dir_url(__FILE__) . 'js/poster-generator.js', array('jquery', 'html2canvas', 'qrcode'), '1.0', true);
    wp_enqueue_style('share-memid-generator-style', plugin_dir_url(__FILE__) . 'css/style.css');

    // get current user
    $current_user = wp_get_current_user();
    $current_user_id = get_current_user_id();

    // get user referral code
    $referral_code = get_user_meta($current_user_id, 'wrc_ref_code', true);

    // Pass product data and referral URL to JavaScript
    wp_localize_script('share-memid-generator', 'productData', array(
        'name' => $product->get_name(),
        'image' => wp_get_attachment_image_src($product->get_image_id(), 'full')[0],
        'referral_url' => $referral_url,
        'user_name' => $current_user->user_login,
        'member_id' => $referral_code
    ));
}
