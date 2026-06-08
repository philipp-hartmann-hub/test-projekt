/**
 * Systemweiter Katalog: Antragstypen, Gruppen, Verfügungsvorschläge (Admin-pflegbar, Sync über API).
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'gefaengnis_antrag_typen_katalog';
  const KATALOG_ID = 'global';

  function slugifyAntragTypId(s) {
    return String(s || '')
      .toLowerCase()
      .trim()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48);
  }

  function buildDefaultKatalog() {
    const mk = (id, label, gruppeId, kette, extra = {}) => ({
      id,
      label,
      gruppeId,
      aktiv: true,
      builtin: true,
      formularModus: 'builtin',
      sortOrder: extra.sortOrder ?? 0,
      verfuegungsvorschlag: {
        kette,
        ketteFreiesEigengeld: extra.ketteFreiesEigengeld || null,
        ketteMitVl: extra.ketteMitVl || null,
        vlHinweis: extra.vlHinweis || null,
        extraHinweise: extra.extraHinweise || []
      }
    });

    return {
      version: 1,
      id: KATALOG_ID,
      updatedAt: new Date().toISOString(),
      gruppen: [
        { id: 'finanzen-unterbringung', titel: 'Finanzen & Unterbringung', sortOrder: 0 },
        { id: 'arbeit', titel: 'Arbeit', sortOrder: 1 },
        { id: 'beratung-gesundheit', titel: 'Beratung, Gespräche & Gesundheit', sortOrder: 2 },
        { id: 'freizeit', titel: 'Freizeit & Weiterbildung', sortOrder: 3 },
        { id: 'besuche', titel: 'Besuche', sortOrder: 4 },
        { id: 'sonstiges', titel: 'Weitere Anträge', sortOrder: 5 }
      ],
      typen: [
        mk(
          'teilhabegeld',
          'Teilhabegeld',
          'finanzen-unterbringung',
          'AVD → Arbeitsabteilung → Zahlstelle (Lohndatenübernahme) → AVD (Eröffnung) → GPA',
          { sortOrder: 0 }
        ),
        mk('eigentum', 'Eigentum in der Kammer', 'finanzen-unterbringung', 'Station zur Vorprüfung → Zahlstelle → Kammer → GPA', {
          sortOrder: 1
        }),
        mk(
          'elektro-geraete',
          'Elektro-Geräte und sonstige Gegenstände',
          'finanzen-unterbringung',
          'Station zur Prüfung → Station zur Eröffnung → Zahlstelle zur Sperrung des genehmigten Betrags → Paketstelle zur Annahme → Revision → GPA',
          {
            sortOrder: 2,
            ketteFreiesEigengeld:
              'Station zur Prüfung → VAL zur Prüfung → Station zur Eröffnung → Zahlstelle zur Sperrung des genehmigten Betrags → Paketstelle zur Annahme → Revision → GPA'
          }
        ),
        mk(
          'laufzettel-mietgeraete',
          'Mietgeräte (Radio & Fernseher)',
          'finanzen-unterbringung',
          'VAL zur Genehmigung → Zahlstelle zur Notierung auf der Miet-TV/Radio-Liste → GPA',
          { sortOrder: 3 }
        ),
        mk(
          'kuendigung-tv-mietvertrag',
          'Kündigung des TV-Mietvertrags',
          'finanzen-unterbringung',
          'Zahlstelle → Revision zur Bestätigung, dass das Gerät abgegeben wurde → GPA',
          { sortOrder: 4 }
        ),
        mk(
          'telio-ueberweisung',
          'Antrag auf Überweisung auf das Telio-Konto',
          'finanzen-unterbringung',
          'VAL zur Prüfung → Station zur Eröffnung bei Ablehnung → Zahlstelle bei Genehmigung zur Überweisung → GPA',
          {
            sortOrder: 5,
            ketteMitVl:
              'VAL zur Prüfung → Zustimmung VL → Station zur Eröffnung bei Ablehnung → Zahlstelle bei Genehmigung zur Überweisung → GPA',
            vlHinweis:
              'Hinweis: Die Zustimmung der VL ist nur bei gebundenem Eigengeld und Überbrückungsgeld erforderlich (nicht bei Hausgeld oder freiem Eigengeld).'
          }
        ),
        mk(
          'einkauf-bestellung',
          'Einkauf & Bestellung',
          'finanzen-unterbringung',
          'Station zur Prüfung → VAL zur Prüfung → Zahlstelle zur Abwicklung → GPA',
          { sortOrder: 6 }
        ),
        mk(
          'freistellung-40-hmbstv',
          'Freistellung nach § 40 HmbStVollzG',
          'arbeit',
          'Arbeitsabteilung → Betrieb zur z. K. und zur Abfrage, ob Einwände bestehen → Station zur Kenntnis und Eröffnung → Arbeitsabteilung',
          { sortOrder: 0 }
        ),
        mk('beratung-unterstuetzung', 'Beratungs- und Unterstützungsleistungen', 'beratung-gesundheit', 'AVD → VAL → jeweiliger Ansprechpartner', {
          sortOrder: 0
        }),
        mk('gespraechstermin', 'Gesprächstermine', 'beratung-gesundheit', 'AVD → VAL (Vorklärung) → Gesprächspartner', { sortOrder: 1 }),
        mk('gesundheit-medizin', 'Gesundheit: Termin medizinischer Dienst', 'beratung-gesundheit', 'AVD → medizinischer Dienst', {
          sortOrder: 2
        }),
        mk(
          'telefonkonto-einrichtung',
          'Antrag zur Einrichtung eines Telefonkontos',
          'beratung-gesundheit',
          'Station zur Prüfung → VAL zur Entscheidung → Revision zur Beifügung des PIN-Briefes und Bestätigung der Einrichtung → Station zur Eröffnung → GPA',
          { sortOrder: 3 }
        ),
        mk('freizeit-weiterbildung', 'Freizeitaktivitäten inkl. Weiterbildungskosten', 'freizeit', 'AVD → Freizeitkoordination', {
          sortOrder: 0
        }),
        mk(
          'vollzugslockerung',
          'Antrag auf Vollzugslockerung',
          'freizeit',
          'Prüfung, ob Station Bedenken hat → VAL zur Prüfung der Checkliste in Sopart und Entscheidung → Bekanntgabe unter Nennung Ausgangsart inkl. Rechtsgrundlage und Bereitstellung finanzieller Mittel → Station zur Eröffnung → GPA',
          { sortOrder: 1 }
        ),
        mk('besuch-langzeit', 'Langzeitbesuch (Genehmigung)', 'besuche', 'AVD → VAL → Langzeitbesuchszentrum → VAL → VZG', { sortOrder: 0 }),
        mk('besuch-termin', 'Besuchstermin', 'besuche', 'AVD → Besuchskoordination → Station → GPA', { sortOrder: 1 }),
        mk(
          'besuch-video',
          'Videobesuch',
          'besuche',
          'AVD → Revision (Eintragung des Termins) → Station (Eröffnung) → Revision (Bestätigung Vollzugsplanung und Vollzug)',
          { sortOrder: 2 }
        )
      ]
    };
  }

  class AntragTypenKatalogSystem {
    constructor() {
      this.katalog = this.load();
    }

    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.typen) && parsed.typen.length) {
            return this._normalizeKatalog(parsed);
          }
        }
      } catch (_) {
        /* ignore */
      }
      const def = buildDefaultKatalog();
      this.katalog = def;
      this.save();
      return def;
    }

    save() {
      this.katalog.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.katalog));
    }

    applyKatalog(katalog) {
      if (!katalog || !Array.isArray(katalog.typen)) return;
      const labelsBefore = JSON.stringify(
        (katalog.typen || []).map((t) => ({ id: t.id, label: t.label }))
      );
      this.katalog = this._normalizeKatalog(katalog);
      const labelsAfter = JSON.stringify(
        (this.katalog.typen || []).map((t) => ({ id: t.id, label: t.label }))
      );
      this.save();
      window.dispatchEvent(new CustomEvent('antragTypenKatalogUpdated'));
      if (
        labelsBefore !== labelsAfter &&
        window.DataSync &&
        typeof window.DataSync.syncAntragTypenKatalogToServer === 'function'
      ) {
        window.DataSync.syncAntragTypenKatalogToServer().catch(() => {});
      }
    }

    _normalizeKatalog(katalog) {
      const def = buildDefaultKatalog();
      const defTypById = new Map(def.typen.map((t) => [t.id, t]));
      const gruppen =
        Array.isArray(katalog.gruppen) && katalog.gruppen.length ? katalog.gruppen : def.gruppen;
      const typen = Array.isArray(katalog.typen) ? katalog.typen : def.typen;
      return {
        version: katalog.version || 1,
        id: KATALOG_ID,
        updatedAt: katalog.updatedAt || new Date().toISOString(),
        gruppen: gruppen.map((g, i) => ({
          id: g.id,
          titel: g.titel || g.id,
          sortOrder: g.sortOrder != null ? g.sortOrder : i
        })),
        typen: typen.map((t, i) => {
          const defTyp = defTypById.get(t.id);
          const builtin = t.builtin === true || !!(defTyp && defTyp.builtin);
          const label = builtin && defTyp ? defTyp.label : (t.label || t.id);
          return {
          id: t.id,
          label,
          gruppeId: t.gruppeId || defTyp?.gruppeId || 'sonstiges',
          aktiv: t.aktiv !== false,
          builtin,
          formularModus: t.formularModus === 'freitext' ? 'freitext' : 'builtin',
          sortOrder: t.sortOrder != null ? t.sortOrder : i,
          verfuegungsvorschlag: {
            kette: t.verfuegungsvorschlag?.kette || defTyp?.verfuegungsvorschlag?.kette || '',
            ketteFreiesEigengeld: t.verfuegungsvorschlag?.ketteFreiesEigengeld || defTyp?.verfuegungsvorschlag?.ketteFreiesEigengeld || null,
            ketteMitVl: t.verfuegungsvorschlag?.ketteMitVl || defTyp?.verfuegungsvorschlag?.ketteMitVl || null,
            vlHinweis: t.verfuegungsvorschlag?.vlHinweis || defTyp?.verfuegungsvorschlag?.vlHinweis || null,
            extraHinweise: Array.isArray(t.verfuegungsvorschlag?.extraHinweise)
              ? t.verfuegungsvorschlag.extraHinweise
              : []
          }
        };
        })
      };
    }

    getGruppenFuerUi() {
      const gruppen = [...(this.katalog.gruppen || [])].sort((a, b) => a.sortOrder - b.sortOrder);
      const typen = (this.katalog.typen || []).filter((t) => t.aktiv !== false);
      return gruppen
        .map((g) => ({
          id: g.id,
          titel: g.titel,
          typen: typen
            .filter((t) => t.gruppeId === g.id)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((t) => t.id)
        }))
        .filter((g) => g.typen.length > 0);
    }

    getTyp(typeId) {
      return (this.katalog.typen || []).find((t) => t.id === typeId) || null;
    }

    getTypLabel(typeId) {
      const t = this.getTyp(typeId);
      return t ? t.label : null;
    }

    isFreitextTyp(typeId) {
      const t = this.getTyp(typeId);
      return t ? t.formularModus === 'freitext' : false;
    }

    getAktiveTypIds() {
      return (this.katalog.typen || []).filter((t) => t.aktiv !== false).map((t) => t.id);
    }

    updateTyp(typeId, patch) {
      const t = this.getTyp(typeId);
      if (!t) return null;
      if (patch.label != null) t.label = String(patch.label).trim();
      if (patch.gruppeId != null) t.gruppeId = patch.gruppeId;
      if (patch.aktiv != null) t.aktiv = !!patch.aktiv;
      if (patch.verfuegungsvorschlag) {
        const vv = t.verfuegungsvorschlag || {};
        if (patch.verfuegungsvorschlag.kette != null) vv.kette = patch.verfuegungsvorschlag.kette;
        if (patch.verfuegungsvorschlag.ketteFreiesEigengeld != null) {
          vv.ketteFreiesEigengeld = patch.verfuegungsvorschlag.ketteFreiesEigengeld || null;
        }
        if (patch.verfuegungsvorschlag.ketteMitVl != null) {
          vv.ketteMitVl = patch.verfuegungsvorschlag.ketteMitVl || null;
        }
        if (patch.verfuegungsvorschlag.vlHinweis != null) {
          vv.vlHinweis = patch.verfuegungsvorschlag.vlHinweis || null;
        }
        if (patch.verfuegungsvorschlag.extraHinweise != null) {
          vv.extraHinweise = patch.verfuegungsvorschlag.extraHinweise;
        }
        t.verfuegungsvorschlag = vv;
      }
      this.save();
      return t;
    }

    addTyp(data) {
      const id = slugifyAntragTypId(data.id || data.label);
      if (!id) return { error: 'Ungültige technische ID.' };
      if (this.getTyp(id)) return { error: 'Diese technische ID existiert bereits.' };
      const gruppeId = data.gruppeId || 'sonstiges';
      if (!(this.katalog.gruppen || []).some((g) => g.id === gruppeId)) {
        return { error: 'Unbekannte Themengruppe.' };
      }
      const maxSort = Math.max(
        0,
        ...(this.katalog.typen || []).filter((t) => t.gruppeId === gruppeId).map((t) => t.sortOrder)
      );
      const typ = {
        id,
        label: String(data.label || id).trim(),
        gruppeId,
        aktiv: true,
        builtin: false,
        formularModus: 'freitext',
        sortOrder: maxSort + 1,
        verfuegungsvorschlag: {
          kette: String(data.kette || '').trim(),
          ketteFreiesEigengeld: null,
          ketteMitVl: null,
          vlHinweis: null,
          extraHinweise: []
        }
      };
      this.katalog.typen.push(typ);
      this.save();
      return { typ };
    }

    deleteTyp(typeId) {
      const t = this.getTyp(typeId);
      if (!t) return false;
      if (t.builtin) return false;
      this.katalog.typen = this.katalog.typen.filter((x) => x.id !== typeId);
      this.save();
      return true;
    }

    resolveVerfuegungsKette(typ, antrag) {
      if (!typ) return null;
      const vv = typ.verfuegungsvorschlag || {};
      let kette = vv.kette || '';
      const extra = [...(vv.extraHinweise || [])];
      if (typ.id === 'telio-ueberweisung' && antrag) {
        const brauchtVL =
          antrag.ueberweisungsquelle === 'gebundenes-eigengeld' ||
          antrag.ueberweisungsquelle === 'ueberbrueckungsgeld';
        if (brauchtVL && vv.ketteMitVl) kette = vv.ketteMitVl;
        if (vv.vlHinweis) extra.unshift(vv.vlHinweis);
      } else if (typ.id === 'elektro-geraete' && antrag) {
        if (antrag.bezahlung === 'freies-eigengeld' && vv.ketteFreiesEigengeld) {
          kette = vv.ketteFreiesEigengeld;
        }
      }
      if (!kette) return null;
      return { kette, extraHinweise: extra };
    }
  }

  const antragTypenKatalogSystem = new AntragTypenKatalogSystem();

  function getAntragTypeGruppen() {
    return antragTypenKatalogSystem.getGruppenFuerUi();
  }

  function getVerfuegungsvorschlagMetaForAntrag(antrag, lang) {
    if (!antrag || !antrag.type) return null;
    const language = lang || (typeof currentLanguage !== 'undefined' ? currentLanguage : 'de');
    const titel =
      language === 'en'
        ? 'Suggested procedure sequence (reference Ist process)'
        : language === 'fr'
          ? 'Suggestion de séquence (processus cible)'
          : 'Verfügungsvorschlag';
    const standardHinweis =
      language === 'en'
        ? 'This is a suggestion only; it does not replace a professional decision.'
        : language === 'fr'
          ? "Il s'agit d'une suggestion ; elle ne remplace pas une décision professionnelle."
          : 'Es handelt sich um einen Vorschlag; er ersetzt keine fachliche Entscheidung.';

    const typ = antragTypenKatalogSystem.getTyp(antrag.type);
    const resolved = antragTypenKatalogSystem.resolveVerfuegungsKette(typ, antrag);
    if (!resolved || !resolved.kette) return null;
    return {
      titel,
      kette: resolved.kette,
      hinweise: [standardHinweis, ...resolved.extraHinweise.filter(Boolean)]
    };
  }

  function getVerfuegungsvorschlagBoxHtmlForAntrag(antrag, lang) {
    const meta = getVerfuegungsvorschlagMetaForAntrag(antrag, lang);
    if (!meta) return '';
    const hinweiseHtml = meta.hinweise.map((h) => `<p class="verfuegungs-hinweis">${h}</p>`).join('');
    return `
      <div class="detail-box verfuegungsvorschlag-box modal-verfuegungsvorschlag-box">
        <h4>${meta.titel}</h4>
        <p class="verfuegungsreihenfolge">${meta.kette}</p>
        ${hinweiseHtml}
      </div>
    `;
  }

  window.antragTypenKatalogSystem = antragTypenKatalogSystem;
  window.getAntragTypeGruppen = getAntragTypeGruppen;
  window.getVerfuegungsvorschlagMetaForAntrag = getVerfuegungsvorschlagMetaForAntrag;
  window.getVerfuegungsvorschlagBoxHtmlForAntrag = getVerfuegungsvorschlagBoxHtmlForAntrag;
  window.slugifyAntragTypId = slugifyAntragTypId;
  window.buildDefaultAntragTypenKatalog = buildDefaultKatalog;
})();
