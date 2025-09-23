/* anti-inspect.js
   Cosmetic deterrent only. DOES NOT prevent determined inspection.
   Use responsibly — may break some browser shortcuts / accessibility.
*/
(function () {
  'use strict';

  // Handler references so we can remove them later if needed
  function onContextMenu(e) {
    try { e.preventDefault(); } catch (err) {}
    return false;
  }

  function onKeyDown(e) {
    try {
      // Normalize key value for cross-browser
      const k = e.key || String.fromCharCode(e.keyCode || 0);

      // Block common devtools / view-source / save shortcuts:
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (k === 'I' || k === 'i' || k === 'J' || k === 'j')) ||
        (e.ctrlKey && (k === 'U' || k === 'u' || k === 'S' || k === 's'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    } catch (err) {
      // swallow errors so we don't break page scripts
      return true;
    }
  }

  // Attach handlers in capture phase to catch early
  function attach() {
    window.addEventListener('contextmenu', onContextMenu, { capture: true, passive: false });
    window.addEventListener('keydown', onKeyDown, { capture: true, passive: false });
  }

  function detach() {
    window.removeEventListener('contextmenu', onContextMenu, { capture: true });
    window.removeEventListener('keydown', onKeyDown, { capture: true });
  }

  // Auto-attach on load
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }

  // Expose a safe toggle API so your app can disable/enable the deterrent if needed
  window.__AntiInspect = window.__AntiInspect || {
    enable: attach,
    disable: detach,
    isEnabled: true
  };

})();
