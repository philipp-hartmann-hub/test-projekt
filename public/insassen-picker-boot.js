/**
 * Lädt die Antragsarten-Auswahl in Insassen-Modals (unabhängig vom großen Portal-Skript).
 */
(function () {
  'use strict';

  const INSASSEN_PICKER_EXCLUDE = ['einkauf-bestellung'];

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
      const exclude = inputName === 'antragType' ? INSASSEN_PICKER_EXCLUDE : [];
      const html = render(inputName, pickValue, handlerName, exclude);
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

  function isAntragFormModalOpen() {
    return ['newAntragModal', 'entwurfModal'].some((id) => {
      const el = document.getElementById(id);
      return el && el.classList.contains('active');
    });
  }

  function refreshInsassenAntragPickers() {
    if (isAntragFormModalOpen()) {
      const modal = document.getElementById('newAntragModal');
      const onForm =
        modal &&
        modal.classList.contains('active') &&
        typeof window.isNewAntragFormStepActive === 'function' &&
        window.isNewAntragFormStepActive();
      if (onForm && modal.dataset.wizardType) {
        mountPicker('newAntragTypePicker', 'antragType', modal.dataset.wizardType, 'toggleAntragFields');
        if (typeof window.toggleAntragFields === 'function') {
          window.toggleAntragFields(modal.dataset.wizardType);
        }
      }
      return true;
    }
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

  window.addEventListener('antragTypenKatalogUpdated', refreshInsassenAntragPickers);
  window.addEventListener('dataSyncLoaded', refreshInsassenAntragPickers);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
