# User Stories und Akzeptanzkriterien
## JVA Antragsbearbeitungssystem

**Version:** 1.0  
**Erstellt:** Februar 2026  
**Zweck:** Dokumentation für Nachbau der Anwendung

---

## Inhaltsverzeichnis

1. [Insassen-Portal](#insassen-portal)
2. [Mitarbeiter-Portal](#mitarbeiter-portal)
3. [Admin-Portal](#admin-portal)
4. [Technische Anforderungen](#technische-anforderungen)
5. [Sicherheit und Synchronisation](#sicherheit-und-synchronisation)

---

# Insassen-Portal

## US-INS-001: Als Insasse möchte ich mich anmelden können, damit ich auf mein Portal zugreifen kann

**Priorität:** Hoch  
**Story Points:** 2

### Akzeptanzkriterien:

**AC-INS-001-1:** Der Insasse kann sich mit Benutzername und Passwort anmelden  
**AC-INS-001-2:** Bei erfolgreicher Anmeldung wird das Insassen-Portal angezeigt  
**AC-INS-001-3:** Bei fehlerhafter Anmeldung wird eine Fehlermeldung angezeigt  
**AC-INS-001-4:** Die Anmeldung funktioniert sowohl lokal (localStorage) als auch über Server-API  
**AC-INS-001-5:** Nach Anmeldung wird der Name des Insassen angezeigt ("Moin, [Name]!")

---

## US-INS-002: Als Insasse möchte ich einen Teilhabegeld-Antrag stellen können, damit ich finanzielle Unterstützung beantragen kann

**Priorität:** Hoch  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-INS-002-1:** Der Insasse kann einen neuen Antrag erstellen  
**AC-INS-002-2:** Der Insasse kann den Antragstyp "Teilhabegeld" auswählen  
**AC-INS-002-3:** Der Insasse muss einen Monat/Jahr auswählen (Pflichtfeld)  
**AC-INS-002-4:** Es kann nur ein Teilhabegeld-Antrag pro Monat erstellt werden  
**AC-INS-002-5:** Bei Versuch, einen zweiten Antrag für denselben Monat zu erstellen, wird eine Fehlermeldung angezeigt  
**AC-INS-002-6:** Der Antrag kann als Entwurf gespeichert werden  
**AC-INS-002-7:** Der Antrag kann direkt eingereicht werden  
**AC-INS-002-8:** Nach Einreichung wird der Antrag in der Liste "Meine Anträge" angezeigt  
**AC-INS-002-9:** Der Antrag erhält eine eindeutige Antragsnummer  
**AC-INS-002-10:** Der Antrag wird automatisch mit Insassen-Daten (Name, JVA, Station) versehen

---

## US-INS-003: Als Insasse möchte ich einen Eigentum-Antrag stellen können, damit ich Kleidung aus der Kammer beantragen kann

**Priorität:** Hoch  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-INS-003-1:** Der Insasse kann den Antragstyp "Eigentum aus der Kammer" auswählen  
**AC-INS-003-2:** Der Insasse kann zwischen "Kleidung aufstocken" und "Kleidung tauschen" wählen  
**AC-INS-003-3:** Der Insasse kann mehrere Kleidungsstücke aus einer Liste auswählen  
**AC-INS-003-4:** Der Insasse muss eine Begründung eingeben (Pflichtfeld)  
**AC-INS-003-5:** Der Antrag kann als Entwurf gespeichert werden  
**AC-INS-003-6:** Der Antrag kann direkt eingereicht werden  
**AC-INS-003-7:** Nach Einreichung wird der Antrag in der Liste "Meine Anträge" angezeigt

---

## US-INS-004: Als Insasse möchte ich meine Anträge einsehen können, damit ich den Bearbeitungsstatus verfolgen kann

**Priorität:** Hoch  
**Story Points:** 3

### Akzeptanzkriterien:

**AC-INS-004-1:** Der Insasse sieht alle seine Anträge in einer Liste  
**AC-INS-004-2:** Anträge werden nach Status gruppiert (Offen, In Bearbeitung, Erledigt)  
**AC-INS-004-3:** Jeder Antrag zeigt Antragsnummer, Typ, Status und Datum  
**AC-INS-004-4:** Der Insasse kann auf einen Antrag klicken, um Details zu sehen  
**AC-INS-004-5:** Entwürfe werden separat angezeigt  
**AC-INS-004-6:** Der Status wird in der Sprache des Insassen angezeigt

---

## US-INS-005: Als Insasse möchte ich Benachrichtigungen erhalten, damit ich über Entscheidungen informiert werde

**Priorität:** Hoch  
**Story Points:** 3

### Akzeptanzkriterien:

**AC-INS-005-1:** Der Insasse erhält eine Benachrichtigung, wenn eine Entscheidung getroffen wurde  
**AC-INS-005-2:** Benachrichtigungen werden im Postfach angezeigt  
**AC-INS-005-3:** Eine Badge zeigt die Anzahl ungelesener Benachrichtigungen  
**AC-INS-005-4:** Benachrichtigungen enthalten Titel, Nachricht und Datum  
**AC-INS-005-5:** Benachrichtigungen können als gelesen markiert werden  
**AC-INS-005-6:** Bei persönlicher Eröffnung oder Vollzug vor Bekanntgabe erhält der Insasse die Benachrichtigung erst nach Bestätigung

---

## US-INS-006: Als Insasse möchte ich Aufgaben bearbeiten können, damit ich auf Anfragen antworten kann

**Priorität:** Mittel  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-INS-006-1:** Der Insasse sieht zugewiesene Aufgaben in seinem Postfach  
**AC-INS-006-2:** Der Insasse kann eine Aufgabe öffnen und Details einsehen  
**AC-INS-006-3:** Der Insasse kann zwischen "Zur Kenntnis" und "Mit Antwort" wählen  
**AC-INS-006-4:** Bei "Mit Antwort" muss der Insasse einen Text eingeben (Pflichtfeld)  
**AC-INS-006-5:** Der Insasse kann PDF-Dokumente als Antwort anhängen  
**AC-INS-006-6:** Nach Abschluss wird die Aufgabe als erledigt markiert  
**AC-INS-006-7:** Der Aufgabensteller wird über die Erledigung informiert

---

## US-INS-007: Als Insasse möchte ich freigegebene Dokumente einsehen können, damit ich Bescheide und andere Dokumente abrufen kann

**Priorität:** Mittel  
**Story Points:** 3

### Akzeptanzkriterien:

**AC-INS-007-1:** Der Insasse sieht freigegebene Dokumente in der Antragsdetailansicht  
**AC-INS-007-2:** Der Insasse kann Dokumente herunterladen  
**AC-INS-007-3:** Nicht freigegebene Dokumente sind für den Insassen nicht sichtbar  
**AC-INS-007-4:** Bei nachträglicher Freigabe erhält der Insasse eine Benachrichtigung

---

## US-INS-008: Als Insasse möchte ich die Sprache wechseln können, damit ich die Anwendung in meiner bevorzugten Sprache nutzen kann

**Priorität:** Niedrig  
**Story Points:** 2

### Akzeptanzkriterien:

**AC-INS-008-1:** Der Insasse kann zwischen Deutsch, Englisch und Französisch wählen  
**AC-INS-008-2:** Die gesamte UI wird in der gewählten Sprache angezeigt  
**AC-INS-008-3:** Die Spracheinstellung wird gespeichert und beim nächsten Login verwendet

---

# Mitarbeiter-Portal

## US-MIT-001: Als Mitarbeiter möchte ich mich anmelden können, damit ich auf mein Portal zugreifen kann

**Priorität:** Hoch  
**Story Points:** 2

### Akzeptanzkriterien:

**AC-MIT-001-1:** Der Mitarbeiter kann sich mit Benutzername und Passwort anmelden  
**AC-MIT-001-2:** Bei erfolgreicher Anmeldung wird das Mitarbeiter-Portal angezeigt  
**AC-MIT-001-3:** Der Mitarbeiter wird mit seinem Namen begrüßt ("Moin, [Name]!")  
**AC-MIT-001-4:** Die Anmeldung funktioniert sowohl lokal als auch über Server-API

---

## US-MIT-002: Als AVD-Mitarbeiter möchte ich Anträge meiner Station sehen können, damit ich diese bearbeiten kann

**Priorität:** Hoch  
**Story Points:** 3

### Akzeptanzkriterien:

**AC-MIT-002-1:** Der AVD-Mitarbeiter sieht Anträge seiner Station in "Anträge und Aufgaben meiner Gruppe"  
**AC-MIT-002-2:** Offene Anträge werden angezeigt  
**AC-MIT-002-3:** Anträge mit Gruppenaufgaben werden angezeigt  
**AC-MIT-002-4:** Anträge mit wartender Hauptbearbeitungsübergabe werden angezeigt  
**AC-MIT-002-5:** Bereits zugewiesene Anträge anderer Bearbeiter werden nicht angezeigt (außer bei Gruppenaufgaben)

---

## US-MIT-003: Als VAL möchte ich alle Anträge meines Hauses sehen können, damit ich einen Überblick habe

**Priorität:** Hoch  
**Story Points:** 3

### Akzeptanzkriterien:

**AC-MIT-003-1:** Die VAL sieht alle Anträge ihres Hauses in "Anträge und Aufgaben meiner Gruppe"  
**AC-MIT-003-2:** Dies umfasst auch Anträge, die bereits einem anderen Bearbeiter zugewiesen sind  
**AC-MIT-003-3:** Veraktete Anträge werden nicht angezeigt  
**AC-MIT-003-4:** Anträge, die der VAL selbst bearbeitet, werden nicht in dieser Liste angezeigt

---

## US-MIT-004: Als Mitarbeiter möchte ich einen Antrag übernehmen können, damit ich ihn bearbeiten kann

**Priorität:** Hoch  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-MIT-004-1:** Der Mitarbeiter kann einen offenen Antrag übernehmen  
**AC-MIT-004-2:** Nach Übernahme wird der Antrag in "Meine Anträge und Aufgaben" verschoben  
**AC-MIT-004-3:** Der Antrag wird dem Mitarbeiter als Bearbeiter zugewiesen  
**AC-MIT-004-4:** Der Status ändert sich von "offen" zu "in-bearbeitung"  
**AC-MIT-004-5:** Wenn der Antrag bereits einem anderen Bearbeiter zugewiesen wurde, wird eine Fehlermeldung angezeigt  
**AC-MIT-004-6:** Die Übernahme wird im Bearbeitungsverlauf protokolliert  
**AC-MIT-004-7:** Bei paralleler Bearbeitung gewinnt der erste Bearbeiter

---

## US-MIT-005: Als Mitarbeiter möchte ich einen Antrag sachlich/fachlich prüfen können, damit ich die Entscheidungsgrundlage schaffe

**Priorität:** Hoch  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-MIT-005-1:** Der Mitarbeiter kann einen Antrag als geprüft markieren  
**AC-MIT-005-2:** Ein Prüfungskommentar ist Pflicht  
**AC-MIT-005-3:** Nach Prüfung wird der Antrag in die Phase "Entscheiden" überführt  
**AC-MIT-005-4:** Die Prüfung wird im Bearbeitungsverlauf protokolliert  
**AC-MIT-005-5:** Nur der aktuelle Bearbeiter kann prüfen  
**AC-MIT-005-6:** Wenn der Mitarbeiter nicht mehr Bearbeiter ist, wird eine Fehlermeldung angezeigt

---

## US-MIT-006: Als Mitarbeiter möchte ich eine Entscheidung treffen können, damit der Antrag weiterbearbeitet werden kann

**Priorität:** Hoch  
**Story Points:** 8

### Akzeptanzkriterien:

**AC-MIT-006-1:** Der Mitarbeiter kann zwischen "Genehmigen", "Teilweise genehmigen" und "Ablehnen" wählen  
**AC-MIT-006-2:** Eine Begründung ist Pflicht  
**AC-MIT-006-3:** Der Mitarbeiter kann "Persönliche Eröffnung" wählen  
**AC-MIT-006-4:** Der Mitarbeiter kann "Vollzug vor Bekanntgabe planen" wählen  
**AC-MIT-006-5:** Ein Bescheid-PDF wird automatisch erstellt  
**AC-MIT-006-6:** Nach Entscheidung wird der Antrag in die Phase "Bekanntgabe" überführt  
**AC-MIT-006-7:** Bei automatischer Bekanntgabe erhält der Insasse sofort eine Benachrichtigung  
**AC-MIT-006-8:** Bei persönlicher Eröffnung oder Vollzug vor Bekanntgabe wartet der Antrag auf Bestätigung  
**AC-MIT-006-9:** Nur der aktuelle Bearbeiter kann entscheiden  
**AC-MIT-006-10:** Wenn der Mitarbeiter nicht mehr Bearbeiter ist, wird eine Fehlermeldung angezeigt

---

## US-MIT-007: Als Mitarbeiter möchte ich Aufgaben erstellen können, damit ich Arbeit delegieren kann

**Priorität:** Hoch  
**Story Points:** 8

### Akzeptanzkriterien:

**AC-MIT-007-1:** Der Mitarbeiter kann eine Aufgabe erstellen  
**AC-MIT-007-2:** Der Mitarbeiter kann zwischen "Einzelperson" und "Gruppe" wählen  
**AC-MIT-007-3:** Bei Gruppenauswahl werden nur relevante Gruppen angezeigt (Haus, Station, Spezialgruppen)  
**AC-MIT-007-4:** Der Mitarbeiter kann eine Kurzbeschreibung eingeben (Pflicht)  
**AC-MIT-007-5:** Der Mitarbeiter kann eine ausführliche Beschreibung eingeben (optional)  
**AC-MIT-007-6:** Der Mitarbeiter kann eine Frist setzen (optional)  
**AC-MIT-007-7:** Bei Frist wird automatisch ein Kalendereintrag erstellt  
**AC-MIT-007-8:** Der Mitarbeiter kann PDF-Dokumente anhängen (mehrere möglich)  
**AC-MIT-007-9:** Der Mitarbeiter kann zwischen "Zur Kenntnis" und "Mit Antwort" wählen  
**AC-MIT-007-10:** Bei Gruppenaufgaben kann der Mitarbeiter wählen, ob die Hauptbearbeitung übertragen werden soll  
**AC-MIT-007-11:** Die Aufgabe erscheint im Postfach des Empfängers  
**AC-MIT-007-12:** Die Aufgabe erscheint in "Meine Anträge und Aufgaben" des Empfängers

---

## US-MIT-008: Als Mitarbeiter möchte ich Aufgaben bearbeiten können, damit ich auf Anfragen antworten kann

**Priorität:** Hoch  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-MIT-008-1:** Der Mitarbeiter sieht zugewiesene Aufgaben in seinem Postfach  
**AC-MIT-008-2:** Der Mitarbeiter kann eine Aufgabe öffnen und Details einsehen  
**AC-MIT-008-3:** Der Mitarbeiter kann zwischen "Zur Kenntnis" und "Mit Antwort" wählen  
**AC-MIT-008-4:** Bei "Mit Antwort" kann der Mitarbeiter Schnellantwort-Buttons verwenden ("Ja", "Nein", "Ist vollständig", "Kann entschieden werden")  
**AC-MIT-008-5:** Der Mitarbeiter kann PDF-Dokumente als Antwort anhängen  
**AC-MIT-008-6:** Bei Gruppenaufgaben kann der Mitarbeiter die Hauptbearbeitung übernehmen  
**AC-MIT-008-7:** Nach Abschluss wird die Aufgabe als erledigt markiert  
**AC-MIT-008-8:** Der Aufgabensteller wird über die Erledigung informiert

---

## US-MIT-009: Als Mitarbeiter möchte ich Dokumente hochladen können, damit ich relevante Unterlagen bereitstellen kann

**Priorität:** Mittel  
**Story Points:** 3

### Akzeptanzkriterien:

**AC-MIT-009-1:** Der Mitarbeiter kann PDF-Dokumente hochladen (mehrere möglich)  
**AC-MIT-009-2:** Dokumente werden in der Antragsdetailansicht angezeigt  
**AC-MIT-009-3:** Der Mitarbeiter kann Dokumente für Insassen freigeben  
**AC-MIT-009-4:** Bei nachträglicher Freigabe wird der Insasse benachrichtigt  
**AC-MIT-009-5:** Nur PDF-Dateien werden akzeptiert

---

## US-MIT-010: Als Mitarbeiter möchte ich Notizen hinzufügen können, damit ich Informationen festhalten kann

**Priorität:** Mittel  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-MIT-010-1:** Der Mitarbeiter kann Notizen hinzufügen  
**AC-MIT-010-2:** Der Mitarbeiter muss zwischen drei Typen wählen:
   - "Notiz für mich" (nur für Ersteller sichtbar)
   - "Notiz für alle" (für alle Mitarbeiter sichtbar, im Verlauf)
   - "Notiz für Akte" (für alle Mitarbeiter sichtbar, im Verlauf und PDF)  
**AC-MIT-010-3:** Private Notizen sind mit grauem Badge "Privat" markiert  
**AC-MIT-010-4:** Akte-Notizen sind mit blauem Badge "Für Akte" markiert  
**AC-MIT-010-5:** Notizen werden im Bearbeitungsverlauf angezeigt (außer private)

---

## US-MIT-011: Als Mitarbeiter möchte ich den Vollzug bestätigen können, damit der Antrag abgeschlossen werden kann

**Priorität:** Hoch  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-MIT-011-1:** Bei genehmigten oder teilweise genehmigten Anträgen muss der Vollzug bestätigt werden  
**AC-MIT-011-2:** Der Mitarbeiter kann den Antrag als "vollzogen" markieren  
**AC-MIT-011-3:** Nach Vollzug-Bestätigung wird der Antrag in die Phase "Abschluss" überführt  
**AC-MIT-011-4:** Bei Ablehnung wird die Vollzug-Phase übersprungen  
**AC-MIT-011-5:** Nur der aktuelle Bearbeiter kann den Vollzug bestätigen

---

## US-MIT-012: Als Mitarbeiter möchte ich einen Antrag verakten können, damit er archiviert wird

**Priorität:** Hoch  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-MIT-012-1:** Der Mitarbeiter kann einen Antrag verakten  
**AC-MIT-012-2:** Vor Veraktung muss bei genehmigten/teilweise genehmigten Anträgen der Vollzug bestätigt sein  
**AC-MIT-012-3:** Ein PDF mit komplettem Bearbeitungsverlauf wird erstellt und heruntergeladen  
**AC-MIT-012-4:** Der Antrag wird in die "Erledigt"-Liste verschoben  
**AC-MIT-012-5:** Alle offenen Gruppenaufgaben werden automatisch geschlossen  
**AC-MIT-012-6:** Der Antrag kann nach Veraktung nicht mehr bearbeitet werden  
**AC-MIT-012-7:** Nur der aktuelle Bearbeiter kann verakten

---

## US-MIT-013: Als VAL möchte ich Entscheidungen revidieren können, damit ich Fehler korrigieren kann

**Priorität:** Mittel  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-MIT-013-1:** Die VAL kann eine Entscheidung revidieren  
**AC-MIT-013-2:** Die Revision ist nur möglich, wenn der Antrag noch nicht veraktet wurde  
**AC-MIT-013-3:** Nach Revision wird der Antrag zurück in die Phase "Entscheiden" gesetzt  
**AC-MIT-013-4:** Die Revision wird im Bearbeitungsverlauf protokolliert  
**AC-MIT-013-5:** Nur VAL kann Entscheidungen revidieren

---

## US-MIT-014: Als Mitarbeiter möchte ich einen Terminkalender nutzen können, damit ich Termine verwalten kann

**Priorität:** Mittel  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-MIT-014-1:** Der Mitarbeiter kann zwischen Tag-, Woche- und Monatsansicht wählen  
**AC-MIT-014-2:** Der Mitarbeiter kann neue Termine erstellen  
**AC-MIT-014-3:** Der Mitarbeiter kann zwischen "Privat", "Station", "Haus" und "Allgemein" wählen  
**AC-MIT-014-4:** Termine aus Aufgabenfristen werden automatisch erstellt  
**AC-MIT-014-5:** Der Kalender ist ausklappbar für mehr Übersicht  
**AC-MIT-014-6:** VAL sieht alle Termine ihres Hauses  
**AC-MIT-014-7:** Stationsleitung sieht alle Termine ihrer Station

---

## US-MIT-015: Als Mitarbeiter möchte ich einen Antrag weiterleiten können, damit ich die Bearbeitung delegieren kann

**Priorität:** Mittel  
**Story Points:** 8

### Akzeptanzkriterien:

**AC-MIT-015-1:** Der Mitarbeiter kann einen Antrag an eine Gruppe weiterleiten  
**AC-MIT-015-2:** Der Mitarbeiter kann zwischen verschiedenen Gruppentypen wählen (AVD, VAL, Kammer, Zahlstelle, Arbeitskoordination)  
**AC-MIT-015-3:** Bei AVD-Gruppen muss Haus und Station ausgewählt werden  
**AC-MIT-015-4:** Bei Kammer-Gruppen ist keine Hausauswahl nötig  
**AC-MIT-015-5:** Der Mitarbeiter kann eine Notiz hinzufügen  
**AC-MIT-015-6:** Bei Weiterleitung kann die Hauptbearbeitung übertragen werden  
**AC-MIT-015-7:** Der Antrag erscheint in "Anträge und Aufgaben meiner Gruppe" der Zielgruppe  
**AC-MIT-015-8:** Die Weiterleitung wird im Bearbeitungsverlauf protokolliert

---

## US-MIT-016: Als Mitarbeiter möchte ich den Bearbeitungsverlauf einsehen können, damit ich die Historie nachvollziehen kann

**Priorität:** Mittel  
**Story Points:** 3

### Akzeptanzkriterien:

**AC-MIT-016-1:** Der Mitarbeiter sieht alle Aktivitäten zu einem Antrag  
**AC-MIT-016-2:** Aktivitäten werden chronologisch sortiert  
**AC-MIT-016-3:** Der Mitarbeiter kann zwischen "Neueste zuerst" und "Älteste zuerst" wählen  
**AC-MIT-016-4:** Kommentare und Begründungen werden im Verlauf angezeigt  
**AC-MIT-016-5:** Notizen (außer private) werden im Verlauf angezeigt

---

## US-MIT-017: Als Mitarbeiter möchte ich überfällige Aufgaben benachrichtigt werden, damit ich Fristen einhalten kann

**Priorität:** Mittel  
**Story Points:** 3

### Akzeptanzkriterien:

**AC-MIT-017-1:** Der Mitarbeiter erhält täglich eine Benachrichtigung bei überfälligen Aufgaben  
**AC-MIT-017-2:** Überfällige Aufgaben werden im Postfach hervorgehoben  
**AC-MIT-017-3:** Überfällige Aufgaben werden in der Aufgabenliste markiert

---

# Admin-Portal

## US-ADM-001: Als Administrator möchte ich mich anmelden können, damit ich auf das Admin-Portal zugreifen kann

**Priorität:** Hoch  
**Story Points:** 2

### Akzeptanzkriterien:

**AC-ADM-001-1:** Der Administrator kann sich mit Benutzername und Passwort anmelden  
**AC-ADM-001-2:** Bei erfolgreicher Anmeldung wird das Admin-Portal angezeigt  
**AC-ADM-001-3:** Die Anmeldung funktioniert sowohl lokal als auch über Server-API

---

## US-ADM-002: Als Administrator möchte ich Insassen anlegen können, damit diese Anträge stellen können

**Priorität:** Hoch  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-ADM-002-1:** Der Administrator kann einen neuen Insassen anlegen  
**AC-ADM-002-2:** Der Administrator muss Vorname, Nachname, Insassennummer, Geburtsdatum eingeben  
**AC-ADM-002-3:** Der Administrator muss JVA und Station zuweisen  
**AC-ADM-002-4:** Der Administrator kann ein Passwort setzen (optional, Standard wird generiert)  
**AC-ADM-002-5:** Ein Benutzername wird automatisch generiert  
**AC-ADM-002-6:** Nach Anlegen wird der Insasse in der Liste angezeigt  
**AC-ADM-002-7:** Der Insasse kann sich sofort anmelden

---

## US-ADM-003: Als Administrator möchte ich Mitarbeiter anlegen können, damit diese Anträge bearbeiten können

**Priorität:** Hoch  
**Story Points:** 8

### Akzeptanzkriterien:

**AC-ADM-003-1:** Der Administrator kann einen neuen Mitarbeiter anlegen  
**AC-ADM-003-2:** Der Administrator muss Vorname, Nachname eingeben  
**AC-ADM-003-3:** Der Administrator muss eine Rolle auswählen (AVD, VAL, Kammer, Zahlstelle, Arbeitskoordination)  
**AC-ADM-003-4:** Der Administrator muss Häuser zuweisen (bei AVD, VAL, Zahlstelle, Arbeitskoordination)  
**AC-ADM-003-5:** Der Administrator muss Station zuweisen (bei AVD)  
**AC-ADM-003-6:** Der Administrator kann ein Passwort setzen (optional, Standard wird generiert)  
**AC-ADM-003-7:** Ein Benutzername wird automatisch generiert  
**AC-ADM-003-8:** Nach Anlegen wird der Mitarbeiter in der Liste angezeigt  
**AC-ADM-003-9:** Der Mitarbeiter kann sich sofort anmelden

---

## US-ADM-004: Als Administrator möchte ich Benutzer bearbeiten können, damit ich Änderungen vornehmen kann

**Priorität:** Mittel  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-ADM-004-1:** Der Administrator kann einen Benutzer bearbeiten  
**AC-ADM-004-2:** Der Administrator kann Name, Rolle, Zuordnungen ändern  
**AC-ADM-004-3:** Der Administrator kann das Passwort zurücksetzen  
**AC-ADM-004-4:** Änderungen werden sofort gespeichert  
**AC-ADM-004-5:** Bei Rollenänderung werden die entsprechenden Felder angezeigt/versteckt

---

## US-ADM-005: Als Administrator möchte ich Benutzer löschen können, damit ich nicht mehr benötigte Accounts entfernen kann

**Priorität:** Niedrig  
**Story Points:** 3

### Akzeptanzkriterien:

**AC-ADM-005-1:** Der Administrator kann einen Benutzer löschen  
**AC-ADM-005-2:** Vor dem Löschen wird eine Bestätigung abgefragt  
**AC-ADM-005-3:** Nach Löschen wird der Benutzer aus der Liste entfernt  
**AC-ADM-005-4:** Der Benutzer kann sich nicht mehr anmelden

---

## US-ADM-006: Als Administrator möchte ich allgemeine Termine erstellen können, damit alle Mitarbeiter informiert werden

**Priorität:** Niedrig  
**Story Points:** 3

### Akzeptanzkriterien:

**AC-ADM-006-1:** Der Administrator kann einen allgemeinen Termin erstellen  
**AC-ADM-006-2:** Der Administrator muss Titel, Datum und Zeit eingeben  
**AC-ADM-006-3:** Der Termin ist für alle Mitarbeiter sichtbar  
**AC-ADM-006-4:** Der Termin erscheint im Kalender aller Mitarbeiter

---

# Technische Anforderungen

## US-TEC-001: Als System möchte ich Daten lokal speichern können, damit die Anwendung offline funktioniert

**Priorität:** Hoch  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-TEC-001-1:** Alle Daten werden im localStorage gespeichert  
**AC-TEC-001-2:** Daten bleiben nach Seitenneuladung erhalten  
**AC-TEC-001-3:** Daten werden automatisch gespeichert bei Änderungen  
**AC-TEC-001-4:** Die Anwendung funktioniert ohne Backend vollständig

---

## US-TEC-002: Als System möchte ich Daten mit einem Server synchronisieren können, damit Daten geräteübergreifend verfügbar sind

**Priorität:** Hoch  
**Story Points:** 8

### Akzeptanzkriterien:

**AC-TEC-002-1:** Die Anwendung kann optional mit einem Backend verbunden werden  
**AC-TEC-002-2:** Beim Start werden Daten vom Server geladen  
**AC-TEC-002-3:** Änderungen werden automatisch an den Server gesendet  
**AC-TEC-002-4:** Daten werden regelmäßig vom Server neu geladen (Polling)  
**AC-TEC-002-5:** Bei Konflikten gewinnt die Server-Version  
**AC-TEC-002-006:** Cache-Control Headers verhindern Caching-Probleme

---

## US-TEC-003: Als System möchte ich PDF-Dokumente generieren können, damit Bescheide erstellt werden können

**Priorität:** Hoch  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-TEC-003-1:** Bescheide werden automatisch als PDF generiert  
**AC-TEC-003-2:** Veraktungs-PDFs enthalten den kompletten Bearbeitungsverlauf  
**AC-TEC-003-3:** PDFs werden im Browser erstellt (jsPDF)  
**AC-TEC-003-4:** PDFs können heruntergeladen werden

---

## US-TEC-004: Als System möchte ich mehrsprachig sein, damit Benutzer ihre Sprache wählen können

**Priorität:** Mittel  
**Story Points:** 8

### Akzeptanzkriterien:

**AC-TEC-004-1:** Die Anwendung unterstützt Deutsch, Englisch und Französisch  
**AC-TEC-004-2:** UI-Texte werden übersetzt  
**AC-TEC-004-3:** Freitexte werden mit Quellsprache gespeichert und übersetzt  
**AC-TEC-004-4:** Die Spracheinstellung wird pro Benutzer gespeichert

---

# Sicherheit und Synchronisation

## US-SEC-001: Als System möchte ich verhindern, dass zwei Benutzer gleichzeitig denselben Antrag bearbeiten können

**Priorität:** Hoch  
**Story Points:** 8

### Akzeptanzkriterien:

**AC-SEC-001-1:** Beim Nehmen eines Antrags wird geprüft, ob er bereits vergeben ist  
**AC-SEC-001-2:** Wenn bereits vergeben, wird eine Fehlermeldung angezeigt  
**AC-SEC-001-3:** Der erste Bearbeiter behält die Bearbeitungsrechte  
**AC-SEC-001-4:** Der zweite Bearbeiter verliert sofort die Bearbeitungsrechte  
**AC-SEC-001-5:** Änderungen des zweiten Bearbeiters werden nicht gespeichert  
**AC-SEC-001-6:** Die Prüfung erfolgt immer auf dem Server zuerst

---

## US-SEC-002: Als System möchte ich sicherstellen, dass Bearbeitungsoperationen nur vom aktuellen Bearbeiter durchgeführt werden können

**Priorität:** Hoch  
**Story Points:** 8

### Akzeptanzkriterien:

**AC-SEC-002-1:** Vor jeder Bearbeitungsoperation wird geprüft, ob der Benutzer noch Bearbeiter ist  
**AC-SEC-002-2:** Die Prüfung erfolgt auf dem Server  
**AC-SEC-002-3:** Wenn nicht mehr Bearbeiter, werden Änderungen nicht gespeichert  
**AC-SEC-002-4:** Der Benutzer erhält eine Fehlermeldung  
**AC-SEC-002-5:** Die UI wird sofort aktualisiert

---

## US-SEC-003: Als System möchte ich sicherstellen, dass Phasenübergänge nicht rückgängig gemacht werden können

**Priorität:** Hoch  
**Story Points:** 5

### Akzeptanzkriterien:

**AC-SEC-003-1:** Ein Antrag kann nicht von einer späteren Phase zurück zu einer früheren Phase springen  
**AC-SEC-003-2:** Phasenfelder werden immer vom Server übernommen  
**AC-SEC-003-3:** Nach Veraktung kann der Antrag nicht mehr bearbeitet werden  
**AC-SEC-003-4:** Der Status bleibt bei Phasenübergängen erhalten

---

## US-SEC-004: Als System möchte ich sicherstellen, dass der Bearbeitungsfortschritt des ersten Bearbeiters erhalten bleibt

**Priorität:** Hoch  
**Story Points:** 8

### Akzeptanzkriterien:

**AC-SEC-004-1:** Änderungen des ersten Bearbeiters werden immer gespeichert  
**AC-SEC-004-2:** Änderungen des zweiten Bearbeiters werden verworfen  
**AC-SEC-004-3:** Bei Synchronisation werden Phasenfelder immer vom Server übernommen  
**AC-SEC-004-4:** Bearbeitungsfelder (Kommentare, Dokumente) werden nur behalten, wenn sie neuer sind als Server-Daten

---

# Nicht-funktionale Anforderungen

## NFR-001: Performance

**Beschreibung:** Die Anwendung soll auch bei vielen Anträgen und Aufgaben performant bleiben

### Akzeptanzkriterien:

**AC-NFR-001-1:** Die Anwendung lädt innerhalb von 2 Sekunden  
**AC-NFR-001-2:** UI-Interaktionen erfolgen ohne spürbare Verzögerung  
**AC-NFR-001-3:** Polling-Intervalle sind konfigurierbar (Standard: 10-30 Sekunden)

---

## NFR-002: Browser-Kompatibilität

**Beschreibung:** Die Anwendung soll in allen modernen Browsern funktionieren

### Akzeptanzkriterien:

**AC-NFR-002-1:** Die Anwendung funktioniert in Chrome, Firefox, Edge und Safari  
**AC-NFR-002-2:** Die Anwendung nutzt keine Browser-spezifischen Features  
**AC-NFR-002-3:** Die Anwendung funktioniert ohne JavaScript-Frameworks

---

## NFR-003: Barrierefreiheit

**Beschreibung:** Die Anwendung soll barrierefrei sein

### Akzeptanzkriterien:

**AC-NFR-003-1:** Die Anwendung nutzt semantisches HTML  
**AC-NFR-003-2:** Tastaturnavigation ist möglich  
**AC-NFR-003-3:** Kontraste entsprechen WCAG-Standards

---

## NFR-004: Datenschutz

**Beschreibung:** Die Anwendung soll datenschutzkonform sein

### Akzeptanzkriterien:

**AC-NFR-004-1:** Passwörter werden nicht im Klartext gespeichert  
**AC-NFR-004-2:** Daten werden lokal im Browser gespeichert (ohne Backend)  
**AC-NFR-004-3:** Bei Backend-Betrieb erfolgt verschlüsselte Übertragung (HTTPS empfohlen)

---

# Glossar

## Begriffe

- **Antrag:** Ein formeller Antrag eines Insassen (Teilhabegeld oder Eigentum)
- **Aufgabe:** Eine zugewiesene Tätigkeit für einen Mitarbeiter oder Insassen
- **Bearbeiter:** Der Mitarbeiter, der aktuell für einen Antrag verantwortlich ist
- **Gruppe:** Eine organisatorische Einheit (AVD-Gruppe, VAL-Gruppe, Spezialgruppen)
- **Haus:** Eine organisatorische Einheit innerhalb der JVA
- **Station:** Eine Untereinheit eines Hauses
- **Veraktung:** Die Archivierung eines abgeschlossenen Antrags
- **Vollzug:** Die Durchführung einer genehmigten Entscheidung
- **VAL:** Vollzugsabteilungsleitung (Hausleitung)

---

# Anhang: Prozessphasen

## Phase 1: EINGANG
- Antragstellung durch Insasse
- Als Entwurf speichern oder direkt einreichen

## Phase 2: PRÜFUNG
- Antrag nehmen
- Sachlich/fachlich prüfen (Pflichtkommentar)

## Phase 3: ENTSCHEIDEN
- Entscheidung treffen (Genehmigen/Teilweise/Ablehnen)
- Begründung eingeben (Pflicht)
- Optional: Persönliche Eröffnung oder Vollzug vor Bekanntgabe

## Phase 4: BEKANNTGABE
- Automatisch: Sofortige Benachrichtigung
- Manuell: Nach Bestätigung der persönlichen Eröffnung/Vollzug

## Phase 5: VOLLZUG
- Nur bei Genehmigung/Teilweise-Genehmigung
- Vollzug bestätigen
- Bei Ablehnung übersprungen

## Phase 6: ABSCHLUSS
- Veraktung
- PDF-Erstellung
- Archivierung

---

*Ende des Dokuments*
