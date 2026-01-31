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
    'nav.openApplications': 'Offene Anträge',
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
    'nav.openApplications': 'Open Applications',
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
    'nav.openApplications': 'Demandes ouvertes',
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

// Admin-Zugangsdaten (in echter Anwendung sicher speichern!)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
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
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }
  
  // Standardbenutzer erstellen wenn keine vorhanden
  ensureDefaultUsers() {
    if (this.users.length === 0) {
      console.log('Keine Benutzer gefunden - erstelle Standardbenutzer...');
      
      // Standard-Insasse erstellen
      this.createInsasse({
        vorname: 'Max',
        nachname: 'Mustermann',
        geburtsdatum: '1990-05-15',
        jva: 'haus1',
        station: 'A'
      });
      
      this.createInsasse({
        vorname: 'Anna',
        nachname: 'Schmidt',
        geburtsdatum: '1985-08-22',
        jva: 'haus1',
        station: 'B'
      });
      
      // Standard-Mitarbeiter erstellen (Stationsleitung)
      this.createMitarbeiter({
        vorname: 'Thomas',
        nachname: 'Müller',
        rolle: 'stationsleitung',
        jvas: ['haus1'],
        station: 'A'
      });
      
      this.createMitarbeiter({
        vorname: 'Sarah',
        nachname: 'Weber',
        rolle: 'stationsleitung',
        jvas: ['haus1'],
        station: 'B'
      });
      
      // Hausleitung erstellen
      this.createMitarbeiter({
        vorname: 'Peter',
        nachname: 'Schneider',
        rolle: 'hausleitung',
        jvas: ['haus1'],
        station: null
      });
      
      console.log('Standardbenutzer erstellt. Anmeldedaten in der Konsole:');
      this.users.forEach(u => {
        console.log(`${u.type}: ${u.vorname} ${u.nachname} - Username: ${u.username}, Passwort: ${u.password}`);
      });
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
        const neuJvas = user.jvas.map(j => j.startsWith('jva') ? j.replace('jva', 'haus') : j);
        if (JSON.stringify(neuJvas) !== JSON.stringify(user.jvas)) {
          user.jvas = neuJvas;
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
    return this.notifications.filter(n => 
      n.userId === userId && !n.gelesen
    ).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Alle Benachrichtigungen für einen Benutzer
  getAllNotifications(userId) {
    return this.notifications.filter(n => 
      n.userId === userId
    ).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
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
    let changed = false;
    this.notifications.forEach(n => {
      if (n.userId === userId && !n.gelesen) {
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
    return this.notifications.filter(n => n.userId === userId && !n.gelesen).length;
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

  logout() {
    sessionStorage.removeItem(this.sessionKey);
  }

  getSession() {
    const data = sessionStorage.getItem(this.sessionKey);
    return data ? JSON.parse(data) : null;
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
    return this.aktivitaeten
      .filter(a => a.antragId === antragId)
      .sort((a, b) => new Date(a.erstelltAm) - new Date(b.erstelltAm));
  }
  
  // Alle Mitarbeiter-IDs, die an einem Antrag gearbeitet haben
  getBeteiligteMitarbeiter(antragId) {
    const mitarbeiterIds = new Set();
    this.aktivitaeten
      .filter(a => a.antragId === antragId && a.benutzerTyp === 'mitarbeiter')
      .forEach(a => mitarbeiterIds.add(a.benutzerId));
    return Array.from(mitarbeiterIds);
  }
  
  // Prüft ob ein Mitarbeiter an einem Antrag beteiligt war
  istMitarbeiterBeteiligt(antragId, mitarbeiterId) {
    return this.aktivitaeten.some(a => 
      a.antragId === antragId && 
      a.benutzerTyp === 'mitarbeiter' && 
      a.benutzerId === mitarbeiterId
    );
  }
}

const aktivitaetenSystem = new AktivitaetenSystem();

// ============================================
// TERMINSYSTEM
// ============================================

class TerminSystem {
  constructor() {
    this.storageKey = 'gefaengnis_termine';
    this.termine = this.loadTermine();
  }

  loadTermine() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
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
    const istHausleitung = mitarbeiter.rolle === 'hausleitung';
    
    return this.termine.filter(t => {
      // Admin-Termine: Für alle sichtbar
      if (t.typ === 'admin') return true;
      
      // Persönliche Termine: Nur für den Ersteller (auch Hausleitung sieht fremde private nicht)
      if (t.typ === 'persoenlich') {
        return t.erstelltVonId === mitarbeiter.userId;
      }
      
      // Aufgaben-Termine: Für die in sichtbarFuer eingetragenen User (Hausleitung sieht fremde Aufgaben-Termine nicht)
      if (t.typ === 'aufgabe') {
        return t.sichtbarFuer && t.sichtbarFuer.includes(mitarbeiter.userId);
      }
      
      // Haus-Termine: Für alle Mitarbeiter des Hauses (inkl. Ersteller)
      if (t.typ === 'haus') {
        // Ersteller sieht immer seinen eigenen Termin
        if (t.erstelltVonId === mitarbeiter.userId) return true;
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
        
        // Hausleitung sieht alle Stationstermine ihres Hauses
        if (istHausleitung && imSelbenHaus) {
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

  // Aufgaben-Termin erstellen (automatisch bei Aufgabe mit Frist)
  createAufgabenTermin(aufgabe) {
    if (!aufgabe.fristDatum) return null;
    
    // Prüfen ob bereits ein Termin für diese Aufgabe existiert
    const existierend = this.termine.find(t => t.aufgabeId === aufgabe.id);
    if (existierend) return existierend;
    
    return this.createTermin({
      titel: `📋 Aufgabe: ${aufgabe.beschreibung.substring(0, 50)}${aufgabe.beschreibung.length > 50 ? '...' : ''}`,
      beschreibung: aufgabe.beschreibung,
      datum: aufgabe.fristDatum,
      typ: 'aufgabe',
      erstelltVonId: aufgabe.erstelltVonId,
      erstelltVonName: aufgabe.erstelltVonName,
      aufgabeId: aufgabe.id,
      antragId: aufgabe.antragId,
      sichtbarFuer: [aufgabe.erstelltVonId, aufgabe.zugewiesenAnId]
    });
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
}

const terminSystem = new TerminSystem();

// ============================================
// AUFGABENSYSTEM
// ============================================

class AufgabenSystem {
  constructor() {
    this.storageKey = 'gefaengnis_aufgaben';
    this.aufgaben = this.loadAufgaben();
  }

  loadAufgaben() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveAufgaben() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.aufgaben));
  }

  generateId() {
    return 'AUF-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  // Aufgabe erstellen
  createAufgabe(data) {
    const aufgabe = {
      id: this.generateId(),
      antragId: data.antragId,
      antragsNummer: data.antragsNummer,
      erstelltVonId: data.erstelltVonId,
      erstelltVonName: data.erstelltVonName,
      zugewiesenAnId: data.zugewiesenAnId,
      zugewiesenAnName: data.zugewiesenAnName,
      zugewiesenAnTyp: data.zugewiesenAnTyp, // 'insasse' oder 'mitarbeiter'
      kurzbeschreibung: data.kurzbeschreibung || data.beschreibung, // max 40 Zeichen
      beschreibung: data.beschreibung || '', // ausführliche Beschreibung (optional)
      anhangPdfs: data.anhangPdfs || null, // Array von PDFs [{name, data}, ...]
      fristDatum: data.fristDatum || null,
      letzteErinnerung: null,
      status: 'offen', // 'offen', 'erledigt', 'geloescht'
      antwort: null,
      antwortPdfs: null, // Array von PDFs in der Antwort
      erledigungsTyp: null, // 'antwort' oder 'kenntnisnahme'
      erstelltAm: new Date().toISOString(),
      erledigtAm: null
    };
    this.aufgaben.push(aufgabe);
    this.saveAufgaben();
    
    // WICHTIG: Wenn einem Mitarbeiter eine Aufgabe zugewiesen wird, aus abgegebenVon entfernen
    // So kann ein ehemaliger Bearbeiter wieder Zugriff auf den Antrag bekommen
    if (data.zugewiesenAnTyp === 'mitarbeiter' && data.antragId) {
      antragSystem.entferneAusAbgegebenVon(data.antragId, data.zugewiesenAnId);
    }
    
    // Aktivität protokollieren
    const zielTypText = data.zugewiesenAnTyp === 'insasse' ? 'Insasse' : 'Mitarbeiter';
    const fristText = data.fristDatum ? ` (Frist: ${new Date(data.fristDatum).toLocaleDateString('de-DE')})` : '';
    aktivitaetenSystem.logAktivitaet({
      antragId: data.antragId,
      typ: 'aufgabe-erstellt',
      beschreibung: `Aufgabe erstellt für ${zielTypText}: ${data.zugewiesenAnName}${fristText}`,
      details: { 
        kurzbeschreibung: data.kurzbeschreibung || data.beschreibung, 
        beschreibung: data.beschreibung,
        zugewiesenAn: data.zugewiesenAnName, 
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
    
    return aufgabe;
  }

  // Aufgabe erledigen
  // erledigungsTyp: 'antwort' oder 'kenntnisnahme'
  // antwortPdfs: Array von PDFs [{name, data}, ...]
  erledigeAufgabe(aufgabeId, antwort, erledigungsTyp = 'antwort', antwortPdfs = null) {
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
            '⚠️ Aufgabe überfällig',
            `Die Aufgabe zum Antrag ${aufgabe.antragsNummer} ist überfällig (Frist: ${new Date(aufgabe.fristDatum).toLocaleDateString('de-DE')}).`,
            aufgabe.antragId
          );
          
          // Erinnerung an Ersteller senden
          notificationSystem.createNotification(
            aufgabe.erstelltVonId,
            'aufgabe-ueberfaellig',
            '⚠️ Aufgabe überfällig',
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
      // Status-Migration: 'in-bearbeitung' ohne Bearbeiter wird zu 'offen'
      if (antrag.status === 'in-bearbeitung' && !antrag.bearbeiterId) {
        antrag.status = 'offen';
        changed = true;
      }
      // Erledigte Anträge markieren
      if (['genehmigt', 'abgelehnt', 'zurueckgegeben', 'teilweise-genehmigt'].includes(antrag.status) && antrag.erledigt === undefined) {
        antrag.erledigt = (antrag.status !== 'zurueckgegeben');
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
      const typeText = type === 'teilhabegeld' ? 'Teilhabegeld' : 'Eigentum in der Kammer';
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
      const typeText = antrag.type === 'teilhabegeld' ? 'Teilhabegeld' : 'Eigentum in der Kammer';
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
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.status === 'offen') {
      antrag.status = 'in-bearbeitung';
      antrag.bearbeiterId = mitarbeiter.userId;
      antrag.bearbeiterName = mitarbeiter.name;
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
      
      return antrag;
    }
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

  // Antrag als sachlich/fachlich geprüft markieren
  markiereAlsGeprueft(antragId, mitarbeiterId, mitarbeiterName, pruefungsKommentar = '') {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.status === 'in-bearbeitung') {
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

  // Antrag abschließen (genehmigen, ablehnen, teilweise genehmigen)
  abschliessenAntrag(id, status, begruendung = null, persoenlichEroeffnen = false, bescheidPdf = null, vollzugVorBekanntgabe = false) {
    const antrag = this.antraege.find(a => a.id === id);
    if (antrag) {
      const bearbeiterId = antrag.bearbeiterId;
      const bearbeiterName = antrag.bearbeiterName;
      
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
      const antragsTyp = antrag.type === 'teilhabegeld' ? 'Teilhabegeld' : 'Eigentum in der Kammer';
      let title, message;
      
      if (status === 'genehmigt') {
        title = '✓ Antrag genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde genehmigt.`;
      } else if (status === 'abgelehnt') {
        title = '✕ Antrag abgelehnt';
        message = `Ihr Antrag "${antragsTyp}" wurde leider abgelehnt.${begruendung ? ' Begründung: ' + begruendung : ''}`;
      } else if (status === 'teilweise-genehmigt') {
        title = '⚡ Antrag teilweise genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde teilweise genehmigt.${begruendung ? ' Hinweis: ' + begruendung : ''}`;
      }
      
      if (title && antrag.insasseId) {
        notificationSystem.createNotification(antrag.insasseId, status, title, message, antrag.id);
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
      const antragsTyp = antrag.type === 'teilhabegeld' ? 'Teilhabegeld' : 'Eigentum in der Kammer';
      let title, message;
      
      if (status === 'genehmigt') {
        title = '✓ Antrag genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde genehmigt.${vollzugKommentar ? ' Hinweis zum Vollzug: ' + getTranslatedUserText(vollzugKommentar) : ''}`;
      } else if (status === 'abgelehnt') {
        title = '✕ Antrag abgelehnt';
        message = `Ihr Antrag "${antragsTyp}" wurde leider abgelehnt.${vollzugKommentar ? ' Hinweis: ' + getTranslatedUserText(vollzugKommentar) : ''}`;
      } else if (status === 'teilweise-genehmigt') {
        title = '⚡ Antrag teilweise genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde teilweise genehmigt.${vollzugKommentar ? ' Hinweis: ' + getTranslatedUserText(vollzugKommentar) : ''}`;
      }
      
      if (title && antrag.insasseId) {
        notificationSystem.createNotification(antrag.insasseId, status, title, message, antrag.id);
      }
      
      return antrag;
    }
    return null;
  }
  
  // Entscheidung revidieren (nur für Hausleitung)
  revidiereEntscheidung(id, mitarbeiterId, mitarbeiterName) {
    const antrag = this.antraege.find(a => a.id === id && a.entscheidungGetroffen);
    if (antrag) {
      // Zurücksetzen der Entscheidung
      antrag.entscheidungGetroffen = false;
      antrag.status = 'in-bearbeitung';
      antrag.erledigt = false;
      antrag.wartetAufEroeffnung = false;
      antrag.wartetAufVollzug = false;
      antrag.geplantesErgebnis = null;
      antrag.geplanteBegruendung = null;
      antrag.begruendung = null;
      antrag.bescheidPdf = null;
      
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: id,
        typ: 'entscheidung-revidiert',
        beschreibung: 'Entscheidung durch Hausleitung revidiert',
        benutzerTyp: 'mitarbeiter',
        benutzerId: mitarbeiterId,
        benutzerName: mitarbeiterName
      });
      
      return antrag;
    }
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
      
      // Wenn auch Vollzug vor Bekanntgabe gesetzt ist, warten wir darauf
      if (antrag.wartetAufVollzug) {
        // Noch nicht abschließen - erst wenn beide bestätigt sind
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
      const antragsTyp = antrag.type === 'teilhabegeld' ? 'Teilhabegeld' : 'Eigentum in der Kammer';
      let title, message;
      
      if (status === 'genehmigt') {
        title = '✓ Antrag genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde genehmigt.`;
      } else if (status === 'abgelehnt') {
        title = '✕ Antrag abgelehnt';
        message = `Ihr Antrag "${antragsTyp}" wurde leider abgelehnt.${begruendung ? ' Begründung: ' + (typeof begruendung === 'object' ? getTranslatedUserText(begruendung) : begruendung) : ''}`;
      } else if (status === 'teilweise-genehmigt') {
        title = '⚡ Antrag teilweise genehmigt';
        message = `Ihr Antrag "${antragsTyp}" wurde teilweise genehmigt.${begruendung ? ' Hinweis: ' + (typeof begruendung === 'object' ? getTranslatedUserText(begruendung) : begruendung) : ''}`;
      }
      
      if (title && antrag.insasseId) {
        notificationSystem.createNotification(antrag.insasseId, status, title, message, antrag.id);
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

  // Antrag neu einreichen (nach Zurückgabe)
  updateAntragMonat(id, monat) {
    const antrag = this.antraege.find(a => a.id === id);
    if (antrag) {
      antrag.monat = monat;
      antrag.status = 'offen';
      antrag.begruendung = null;
      antrag.bearbeitetAm = null;
      antrag.bearbeiterId = null;
      antrag.bearbeiterName = null;
      antrag.erledigt = false;
      this.saveAntraege();
    }
    return antrag;
  }

  updateAntragEigentum(id, aktion, kleidung) {
    const antrag = this.antraege.find(a => a.id === id);
    if (antrag) {
      antrag.aktion = aktion;
      antrag.kleidung = kleidung;
      antrag.status = 'offen';
      antrag.begruendung = null;
      antrag.bearbeitetAm = null;
      antrag.bearbeiterId = null;
      antrag.bearbeiterName = null;
      antrag.erledigt = false;
      this.saveAntraege();
    }
    return antrag;
  }

  deleteAntrag(id) {
    this.antraege = this.antraege.filter(a => a.id !== id);
    this.saveAntraege();
  }

  getAntrag(id) {
    return this.antraege.find(a => a.id === id);
  }

  // ====== INSASSEN-FUNKTIONEN ======

  // Entwürfe eines bestimmten Insassen
  getEntwuerfeInsasse(insasseId) {
    return this.antraege.filter(a => 
      a.insasseId === insasseId &&
      a.status === 'entwurf'
    ).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Aktive Anträge eines bestimmten Insassen (ohne Entwürfe, ohne erledigte)
  getAktiveAntraegeInsasse(insasseId) {
    return this.antraege.filter(a => {
      if (a.insasseId !== insasseId) return false;
      if (a.status === 'entwurf') return false;
      // Anträge die auf persönliche Eröffnung oder Vollzug warten, zeigen wir als aktiv
      if (a.wartetAufEroeffnung || a.wartetAufVollzug) return true;
      // Alle nicht-erledigten Anträge sind aktiv
      if (a.erledigt !== true) return true;
      return false;
    }).sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  }

  // Historie eines bestimmten Insassen (erledigte Anträge, die bekannt gegeben wurden)
  getHistorieInsasse(insasseId) {
    return this.antraege.filter(a => {
      if (a.insasseId !== insasseId) return false;
      if (a.status === 'entwurf') return false;
      // Anträge die noch auf Bekanntgabe warten, nicht in Historie
      if (a.wartetAufEroeffnung || a.wartetAufVollzug) return false;
      // Erledigte Anträge in Historie
      if (a.erledigt === true) return true;
      return false;
    }).sort((a, b) => new Date(b.bearbeitetAm || b.erstelltAm) - new Date(a.bearbeitetAm || a.erstelltAm));
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

  // Offene Anträge für Mitarbeiter (basierend auf Haus/Station)
  getOffeneAntraegeMitarbeiter(mitarbeiter) {
    return this.antraege.filter(a => {
      if (a.status !== 'offen') return false;
      
      // Hausleitung sieht alle Anträge ihres Hauses
      if (mitarbeiter.rolle === 'jva-leitung' || mitarbeiter.rolle === 'haus-leitung') {
        return this._matchesHaus(mitarbeiter.jvas, a.insasseJva);
      }
      
      // Mitarbeiter und Stationsleitung sehen nur ihre Station
      return this._matchesHaus(mitarbeiter.jvas, a.insasseJva) && 
             a.insasseStation === mitarbeiter.station;
    }).sort((a, b) => new Date(a.erstelltAm) - new Date(b.erstelltAm));
  }

  // In Bearbeitung befindliche Anträge (inkl. entschiedene aber nicht veraktete)
  getInBearbeitungAntraege(mitarbeiter) {
    return this.antraege.filter(a => {
      // Anträge in Bearbeitung ODER entschieden aber noch nicht veraktet
      const istInBearbeitung = a.status === 'in-bearbeitung';
      const istEntschiedenNichtVeraktet = a.erledigt && !a.veraktet;
      
      if (!istInBearbeitung && !istEntschiedenNichtVeraktet) return false;
      
      // Prüfen ob Mitarbeiter berechtigt ist (Bearbeiter, Aufgaben-Beteiligter oder hat bereits am Antrag gearbeitet)
      const istBearbeiter = a.bearbeiterId === mitarbeiter.userId;
      const aufgabenZuAntrag = aufgabenSystem.getAufgabenZuAntrag(a.id);
      // Aufgabenkette: Jeder der eine Aufgabe erstellt oder erhalten hat, hat Zugriff
      const hatAufgabeErhalten = aufgabenZuAntrag.some(auf => auf.zugewiesenAnId === mitarbeiter.userId);
      const hatAufgabeErstellt = aufgabenZuAntrag.some(auf => auf.erstelltVonId === mitarbeiter.userId);
      // Aktivitätsbezug: Jeder der bereits eine Aktion am Antrag durchgeführt hat
      const hatAmAntragGearbeitet = aktivitaetenSystem.istMitarbeiterBeteiligt(a.id, mitarbeiter.userId);
      const hatAufgabenbezug = hatAufgabeErhalten || hatAufgabeErstellt || hatAmAntragGearbeitet;
      
      // Hausleitung sieht alle "in Bearbeitung" Anträge ihres Hauses
      if (mitarbeiter.rolle === 'jva-leitung' || mitarbeiter.rolle === 'haus-leitung') {
        return this._matchesHaus(mitarbeiter.jvas, a.insasseJva);
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

  // Historie für Mitarbeiter (nur veraktete Anträge)
  getHistorieMitarbeiter(mitarbeiter) {
    return this.antraege.filter(a => {
      // Nur veraktete Anträge in der Historie
      if (!a.veraktet) return false;
      
      // Hausleitung sieht alle verakteten Anträge ihres Hauses
      if (mitarbeiter.rolle === 'jva-leitung' || mitarbeiter.rolle === 'haus-leitung') {
        return this._matchesHaus(mitarbeiter.jvas, a.insasseJva);
      }
      
      // Stationsleitung sieht alle verakteten Anträge ihrer Station
      if (mitarbeiter.rolle === 'stationsleitung') {
        return this._matchesHaus(mitarbeiter.jvas, a.insasseJva) && 
               a.insasseStation === mitarbeiter.station;
      }
      
      // Normale Mitarbeiter sehen ihre persönlich bearbeiteten Anträge
      // ODER Anträge, zu denen sie eine Aufgabe hatten oder an denen sie gearbeitet haben
      const istBearbeiter = a.bearbeiterId === mitarbeiter.userId;
      const aufgabenZuAntrag = aufgabenSystem.getAufgabenZuAntrag(a.id);
      const hatteAufgabe = aufgabenZuAntrag.some(auf => 
        auf.zugewiesenAnId === mitarbeiter.userId || auf.erstelltVonId === mitarbeiter.userId
      );
      const hatAmAntragGearbeitet = aktivitaetenSystem.istMitarbeiterBeteiligt(a.id, mitarbeiter.userId);
      
      return istBearbeiter || hatteAufgabe || hatAmAntragGearbeitet;
    }).sort((a, b) => new Date(b.veraktetAm || b.bearbeitetAm) - new Date(a.veraktetAm || a.bearbeitetAm));
  }

  // Antrag verakten
  verakteAntrag(antragId, mitarbeiterId, mitarbeiterName) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag) {
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
  addKommentar(antragId, kommentarText, benutzerId, benutzerName) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag) {
      if (!antrag.kommentare) {
        antrag.kommentare = [];
      }
      
      const kommentar = {
        id: 'KOM-' + Date.now().toString(36).toUpperCase(),
        text: kommentarText,
        benutzerId: benutzerId,
        benutzerName: benutzerName,
        erstelltAm: new Date().toISOString()
      };
      
      antrag.kommentare.push(kommentar);
      this.saveAntraege();
      
      // Aktivität protokollieren
      aktivitaetenSystem.logAktivitaet({
        antragId: antragId,
        typ: 'kommentar',
        beschreibung: 'Kommentar hinzugefuegt',
        details: { kommentarId: kommentar.id },
        benutzerTyp: 'mitarbeiter',
        benutzerId: benutzerId,
        benutzerName: benutzerName
      });
      
      return kommentar;
    }
    return null;
  }

  // Alle Kommentare eines Antrags abrufen
  getKommentare(antragId) {
    const antrag = this.antraege.find(a => a.id === antragId);
    if (antrag && antrag.kommentare) {
      return antrag.kommentare.sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
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
}

// Globale Instanz
const antragSystem = new AntragSystem();

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
    'entwurf': '📝',
    'offen': '📄',
    'in-bearbeitung': '⏳',
    'genehmigt': '✓',
    'abgelehnt': '✕',
    'teilweise-genehmigt': '⚡'
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

function getRolleText(rolle) {
  const rollen = {
    'mitarbeiter': 'Mitarbeiter',
    'jva-leitung': 'Hausleitung',
    'haus-leitung': 'Hausleitung',
    'stationsleitung': 'Stationsleitung'
  };
  return rollen[rolle] || rolle;
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
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
