/**
 * Theme Initialization Script (FOUC Prevention)
 * 
 * This script MUST be inlined in <head> before any stylesheets load.
 * It reads the user's stored preference or system setting and applies
 * the correct data-theme attribute immediately to prevent flash.
 * 
 * Usage in index.html:
 * <script>
 *   // Paste minified version of this script
 * </script>
 */
(function() {
  'use strict';
  var STORAGE_KEY = 'kb-design-system-theme';
  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch(e) {}
  var theme = stored === 'dark' ? 'dark' : stored === 'light' ? 'light' : null;
  if (!theme) {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.add(theme === 'dark' ? 'night-mode' : 'day-mode');
})();
