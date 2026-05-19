/* ============================================
   GEFÄNGNIS ANTRAGSWESEN - APP LOGIC
   ============================================ */

// ============================================
// KONFIGURATION - Haus und Stationen
// ============================================

const HAUS_CONFIG = {
  'haus1': {
    name: 'Haus 1',
    stationen: ['1', '2']
  },
  'haus2': {
    name: 'Haus 2',
    stationen: ['1', '2', '3', '4']
  },
  'haus3': {
    name: 'Haus 3',
    stationen: ['1']
  }
};

// Alias für Kompatibilität
const JVA_CONFIG = HAUS_CONFIG;

// ============================================
// ÜBERSETZUNGSSYSTEM
// ============================================

const TRANSLATIONS = {
  de: {
    // Allgemein
    'app.title': 'Antragswesen',
    'app.logout': 'Abmelden',
    'app.save': 'Speichern',
    'app.cancel': 'Abbrechen',
    'app.delete': 'Löschen',
    'app.edit': 'Bearbeiten',
    'app.close': 'Schließen',
    'app.back': 'Zurück',
    'app.search': 'Suchen',
    'app.yes': 'Ja',
    'app.no': 'Nein',
    'app.loading': 'Laden...',
    'app.language': 'Sprache',
    
    // Login
    'login.title': 'Anmeldung',
    'login.username': 'Benutzername',
    'login.password': 'Passwort',
    'login.submit': 'Anmelden',
    'login.error': 'Ungültige Anmeldedaten',
    
    // Navigation / Tabs
    'nav.openApplications': 'Anträge und Aufgaben meiner Gruppe',
    'nav.myApplicationsTasks': 'Meine Anträge und Aufgaben',
    'nav.personalOpening': 'Pers. Eröffnung',
    'nav.completed': 'Erledigt',
    'nav.submittedApplications': 'Eingereichte Anträge',
    'nav.history': 'Historie',
    'nav.drafts': 'Entwürfe',
    
    // Postfach
    'inbox.title': 'Postfach',
    'inbox.messages': 'Nachrichten',
    'inbox.markAllRead': 'Alle als gelesen markieren',
    'inbox.moreMessages': 'weitere Nachrichten',
    'inbox.noMessages': 'Keine Nachrichten',
    
    // Anträge
    'application.new': 'Neuer Antrag',
    'application.title': 'Antrag',
    'application.id': 'Antrags-ID',
    'application.applicant': 'Antragsteller',
    'application.date': 'Datum',
    'application.status': 'Status',
    'application.concern': 'Anliegen',
    'application.justification': 'Begründung',
    'application.take': 'Antrag nehmen',
    'application.details': 'Antragsdetails',
    
    // Antragstypen
    'application.type.teilhabegeld': 'Teilhabegeld',
    'application.type.eigentum': 'Eigentum aus der Kammer',
    'application.type.beratung_unterstuetzung': 'Beratungs- und Unterstützungsleistungen',
    'application.type.gespraechstermin': 'Gesprächstermine',
    'application.type.gesundheit_medizin': 'Gesundheit: Termin medizinischer Dienst',
    'application.type.freizeit_weiterbildung': 'Freizeitaktivitäten inkl. Weiterbildungskosten',
    'application.type.besuch_langzeit': 'Langzeitbesuch (Genehmigung)',
    'application.type.besuch_termin': 'Besuchstermin',
    'application.type.besuch_video': 'Videobesuch',
    'application.type.sonstiges': 'Sonstiges Anliegen',
    
    // Status
    'status.draft': 'Entwurf',
    'status.submitted': 'Eingereicht',
    'status.inProgress': 'In Bearbeitung',
    'status.approved': 'Genehmigt',
    'status.rejected': 'Abgelehnt',
    'status.partiallyApproved': 'Teilweise genehmigt',
    'status.completed': 'Abgeschlossen',
    'status.open': 'Offen',
    
    // Aktionen
    'action.decide': 'Entscheiden',
    'action.createTask': 'Aufgabe erstellen',
    'action.archive': 'Verakten',
    'action.approve': 'Genehmigen',
    'action.reject': 'Ablehnen',
    'action.partiallyApprove': 'Teilweise genehmigen',
    'action.technicalReview': 'Antrag sachlich/fachlich geprüft',
    'action.executed': 'Antrag vollzogen',
    'action.personalOpening': 'Persönliche Eröffnung',
    
    // Aufgaben
    'task.title': 'Aufgabe',
    'task.create': 'Aufgabe erstellen',
    'task.edit': 'Aufgabe bearbeiten',
    'task.complete': 'Aufgabe abschließen',
    'task.assignTo': 'Aufgabe zuweisen an',
    'task.assignToInmate': 'Insasse (Antragsteller)',
    'task.assignToStaff': 'Mitarbeitende',
    'task.shortDescription': 'Kurzbeschreibung',
    'task.description': 'Ausführliche Beschreibung',
    'task.deadline': 'Frist',
    'task.deadlineHint': 'Bei Überschreitung der Frist werden tägliche Erinnerungen gesendet.',
    'task.attachPdf': 'PDF erstellen und anhängen',
    'task.send': 'Aufgabe senden',
    'task.from': 'Aufgabe von',
    'task.forApplication': 'Zum Antrag',
    'task.searchStaff': 'Mitarbeiter suchen',
    'task.selectStaff': 'Mitarbeiter auswählen',
    'task.selected': 'Ausgewählt',
    'task.noStaffFound': 'Keine Mitarbeiter gefunden',
    'task.withAnswer': 'Mit Antwort',
    'task.acknowledged': 'Zur Kenntnis genommen',
    'task.answer': 'Antwort',
    'task.enterAnswer': 'Geben Sie Ihre Antwort ein...',
    'task.myTasks': 'Meine Aufgaben',
    'task.applicationsInProgress': 'Anträge in Bearbeitung',
    
    // Entscheidung
    'decision.title': 'Entscheidung',
    'decision.reason': 'Begründung',
    'decision.reasonRequired': 'Bitte geben Sie eine Begründung ein.',
    'decision.personalOpeningCheck': 'Persönlich eröffnen',
    'decision.executionBeforeNotification': 'Vollzug vor Bekanntgabe an den Insassen planen',
    'decision.noAutoNotificationHint': 'Wenn aktiviert: Keine automatische Benachrichtigung. Das Ergebnis wird erst nach persönlicher Bestätigung übermittelt.',
    
    // Buttons/Schaltflächen
    'button.cancel': 'Abbrechen',
    'button.save': 'Speichern',
    'button.close': 'Schließen',
    'button.send': 'Senden',
    'button.delete': 'Löschen',
    'button.edit': 'Bearbeiten',
    'button.open': 'Öffnen',
    'button.back': 'Zurück',
    'button.submit': 'Absenden',
    'button.takeApplication': 'Antrag nehmen',
    'button.openApplication': 'Antrag öffnen',
    'button.saveDraft': 'Als Entwurf speichern',
    'button.withdraw': 'Zurücknehmen',
    'button.backToOverview': 'Zurück zur Übersicht',
    'button.actions': 'Aktionen',
    
    // Formulare
    'form.applicationType': 'Antragsart',
    'form.details': 'Details',
    'form.optional': 'optional',
    'form.required': 'erforderlich',
    'form.maxChars': 'max. {count} Zeichen',
    'form.charsRemaining': 'Zeichen übrig',
    
    // Termine
    'appointment.title': 'Titel',
    'appointment.date': 'Datum',
    'appointment.time': 'Uhrzeit',
    'appointment.type': 'Terminart',
    'appointment.private': 'Privat (nur für mich)',
    'appointment.house': 'Für das ganze Haus',
    'appointment.station': 'Für meine Station',
    'appointment.createdBy': 'Erstellt von',
    'appointment.forApplication': 'Zum Antrag',
    'appointment.deleteConfirm': 'Termin wirklich löschen?',
    
    // Kalender
    'calendar.title': 'Terminübersicht',
    'calendar.day': 'Tag',
    'calendar.week': 'Woche',
    'calendar.month': 'Monat',
    'calendar.today': 'Heute',
    'calendar.newAppointment': 'Neuer Termin',
    'calendar.noAppointments': 'Keine Termine',
    
    // Prozessschritte
    'process.receipt': 'Eingang',
    'process.review': 'Prüfung',
    'process.decision': 'Entscheiden',
    'process.notification': 'Bekanntgabe',
    'process.execution': 'Vollzug',
    'process.closure': 'Abschluss',
    
    // Stammdaten
    'masterdata.name': 'Name',
    'masterdata.birthdate': 'Geburtsdatum',
    'masterdata.inmateId': 'Insassen-ID',
    'masterdata.house': 'Haus',
    'masterdata.station': 'Station',
    
    // Rollen
    'role.inmate': 'Insasse',
    'role.staff': 'Mitarbeiter',
    'role.stationManagement': 'Stationsleitung',
    'role.houseManagement': 'Hausleitung',
    'role.admin': 'Administrator',
    
    // Verlauf
    'history.title': 'Bearbeitungsverlauf',
    'history.created': 'Antrag erstellt',
    'history.taken': 'Antrag genommen',
    'history.takenOver': 'Antrag übernommen von',
    'history.reviewed': 'Sachlich/fachlich geprüft',
    'history.decided': 'Entscheidung getroffen',
    'history.decisionPlanned': 'Entscheidung vorbereitet (persönliche Eröffnung)',
    'history.personalOpening': 'Persönliche Eröffnung',
    'history.taskCreated': 'Aufgabe erstellt',
    'history.taskCreatedFor': 'Aufgabe erstellt für',
    'history.taskCompleted': 'Aufgabe erledigt',
    'history.taskAnswered': 'Aufgabe beantwortet',
    'history.taskAcknowledged': 'Aufgabe zur Kenntnis genommen',
    'history.taskDeleted': 'Aufgabe gelöscht',
    'history.executed': 'Vollzogen',
    'history.archived': 'Veraktet',
    'history.deadline': 'Frist',
    'history.noActivities': 'Noch keine Aktivitäten.',
    
    // Hinweise
    'hint.applicationNotTaken': 'Dieser Antrag wurde noch nicht zur Bearbeitung genommen.',
    'hint.reviewRequired': 'Der Antrag muss zunächst sachlich/fachlich geprüft werden, bevor eine Entscheidung getroffen werden kann.',
    'hint.openTask': 'Sie haben eine offene Aufgabe zu diesem Antrag.',
    'hint.decisionMade': 'Entscheidung',
    'hint.on': 'am',
    
    // Antragstypen (für Aktivitäten)
    'apptype.teilhabegeld': 'Teilhabegeld',
    'apptype.eigentum': 'Eigentum in der Kammer',
    'apptype.beratung_unterstuetzung': 'Beratungs- und Unterstützungsleistungen',
    'apptype.gespraechstermin': 'Gesprächstermine',
    'apptype.gesundheit_medizin': 'Gesundheit: Termin medizinischer Dienst',
    'apptype.freizeit_weiterbildung': 'Freizeitaktivitäten inkl. Weiterbildungskosten',
    'apptype.besuch_langzeit': 'Langzeitbesuch (Genehmigung)',
    'apptype.besuch_termin': 'Besuchstermin',
    'apptype.besuch_video': 'Videobesuch',
    
    // Prozesskette
    'process.receipt': 'Eingang',
    'process.review': 'Prüfung',
    'process.decision': 'Entscheiden',
    'process.notification': 'Bekanntgabe',
    'process.execution': 'Vollzug',
    'process.completion': 'Abschluss',
    'process.reviewDone': 'Sachliche/fachliche Prüfung erfolgt am',
    'process.by': 'durch',
    
    // Bescheid
    'notice.title': 'Bescheid',
    'notice.reference': 'Aktenzeichen',
    'notice.date': 'Datum',
    'notice.applicationDate': 'Antragsdatum',
    'notice.greeting': 'Sehr geehrte/r Herr/Frau',
    'notice.yourApplication': 'Ihr Antrag',
    'notice.approved': 'wird hiermit genehmigt',
    'notice.partiallyApproved': 'wird hiermit teilweise genehmigt',
    'notice.rejected': 'wird hiermit abgelehnt',
    'notice.reasonIntro': 'Die Entscheidung erfolgt aufgrund folgender Begründung:',
    'notice.appeal': 'Gegen diese Entscheidung können Sie innerhalb von zwei Wochen auf Basis von §§ 109 ff. Strafvollzugesetz (StVollzG) beim Landgericht Hamburg Einspruch erheben.',
    'notice.applicationFor': 'Beantragung von',
    'notice.for': 'für',
    
    // Sortierung
    'sort.label': 'Sortieren',
    'sort.newest': 'Neueste zuerst',
    'sort.oldest': 'Älteste zuerst',
    'sort.applicantAZ': 'Antragsteller A-Z',
    'sort.applicantZA': 'Antragsteller Z-A',
    
    // Monate
    'month.january': 'Januar',
    'month.february': 'Februar',
    'month.march': 'März',
    'month.april': 'April',
    'month.may': 'Mai',
    'month.june': 'Juni',
    'month.july': 'Juli',
    'month.august': 'August',
    'month.september': 'September',
    'month.october': 'Oktober',
    'month.november': 'November',
    'month.december': 'Dezember',
    
    // Wochentage
    'weekday.monday': 'Montag',
    'weekday.tuesday': 'Dienstag',
    'weekday.wednesday': 'Mittwoch',
    'weekday.thursday': 'Donnerstag',
    'weekday.friday': 'Freitag',
    'weekday.saturday': 'Samstag',
    'weekday.sunday': 'Sonntag',
    'weekday.mon': 'Mo',
    'weekday.tue': 'Di',
    'weekday.wed': 'Mi',
    'weekday.thu': 'Do',
    'weekday.fri': 'Fr',
    'weekday.sat': 'Sa',
    'weekday.sun': 'So',
    
    // Fehlermeldungen
    'error.general': 'Ein Fehler ist aufgetreten',
    'error.required': 'Dieses Feld ist erforderlich',
    'error.selectOption': 'Bitte wählen Sie eine Option',
    'error.duplicateTeilhabegeld': 'Für diesen Monat wurde bereits ein Teilhabegeld-Antrag eingereicht.',
    'error.reviewRequired': 'Antrag muss erst geprüft werden',
    'error.executionRequired': 'Antrag muss erst als vollzogen markiert werden',
    
    // Bestätigungen
    'confirm.delete': 'Möchten Sie wirklich löschen?',
    'confirm.submit': 'Antrag einreichen?',
    
    // Erfolg
    'success.saved': 'Erfolgreich gespeichert',
    'success.submitted': 'Erfolgreich eingereicht',
    'success.taskCreated': 'Aufgabe wurde erfolgreich erstellt und zugewiesen.',
  },
  
  en: {
    // General
    'app.title': 'Application System',
    'app.logout': 'Logout',
    'app.save': 'Save',
    'app.cancel': 'Cancel',
    'app.delete': 'Delete',
    'app.edit': 'Edit',
    'app.close': 'Close',
    'app.back': 'Back',
    'app.search': 'Search',
    'app.yes': 'Yes',
    'app.no': 'No',
    'app.loading': 'Loading...',
    'app.language': 'Language',
    
    // Login
    'login.title': 'Login',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.error': 'Invalid credentials',
    
    // Navigation / Tabs
    'nav.openApplications': 'Applications and Tasks of my Group',
    'nav.myApplicationsTasks': 'My Applications and Tasks',
    'nav.personalOpening': 'Personal Opening',
    'nav.completed': 'Completed',
    'nav.submittedApplications': 'Submitted Applications',
    'nav.history': 'History',
    'nav.drafts': 'Drafts',
    
    // Inbox
    'inbox.title': 'Inbox',
    'inbox.messages': 'Messages',
    'inbox.markAllRead': 'Mark all as read',
    'inbox.moreMessages': 'more messages',
    'inbox.noMessages': 'No messages',
    
    // Applications
    'application.new': 'New Application',
    'application.title': 'Application',
    'application.id': 'Application ID',
    'application.applicant': 'Applicant',
    'application.date': 'Date',
    'application.status': 'Status',
    'application.concern': 'Concern',
    'application.justification': 'Justification',
    'application.take': 'Take Application',
    'application.details': 'Application Details',
    
    // Application types
    'application.type.teilhabegeld': 'Participation Allowance',
    'application.type.eigentum': 'Property from Storage',
    'application.type.beratung_unterstuetzung': 'Counselling and support services',
    'application.type.gespraechstermin': 'Conversation appointments',
    'application.type.gesundheit_medizin': 'Health: medical service appointment',
    'application.type.freizeit_weiterbildung': 'Leisure activities incl. training costs',
    'application.type.besuch_langzeit': 'Long-term visit (approval)',
    'application.type.besuch_termin': 'Visit appointment',
    'application.type.besuch_video': 'Video visit',
    'application.type.sonstiges': 'Other Concerns',
    
    // Status
    'status.draft': 'Draft',
    'status.submitted': 'Submitted',
    'status.inProgress': 'In Progress',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.partiallyApproved': 'Partially Approved',
    'status.completed': 'Completed',
    'status.open': 'Open',
    
    // Actions
    'action.decide': 'Decide',
    'action.createTask': 'Create Task',
    'action.archive': 'Archive',
    'action.approve': 'Approve',
    'action.reject': 'Reject',
    'action.partiallyApprove': 'Partially Approve',
    'action.technicalReview': 'Technical Review Completed',
    'action.executed': 'Executed',
    'action.personalOpening': 'Personal Opening',
    
    // Tasks
    'task.title': 'Task',
    'task.create': 'Create Task',
    'task.edit': 'Edit Task',
    'task.complete': 'Complete Task',
    'task.assignTo': 'Assign task to',
    'task.assignToInmate': 'Inmate (Applicant)',
    'task.assignToStaff': 'Staff',
    'task.shortDescription': 'Short Description',
    'task.description': 'Detailed Description',
    'task.deadline': 'Deadline',
    'task.deadlineHint': 'Daily reminders will be sent when the deadline is exceeded.',
    'task.attachPdf': 'Create and attach PDF',
    'task.send': 'Send Task',
    'task.from': 'Task from',
    'task.forApplication': 'For application',
    'task.searchStaff': 'Search staff',
    'task.selectStaff': 'Select staff member',
    'task.selected': 'Selected',
    'task.noStaffFound': 'No staff found',
    'task.withAnswer': 'With Answer',
    'task.acknowledged': 'Acknowledged',
    'task.answer': 'Answer',
    'task.enterAnswer': 'Enter your answer...',
    'task.myTasks': 'My Tasks',
    'task.applicationsInProgress': 'Applications in Progress',
    
    // Decision
    'decision.title': 'Decision',
    'decision.reason': 'Reason',
    'decision.reasonRequired': 'Please enter a reason.',
    'decision.personalOpeningCheck': 'Personal opening',
    'decision.executionBeforeNotification': 'Plan execution before notification to inmate',
    'decision.noAutoNotificationHint': 'If activated: No automatic notification. The result will only be transmitted after personal confirmation.',
    
    // Buttons
    'button.cancel': 'Cancel',
    'button.save': 'Save',
    'button.close': 'Close',
    'button.send': 'Send',
    'button.delete': 'Delete',
    'button.edit': 'Edit',
    'button.open': 'Open',
    'button.back': 'Back',
    'button.submit': 'Submit',
    'button.takeApplication': 'Take application',
    'button.openApplication': 'Open application',
    'button.saveDraft': 'Save as draft',
    'button.withdraw': 'Withdraw',
    'button.backToOverview': 'Back to overview',
    'button.actions': 'Actions',
    
    // Forms
    'form.applicationType': 'Application type',
    'form.details': 'Details',
    'form.optional': 'optional',
    'form.required': 'required',
    'form.maxChars': 'max. {count} characters',
    'form.charsRemaining': 'characters remaining',
    
    // Appointments
    'appointment.title': 'Title',
    'appointment.date': 'Date',
    'appointment.time': 'Time',
    'appointment.type': 'Appointment type',
    'appointment.private': 'Private (only for me)',
    'appointment.house': 'For the whole house',
    'appointment.station': 'For my station',
    'appointment.createdBy': 'Created by',
    'appointment.forApplication': 'For application',
    'appointment.deleteConfirm': 'Really delete appointment?',
    
    // Calendar
    'calendar.title': 'Calendar Overview',
    'calendar.day': 'Day',
    'calendar.week': 'Week',
    'calendar.month': 'Month',
    'calendar.today': 'Today',
    'calendar.newAppointment': 'New Appointment',
    'calendar.noAppointments': 'No appointments',
    
    // Process steps
    'process.receipt': 'Receipt',
    'process.review': 'Review',
    'process.decision': 'Decision',
    'process.notification': 'Notification',
    'process.execution': 'Execution',
    'process.completion': 'Completion',
    'process.reviewDone': 'Technical review completed on',
    'process.by': 'by',
    
    // Notice
    'notice.title': 'Notice',
    'notice.reference': 'Reference',
    'notice.date': 'Date',
    'notice.applicationDate': 'Application Date',
    'notice.greeting': 'Dear Mr./Ms.',
    'notice.yourApplication': 'Your application',
    'notice.approved': 'is hereby approved',
    'notice.partiallyApproved': 'is hereby partially approved',
    'notice.rejected': 'is hereby rejected',
    'notice.reasonIntro': 'The decision is based on the following reason:',
    'notice.appeal': 'You may appeal this decision within two weeks pursuant to §§ 109 ff. Prison Act (StVollzG) at the Hamburg Regional Court.',
    'notice.applicationFor': 'Application for',
    'notice.for': 'for',
    
    // Master data
    'masterdata.name': 'Name',
    'masterdata.birthdate': 'Date of Birth',
    'masterdata.inmateId': 'Inmate ID',
    'masterdata.house': 'House',
    'masterdata.station': 'Station',
    
    // Roles
    'role.inmate': 'Inmate',
    'role.staff': 'Staff',
    'role.stationManagement': 'Station Management',
    'role.houseManagement': 'House Management',
    'role.admin': 'Administrator',
    
    // History
    'history.title': 'Processing History',
    'history.created': 'Application created',
    'history.taken': 'Application taken',
    'history.takenOver': 'Application taken over from',
    'history.reviewed': 'Technical review completed',
    'history.decided': 'Decision made',
    'history.decisionPlanned': 'Decision prepared (personal opening)',
    'history.personalOpening': 'Personal opening',
    'history.taskCreated': 'Task created',
    'history.taskCreatedFor': 'Task created for',
    'history.taskCompleted': 'Task completed',
    'history.taskAnswered': 'Task answered',
    'history.taskAcknowledged': 'Task acknowledged',
    'history.taskDeleted': 'Task deleted',
    'history.executed': 'Executed',
    'history.archived': 'Archived',
    'history.deadline': 'Deadline',
    'history.noActivities': 'No activities yet.',
    
    // Hints
    'hint.applicationNotTaken': 'This application has not yet been taken for processing.',
    'hint.reviewRequired': 'The application must first be technically reviewed before a decision can be made.',
    'hint.openTask': 'You have an open task for this application.',
    'hint.decisionMade': 'Decision',
    'hint.on': 'on',
    
    // Application types (for activities)
    'apptype.teilhabegeld': 'Participation allowance',
    'apptype.eigentum': 'Property from storage',
    'apptype.beratung_unterstuetzung': 'Counselling and support services',
    'apptype.gespraechstermin': 'Conversation appointments',
    'apptype.gesundheit_medizin': 'Health: medical service appointment',
    'apptype.freizeit_weiterbildung': 'Leisure activities incl. training costs',
    'apptype.besuch_langzeit': 'Long-term visit (approval)',
    'apptype.besuch_termin': 'Visit appointment',
    'apptype.besuch_video': 'Video visit',
    
    // Sorting
    'sort.label': 'Sort',
    'sort.newest': 'Newest first',
    'sort.oldest': 'Oldest first',
    'sort.applicantAZ': 'Applicant A-Z',
    'sort.applicantZA': 'Applicant Z-A',
    
    // Months
    'month.january': 'January',
    'month.february': 'February',
    'month.march': 'March',
    'month.april': 'April',
    'month.may': 'May',
    'month.june': 'June',
    'month.july': 'July',
    'month.august': 'August',
    'month.september': 'September',
    'month.october': 'October',
    'month.november': 'November',
    'month.december': 'December',
    
    // Weekdays
    'weekday.monday': 'Monday',
    'weekday.tuesday': 'Tuesday',
    'weekday.wednesday': 'Wednesday',
    'weekday.thursday': 'Thursday',
    'weekday.friday': 'Friday',
    'weekday.saturday': 'Saturday',
    'weekday.sunday': 'Sunday',
    'weekday.mon': 'Mon',
    'weekday.tue': 'Tue',
    'weekday.wed': 'Wed',
    'weekday.thu': 'Thu',
    'weekday.fri': 'Fri',
    'weekday.sat': 'Sat',
    'weekday.sun': 'Sun',
    
    // Errors
    'error.general': 'An error occurred',
    'error.required': 'This field is required',
    'error.selectOption': 'Please select an option',
    'error.duplicateTeilhabegeld': 'A participation allowance application has already been submitted for this month.',
    'error.reviewRequired': 'Application must be reviewed first',
    'error.executionRequired': 'Application must be marked as executed first',
    
    // Confirmations
    'confirm.delete': 'Do you really want to delete?',
    'confirm.submit': 'Submit application?',
    
    // Success
    'success.saved': 'Successfully saved',
    'success.submitted': 'Successfully submitted',
    'success.taskCreated': 'Task has been created and assigned successfully.',
  },
  
  fr: {
    // Général
    'app.title': 'Système de demandes',
    'app.logout': 'Déconnexion',
    'app.save': 'Enregistrer',
    'app.cancel': 'Annuler',
    'app.delete': 'Supprimer',
    'app.edit': 'Modifier',
    'app.close': 'Fermer',
    'app.back': 'Retour',
    'app.search': 'Rechercher',
    'app.yes': 'Oui',
    'app.no': 'Non',
    'app.loading': 'Chargement...',
    'app.language': 'Langue',
    
    // Connexion
    'login.title': 'Connexion',
    'login.username': 'Nom d\'utilisateur',
    'login.password': 'Mot de passe',
    'login.submit': 'Se connecter',
    'login.error': 'Identifiants invalides',
    
    // Navigation / Onglets
    'nav.openApplications': 'Demandes et tâches de mon groupe',
    'nav.myApplicationsTasks': 'Mes demandes et tâches',
    'nav.personalOpening': 'Ouverture personnelle',
    'nav.completed': 'Terminé',
    'nav.submittedApplications': 'Demandes soumises',
    'nav.history': 'Historique',
    'nav.drafts': 'Brouillons',
    
    // Boîte de réception
    'inbox.title': 'Boîte de réception',
    'inbox.messages': 'Messages',
    'inbox.markAllRead': 'Tout marquer comme lu',
    'inbox.moreMessages': 'messages supplémentaires',
    'inbox.noMessages': 'Aucun message',
    
    // Demandes
    'application.new': 'Nouvelle demande',
    'application.title': 'Demande',
    'application.id': 'ID de demande',
    'application.applicant': 'Demandeur',
    'application.date': 'Date',
    'application.status': 'Statut',
    'application.concern': 'Objet',
    'application.justification': 'Justification',
    'application.take': 'Prendre la demande',
    'application.details': 'Détails de la demande',
    
    // Types de demande
    'application.type.teilhabegeld': 'Allocation de participation',
    'application.type.eigentum': 'Propriété du dépôt',
    'application.type.beratung_unterstuetzung': 'Services de conseil et de soutien',
    'application.type.gespraechstermin': 'Rendez-vous de conversation',
    'application.type.gesundheit_medizin': 'Santé : rendez-vous au service médical',
    'application.type.freizeit_weiterbildung': 'Activités de loisirs et frais de formation',
    'application.type.besuch_langzeit': 'Visite longue durée (autorisation)',
    'application.type.besuch_termin': 'Rendez-vous de visite',
    'application.type.besuch_video': 'Visite vidéo',
    'application.type.sonstiges': 'Autres préoccupations',
    
    // Statut
    'status.draft': 'Brouillon',
    'status.submitted': 'Soumis',
    'status.inProgress': 'En cours',
    'status.approved': 'Approuvé',
    'status.rejected': 'Rejeté',
    'status.partiallyApproved': 'Partiellement approuvé',
    'status.completed': 'Terminé',
    'status.open': 'Ouvert',
    
    // Actions
    'action.decide': 'Décider',
    'action.createTask': 'Créer une tâche',
    'action.archive': 'Archiver',
    'action.approve': 'Approuver',
    'action.reject': 'Rejeter',
    'action.partiallyApprove': 'Approuver partiellement',
    'action.technicalReview': 'Examen technique terminé',
    'action.executed': 'Exécuté',
    'action.personalOpening': 'Ouverture personnelle',
    
    // Tâches
    'task.title': 'Tâche',
    'task.create': 'Créer une tâche',
    'task.edit': 'Modifier la tâche',
    'task.complete': 'Terminer la tâche',
    'task.assignTo': 'Assigner la tâche à',
    'task.assignToInmate': 'Détenu (Demandeur)',
    'task.assignToStaff': 'Personnel',
    'task.shortDescription': 'Description courte',
    'task.description': 'Description détaillée',
    'task.deadline': 'Date limite',
    'task.deadlineHint': 'Des rappels quotidiens seront envoyés après la date limite.',
    'task.attachPdf': 'Créer et joindre un PDF',
    'task.send': 'Envoyer la tâche',
    'task.from': 'Tâche de',
    'task.forApplication': 'Pour la demande',
    'task.searchStaff': 'Rechercher un employé',
    'task.selectStaff': 'Sélectionner un employé',
    'task.selected': 'Sélectionné',
    'task.noStaffFound': 'Aucun employé trouvé',
    'task.withAnswer': 'Avec réponse',
    'task.acknowledged': 'Pris connaissance',
    'task.answer': 'Réponse',
    'task.enterAnswer': 'Entrez votre réponse...',
    'task.myTasks': 'Mes tâches',
    'task.applicationsInProgress': 'Demandes en cours',
    
    // Décision
    'decision.title': 'Décision',
    'decision.reason': 'Motif',
    'decision.reasonRequired': 'Veuillez entrer un motif.',
    'decision.personalOpeningCheck': 'Ouverture personnelle',
    'decision.executionBeforeNotification': 'Planifier l\'exécution avant la notification au détenu',
    'decision.noAutoNotificationHint': 'Si activé: Pas de notification automatique. Le résultat ne sera transmis qu\'après confirmation personnelle.',
    
    // Boutons
    'button.cancel': 'Annuler',
    'button.save': 'Enregistrer',
    'button.close': 'Fermer',
    'button.send': 'Envoyer',
    'button.delete': 'Supprimer',
    'button.edit': 'Modifier',
    'button.open': 'Ouvrir',
    'button.back': 'Retour',
    'button.submit': 'Soumettre',
    'button.takeApplication': 'Prendre la demande',
    'button.openApplication': 'Ouvrir la demande',
    'button.saveDraft': 'Enregistrer comme brouillon',
    'button.withdraw': 'Retirer',
    'button.backToOverview': 'Retour à l\'aperçu',
    'button.actions': 'Actions',
    
    // Formulaires
    'form.applicationType': 'Type de demande',
    'form.details': 'Détails',
    'form.optional': 'optionnel',
    'form.required': 'obligatoire',
    'form.maxChars': 'max. {count} caractères',
    'form.charsRemaining': 'caractères restants',
    
    // Rendez-vous
    'appointment.title': 'Titre',
    'appointment.date': 'Date',
    'appointment.time': 'Heure',
    'appointment.type': 'Type de rendez-vous',
    'appointment.private': 'Privé (seulement pour moi)',
    'appointment.house': 'Pour toute la maison',
    'appointment.station': 'Pour ma station',
    'appointment.createdBy': 'Créé par',
    'appointment.forApplication': 'Pour la demande',
    'appointment.deleteConfirm': 'Vraiment supprimer le rendez-vous?',
    
    // Calendrier
    'calendar.title': 'Aperçu du calendrier',
    'calendar.day': 'Jour',
    'calendar.week': 'Semaine',
    'calendar.month': 'Mois',
    'calendar.today': 'Aujourd\'hui',
    'calendar.newAppointment': 'Nouveau rendez-vous',
    'calendar.noAppointments': 'Aucun rendez-vous',
    
    // Étapes du processus
    'process.receipt': 'Réception',
    'process.review': 'Examen',
    'process.decision': 'Décision',
    'process.notification': 'Notification',
    'process.execution': 'Exécution',
    'process.completion': 'Clôture',
    'process.reviewDone': 'Examen technique effectué le',
    'process.by': 'par',
    
    // Notification
    'notice.title': 'Notification',
    'notice.reference': 'Référence',
    'notice.date': 'Date',
    'notice.applicationDate': 'Date de demande',
    'notice.greeting': 'Cher(e) M./Mme.',
    'notice.yourApplication': 'Votre demande',
    'notice.approved': 'est approuvée par la présente',
    'notice.partiallyApproved': 'est partiellement approuvée par la présente',
    'notice.rejected': 'est rejetée par la présente',
    'notice.reasonIntro': 'La décision est basée sur la raison suivante:',
    'notice.appeal': 'Vous pouvez faire appel de cette décision dans un délai de deux semaines conformément aux §§ 109 ff. de la loi pénitentiaire (StVollzG) auprès du tribunal régional de Hambourg.',
    'notice.applicationFor': 'Demande de',
    'notice.for': 'pour',
    
    // Données de base
    'masterdata.name': 'Nom',
    'masterdata.birthdate': 'Date de naissance',
    'masterdata.inmateId': 'ID détenu',
    'masterdata.house': 'Maison',
    'masterdata.station': 'Station',
    
    // Rôles
    'role.inmate': 'Détenu',
    'role.staff': 'Personnel',
    'role.stationManagement': 'Direction de station',
    'role.houseManagement': 'Direction de maison',
    'role.admin': 'Administrateur',
    
    // Historique
    'history.title': 'Historique de traitement',
    'history.created': 'Demande créée',
    'history.taken': 'Demande prise',
    'history.takenOver': 'Demande reprise de',
    'history.reviewed': 'Examen technique terminé',
    'history.decided': 'Décision prise',
    'history.decisionPlanned': 'Décision préparée (ouverture personnelle)',
    'history.personalOpening': 'Ouverture personnelle',
    'history.taskCreated': 'Tâche créée',
    'history.taskCreatedFor': 'Tâche créée pour',
    'history.taskCompleted': 'Tâche terminée',
    'history.taskAnswered': 'Tâche répondue',
    'history.taskAcknowledged': 'Tâche prise en compte',
    'history.taskDeleted': 'Tâche supprimée',
    'history.executed': 'Exécuté',
    'history.archived': 'Archivé',
    'history.deadline': 'Date limite',
    'history.noActivities': 'Pas encore d\'activités.',
    
    // Indices
    'hint.applicationNotTaken': 'Cette demande n\'a pas encore été prise en charge.',
    'hint.reviewRequired': 'La demande doit d\'abord être examinée techniquement avant qu\'une décision puisse être prise.',
    'hint.openTask': 'Vous avez une tâche ouverte pour cette demande.',
    'hint.decisionMade': 'Décision',
    'hint.on': 'le',
    
    // Types de demande (pour les activités)
    'apptype.teilhabegeld': 'Allocation de participation',
    'apptype.eigentum': 'Biens du dépôt',
    'apptype.beratung_unterstuetzung': 'Services de conseil et de soutien',
    'apptype.gespraechstermin': 'Rendez-vous de conversation',
    'apptype.gesundheit_medizin': 'Santé : rendez-vous au service médical',
    'apptype.freizeit_weiterbildung': 'Activités de loisirs et frais de formation',
    'apptype.besuch_langzeit': 'Visite longue durée (autorisation)',
    'apptype.besuch_termin': 'Rendez-vous de visite',
    'apptype.besuch_video': 'Visite vidéo',
    
    // Tri
    'sort.label': 'Trier',
    'sort.newest': 'Plus récent',
    'sort.oldest': 'Plus ancien',
    'sort.applicantAZ': 'Demandeur A-Z',
    'sort.applicantZA': 'Demandeur Z-A',
    
    // Mois
    'month.january': 'Janvier',
    'month.february': 'Février',
    'month.march': 'Mars',
    'month.april': 'Avril',
    'month.may': 'Mai',
    'month.june': 'Juin',
    'month.july': 'Juillet',
    'month.august': 'Août',
    'month.september': 'Septembre',
    'month.october': 'Octobre',
    'month.november': 'Novembre',
    'month.december': 'Décembre',
    
    // Jours de la semaine
    'weekday.monday': 'Lundi',
    'weekday.tuesday': 'Mardi',
    'weekday.wednesday': 'Mercredi',
    'weekday.thursday': 'Jeudi',
    'weekday.friday': 'Vendredi',
    'weekday.saturday': 'Samedi',
    'weekday.sunday': 'Dimanche',
    'weekday.mon': 'Lun',
    'weekday.tue': 'Mar',
    'weekday.wed': 'Mer',
    'weekday.thu': 'Jeu',
    'weekday.fri': 'Ven',
    'weekday.sat': 'Sam',
    'weekday.sun': 'Dim',
    
    // Erreurs
    'error.general': 'Une erreur s\'est produite',
    'error.required': 'Ce champ est obligatoire',
    'error.selectOption': 'Veuillez sélectionner une option',
    'error.duplicateTeilhabegeld': 'Une demande d\'allocation a déjà été soumise pour ce mois.',
    'error.reviewRequired': 'La demande doit d\'abord être examinée',
    'error.executionRequired': 'La demande doit d\'abord être marquée comme exécutée',
    
    // Confirmations
    'confirm.delete': 'Voulez-vous vraiment supprimer?',
    'confirm.submit': 'Soumettre la demande?',
    
    // Succès
    'success.saved': 'Enregistré avec succès',
    'success.submitted': 'Soumis avec succès',
    'success.taskCreated': 'La tâche a été créée et assignée avec succès.',
  }
};

// Aktuelle Sprache (Standard: Deutsch) - wird beim Login individuell geladen
let currentLanguage = 'de';

// Übersetzungsfunktion
function t(key, params = {}) {
  const translation = TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['de'][key] || key;
  
  // Parameter ersetzen (z.B. {count} -> 5)
  let result = translation;
  Object.keys(params).forEach(param => {
    result = result.replace(new RegExp(`{${param}}`, 'g'), params[param]);
  });
  
  return result;
}

// Sprache setzen (individuell pro Benutzer)
function setLanguage(lang, userId = null) {
  if (TRANSLATIONS[lang]) {
    currentLanguage = lang;
    
    // Benutzer-Spracheinstellung speichern wenn eingeloggt
    const session = sessionManager?.getSession();
    const activeUserId = userId || session?.userId;
    
    if (activeUserId) {
      localStorage.setItem('app_language_' + activeUserId, lang);
      const user = userSystem.getUser(activeUserId);
      if (user) {
        user.sprache = lang;
        userSystem.saveUsers();
      }
    }
    
    return true;
  }
  return false;
}

// Sprache des Benutzers laden
function loadUserLanguage(userId) {
  const user = userSystem.getUser(userId);
  if (user && user.sprache && TRANSLATIONS[user.sprache]) {
    currentLanguage = user.sprache;
    localStorage.setItem('app_language_' + userId, user.sprache);
  } else {
    // Standard-Sprache Deutsch wenn keine Einstellung vorhanden
    currentLanguage = 'de';
  }
}

// Sprache beim Logout zurücksetzen
function resetLanguage() {
  currentLanguage = 'de';
}

// Verfügbare Sprachen
function getAvailableLanguages() {
  return [
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];
}

// ============================================
// FREITEXT-ÜBERSETZUNG (Wörterbuch-basiert)
// ============================================

const TEXT_DICTIONARY = {
  // Deutsch -> Englisch
  'de-en': {
    // Häufige Wörter
    'ich': 'I', 'möchte': 'would like', 'bitte': 'please', 'gerne': 'gladly',
    'beantragen': 'apply for', 'Antrag': 'application', 'Geld': 'money',
    'benötige': 'need', 'brauche': 'need', 'für': 'for', 'den': 'the', 'die': 'the', 'das': 'the',
    'ein': 'a', 'eine': 'a', 'einen': 'a', 'mein': 'my', 'meine': 'my', 'meinen': 'my',
    'und': 'and', 'oder': 'or', 'aber': 'but', 'weil': 'because', 'da': 'since',
    'habe': 'have', 'hat': 'has', 'haben': 'have', 'bin': 'am', 'ist': 'is', 'sind': 'are',
    'wird': 'will', 'werden': 'will', 'wurde': 'was', 'wurden': 'were',
    'kann': 'can', 'können': 'can', 'muss': 'must', 'müssen': 'must',
    'soll': 'should', 'sollen': 'should', 'darf': 'may', 'dürfen': 'may',
    'nicht': 'not', 'kein': 'no', 'keine': 'no', 'keinen': 'no',
    'mit': 'with', 'ohne': 'without', 'von': 'from', 'zu': 'to', 'bei': 'at',
    'am': 'on', 'im': 'in', 'an': 'at', 'auf': 'on', 'in': 'in', 'aus': 'from',
    'nach': 'after', 'vor': 'before', 'über': 'about', 'unter': 'under',
    'heute': 'today', 'morgen': 'tomorrow', 'gestern': 'yesterday',
    'Monat': 'month', 'Jahr': 'year', 'Tag': 'day', 'Woche': 'week',
    'Januar': 'January', 'Februar': 'February', 'März': 'March', 'April': 'April',
    'Mai': 'May', 'Juni': 'June', 'Juli': 'July', 'August': 'August',
    'September': 'September', 'Oktober': 'October', 'November': 'November', 'Dezember': 'December',
    // Antrags-spezifisch
    'Teilhabegeld': 'participation allowance', 'Eigentum': 'property', 'Kammer': 'storage',
    'genehmigt': 'approved', 'abgelehnt': 'rejected', 'Begründung': 'reason',
    'Aufgabe': 'task', 'erledigt': 'completed', 'Antwort': 'answer',
    'Kenntnis': 'knowledge', 'genommen': 'taken', 'geprüft': 'reviewed',
    'Entscheidung': 'decision', 'Eröffnung': 'opening', 'persönlich': 'personal',
    'Bescheid': 'notice', 'Einspruch': 'objection', 'Frist': 'deadline',
    'hiermit': 'hereby', 'folgende': 'following', 'folgenden': 'following',
    'sehr': 'very', 'geehrte': 'dear', 'geehrter': 'dear', 'Herr': 'Mr', 'Frau': 'Ms',
    'Grund': 'reason', 'Gründe': 'reasons', 'Zweck': 'purpose',
    'benötigt': 'needed', 'erforderlich': 'required', 'notwendig': 'necessary',
    'dringend': 'urgent', 'wichtig': 'important', 'sofort': 'immediately',
    'Familie': 'family', 'Angehörige': 'relatives', 'Besuch': 'visit',
    'Medizin': 'medicine', 'Arzt': 'doctor', 'Gesundheit': 'health',
    'Arbeit': 'work', 'Ausbildung': 'training', 'Bildung': 'education',
    'Kleidung': 'clothing', 'Hygiene': 'hygiene', 'Körperpflege': 'personal care',
    'Telefonat': 'phone call', 'Brief': 'letter', 'Kontakt': 'contact'
  },
  
  // Deutsch -> Französisch
  'de-fr': {
    'ich': 'je', 'möchte': 'voudrais', 'bitte': 's\'il vous plaît', 'gerne': 'volontiers',
    'beantragen': 'demander', 'Antrag': 'demande', 'Geld': 'argent',
    'benötige': 'ai besoin de', 'brauche': 'ai besoin de', 'für': 'pour',
    'den': 'le', 'die': 'la', 'das': 'le', 'ein': 'un', 'eine': 'une', 'einen': 'un',
    'mein': 'mon', 'meine': 'ma', 'meinen': 'mon',
    'und': 'et', 'oder': 'ou', 'aber': 'mais', 'weil': 'parce que', 'da': 'puisque',
    'habe': 'ai', 'hat': 'a', 'haben': 'ont', 'bin': 'suis', 'ist': 'est', 'sind': 'sont',
    'wird': 'sera', 'werden': 'seront', 'wurde': 'a été', 'wurden': 'ont été',
    'kann': 'peux', 'können': 'peuvent', 'muss': 'dois', 'müssen': 'doivent',
    'soll': 'devrait', 'sollen': 'devraient', 'darf': 'peut', 'dürfen': 'peuvent',
    'nicht': 'pas', 'kein': 'aucun', 'keine': 'aucune', 'keinen': 'aucun',
    'mit': 'avec', 'ohne': 'sans', 'von': 'de', 'zu': 'à', 'bei': 'chez',
    'am': 'le', 'im': 'dans le', 'an': 'à', 'auf': 'sur', 'in': 'dans', 'aus': 'de',
    'nach': 'après', 'vor': 'avant', 'über': 'sur', 'unter': 'sous',
    'heute': 'aujourd\'hui', 'morgen': 'demain', 'gestern': 'hier',
    'Monat': 'mois', 'Jahr': 'année', 'Tag': 'jour', 'Woche': 'semaine',
    'Januar': 'janvier', 'Februar': 'février', 'März': 'mars', 'April': 'avril',
    'Mai': 'mai', 'Juni': 'juin', 'Juli': 'juillet', 'August': 'août',
    'September': 'septembre', 'Oktober': 'octobre', 'November': 'novembre', 'Dezember': 'décembre',
    'Teilhabegeld': 'allocation de participation', 'Eigentum': 'propriété', 'Kammer': 'dépôt',
    'genehmigt': 'approuvé', 'abgelehnt': 'rejeté', 'Begründung': 'motif',
    'Aufgabe': 'tâche', 'erledigt': 'terminé', 'Antwort': 'réponse',
    'Kenntnis': 'connaissance', 'genommen': 'pris', 'geprüft': 'vérifié',
    'Entscheidung': 'décision', 'Eröffnung': 'ouverture', 'persönlich': 'personnel',
    'Bescheid': 'avis', 'Einspruch': 'objection', 'Frist': 'délai',
    'hiermit': 'par la présente', 'folgende': 'suivant', 'folgenden': 'suivants',
    'sehr': 'très', 'geehrte': 'cher', 'geehrter': 'cher', 'Herr': 'Monsieur', 'Frau': 'Madame',
    'Grund': 'raison', 'Gründe': 'raisons', 'Zweck': 'but',
    'benötigt': 'nécessaire', 'erforderlich': 'requis', 'notwendig': 'nécessaire',
    'dringend': 'urgent', 'wichtig': 'important', 'sofort': 'immédiatement',
    'Familie': 'famille', 'Angehörige': 'proches', 'Besuch': 'visite',
    'Medizin': 'médicament', 'Arzt': 'médecin', 'Gesundheit': 'santé',
    'Arbeit': 'travail', 'Ausbildung': 'formation', 'Bildung': 'éducation',
    'Kleidung': 'vêtements', 'Hygiene': 'hygiène', 'Körperpflege': 'soins personnels',
    'Telefonat': 'appel téléphonique', 'Brief': 'lettre', 'Kontakt': 'contact'
  },
  
  // Englisch -> Deutsch
  'en-de': {
    'I': 'ich', 'would like': 'möchte', 'please': 'bitte', 'gladly': 'gerne',
    'apply for': 'beantragen', 'application': 'Antrag', 'money': 'Geld',
    'need': 'benötige', 'for': 'für', 'the': 'der/die/das', 'a': 'ein/eine',
    'my': 'mein', 'and': 'und', 'or': 'oder', 'but': 'aber', 'because': 'weil',
    'have': 'habe', 'has': 'hat', 'am': 'bin', 'is': 'ist', 'are': 'sind',
    'will': 'wird', 'was': 'wurde', 'were': 'wurden',
    'can': 'kann', 'must': 'muss', 'should': 'soll', 'may': 'darf',
    'not': 'nicht', 'no': 'kein', 'with': 'mit', 'without': 'ohne',
    'from': 'von', 'to': 'zu', 'at': 'bei', 'on': 'am', 'in': 'in',
    'after': 'nach', 'before': 'vor', 'about': 'über', 'under': 'unter',
    'today': 'heute', 'tomorrow': 'morgen', 'yesterday': 'gestern',
    'month': 'Monat', 'year': 'Jahr', 'day': 'Tag', 'week': 'Woche',
    'participation allowance': 'Teilhabegeld', 'property': 'Eigentum', 'storage': 'Kammer',
    'approved': 'genehmigt', 'rejected': 'abgelehnt', 'reason': 'Begründung',
    'task': 'Aufgabe', 'completed': 'erledigt', 'answer': 'Antwort',
    'knowledge': 'Kenntnis', 'taken': 'genommen', 'reviewed': 'geprüft',
    'decision': 'Entscheidung', 'opening': 'Eröffnung', 'personal': 'persönlich',
    'notice': 'Bescheid', 'objection': 'Einspruch', 'deadline': 'Frist',
    'hereby': 'hiermit', 'following': 'folgend', 'very': 'sehr',
    'dear': 'geehrte/r', 'Mr': 'Herr', 'Ms': 'Frau',
    'urgent': 'dringend', 'important': 'wichtig', 'immediately': 'sofort',
    'family': 'Familie', 'relatives': 'Angehörige', 'visit': 'Besuch',
    'medicine': 'Medizin', 'doctor': 'Arzt', 'health': 'Gesundheit',
    'work': 'Arbeit', 'training': 'Ausbildung', 'education': 'Bildung'
  },
  
  // Englisch -> Französisch
  'en-fr': {
    'I': 'je', 'would like': 'voudrais', 'please': 's\'il vous plaît',
    'apply for': 'demander', 'application': 'demande', 'money': 'argent',
    'need': 'ai besoin de', 'for': 'pour', 'the': 'le/la', 'a': 'un/une',
    'my': 'mon/ma', 'and': 'et', 'or': 'ou', 'but': 'mais', 'because': 'parce que',
    'have': 'ai', 'has': 'a', 'am': 'suis', 'is': 'est', 'are': 'sont',
    'will': 'sera', 'was': 'était', 'were': 'étaient',
    'can': 'peux', 'must': 'dois', 'should': 'devrait', 'may': 'peut',
    'not': 'pas', 'no': 'non', 'with': 'avec', 'without': 'sans',
    'from': 'de', 'to': 'à', 'at': 'à', 'on': 'sur', 'in': 'dans',
    'today': 'aujourd\'hui', 'tomorrow': 'demain', 'yesterday': 'hier',
    'month': 'mois', 'year': 'année', 'day': 'jour', 'week': 'semaine',
    'participation allowance': 'allocation de participation', 'property': 'propriété',
    'approved': 'approuvé', 'rejected': 'rejeté', 'reason': 'raison',
    'task': 'tâche', 'completed': 'terminé', 'answer': 'réponse',
    'decision': 'décision', 'opening': 'ouverture', 'personal': 'personnel',
    'urgent': 'urgent', 'important': 'important', 'immediately': 'immédiatement',
    'family': 'famille', 'visit': 'visite', 'doctor': 'médecin', 'health': 'santé'
  },
  
  // Französisch -> Deutsch
  'fr-de': {
    'je': 'ich', 'voudrais': 'möchte', 's\'il vous plaît': 'bitte',
    'demander': 'beantragen', 'demande': 'Antrag', 'argent': 'Geld',
    'ai besoin de': 'benötige', 'pour': 'für', 'le': 'der', 'la': 'die', 'un': 'ein', 'une': 'eine',
    'mon': 'mein', 'ma': 'meine', 'et': 'und', 'ou': 'oder', 'mais': 'aber',
    'ai': 'habe', 'a': 'hat', 'suis': 'bin', 'est': 'ist', 'sont': 'sind',
    'sera': 'wird', 'était': 'war', 'étaient': 'waren',
    'peux': 'kann', 'dois': 'muss', 'devrait': 'sollte', 'peut': 'darf',
    'pas': 'nicht', 'non': 'nein', 'avec': 'mit', 'sans': 'ohne',
    'de': 'von', 'à': 'zu', 'sur': 'auf', 'dans': 'in',
    'aujourd\'hui': 'heute', 'demain': 'morgen', 'hier': 'gestern',
    'mois': 'Monat', 'année': 'Jahr', 'jour': 'Tag', 'semaine': 'Woche',
    'allocation de participation': 'Teilhabegeld', 'propriété': 'Eigentum',
    'approuvé': 'genehmigt', 'rejeté': 'abgelehnt', 'raison': 'Begründung',
    'tâche': 'Aufgabe', 'terminé': 'erledigt', 'réponse': 'Antwort',
    'décision': 'Entscheidung', 'ouverture': 'Eröffnung', 'personnel': 'persönlich',
    'urgent': 'dringend', 'important': 'wichtig', 'immédiatement': 'sofort',
    'famille': 'Familie', 'visite': 'Besuch', 'médecin': 'Arzt', 'santé': 'Gesundheit'
  },
  
  // Französisch -> Englisch
  'fr-en': {
    'je': 'I', 'voudrais': 'would like', 's\'il vous plaît': 'please',
    'demander': 'apply for', 'demande': 'application', 'argent': 'money',
    'ai besoin de': 'need', 'pour': 'for', 'le': 'the', 'la': 'the', 'un': 'a', 'une': 'a',
    'mon': 'my', 'ma': 'my', 'et': 'and', 'ou': 'or', 'mais': 'but',
    'ai': 'have', 'a': 'has', 'suis': 'am', 'est': 'is', 'sont': 'are',
    'aujourd\'hui': 'today', 'demain': 'tomorrow', 'hier': 'yesterday',
    'mois': 'month', 'année': 'year', 'jour': 'day', 'semaine': 'week',
    'allocation de participation': 'participation allowance', 'propriété': 'property',
    'approuvé': 'approved', 'rejeté': 'rejected', 'raison': 'reason',
    'tâche': 'task', 'terminé': 'completed', 'réponse': 'answer',
    'décision': 'decision', 'ouverture': 'opening', 'personnel': 'personal',
    'urgent': 'urgent', 'important': 'important', 'immédiatement': 'immediately',
    'famille': 'family', 'visite': 'visit', 'médecin': 'doctor', 'santé': 'health'
  }
};

// Freitext übersetzen
function translateText(text, fromLang, toLang) {
  if (!text || fromLang === toLang) return text;
  
  const dictKey = `${fromLang}-${toLang}`;
  const dict = TEXT_DICTIONARY[dictKey];
  
  if (!dict) return text;
  
  let result = text;
  
  // Sortiere nach Länge (längere Phrasen zuerst), um "would like" vor "would" zu ersetzen
  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
  
  for (const word of sortedKeys) {
    // Case-insensitive Ersetzung mit Wortgrenzen
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      // Groß-/Kleinschreibung beibehalten
      const translated = dict[word.toLowerCase()] || dict[word];
      if (!translated) return match;
      
      if (match[0] === match[0].toUpperCase()) {
        return translated.charAt(0).toUpperCase() + translated.slice(1);
      }
      return translated;
    });
  }
  
  return result;
}

// Regex-Sonderzeichen escapen
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Text mit Quellsprache speichern und für aktuelle Sprache übersetzen
function getTranslatedUserText(textObj) {
  if (!textObj) return '';
  
  // Wenn es ein einfacher String ist (Altdaten), als Deutsch behandeln
  if (typeof textObj === 'string') {
    return translateText(textObj, 'de', currentLanguage);
  }
  
  // Neues Format: { text: "...", lang: "de" }
  const originalText = textObj.text || textObj;
  const originalLang = textObj.lang || 'de';
  
  return translateText(originalText, originalLang, currentLanguage);
}

// Text-Objekt erstellen (zum Speichern)
function createTranslatableText(text) {
  return {
    text: text,
    lang: currentLanguage
  };
}

// Admin-Zugangsdaten (Fallback ohne Backend – identisch mit server.js: admin/admin)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin'
};

// ============================================
// BENUTZERVERWALTUNG
// ============================================

class UserSystem {
  constructor() {
    this.storageKey = 'gefaengnis_users';
    this.users = this.loadUsers();
    this.migrateUsers(); // Bestehende Benutzer mit Credentials versehen
    this.ensureDefaultUsers(); // Standardbenutzer erstellen wenn keine vorhanden
  }

  loadUsers() {
    try {
      const data = localStorage.getItem(this.storageKey);
      const parsed = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  
  // Standardbenutzer: gleiche Logins wie Server/db-layer, damit Anmeldung immer funktioniert
  _getDefaultUsersList() {
    return [
      { id: 'admin-1', type: 'mitarbeiter', username: 'admin', password: 'admin', vorname: 'Admin', nachname: '', rolle: 'admin', jvas: [], station: null },
      { id: 'val-1', type: 'mitarbeiter', username: 'val1', password: 'val1', vorname: 'Max', nachname: 'Mustermann (VAL)', rolle: 'hausleitung', jvas: ['haus1', 'haus2'], station: null },
      { id: 'avd-1', type: 'mitarbeiter', username: 'avd1', password: 'avd1', vorname: 'Anna', nachname: 'Schmidt (AVD)', rolle: 'mitarbeiter', jvas: ['haus1'], station: '1' },
      { id: 'avd-2', type: 'mitarbeiter', username: 'avd2', password: 'avd2', vorname: 'Peter', nachname: 'Weber (AVD)', rolle: 'mitarbeiter', jvas: ['haus2'], station: '2' },
      { id: 'kammer-1', type: 'mitarbeiter', username: 'kammer1', password: 'kammer1', vorname: 'Kammer', nachname: 'Mitarbeiter', rolle: 'kammer', jvas: [], station: null },
      { id: 'zahlstelle-1', type: 'mitarbeiter', username: 'zahlstelle1', password: 'zahlstelle1', vorname: 'Zahlstelle', nachname: 'Mitarbeiter', rolle: 'zahlstelle', jvas: [], station: null },
      { id: 'arbeit-1', type: 'mitarbeiter', username: 'arbeit1', password: 'arbeit1', vorname: 'Arbeitskoordination', nachname: '', rolle: 'arbeitskoordination', jvas: [], station: null },
      { id: 'anstalt-1', type: 'mitarbeiter', username: 'anstalt1', password: 'anstalt1', vorname: 'Alex', nachname: 'Anstaltsleitung', rolle: 'anstaltsleitung', jvas: [], station: null },
      { id: 'statval-1', type: 'mitarbeiter', username: 'statval1', password: 'statval1', vorname: 'Stationsleitung', nachname: 'Wohngruppenleitung', rolle: 'stationshausleitung', jvas: ['haus1'], station: '1' },
      { id: 'revision-1', type: 'mitarbeiter', username: 'revision1', password: 'revision1', vorname: 'Rita', nachname: 'Revision', rolle: 'revision', jvas: [], station: null },
      { id: 'medizin-1', type: 'mitarbeiter', username: 'medizin1', password: 'medizin1', vorname: 'Maria', nachname: 'Medizinischer Dienst', rolle: 'medizinischer-dienst', jvas: [], station: null },
      { id: 'psychologe-1', type: 'mitarbeiter', username: 'psychologe1', password: 'psychologe1', vorname: 'Paul', nachname: 'Psychologe', rolle: 'psychologe', jvas: [], station: null },
      { id: 'insasse-1', type: 'insasse', username: 'insasse1', password: 'insasse1', vorname: 'Hans', nachname: 'Mueller', rolle: 'insasse', jvas: [], station: '1', jva: 'haus1', insassenNummer: 'INS-001', geburtsdatum: '1985-03-15' },
      { id: 'insasse-2', type: 'insasse', username: 'insasse2', password: 'insasse2', vorname: 'Klaus', nachname: 'Fischer', rolle: 'insasse', jvas: [], station: '2', jva: 'haus2', insassenNummer: 'INS-002', geburtsdatum: '1990-07-22' }
    ];
  }

  ensureDefaultUsers() {
    if (!Array.isArray(this.users)) this.users = [];
    const hasAdmin = this.users.some(u => u && u.username === 'admin');
    if (this.users.length === 0 || !hasAdmin) {
      if (this.users.length === 0) console.log('Keine Benutzer gefunden - erstelle Standardbenutzer...');
      else console.log('Admin-Benutzer fehlt - ergänze Standardbenutzer...');
      const defaults = this._getDefaultUsersList();
      if (this.users.length === 0) {
        defaults.forEach(u => this.users.push(u));
      } else {
        defaults.forEach(du => {
          if (!this.users.some(u => u && u.username === du.username)) this.users.push(du);
        });
      }
      this.saveUsers();
      console.log('Anmeldung z.B. mit admin/admin, val1/val1, avd1/avd1, insasse1/insasse1');
    }
  }

  saveUsers() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.users));
  }

  // Migration: Bestehende Benutzer ohne Credentials oder Insassen-Nummer ergänzen
  // und JVA -> Haus umbenennen
  migrateUsers() {
    let changed = false;
    this.users.forEach(user => {
      // Credentials ergänzen
      if (!user.username || !user.password) {
        user.username = this.generateUsername(user.vorname, user.nachname, user.id);
        user.password = this.generatePassword();
        changed = true;
      }
      // Insassen-Nummer ergänzen
      if (user.type === 'insasse' && !user.insassenNummer) {
        user.insassenNummer = this.generateInsassenNummer();
        changed = true;
      }
      // JVA -> Haus Migration für Insassen
      if (user.type === 'insasse' && user.jva && user.jva.startsWith('jva')) {
        user.jva = user.jva.replace('jva', 'haus');
        changed = true;
      }
      // JVA -> Haus Migration für Mitarbeiter
      if (user.type === 'mitarbeiter' && user.jvas) {
        const neuJvas = user.jvas.map(j => {
          // j kann ein String sein ('haus1') oder ein Objekt ({id: 'haus1', name: 'Haus 1'})
          const jvaId = typeof j === 'string' ? j : (j.id || j);
          if (typeof jvaId === 'string' && jvaId.startsWith('jva')) {
            const newId = jvaId.replace('jva', 'haus');
            return typeof j === 'string' ? newId : { ...j, id: newId };
          }
          return j;
        });
        if (JSON.stringify(neuJvas) !== JSON.stringify(user.jvas)) {
          user.jvas = neuJvas;
          changed = true;
        }
      }
      // Anstaltsweite Rollen: keine Hauszuordnung (wie Kammer/Revision)
      if (user.type === 'mitarbeiter') {
        const r = (user.rolle || '').toString().toLowerCase();
        if (istAnstaltsweiteJvaGruppeRolle(r) && user.jvas && user.jvas.length > 0) {
          user.jvas = [];
          changed = true;
        }
        if (istAnstaltsweiteSpezialrolle(r) && user.station) {
          user.station = null;
          changed = true;
        }
      }
    });
    if (changed) {
      this.saveUsers();
    }
  }

  generateId(type) {
    const prefix = type === 'insasse' ? 'INS' : 'MIT';
    return prefix + '-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Fortlaufende Insassen-Nummer generieren (z.B. "I-0001")
  generateInsassenNummer() {
    const insassen = this.users.filter(u => u.type === 'insasse' && u.insassenNummer);
    let maxNummer = 0;
    
    insassen.forEach(u => {
      const match = u.insassenNummer.match(/^I-(\d+)$/);
      if (match) {
        maxNummer = Math.max(maxNummer, parseInt(match[1]));
      }
    });
    
    return 'I-' + String(maxNummer + 1).padStart(4, '0');
  }

  // Benutzername generieren: nachname + erster Buchstabe vorname
  generateUsername(vorname, nachname, excludeUserId = null) {
    // Basis-Username: nachname + erster Buchstabe vorname (alles kleingeschrieben)
    let baseUsername = (nachname + vorname.charAt(0))
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]/g, '');
    
    // Prüfen ob Benutzername bereits existiert
    const existingUsers = this.users.filter(u => 
      u.id !== excludeUserId && 
      (u.username === baseUsername || (u.username && u.username.match(new RegExp(`^${baseUsername}\\d+$`))))
    );
    
    if (existingUsers.length === 0) {
      return baseUsername;
    }
    
    // Nächste freie Nummer finden (01, 02, 03, ...)
    let maxNumber = 0;
    existingUsers.forEach(u => {
      if (u.username === baseUsername) {
        maxNumber = Math.max(maxNumber, 1);
      } else {
        const match = u.username.match(new RegExp(`^${baseUsername}(\\d+)$`));
        if (match) {
          maxNumber = Math.max(maxNumber, parseInt(match[1]) + 1);
        }
      }
    });
    
    // Nummer mit führender Null formatieren (01, 02, etc.)
    return baseUsername + String(maxNumber).padStart(2, '0');
  }

  // Zufälliges Passwort generieren (8 Zeichen)
  generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Passwort zurücksetzen
  resetPassword(id) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.password = this.generatePassword();
      this.saveUsers();
      return user.password;
    }
    return null;
  }

  // Insasse erstellen
  createInsasse(data) {
    const id = this.generateId('insasse');
    const username = this.generateUsername(data.vorname, data.nachname);
    const password = this.generatePassword();
    const insassenNummer = this.generateInsassenNummer();
    
    const insasse = {
      id: id,
      type: 'insasse',
      insassenNummer: insassenNummer,
      vorname: data.vorname,
      nachname: data.nachname,
      geburtsdatum: data.geburtsdatum,
      jva: data.jva,
      station: data.station,
      username: username,
      password: password,
      erstelltAm: new Date().toISOString()
    };
    this.users.push(insasse);
    this.saveUsers();
    return insasse;
  }

  // Mitarbeiter erstellen
  createMitarbeiter(data) {
    const id = this.generateId('mitarbeiter');
    const username = this.generateUsername(data.vorname, data.nachname);
    const password = this.generatePassword();
    
    const mitarbeiter = {
      id: id,
      type: 'mitarbeiter',
      vorname: data.vorname,
      nachname: data.nachname,
      geburtsdatum: data.geburtsdatum,
      rolle: data.rolle,
      jvas: data.jvas,
      station: data.station,
      username: username,
      password: password,
      erstelltAm: new Date().toISOString()
    };
    this.users.push(mitarbeiter);
    this.saveUsers();
    return mitarbeiter;
  }

  // Benutzer aktualisieren
  updateUser(id, data) {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      const oldUser = this.users[index];
      
      // Wenn Name geändert wurde, neuen Benutzernamen generieren
      if (data.vorname && data.nachname && 
          (data.vorname !== oldUser.vorname || data.nachname !== oldUser.nachname)) {
        data.username = this.generateUsername(data.vorname, data.nachname, id);
      }
      
      this.users[index] = { ...this.users[index], ...data };
      this.saveUsers();
      return this.users[index];
    }
    return null;
  }

  // Benutzer löschen
  deleteUser(id) {
    this.users = this.users.filter(u => u.id !== id);
    this.saveUsers();
  }

  // Benutzer nach ID abrufen
  getUser(id) {
    return this.users.find(u => u.id === id);
  }

  // Alle Insassen abrufen
  getInsassen() {
    return this.users.filter(u => u.type === 'insasse')
      .sort((a, b) => a.nachname.localeCompare(b.nachname));
  }

  // Alle Mitarbeiter abrufen
  getMitarbeiter() {
    return this.users.filter(u => u.type === 'mitarbeiter')
      .sort((a, b) => a.nachname.localeCompare(b.nachname));
  }

  // Hilfsfunktion: Normalisiert Haus-ID (jva1 -> haus1)
  _normalisiereHausId(hausId) {
    if (!hausId) return hausId;
    return hausId.replace('jva', 'haus');
  }

  // Hilfsfunktion: Prüft ob Haus-ID in Array enthalten ist (kompatibel mit jva/haus)
  _hausIdInArray(hausId, hausArray) {
    if (!hausId || !hausArray) return false;
    const normalisiert = this._normalisiereHausId(hausId);
    return hausArray.some(h => this._normalisiereHausId(h) === normalisiert);
  }

  hasStationshausleitung(hausId, stationId, excludeUserId = null) {
    const normalisiert = this._normalisiereHausId(hausId);
    return this.users.some((u) =>
      u.type === 'mitarbeiter' &&
      u.rolle === 'stationshausleitung' &&
      (excludeUserId == null || u.id !== excludeUserId) &&
      u.jvas &&
      u.jvas.some((h) => this._normalisiereHausId(h) === normalisiert) &&
      String(u.station ?? '') === String(stationId ?? '')
    );
  }

  hasAnstaltsleitung(excludeUserId = null) {
    return this.users.some(
      (u) =>
        u.type === 'mitarbeiter' &&
        u.rolle === 'anstaltsleitung' &&
        (excludeUserId == null || u.id !== excludeUserId)
    );
  }

  // Prüfen ob Hausleitung existiert
  hasJvaLeitung(hausId) {
    const normalisiert = this._normalisiereHausId(hausId);
    return this.users.some(u => 
      u.type === 'mitarbeiter' && 
      (u.rolle === 'jva-leitung' || u.rolle === 'haus-leitung') && 
      u.jvas && u.jvas.some(h => this._normalisiereHausId(h) === normalisiert)
    );
  }

  // Prüfen ob Stationsleitung existiert
  hasStationsleitung(hausId, stationId) {
    const normalisiert = this._normalisiereHausId(hausId);
    return this.users.some(u => 
      u.type === 'mitarbeiter' && 
      u.rolle === 'stationsleitung' && 
      u.jvas && u.jvas.some(h => this._normalisiereHausId(h) === normalisiert) &&
      u.station === stationId
    );
  }

  // Hausleitung für ein Haus abrufen (für Validierung beim Bearbeiten)
  getJvaLeitung(hausId, excludeUserId = null) {
    const normalisiert = this._normalisiereHausId(hausId);
    return this.users.find(u => 
      u.type === 'mitarbeiter' && 
      (u.rolle === 'jva-leitung' || u.rolle === 'haus-leitung') && 
      u.jvas && u.jvas.some(h => this._normalisiereHausId(h) === normalisiert) &&
      u.id !== excludeUserId
    );
  }

  // Stationsleitung für eine Station abrufen (für Validierung beim Bearbeiten)
  getStationsleitung(hausId, stationId, excludeUserId = null) {
    const normalisiert = this._normalisiereHausId(hausId);
    return this.users.find(u => 
      u.type === 'mitarbeiter' && 
      u.rolle === 'stationsleitung' && 
      u.jvas && u.jvas.some(h => this._normalisiereHausId(h) === normalisiert) &&
      u.station === stationId &&
      u.id !== excludeUserId
    );
  }
}

// Globale User-Instanz
const userSystem = new UserSystem();
// Auch auf window setzen für globale Verfügbarkeit
if (typeof window !== 'undefined') {
  window.userSystem = userSystem;
}
// Auch auf window setzen für globale Verfügbarkeit
if (typeof window !== 'undefined') {
  window.userSystem = userSystem;
}

// ============================================
// BENACHRICHTIGUNGSSYSTEM
// ============================================

class NotificationSystem {
  constructor() {
    this.storageKey = 'gefaengnis_notifications';
    this.notifications = this.loadNotifications();
  }

  loadNotifications() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveNotifications() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
  }

  generateId() {
    return 'NOT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  _notificationTs(n) {
    const ts = new Date(n?.erstelltAm || 0).getTime();
    if (Number.isFinite(ts)) return ts;
    return 0;
  }

  // Benachrichtigung erstellen
  createNotification(userId, type, title, message, antragId = null) {
    const notification = {
      id: this.generateId(),
      userId: userId,
      type: type, // 'genehmigt', 'abgelehnt', 'zurueckgegeben', 'info'
      title: title,
      message: message,
      antragId: antragId,
      gelesen: false,
      erstelltAm: new Date().toISOString()
    };
    this.notifications.push(notification);
    this.saveNotifications();
    return notification;
  }

  // Ungelesene Benachrichtigungen für einen Benutzer
  getUngeleseneNotifications(userId) {
    const uid = String(userId);
    return this.notifications
      .filter((n) => String(n.userId) === uid && !n.gelesen)
      .sort((a, b) => this._notificationTs(b) - this._notificationTs(a));
  }

  // Alle Benachrichtigungen für einen Benutzer
  getAllNotifications(userId) {
    const uid = String(userId);
    return this.notifications
      .filter((n) => String(n.userId) === uid)
      .sort((a, b) => this._notificationTs(b) - this._notificationTs(a));
  }

  // Benachrichtigung als gelesen markieren
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.gelesen = true;
      this.saveNotifications();
    }
  }

  // Alle Benachrichtigungen eines Benutzers als gelesen markieren
  markAllAsRead(userId) {
    const uid = String(userId);
    let changed = false;
    this.notifications.forEach(n => {
      if (String(n.userId) === uid && !n.gelesen) {
        n.gelesen = true;
        changed = true;
      }
    });
    if (changed) {
      this.saveNotifications();
    }
  }

  // Anzahl ungelesener Benachrichtigungen
  getUnreadCount(userId) {
    const uid = String(userId);
    return this.notifications.filter((n) => String(n.userId) === uid && !n.gelesen).length;
  }
}

const notificationSystem = new NotificationSystem();

// ============================================
// SESSION-MANAGEMENT
// ============================================

class SessionManager {
  constructor() {
    this.sessionKey = 'gefaengnis_session';
  }

  // Login für Insassen oder Mitarbeiter
  login(username, password, expectedType = null) {
    const user = userSystem.users.find(u => 
      u.username === username && 
      u.password === password &&
      (expectedType === null || u.type === expectedType)
    );
    
    if (user) {
      const session = {
        userId: user.id,
        type: user.type,
        username: user.username,
        name: `${user.vorname} ${user.nachname}`,
        jva: user.jva,
        station: user.station,
        rolle: user.rolle || null,
        jvas: user.jvas || null,
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
      return { success: true, user: session };
    }
    return { success: false, message: 'Ungültige Zugangsdaten' };
  }

  loginAsUser(userId, expectedType = null) {
    const sid = String(userId);
    const user = userSystem.users.find((u) =>
      String(u.id) === sid &&
      (expectedType === null || u.type === expectedType)
    );

    if (user) {
      const session = {
        userId: user.id,
        type: user.type,
        username: user.username,
        name: `${user.vorname} ${user.nachname}`.trim() || user.name || user.username,
        jva: user.jva,
        station: user.station,
        rolle: user.rolle || null,
        jvas: user.jvas || null,
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
      return { success: true, user: session };
    }
    return { success: false, message: 'Benutzer nicht gefunden' };
  }

  logout() {
    sessionStorage.removeItem(this.sessionKey);
  }

  getSession() {
    const data = sessionStorage.getItem(this.sessionKey);
    return data ? JSON.parse(data) : null;
  }

  setSession(session) {
    sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
  }

  isLoggedIn() {
    return this.getSession() !== null;
  }

  isInsasse() {
    const session = this.getSession();
    return session && session.type === 'insasse';
  }

  isMitarbeiter() {
    const session = this.getSession();
    return session && session.type === 'mitarbeiter';
  }

  // Session aus Server-Login-Antwort setzen (wenn data-sync.js mit Backend verwendet wird)
  setSessionFromServer(serverUser) {
    const type = serverUser.rolle === 'insasse' ? 'insasse' : 'mitarbeiter';
    
    // Name aus verschiedenen Quellen zusammenstellen
    let name = '';
    if (serverUser.name) {
      name = serverUser.name;
    } else if (serverUser.vorname && serverUser.nachname) {
      name = `${serverUser.vorname} ${serverUser.nachname}`;
    } else if (serverUser.vorname) {
      name = serverUser.vorname;
    } else {
      name = serverUser.username || '';
    }
    
    const session = {
      userId: serverUser.id || serverUser.userId,
      type: type,
      username: serverUser.username,
      name: name,
      jva: serverUser.jva,
      station: serverUser.station,
      rolle: serverUser.rolle || null,
      jvas: serverUser.jvas || null,
      loginTime: new Date().toISOString()
    };
    sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
  }
}

const sessionManager = new SessionManager();

// ============================================
// AKTIVITÄTEN-/VERLAUFSSYSTEM
// ============================================

class AktivitaetenSystem {
  constructor() {
    this.storageKey = 'gefaengnis_aktivitaeten';
    this.aktivitaeten = this.loadAktivitaeten();
  }

  loadAktivitaeten() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  /** Vereinigt localStorage und Speicher-Array (falls sie auseinanderlaufen). */
  _mergeAktivitaetenQuelle() {
    let stored = [];
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) stored = JSON.parse(raw);
    } catch (_) {
      stored = [];
    }
    if (!Array.isArray(stored)) stored = [];
    const mem = Array.isArray(this.aktivitaeten) ? this.aktivitaeten : [];
    const map = new Map();
    const add = (item) => {
      if (!item || item.id == null || String(item.id) === '') return;
      const id = String(item.id);
      const prev = map.get(id);
      if (!prev) {
        map.set(id, item);
        return;
      }
      const tPrev = new Date(prev.erstelltAm || 0).getTime();
      const tNew = new Date(item.erstelltAm || 0).getTime();
      map.set(id, tNew >= tPrev ? { ...prev, ...item } : { ...item, ...prev });
    };
    stored.forEach(add);
    mem.forEach(add);
    return Array.from(map.values());
  }

  saveAktivitaeten() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.aktivitaeten));
  }

  generateId() {
    return 'AKT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Aktivität protokollieren
  logAktivitaet(data) {
    const aktivitaet = {
      id: this.generateId(),
      antragId: data.antragId,
      typ: data.typ, // 'erstellt', 'genommen', 'entscheidung', 'aufgabe-erstellt', 'aufgabe-erledigt', 'persoenlich-eroeffnet'
      beschreibung: data.beschreibung,
      details: data.details || null,
      benutzerTyp: data.benutzerTyp, // 'insasse' oder 'mitarbeiter'
      benutzerId: data.benutzerId,
      benutzerName: data.benutzerName,
      erstelltAm: new Date().toISOString()
    };
    this.aktivitaeten.push(aktivitaet);
    this.saveAktivitaeten();
    return aktivitaet;
  }

  // Alle Aktivitäten zu einem Antrag (chronologisch sortiert)
  getAktivitaetenZuAntrag(antragId) {
    const aid = String(antragId);
    return this._mergeAktivitaetenQuelle()
      .filter((a) => {
        if (String(a.antragId) !== aid) return false;
        // Private Notizen nicht im Bearbeitungsverlauf (defensiv; werden beim Speichern nicht protokolliert)
        if (a.typ === 'kommentar' && a.details && a.details.kommentarTyp === 'privat') return false;
        return true;
      })
      .sort((a, b) => new Date(a.erstelltAm) - new Date(b.erstelltAm));
  }
  
  // Alle Mitarbeiter-IDs, die an einem Antrag gearbeitet haben
  getBeteiligteMitarbeiter(antragId) {
    const aid = String(antragId);
    const mitarbeiterIds = new Set();
    this._mergeAktivitaetenQuelle()
      .filter(a => String(a.antragId) === aid && a.benutzerTyp === 'mitarbeiter')
      .forEach(a => mitarbeiterIds.add(a.benutzerId));
    return Array.from(mitarbeiterIds);
  }
  
  // Prüft ob ein Mitarbeiter an einem Antrag beteiligt war
  istMitarbeiterBeteiligt(antragId, mitarbeiterId) {
    const aid = String(antragId);
    return this._mergeAktivitaetenQuelle().some(a =>
      String(a.antragId) === aid &&
      a.benutzerTyp === 'mitarbeiter' &&
      a.benutzerId === mitarbeiterId
    );
  }
}

const aktivitaetenSystem = new AktivitaetenSystem();

// ============================================
// TERMINSYSTEM
// ============================================

// ============================================
// EXTERNE PARTNER (Terminbuchung wie Zahnarzt)
// ============================================

function parseZeitZuMinuten(zeit) {
  if (!zeit) return 0;
  const [h, m] = String(zeit).split(':').map((x) => parseInt(x, 10) || 0);
  return h * 60 + m;
}

function minutenZuZeit(minuten) {
  const h = Math.floor(minuten / 60);
  const m = minuten % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function normalizeDatumIso(datum) {
  if (!datum) return '';
  const s = String(datum);
  return s.includes('T') ? s.split('T')[0] : s.slice(0, 10);
}

function normalizeUhrzeit(zeit) {
  if (!zeit) return '00:00';
  const parts = String(zeit).split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function datumIsoLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function generateTeamsMeetingLink() {
  const id = Date.now().toString(36);
  return `https://teams.microsoft.com/l/meetup-join/19%3ameeting-${id}-jvp/0?context={"Tid":"prototyp"}`;
}

class ExternePartnerSystem {
  constructor() {
    this.storageKey = 'gefaengnis_externe_partner';
    this.partner = this.load();
    this.seedDefaultsIfEmpty();
  }

  load() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.partner));
  }

  generateId(prefix) {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  seedDefaultsIfEmpty() {
    if (this.partner.length > 0) return;
    this.partner = [
      {
        id: 'ep-pastor',
        name: 'Pfarrer Thomas Meyer',
        email: 'pastor.meyer@jva-prototyp.de',
        beruf: 'Pastor',
        aktiv: true,
        services: [
          { id: 'svc-seelsorge', name: 'Seelsorggespräch', dauerMinuten: 45 },
          { id: 'svc-trauung', name: 'Trauungsvorbereitung', dauerMinuten: 30 }
        ],
        verfuegbarkeiten: [
          { wochentag: 1, von: '09:00', bis: '12:00' },
          { wochentag: 1, von: '14:00', bis: '16:00' },
          { wochentag: 3, von: '10:00', bis: '15:00' },
          { wochentag: 5, von: '09:00', bis: '11:00' }
        ]
      },
      {
        id: 'ep-suchtberater',
        name: 'Dr. Anna Weber',
        email: 'a.weber@suchtberatung-prototyp.de',
        beruf: 'Suchtberaterin',
        aktiv: true,
        services: [
          { id: 'svc-beratung', name: 'Suchtberatung', dauerMinuten: 50 },
          { id: 'svc-nachsorge', name: 'Nachsorgegespräch', dauerMinuten: 30 }
        ],
        verfuegbarkeiten: [
          { wochentag: 2, von: '08:00', bis: '12:00' },
          { wochentag: 2, von: '13:00', bis: '16:00' },
          { wochentag: 4, von: '09:00', bis: '14:00' }
        ]
      },
      {
        id: 'ep-uebergang',
        name: 'Marc Hoffmann',
        email: 'm.hoffmann@uebergang-prototyp.de',
        beruf: 'Übergangsmanager',
        aktiv: true,
        services: [
          { id: 'svc-uebergang', name: 'Übergangsmanagement', dauerMinuten: 60 }
        ],
        verfuegbarkeiten: [
          { wochentag: 1, von: '10:00', bis: '16:00' },
          { wochentag: 4, von: '10:00', bis: '15:00' }
        ]
      }
    ];
    this.save();
  }

  getPartner(id) {
    return this.partner.find((p) => String(p.id) === String(id));
  }

  getAktivePartner() {
    return this.partner.filter((p) => p.aktiv !== false);
  }

  getAlleServices() {
    const list = [];
    this.getAktivePartner().forEach((p) => {
      (p.services || []).forEach((s) => {
        list.push({
          serviceId: s.id,
          serviceName: s.name,
          dauerMinuten: s.dauerMinuten || 30,
          partnerId: p.id,
          partnerName: p.name,
          partnerBeruf: p.beruf || ''
        });
      });
    });
    return list;
  }

  getPartnerMitService(serviceId) {
    return this.getAktivePartner().filter((p) =>
      (p.services || []).some((s) => s.id === serviceId)
    );
  }

  getService(partnerId, serviceId) {
    const p = this.getPartner(partnerId);
    if (!p) return null;
    return (p.services || []).find((s) => s.id === serviceId) || null;
  }

  createPartner(data) {
    const partner = {
      id: this.generateId('EP'),
      name: data.name,
      email: data.email,
      beruf: data.beruf || '',
      aktiv: data.aktiv !== false,
      services: (data.services || []).map((s) => ({
        id: s.id || this.generateId('SVC'),
        name: s.name,
        dauerMinuten: parseInt(s.dauerMinuten, 10) || 30
      })),
      verfuegbarkeiten: (data.verfuegbarkeiten || []).map((v) => ({
        wochentag: parseInt(v.wochentag, 10),
        von: v.von,
        bis: v.bis
      }))
    };
    this.partner.push(partner);
    this.save();
    return partner;
  }

  updatePartner(id, data) {
    const p = this.getPartner(id);
    if (!p) return null;
    if (data.name != null) p.name = data.name;
    if (data.email != null) p.email = data.email;
    if (data.beruf != null) p.beruf = data.beruf;
    if (data.aktiv != null) p.aktiv = data.aktiv;
    if (data.services) {
      p.services = data.services.map((s) => ({
        id: s.id || this.generateId('SVC'),
        name: s.name,
        dauerMinuten: parseInt(s.dauerMinuten, 10) || 30
      }));
    }
    if (data.verfuegbarkeiten) {
      p.verfuegbarkeiten = data.verfuegbarkeiten.map((v) => ({
        wochentag: parseInt(v.wochentag, 10),
        von: v.von,
        bis: v.bis
      }));
    }
    this.save();
    return p;
  }

  deletePartner(id) {
    this.partner = this.partner.filter((p) => String(p.id) !== String(id));
    this.save();
  }

  isSlotBelegt(partnerId, datum, uhrzeit, dauerMinuten) {
    if (typeof terminSystem === 'undefined') return false;
    const normDatum = normalizeDatumIso(datum);
    const start = parseZeitZuMinuten(normalizeUhrzeit(uhrzeit));
    const end = start + (dauerMinuten || 30);
    return terminSystem.termine.some((t) => {
      if (t.typ !== 'vereinbarung') return false;
      const istExtern =
        t.teilnehmerArt === 'extern' || t.externPartnerId || (t.externKontakt && t.externKontakt.id);
      if (!istExtern) return false;
      const tPartnerId = t.externPartnerId || t.externKontakt?.id;
      if (!tPartnerId || String(tPartnerId) !== String(partnerId)) return false;
      if (normalizeDatumIso(t.datum) !== normDatum) return false;
      const tDauer = t.dauerMinuten || t.externKontakt?.dauerMinuten || 30;
      const tStart = parseZeitZuMinuten(normalizeUhrzeit(t.uhrzeit));
      const tEnd = tStart + tDauer;
      return start < tEnd && end > tStart;
    });
  }

  getVerfuegbareSlots(partnerId, serviceId, options = {}) {
    const partner = this.getPartner(partnerId);
    const service = this.getService(partnerId, serviceId);
    if (!partner || !service) return [];

    const dauer = service.dauerMinuten || 30;
    const tage = options.tage != null ? options.tage : 42;
    const ab = options.abDatum ? new Date(options.abDatum) : new Date();
    ab.setHours(0, 0, 0, 0);

    const slots = [];
    const WOCHENTAGE_KURZ = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

    for (let d = 0; d < tage; d++) {
      const tag = new Date(ab);
      tag.setDate(tag.getDate() + d);
      const wd = tag.getDay();
      const datumIso = datumIsoLocal(tag);
      const fenster = (partner.verfuegbarkeiten || []).filter(
        (v) => parseInt(v.wochentag, 10) === wd
      );

      fenster.forEach((fen) => {
        let cursor = parseZeitZuMinuten(fen.von);
        const ende = parseZeitZuMinuten(fen.bis);
        while (cursor + dauer <= ende) {
          const uhrzeit = minutenZuZeit(cursor);
          if (!this.isSlotBelegt(partnerId, datumIso, uhrzeit, dauer)) {
            const datumObj = new Date(datumIso + 'T12:00:00');
            const label = `${WOCHENTAGE_KURZ[wd]}, ${datumObj.toLocaleDateString('de-DE')} · ${uhrzeit} Uhr`;
            slots.push({
              datum: datumIso,
              uhrzeit,
              dauerMinuten: dauer,
              label,
              slotKey: `${datumIso}|${uhrzeit}`
            });
          }
          cursor += dauer;
        }
      });
    }
    return slots;
  }
}

const externePartnerSystem = new ExternePartnerSystem();

class TerminSystem {
  constructor() {
    this.storageKey = 'gefaengnis_termine';
    this.termine = this.loadTermine();
  }

  loadTermine() {
    const data = localStorage.getItem(this.storageKey);
    const termine = data ? JSON.parse(data) : [];
    this.termine = termine;
    this.migrateInsasseTermine();
    return this.termine;
  }

  /**
   * Alte Vereinbarungstermine normalisieren (typ, sichtbarFuer, Betreff) für Insassen-Kalender.
   */
  migrateInsasseTermine() {
    if (!Array.isArray(this.termine)) return;
    let changed = false;
    const nurMitarbeiterTypen = new Set(['admin', 'persoenlich', 'haus', 'station']);

    this.termine.forEach((t) => {
      if (!t || typeof t !== 'object') return;

      if (!t.betreff && t.titel) {
        t.betreff = t.titel;
        changed = true;
      }
      if (!t.titel && t.betreff) {
        t.titel = t.betreff;
        changed = true;
      }

      if (nurMitarbeiterTypen.has(t.typ)) return;

      const hatInsassenBezug =
        t.insasseId ||
        t.insasseName ||
        t.antragId ||
        t.teilnehmerArt === 'extern' ||
        t.teilnehmerArt === 'intern' ||
        t.externKontakt ||
        t.externPartnerId;

      if (!hatInsassenBezug) return;

      if (t.typ !== 'vereinbarung' && t.typ !== 'aufgabe') {
        t.typ = t.aufgabeId ? 'aufgabe' : 'vereinbarung';
        changed = true;
      }

      let insasseId = t.insasseId;
      if (!insasseId && t.antragId && typeof antragSystem !== 'undefined') {
        const a = antragSystem.getAntrag(t.antragId);
        if (a?.insasseId) {
          insasseId = a.insasseId;
          t.insasseId = insasseId;
          changed = true;
        }
        if (!t.insasseName && a?.insasseName) {
          t.insasseName = a.insasseName;
          changed = true;
        }
      }

      if (insasseId) {
        const sid = String(insasseId);
        if (!Array.isArray(t.sichtbarFuer)) {
          t.sichtbarFuer = [sid];
          changed = true;
        } else if (!t.sichtbarFuer.some((x) => String(x) === sid)) {
          t.sichtbarFuer.push(sid);
          changed = true;
        }
      }
    });

    if (changed) this.saveTermine();
  }

  _terminGehoertZuInsasse(t, insasseId, insasseName) {
    const id = String(insasseId);
    const nameNorm = (insasseName || '').trim().toLowerCase();

    if (String(t.insasseId) === id) return true;
    if (Array.isArray(t.sichtbarFuer) && t.sichtbarFuer.some((sid) => String(sid) === id)) {
      return true;
    }
    if (nameNorm && t.insasseName && String(t.insasseName).trim().toLowerCase() === nameNorm) {
      return true;
    }
    if (t.antragId && typeof antragSystem !== 'undefined') {
      const a = antragSystem.getAntrag(t.antragId);
      if (a) {
        if (String(a.insasseId) === id) return true;
        if (
          nameNorm &&
          a.insasseName &&
          String(a.insasseName).trim().toLowerCase() === nameNorm
        ) {
          return true;
        }
      }
    }
    if (t.typ === 'aufgabe' && t.aufgabeId && typeof aufgabenSystem !== 'undefined') {
      const auf = aufgabenSystem.aufgaben.find((x) => x.id === t.aufgabeId);
      if (auf && String(auf.zugewiesenAnId) === id) return true;
    }
    return false;
  }

  _istKalenderRelevanterInsasseTermin(t) {
    if (!t) return false;
    const nurMitarbeiter = new Set(['admin', 'persoenlich', 'haus', 'station']);
    if (nurMitarbeiter.has(t.typ)) return false;
    if (t.typ === 'vereinbarung' || t.typ === 'aufgabe') return true;
    if (
      t.insasseId ||
      t.insasseName ||
      t.antragId ||
      t.teilnehmerArt ||
      t.externKontakt ||
      t.externPartnerId
    ) {
      return true;
    }
    return false;
  }

  saveTermine() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.termine));
  }

  generateId() {
    return 'TRM-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Termin erstellen
  createTermin(data) {
    const termin = {
      id: this.generateId(),
      titel: data.titel,
      beschreibung: data.beschreibung || '',
      datum: data.datum,
      uhrzeit: data.uhrzeit || null,
      typ: data.typ, // 'admin', 'persoenlich', 'aufgabe', 'haus', 'station'
      erstelltVonId: data.erstelltVonId,
      erstelltVonName: data.erstelltVonName,
      // Für Sichtbarkeit
      hausId: data.hausId || null,
      stationId: data.stationId || null,
      // Für Aufgaben-Termine
      aufgabeId: data.aufgabeId || null,
      antragId: data.antragId || null,
      sichtbarFuer: data.sichtbarFuer || [], // Array von User-IDs für spezielle Sichtbarkeit
      erstelltAm: new Date().toISOString()
    };
    this.termine.push(termin);
    this.saveTermine();
    return termin;
  }

  // Termin aktualisieren
  updateTermin(id, data) {
    const index = this.termine.findIndex(t => t.id === id);
    if (index !== -1) {
      this.termine[index] = { ...this.termine[index], ...data };
      this.saveTermine();
      return this.termine[index];
    }
    return null;
  }

  // Termin löschen
  deleteTermin(id) {
    const index = this.termine.findIndex(t => t.id === id);
    if (index !== -1) {
      this.termine.splice(index, 1);
      this.saveTermine();
      return true;
    }
    return false;
  }

  // Termine für einen Mitarbeiter abrufen (basierend auf Sichtbarkeit)
  getTermineFuerMitarbeiter(mitarbeiter) {
    const normalisiereHaus = (h) => h ? h.replace('jva', 'haus') : h;
    const r = String(mitarbeiter.rolle || '').toLowerCase();
    const istValFuerTermin =
      r === 'hausleitung' ||
      r === 'jva-leitung' ||
      r === 'haus-leitung' ||
      r === 'anstaltsleitung' ||
      r === 'stationshausleitung';
    
    return this.termine.filter(t => {
      // Admin-Termine: Für alle sichtbar
      if (t.typ === 'admin') return true;
      
      // Persönliche Termine: Nur für den Ersteller (auch Hausleitung sieht fremde private nicht)
      if (t.typ === 'persoenlich') {
        return t.erstelltVonId === mitarbeiter.userId;
      }
      
      // Aufgaben-Termine: Für die in sichtbarFuer eingetragenen User (Hausleitung sieht fremde Aufgaben-Termine nicht)
      if (t.typ === 'aufgabe') {
        const uid = String(mitarbeiter.userId);
        return Array.isArray(t.sichtbarFuer) && t.sichtbarFuer.some((id) => String(id) === uid);
      }

      // Vereinbarungstermine (Bekanntgabe): nur für eingeladene Mitarbeitende
      if (t.typ === 'vereinbarung') {
        const uid = String(mitarbeiter.userId);
        return Array.isArray(t.sichtbarFuer) && t.sichtbarFuer.some((id) => String(id) === uid);
      }
      
      // Haus-Termine: Für alle Mitarbeiter des Hauses (inkl. Ersteller)
      if (t.typ === 'haus') {
        if (t.erstelltVonId === mitarbeiter.userId) return true;
        if (r === 'anstaltsleitung') return true;
        if (!mitarbeiter.jvas) return false;
        return mitarbeiter.jvas.some(j => normalisiereHaus(j) === normalisiereHaus(t.hausId));
      }
      
      // Stations-Termine: Für alle Mitarbeiter der Station (inkl. Ersteller)
      // HAUSLEITUNG sieht alle Stationstermine ihres Hauses
      if (t.typ === 'station') {
        // Ersteller sieht immer seinen eigenen Termin
        if (t.erstelltVonId === mitarbeiter.userId) return true;
        if (!mitarbeiter.jvas) return false;
        
        const imSelbenHaus = mitarbeiter.jvas.some(j => normalisiereHaus(j) === normalisiereHaus(t.hausId));
        
        if (istValFuerTermin && imSelbenHaus) {
          if (r === 'anstaltsleitung') return true;
          if (r === 'stationshausleitung') {
            return String(mitarbeiter.station ?? '') === String(t.stationId ?? '');
          }
          return true;
        }
        
        // Normale Mitarbeiter nur auf ihrer Station
        const aufSelberStation = mitarbeiter.station === t.stationId;
        return imSelbenHaus && aufSelberStation;
      }
      
      return false;
    }).sort((a, b) => new Date(a.datum) - new Date(b.datum));
  }

  // Termine für einen bestimmten Monat
  getTermineFuerMonat(mitarbeiter, jahr, monat) {
    const termine = this.getTermineFuerMitarbeiter(mitarbeiter);
    return termine.filter(t => {
      const d = new Date(t.datum);
      return d.getFullYear() === jahr && d.getMonth() === monat;
    });
  }

  // Termine für einen bestimmten Tag
  getTermineFuerTag(mitarbeiter, datum) {
    const termine = this.getTermineFuerMitarbeiter(mitarbeiter);
    const tag = new Date(datum).toDateString();
    return termine.filter(t => new Date(t.datum).toDateString() === tag);
  }

  _getAufgabeText(field) {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object' && field.text) return field.text;
    return String(field);
  }

  _getLinkedTerminFuerAufgabe(aufgabe) {
    if (!aufgabe?.terminId) return null;
    return this.termine.find((t) => String(t.id) === String(aufgabe.terminId)) || null;
  }

  /** Kalendereintrag für übernommene Begleitungsaufgabe (Termindatum/-zeit). */
  syncBegleitungKalenderFuerAufgabe(aufgabe) {
    if (!aufgabe || aufgabe.zugewiesenAnTyp !== 'mitarbeiter' || !aufgabe.zugewiesenAnId) {
      return null;
    }
    const linked = this._getLinkedTerminFuerAufgabe(aufgabe);
    const datum = linked?.datum || aufgabe.fristDatum;
    if (!datum) return null;

    const uhrzeit = linked?.uhrzeit || aufgabe.terminUhrzeit || null;
    const titelBasis = linked?.betreff || linked?.titel || this._getAufgabeText(aufgabe.kurzbeschreibung);
    const titelRaw = `Begleitung: ${titelBasis}`;
    const titelKurz = titelRaw.length > 80 ? `${titelRaw.substring(0, 77)}…` : titelRaw;
    const beschreibung =
      this._getAufgabeText(aufgabe.beschreibung) ||
      `Begleitung des Insassen zum vereinbarten Termin.`;
    const sichtbarFuer = [String(aufgabe.erstelltVonId), String(aufgabe.zugewiesenAnId)].filter(
      (x) => x != null && x !== '' && x !== 'undefined'
    );

    const existierend = this.termine.find((t) => t.aufgabeId === aufgabe.id);
    if (existierend) {
      return (
        this.updateTermin(existierend.id, {
          titel: titelKurz,
          beschreibung,
          datum,
          uhrzeit,
          antragId: aufgabe.antragId,
          sichtbarFuer
        }) || existierend
      );
    }

    return this.createTermin({
      titel: titelKurz,
      beschreibung,
      datum,
      uhrzeit,
      typ: 'aufgabe',
      erstelltVonId: aufgabe.erstelltVonId,
      erstelltVonName: aufgabe.erstelltVonName,
      aufgabeId: aufgabe.id,
      antragId: aufgabe.antragId,
      sichtbarFuer
    });
  }

  // Aufgaben-Termin erstellen (automatisch bei Aufgabe mit Frist)
  createAufgabenTermin(aufgabe) {
    if (!aufgabe || !aufgabe.fristDatum) return null;
    if (aufgabe.terminBegleitung || aufgabe.terminId) {
      return this.syncBegleitungKalenderFuerAufgabe(aufgabe);
    }
    // Nur persönlich zugewiesene Mitarbeiter: Frist im persönlichen Kalender
    if (aufgabe.zugewiesenAnTyp !== 'mitarbeiter') {
      this.deleteAufgabenTermin(aufgabe.id);
      return null;
    }

    const titelText = this._getAufgabeText(aufgabe.kurzbeschreibung) || this._getAufgabeText(aufgabe.beschreibung);
    const titelKurz = titelText.substring(0, 50) + (titelText.length > 50 ? '...' : '');
    const linked = this._getLinkedTerminFuerAufgabe(aufgabe);
    const uhrzeit = linked?.uhrzeit || aufgabe.terminUhrzeit || null;
    const sichtbarFuer = [String(aufgabe.erstelltVonId), String(aufgabe.zugewiesenAnId)].filter(
      (x) => x != null && x !== '' && x !== 'undefined'
    );

    const existierend = this.termine.find((t) => t.aufgabeId === aufgabe.id);
    if (existierend) {
      return (
        this.updateTermin(existierend.id, {
          titel: `Aufgabe: ${titelKurz}`,
          beschreibung: this._getAufgabeText(aufgabe.beschreibung),
          datum: aufgabe.fristDatum,
          uhrzeit,
          antragId: aufgabe.antragId,
          sichtbarFuer
        }) || existierend
      );
    }

    return this.createTermin({
      titel: `Aufgabe: ${titelKurz}`,
      beschreibung: this._getAufgabeText(aufgabe.beschreibung),
      datum: aufgabe.fristDatum,
      uhrzeit,
      typ: 'aufgabe',
      erstelltVonId: aufgabe.erstelltVonId,
      erstelltVonName: aufgabe.erstelltVonName,
      aufgabeId: aufgabe.id,
      antragId: aufgabe.antragId,
      sichtbarFuer
    });
  }

  /**
   * Stellt sicher, dass jede offene Mitarbeiter-Aufgabe mit Frist einen Kalendereintrag hat
   * (z. B. nach Server-Sync, wenn Termine lokal fehlten).
   */
  syncAufgabenFristenFromAufgaben(aufgaben) {
    const list = Array.isArray(aufgaben) ? aufgaben : [];
    const alive = new Set(list.map((a) => a && a.id).filter(Boolean));
    for (const auf of list) {
      if (!auf || auf.status === 'geloescht') continue;
      const gueltig =
        auf.status === 'offen' && auf.zugewiesenAnTyp === 'mitarbeiter' && !!auf.fristDatum;
      if (gueltig) this.createAufgabenTermin(auf);
      else this.deleteAufgabenTermin(auf.id);
    }
    // Nur aufräumen, wenn die Aufgabenliste nicht leer ist (sonst kein Massenlöschen bei Sync-Glitches)
    if (list.length > 0) {
      const orphans = this.termine.filter(
        (t) => t.typ === 'aufgabe' && t.aufgabeId && !alive.has(t.aufgabeId)
      );
      orphans.forEach((t) => this.deleteTermin(t.id));
    }
  }

  // Aufgaben-Termin löschen (wenn Aufgabe erledigt/gelöscht)
  deleteAufgabenTermin(aufgabeId) {
    const termin = this.termine.find(t => t.aufgabeId === aufgabeId);
    if (termin) {
      return this.deleteTermin(termin.id);
    }
    return false;
  }

  // Alle Admin-Termine abrufen (für Admin-Portal)
  getAlleAdminTermine() {
    return this.termine.filter(t => t.typ === 'admin')
      .sort((a, b) => new Date(a.datum) - new Date(b.datum));
  }

  createVereinbarungsTermin(data) {
    const termin = {
      id: this.generateId(),
      typ: 'vereinbarung',
      titel: data.betreff,
      betreff: data.betreff,
      beschreibung: data.beschreibung || '',
      datum: data.datum,
      uhrzeit: data.uhrzeit || null,
      ort: data.ort || '',
      teamsLink: data.teamsLink || null,
      antragId: data.antragId || null,
      insasseId: data.insasseId,
      insasseName: data.insasseName || '',
      teilnehmerArt: data.teilnehmerArt,
      externKontakt: data.externKontakt || null,
      externPartnerId: data.externPartnerId || null,
      externServiceId: data.externServiceId || null,
      dauerMinuten: data.dauerMinuten || null,
      durchfuehrungArt: data.durchfuehrungArt || null,
      zugewiesenAnTyp: data.zugewiesenAnTyp || null,
      zugewiesenAnId: data.zugewiesenAnId || null,
      zugewiesenAnName: data.zugewiesenAnName || null,
      zugewiesenAnGruppe: data.zugewiesenAnGruppe || null,
      sichtbarFuer: data.sichtbarFuer || [],
      erstelltVonId: data.erstelltVonId,
      erstelltVonName: data.erstelltVonName,
      begleitungErforderlich: data.begleitungErforderlich === true,
      erstelltAm: new Date().toISOString(),
      einladungVersendetAm: new Date().toISOString()
    };
    this.termine.push(termin);
    this.saveTermine();
    return termin;
  }

  getTermineFuerInsasse(insasseId, insasseName) {
    const id = String(insasseId);
    return this.termine
      .filter((t) => {
        if (!this._istKalenderRelevanterInsasseTermin(t)) return false;
        return this._terminGehoertZuInsasse(t, id, insasseName);
      })
      .sort((a, b) => {
        const da = normalizeDatumIso(a.datum) + 'T' + normalizeUhrzeit(a.uhrzeit);
        const db = normalizeDatumIso(b.datum) + 'T' + normalizeUhrzeit(b.uhrzeit);
        return da.localeCompare(db);
      });
  }

  getTermineFuerInsasseMonat(insasseId, jahr, monat, insasseName) {
    return this.getTermineFuerInsasse(insasseId, insasseName).filter((t) => {
      const iso = normalizeDatumIso(t.datum);
      if (!iso || iso.length < 10) return false;
      const [y, m] = iso.split('-').map((x) => parseInt(x, 10));
      return y === jahr && m - 1 === monat;
    });
  }

  getTermineFuerInsasseTag(insasseId, datum, insasseName) {
    const tagIso = datumIsoLocal(datum instanceof Date ? datum : new Date(datum));
    return this.getTermineFuerInsasse(insasseId, insasseName).filter(
      (t) => normalizeDatumIso(t.datum) === tagIso
    );
  }
}

const terminSystem = new TerminSystem();

// ============================================
// AUFGABENSYSTEM
// ============================================

class AufgabenSystem {
  constructor() {
    this.storageKey = 'gefaengnis_aufgaben';
    this.aufgaben = this.loadAufgaben();
    this.migrateZahlstelleArbeitskoordinationGruppen();
  }

  loadAufgaben() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveAufgaben() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.aufgaben));
  }

  // Zahlstelle / Arbeitskoordination: Gruppenzuweisungen anstaltsweit (hausId entfällt)
  migrateZahlstelleArbeitskoordinationGruppen() {
    let changed = false;
    const stdName = { zahlstelle: 'Zahlstelle', arbeitskoordination: 'Arbeitskoordination' };
    this.aufgaben.forEach((auf) => {
      const g = auf.zugewiesenAnGruppe;
      if (!g || !g.typ) return;
      const tn = String(g.typ).toLowerCase();
      if (tn !== 'zahlstelle' && tn !== 'arbeitskoordination') return;
      if (g.hausId != null && String(g.hausId).trim() !== '') {
        g.hausId = null;
        changed = true;
      }
      const want = stdName[tn];
      if (want && auf.zugewiesenAnName && auf.zugewiesenAnName !== want) {
        auf.zugewiesenAnName = want;
        changed = true;
      }
    });
    if (changed) this.saveAufgaben();
  }

  generateId() {
    return 'AUF-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Aufgabe erstellen
  createAufgabe(data) {
    // Debug-Ausgabe bei Aufgabenerstellung
    console.log('[Debug] createAufgabe - Eingabedaten:', {
      zugewiesenAnTyp: data.zugewiesenAnTyp,
      zugewiesenAnGruppe: data.zugewiesenAnGruppe,
      zugewiesenAnName: data.zugewiesenAnName
    });
    
    const aufgabe = {
      id: this.generateId(),
      antragId: data.antragId,
      antragsNummer: data.antragsNummer,
      erstelltVonId: data.erstelltVonId,
      erstelltVonName: data.erstelltVonName,
      zugewiesenAnId: data.zugewiesenAnId,
      zugewiesenAnName: data.zugewiesenAnName,
      zugewiesenAnTyp: data.zugewiesenAnTyp, // 'insasse', 'mitarbeiter' oder 'gruppe'
      zugewiesenAnGruppe: data.zugewiesenAnGruppe || null, // { typ: 'hausleitung'|'station', hausId, station }
      kurzbeschreibung: data.kurzbeschreibung || data.beschreibung, // max 40 Zeichen
      beschreibung: data.beschreibung || '', // ausführliche Beschreibung (optional)
      anhangPdfs: data.anhangPdfs || null, // Array von PDFs [{name, data}, ...]
      fristDatum: data.fristDatum || null,
      bearbeitungNachErledigung: data.bearbeitungNachErledigung || 'zurueck', // 'zurueck' oder 'uebertragen' (nur bei Mitarbeiter-Aufgaben)
      letzteErinnerung: null,
      status: 'offen', // 'offen', 'erledigt', 'geloescht'
      antwort: null,
      antwortPdfs: null, // Array von PDFs in der Antwort
      erledigungsTyp: null, // 'antwort' oder 'kenntnisnahme'
      erstelltAm: new Date().toISOString(),
      erledigtAm: null,
      terminId: data.terminId || null,
      terminBegleitung: data.terminBegleitung === true,
      terminUhrzeit: data.terminUhrzeit || null
    };
    
    console.log('[Debug] createAufgabe - Erstellte Aufgabe:', {
      id: aufgabe.id,
      zugewiesenAnTyp: aufgabe.zugewiesenAnTyp,
      zugewiesenAnGruppe: aufgabe.zugewiesenAnGruppe,
      gruppeTyp: aufgabe.zugewiesenAnGruppe?.typ
    });
    
    this.aufgaben.push(aufgabe);
    this.saveAufgaben();
    
    // WICHTIG: Wenn einem Mitarbeiter eine Aufgabe zugewiesen wird, aus abgegebenVon entfernen
    // So kann ein ehemaliger Bearbeiter wieder Zugriff auf den Antrag bekommen
    if (data.zugewiesenAnTyp === 'mitarbeiter' && data.antragId && data.zugewiesenAnId) {
      antragSystem.entferneAusAbgegebenVon(data.antragId, data.zugewiesenAnId);
    }
    
    // Aktivität protokollieren
    let zielTypText = data.zugewiesenAnTyp === 'insasse' ? 'Insasse' : 
                      data.zugewiesenAnTyp === 'gruppe' ? 'Gruppe' : 'Mitarbeiter';
    const fristText = data.fristDatum ? ` (Frist: ${new Date(data.fristDatum).toLocaleDateString('de-DE')})` : '';
    aktivitaetenSystem.logAktivitaet({
      antragId: data.antragId,
      typ: 'aufgabe-erstellt',
      beschreibung: `Aufgabe erstellt für ${zielTypText}: ${data.zugewiesenAnName}${fristText}`,
      details: { 
        kurzbeschreibung: data.kurzbeschreibung || data.beschreibung, 
        beschreibung: data.beschreibung,
        zugewiesenAn: data.zugewiesenAnName,
        zugewiesenAnGruppe: data.zugewiesenAnGruppe,
        frist: data.fristDatum 
      },
      benutzerTyp: 'mitarbeiter',
      benutzerId: data.erstelltVonId,
      benutzerName: data.erstelltVonName
    });
    
    // Automatisch Termin erstellen, wenn Frist gesetzt (nur für Mitarbeiter-Aufgaben)
    if (data.fristDatum && data.zugewiesenAnTyp === 'mitarbeiter') {
      terminSystem.createAufgabenTermin(aufgabe);
    }

    // Insasse benachrichtigen, wenn ihm eine Aufgabe zugewiesen wurde
    if (data.zugewiesenAnTyp === 'insasse' && data.zugewiesenAnId) {
      const kurzText = data.kurzbeschreibung || data.beschreibung || 'Neue Aufgabe';
      const fristHinweis = data.fristDatum
        ? ` Frist: ${new Date(data.fristDatum).toLocaleDateString('de-DE')}.`
        : '';
      notificationSystem.createNotification(
        data.zugewiesenAnId,
        'aufgabe-neu',
        'Neue Aufgabe erhalten',
        `Sie haben eine neue Aufgabe zum Antrag ${data.antragsNummer || data.antragId} erhalten: ${typeof kurzText === 'object' ? getTranslatedUserText(kurzText) : kurzText}.${fristHinweis}`,
        data.antragId
      );
    }
    
    return aufgabe;
  }

  /** Nach Übernahme einer Gruppenaufgabe: Kalender des Bearbeiters aktualisieren. */
  syncKalenderNachGruppenuebernahme(aufgabe) {
    if (!aufgabe || typeof terminSystem === 'undefined') return;
    if (aufgabe.terminBegleitung || aufgabe.terminId) {
      terminSystem.syncBegleitungKalenderFuerAufgabe(aufgabe);
    } else if (aufgabe.fristDatum && aufgabe.zugewiesenAnTyp === 'mitarbeiter') {
      terminSystem.createAufgabenTermin(aufgabe);
    }
  }

  // Aufgabe erledigen
  // erledigungsTyp: 'antwort' oder 'kenntnisnahme'
  // antwortPdfs: Array von PDFs [{name, data}, ...]
  // erledigerInfo: { userId, userName, omitCreatorNotify?: boolean } — wer abschließt; omitCreatorNotify z. B. wenn nur „Bearbeitung übernommen“ gesendet wird
  erledigeAufgabe(aufgabeId, antwort, erledigungsTyp = 'antwort', antwortPdfs = null, erledigerInfo = null) {
    const aufgabe = this.aufgaben.find(a => a.id === aufgabeId);
    if (aufgabe) {
      aufgabe.status = 'erledigt';
      aufgabe.antwort = antwort || '';
      aufgabe.erledigungsTyp = erledigungsTyp;
      aufgabe.erledigtAm = new Date().toISOString();
      if (antwortPdfs && antwortPdfs.length > 0) {
        aufgabe.antwortPdfs = antwortPdfs;
      }
      this.saveAufgaben();
      
      // Aktivität protokollieren
      const beschreibungText = erledigungsTyp === 'kenntnisnahme' 
        ? 'Aufgabe zur Kenntnis genommen' 
        : 'Aufgabe beantwortet';
      
      aktivitaetenSystem.logAktivitaet({
        antragId: aufgabe.antragId,
        typ: 'aufgabe-erledigt',
        beschreibung: beschreibungText,
        details: { 
          antwort: antwort,
          erledigungsTyp: erledigungsTyp,
          anzahlPdfs: antwortPdfs ? antwortPdfs.length : 0
        },
        benutzerTyp: aufgabe.zugewiesenAnTyp,
        benutzerId: aufgabe.zugewiesenAnId,
        benutzerName: aufgabe.zugewiesenAnName
      });

      // Benachrichtigung an die Person, die die Aufgabe gestellt hat (nicht bei Selbst-Erledigung)
      if (
        erledigerInfo &&
        !erledigerInfo.omitCreatorNotify &&
        erledigerInfo.userId &&
        aufgabe.erstelltVonId &&
        aufgabe.erstelltVonId !== erledigerInfo.userId
      ) {
        const kurz =
          aufgabe.kurzbeschreibung || aufgabe.beschreibung;
        let kurzLabel = 'Aufgabe';
        if (kurz) {
          if (typeof kurz === 'string') {
            kurzLabel = kurz.length > 80 ? kurz.slice(0, 77) + '…' : kurz;
          } else {
            const t = getTranslatedUserText(kurz);
            kurzLabel = t.length > 80 ? t.slice(0, 77) + '…' : t;
          }
        }
        const vonName = erledigerInfo.userName || 'Bearbeiter/in';
        const antrNr = aufgabe.antragsNummer || aufgabe.antragId || '';
        notificationSystem.createNotification(
          aufgabe.erstelltVonId,
          'aufgabe-abgeschlossen',
          'Aufgabe erledigt',
          `„${kurzLabel}“ zum Antrag ${antrNr} wurde von ${vonName} abgeschlossen.`,
          aufgabe.antragId
        );
      }
    }
    return aufgabe;
  }

  // Aufgabe löschen (durch Ersteller)
  loescheAufgabe(aufgabeId, loeschenderId, loeschenderName) {
    const aufgabe = this.aufgaben.find(a => a.id === aufgabeId);
    if (aufgabe && aufgabe.erstelltVonId === loeschenderId) {
      aufgabe.status = 'geloescht';
      aufgabe.geloeschtAm = new Date().toISOString();
      this.saveAufgaben();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: aufgabe.antragId,
        typ: 'aufgabe-geloescht',
        beschreibung: `Aufgabe gelöscht`,
        details: { urspruenglicheAufgabe: aufgabe.beschreibung },
        benutzerTyp: 'mitarbeiter',
        benutzerId: loeschenderId,
        benutzerName: loeschenderName
      });
      
      return aufgabe;
    }
    return null;
  }

  // Überfällige Aufgaben prüfen und Erinnerungen senden
  pruefeUeberfaelligeAufgaben() {
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);
    
    this.aufgaben.forEach(aufgabe => {
      if (aufgabe.status !== 'offen' || !aufgabe.fristDatum) return;
      
      const frist = new Date(aufgabe.fristDatum);
      frist.setHours(0, 0, 0, 0);
      
      // Prüfen ob Frist überschritten
      if (heute > frist) {
        // Prüfen ob heute schon eine Erinnerung gesendet wurde
        const letzteErinnerung = aufgabe.letzteErinnerung ? new Date(aufgabe.letzteErinnerung) : null;
        if (letzteErinnerung) {
          letzteErinnerung.setHours(0, 0, 0, 0);
        }
        
        if (!letzteErinnerung || letzteErinnerung < heute) {
          // Erinnerung an Bearbeiter senden
          notificationSystem.createNotification(
            aufgabe.zugewiesenAnId,
            'aufgabe-ueberfaellig',
            'Aufgabe überfällig',
            `Die Aufgabe zum Antrag ${aufgabe.antragsNummer} ist überfällig (Frist: ${new Date(aufgabe.fristDatum).toLocaleDateString('de-DE')}).`,
            aufgabe.antragId
          );
          
          // Erinnerung an Ersteller senden
          notificationSystem.createNotification(
            aufgabe.erstelltVonId,
            'aufgabe-ueberfaellig',
            'Aufgabe überfällig',
            `Ihre erstellte Aufgabe zum Antrag ${aufgabe.antragsNummer} ist noch nicht erledigt (Frist: ${new Date(aufgabe.fristDatum).toLocaleDateString('de-DE')}).`,
            aufgabe.antragId
          );
          
          aufgabe.letzteErinnerung = new Date().toISOString();
          this.saveAufgaben();
        }
      }
    });
  }

  // Offene Aufgaben für einen Benutzer
  getOffeneAufgaben(userId) {
    return this.aufgaben.filter(a => 
      a.zugewiesenAnId === userId && a.status === 'offen'
    ).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Aufgaben die ein Benutzer erstellt hat (für Verwaltung)
  getErstellteAufgaben(userId) {
    return this.aufgaben.filter(a => 
      a.erstelltVonId === userId && a.status === 'offen'
    ).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Alle Aufgaben für einen Benutzer
  getAlleAufgaben(userId) {
    return this.aufgaben.filter(a => 
      a.zugewiesenAnId === userId
    ).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Aufgaben zu einem Antrag (ohne gelöschte)
  getAufgabenZuAntrag(antragId) {
    return this.aufgaben.filter(a => a.antragId === antragId && a.status !== 'geloescht');
  }

  getAufgabe(id) {
    return this.aufgaben.find(a => a.id === id);
  }
  
  // Offene Gruppenaufgaben für einen Mitarbeiter zu einem bestimmten Antrag
  getOffeneGruppenAufgabenFuerMitarbeiter(antragId, mitarbeiter) {
    console.log('[Debug] getOffeneGruppenAufgabenFuerMitarbeiter aufgerufen:', { antragId, antragIdType: typeof antragId, mitarbeiterId: mitarbeiter.userId });
    
    // Alle Gruppenaufgaben für diesen Mitarbeiter anzeigen (zur Diagnose)
    const alleGruppenAufgaben = this.aufgaben.filter(a => a.zugewiesenAnTyp === 'gruppe' && a.status === 'offen');
    console.log('[Debug] Alle offenen Gruppenaufgaben:', alleGruppenAufgaben.map(a => ({
      aufgabeId: a.id,
      aufgabeAntragId: a.antragId,
      aufgabeAntragIdType: typeof a.antragId,
      matchesAntragId: a.antragId === antragId,
      matchesAntragIdLoose: a.antragId == antragId
    })));
    
    const ergebnis = this.aufgaben.filter(a => {
      // Vergleich mit == statt === für Typ-Toleranz (String vs Number)
      if (a.antragId != antragId) return false;
      if (a.status !== 'offen') return false;
      if (a.zugewiesenAnTyp !== 'gruppe') return false;
      if (!a.zugewiesenAnGruppe) return false;
      
      // Prüfen ob Mitarbeiter zur Gruppe gehört
      const gehoertZuGruppe = antragSystem._mitarbeiterGehoertZuGruppe(mitarbeiter, a.zugewiesenAnGruppe);
      console.log('[Debug] Aufgabe prüfen:', { aufgabeId: a.id, gehoertZuGruppe });
      return gehoertZuGruppe;
    });
    
    console.log('[Debug] getOffeneGruppenAufgabenFuerMitarbeiter Ergebnis:', ergebnis.length);
    return ergebnis;
  }
  
  // ALLE offenen Gruppenaufgaben für einen Antrag (unabhängig von der Gruppe)
  // Wird verwendet um bei Übernahme alle Gruppenaufgaben zu schließen
  getAlleOffenenGruppenAufgabenFuerAntrag(antragId) {
    return this.aufgaben.filter(a => {
      if (a.antragId != antragId) return false;
      if (a.status !== 'offen') return false;
      if (a.zugewiesenAnTyp !== 'gruppe') return false;
      return true;
    });
  }
  
  // Schließt ALLE offene Gruppenaufgaben für einen Antrag bei VERAKTUNG
  // Wird NUR bei Veraktung aufgerufen - bis dahin können Aufgaben jederzeit zugewiesen werden
  schliesseAlleGruppenAufgabenFuerAntrag(antragId) {
    const gruppenAufgaben = this.getAlleOffenenGruppenAufgabenFuerAntrag(antragId);
    
    let geschlossen = 0;
    if (gruppenAufgaben.length > 0) {
      gruppenAufgaben.forEach(aufgabe => {
        aufgabe.status = 'erledigt';
        aufgabe.erledigtAm = new Date().toISOString();
        aufgabe.erledigtDurchVeraktung = true;
        geschlossen++;
      });
      if (geschlossen > 0) {
        this.saveAufgaben();
        console.log(`[Veraktung] ${geschlossen} Gruppenaufgaben für Antrag ${antragId} geschlossen`);
      }
    }
    return geschlossen;
  }
  
  // Alle offenen Gruppenaufgaben für einen Mitarbeiter (über alle Anträge)
  getAlleOffenenGruppenAufgabenFuerMitarbeiter(mitarbeiter) {
    // Debug: Alle offenen Gruppenaufgaben anzeigen
    const alleGruppenAufgaben = this.aufgaben.filter(a => a.zugewiesenAnTyp === 'gruppe' && a.status === 'offen');
    console.log('[Debug] Alle offenen Gruppenaufgaben:', alleGruppenAufgaben.map(a => ({
      id: a.id,
      antragId: a.antragId,
      zugewiesenAnGruppe: a.zugewiesenAnGruppe,
      gruppeTyp: a.zugewiesenAnGruppe?.typ
    })));
    
    // Spezielle Prüfung für Kammer
    if (mitarbeiter.rolle === 'kammer') {
      console.log('[Debug] KAMMER-MITARBEITER ERKANNT');
      const kammerAufgaben = alleGruppenAufgaben.filter(a => a.zugewiesenAnGruppe?.typ === 'kammer');
      console.log('[Debug] Kammer-Aufgaben gefunden:', kammerAufgaben.length, kammerAufgaben);
    }
    
    const ergebnis = this.aufgaben.filter(a => {
      if (a.status !== 'offen') return false;
      if (a.zugewiesenAnTyp !== 'gruppe') return false;
      if (!a.zugewiesenAnGruppe) return false;
      
      const gehoertZuGruppe = antragSystem._mitarbeiterGehoertZuGruppe(mitarbeiter, a.zugewiesenAnGruppe);
      console.log('[Debug] Aufgabe prüfen:', {
        aufgabeId: a.id,
        gruppeTyp: a.zugewiesenAnGruppe.typ,
        mitarbeiterRolle: mitarbeiter.rolle,
        gehoertZuGruppe: gehoertZuGruppe
      });
      return gehoertZuGruppe;
    });
    
    console.log('[Debug] getAlleOffenenGruppenAufgabenFuerMitarbeiter:', {
      mitarbeiterId: mitarbeiter.userId,
      mitarbeiterRolle: mitarbeiter.rolle,
      mitarbeiterJvas: mitarbeiter.jvas,
      gefundene: ergebnis.length
    });
    
    return ergebnis;
  }
  
  // Alle Antrags-IDs mit offenen Gruppenaufgaben für einen Mitarbeiter
  getAntragsIdsMitGruppenaufgaben(mitarbeiter) {
    const gruppenAufgaben = this.getAlleOffenenGruppenAufgabenFuerMitarbeiter(mitarbeiter);
    // Einzigartige Antrags-IDs extrahieren
    const antragIds = [...new Set(gruppenAufgaben.map(a => a.antragId))];
    return antragIds;
  }
}

const aufgabenSystem = new AufgabenSystem();

// ============================================
// ANTRAGSSYSTEM
// ============================================

class AntragSystem {
  constructor() {
    this.storageKey = 'gefaengnis_antraege';
    this.counterKey = 'gefaengnis_antrag_counter';
    this.antraege = this.loadAntraege();
    this.migrateAntraege();
  }

  loadAntraege() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveAntraege() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.antraege));
  }

  // Migration: Bestehende Anträge mit neuen Feldern versehen
  migrateAntraege() {
    let changed = false;
    this.antraege.forEach(antrag => {
      // Status-Migration: 'in-bearbeitung' ohne persönlichen Bearbeiter → nur dann 'offen',
      // wenn KEINE Gruppen-Weiterleitung aktiv ist (sonst wäre der Antrag fälschlich im Pool).
      if (antrag.status === 'in-bearbeitung' && !antrag.bearbeiterId && !antrag.zugewiesenAnGruppe) {
        antrag.status = 'offen';
        changed = true;
      }
      // Reparatur: fälschlich auf 'offen' gesetzte Gruppen-Anträge wiederherstellen
      if (antrag.status === 'offen' && antrag.zugewiesenAnGruppe) {
        antrag.status = 'in-bearbeitung';
        changed = true;
      }
      // Abgeschlossene Anträge für Insassen-Historie markieren
      if (['genehmigt', 'abgelehnt', 'teilweise-genehmigt'].includes(antrag.status) && antrag.erledigt !== true) {
        antrag.erledigt = true;
        changed = true;
      }
      if (antrag.status === 'zurueckgegeben' && antrag.erledigt === undefined) {
        antrag.erledigt = false;
        changed = true;
      }
      // Insassen-Nummer ergänzen (aus User-System holen)
      if (!antrag.insassenNummer && antrag.insasseId) {
        const insasse = userSystem.getUser(antrag.insasseId);
        if (insasse && insasse.insassenNummer) {
          antrag.insassenNummer = insasse.insassenNummer;
          changed = true;
        }
      }
      // Antrags-Nummer ergänzen
      if (!antrag.antragsNummer) {
        antrag.antragsNummer = this.generateAntragsNummer();
        changed = true;
      }
      // Insassen-Geburtsdatum ergänzen
      if (!antrag.insasseGeburtsdatum && antrag.insasseId) {
        const insasse = userSystem.getUser(antrag.insasseId);
        if (insasse && insasse.geburtsdatum) {
          antrag.insasseGeburtsdatum = insasse.geburtsdatum;
          changed = true;
        }
      }
      // JVA -> Haus Migration
      if (antrag.insasseJva && antrag.insasseJva.startsWith('jva')) {
        antrag.insasseJva = antrag.insasseJva.replace('jva', 'haus');
        changed = true;
      }
      const g = antrag.zugewiesenAnGruppe;
      if (g && g.typ) {
        const tn = String(g.typ).toLowerCase();
        if ((tn === 'zahlstelle' || tn === 'arbeitskoordination') && g.hausId != null && String(g.hausId).trim() !== '') {
          g.hausId = null;
          changed = true;
        }
        if (tn === 'zahlstelle' && antrag.zugewiesenAnGruppeName && antrag.zugewiesenAnGruppeName !== 'Zahlstelle') {
          antrag.zugewiesenAnGruppeName = 'Zahlstelle';
          changed = true;
        }
        if (tn === 'arbeitskoordination' && antrag.zugewiesenAnGruppeName && antrag.zugewiesenAnGruppeName !== 'Arbeitskoordination') {
          antrag.zugewiesenAnGruppeName = 'Arbeitskoordination';
          changed = true;
        }
      }
      // Nach Server-Sync fehlendes Flag reparieren (sonst erscheint Weiterleitung an Gruppe nicht in der Gruppenliste)
      if (antrag.status === 'in-bearbeitung' && antrag.zugewiesenAnGruppe && antrag.bearbeiterId &&
          (antrag.hauptbearbeitungWartetAufUebernahme === undefined || antrag.hauptbearbeitungWartetAufUebernahme === null)) {
        antrag.hauptbearbeitungWartetAufUebernahme = true;
        changed = true;
      }
    });
    if (changed) {
      this.saveAntraege();
    }
  }

  generateId() {
    return 'ANT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Lesbare Antrags-Nummer generieren (z.B. "A-2024-0001")
  generateAntragsNummer() {
    const year = new Date().getFullYear();
    let counter = parseInt(localStorage.getItem(this.counterKey) || '0');
    counter++;
    localStorage.setItem(this.counterKey, counter.toString());
    return `A-${year}-${String(counter).padStart(4, '0')}`;
  }

  // Prüft ob bereits ein Teilhabegeld-Antrag für den gegebenen Monat existiert (nicht Entwurf)
  hatTeilhabegeldAntragFuerMonat(insasseId, monat) {
    if (!monat) return false;
    return this.antraege.some(a => 
      a.type === 'teilhabegeld' && 
      a.insasseId === insasseId && 
      a.monat === monat &&
      a.status !== 'entwurf' // Entwürfe zählen nicht
    );
  }

  getAntragTypLabel(type) {
    const labels = {
      teilhabegeld: 'Teilhabegeld',
      eigentum: 'Eigentum in der Kammer',
      'beratung-unterstuetzung': 'Beratungs- und Unterstützungsleistungen',
      gespraechstermin: 'Gesprächstermine',
      'gesundheit-medizin': 'Gesundheit: Termin medizinischer Dienst',
      'freizeit-weiterbildung': 'Freizeitaktivitäten inkl. Weiterbildungskosten',
      'besuch-langzeit': 'Langzeitbesuch (Genehmigung)',
      'besuch-termin': 'Besuchstermin',
      'besuch-video': 'Videobesuch'
    };
    return labels[type] || 'Antrag';
  }

  // Antrag erstellen (mit Insassen-Daten)
  createAntrag(type, data, insasse, alsEntwurf = false) {
    // Insassen-Daten aus dem User-System holen
    const insasseUser = userSystem.getUser(insasse.userId);
    const insassenNummer = insasseUser ? insasseUser.insassenNummer : null;
    const insasseGeburtsdatum = insasseUser ? insasseUser.geburtsdatum : null;
    
    const antrag = {
      id: this.generateId(),
      antragsNummer: this.generateAntragsNummer(),
      type: type,
      status: alsEntwurf ? 'entwurf' : 'offen',
      insasseId: insasse.userId,
      insassenNummer: insassenNummer,
      insasseName: insasse.name,
      insasseGeburtsdatum: insasseGeburtsdatum,
      insasseJva: insasse.jva,
      insasseStation: insasse.station,
      bearbeiterId: null,
      bearbeiterName: null,
      erstelltAm: new Date().toISOString(),
      bearbeitetAm: null,
      begruendung: null,
      erledigt: false,
      ...data
    };
    this.antraege.push(antrag);
    this.saveAntraege();
    
    // Aktivität protokollieren
    if (!alsEntwurf) {
      const typeText = this.getAntragTypLabel(type);
      aktivitaetenSystem.logAktivitaet({
        antragId: antrag.id,
        typ: 'erstellt',
        beschreibung: `Antrag "${typeText}" eingereicht`,
        benutzerTyp: 'insasse',
        benutzerId: insasse.userId,
        benutzerName: insasse.name
      });
    }
    
    return antrag;
  }

  // Entwurf aktualisieren
  updateEntwurf(id, data) {
    const antrag = this.antraege.find(a => a.id === id && a.status === 'entwurf');
    if (antrag) {
      Object.assign(antrag, data);
      this.saveAntraege();
      return antrag;
    }
    return null;
  }

  // Entwurf einreichen
  submitEntwurf(id) {
    const antrag = this.antraege.find(a => a.id === id && a.status === 'entwurf');
    if (antrag) {
      antrag.status = 'offen';
      antrag.erstelltAm = new Date().toISOString();
      this.saveAntraege();
      
      // Aktivität protokollieren
      const typeText = this.getAntragTypLabel(antrag.type);
      aktivitaetenSystem.logAktivitaet({
        antragId: id,
        typ: 'erstellt',
        beschreibung: `Antrag "${typeText}" eingereicht (aus Entwurf)`,
        benutzerTyp: 'insasse',
        benutzerId: antrag.insasseId,
        benutzerName: antrag.insasseName
      });
      
      return antrag;
    }
    return null;
  }

  // Antrag "nehmen" - einem Mitarbeiter zuweisen
  nehmeAntrag(antragId, mitarbeiter) {
    console.log('[Debug] nehmeAntrag aufgerufen:', { antragId, mitarbeiterId: mitarbeiter.userId });
    
    const antrag = this.antraege.find(a => a.id === antragId);
    if (!antrag) {
      console.log('[Debug] nehmeAntrag: Antrag nicht gefunden');
      return null;
    }
    
    console.log('[Debug] nehmeAntrag - Antrag gefunden:', {
      status: antrag.status,
      bearbeiterId: antrag.bearbeiterId,
      hauptbearbeitungWartetAufUebernahme: antrag.hauptbearbeitungWartetAufUebernahme,
      zugewiesenAnGruppe: antrag.zugewiesenAnGruppe
    });
    const maybeNotifyVorherigerBearbeiter = (alterId, alterName) => {
      if (alterId == null || String(alterId) === '') return;
      if (String(alterId) === String(mitarbeiter.userId)) return;
      notificationSystem.createNotification(
        alterId,
        'antrag-uebernommen',
        'Antrag durch VAL übernommen',
        `Der Antrag ${antrag.antragsNummer || antragId} wurde von ${mitarbeiter.name} (VAL) übernommen.`,
        antragId
      );
    };
    
    // Fall 1: Offener Antrag - komplett übernehmen
    // Auch Hausleitung kann offene Anträge übernehmen
    if (antrag.status === 'offen') {
      const alterBearbeiterId = antrag.bearbeiterId;
      const alterBearbeiterName = antrag.bearbeiterName;
      antrag.status = 'in-bearbeitung';
      antrag.bearbeiterId = mitarbeiter.userId;
      antrag.bearbeiterName = mitarbeiter.name;
      
      // Gruppenzuweisung löschen, da jetzt eine konkrete Person zugewiesen ist
      if (antrag.zugewiesenAnGruppe) {
        antrag.zugewiesenAnGruppe = null;
        antrag.zugewiesenAnGruppeName = null;
      }
      
      // Markierungen löschen
      antrag.hauptbearbeitungWartetAufUebernahme = false;
      antrag.urspruenglicherBearbeiterId = null;
      antrag.urspruenglicherBearbeiterName = null;
      
      // ALLE offenen Gruppenaufgaben für diesen Antrag dem Mitarbeiter zuweisen
      // (nicht nur die seiner Gruppe, damit der Antrag aus allen Gruppen-Listen verschwindet)
      const gruppenAufgaben = aufgabenSystem.getAlleOffenenGruppenAufgabenFuerAntrag(antragId);
      gruppenAufgaben.forEach((aufgabe) => {
        aufgabe.zugewiesenAnTyp = 'mitarbeiter';
        aufgabe.zugewiesenAnId = mitarbeiter.userId;
        aufgabe.zugewiesenAnName = mitarbeiter.name;
        aufgabe.zugewiesenAnGruppe = null;
        aufgabenSystem.syncKalenderNachGruppenuebernahme(aufgabe);
      });
      if (gruppenAufgaben.length > 0) {
        aufgabenSystem.saveAufgaben();
      }
      
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'genommen',
        beschreibung: 'Antrag zur Bearbeitung übernommen',
        benutzerTyp: 'mitarbeiter',
        benutzerId: mitarbeiter.userId,
        benutzerName: mitarbeiter.name
      });
      maybeNotifyVorherigerBearbeiter(alterBearbeiterId, alterBearbeiterName);
      
      return antrag;
    }
    
    // Fall 2: In Bearbeitung mit Gruppenzuweisung (Weiterleitung an Gruppe)
    // Gleiche Voraussetzung wie Gruppenliste: zugewiesenAnGruppe reicht; Flag darf nicht mehr Pflicht sein (Sync).
    if (antrag.status === 'in-bearbeitung' && antrag.zugewiesenAnGruppe) {
      const selfId = String(mitarbeiter.userId ?? mitarbeiter.id ?? '');
      if (antrag.bearbeiterId != null && antrag.bearbeiterId !== '' && String(antrag.bearbeiterId) === selfId) {
        return antrag;
      }
      const alterBearbeiterId = antrag.bearbeiterId;
      const alterBearbeiterName = antrag.bearbeiterName;

      const darfAlsGruppenmitglied = this._mitarbeiterGehoertZuGruppe(mitarbeiter, antrag.zugewiesenAnGruppe);
      const darfAlsValPool =
        this._istValWeitMitarbeiter(mitarbeiter) && this._valAntragSichtbar(mitarbeiter, antrag);
      if (!darfAlsGruppenmitglied && !darfAlsValPool) {
        console.warn('[nehmeAntrag] Fall 2: keine Berechtigung zur Übernahme');
        return null;
      }
      
      // Alten Bearbeiter als "abgegeben" markieren
      if (!antrag.abgegebenVon) {
        antrag.abgegebenVon = [];
      }
      if (alterBearbeiterId && !antrag.abgegebenVon.includes(alterBearbeiterId)) {
        antrag.abgegebenVon.push(alterBearbeiterId);
      }
      
      // Hauptbearbeitung übertragen
      antrag.bearbeiterId = mitarbeiter.userId;
      antrag.bearbeiterName = mitarbeiter.name;
      
      // Gruppenzuweisung und Markierungen löschen
      antrag.zugewiesenAnGruppe = null;
      antrag.zugewiesenAnGruppeName = null;
      antrag.hauptbearbeitungWartetAufUebernahme = false;
      antrag.urspruenglicherBearbeiterId = null;
      antrag.urspruenglicherBearbeiterName = null;
      
      // ALLE offenen Gruppenaufgaben für diesen Antrag dem Mitarbeiter zuweisen
      // (nicht nur die seiner Gruppe, damit der Antrag aus allen Gruppen-Listen verschwindet)
      const gruppenAufgaben = aufgabenSystem.getAlleOffenenGruppenAufgabenFuerAntrag(antragId);
      gruppenAufgaben.forEach((aufgabe) => {
        aufgabe.zugewiesenAnTyp = 'mitarbeiter';
        aufgabe.zugewiesenAnId = mitarbeiter.userId;
        aufgabe.zugewiesenAnName = mitarbeiter.name;
        aufgabe.zugewiesenAnGruppe = null;
        aufgabenSystem.syncKalenderNachGruppenuebernahme(aufgabe);
      });
      if (gruppenAufgaben.length > 0) {
        aufgabenSystem.saveAufgaben();
      }
      
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'hauptbearbeitung-uebernommen',
        beschreibung: `Hauptbearbeitung übernommen von ${alterBearbeiterName || 'unbekannt'}`,
        benutzerTyp: 'mitarbeiter',
        benutzerId: mitarbeiter.userId,
        benutzerName: mitarbeiter.name
      });
      maybeNotifyVorherigerBearbeiter(alterBearbeiterId, alterBearbeiterName);
      
      return antrag;
    }
    
    // Fall 3: Gruppenaufgaben übernehmen (unabhängig vom Antragsstatus, solange nicht veraktet)
    // Dies gilt für Anträge in Bearbeitung, genehmigt, teilweise-genehmigt, abgelehnt etc.
    if (!antrag.veraktet) {
      console.log('[Debug] nehmeAntrag Fall 3: Antrag nicht veraktet (Status: ' + antrag.status + '), suche Gruppenaufgaben...');
      
      const gruppenAufgaben = aufgabenSystem.getOffeneGruppenAufgabenFuerMitarbeiter(antragId, mitarbeiter);
      console.log('[Debug] nehmeAntrag: Gefundene Gruppenaufgaben:', gruppenAufgaben.length);
      
      if (gruppenAufgaben.length > 0) {
        gruppenAufgaben.forEach((aufgabe) => {
          console.log('[Debug] Konvertiere Aufgabe:', aufgabe.id);
          aufgabe.zugewiesenAnTyp = 'mitarbeiter';
          aufgabe.zugewiesenAnId = mitarbeiter.userId;
          aufgabe.zugewiesenAnName = mitarbeiter.name;
          aufgabe.zugewiesenAnGruppe = null;
          aufgabenSystem.syncKalenderNachGruppenuebernahme(aufgabe);
        });
        aufgabenSystem.saveAufgaben();
        
        // Aktivität protokollieren
        aktivitaetenSystem.logAktivitaet({
          antragId: antragId,
          typ: 'aufgaben-genommen',
          beschreibung: `${gruppenAufgaben.length} Gruppenaufgabe(n) übernommen`,
          benutzerTyp: 'mitarbeiter',
          benutzerId: mitarbeiter.userId,
          benutzerName: mitarbeiter.name
        });
        
        console.log('[Debug] nehmeAntrag: Aufgaben erfolgreich übernommen');
        return antrag;
      } else {
        console.log('[Debug] nehmeAntrag: Keine Gruppenaufgaben gefunden - prüfe alle Aufgaben für diesen Antrag');
        const alleAufgaben = aufgabenSystem.aufgaben.filter(a => a.antragId === antragId && a.status === 'offen');
        console.log('[Debug] Alle offenen Aufgaben zu diesem Antrag:', alleAufgaben.map(a => ({
          id: a.id,
          zugewiesenAnTyp: a.zugewiesenAnTyp,
          zugewiesenAnGruppe: a.zugewiesenAnGruppe
        })));
        
        // Fall 3b: Hausleitung kann Antrag übernehmen, auch wenn keine Gruppenaufgaben vorhanden
        // Dies gilt für alle Status außer offen und veraktet
        const istValWeit = this._istValWeitMitarbeiter(mitarbeiter);
        const erlaubteStatus = ['in-bearbeitung', 'genehmigt', 'abgelehnt', 'teilweise-genehmigt'];
        if (istValWeit && erlaubteStatus.includes(antrag.status) && antrag.bearbeiterId !== mitarbeiter.userId) {
          if (!this._valAntragSichtbar(mitarbeiter, antrag)) {
            console.log('[Debug] nehmeAntrag Fall 3b: nicht im Sichtfeld');
          } else {
            console.log('[Debug] nehmeAntrag Fall 3b: VAL-ähnliche Rolle übernimmt Antrag (Status: ' + antrag.status + ')');
          
            const alterBearbeiter = antrag.bearbeiterName;
            const alterBearbeiterId = antrag.bearbeiterId;
            antrag.bearbeiterId = mitarbeiter.userId;
            antrag.bearbeiterName = mitarbeiter.name;
            this.saveAntraege();
          
            aktivitaetenSystem.logAktivitaet({
              antragId: antragId,
              typ: 'uebernommen',
              beschreibung: `Antrag übernommen von ${alterBearbeiter || 'unbekannt'} (VAL)`,
              benutzerTyp: 'mitarbeiter',
              benutzerId: mitarbeiter.userId,
              benutzerName: mitarbeiter.name
            });
            maybeNotifyVorherigerBearbeiter(alterBearbeiterId, alterBearbeiter);
          
            return antrag;
          }
        }
      }
    }
    
    console.log('[Debug] nehmeAntrag: Kein passender Fall gefunden, return null');
    return null;
  }

  // Antrag übernehmen (von anderem Bearbeiter zurückholen)
  uebernehmeAntrag(antragId, mitarbeiter, grund = null) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.status === 'in-bearbeitung') {
      const alterBearbeiter = antrag.bearbeiterName;
      antrag.bearbeiterId = mitarbeiter.userId;
      antrag.bearbeiterName = mitarbeiter.name;
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'uebernommen',
        beschreibung: `Antrag übernommen von ${alterBearbeiter}`,
        details: grund ? { grund: grund } : null,
        benutzerTyp: 'mitarbeiter',
        benutzerId: mitarbeiter.userId,
        benutzerName: mitarbeiter.name
      });
      
      return antrag;
    }
    return null;
  }

  // Antrag durch Hausleitung übernehmen (mit Pflichtbegründung)
  // Diese Funktion ermöglicht es der Hausleitung, jeden Antrag in ihrem Haus zu übernehmen
  uebernehmeAntragAlsHausleitung(antragId, hausleitung, begruendung) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (!antrag) return { success: false, error: 'Antrag nicht gefunden' };
    const cleanBegruendung = typeof begruendung === 'string' ? begruendung.trim() : '';
    if (!cleanBegruendung) {
      return { success: false, error: 'Begründung ist erforderlich' };
    }
    
    // Prüfen ob der Antrag bereits einen Bearbeiter hat
    const alterBearbeiterId = antrag.bearbeiterId;
    const alterBearbeiterName = antrag.bearbeiterName;
    
    // Wenn der Antrag noch offen ist, Status auf in-bearbeitung setzen
    if (antrag.status === 'offen') {
      antrag.status = 'in-bearbeitung';
    }
    
    // Hausleitung als neuen Bearbeiter setzen
    antrag.bearbeiterId = hausleitung.userId;
    antrag.bearbeiterName = hausleitung.name;
    
    // Übernahme-Informationen speichern
    antrag.uebernommenVonHausleitung = true;
    antrag.uebernahmeBegruendung = cleanBegruendung;
    antrag.uebernahmeAm = new Date().toISOString();
    antrag.uebernahmeVon = hausleitung.name;
    antrag.uebernahmeVonId = hausleitung.userId;
    antrag.alterBearbeiterBeiUebernahme = alterBearbeiterName;
    antrag.alterBearbeiterIdBeiUebernahme = alterBearbeiterId;
    if (!Array.isArray(antrag.kommentare)) {
      antrag.kommentare = [];
    }
    antrag.kommentare.push({
      id: 'KOM-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      text: `VAL-Übernahme begründet: ${cleanBegruendung}`,
      benutzerId: hausleitung.userId,
      benutzerName: hausleitung.name,
      typ: 'akte',
      systemEintrag: true,
      erstelltAm: new Date().toISOString()
    });
    
    this.saveAntraege();
    
    // Aktivität protokollieren
    aktivitaetenSystem.logAktivitaet({
      antragId: antragId,
      typ: 'hausleitung-uebernahme',
      beschreibung: `Antrag durch Hausleitung übernommen${alterBearbeiterName ? ' von ' + alterBearbeiterName : ''}`,
      details: { 
        begruendung: cleanBegruendung,
        alterBearbeiter: alterBearbeiterName || null
      },
      benutzerTyp: 'mitarbeiter',
      benutzerId: hausleitung.userId,
      benutzerName: hausleitung.name
    });

    // Vorherigen Bearbeiter informieren (falls vorhanden und nicht identisch zur Hausleitung)
    if (
      alterBearbeiterId != null &&
      String(alterBearbeiterId) !== '' &&
      String(alterBearbeiterId) !== String(hausleitung.userId)
    ) {
      notificationSystem.createNotification(
        alterBearbeiterId,
        'antrag-uebernommen',
        'Antrag durch VAL übernommen',
        `Der Antrag ${antrag.antragsNummer || antragId} wurde von ${hausleitung.name} (VAL) übernommen. Begründung: ${cleanBegruendung}`,
        antragId
      );
    }
    
    return { 
      success: true, 
      antrag: antrag,
      alterBearbeiterId: alterBearbeiterId,
      alterBearbeiterName: alterBearbeiterName
    };
  }

  // Antrag als sachlich/fachlich geprüft markieren
  markiereAlsGeprueft(antragId, mitarbeiterId, mitarbeiterName, pruefungsKommentar = '') {
    const antrag = this.antraege.find(a => a.id === antragId);
    // Nur in Bearbeitung (inkl. Fälle mit Gruppen-Weiterleitung ohne persönlichen Bearbeiter)
    if (antrag && antrag.status === 'in-bearbeitung' && !antrag.veraktet) {
      antrag.sachlichGeprueft = true;
      antrag.sachlichGeprueftAm = new Date().toISOString();
      antrag.sachlichGeprueftVon = mitarbeiterName;
      antrag.sachlichGeprueftVonId = mitarbeiterId;
      antrag.pruefungsKommentar = pruefungsKommentar; // Pflichtkommentar zur Prüfung
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'sachlich-geprueft',
        beschreibung: 'Antrag sachlich/fachlich geprüft',
        details: { kommentar: pruefungsKommentar },
        benutzerTyp: 'mitarbeiter',
        benutzerId: mitarbeiterId,
        benutzerName: mitarbeiterName
      });
      
      return antrag;
    }
    return null;
  }

  // Insassen-ID für Benachrichtigung ermitteln (Fallback: Suche nach Name, damit Insasse immer benachrichtigt wird)
  _getInsasseIdFuerBenachrichtigung(antrag) {
    if (antrag.insasseId) return antrag.insasseId;
    // Fallback 1: Insassen-Nummer
    if (antrag.insassenNummer) {
      const insassen = userSystem.getInsassen();
      const byNummer = insassen.find(
        (u) => String(u.insassenNummer || '').trim() === String(antrag.insassenNummer || '').trim()
      );
      if (byNummer) return byNummer.id;
    }
    if (!antrag.insasseName) return null;
    // Fallback 2: Vollständiger Name
    const name = String(antrag.insasseName).trim();
    const insassen = userSystem.getInsassen();
    const insasse = insassen.find(u => `${(u.vorname || '').trim()} ${(u.nachname || '').trim()}`.trim() === name);
    return insasse ? insasse.id : null;
  }

  // Antrag abschließen (genehmigen, ablehnen, teilweise genehmigen)
  abschliessenAntrag(id, status, begruendung = null, persoenlichEroeffnen = false, bescheidPdf = null, vollzugVorBekanntgabe = false) {
    const antrag = this.antraege.find(a => a.id === id);
    if (antrag) {
      const bearbeiterId = antrag.bearbeiterId;
      const bearbeiterName = antrag.bearbeiterName;
      
      // Gruppenzuweisung für "Antrag nehmen" löschen (Antrag ist nicht mehr "zu nehmen")
      // HINWEIS: Gruppenaufgaben werden NICHT automatisch geschlossen
      // Aufgaben können jederzeit bis zur Veraktung zugewiesen werden
      antrag.zugewiesenAnGruppe = null;
      antrag.zugewiesenAnGruppeName = null;
      antrag.hauptbearbeitungWartetAufUebernahme = false;
      
      // Entscheidung speichern (kann nur von Hausleitung revidiert werden)
      antrag.entscheidungGetroffen = true;
      antrag.entscheidungVon = bearbeiterName;
      antrag.entscheidungVonId = bearbeiterId;
      antrag.entscheidungAm = new Date().toISOString();
      
      // Bescheid speichern wenn vorhanden
      if (bescheidPdf) {
        antrag.bescheidPdf = bescheidPdf;
      }
      
      // Wenn "persönlich eröffnen" und/oder "Vollzug vor Bekanntgabe" gewählt wurde
      if (persoenlichEroeffnen || vollzugVorBekanntgabe) {
        antrag.geplantesErgebnis = status;
        antrag.geplanteBegruendung = begruendung;
        
        // Beide Flags können gleichzeitig gesetzt werden
        if (persoenlichEroeffnen) {
          antrag.wartetAufEroeffnung = true;
        }
        if (vollzugVorBekanntgabe) {
          antrag.wartetAufVollzug = true;
        }
        
        // Status bleibt "in-bearbeitung" für den Insassen
        this.saveAntraege();
        
        // Aktivität protokollieren
        const statusText = status === 'genehmigt' ? 'Genehmigung' : 
                          status === 'abgelehnt' ? 'Ablehnung' : 'Teilweise Genehmigung';
        let aktionBeschreibung = `${statusText} vorbereitet`;
        if (persoenlichEroeffnen && vollzugVorBekanntgabe) {
          aktionBeschreibung += ' (persönliche Eröffnung + Vollzug vor Bekanntgabe)';
        } else if (persoenlichEroeffnen) {
          aktionBeschreibung += ' (persönliche Eröffnung)';
        } else {
          aktionBeschreibung += ' (Vollzug vor Bekanntgabe)';
        }
        
        aktivitaetenSystem.logAktivitaet({
          antragId: id,
          typ: 'entscheidung-geplant',
          beschreibung: aktionBeschreibung,
          details: begruendung ? { begruendung: begruendung } : null,
          benutzerTyp: 'mitarbeiter',
          benutzerId: bearbeiterId,
          benutzerName: bearbeiterName
        });
        
        return antrag;
      }
      
      antrag.status = status;
      antrag.bearbeitetAm = new Date().toISOString();
      antrag.erledigt = true;
      antrag.wartetAufEroeffnung = false;
      antrag.wartetAufVollzug = false;
      if (begruendung) {
        antrag.begruendung = begruendung;
      }
      this.saveAntraege();

      // Aktivität protokollieren
      const statusText = status === 'genehmigt' ? 'Genehmigt' : 
                        status === 'abgelehnt' ? 'Abgelehnt' : 'Teilweise genehmigt';
      aktivitaetenSystem.logAktivitaet({
        antragId: id,
        typ: 'entscheidung',
        beschreibung: `Entscheidung: ${statusText}`,
        details: begruendung ? { begruendung: begruendung } : null,
        benutzerTyp: 'mitarbeiter',
        benutzerId: bearbeiterId,
        benutzerName: bearbeiterName
      });

      // Benachrichtigung für den Insassen erstellen
      const antragsTyp = this.getAntragTypLabel(antrag.type);
      let title, message;
      // Begründung als Text extrahieren (kann Objekt oder String sein)
      const begruendungText = begruendung ? (typeof begruendung === 'object' ? getTranslatedUserText(begruendung) : begruendung) : '';
      
      if (status === 'genehmigt') {
        title = 'Antrag genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde genehmigt.`;
      } else if (status === 'abgelehnt') {
        title = 'Antrag abgelehnt';
        message = `Ihr Antrag "${antragsTyp}" wurde leider abgelehnt.${begruendungText ? ' Begruendung: ' + begruendungText : ''}`;
      } else       if (status === 'teilweise-genehmigt') {
        title = 'Antrag teilweise genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde teilweise genehmigt.${begruendungText ? ' Hinweis: ' + begruendungText : ''}`;
      }
      
      const insasseId = this._getInsasseIdFuerBenachrichtigung(antrag);
      if (title && insasseId) {
        notificationSystem.createNotification(insasseId, status, title, message, antrag.id);
      }
    }
    return antrag;
  }
  
  // Vollzug vor Bekanntgabe bestätigen
  bestaetigeVollzugVorBekanntgabe(id, vollzugKommentar, mitarbeiterId, mitarbeiterName) {
    const antrag = this.antraege.find(a => a.id === id && a.wartetAufVollzug);
    if (antrag) {
      const status = antrag.geplantesErgebnis;
      const begruendung = antrag.geplanteBegruendung;
      
      antrag.status = status;
      antrag.bearbeitetAm = new Date().toISOString();
      antrag.erledigt = true;
      antrag.wartetAufVollzug = false;
      antrag.vollzugBestaetigt = true;
      antrag.vollzugKommentar = vollzugKommentar; // Dieser Kommentar ist für den Insassen sichtbar
      antrag.vollzugBestaetigtAm = new Date().toISOString();
      antrag.vollzugBestaetigtVon = mitarbeiterName;
      antrag.vollzugBestaetigtVonId = mitarbeiterId;
      if (begruendung) {
        antrag.begruendung = begruendung;
      }
      this.saveAntraege();

      // Aktivität protokollieren
      const statusText = status === 'genehmigt' ? 'Genehmigt' : 
                        status === 'abgelehnt' ? 'Abgelehnt' : 'Teilweise genehmigt';
      aktivitaetenSystem.logAktivitaet({
        antragId: id,
        typ: 'vollzug-bestaetigt',
        beschreibung: `Vollzug bestätigt, Entscheidung bekannt gegeben: ${statusText}`,
        details: { vollzugKommentar: vollzugKommentar },
        benutzerTyp: 'mitarbeiter',
        benutzerId: mitarbeiterId,
        benutzerName: mitarbeiterName
      });

      // Benachrichtigung für den Insassen erstellen (mit Vollzugs-Kommentar)
      const antragsTyp = this.getAntragTypLabel(antrag.type);
      let title, message;
      
      if (status === 'genehmigt') {
        title = 'Antrag genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde genehmigt.${vollzugKommentar ? ' Hinweis zum Vollzug: ' + getTranslatedUserText(vollzugKommentar) : ''}`;
      } else if (status === 'abgelehnt') {
        title = 'Antrag abgelehnt';
        message = `Ihr Antrag "${antragsTyp}" wurde leider abgelehnt.${vollzugKommentar ? ' Hinweis: ' + getTranslatedUserText(vollzugKommentar) : ''}`;
      } else if (status === 'teilweise-genehmigt') {
        title = 'Antrag teilweise genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde teilweise genehmigt.${vollzugKommentar ? ' Hinweis: ' + getTranslatedUserText(vollzugKommentar) : ''}`;
      }
      
      const insasseIdVollzug = this._getInsasseIdFuerBenachrichtigung(antrag);
      if (title && insasseIdVollzug) {
        notificationSystem.createNotification(insasseIdVollzug, status, title, message, antrag.id);
      }
      
      return antrag;
    }
    return null;
  }
  
  // Entscheidung revidieren (deaktiviert)
  // Rechtliche Anforderung: Eine getroffene Entscheidung ist final und darf nicht zurückgesetzt werden.
  revidiereEntscheidung(id, mitarbeiterId, mitarbeiterName) {
    console.warn('revidiereEntscheidung ist deaktiviert:', { id, mitarbeiterId, mitarbeiterName });
    return null;
  }

  // Persönliche Eröffnung bestätigen
  bestaetigePersoenlicheEroeffnung(id) {
    const antrag = this.antraege.find(a => a.id === id && a.wartetAufEroeffnung);
    if (antrag) {
      const status = antrag.geplantesErgebnis;
      const begruendung = antrag.geplanteBegruendung;
      const bearbeiterId = antrag.bearbeiterId;
      const bearbeiterName = antrag.bearbeiterName;
      
      // Persönliche Eröffnung als bestätigt markieren
      antrag.wartetAufEroeffnung = false;
      antrag.persoenlichEroeffnet = true;
      antrag.persoenlichEroeffnetAm = new Date().toISOString();
      
      // Aktivität protokollieren
      const statusText = status === 'genehmigt' ? 'Genehmigt' : 
                        status === 'abgelehnt' ? 'Abgelehnt' : 'Teilweise genehmigt';
      aktivitaetenSystem.logAktivitaet({
        antragId: id,
        typ: 'persoenlich-eroeffnet',
        beschreibung: `Persönliche Eröffnung: ${statusText}`,
        details: begruendung ? { begruendung: begruendung } : null,
        benutzerTyp: 'mitarbeiter',
        benutzerId: bearbeiterId,
        benutzerName: bearbeiterName
      });
      
      // Wenn auch Vollzug vor Bekanntgabe gesetzt ist:
      // Bekanntgabe ist erledigt, daher Ergebnisstatus bereits setzen,
      // aber noch NICHT als erledigt markieren. Der Antrag geht damit
      // in die Phase "Vollzug" und erst nach Vollzugsbestätigung weiter.
      if (antrag.wartetAufVollzug) {
        antrag.status = status;
        antrag.bearbeitetAm = new Date().toISOString();
        if (begruendung) {
          antrag.begruendung = begruendung;
        }
        const insasseIdEroeffnungInfo = this._getInsasseIdFuerBenachrichtigung(antrag);
        if (insasseIdEroeffnungInfo) {
          notificationSystem.createNotification(
            insasseIdEroeffnungInfo,
            'bekanntgabe-abgeschlossen',
            'Bekanntgabe abgeschlossen',
            `Die Bekanntgabe zu Ihrem Antrag ${antrag.antragsNummer || antrag.id} wurde abgeschlossen. Der Vollzug ist als nächster Schritt vorgesehen.`,
            antrag.id
          );
        }
        // Noch nicht abschließen - erst wenn Vollzug bestätigt ist.
        this.saveAntraege();
        return antrag;
      }
      
      // Nur persönliche Eröffnung - jetzt abschließen
      antrag.status = status;
      antrag.bearbeitetAm = new Date().toISOString();
      antrag.erledigt = true;
      if (begruendung) {
        antrag.begruendung = begruendung;
      }
      
      // Geplante Felder löschen
      delete antrag.geplantesErgebnis;
      delete antrag.geplanteBegruendung;
      
      this.saveAntraege();
      
      // Benachrichtigung für den Insassen erstellen
      const antragsTyp = this.getAntragTypLabel(antrag.type);
      let title, message;
      
      if (status === 'genehmigt') {
        title = 'Antrag genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde genehmigt.`;
      } else if (status === 'abgelehnt') {
        title = 'Antrag abgelehnt';
        message = `Ihr Antrag "${antragsTyp}" wurde leider abgelehnt.${begruendung ? ' Begründung: ' + (typeof begruendung === 'object' ? getTranslatedUserText(begruendung) : begruendung) : ''}`;
      } else if (status === 'teilweise-genehmigt') {
        title = 'Antrag teilweise genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde teilweise genehmigt.${begruendung ? ' Hinweis: ' + (typeof begruendung === 'object' ? getTranslatedUserText(begruendung) : begruendung) : ''}`;
      }
      
      const insasseIdEroeffnung = this._getInsasseIdFuerBenachrichtigung(antrag);
      if (title && insasseIdEroeffnung) {
        notificationSystem.createNotification(insasseIdEroeffnung, status, title, message, antrag.id);
      }
    }
    return antrag;
  }

  // Anträge die auf persönliche Eröffnung warten
  getWartendeEroeffnungen(mitarbeiterId) {
    return this.antraege.filter(a => 
      a.wartetAufEroeffnung && a.bearbeiterId === mitarbeiterId
    ).sort((a, b) => new Date(a.erstelltAm) - new Date(b.erstelltAm));
  }

  // Antrag neu einreichen (nur für Entwürfe oder zurückgegebene Anträge)
  // KEIN Zurücksetzen von Anträgen die bereits in Bearbeitung waren
  updateAntragMonat(id, monat) {
    const antrag = this.antraege.find(a => a.id === id);
    // Nur erlaubt wenn Antrag noch Entwurf ist
    if (antrag && antrag.status === 'entwurf') {
      antrag.monat = monat;
      this.saveAntraege();
    }
    return antrag;
  }

  updateAntragEigentum(id, aktion, kleidung) {
    const antrag = this.antraege.find(a => a.id === id);
    // Nur erlaubt wenn Antrag noch Entwurf ist
    if (antrag && antrag.status === 'entwurf') {
      antrag.aktion = aktion;
      antrag.kleidung = kleidung;
      this.saveAntraege();
    }
    return antrag;
  }

  deleteAntrag(id) {
    this.antraege = this.antraege.filter(a => a.id !== id);
    this.saveAntraege();
  }

  getAntrag(id) {
    if (id == null || id === '') return undefined;
    const s = String(id);
    return this.antraege.find((a) => String(a.id) === s);
  }

  // ====== INSASSEN-FUNKTIONEN ======

  _gehoertZuInsasse(antrag, insasseId, insasseName) {
    const sid = String(insasseId);
    if (antrag.insasseId != null && antrag.insasseId !== '' && String(antrag.insasseId) === sid) {
      return true;
    }
    const name = (insasseName || '').trim();
    if (name && antrag.insasseName && antrag.insasseName.trim() === name) {
      return true;
    }
    return false;
  }

  /** Abgeschlossen aus Sicht des Insassenportals (Historie-Tab). */
  _istAbgeschlossenFuerInsassenPortal(antrag) {
    if (!antrag || antrag.status === 'entwurf') return false;
    if (antrag.wartetAufEroeffnung || antrag.wartetAufVollzug) return false;
    if (antrag.erledigt === true) return true;
    return ['genehmigt', 'abgelehnt', 'teilweise-genehmigt', 'zurueckgegeben'].includes(antrag.status);
  }

  // Entwürfe eines bestimmten Insassen
  getEntwuerfeInsasse(insasseId, insasseName) {
    return this.antraege
      .filter((a) => this._gehoertZuInsasse(a, insasseId, insasseName) && a.status === 'entwurf')
      .sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Aktive Anträge eines bestimmten Insassen (ohne Entwürfe, ohne abgeschlossene)
  getAktiveAntraegeInsasse(insasseId, insasseName) {
    return this.antraege
      .filter((a) => {
        if (!this._gehoertZuInsasse(a, insasseId, insasseName)) return false;
        if (a.status === 'entwurf') return false;
        return !this._istAbgeschlossenFuerInsassenPortal(a);
      })
      .sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Historie: abgeschlossene Anträge (genehmigt, abgelehnt, zurückgegeben, …)
  getHistorieInsasse(insasseId, insasseName) {
    return this.antraege
      .filter((a) => {
        if (!this._gehoertZuInsasse(a, insasseId, insasseName)) return false;
        return this._istAbgeschlossenFuerInsassenPortal(a);
      })
      .sort((a, b) => new Date(b.bearbeitetAm || b.erstelltAm) - new Date(a.bearbeitetAm || a.erstelltAm));
  }

  // ====== MITARBEITER-FUNKTIONEN ======

  // Hilfsfunktion: Prüft ob Haus/JVA übereinstimmt (kompatibel mit beiden Formaten)
  _matchesHaus(mitarbeiterJvas, antragJva) {
    if (!mitarbeiterJvas || !antragJva) return false;
    
    // Normalisiere beide Werte (jva1 <-> haus1)
    const normalisiereHaus = (val) => {
      if (!val) return val;
      return val.replace('jva', 'haus');
    };
    
    const antragHausNormalisiert = normalisiereHaus(antragJva);
    return mitarbeiterJvas.some(j => normalisiereHaus(j) === antragHausNormalisiert);
  }

  _rolleNorm(rolle) {
    return String(rolle || '').toLowerCase();
  }

  /** Klassische VAL (ein oder mehrere Häuser) */
  _istKlassischeValRolle(rolle) {
    const r = this._rolleNorm(rolle);
    return r === 'hausleitung' || r === 'jva-leitung' || r === 'haus-leitung';
  }

  /** VAL, Anstaltsleitung oder Stationsleitung/Wohngruppenleitung (VAL-Umfang) */
  _istValWeitMitarbeiter(mitarbeiter) {
    const r = this._rolleNorm(mitarbeiter?.rolle);
    return this._istKlassischeValRolle(r) || r === 'anstaltsleitung' || r === 'stationshausleitung';
  }

  /** Ob der Antrag im Sichtfeld dieser VAL-ähnlichen Rolle liegt */
  _valAntragSichtbar(mitarbeiter, antrag) {
    const r = this._rolleNorm(mitarbeiter?.rolle);
    if (r === 'anstaltsleitung') return !!(antrag && (antrag.insasseJva || antrag.insasseId));
    if (r === 'stationshausleitung') {
      return !!(antrag &&
        this._matchesHaus(mitarbeiter.jvas, antrag.insasseJva) &&
        String(antrag.insasseStation ?? '') === String(mitarbeiter.station ?? ''));
    }
    if (this._istKlassischeValRolle(r)) {
      return this._matchesHaus(mitarbeiter.jvas, antrag.insasseJva);
    }
    return false;
  }

  // Anträge und Aufgaben der Gruppe für Mitarbeiter (basierend auf Haus/Station)
  getOffeneAntraegeMitarbeiter(mitarbeiter) {
    const istValWeit = this._istValWeitMitarbeiter(mitarbeiter);
    
    // Vorab alle Antrags-IDs mit Gruppenaufgaben für diesen Mitarbeiter ermitteln
    const antragsIdsMitGruppenaufgaben = aufgabenSystem.getAntragsIdsMitGruppenaufgaben(mitarbeiter);
    
    console.log('[Debug] getOffeneAntraegeMitarbeiter:', {
      mitarbeiterId: mitarbeiter.userId,
      istValWeit: istValWeit,
      jvas: mitarbeiter.jvas,
      antragsIdsMitGruppenaufgaben: antragsIdsMitGruppenaufgaben,
      gesamtAntraege: this.antraege.length,
      alleAntraege: this.antraege.map(a => ({
        id: a.id,
        status: a.status,
        bearbeiterId: a.bearbeiterId,
        insasseJva: a.insasseJva,
        veraktet: a.veraktet,
        zugewiesenAnGruppe: a.zugewiesenAnGruppe,
        hauptbearbeitungWartetAufUebernahme: a.hauptbearbeitungWartetAufUebernahme
      }))
    });
    
    const gefilterteAntraege = this.antraege.filter(a => {
      // 1. Offene Anträge (noch kein Bearbeiter)
      if (a.status === 'offen') {
        // VAL sieht IMMER alle Anträge ihres Hauses, auch wenn sie einer Gruppe zugewiesen sind
        if (istValWeit && this._valAntragSichtbar(mitarbeiter, a)) {
          return true;
        }
        
        // Prüfen ob der Antrag einer Gruppe zugewiesen wurde
        if (a.zugewiesenAnGruppe) {
          // Nur Mitglieder der zugewiesenen Gruppe sehen den Antrag
          return this._mitarbeiterGehoertZuGruppe(mitarbeiter, a.zugewiesenAnGruppe);
        }
        
        // Normale offene Anträge (ohne Gruppenzuweisung)
        // Mitarbeiter und Stationsleitung sehen nur ihre Station
        return this._matchesHaus(mitarbeiter.jvas, a.insasseJva) && 
               a.insasseStation === mitarbeiter.station;
      }
      
      // 2. Anträge in Bearbeitung mit Gruppenzuweisung (Weiterleitung an Gruppe)
      // Hinweis: hauptbearbeitungWartetAufUebernahme darf nicht Pflicht sein — nach Sync/Import oft undefined,
      // sonst sieht z. B. die Zahlstelle nichts. Bearbeiter wird weiterhin über bearbeiterId ausgeschlossen.
      if (a.status === 'in-bearbeitung' && a.zugewiesenAnGruppe) {
        const selfId = String(mitarbeiter.userId ?? mitarbeiter.id ?? '');
        if (a.bearbeiterId != null && a.bearbeiterId !== '' && String(a.bearbeiterId) === selfId) {
          return false;
        }
        if (istValWeit && this._valAntragSichtbar(mitarbeiter, a)) {
          return true;
        }
        return this._mitarbeiterGehoertZuGruppe(mitarbeiter, a.zugewiesenAnGruppe);
      }
      
      // 3. Anträge mit NEUEN/OFFENEN Gruppenaufgaben für diesen Mitarbeiter
      // Wenn eine neue Aufgabe an die Gruppe zugewiesen wird (auch nach Entscheidung),
      // soll die Gruppe den Antrag sehen und bearbeiten können
      if (antragsIdsMitGruppenaufgaben.includes(a.id)) {
        // Nicht für den aktuellen Bearbeiter anzeigen (der sieht den Antrag sowieso)
        if (String(a.bearbeiterId) === String(mitarbeiter.userId)) {
          return false;
        }
        // Nicht für veraktete Anträge
        if (a.veraktet) {
          return false;
        }
        return true;
      }
      
      // 4. VAL sieht ALLE Anträge des Hauses in "Anträge und Aufgaben meiner Gruppe"
      // VAL kann alle Anträge sehen und jederzeit übernehmen, auch wenn sie bereits einem anderen Bearbeiter zugewiesen sind
      // WICHTIG: VAL sieht auch Anträge die bereits einem Bearbeiter zugewiesen sind (z.B. AVD)
      if (istValWeit && !a.veraktet) {
        if (!this._valAntragSichtbar(mitarbeiter, a)) return false;
        
        // Nicht anzeigen wenn VAL bereits der Bearbeiter ist (erscheint dann in "Meine Anträge")
        if (String(a.bearbeiterId) === String(mitarbeiter.userId)) return false;
        
        // VAL sieht ALLE anderen Anträge, unabhängig vom Status oder Bearbeiter
        // Auch Anträge die bereits einem AVD oder anderen Mitarbeiter zugewiesen sind
        return true;
      }
      
      return false;
    });
    
    // Debug: Prüfe welche Anträge NICHT gefiltert wurden
    const nichtGefilterteAntraege = this.antraege.filter(a => !gefilterteAntraege.includes(a));
    console.log('[Debug] getOffeneAntraegeMitarbeiter Ergebnis:', {
      gefiltert: gefilterteAntraege.length,
      nichtGefiltert: nichtGefilterteAntraege.length,
      gefilterteAntraege: gefilterteAntraege.map(a => ({
        id: a.id,
        status: a.status,
        bearbeiterId: a.bearbeiterId,
        insasseJva: a.insasseJva,
        zugewiesenAnGruppe: a.zugewiesenAnGruppe,
        hauptbearbeitungWartetAufUebernahme: a.hauptbearbeitungWartetAufUebernahme,
        veraktet: a.veraktet
      })),
      nichtGefilterteAntraege: nichtGefilterteAntraege.map(a => ({
        id: a.id,
        status: a.status,
        bearbeiterId: a.bearbeiterId,
        insasseJva: a.insasseJva,
        veraktet: a.veraktet,
        matchesHaus: istValWeit ? this._valAntragSichtbar(mitarbeiter, a) : false,
        istEigenerBearbeiter: a.bearbeiterId === mitarbeiter.userId
      }))
    });
    
    return gefilterteAntraege.sort((a, b) => new Date(a.erstelltAm) - new Date(b.erstelltAm));
  }
  
  // Prüft ob ein Mitarbeiter zu einer Gruppe gehört
  _mitarbeiterGehoertZuGruppe(mitarbeiter, gruppe) {
    if (!gruppe) {
      console.log('[Debug] _mitarbeiterGehoertZuGruppe: gruppe ist null/undefined');
      return false;
    }

    const gruppeTypNorm = (gruppe.typ || '').toString().toLowerCase();
    const rolleNorm = (mitarbeiter.rolle || '').toString().toLowerCase();

    if (istAnstaltsweiteSpezialGruppeTyp(gruppeTypNorm)) {
      return rolleNorm === gruppeTypNorm;
    }

    if (gruppeTypNorm === 'anstaltsleitung') {
      return rolleNorm === 'anstaltsleitung';
    }

    if (gruppeTypNorm === 'zahlstelle') {
      return rolleNorm === 'zahlstelle';
    }
    if (gruppeTypNorm === 'arbeitskoordination') {
      return rolleNorm === 'arbeitskoordination';
    }

    const istValKlassisch = this._istKlassischeValRolle(mitarbeiter.rolle);
    const istValWeit = this._istValWeitMitarbeiter(mitarbeiter);

    const normHausId = gruppe.hausId ? gruppe.hausId.replace('jva', 'haus') : null;

    let mitarbeiterHaeuser = [];
    if (mitarbeiter.jvas && Array.isArray(mitarbeiter.jvas)) {
      mitarbeiterHaeuser = mitarbeiter.jvas.map((h) => {
        const id = typeof h === 'string' ? h : (h && h.id);
        return id ? id.replace('jva', 'haus') : null;
      }).filter(Boolean);
    } else if (mitarbeiter.jva) {
      mitarbeiterHaeuser = [mitarbeiter.jva.replace('jva', 'haus')];
    }

    const imSelbenHaus = normHausId && mitarbeiterHaeuser.some((h) => (h || '') === (normHausId || ''));
    const anstaltsGanzeAnstalt = rolleNorm === 'anstaltsleitung' && !!normHausId;

    console.log('[Debug] _mitarbeiterGehoertZuGruppe:', {
      mitarbeiterRolle: mitarbeiter.rolle,
      mitarbeiterHaeuser,
      mitarbeiterStation: mitarbeiter.station,
      gruppeTyp: gruppe.typ,
      gruppeHausId: normHausId,
      gruppeStation: gruppe.station,
      imSelbenHaus,
      istValWeit
    });

    if (gruppeTypNorm === 'stationsleitung') {
      if (rolleNorm !== 'stationsleitung') return false;
      if (!normHausId) return false;
      if (!imSelbenHaus) return false;
      return String(mitarbeiter.station ?? '') === String(gruppe.station ?? '');
    }

    if (!normHausId) return false;
    if (!imSelbenHaus && !anstaltsGanzeAnstalt) return false;

    if (gruppeTypNorm === 'hausleitung') {
      return istValKlassisch || rolleNorm === 'anstaltsleitung' || rolleNorm === 'stationshausleitung';
    }
    if (gruppeTypNorm === 'station' || gruppeTypNorm === 'avd') {
      if (istValKlassisch || rolleNorm === 'anstaltsleitung' || rolleNorm === 'stationshausleitung') return false;
      const mStation = String(mitarbeiter.station ?? '');
      const gStation = String(gruppe.station ?? '');
      return mStation === gStation || (mStation === '' && gStation === '');
    }

    return false;
  }

  // In Bearbeitung befindliche Anträge (nur nicht abgeschlossene)
  getInBearbeitungAntraege(mitarbeiter) {
    return this.antraege.filter(a => {
      // Sobald abgeschlossen, nicht mehr in "Bearbeitung" anzeigen
      if (a.erledigt === true) return false;
      if (a.status !== 'in-bearbeitung') return false;
      
      // Prüfen ob Mitarbeiter berechtigt ist (Bearbeiter, Aufgaben-Beteiligter oder hat bereits am Antrag gearbeitet)
      const istBearbeiter = String(a.bearbeiterId) === String(mitarbeiter.userId);
      const aufgabenZuAntrag = aufgabenSystem.getAufgabenZuAntrag(a.id);
      // Aufgabenkette: Jeder der eine Aufgabe erstellt oder erhalten hat, hat Zugriff
      const hatAufgabeErhalten = aufgabenZuAntrag.some(auf => String(auf.zugewiesenAnId) === String(mitarbeiter.userId));
      const hatAufgabeErstellt = aufgabenZuAntrag.some(auf => String(auf.erstelltVonId) === String(mitarbeiter.userId));
      // Aktivitätsbezug: Jeder der bereits eine Aktion am Antrag durchgeführt hat
      const hatAmAntragGearbeitet = aktivitaetenSystem.istMitarbeiterBeteiligt(a.id, mitarbeiter.userId);
      const hatAufgabenbezug = hatAufgabeErhalten || hatAufgabeErstellt || hatAmAntragGearbeitet;
      
      // VAL sieht in "Meine Anträge und Aufgaben" NUR Anträge, bei denen:
      // 1. Sie der Hauptbearbeiter ist (hat Antrag übernommen)
      // 2. Sie persönlich (nicht über Gruppe) eine Aufgabe erhalten hat
      // 3. Sie am Antrag gearbeitet hat (z.B. Aufgabe erstellt)
      // Alle anderen Anträge des Hauses erscheinen in "Anträge und Aufgaben meiner Gruppe"
      if (this._istValWeitMitarbeiter(mitarbeiter)) {
        if (!this._valAntragSichtbar(mitarbeiter, a)) return false;
        
        // Nur wenn persönlicher Bezug besteht
        return istBearbeiter || hatAufgabenbezug;
      }
      
      // Stationsleitung sieht alle "in Bearbeitung" Anträge ihrer Station
      if (mitarbeiter.rolle === 'stationsleitung') {
        return this._matchesHaus(mitarbeiter.jvas, a.insasseJva) && 
               a.insasseStation === mitarbeiter.station;
      }
      
      // Normale Mitarbeiter sehen ihre persönlich bearbeiteten Anträge ODER Anträge mit Aufgabenbezug
      return istBearbeiter || hatAufgabenbezug;
    }).sort((a, b) => new Date(a.erstelltAm) - new Date(b.erstelltAm));
  }

  // Historie für Mitarbeiter (abgeschlossene oder veraktete Anträge)
  getHistorieMitarbeiter(mitarbeiter) {
    return this.antraege.filter(a => {
      // CRITICAL: Im Mitarbeiterportal gehört ein Antrag erst dann in "Erledigt",
      // wenn die Phase "Abschluss" wirklich abgeschlossen ist (= veraktet).
      // Ein nur "erledigter" Antrag nach Bekanntgabe reicht dafür nicht aus.
      if (a.veraktet !== true) return false;
      
      // VAL sieht alle verakteten Anträge ihres Hauses
      if (this._istValWeitMitarbeiter(mitarbeiter)) {
        return this._valAntragSichtbar(mitarbeiter, a);
      }
      
      // Stationsleitung sieht alle verakteten Anträge ihrer Station
      if (mitarbeiter.rolle === 'stationsleitung') {
        return this._matchesHaus(mitarbeiter.jvas, a.insasseJva) && 
               a.insasseStation === mitarbeiter.station;
      }
      
      // Normale Mitarbeiter sehen ihre persönlich bearbeiteten Anträge
      // ODER Anträge, zu denen sie eine Aufgabe hatten oder an denen sie gearbeitet haben
      const istBearbeiter = String(a.bearbeiterId) === String(mitarbeiter.userId);
      const aufgabenZuAntrag = aufgabenSystem.getAufgabenZuAntrag(a.id);
      const hatteAufgabe = aufgabenZuAntrag.some(auf => 
        String(auf.zugewiesenAnId) === String(mitarbeiter.userId) || String(auf.erstelltVonId) === String(mitarbeiter.userId)
      );
      const hatAmAntragGearbeitet = aktivitaetenSystem.istMitarbeiterBeteiligt(a.id, mitarbeiter.userId);
      
      return istBearbeiter || hatteAufgabe || hatAmAntragGearbeitet;
    }).sort((a, b) => new Date(b.veraktetAm || b.bearbeitetAm) - new Date(a.veraktetAm || a.bearbeitetAm));
  }

  // Antrag verakten
  verakteAntrag(antragId, mitarbeiterId, mitarbeiterName) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag) {
      // PHASENÜBERGANG: Alle offenen Aufgaben für diesen Antrag schließen
      aufgabenSystem.schliesseAlleGruppenAufgabenFuerAntrag(antragId);
      
      antrag.veraktet = true;
      antrag.veraktetAm = new Date().toISOString();
      antrag.veraktetVon = mitarbeiterName;
      antrag.veraktetVonId = mitarbeiterId;
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'veraktet',
        beschreibung: 'Antrag veraktet',
        benutzerTyp: 'mitarbeiter',
        benutzerId: mitarbeiterId,
        benutzerName: mitarbeiterName
      });
      
      return antrag;
    }
    return null;
  }

  // Antrag als vollzogen markieren
  markiereAlsVollzogen(antragId, mitarbeiterId, mitarbeiterName) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.erledigt) {
      antrag.vollzogen = true;
      antrag.vollzogenAm = new Date().toISOString();
      antrag.vollzogenVon = mitarbeiterName;
      antrag.vollzogenVonId = mitarbeiterId;
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'vollzogen',
        beschreibung: 'Antrag vollzogen',
        benutzerTyp: 'mitarbeiter',
        benutzerId: mitarbeiterId,
        benutzerName: mitarbeiterName
      });
      
      return antrag;
    }
    return null;
  }

  // Markiert, dass ein Benutzer den Antrag nach Aufgabenerledigung abgegeben hat
  // Der Antrag geht zurück an den Aufgabensteller
  markiereAufgabeAbgegeben(antragId, benutzerId) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag) {
      // Liste der Benutzer, die den Antrag abgegeben haben
      if (!antrag.abgegebenVon) {
        antrag.abgegebenVon = [];
      }
      if (!antrag.abgegebenVon.includes(benutzerId)) {
        antrag.abgegebenVon.push(benutzerId);
      }
      this.saveAntraege();
      return antrag;
    }
    return null;
  }

  // Bearbeitung übernehmen - Benutzer wird neuer Hauptbearbeiter
  uebernehmBearbeitung(antragId, neuBearbeiterId, neuBearbeiterName, altBearbeiterId) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag) {
      // Alten Bearbeiter als "abgegeben" markieren
      if (!antrag.abgegebenVon) {
        antrag.abgegebenVon = [];
      }
      if (altBearbeiterId && !antrag.abgegebenVon.includes(altBearbeiterId)) {
        antrag.abgegebenVon.push(altBearbeiterId);
      }
      
      // WICHTIG: Neuen Bearbeiter aus "abgegebenVon" entfernen, falls er früher abgegeben hat
      if (antrag.abgegebenVon.includes(neuBearbeiterId)) {
        antrag.abgegebenVon = antrag.abgegebenVon.filter(id => id !== neuBearbeiterId);
      }
      
      // Neuen Bearbeiter setzen
      antrag.bearbeiterId = neuBearbeiterId;
      antrag.bearbeiterName = neuBearbeiterName;
      
      // Falls noch nicht in Bearbeitung, jetzt setzen
      if (antrag.status === 'offen') {
        antrag.status = 'in-bearbeitung';
      }
      
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'bearbeitung-uebernommen',
        beschreibung: `Bearbeitung übernommen von ${neuBearbeiterName}`,
        benutzerTyp: 'mitarbeiter',
        benutzerId: neuBearbeiterId,
        benutzerName: neuBearbeiterName
      });
      
      return antrag;
    }
    return null;
  }

  // Prüft, ob ein Benutzer den Antrag abgegeben hat
  hatAntragAbgegeben(antragId, benutzerId) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.abgegebenVon) {
      return antrag.abgegebenVon.includes(benutzerId);
    }
    return false;
  }

  // Entfernt einen Benutzer aus der "abgegebenVon"-Liste
  // Wird verwendet, wenn jemand durch Aufgabe oder Weiterleitung wieder Zugriff bekommen soll
  entferneAusAbgegebenVon(antragId, benutzerId) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.abgegebenVon && antrag.abgegebenVon.includes(benutzerId)) {
      antrag.abgegebenVon = antrag.abgegebenVon.filter(id => id !== benutzerId);
      this.saveAntraege();
      return true;
    }
    return false;
  }

  // Kommentar zu einem Antrag hinzufügen
  // typ: 'privat' (nur Ersteller), 'alle' (alle Mitarbeiter), 'akte' (alle + in Veraktungs-PDF)
  addKommentar(antragId, kommentarText, benutzerId, benutzerName, typ = 'alle') {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag) {
      if (!antrag.kommentare) {
        antrag.kommentare = [];
      }
      
      const kommentar = {
        id: 'KOM-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        text: kommentarText,
        benutzerId: benutzerId,
        benutzerName: benutzerName,
        typ: typ, // 'privat', 'alle', 'akte'
        erstelltAm: new Date().toISOString()
      };
      
      antrag.kommentare.push(kommentar);
      this.saveAntraege();
      
      // Aktivität nur protokollieren wenn NICHT privat (nur bei 'alle' und 'akte')
      if (typ !== 'privat') {
        aktivitaetenSystem.logAktivitaet({
          antragId: antragId,
          typ: 'kommentar',
          beschreibung: typ === 'akte' ? 'Notiz fuer Akte hinzugefuegt' : 'Notiz hinzugefuegt',
          details: { 
            kommentarId: kommentar.id,
            kommentarText: kommentarText,  // Kommentartext für Anzeige im Verlauf
            kommentarTyp: typ
          },
          benutzerTyp: 'mitarbeiter',
          benutzerId: benutzerId,
          benutzerName: benutzerName
        });
      }
      
      return kommentar;
    }
    return null;
  }
  
  // Alle Akte-Notizen eines Antrags abrufen (für Veraktungs-PDF)
  getAkteNotizen(antragId) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.kommentare) {
      return antrag.kommentare.filter(k => k.typ === 'akte');
    }
    return [];
  }

  // Alle Kommentare eines Antrags abrufen
  getKommentare(antragId) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.kommentare) {
      return antrag.kommentare.sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
    }
    return [];
  }

  // Dokument zu einem Antrag hinzufügen
  addDokument(antragId, dokument, benutzerId, benutzerName) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag) {
      if (!antrag.dokumente) {
        antrag.dokumente = [];
      }
      
      dokument.id = 'DOK-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      antrag.dokumente.push(dokument);
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'dokument-hochgeladen',
        beschreibung: 'Dokument hochgeladen: ' + dokument.name,
        details: { dokumentId: dokument.id, dokumentName: dokument.name },
        benutzerTyp: 'mitarbeiter',
        benutzerId: benutzerId,
        benutzerName: benutzerName
      });

      // Nachträglicher Upload nach abgeschlossener Bekanntgabe:
      // Insasse bekommt eine Nachricht (zusätzlich zur ggf. späteren Freigabe-Nachricht).
      const bekanntgabeAbgeschlossen =
        !antrag.wartetAufEroeffnung &&
        (antrag.erledigt === true || antrag.persoenlichEroeffnet === true);
      if (bekanntgabeAbgeschlossen && !dokument.uploadBenachrichtigtAm) {
        const insasseId = this._getInsasseIdFuerBenachrichtigung(antrag);
        if (insasseId) {
          notificationSystem.createNotification(
            insasseId,
            'dokument-nachgereicht',
            'Neues Dokument nachgereicht',
            `Zu Ihrem Antrag ${antrag.antragsNummer || antrag.id} wurde ein weiteres Dokument hochgeladen: ${dokument.name}.`,
            antrag.id
          );
          dokument.uploadBenachrichtigtAm = new Date().toISOString();
          this.saveAntraege();
        }
      }

      return dokument;
    }
    return null;
  }

  // Dokument von einem Antrag entfernen
  removeDokument(antragId, dokumentIndex, benutzerId, benutzerName) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.dokumente && antrag.dokumente[dokumentIndex]) {
      const dokument = antrag.dokumente[dokumentIndex];
      antrag.dokumente.splice(dokumentIndex, 1);
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'dokument-geloescht',
        beschreibung: 'Dokument geloescht: ' + dokument.name,
        details: { dokumentName: dokument.name },
        benutzerTyp: 'mitarbeiter',
        benutzerId: benutzerId,
        benutzerName: benutzerName
      });
      
      return true;
    }
    return false;
  }

  // Dokument für Insassen freigeben
  gebeDokumentFuerInsasseFrei(antragId, dokumentIndex, benutzerId, benutzerName, mitBenachrichtigung = false) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.dokumente && antrag.dokumente[dokumentIndex]) {
      const dokument = antrag.dokumente[dokumentIndex];
      const warSchonFreigegeben = dokument.fuerInsasseFreigegeben === true;
      dokument.fuerInsasseFreigegeben = true;
      dokument.freigegebenVon = benutzerName;
      dokument.freigegebenVonId = benutzerId;
      dokument.freigegebenAm = new Date().toISOString();
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'dokument-freigegeben',
        beschreibung: 'Dokument fuer Insassen freigegeben: ' + dokument.name,
        details: { dokumentName: dokument.name, dokumentId: dokument.id },
        benutzerTyp: 'mitarbeiter',
        benutzerId: benutzerId,
        benutzerName: benutzerName
      });
      
      // Benachrichtigung an Insassen senden:
      // - explizit angefordert (z. B. nachträglicher Freigabe-Dialog), ODER
      // - Antrag ist bereits erledigt und Dokument wurde soeben neu freigegeben.
      const insasseId = this._getInsasseIdFuerBenachrichtigung(antrag);
      const sollBenachrichtigen =
        !!mitBenachrichtigung || (antrag.erledigt === true && !warSchonFreigegeben);
      if (sollBenachrichtigen && insasseId && !dokument.freigabeBenachrichtigtAm) {
        notificationSystem.createNotification(
          insasseId,
          'dokument',
          'Neues Dokument verfuegbar',
          `Ein neues Dokument "${dokument.name}" wurde zu Ihrem Antrag hinzugefuegt.`,
          antragId
        );
        dokument.freigabeBenachrichtigtAm = new Date().toISOString();
        this.saveAntraege();
      }
      
      return dokument;
    }
    return null;
  }

  // Alle für Insassen freigegebenen Dokumente eines Antrags abrufen
  getFreigegebeneDokumente(antragId) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.dokumente) {
      return antrag.dokumente.filter(d => d.fuerInsasseFreigegeben === true);
    }
    return [];
  }

  // Antrag an anderen Mitarbeiter weiterleiten
  weiterleitenAntrag(antragId, neuBearbeiterId, neuBearbeiterName, altBearbeiterId, altBearbeiterName, notiz = '') {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag) {
      // Alten Bearbeiter als "abgegeben" markieren
      if (!antrag.abgegebenVon) {
        antrag.abgegebenVon = [];
      }
      if (altBearbeiterId && !antrag.abgegebenVon.includes(altBearbeiterId)) {
        antrag.abgegebenVon.push(altBearbeiterId);
      }
      
      // WICHTIG: Neuen Bearbeiter aus "abgegebenVon" entfernen, falls er früher abgegeben hat
      // So kann ein ehemaliger Bearbeiter wieder vollen Zugriff bekommen
      if (antrag.abgegebenVon.includes(neuBearbeiterId)) {
        antrag.abgegebenVon = antrag.abgegebenVon.filter(id => id !== neuBearbeiterId);
      }
      
      // Neuen Bearbeiter setzen
      antrag.bearbeiterId = neuBearbeiterId;
      antrag.bearbeiterName = neuBearbeiterName;
      
      // Weiterleitungs-Historie speichern
      if (!antrag.weiterleitungen) {
        antrag.weiterleitungen = [];
      }
      antrag.weiterleitungen.push({
        von: altBearbeiterName,
        vonId: altBearbeiterId,
        an: neuBearbeiterName,
        anId: neuBearbeiterId,
        notiz: notiz,
        datum: new Date().toISOString()
      });
      
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'weitergeleitet',
        beschreibung: `Antrag weitergeleitet an ${neuBearbeiterName}${notiz ? ': ' + notiz : ''}`,
        details: { 
          vonId: altBearbeiterId,
          von: altBearbeiterName,
          anId: neuBearbeiterId, 
          an: neuBearbeiterName,
          notiz: notiz
        },
        benutzerTyp: 'mitarbeiter',
        benutzerId: altBearbeiterId,
        benutzerName: altBearbeiterName
      });
      
      return antrag;
    }
    return null;
  }
  
  // Antrag an Gruppe weiterleiten (ohne konkreten Bearbeiter)
  // hauptbearbeitungUebertragen: wenn true, bleibt der ursprüngliche Bearbeiter zunächst Hauptbearbeiter
  // und die Hauptbearbeitung wird erst übertragen wenn ein Gruppenmitglied den Antrag "nimmt"
  weiterleitenAnGruppe(antragId, gruppe, gruppeName, altBearbeiterId, altBearbeiterName, notiz = '', hauptbearbeitungUebertragen = true) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag) {
      // Gruppe normalisieren (typ kleinschreiben), damit Kammer etc. nach Sync überall erkannt werden
      const typNorm = (gruppe && gruppe.typ != null) ? String(gruppe.typ).toLowerCase() : '';
      const normierteGruppe = {
        typ: typNorm || gruppe.typ,
        hausId: istAnstaltsweiteJvaGruppeTyp(typNorm) ? null : (gruppe.hausId ?? null),
        station: gruppe.station ?? null
      };
      // Gruppenzuweisung speichern
      antrag.zugewiesenAnGruppe = normierteGruppe;
      antrag.zugewiesenAnGruppeName = gruppeName;
      
      // Markierung: Hauptbearbeitung soll bei "Antrag nehmen" übertragen werden
      antrag.hauptbearbeitungWartetAufUebernahme = hauptbearbeitungUebertragen;
      antrag.urspruenglicherBearbeiterId = altBearbeiterId;
      antrag.urspruenglicherBearbeiterName = altBearbeiterName;
      
      if (hauptbearbeitungUebertragen) {
        // Hauptbearbeiter bleibt zunächst erhalten
        // Der Antrag erscheint trotzdem in der Gruppenliste (durch zugewiesenAnGruppe)
        // Status bleibt "in-bearbeitung"
      } else {
        // Bearbeiter entfernen, aber Status bleibt "in-bearbeitung"
        // (kein Zurückfallen auf frühere Phasen)
        if (!antrag.abgegebenVon) {
          antrag.abgegebenVon = [];
        }
        if (altBearbeiterId && !antrag.abgegebenVon.includes(altBearbeiterId)) {
          antrag.abgegebenVon.push(altBearbeiterId);
        }
        
        antrag.bearbeiterId = null;
        antrag.bearbeiterName = null;
        // Status bleibt "in-bearbeitung" - kein Zurückspringen auf "offen"
      }
      
      // Weiterleitungs-Historie speichern
      if (!antrag.weiterleitungen) {
        antrag.weiterleitungen = [];
      }
      antrag.weiterleitungen.push({
        von: altBearbeiterName,
        vonId: altBearbeiterId,
        anGruppe: gruppe,
        anGruppeName: gruppeName,
        notiz: notiz,
        hauptbearbeitungUebertragen: hauptbearbeitungUebertragen,
        datum: new Date().toISOString()
      });
      
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'weitergeleitet-gruppe',
        beschreibung: `Antrag weitergeleitet an ${gruppeName}${notiz ? ': ' + notiz : ''}${hauptbearbeitungUebertragen ? ' (Hauptbearbeitung wird bei Übernahme übertragen)' : ''}`,
        details: { 
          vonId: altBearbeiterId,
          von: altBearbeiterName,
          anGruppe: gruppe,
          anGruppeName: gruppeName,
          notiz: notiz,
          hauptbearbeitungUebertragen: hauptbearbeitungUebertragen
        },
        benutzerTyp: 'mitarbeiter',
        benutzerId: altBearbeiterId,
        benutzerName: altBearbeiterName
      });
      
      return antrag;
    }
    return null;
  }
}

// Globale Instanz
/** Themengruppen für Antragsauswahl und Listenfilter (Insassen- und Mitarbeiterportal) */
const ANTRAG_TYPE_GRUPPEN = [
  {
    id: 'finanzen-unterbringung',
    titel: 'Finanzen & Unterbringung',
    typen: ['teilhabegeld', 'eigentum']
  },
  {
    id: 'beratung-gesundheit',
    titel: 'Beratung, Gespräche & Gesundheit',
    typen: ['beratung-unterstuetzung', 'gespraechstermin', 'gesundheit-medizin']
  },
  {
    id: 'freizeit',
    titel: 'Freizeit & Weiterbildung',
    typen: ['freizeit-weiterbildung']
  },
  {
    id: 'besuche',
    titel: 'Besuche',
    typen: ['besuch-langzeit', 'besuch-termin', 'besuch-video']
  }
];

function getAntragTypeGruppeId(type) {
  const gruppe = ANTRAG_TYPE_GRUPPEN.find((g) => g.typen.includes(type));
  return gruppe ? gruppe.id : 'sonstiges';
}

function getAntragThemaLabel(type) {
  const gruppe = ANTRAG_TYPE_GRUPPEN.find((g) => g.typen.includes(type));
  return gruppe ? gruppe.titel : 'Sonstiges';
}

function antragTypPasstZuFilter(type, filterId) {
  if (!filterId || filterId === 'alle') return true;
  const gruppe = ANTRAG_TYPE_GRUPPEN.find((g) => g.id === filterId);
  return gruppe ? gruppe.typen.includes(type) : true;
}

function getAntragTypeFilterChips() {
  return [
    { id: 'alle', titel: 'Alle' },
    ...ANTRAG_TYPE_GRUPPEN.map((g) => ({ id: g.id, titel: g.titel }))
  ];
}

function _getAntragTypLabelForPicker(type) {
  if (typeof antragSystem !== 'undefined' && antragSystem && typeof antragSystem.getAntragTypLabel === 'function') {
    return antragSystem.getAntragTypLabel(type);
  }
  const fallback = {
    teilhabegeld: 'Teilhabegeld',
    eigentum: 'Eigentum in der Kammer',
    'beratung-unterstuetzung': 'Beratungs- und Unterstützungsleistungen',
    gespraechstermin: 'Gesprächstermine',
    'gesundheit-medizin': 'Gesundheit: Termin medizinischer Dienst',
    'freizeit-weiterbildung': 'Freizeitaktivitäten inkl. Weiterbildungskosten',
    'besuch-langzeit': 'Langzeitbesuch (Genehmigung)',
    'besuch-termin': 'Besuchstermin',
    'besuch-video': 'Videobesuch'
  };
  return fallback[type] || type;
}

function renderAntragTypePickerHtml(inputName, selectedValue) {
  const selected = selectedValue || 'teilhabegeld';
  return `<div class="antrag-type-flat-list">${ANTRAG_TYPE_GRUPPEN.map((gruppe) => {
    const options = gruppe.typen
      .map((type) => {
        const label = _getAntragTypLabelForPicker(type);
        const checked = type === selected ? ' checked' : '';
        return `<label class="radio-option">
          <input type="radio" name="${inputName}" value="${type}"${checked}>
          <span class="radio-label">${label}</span>
        </label>`;
      })
      .join('');
    return `<div class="antrag-type-group-block" data-gruppe="${gruppe.id}">
      <p class="antrag-type-group-title">${gruppe.titel}</p>
      <div class="radio-group antrag-type-group-options">${options}</div>
    </div>`;
  }).join('')}</div>`;
}

function _resolveAntragTypePickerHandler(onChangeHandler) {
  if (typeof onChangeHandler === 'function') return onChangeHandler;
  if (typeof onChangeHandler === 'string' && typeof window[onChangeHandler] === 'function') {
    return window[onChangeHandler];
  }
  return null;
}

function initAntragTypePickerAccordion(containerId, inputName, onChangeHandler) {
  const container = document.getElementById(containerId);
  if (!container || !onChangeHandler) return;
  const boundKey = `antragPicker:${inputName}`;
  if (container.dataset.antragPickerBound === boundKey) return;
  container.dataset.antragPickerBound = boundKey;
  container.addEventListener('change', (ev) => {
    const input = ev.target;
    if (!input || input.name !== inputName || input.type !== 'radio') return;
    const handler = _resolveAntragTypePickerHandler(onChangeHandler);
    if (handler) handler();
  });
}

if (typeof window !== 'undefined') {
  window.renderAntragTypePickerHtml = renderAntragTypePickerHtml;
  window.initAntragTypePickerAccordion = initAntragTypePickerAccordion;
  window._getAntragTypLabelForPicker = _getAntragTypLabelForPicker;
}

function renderAntragFilterBarHtml(listKey, activeFilterId, setFilterFn) {
  const chips = getAntragTypeFilterChips().map((chip) => `
    <button type="button" class="antrag-filter-chip${chip.id === activeFilterId ? ' active' : ''}"
      onclick="${setFilterFn}('${listKey}', '${chip.id}')">${chip.titel}</button>
  `).join('');
  const activeChip = getAntragTypeFilterChips().find((c) => c.id === activeFilterId);
  const summarySuffix = activeFilterId !== 'alle' && activeChip ? ` · ${activeChip.titel}` : '';
  return `<details class="antrag-filter-details"${activeFilterId !== 'alle' ? ' open' : ''}>
    <summary class="antrag-filter-summary">Nach Thema filtern${summarySuffix}</summary>
    <div class="antrag-filter-bar">${chips}</div>
  </details>`;
}

const antragSystem = new AntragSystem();

/** Monat YYYY-MM für Demo-Anträge (offset in Monaten). */
function _demoMonatOffset(offsetMonths) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + offsetMonths);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Legt Beispiel-Anträge, Aufgaben und Benachrichtigungen an, wenn keine Anträge vorhanden sind.
 * @returns {boolean} true wenn Demo-Daten neu angelegt wurden
 */
/** Entfernt nur automatisch angelegte Demo-Einträge (z. B. vor Import echter Daten). */
function entferneDemoDaten() {
  let changed = false;
  if (antragSystem) {
    const vorher = antragSystem.antraege.length;
    antragSystem.antraege = antragSystem.antraege.filter((a) => !String(a?.id || '').startsWith('DEMO-'));
    if (antragSystem.antraege.length !== vorher) {
      antragSystem.saveAntraege();
      changed = true;
    }
  }
  if (typeof aufgabenSystem !== 'undefined') {
    const vorher = aufgabenSystem.aufgaben.length;
    aufgabenSystem.aufgaben = aufgabenSystem.aufgaben.filter((a) => !String(a?.id || '').startsWith('DEMO-'));
    if (aufgabenSystem.aufgaben.length !== vorher) {
      aufgabenSystem.saveAufgaben();
      changed = true;
    }
  }
  if (typeof aktivitaetenSystem !== 'undefined') {
    const vorher = aktivitaetenSystem.aktivitaeten.length;
    aktivitaetenSystem.aktivitaeten = aktivitaetenSystem.aktivitaeten.filter(
      (a) => !String(a?.antragId || '').startsWith('DEMO-')
    );
    if (aktivitaetenSystem.aktivitaeten.length !== vorher) {
      aktivitaetenSystem.saveAktivitaeten();
      changed = true;
    }
  }
  return changed;
}

function seedDemoDatenIfEmpty() {
  if (!antragSystem || !Array.isArray(antragSystem.antraege)) return false;
  if (localStorage.getItem('gefaengnis_skip_demo_seed') === '1') return false;
  const hatEchteAntraege = antragSystem.antraege.some(
    (a) => a && a.id && !String(a.id).startsWith('DEMO-')
  );
  if (hatEchteAntraege) return false;
  if (antragSystem.antraege.length > 0) return false;

  const t0 = new Date();
  const t1 = new Date(t0.getTime() - 2 * 86400000).toISOString();
  const t2 = new Date(t0.getTime() - 5 * 86400000).toISOString();
  const t3 = new Date(t0.getTime() - 10 * 86400000).toISOString();

  const antraege = [
    {
      id: 'DEMO-ANT-TGB-001',
      antragsNummer: 'A-DEMO-0001',
      type: 'teilhabegeld',
      status: 'offen',
      insasseId: 'insasse-1',
      insassenNummer: 'INS-001',
      insasseName: 'Hans Mueller',
      insasseGeburtsdatum: '1985-03-15',
      insasseJva: 'haus1',
      insasseStation: '1',
      bearbeiterId: null,
      bearbeiterName: null,
      monat: _demoMonatOffset(0),
      keineEinkuenfteAusserhalb: true,
      einkuenfteAusserhalb: '',
      erstelltAm: t1,
      erledigt: false
    },
    {
      id: 'DEMO-ANT-EIG-001',
      antragsNummer: 'A-DEMO-0002',
      type: 'eigentum',
      status: 'in-bearbeitung',
      insasseId: 'insasse-1',
      insassenNummer: 'INS-001',
      insasseName: 'Hans Mueller',
      insasseGeburtsdatum: '1985-03-15',
      insasseJva: 'haus1',
      insasseStation: '1',
      bearbeiterId: 'avd-1',
      bearbeiterName: 'Anna Schmidt (AVD)',
      aktion: 'abholen',
      kleidung: ['oberbekleidung'],
      antragBegruendung: 'Winterjacke zur Entlassung abholen.',
      erstelltAm: t2,
      erledigt: false
    },
    {
      id: 'DEMO-ANT-TGB-002',
      antragsNummer: 'A-DEMO-0003',
      type: 'teilhabegeld',
      status: 'offen',
      insasseId: 'insasse-2',
      insassenNummer: 'INS-002',
      insasseName: 'Klaus Fischer',
      insasseGeburtsdatum: '1990-07-22',
      insasseJva: 'haus2',
      insasseStation: '2',
      bearbeiterId: null,
      bearbeiterName: null,
      monat: _demoMonatOffset(-1),
      keineEinkuenfteAusserhalb: true,
      einkuenfteAusserhalb: '',
      erstelltAm: t1,
      erledigt: false
    },
    {
      id: 'DEMO-ANT-EIG-002',
      antragsNummer: 'A-DEMO-0004',
      type: 'eigentum',
      status: 'in-bearbeitung',
      insasseId: 'insasse-2',
      insassenNummer: 'INS-002',
      insasseName: 'Klaus Fischer',
      insasseGeburtsdatum: '1990-07-22',
      insasseJva: 'haus2',
      insasseStation: '2',
      bearbeiterId: 'avd-2',
      bearbeiterName: 'Peter Weber (AVD)',
      zugewiesenAnGruppe: { typ: 'kammer', hausId: null },
      zugewiesenAnGruppeName: 'Kammer',
      hauptbearbeitungWartetAufUebernahme: true,
      aktion: 'einlagern',
      kleidung: ['schuhe'],
      antragBegruendung: 'Sportschuhe zur Einlagerung.',
      erstelltAm: t3,
      erledigt: false
    },
    {
      id: 'DEMO-ANT-TGB-003',
      antragsNummer: 'A-DEMO-0005',
      type: 'teilhabegeld',
      status: 'genehmigt',
      insasseId: 'insasse-1',
      insassenNummer: 'INS-001',
      insasseName: 'Hans Mueller',
      insasseGeburtsdatum: '1985-03-15',
      insasseJva: 'haus1',
      insasseStation: '1',
      bearbeiterId: 'avd-1',
      bearbeiterName: 'Anna Schmidt (AVD)',
      monat: _demoMonatOffset(-2),
      keineEinkuenfteAusserhalb: true,
      einkuenfteAusserhalb: '',
      sachlichGeprueft: true,
      entscheidungGetroffen: true,
      wartetAufEroeffnung: true,
      erledigt: true,
      erstelltAm: t3,
      bearbeitetAm: t2
    },
    {
      id: 'DEMO-ANT-BER-001',
      antragsNummer: 'A-DEMO-0006',
      type: 'beratung-unterstuetzung',
      status: 'in-bearbeitung',
      insasseId: 'insasse-1',
      insassenNummer: 'INS-001',
      insasseName: 'Hans Mueller',
      insasseGeburtsdatum: '1985-03-15',
      insasseJva: 'haus1',
      insasseStation: '1',
      bearbeiterId: 'avd-1',
      bearbeiterName: 'Anna Schmidt (AVD)',
      beratungThema: 'Entlassungsvorbereitung',
      beratungBeschreibung: 'Unterstützung bei Wohnungssuche nach Entlassung.',
      erstelltAm: t2,
      erledigt: false
    }
  ];

  antraege.forEach((a) => antragSystem.antraege.push(a));
  antragSystem.migrateAntraege();
  antragSystem.saveAntraege();

  const aufgaben = [
    {
      id: 'DEMO-AUF-ST-001',
      antragId: 'DEMO-ANT-TGB-001',
      antragsNummer: 'A-DEMO-0001',
      erstelltVonId: 'avd-1',
      erstelltVonName: 'Anna Schmidt (AVD)',
      zugewiesenAnTyp: 'gruppe',
      zugewiesenAnGruppe: { typ: 'station', hausId: 'haus1', station: '1' },
      zugewiesenAnName: 'AVD Haus 1 Station 1',
      kurzbeschreibung: 'Unterlagen für Teilhabegeld',
      beschreibung: 'Bitte fehlende Nachweise zum Teilhabegeld-Antrag im Postfach bereitstellen.',
      fristDatum: new Date(t0.getTime() + 7 * 86400000).toISOString().slice(0, 10),
      status: 'offen',
      erstelltAm: t1
    },
    {
      id: 'DEMO-AUF-KAM-001',
      antragId: 'DEMO-ANT-EIG-002',
      antragsNummer: 'A-DEMO-0004',
      erstelltVonId: 'avd-2',
      erstelltVonName: 'Peter Weber (AVD)',
      zugewiesenAnTyp: 'gruppe',
      zugewiesenAnGruppe: { typ: 'kammer', hausId: null },
      zugewiesenAnName: 'Kammer',
      kurzbeschreibung: 'Kammerprüfung Eigentum',
      beschreibung: 'Eigentumsantrag zur Prüfung durch die Kammer weiterleiten.',
      fristDatum: new Date(t0.getTime() + 14 * 86400000).toISOString().slice(0, 10),
      status: 'offen',
      erstelltAm: t2
    },
    {
      id: 'DEMO-AUF-AVD-001',
      antragId: 'DEMO-ANT-EIG-001',
      antragsNummer: 'A-DEMO-0002',
      erstelltVonId: 'val-1',
      erstelltVonName: 'Max Mustermann (VAL)',
      zugewiesenAnTyp: 'mitarbeiter',
      zugewiesenAnId: 'avd-1',
      zugewiesenAnName: 'Anna Schmidt (AVD)',
      kurzbeschreibung: 'Abholtermin abstimmen',
      beschreibung: 'Termin mit Insasse für Abholung der Winterjacke vereinbaren.',
      fristDatum: new Date(t0.getTime() + 3 * 86400000).toISOString().slice(0, 10),
      status: 'offen',
      erstelltAm: t2
    }
  ];

  if (typeof aufgabenSystem !== 'undefined') {
    aufgaben.forEach((a) => aufgabenSystem.aufgaben.push(a));
    aufgabenSystem.migrateZahlstelleArbeitskoordinationGruppen();
    aufgabenSystem.saveAufgaben();
    if (typeof terminSystem !== 'undefined') {
      terminSystem.syncAufgabenFristenFromAufgaben(aufgabenSystem.aufgaben);
    }
  }

  if (typeof aktivitaetenSystem !== 'undefined') {
    antraege.forEach((a) => {
      aktivitaetenSystem.logAktivitaet({
        antragId: a.id,
        typ: 'erstellt',
        beschreibung: `Demo-Antrag "${antragSystem.getAntragTypLabel(a.type)}" angelegt`,
        benutzerTyp: 'insasse',
        benutzerId: a.insasseId,
        benutzerName: a.insasseName
      });
    });
  }

  if (typeof notificationSystem !== 'undefined') {
    notificationSystem.createNotification(
      'avd-1',
      'demo-daten',
      'Demo-Daten wiederhergestellt',
      'Beispiel-Anträge und Aufgaben wurden automatisch angelegt (keine Anträge in den Daten gefunden).',
      'DEMO-ANT-TGB-001'
    );
    notificationSystem.createNotification(
      'kammer-1',
      'antrag-zugewiesen',
      'Neuer Gruppenantrag',
      'Eigentumsantrag A-DEMO-0004 wartet auf Übernahme durch die Kammer.',
      'DEMO-ANT-EIG-002'
    );
  }

  console.log('[Demo] Beispiel-Anträge und Aufgaben wiederhergestellt:', antraege.length, 'Anträge,', aufgaben.length, 'Aufgaben');
  window.dispatchEvent(new CustomEvent('demoDatenGeladen'));
  return true;
}

/** In der Browser-Konsole prüfbar, ob der aktuelle Stand geladen ist. */
const APP_DEPLOY_TAG = 'fc629e8-begleitung-demo';
if (typeof window !== 'undefined') {
  window.APP_DEPLOY_TAG = APP_DEPLOY_TAG;
  console.info('[App] Deploy-Tag:', APP_DEPLOY_TAG);
}

if (typeof window !== 'undefined') {
  window.seedDemoDatenIfEmpty = seedDemoDatenIfEmpty;
  window.entferneDemoDaten = entferneDemoDaten;
}

seedDemoDatenIfEmpty();

if (typeof terminSystem !== 'undefined') {
  terminSystem.migrateInsasseTermine();
}

function getMitarbeiterIdsFuerGruppe(gruppe) {
  if (!gruppe || typeof userSystem === 'undefined') return [];
  return userSystem.users
    .filter((u) => u.type === 'mitarbeiter' && antragSystem._mitarbeiterGehoertZuGruppe(u, gruppe))
    .map((u) => String(u.id));
}

/** Stabile Insassen-User-ID für Benachrichtigungen und Kalender (inkl. ID-Reparatur am Antrag). */
function resolveInsasseUserId(antragId, insasseId, insasseName) {
  const antrag = antragId ? antragSystem.getAntrag(antragId) : null;
  const candidates = [insasseId, antrag?.insasseId].filter((x) => x != null && x !== '').map(String);

  for (const cid of candidates) {
    if (userSystem.users.some((u) => u.type === 'insasse' && String(u.id) === cid)) {
      return cid;
    }
  }

  const name = (insasseName || antrag?.insasseName || '').trim();
  if (name && typeof userSystem !== 'undefined') {
    const byName = userSystem.users.find((u) => {
      if (u.type !== 'insasse') return false;
      const full = `${u.vorname || ''} ${u.nachname || ''}`.trim();
      return u.name === name || full === name;
    });
    if (byName) {
      const resolved = String(byName.id);
      if (antrag && String(antrag.insasseId) !== resolved) {
        antrag.insasseId = resolved;
        antragSystem.saveAntraege();
      }
      return resolved;
    }
  }

  return candidates[0] || null;
}

/** JVA/Haus und Station des Insassen für Stations-Aufgaben. */
function resolveInsasseStandort(antragId, insasseId) {
  const antrag = typeof antragSystem !== 'undefined' ? antragSystem.getAntrag(antragId) : null;
  if (antrag?.insasseJva) {
    return {
      hausId: String(antrag.insasseJva).replace(/^jva/, 'haus'),
      station: String(antrag.insasseStation ?? '')
    };
  }
  const uid = insasseId || antrag?.insasseId;
  if (uid && typeof userSystem !== 'undefined') {
    const u = userSystem.users.find((x) => String(x.id) === String(uid));
    if (u?.jva) {
      return {
        hausId: String(u.jva).replace(/^jva/, 'haus'),
        station: String(u.station ?? '')
      };
    }
  }
  return null;
}

/**
 * Stationspostfach: Aufgabe „Insasse zum Termin begleiten“ (AVD der Insassen-Station).
 */
function erstelleBegleitungAufgabeFuerTermin(termin, meta) {
  if (!termin || typeof aufgabenSystem === 'undefined') return null;

  const standort = resolveInsasseStandort(meta.antragId, meta.insasseId);
  if (!standort?.hausId) {
    console.warn('[Begleitung] Keine Station für Insassen ermittelbar – keine Aufgabe erstellt.');
    return null;
  }

  const hausName = getHausName(standort.hausId);
  const gruppenName = `AVD ${hausName} Station ${standort.station || '–'}`;
  const datumFmt = new Date(termin.datum).toLocaleDateString('de-DE');
  const zeitInfo = termin.uhrzeit ? ` um ${termin.uhrzeit} Uhr` : '';
  const ortInfo = termin.ort ? `\nOrt: ${termin.ort}` : '';
  const insasseLabel = meta.insasseName || termin.insasseName || 'Insasse';

  const antrag = antragSystem.getAntrag(meta.antragId);
  const beschreibung =
    `Der Insasse ${insasseLabel} muss zum folgenden Termin begleitet werden:\n\n` +
    `„${termin.betreff || termin.titel}“\n` +
    `Datum: ${datumFmt}${zeitInfo}${ortInfo}`;

  const aufgabe = aufgabenSystem.createAufgabe({
    antragId: meta.antragId,
    antragsNummer: antrag?.antragsNummer || null,
    erstelltVonId: meta.erstelltVonId,
    erstelltVonName: meta.erstelltVonName,
    zugewiesenAnTyp: 'gruppe',
    zugewiesenAnGruppe: {
      typ: 'station',
      hausId: standort.hausId,
      station: standort.station
    },
    zugewiesenAnName: gruppenName,
    kurzbeschreibung: 'Begleitung zum Termin',
    beschreibung,
    fristDatum: termin.datum,
    terminId: termin.id,
    terminBegleitung: true,
    terminUhrzeit: termin.uhrzeit || null
  });

  if (typeof aktivitaetenSystem !== 'undefined') {
    aktivitaetenSystem.logAktivitaet({
      antragId: meta.antragId,
      typ: 'begleitung-aufgabe',
      beschreibung: `Begleitungsaufgabe für Station erstellt (${gruppenName})`,
      details: { terminId: termin.id, aufgabeId: aufgabe.id },
      benutzerTyp: 'mitarbeiter',
      benutzerId: meta.erstelltVonId,
      benutzerName: meta.erstelltVonName
    });
  }

  return aufgabe;
}

/**
 * Termin vereinbaren: Kalendereinträge und Plattform-Benachrichtigungen (intern nur Portal).
 */
function vereinbareTerminAusAntrag(params) {
  const {
    antragId,
    insasseId,
    insasseName,
    betreff,
    datum,
    uhrzeit,
    ort,
    teamsLink,
    teilnehmerArt,
    externPartnerId,
    externServiceId,
    dauerMinuten,
    durchfuehrungArt,
    externKontakt,
    zugewiesenAnTyp,
    zugewiesenAnId,
    zugewiesenAnName,
    zugewiesenAnGruppe,
    begleitungErforderlich,
    erstelltVonId,
    erstelltVonName
  } = params;

  const resolvedInsasseId = resolveInsasseUserId(antragId, insasseId, insasseName);
  if (!resolvedInsasseId) {
    throw new Error('Insasse für Termin konnte nicht zugeordnet werden.');
  }

  const sichtbarFuer = new Set([String(resolvedInsasseId), String(erstelltVonId)]);
  const emailEmpfaenger = [];

  if (teilnehmerArt === 'intern') {
    if (zugewiesenAnTyp === 'mitarbeiter' && zugewiesenAnId) {
      sichtbarFuer.add(String(zugewiesenAnId));
    } else if (zugewiesenAnTyp === 'gruppe' && zugewiesenAnGruppe) {
      getMitarbeiterIdsFuerGruppe(zugewiesenAnGruppe).forEach((id) => sichtbarFuer.add(id));
    }
  }

  const termin = terminSystem.createVereinbarungsTermin({
    betreff,
    datum,
    uhrzeit,
    ort,
    teamsLink,
    antragId,
    insasseId: resolvedInsasseId,
    insasseName,
    teilnehmerArt,
    externKontakt: externKontakt || null,
    externPartnerId: externPartnerId || null,
    externServiceId: externServiceId || null,
    dauerMinuten: dauerMinuten || null,
    durchfuehrungArt: durchfuehrungArt || null,
    zugewiesenAnTyp,
    zugewiesenAnId,
    zugewiesenAnName,
    zugewiesenAnGruppe,
    sichtbarFuer: Array.from(sichtbarFuer),
    begleitungErforderlich: begleitungErforderlich === true,
    erstelltVonId,
    erstelltVonName
  });

  let begleitungAufgabe = null;
  if (begleitungErforderlich) {
    begleitungAufgabe = erstelleBegleitungAufgabeFuerTermin(termin, {
      antragId,
      insasseId: resolvedInsasseId,
      insasseName,
      erstelltVonId,
      erstelltVonName
    });
  }

  const datumFmt = new Date(termin.datum).toLocaleDateString('de-DE');
  const zeitInfo = termin.uhrzeit ? ` um ${termin.uhrzeit} Uhr` : '';
  const ortInfo = termin.ort ? ` · Ort: ${termin.ort}` : '';
  const teamsInfo = termin.teamsLink ? ' Online per Teams – Link im Kalender.' : '';
  const msgBase = `Termin „${termin.betreff}“ am ${datumFmt}${zeitInfo}${ortInfo}${teamsInfo}`;

  notificationSystem.createNotification(
    resolvedInsasseId,
    'termin-vereinbart',
    'Termin vereinbart',
    msgBase,
    antragId
  );

  if (teilnehmerArt === 'intern') {
    if (zugewiesenAnTyp === 'mitarbeiter' && zugewiesenAnId) {
      notificationSystem.createNotification(
        zugewiesenAnId,
        'termin-vereinbart',
        'Termin vereinbart',
        `${msgBase} (Insasse: ${insasseName})`,
        antragId
      );
    } else if (zugewiesenAnGruppe) {
      getMitarbeiterIdsFuerGruppe(zugewiesenAnGruppe).forEach((mid) => {
        notificationSystem.createNotification(
          mid,
          'termin-vereinbart',
          'Termin vereinbart',
          `${msgBase} (Insasse: ${insasseName})`,
          antragId
        );
      });
    }
  }

  if (typeof aktivitaetenSystem !== 'undefined') {
    aktivitaetenSystem.logAktivitaet({
      antragId,
      typ: 'termin-vereinbart',
      beschreibung: `Termin vereinbart: ${termin.betreff}`,
      details: {
        terminId: termin.id,
        teilnehmerArt,
        datum: termin.datum,
        uhrzeit: termin.uhrzeit,
        ort: termin.ort,
        extern: externKontakt ? (externKontakt.beruf || externKontakt.name) : null,
        externPartnerId: externPartnerId || null,
        durchfuehrungArt: durchfuehrungArt || null
      },
      benutzerTyp: 'mitarbeiter',
      benutzerId: erstelltVonId,
      benutzerName: erstelltVonName
    });
  }

  return { termin, emailEmpfaenger, begleitungAufgabe };
}

/**
 * Externen Termin über Buchungsstrecke (Service → Person → Slot → Präsenz/Online).
 */
function vereinbareExternenTerminAusAntrag(params) {
  const {
    antragId,
    insasseId,
    insasseName,
    partnerId,
    serviceId,
    datum,
    uhrzeit,
    durchfuehrungArt,
    ort,
    begleitungErforderlich,
    erstelltVonId,
    erstelltVonName
  } = params;

  const partner = externePartnerSystem.getPartner(partnerId);
  const service = externePartnerSystem.getService(partnerId, serviceId);
  if (!partner || !service) {
    throw new Error('Externer Partner oder Leistung nicht gefunden.');
  }
  if (externePartnerSystem.isSlotBelegt(partnerId, datum, uhrzeit, service.dauerMinuten)) {
    throw new Error('Dieser Terminslot ist nicht mehr verfügbar. Bitte wählen Sie einen anderen Slot.');
  }

  const durchfuehrung = durchfuehrungArt === 'online' ? 'online' : 'praesenz';
  const teamsLink = durchfuehrung === 'online' ? generateTeamsMeetingLink() : null;
  const ortFinal =
    durchfuehrung === 'online'
      ? 'Online (Microsoft Teams)'
      : (ort || 'Vor Ort in der Anstalt').trim();

  const externKontakt = {
    id: partner.id,
    name: partner.name,
    email: partner.email,
    beruf: partner.beruf || '',
    serviceName: service.name,
    dauerMinuten: service.dauerMinuten
  };

  const betreff = `${service.name} – ${partner.name}`;

  const insasseUser =
    typeof userSystem !== 'undefined'
      ? userSystem.users.find((u) => String(u.id) === String(resolveInsasseUserId(antragId, insasseId, insasseName)))
      : null;
  const insasseEmail = insasseUser?.email || null;

  const result = vereinbareTerminAusAntrag({
    antragId,
    insasseId,
    insasseName,
    betreff,
    datum,
    uhrzeit,
    ort: ortFinal,
    teamsLink,
    teilnehmerArt: 'extern',
    externPartnerId: partner.id,
    externServiceId: service.id,
    dauerMinuten: service.dauerMinuten,
    durchfuehrungArt: durchfuehrung,
    externKontakt,
    begleitungErforderlich,
    erstelltVonId,
    erstelltVonName
  });

  const emailEmpfaenger = [
    { name: partner.name, email: partner.email, typ: 'extern' }
  ];
  if (durchfuehrung === 'online' && insasseEmail) {
    emailEmpfaenger.push({ name: insasseName, email: insasseEmail, typ: 'insasse' });
  }
  if (durchfuehrung === 'online') {
    result.emailEmpfaenger = emailEmpfaenger;
    result.teamsLink = teamsLink;
  } else {
    result.emailEmpfaenger = [{ name: partner.name, email: partner.email, typ: 'extern' }];
  }

  return result;
}

// Nachladen aus localStorage (wird von data-sync.js nach Server-Sync aufgerufen)
function reloadDataFromStorage() {
  try {
    const rawUsers = localStorage.getItem('gefaengnis_users');
    if (rawUsers && typeof userSystem !== 'undefined') {
      userSystem.users = JSON.parse(rawUsers);
      userSystem.migrateUsers();
    }
    const rawNotifications = localStorage.getItem('gefaengnis_notifications');
    if (rawNotifications) notificationSystem.notifications = JSON.parse(rawNotifications);
    const rawAktivitaeten = localStorage.getItem('gefaengnis_aktivitaeten');
    if (rawAktivitaeten) aktivitaetenSystem.aktivitaeten = JSON.parse(rawAktivitaeten);
    const rawTermine = localStorage.getItem('gefaengnis_termine');
    if (rawTermine) {
      terminSystem.termine = JSON.parse(rawTermine);
      terminSystem.migrateInsasseTermine();
    }
    const rawExterne = localStorage.getItem('gefaengnis_externe_partner');
    if (rawExterne && typeof externePartnerSystem !== 'undefined') {
      externePartnerSystem.partner = JSON.parse(rawExterne);
      if (externePartnerSystem.partner.length === 0) externePartnerSystem.seedDefaultsIfEmpty();
    }
    const rawAufgaben = localStorage.getItem('gefaengnis_aufgaben');
    if (rawAufgaben) {
      aufgabenSystem.aufgaben = JSON.parse(rawAufgaben);
      aufgabenSystem.migrateZahlstelleArbeitskoordinationGruppen();
    }
    const rawAntraege = localStorage.getItem('gefaengnis_antraege');
    if (rawAntraege) {
      antragSystem.antraege = JSON.parse(rawAntraege);
      antragSystem.migrateAntraege();
    }
    if (typeof terminSystem !== 'undefined' && typeof aufgabenSystem !== 'undefined') {
      terminSystem.syncAufgabenFristenFromAufgaben(aufgabenSystem.aufgaben);
    }
    if (typeof seedDemoDatenIfEmpty === 'function') {
      seedDemoDatenIfEmpty();
    }
  } catch (e) {
    console.warn('reloadDataFromStorage:', e);
  }
}
if (typeof window !== 'undefined') window.reloadDataFromStorage = reloadDataFromStorage;

// REPARATUR: Öffne fälschlicherweise geschlossene Gruppenaufgaben
// Aufgaben für NICHT veraktete Anträge sollen offen bleiben
// Dies repariert Aufgaben die durch alte Migration/Phasenwechsel-Logik geschlossen wurden
(function repariereGruppenAufgaben() {
  let geoeffnet = 0;
  
  aufgabenSystem.aufgaben.forEach(aufgabe => {
    // Nur Gruppenaufgaben die durch automatische Prozesse geschlossen wurden
    if (aufgabe.zugewiesenAnTyp === 'gruppe' && 
        aufgabe.status === 'erledigt' && 
        (aufgabe.erledigtDurchMigration === true || aufgabe.erledigtDurchPhasenwechsel === true)) {
      
      // Prüfen ob der Antrag wirklich veraktet ist
      const antrag = antragSystem.getAntrag(aufgabe.antragId);
      if (antrag && !antrag.veraktet) {
        // Antrag ist nicht veraktet - Aufgabe wieder öffnen
        aufgabe.status = 'offen';
        aufgabe.erledigtAm = null;
        aufgabe.erledigtDurchMigration = null;
        aufgabe.erledigtDurchPhasenwechsel = null;
        geoeffnet++;
      }
    }
  });
  
  if (geoeffnet > 0) {
    aufgabenSystem.saveAufgaben();
    console.log(`[Reparatur] ${geoeffnet} Gruppenaufgaben für nicht-veraktete Anträge wieder geöffnet`);
  }
})();

// MIGRATION: Bereinige inkonsistente Gruppenaufgaben
// Schließt Gruppenaufgaben NUR für Anträge die bereits VERAKTET wurden
// Aufgaben können jederzeit bis zur Veraktung zugewiesen werden
(function bereingeInkonsistenteAufgaben() {
  let geschlossen = 0;
  const offeneGruppenaufgaben = aufgabenSystem.aufgaben.filter(a => 
    a.zugewiesenAnTyp === 'gruppe' && a.status === 'offen'
  );
  
  offeneGruppenaufgaben.forEach(aufgabe => {
    const antrag = antragSystem.getAntrag(aufgabe.antragId);
    if (antrag) {
      // NUR veraktete Anträge: Aufgaben werden automatisch geschlossen
      // Bis zur Veraktung können jederzeit Aufgaben an alle Gruppen zugewiesen werden
      if (antrag.veraktet) {
        aufgabe.status = 'erledigt';
        aufgabe.erledigtAm = new Date().toISOString();
        aufgabe.erledigtDurchMigration = true;
        geschlossen++;
      }
    }
  });
  
  if (geschlossen > 0) {
    aufgabenSystem.saveAufgaben();
    console.log(`[Migration] ${geschlossen} Gruppenaufgaben für veraktete Anträge bereinigt`);
  }
})();

// ============================================
// HILFSFUNKTIONEN
// ============================================

function formatDate(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleDateString('de-DE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDateOnly(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  return date.toLocaleDateString('de-DE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric'
  });
}

function formatMonat(monat) {
  const [year, month] = monat.split('-');
  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

function getStatusText(status) {
  const statusTexts = {
    'entwurf': 'Entwurf',
    'offen': 'Offen',
    'in-bearbeitung': 'In Bearbeitung',
    'genehmigt': 'Genehmigt',
    'abgelehnt': 'Abgelehnt',
    'teilweise-genehmigt': 'Teilweise genehmigt'
  };
  return statusTexts[status] || status;
}

function getStatusIcon(status) {
  const icons = {
    'entwurf': '',
    'offen': '',
    'in-bearbeitung': '⏳',
    'genehmigt': '',
    'abgelehnt': '',
    'teilweise-genehmigt': ''
  };
  return icons[status] || '•';
}

function getHausName(hausKey) {
  // Kompatibilität: jva1 -> haus1
  const mappedKey = hausKey?.replace('jva', 'haus') || hausKey;
  return HAUS_CONFIG[mappedKey]?.name || hausKey?.replace('jva', 'Haus ').replace('haus', 'Haus ') || hausKey;
}

// Alias für Kompatibilität
function getJvaName(jvaKey) {
  return getHausName(jvaKey);
}

/** Kammer, Revision, Medizinischer Dienst, Psychologe – hausunabhängig, eigene Gruppe */
function istAnstaltsweiteSpezialrolle(rolle) {
  return ['kammer', 'revision', 'medizinischer-dienst', 'psychologe'].includes(String(rolle || '').toLowerCase());
}

function istAnstaltsweiteSpezialGruppeTyp(typ) {
  return istAnstaltsweiteSpezialrolle(typ);
}

/** Alle anstaltsweiten Gruppenzuweisungen (ohne Haus-ID in der Gruppe) */
function istAnstaltsweiteJvaGruppeTyp(typ) {
  return [
    'kammer',
    'revision',
    'medizinischer-dienst',
    'psychologe',
    'anstaltsleitung',
    'zahlstelle',
    'arbeitskoordination'
  ].includes(String(typ || '').toLowerCase());
}

function istAnstaltsweiteJvaGruppeRolle(rolle) {
  return istAnstaltsweiteJvaGruppeTyp(rolle);
}

function getJvaGruppeDisplayName(typ) {
  const key = String(typ || '').toLowerCase();
  const names = {
    kammer: 'Kammer',
    revision: 'Revision',
    'medizinischer-dienst': 'Medizinischer Dienst',
    psychologe: 'Psychologe',
    anstaltsleitung: 'Anstaltsleitung',
    zahlstelle: 'Zahlstelle',
    arbeitskoordination: 'Arbeitskoordination'
  };
  return names[key] || typ;
}

function getRolleText(rolle) {
  const rollen = {
    'mitarbeiter': 'AVD',
    'jva-leitung': 'VAL',
    'haus-leitung': 'VAL',
    'hausleitung': 'VAL',
    'anstaltsleitung': 'Anstaltsleitung',
    'stationshausleitung': 'Stationsleitung/Wohngruppenleitung',
    'stationsleitung': 'Stationsleitung',
    'zahlstelle': 'Zahlstelle',
    'arbeitskoordination': 'Arbeitskoordination',
    'kammer': 'Kammer',
    'revision': 'Revision',
    'medizinischer-dienst': 'Medizinischer Dienst',
    'psychologe': 'Psychologe'
  };
  return rollen[rolle] || rolle;
}

/** VAL-Umfang inkl. Anstalts- und Stationsleitung/Wohngruppenleitung (für UI / Portal-Logik) */
function istValWeitPortalRolle(rolle) {
  const r = String(rolle || '').toLowerCase();
  return (
    r === 'hausleitung' ||
    r === 'jva-leitung' ||
    r === 'haus-leitung' ||
    r === 'anstaltsleitung' ||
    r === 'stationshausleitung'
  );
}

// Modal-Funktionen
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  } else {
    console.error('Modal nicht gefunden:', modalId);
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// ============================================
// CUSTOM DIALOG SYSTEM (ersetzt Browser-Popups)
// ============================================

let dialogResolve = null;

function createDialogHtml() {
  if (document.getElementById('customDialogOverlay')) return;
  
  const dialogHtml = `
    <div class="modal-overlay" id="customDialogOverlay">
      <div class="modal custom-dialog">
        <div class="modal-header">
          <h3 id="customDialogTitle">Hinweis</h3>
        </div>
        <div class="modal-body">
          <p id="customDialogMessage"></p>
        </div>
        <div class="modal-footer" id="customDialogFooter">
          <!-- Buttons werden dynamisch eingefügt -->
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', dialogHtml);
}

// Ersetzt alert() - zeigt Hinweis-Dialog
function showAlert(message, title = null) {
  return new Promise((resolve) => {
    createDialogHtml();
    
    const titleText = title || (currentLanguage === 'en' ? 'Notice' : currentLanguage === 'fr' ? 'Avis' : 'Hinweis');
    document.getElementById('customDialogTitle').textContent = titleText;
    document.getElementById('customDialogMessage').textContent = message;
    
    const okText = currentLanguage === 'en' ? 'OK' : currentLanguage === 'fr' ? 'OK' : 'OK';
    document.getElementById('customDialogFooter').innerHTML = `
      <button class="btn btn-primary" onclick="closeDialog(true)">${okText}</button>
    `;
    
    dialogResolve = resolve;
    openModal('customDialogOverlay');
  });
}

// Ersetzt confirm() - zeigt Bestätigungs-Dialog
function showConfirm(message, title = null) {
  return new Promise((resolve) => {
    createDialogHtml();
    
    const titleText = title || (currentLanguage === 'en' ? 'Confirmation' : currentLanguage === 'fr' ? 'Confirmation' : 'Bestätigung');
    document.getElementById('customDialogTitle').textContent = titleText;
    document.getElementById('customDialogMessage').textContent = message;
    
    const cancelText = currentLanguage === 'en' ? 'Cancel' : currentLanguage === 'fr' ? 'Annuler' : 'Abbrechen';
    const confirmText = currentLanguage === 'en' ? 'Confirm' : currentLanguage === 'fr' ? 'Confirmer' : 'Bestätigen';
    
    document.getElementById('customDialogFooter').innerHTML = `
      <button class="btn btn-secondary" onclick="closeDialog(false)">${cancelText}</button>
      <button class="btn btn-primary" onclick="closeDialog(true)">${confirmText}</button>
    `;
    
    dialogResolve = resolve;
    openModal('customDialogOverlay');
  });
}

function closeDialog(result) {
  closeModal('customDialogOverlay');
  if (dialogResolve) {
    dialogResolve(result);
    dialogResolve = null;
  }
}

// Klick außerhalb Modal schließt es
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    // Nicht schließen bei Custom-Dialog (muss explizit bestätigt werden)
    if (e.target.id !== 'customDialogOverlay') {
      e.target.classList.remove('active');
    }
  }
});

// Escape-Taste schließt Modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });
  }
});

// HTML escapen
function escapeHtml(text) {
  if (!text) return '';
  // Falls es ein Übersetzungs-Objekt ist, den Text extrahieren
  if (typeof text === 'object') {
    text = text.text || '';
  }
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
