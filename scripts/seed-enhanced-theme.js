// ============================================================
// Enhanced Theme Seeding Script
// Extracts theme data from the HTML and seeds the database
// ============================================================

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function seedTheme() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  try {
    console.log('Starting enhanced theme seeding...');

    const themeId = 1;

    // Clear existing data for theme
    await connection.execute('DELETE FROM theme_settings WHERE theme_id = ?', [themeId]);
    await connection.execute('DELETE FROM theme_components WHERE theme_id = ?', [themeId]);
    await connection.execute('DELETE FROM theme_svg_icons WHERE theme_id = ?', [themeId]);
    await connection.execute('DELETE FROM theme_sections WHERE theme_id = ?', [themeId]);
    await connection.execute('DELETE FROM theme_animations WHERE theme_id = ?', [themeId]);
    await connection.execute('DELETE FROM theme_typography WHERE theme_id = ?', [themeId]);
    await connection.execute('DELETE FROM theme_breakpoints WHERE theme_id = ?', [themeId]);

    console.log('Cleared existing theme data');

    // Seed comprehensive color palette from HTML
    const colors = [
      // Primary Navy Colors
      { category: 'color', key: '--navy-950', value: '#0A1628', data_type: 'color', description: 'Darkest navy background' },
      { category: 'color', key: '--navy-900', value: '#0F1F3D', data_type: 'color', description: 'Dark navy background' },
      { category: 'color', key: '--navy-850', value: '#122647', data_type: 'color', description: 'Medium navy background' },
      
      // Accent Colors
      { category: 'color', key: '--orange', value: '#FF6B1A', data_type: 'color', description: 'Primary orange accent' },
      { category: 'color', key: '--orange-dim', value: '#c9540f', data_type: 'color', description: 'Darker orange for hover' },
      { category: 'color', key: '--green', value: '#12B76A', data_type: 'color', description: 'Primary green accent' },
      { category: 'color', key: '--green-dim', value: '#0C8A50', data_type: 'color', description: 'Darker green for hover' },
      { category: 'color', key: '--yellow', value: '#FFC93C', data_type: 'color', description: 'Yellow accent' },
      { category: 'color', key: '--cyan', value: '#00D4FF', data_type: 'color', description: 'Cyan accent' },
      { category: 'color', key: '--blue', value: '#3B82F6', data_type: 'color', description: 'Blue accent' },
      { category: 'color', key: '--purple', value: '#A855F7', data_type: 'color', description: 'Purple accent' },
      
      // Neutral Colors
      { category: 'color', key: '--white', value: '#FFFFFF', data_type: 'color', description: 'White' },
      { category: 'color', key: '--gray-100', value: '#F4F6F9', data_type: 'color', description: 'Light gray background' },
      { category: 'color', key: '--gray-200', value: '#E7EBF1', data_type: 'color', description: 'Medium gray border' },
      { category: 'color', key: '--graphite-800', value: '#1E2530', data_type: 'color', description: 'Dark graphite text' },
      { category: 'color', key: '--graphite-500', value: '#5B6472', data_type: 'color', description: 'Medium graphite text' },
      
      // Semantic Colors
      { category: 'color', key: '--selection-bg', value: '#FF6B1A', data_type: 'color', description: 'Text selection background' },
      { category: 'color', key: '--selection-text', value: '#FFFFFF', data_type: 'color', description: 'Text selection color' },
      { category: 'color', key: '--focus-outline', value: '#00D4FF', data_type: 'color', description: 'Focus outline color' },
      { category: 'color', key: '--accent', value: '#00D4FF', data_type: 'color', description: 'Theme accent color' },
      { category: 'color', key: '--tint-color', value: '#00D4FF', data_type: 'color', description: 'Theme tint color' },
    ];

    for (const color of colors) {
      await connection.execute(
        'INSERT INTO theme_settings (theme_id, category, `key`, `value`, data_type, description) VALUES (?, ?, ?, ?, ?, ?)',
        [themeId, color.category, color.key, color.value, color.data_type, color.description]
      );
    }

    // Seed spacing settings
    const spacing = [
      { category: 'spacing', key: '--section-pad', value: '9rem', data_type: 'size', description: 'Default section padding' },
      { category: 'spacing', key: '--container-max-width', value: '1600px', data_type: 'size', description: 'Container max width' },
      { category: 'spacing', key: '--container-padding', value: '3rem', data_type: 'size', description: 'Container horizontal padding' },
      { category: 'spacing', key: '--header-height', value: '80px', data_type: 'size', description: 'Header height' },
    ];

    for (const space of spacing) {
      await connection.execute(
        'INSERT INTO theme_settings (theme_id, category, `key`, `value`, data_type, description) VALUES (?, ?, ?, ?, ?, ?)',
        [themeId, space.category, space.key, space.value, space.data_type, space.description]
      );
    }

    // Seed typography
    const fonts = [
      { 
        font_name: 'Display Font', 
        css_variable: '--font-display', 
        font_family: "'Space Grotesk', sans-serif", 
        font_weight: '700',
        font_size: null,
        line_height: '1.08',
        letter_spacing: '-0.01em',
        google_font_url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap',
        is_custom: 0
      },
      { 
        font_name: 'Body Font', 
        css_variable: '--font-body', 
        font_family: "'Inter', sans-serif", 
        font_weight: '400',
        font_size: null,
        line_height: '1.6',
        letter_spacing: 'normal',
        google_font_url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        is_custom: 0
      },
      { 
        font_name: 'Mono Font', 
        css_variable: '--font-mono', 
        font_family: "'IBM Plex Mono', monospace", 
        font_weight: '500',
        font_size: null,
        line_height: 'normal',
        letter_spacing: 'normal',
        google_font_url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap',
        is_custom: 0
      },
    ];

    for (const font of fonts) {
      await connection.execute(
        'INSERT INTO theme_typography (theme_id, font_name, css_variable, font_family, font_weight, font_size, line_height, letter_spacing, google_font_url, is_custom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [themeId, font.font_name, font.css_variable, font.font_family, font.font_weight, font.font_size, font.line_height, font.letter_spacing, font.google_font_url, font.is_custom]
      );
    }

    // Seed breakpoints
    const breakpoints = [
      { breakpoint_name: 'mobile', max_width: 760, min_width: null, container_max_width: '100%', container_padding: '1.4rem', custom_css: '--section-pad: 5rem;' },
      { breakpoint_name: 'tablet', max_width: 1080, min_width: null, container_max_width: '100%', container_padding: '2rem', custom_css: null },
      { breakpoint_name: 'desktop', max_width: 1919, min_width: null, container_max_width: '1600px', container_padding: '3rem', custom_css: null },
      { breakpoint_name: 'large-desktop', max_width: null, min_width: 1920, container_max_width: '1840px', container_padding: '4rem', custom_css: null },
    ];

    for (const bp of breakpoints) {
      await connection.execute(
        'INSERT INTO theme_breakpoints (theme_id, breakpoint_name, max_width, min_width, container_max_width, container_padding, custom_css) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [themeId, bp.breakpoint_name, bp.max_width, bp.min_width, bp.container_max_width, bp.container_padding, bp.custom_css]
      );
    }

    // Seed animations from HTML
    const animations = [
      {
        animation_name: 'spin',
        css_class: 'eco-hub-ring',
        keyframes: 'to { transform: rotate(360deg); }',
        duration: '40s',
        timing_function: 'linear',
        delay: '0s',
        iteration_count: 'infinite',
        direction: 'normal',
        fill_mode: 'none',
        play_state: 'running',
        is_enabled: 1
      },
      {
        animation_name: 'dash',
        css_class: 'eco-flow',
        keyframes: 'to { stroke-dashoffset: -140; }',
        duration: '2.6s',
        timing_function: 'linear',
        delay: '0s',
        iteration_count: 'infinite',
        direction: 'normal',
        fill_mode: 'none',
        play_state: 'running',
        is_enabled: 1
      },
      {
        animation_name: 'nodepulse',
        css_class: 'eco-pulse',
        keyframes: '0%, 100% { opacity: 0.75; } 50% { opacity: 1; }',
        duration: '2.6s',
        timing_function: 'ease-in-out',
        delay: '0s',
        iteration_count: 'infinite',
        direction: 'normal',
        fill_mode: 'none',
        play_state: 'running',
        is_enabled: 1
      },
      {
        animation_name: 'fadein',
        css_class: 'fadein',
        keyframes: 'from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }',
        duration: '0.3s',
        timing_function: 'ease',
        delay: '0s',
        iteration_count: '1',
        direction: 'normal',
        fill_mode: 'none',
        play_state: 'running',
        is_enabled: 1
      },
      {
        animation_name: 'outlineTravel',
        css_class: 'outline-highlight',
        keyframes: 'to { stroke-dashoffset: -450; }',
        duration: '5.5s',
        timing_function: 'linear',
        delay: '0s',
        iteration_count: 'infinite',
        direction: 'normal',
        fill_mode: 'none',
        play_state: 'running',
        is_enabled: 1
      },
      {
        animation_name: 'fillProgress',
        css_class: 'fill',
        keyframes: 'from { width: 0; } to { width: 100%; }',
        duration: '6s',
        timing_function: 'linear',
        delay: '0s',
        iteration_count: '1',
        direction: 'normal',
        fill_mode: 'forwards',
        play_state: 'running',
        is_enabled: 1
      },
      {
        animation_name: 'marqueeLTR',
        css_class: 'partner-marquee',
        keyframes: 'from { transform: translateX(-50%); } to { transform: translateX(0%); }',
        duration: '34s',
        timing_function: 'linear',
        delay: '0s',
        iteration_count: 'infinite',
        direction: 'normal',
        fill_mode: 'none',
        play_state: 'running',
        is_enabled: 1
      },
      {
        animation_name: 'pulse',
        css_class: 'pulse',
        keyframes: '0% { box-shadow: 0 0 0 0 rgba(255,107,26,0.6); } 70% { box-shadow: 0 0 0 8px rgba(255,107,26,0); } 100% { box-shadow: 0 0 0 0 rgba(255,107,26,0); }',
        duration: '2s',
        timing_function: 'ease',
        delay: '0s',
        iteration_count: 'infinite',
        direction: 'normal',
        fill_mode: 'none',
        play_state: 'running',
        is_enabled: 1
      },
    ];

    for (const anim of animations) {
      await connection.execute(
        'INSERT INTO theme_animations (theme_id, animation_name, css_class, keyframes, duration, timing_function, delay, iteration_count, direction, fill_mode, play_state, is_enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [themeId, anim.animation_name, anim.css_class, anim.keyframes, anim.duration, anim.timing_function, anim.delay, anim.iteration_count, anim.direction, anim.fill_mode, anim.play_state, anim.is_enabled]
      );
    }

    // Seed component styles
    const components = [
      {
        component_type: 'button',
        component_name: 'Primary Button',
        css_class: 'btn-primary',
        styles: JSON.stringify({
          'background': 'var(--orange)',
          'color': 'var(--white)',
          'transition': 'all 0.25s ease'
        }),
        html_template: null,
        is_visible: 1
      },
      {
        component_type: 'button',
        component_name: 'Green Button',
        css_class: 'btn-green',
        styles: JSON.stringify({
          'background': 'var(--green)',
          'color': 'var(--white)',
          'transition': 'all 0.25s ease'
        }),
        html_template: null,
        is_visible: 1
      },
      {
        component_type: 'button',
        component_name: 'Ghost Button',
        css_class: 'btn-ghost',
        styles: JSON.stringify({
          'border': '1.5px solid rgba(255,255,255,0.3)',
          'color': 'var(--white)',
          'transition': 'all 0.25s ease'
        }),
        html_template: null,
        is_visible: 1
      },
      {
        component_type: 'card',
        component_name: 'Why Card',
        css_class: 'why-card',
        styles: JSON.stringify({
          'background': 'var(--white)',
          'padding': '2.6rem 2.2rem',
          'border-radius': '10px',
          'overflow': 'hidden'
        }),
        html_template: null,
        is_visible: 1
      },
      {
        component_type: 'section',
        component_name: 'Section Dark',
        css_class: 'section-dark',
        styles: JSON.stringify({
          'background': 'var(--navy-950)',
          'color': 'var(--white)'
        }),
        html_template: null,
        is_visible: 1
      },
      {
        component_type: 'section',
        component_name: 'Section Light',
        css_class: 'section-light',
        styles: JSON.stringify({
          'background': 'var(--white)'
        }),
        html_template: null,
        is_visible: 1
      },
      {
        component_type: 'section',
        component_name: 'Section Gray',
        css_class: 'section-gray',
        styles: JSON.stringify({
          'background': 'var(--gray-100)'
        }),
        html_template: null,
        is_visible: 1
      },
      {
        component_type: 'section',
        component_name: 'Section Ice Blue',
        css_class: 'section-iceblue',
        styles: JSON.stringify({
          'background': '#F0F8FC'
        }),
        html_template: null,
        is_visible: 1
      },
    ];

    for (const comp of components) {
      await connection.execute(
        'INSERT INTO theme_components (theme_id, component_type, component_name, css_class, styles, html_template, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [themeId, comp.component_type, comp.component_name, comp.css_class, comp.styles, comp.html_template, comp.is_visible]
      );
    }

    // Seed sections (all unique sections from HTML)
    const sections = [
      {
        section_id: 'home',
        section_name: 'Hero Slider Section',
        background_type: 'color',
        background_value: 'var(--primary)',
        background_overlay: null,
        padding_top: '9rem',
        padding_bottom: '9rem',
        text_color: 'var(--white)',
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'eco-section',
        section_name: 'Eco Section',
        background_type: 'color',
        background_value: 'var(--white)',
        background_overlay: null,
        padding_top: '6.75rem',
        padding_bottom: '6.75rem',
        text_color: null,
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'why',
        section_name: 'Why Section',
        background_type: 'color',
        background_value: 'var(--white)',
        background_overlay: null,
        padding_top: '6.75rem',
        padding_bottom: '6.75rem',
        text_color: null,
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'generate',
        section_name: 'Generate Section',
        background_type: 'color',
        background_value: '#F0F8FC',
        background_overlay: null,
        padding_top: '9rem',
        padding_bottom: '9rem',
        text_color: null,
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'protect',
        section_name: 'Protect Section',
        background_type: 'color',
        background_value: 'var(--white)',
        background_overlay: null,
        padding_top: '9rem',
        padding_bottom: '9rem',
        text_color: null,
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'maintain',
        section_name: 'Maintain Section',
        background_type: 'color',
        background_value: '#F0F8FC',
        background_overlay: null,
        padding_top: '9rem',
        padding_bottom: '9rem',
        text_color: null,
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'experts',
        section_name: 'Experts Section',
        background_type: 'color',
        background_value: 'var(--white)',
        background_overlay: null,
        padding_top: '9rem',
        padding_bottom: '9rem',
        text_color: null,
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'engineering-design',
        section_name: 'Engineering Design Section',
        background_type: 'color',
        background_value: '#F0F8FC',
        background_overlay: null,
        padding_top: '9rem',
        padding_bottom: '9rem',
        text_color: null,
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'legacy',
        section_name: 'Legacy Section',
        background_type: 'color',
        background_value: '#0D1421',
        background_overlay: null,
        padding_top: '9rem',
        padding_bottom: '9rem',
        text_color: 'var(--white)',
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'projects',
        section_name: 'Projects Section',
        background_type: 'color',
        background_value: 'var(--white)',
        background_overlay: null,
        padding_top: '9rem',
        padding_bottom: '9rem',
        text_color: null,
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'industries',
        section_name: 'Industries Section',
        background_type: 'color',
        background_value: '#F5F5F5',
        background_overlay: null,
        padding_top: '9rem',
        padding_bottom: '9rem',
        text_color: null,
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'testimonials',
        section_name: 'Testimonials Section',
        background_type: 'color',
        background_value: '#0D1421',
        background_overlay: null,
        padding_top: '9rem',
        padding_bottom: '9rem',
        text_color: 'var(--white)',
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'partners',
        section_name: 'Partners Section',
        background_type: 'color',
        background_value: 'var(--white)',
        background_overlay: null,
        padding_top: '6.75rem',
        padding_bottom: '6.75rem',
        text_color: null,
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'cert-teaser',
        section_name: 'Certification Teaser Section',
        background_type: 'color',
        background_value: 'var(--white)',
        background_overlay: null,
        padding_top: '6.75rem',
        padding_bottom: '6.75rem',
        text_color: null,
        is_visible: 1,
        custom_css: null
      },
      {
        section_id: 'contact',
        section_name: 'Contact CTA Section',
        background_type: 'color',
        background_value: 'var(--primary)',
        background_overlay: null,
        padding_top: '5rem',
        padding_bottom: '5rem',
        text_color: 'var(--white)',
        is_visible: 1,
        custom_css: null
      },
    ];

    for (const section of sections) {
      await connection.execute(
        'INSERT INTO theme_sections (theme_id, section_id, section_name, background_type, background_value, background_overlay, padding_top, padding_bottom, text_color, is_visible, custom_css) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [themeId, section.section_id, section.section_name, section.background_type, section.background_value, section.background_overlay, section.padding_top, section.padding_bottom, section.text_color, section.is_visible, section.custom_css]
      );
    }

    // Seed SVG icons (all unique icons from HTML)
    const svgIcons = [
      // Social Media Icons
      {
        icon_name: 'Facebook Icon',
        icon_class: 'sl-fb',
        svg_content: '<path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'currentColor',
        stroke_rule: 'none',
        stroke_width: 0,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Instagram Icon',
        icon_class: 'sl-ig',
        svg_content: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.8,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'LinkedIn Icon',
        icon_class: 'sl-li',
        svg_content: '<path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3 9h4v12H3zM9 9h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.94-1.79-2.94-1.8 0-2.08 1.4-2.08 2.85V21H9z"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'currentColor',
        stroke_rule: 'none',
        stroke_width: 0,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'X Twitter Icon',
        icon_class: 'sl-x',
        svg_content: '<path d="M18.24 3H21l-6.55 7.49L22 21h-6.19l-4.85-6.34L5.36 21H2.6l7.02-8.02L2 3h6.34l4.38 5.8L18.24 3zm-1.08 16.17h1.53L7.9 4.74H6.26l10.9 14.43z"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'currentColor',
        stroke_rule: 'none',
        stroke_width: 0,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'YouTube Icon',
        icon_class: 'sl-yt',
        svg_content: '<path d="M22.5 6.2a2.8 2.8 0 00-1.97-2C18.9 3.7 12 3.7 12 3.7s-6.9 0-8.53.5A2.8 2.8 0 001.5 6.2 29.3 29.3 0 001 12a29.3 29.3 0 00.5 5.8 2.8 2.8 0 001.97 2c1.63.5 8.53.5 8.53.5s6.9 0 8.53-.5a2.8 2.8 0 001.97-2A29.3 29.3 0 0023 12a29.3 29.3 0 00-.5-5.8zM9.8 15.5v-7l6 3.5z"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'currentColor',
        stroke_rule: 'none',
        stroke_width: 0,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'WhatsApp Icon',
        icon_class: 'float-wa',
        svg_content: '<path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3C8.6 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm5.2 14.3c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.7.8 2 1 .3.1.5.2.6.3.1.2.1.9-.1 1.5z"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'custom',
        stroke_rule: 'none',
        stroke_width: 0,
        custom_fill: 'white',
        custom_stroke: null
      },
      // Feature Icons
      {
        icon_name: 'Wrench Icon',
        icon_class: 'feat-icon',
        svg_content: '<path d="M14.7 6.3a4 4 0 01-5.6 5.6L4 17l3 3 5.1-5.1a4 4 0 015.6-5.6z" />',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Calendar Icon',
        icon_class: 'feat-icon',
        svg_content: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v3M16 2v3M8 19v3M16 19v3M2 8h3M2 16h3M19 8h3M19 16h3"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Clock Icon',
        icon_class: 'feat-icon',
        svg_content: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Lightning Icon',
        icon_class: 'feat-icon',
        svg_content: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Briefcase Icon',
        icon_class: 'feat-icon',
        svg_content: '<rect x="3" y="7" width="18" height="12" rx="1"/><path d="M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Dashboard Icon',
        icon_class: 'feat-icon',
        svg_content: '<path d="M3 3h18v18H3z"/><path d="M3 9h18M9 21V9"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Star Icon',
        icon_class: 'feat-icon',
        svg_content: '<path d="M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1z"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'File Icon',
        icon_class: 'feat-icon',
        svg_content: '<path d="M4 4h16v16H4z"/><path d="M8 4v16M4 9h4M4 15h4"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Check Icon',
        icon_class: 'feat-icon',
        svg_content: '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      // Industry Icons
      {
        icon_name: 'Server Icon',
        icon_class: 'ind-icon',
        svg_content: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M5 9.5h14M5 15h14"/><circle cx="8" cy="6" r="0.6" fill="currentColor" stroke="none"/><circle cx="8" cy="12" r="0.6" fill="currentColor" stroke="none"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Wifi Icon',
        icon_class: 'ind-icon',
        svg_content: '<circle cx="6" cy="18" r="1.4"/><circle cx="18" cy="18" r="1.4"/><path d="M3 8c5-4 13-4 18 0M6 12c3-2.4 9-2.4 12 0"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Cube Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M12 2l9 4.5v3L12 14 3 9.5v-3z"/><path d="M3 9.5V19l9 4 9-4V9.5"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Building Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M3 21h18M5 21V9l6-4 6 4v12M9 21v-6h6v6"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Location Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M22 3L11.5 13.5"/><path d="M22 3l-7 19-4.5-9L2 8z"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Sun Icon',
        icon_class: 'ind-icon',
        svg_content: '<circle cx="12" cy="7" r="3"/><path d="M12 1v2M12 11v2M6 7H4M20 7h-2M8 3l1.4 1.4M16 3l-1.4 1.4"/><rect x="5" y="14" width="14" height="7" rx="1"/><path d="M9 14v7M15 14v7"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Factory Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M3 21h18M5 21V9l6-4 6 4v12M9 21v-6h6v6"/><path d="M15 9h3v12"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'House Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M3 21h18M6 21V8l6-5 6 5v13"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Chart Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Globe Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M5 12a7 7 0 0114 0M2 12a10 10 0 0120 0"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'City Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M3 21h18"/><path d="M5 21V10l4-3v14"/><path d="M13 21V6l6-3v18"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Map Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Home Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M3 21V9l9-6 9 6v12H3z"/><path d="M9 21v-8h6v8"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Lightning Bolt Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Drop Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M12 2c3 4 6 7.5 6 11a6 6 0 01-12 0c0-3.5 3-7 6-11z"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Heart Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M12 21s-7-4.35-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6C19 16.65 12 21 12 21z"/><path d="M9 12h2l1-2 2 4 1-2h2"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Graduation Cap Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M6 10v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/><path d="M21 7.5V14"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'User Icon',
        icon_class: 'ind-icon',
        svg_content: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Phone Icon',
        icon_class: 'ind-icon',
        svg_content: '<rect x="6" y="2" width="12" height="20" rx="1"/><path d="M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/><path d="M10 22v-4h4v4"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Building Office Icon',
        icon_class: 'ind-icon',
        svg_content: '<rect x="4" y="8" width="16" height="13" rx="1"/><path d="M9 8V4h6v4"/><path d="M9 13h6M9 17h6"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Leaf Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M12 2C7 6 4 9.5 4 13.5A8 8 0 0020 13.5C20 9.5 17 6 12 2z"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
      {
        icon_name: 'Bank Icon',
        icon_class: 'ind-icon',
        svg_content: '<path d="M3 10l9-6 9 6"/><path d="M5 10v9M19 10v9M9 10v9M15 10v9"/><path d="M3 21h18"/>',
        viewBox: '0 0 24 24',
        fill_rule: 'none',
        stroke_rule: 'currentColor',
        stroke_width: 1.6,
        custom_fill: null,
        custom_stroke: null
      },
 ];

    for (const icon of svgIcons) {
      await connection.execute(
        'INSERT INTO theme_svg_icons (theme_id, icon_name, icon_class, svg_content, viewBox, fill_rule, stroke_rule, stroke_width, custom_fill, custom_stroke) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [themeId, icon.icon_name, icon.icon_class, icon.svg_content, icon.viewBox, icon.fill_rule, icon.stroke_rule, icon.stroke_width, icon.custom_fill, icon.custom_stroke]
      );
    }

    console.log('Enhanced theme seeding completed successfully!');
    console.log(`Seeded ${colors.length} colors`);
    console.log(`Seeded ${spacing.length} spacing settings`);
    console.log(`Seeded ${fonts.length} typography settings`);
    console.log(`Seeded ${breakpoints.length} breakpoints`);
    console.log(`Seeded ${animations.length} animations`);
    console.log(`Seeded ${components.length} components`);
    console.log(`Seeded ${sections.length} sections`);
    console.log(`Seeded ${svgIcons.length} SVG icons`);

  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedTheme().catch(console.error);
