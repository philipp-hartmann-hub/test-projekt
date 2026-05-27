/**
 * Lädt die Antragsarten-Auswahl in Insassen-Modals (unabhängig vom großen Portal-Skript).
 */
(function () {
  'use strict';

  function mountPicker(containerId, inputName, selectedValue, handlerName) {
    const el = document.getElementById(containerId);
    if (!el) return false;
    const render = window.renderAntragTypePickerHtml;
    if (typeof render !== 'function') {
      console.error('[insassen-picker-boot] renderAntragTypePickerHtml fehlt – HTML-Fallback bleibt aktiv');
      return el.querySelector('input[type="radio"]') != null;
    }
    try {
      const pickValue =
        selectedValue === '' || selectedValue === null || selectedValue === undefined
          ? ''
          : (selectedValue || 'teilhabegeld');
      const html = render(inputName, pickValue, handlerName);
      if (!html || !String(html).trim()) {
        console.error('[insassen-picker-boot] leeres Picker-HTML für', containerId);
        return el.querySelector('input[type="radio"]') != null;
      }
      el.innerHTML = html;
      const init = window.initAntragTypePickerAccordion;
      if (typeof init === 'function') {
        init(containerId, inputName, handlerName);
      }
      return true;
    } catch (err) {
      console.error('[insassen-picker-boot]', containerId, err);
      return false;
    }
  }

  function refreshInsassenAntragPickers() {
    const okNew = mountPicker('newAntragTypePicker', 'antragType', '', 'toggleAntragFields');
    const okEntwurf = mountPicker('entwurfAntragTypePicker', 'entwurfType', '', 'toggleEntwurfFields');
    if (typeof window.setNewAntragWizardStep === 'function') {
      window.setNewAntragWizardStep('type');
    }
    return okNew && okEntwurf;
  }

  window.refreshInsassenAntragPickers = refreshInsassenAntragPickers;

  function boot() {
    refreshInsassenAntragPickers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
