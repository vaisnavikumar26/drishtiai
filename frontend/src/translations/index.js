// Comprehensive Bilingual Translation System (English & Tamil)
// Designed for rural healthcare accessibility and structured for future Indian language expansion.

export const TRANSLATIONS = {
  en: {
    // Brand & Header
    brandName: 'DrishtiAI Rural Eye Care',
    brandTagline: 'Rural Diabetic Retinopathy Screening & Vision Protection',
    navHome: 'Home',
    navScreening: 'Screening Portal',
    navCentres: 'Nearby Health Centres',
    navAppointments: 'Appointments',
    navDoctor: 'Doctor Station',
    navAdmin: 'District Admin',
    navLearn: 'Eye Health Guide',
    navLogin: 'Login / Register',
    navLogout: 'Sign Out',
    langToggle: 'தமிழ் (Tamil)',

    // Landing Page
    landingHeroTitle: 'Protecting Rural Vision from Diabetic Retinopathy',
    landingHeroSubtitle: 'A safe, accessible eye care network connecting rural diabetic patients with primary health centres and specialist ophthalmologists.',
    btnGetStarted: 'Get Started',
    btnPatientLogin: 'Patient Login',
    btnDoctorLogin: 'Doctor Login',
    btnAdminLogin: 'Admin Login',
    btnFindCentres: 'Find Nearby Health Centres',
    btnLearnEyeHealth: 'Learn About Eye Health',

    // Landing Explanations (Simple Language for Rural Elders)
    whatIsDrTitle: 'What is Diabetic Retinopathy?',
    whatIsDrDesc: 'Diabetic retinopathy is eye damage caused by diabetes. Over time, high blood sugar weakens the tiny blood vessels at the back of your eye (the retina). In the early stages, you may not feel any pain or notice any change in vision, but without regular checks, it can cause severe vision loss or blindness.',
    
    whyScreeningTitle: 'Why is Retinal Screening Essential?',
    whyScreeningDesc: 'Regular retinal photographs can detect microscopic blood vessel changes years before vision deteriorates. Early detection and laser or medical treatment can prevent up to 95% of diabetes-related vision loss.',
    
    howPatientSubmitsTitle: 'How Rural Patients Submit Images',
    howPatientSubmitsDesc: 'Patients can attend a free screening camp at their local Primary Health Centre (PHC) where an eye technician captures a retinal photograph, or upload an image directly through this portal with informed consent.',
    
    howDoctorReviewsTitle: 'How Doctors Review Cases Remotely',
    howDoctorReviewsDesc: 'Authorised retinal specialists at regional eye hospitals review retinal images securely, evaluate clinical urgency, record clinical notes, and recommend follow-up appointments.',
    
    howFindPhcTitle: 'Find Nearest Health Centres & Clinics',
    howFindPhcDesc: 'Locate verified Primary Health Centres, Taluk Government Hospitals, and specialty eye hospitals in Tirunelveli, Ambasamudram, Tenkasi, and surrounding districts with opening hours and contact numbers.',
    
    howConsultDoctorTitle: 'Doctor Consultations & Appointments',
    howConsultDoctorDesc: 'Schedule visits at nearby clinics, exchange secure messages with your attending doctor, and participate in telemedicine consultations where connectivity allows.',

    medicalSafetyNotice: 'Medical Safety Notice: Automated website screening does not replace an in-person dilated eye examination by a qualified ophthalmologist. Clinical review by an authorised clinician is required for all medical recommendations.',

    // Urgency Levels
    urgencyTitle: 'Clinical Urgency & Triage Levels',
    urgencyLevel1Title: 'Level 1 – Routine',
    urgencyLevel1Desc: 'No urgent retinal findings identified. Continue routine blood sugar control and attend annual eye screening (every 12 months).',
    urgencyLevel2Title: 'Level 2 – Follow-up Needed',
    urgencyLevel2Desc: 'Retinal changes detected that warrant specialist evaluation within 2 to 4 weeks. An appointment at a nearby eye clinic is recommended.',
    urgencyLevel3Title: 'Level 3 – Urgent Review',
    urgencyLevel3Desc: 'Prompt clinical assessment required within 24 to 48 hours. Please contact the nearest government or eye hospital immediately.',

    // Authentication & Shared Phone
    patientLoginTitle: 'Rural Patient Portal Login',
    patientLoginSubtitle: 'Enter your patient details to view your screening reports and appointments.',
    lblPatientName: 'Patient Full Name or Patient ID',
    phPatientName: 'e.g. Muthuvel K. or PID-1001',
    lblMobileNumber: '10-Digit Mobile Phone Number',
    phMobileNumber: 'e.g. 9876543210',
    lblPersonalPassword: 'Personal Password',
    phPassword: 'Enter your private password',
    btnSignInPatient: 'Sign In to Patient Portal',
    sharedPhoneNoticeTitle: 'Shared Family Phone Support',
    sharedPhoneNoticeDesc: 'Multiple family members sharing the same mobile phone? Each person has their own separate patient account and private password. One family member cannot view another person\'s medical records.',
    btnCheckFamilyAccounts: 'Check Family Accounts on this Phone',
    btnRegisterNewPatient: 'Register as a New Patient',
    noAccountPrompt: 'Don\'t have an account yet?',
    alreadyHaveAccount: 'Already registered? Sign In',

    // Patient Registration
    patientRegTitle: 'New Patient Registration',
    lblAge: 'Age',
    lblGender: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderOther: 'Other',
    lblVillage: 'Village / Town',
    phVillage: 'e.g. Ambasamudram',
    lblDistrict: 'District',
    lblAddress: 'Full Home Address',
    phAddress: 'Street name, village, landmark',
    lblDiabetesDuration: 'Years Living with Diabetes',
    btnSubmitRegistration: 'Create Patient Account',

    // Staff Login
    doctorLoginTitle: 'Authorised Doctor Clinical Portal',
    doctorLoginSubtitle: 'Secure access for verified ophthalmologists and retinal clinicians.',
    adminLoginTitle: 'District Health Administration Portal',
    adminLoginSubtitle: 'Management access for Primary Health Centre and District Health Officers.',
    lblEmail: 'Official Email Address',
    phEmail: 'e.g. doctor@drishtiai.in',
    btnStaffLogin: 'Secure Staff Login',

    // Patient Dashboard
    patientDashboardTitle: 'My Eye Care Dashboard',
    btnUploadRetinalImage: 'Upload Retinal Image',
    btnMyScreeningStatus: 'My Screening Status',
    btnMyReport: 'My Report & Review',
    btnFindNearbyPhc: 'Find Nearby PHC / Hospital',
    btnBookAppointment: 'Book an Appointment',
    btnVideoConsult: 'Video Consultation',
    btnMessagesNotifications: 'Messages & Notifications',
    btnMyProfile: 'My Profile & Settings',

    // Screening Upload Wizard
    uploadRetinalTitle: 'Submit Retinal Fundus Photograph',
    uploadRetinalSubtitle: 'Capture using your camera or upload a clear retinal photograph for clinician review.',
    btnUseCamera: 'Take Photo with Camera',
    btnChooseFile: 'Choose Image File',
    btnRetake: 'Retake / Choose Another',
    imagePreviewTitle: 'Image Preview',
    uploadValidationNote: 'Accepted formats: JPEG, PNG, WEBP (Max 10MB). Image must show the retina and optic disc clearly.',
    consentCheckbox: 'I hereby provide informed consent for my retinal photograph to be securely stored and reviewed by authorised eye care clinicians.',
    consentWarning: 'You must provide informed consent before submitting.',
    btnSubmitForReview: 'Submit Image for Clinical Review',
    uploadSuccessMsg: 'Retinal image submitted successfully! Routed to an authorised clinician.',
    aiNotConfiguredNotice: 'AI automated screening is not configured; clinical review by an authorised ophthalmologist is required.',

    // Screening Reports
    reportTitle: 'Clinical Retinal Screening Report',
    screeningIdLbl: 'Screening Case ID',
    dateOfScreening: 'Date of Submission',
    assignedClinician: 'Assigned Clinician',
    clinicalAssessmentLbl: 'Clinician Assessment',
    doctorNotesLbl: 'Doctor\'s Clinical Notes',
    urgencyTriageLbl: 'Urgency Triage Level',
    recommendedNextStep: 'Recommended Next Step',
    referralLocationLbl: 'Referred Eye Care Centre',
    statusPendingReview: 'Pending Clinical Review',
    statusReviewed: 'Review Completed',
    statusReferImmediately: 'Urgent Referral Recommended',

    // Nearby Centre Finder
    finderTitle: 'Primary Health Centres & Eye Care Hospitals',
    finderSubtitle: 'Search verified health centres in Ambasamudram, Tirunelveli, and surrounding blocks.',
    btnUseMyLocation: 'Use My Current Location (GPS)',
    gpsPermissionDenied: 'Location access was not granted. You can search manually by village or PIN code.',
    phSearchCentres: 'Search by village, town, district, hospital name, or PIN (e.g. Ambasamudram, 627401)...',
    filterAllDistricts: 'All Districts',
    lblServicesAvailable: 'Services Available',
    lblOpeningHours: 'Opening Hours',
    lblContactPhone: 'Contact Phone',
    lblEmergencyInstructions: 'Emergency / After-Hours Instructions',
    btnGetDirections: 'View on Google Maps',
    btnBookAtThisCentre: 'Book Visit Here',
    distanceKmText: 'km from your location',

    // Appointments
    appointmentsTitle: 'Eye Clinic Appointments',
    btnRequestAppointment: 'Book New Appointment',
    lblPreferredDate: 'Preferred Date',
    lblPreferredTime: 'Preferred Time Slot',
    lblSelectDoctor: 'Select Doctor / Specialist',
    lblSelectCentre: 'Select Health Centre / Hospital',
    lblReasonForVisit: 'Reason for Appointment',
    appointmentStatusPending: 'Pending Confirmation',
    appointmentStatusConfirmed: 'Confirmed by Doctor',
    appointmentStatusRescheduled: 'Rescheduled',
    appointmentStatusCompleted: 'Completed',
    appointmentStatusCancelled: 'Cancelled',

    // Video Consultation & Messaging
    telemedTitle: 'Tele-Ophthalmology Consultation Room',
    videoUnavailableNotice: 'Video consultation service is currently awaiting connection with attending clinician, or camera permission has not been granted.',
    btnToggleVideo: 'Toggle Camera',
    btnToggleAudio: 'Toggle Microphone',
    btnEndCall: 'Leave Consultation',
    messagingTitle: 'Secure Doctor-Patient Communication',
    phTypeMessage: 'Type your question or medical inquiry here...',
    btnSendMessage: 'Send Message',

    // Doctor Portal
    doctorPortalTitle: 'Authorised Ophthalmologist Clinical Station',
    queueTitle: 'Assigned Retinal Screening Cases',
    btnSelectUrgency: 'Assign Urgency Triage Level',
    btnConfirmReview: 'Sign Off Clinical Assessment',

    // Admin Dashboard
    adminPortalTitle: 'District Eye Health Mission Administration',
    statTotalPatients: 'Registered Patients',
    statPendingReviews: 'Pending Reviews',
    statReviewedCases: 'Reviewed Cases',
    statReferrals: 'Referrals Issued',
    tabPatients: 'Patient Registry',
    tabDoctors: 'Doctor Directory',
    tabCentres: 'Health Centre Maintenance',
    tabAuditLogs: 'System Audit Trail',
    tabNotifications: 'Notification Gateway',
    btnAddHealthCentre: 'Add Verified Health Centre',

    // Notifications
    notificationConsentTitle: 'Notification Alerts',
    notificationConsentDesc: 'Patients receive SMS/Email notifications only when an official gateway is configured and consent is granted.',
    providerStatusUnconfigured: 'Provider Not Configured (API Key Required)',
    btnRetryNotification: 'Retry Dispatch',

    // Common
    loading: 'Loading...',
    save: 'Save Changes',
    cancel: 'Cancel',
    close: 'Close',
    back: 'Back',
    verifiedBadge: 'Verified Healthcare Facility'
  },

  ta: {
    // Brand & Header
    brandName: 'திருஷ்டி AI கிராமப்புற கண் நல மையம்',
    brandTagline: 'கிராமப்புற சர்க்கரை நோய் விழித்திரை பரிசோதனை மற்றும் பார்வை பாதுகாப்பு',
    navHome: 'முகப்பு',
    navScreening: 'கண் பரிசோதனை',
    navCentres: 'அருகிலுள்ள மருத்துவமனைகள்',
    navAppointments: 'நேர முன்பதிவு',
    navDoctor: 'மருத்துவர் தளம்',
    navAdmin: 'மாவட்ட நிர்வாகம்',
    navLearn: 'கண் நல வழிகாட்டி',
    navLogin: 'உள்நுழைவு / பதிவு',
    navLogout: 'வெளியேறு',
    langToggle: 'English (ஆங்கிலம்)',

    // Landing Page
    landingHeroTitle: 'சர்க்கரை நோய் விழித்திரை பாதிப்பிலிருந்து கிராம மக்களின் பார்வையைப் பாதுகாப்போம்',
    landingHeroSubtitle: 'கிராமப்புற நோயாளிகள், ஆரம்ப சுகாதார நிலையங்கள் மற்றும் சிறப்பு கண் மருத்துவர்களை இணைக்கும் பாதுகாப்பான, எளிய கண் பராமரிப்பு கட்டமைப்பு.',
    btnGetStarted: 'தொடங்குங்கள்',
    btnPatientLogin: 'நோயாளி உள்நுழைவு',
    btnDoctorLogin: 'மருத்துவர் உள்நுழைவு',
    btnAdminLogin: 'நிர்வாக உள்நுழைவு',
    btnFindCentres: 'அருகிலுள்ள சுகாதார மையங்கள்',
    btnLearnEyeHealth: 'கண் நலம் பற்றி அறிக',

    // Landing Explanations (Simple Language for Rural Elders)
    whatIsDrTitle: 'சர்க்கரை நோய் விழித்திரை பாதிப்பு (Diabetic Retinopathy) என்றால் என்ன?',
    whatIsDrDesc: 'நீரிழிவு நோயால் (சர்க்கரை வியாதி) கண்களின் பின்புறமுள்ள ரத்த நாளங்கள் பலவீனமடைவதே விழித்திரை பாதிப்பாகும். ஆரம்ப காலத்தில் எந்த வலியோ, பார்வை மாற்றமோ தெரியாது. ஆனால் தொடர்ந்து கவனிக்காவிட்டால் பார்வை இழப்பு ஏற்படக்கூடும்.',
    
    whyScreeningTitle: 'விழித்திரை பரிசோதனை ஏன் அவசியம்?',
    whyScreeningDesc: 'ஆரம்ப நிலையிலேயே கண் விழித்திரை புகைப்படம் எடுத்துப் பரிசோதிப்பதன் மூலம் கண் பாதிப்பை முன்கூட்டியே கண்டறிந்து, லேசர் சிகிச்சை மூலம் 95% பார்வை இழப்பைத் தடுக்க முடியும்.',
    
    howPatientSubmitsTitle: 'கிராமப்புற நோயாளிகள் பரிசோதனை பெறுவது எப்படி?',
    howPatientSubmitsDesc: 'அருகிலுள்ள ஆரம்ப சுகாதார நிலைய (PHC) முகாமில் கண் புகைப்படம் எடுத்தோ, அல்லது இந்த இணையதளத்தில் உங்கள் ஒப்புதலுடன் கண் புகைப்படத்தைப் பதிவேற்றியோ கண் மருத்துவ பரிசீலனைக்கு அனுப்பலாம்.',
    
    howDoctorReviewsTitle: 'மருத்துவர்கள் எவ்வாறு தொலைவிலிருந்து பரிசீலிக்கிறார்கள்?',
    howDoctorReviewsDesc: 'அங்கீகரிக்கப்பட்ட கண் விழித்திரை சிறப்பு மருத்துவர்கள் இந்த இணையதளம் வழியாக உங்கள் கண் படங்களை ஆய்வு செய்து, அவசர நிலையைத் தீர்மானித்து, சிகிச்சை ஆலோசனைகளை வழங்குவர்.',
    
    howFindPhcTitle: 'அருகிலுள்ள சுகாதார நிலையங்களை எப்படிக் கண்டறிவது?',
    howFindPhcDesc: 'திருநெல்வேலி, அம்பாசமுத்திரம், தென்காசி உள்ளிட்ட வட்டாரங்களில் உள்ள ஆரம்ப சுகாதார நிலையங்கள், அரசு தாலுகா மருத்துவமனைகள் மற்றும் கண் மருத்துவமனைகளின் முகவரி, தொலைபேசி எண்கள் மற்றும் சேவைகளை எளிதில் அறியலாம்.',
    
    howConsultDoctorTitle: 'மருத்துவ ஆலோசனையும் சந்திப்பு முன்பதிவும்',
    howConsultDoctorDesc: 'மருத்துவமனை சந்திப்புகளை முன்பதிவு செய்யவும், உங்கள் மருத்துவரிடம் பாதுகாப்பாக செய்திகள் அனுப்பவும், இணைய வசதி உள்ள இடங்களில் காணொளி ஆலோசனை பெறவும் முடியும்.',

    medicalSafetyNotice: 'மருத்துவப் பாதுகாப்பு அறிவிப்பு: இணையதள தானியங்கி பரிசோதனை என்பது கண் மருத்துவரின் நேரடி பரிசோதனைக்கு மாற்றாகாது. எந்தவொரு மருத்துவ முடிவுக்கும் அங்கீகரிக்கப்பட்ட கண் மருத்துவரின் நேரடி பரிசீலனை கட்டாயமாகும்.',

    // Urgency Levels
    urgencyTitle: 'சிகிச்சை அவசர நிலைகள்',
    urgencyLevel1Title: 'நிலை 1 – வழக்கமான பரிசோதனை (Routine)',
    urgencyLevel1Desc: 'உடனடி விழித்திரை பாதிப்பு ஏதுமில்லை. சர்க்கரை அளவைக் கட்டுப்பாட்டில் வைத்துக்கொண்டு 12 மாதங்களுக்கு ஒருமுறை வழக்கமான கண் பரிசோதனை மேற்கொள்ளவும்.',
    urgencyLevel2Title: 'நிலை 2 – தொடர் பரிசோதனை தேவை (Follow-up Needed)',
    urgencyLevel2Desc: 'விழித்திரையில் சிறிய மாற்றங்கள் தென்படுகின்றன. 2 முதல் 4 வாரங்களுக்குள் அருகிலுள்ள கண் மருத்துவமனையில் விரிவான பரிசோதனை செய்து கொள்வது நல்லது.',
    urgencyLevel3Title: 'நிலை 3 – உடனடி அவசர சிகிச்சை (Urgent Review)',
    urgencyLevel3Desc: '24 முதல் 48 மணி நேரத்திற்குள் அவசர மருத்துவ பரிசோதனை தேவை. உடனடியாக அரசு மருத்துவக் கல்லூரி அல்லது சிறப்பு கண் மருத்துவமனை அவசர பிரிவை அணுகவும்.',

    // Authentication & Shared Phone
    patientLoginTitle: 'கிராமப்புற நோயாளி உள்நுழைவு',
    patientLoginSubtitle: 'உங்கள் கண் பரிசோதனை அறிக்கைகளையும் சந்திப்புகளையும் காண உங்கள் விவரங்களை உள்ளிடவும்.',
    lblPatientName: 'நோயாளி பெயர் அல்லது நோயாளி எண் (PID)',
    phPatientName: 'எ.கா: முத்துவேல் அல்லது PID-1001',
    lblMobileNumber: '10 இலக்க செல்போன் எண்',
    phMobileNumber: 'எ.கா: 9876543210',
    lblPersonalPassword: 'சொந்த கடவுச்சொல் (Password)',
    phPassword: 'உங்கள் ரகசிய கடவுச்சொல்',
    btnSignInPatient: 'நோயாளி தளத்தில் நுழைக',
    sharedPhoneNoticeTitle: 'ஒரே குடும்ப செல்போன் பகிர்வு வசதி',
    sharedPhoneNoticeDesc: 'உங்கள் குடும்பத்தில் ஒருவரே செல்போன் வைத்திருந்தாலும், ஒவ்வொரு குடும்ப உறுப்பினருக்கும் தனித்தனி கணக்கும் தனித்தனி கடவுச்சொல்லும் உள்ளது. ஒருவர் மருத்துவ அறிக்கையை மற்றொருவர் பார்க்க முடியாது.',
    btnCheckFamilyAccounts: 'இந்த போன் எண்ணிலுள்ள குடும்ப கணக்குகளைக் காண்க',
    btnRegisterNewPatient: 'புதிய நோயாளியாக பதிவு செய்க',
    noAccountPrompt: 'கணக்கு இல்லையா?',
    alreadyHaveAccount: 'ஏற்கனவே பதிவு செய்தவரா? உள்நுழையவும்',

    // Patient Registration
    patientRegTitle: 'புதிய நோயாளி பதிவு',
    lblAge: 'வயது',
    lblGender: 'பாலினம்',
    genderMale: 'ஆண்',
    genderFemale: 'பெண்',
    genderOther: 'மற்றவை',
    lblVillage: 'கிராமம் / ஊர்',
    phVillage: 'எ.கா: அம்பாசமுத்திரம்',
    lblDistrict: 'மாவட்டம்',
    lblAddress: 'முழு முகவரி',
    phAddress: 'தெரு பெயர், கிராமம், அடையாளக் குறி',
    lblDiabetesDuration: 'சர்க்கரை நோய் உள்ள வருடங்கள்',
    btnSubmitRegistration: 'நோயாளி கணக்கை உருவாக்கு',

    // Staff Login
    doctorLoginTitle: 'மருத்துவர் மருத்துவ பரிசீலனை தளம்',
    doctorLoginSubtitle: 'அங்கீகரிக்கப்பட்ட கண் மருத்துவர்களுக்கான பாதுகாப்பான தளம்.',
    adminLoginTitle: 'மாவட்ட சுகாதார நிர்வாக தளம்',
    adminLoginSubtitle: 'ஆரம்ப சுகாதார நிலையங்கள் மற்றும் மாவட்ட சுகாதார அலுவலர்களுக்கான தளம்.',
    lblEmail: 'அதிகாரப்பூர்வ மின்னஞ்சல் முகவரி',
    phEmail: 'எ.கா: doctor@drishtiai.in',
    btnStaffLogin: 'பாதுகாப்பாக உள்நுழைக',

    // Patient Dashboard
    patientDashboardTitle: 'எனது கண் நலப் பக்கம்',
    btnUploadRetinalImage: 'விழித்திரை புகைப்படம் பதிவேற்றுக',
    btnMyScreeningStatus: 'எனது பரிசோதனை நிலை',
    btnMyReport: 'எனது மருத்துவ அறிக்கை',
    btnFindNearbyPhc: 'அருகிலுள்ள மருத்துவமனையைக் காண்க',
    btnBookAppointment: 'மருத்துவ சந்திப்பு முன்பதிவு செய்க',
    btnVideoConsult: 'காணொளி ஆலோசனை',
    btnMessagesNotifications: 'செய்திகள் & அறிவிப்புகள்',
    btnMyProfile: 'எனது விவரங்கள் & மொழி',

    // Screening Upload Wizard
    uploadRetinalTitle: 'கண் விழித்திரை புகைப்படத்தை சமர்ப்பிக்கவும்',
    uploadRetinalSubtitle: 'கேமரா வழியாக படம் எடுக்கவும் அல்லது தெளிவான கண் புகைப்படத்தை பதிவேற்றவும்.',
    btnUseCamera: 'கேமரா மூலம் படம் எடுக்கவும்',
    btnChooseFile: 'படத்தைத் தேர்ந்தெடுக்கவும்',
    btnRetake: 'மறுபடியும் படம் எடுக்க',
    imagePreviewTitle: 'பட முன்னோட்டம்',
    uploadValidationNote: 'ஏற்றுக்கொள்ளப்படும் வடிவங்கள்: JPEG, PNG, WEBP (அதிகபட்சம் 10MB). கண் நரம்பும் விழித்திரையும் தெளிவாகத் தெரிய வேண்டும்.',
    consentCheckbox: 'எனது கண் புகைப்படத்தை மருத்துவர்கள் பாதுகாப்பாகப் பரிசீலிக்க முழு மனதுடன் ஒப்புதல் அளிக்கிறேன்.',
    consentWarning: 'சமர்ப்பிக்கும் முன் ஒப்புதல் பெட்டியைத் தேர்ந்தெடுக்க வேண்டும்.',
    btnSubmitForReview: 'மருத்துவ பரிசீலனைக்கு சமர்ப்பிக்கவும்',
    uploadSuccessMsg: 'கண் புகைப்படம் வெற்றிகரமாக அனுப்பப்பட்டது! மருத்துவரின் பார்வைக்கு அனுப்பப்பட்டுள்ளது.',
    aiNotConfiguredNotice: 'AI தானியங்கி பரிசோதனை இணைக்கப்படவில்லை; தகுதிவாய்ந்த கண் மருத்துவரின் நேரடி பரிசீலனை அவசியமாகிறது.',

    // Screening Reports
    reportTitle: 'கண் விழித்திரை பரிசோதனை அறிக்கை',
    screeningIdLbl: 'பரிசோதனை அடையாள எண்',
    dateOfScreening: 'பரிசோதனை செய்த நாள்',
    assignedClinician: 'பரிசீலிக்கும் கண் மருத்துவர்',
    clinicalAssessmentLbl: 'மருத்துவரின் பரிசோதனை முடிவு',
    doctorNotesLbl: 'மருத்துவர் குறிப்புகள்',
    urgencyTriageLbl: 'சிகிச்சை அவசர நிலை',
    recommendedNextStep: 'பரிந்துரைக்கப்படும் அடுத்த கட்டம்',
    referralLocationLbl: 'பரிந்துரைக்கப்பட்ட கண் மருத்துவமனை',
    statusPendingReview: 'மருத்துவர் பரிசீலனைக்காக காத்திருக்கிறது',
    statusReviewed: 'மருத்துவர் பரிசீலனை முடிந்தது',
    statusReferImmediately: 'உடனடி மருத்துவமனை சிகிச்சை பரிந்துரை',

    // Nearby Centre Finder
    finderTitle: 'ஆரம்ப சுகாதார நிலையங்கள் மற்றும் கண் மருத்துவமனைகள்',
    finderSubtitle: 'அம்பாசமுத்திரம், திருநெல்வேலி மற்றும் சுற்றுவட்டாரத்திலுள்ள மருத்துவ மையங்களைக் கண்டறியவும்.',
    btnUseMyLocation: 'எனது இருப்பிடத்தைப் பயன்படுத்து (GPS)',
    gpsPermissionDenied: 'இருப்பிட அனுமதி வழங்கப்படவில்லை. ஊர் பெயர் அல்லது அஞ்சல் குறியீடு மூலம் தேடலாம்.',
    phSearchCentres: 'கிராமம், ஊர், மாவட்டம், மருத்துவமனை பெயர் அல்லது பின்கோடு (எ.கா: அம்பாசமுத்திரம், 627401)...',
    filterAllDistricts: 'அனைத்து மாவட்டங்கள்',
    lblServicesAvailable: 'கிடைக்கும் மருத்துவ சேவைகள்',
    lblOpeningHours: 'இயங்கும் நேரம்',
    lblContactPhone: 'தொடர்பு எண்',
    lblEmergencyInstructions: 'அவசர சிகிச்சை வழிகாட்டுதல்',
    btnGetDirections: 'கூகிள் வரைபடத்தில் காண்க',
    btnBookAtThisCentre: 'இங்கு சந்திப்பு முன்பதிவு செய்ய',
    distanceKmText: 'கி.மீ தொலைவில் உள்ளது',

    // Appointments
    appointmentsTitle: 'மருத்துவ சந்திப்பு முன்பதிவு',
    btnRequestAppointment: 'புதிய சந்திப்பை முன்பதிவு செய்க',
    lblPreferredDate: 'விருப்பமான தேதி',
    lblPreferredTime: 'விருப்பமான நேரம்',
    lblSelectDoctor: 'மருத்துவரைத் தேர்ந்தெடுக்கவும்',
    lblSelectCentre: 'சுகாதார நிலையத்தைத் தேர்ந்தெடுக்கவும்',
    lblReasonForVisit: 'வருகைக்கான காரணம்',
    appointmentStatusPending: 'மருத்துவர் உறுதிப்படுத்தலுக்காக காத்திருக்கிறது',
    appointmentStatusConfirmed: 'மருத்துவ சந்திப்பு உறுதியானது',
    appointmentStatusRescheduled: 'தேதி மாற்றப்பட்டது',
    appointmentStatusCompleted: 'சந்திப்பு முடிவடைந்தது',
    appointmentStatusCancelled: 'ரத்து செய்யப்பட்டது',

    // Video Consultation & Messaging
    telemedTitle: 'தொலைதூர கண் மருத்துவ ஆலோசனை அறை',
    videoUnavailableNotice: 'காணொளி சேவை தற்போது மருத்துவருடன் இணைக்கப்படவில்லை, அல்லது கேமரா அனுமதி கிடைக்கவில்லை.',
    btnToggleVideo: 'கேமரா ஆன்/ஆஃப்',
    btnToggleAudio: 'மைக் ஆன்/ஆஃப்',
    btnEndCall: 'ஆலோசனையிலிருந்து வெளியேறு',
    messagingTitle: 'நோயாளி-மருத்துவர் நேரடி செய்தி உரையாடல்',
    phTypeMessage: 'உங்கள் கேள்விகள் அல்லது மருத்துவ சந்தேகங்களை இங்கு தட்டச்சு செய்யவும்...',
    btnSendMessage: 'செய்தி அனுப்பு',

    // Doctor Portal
    doctorPortalTitle: 'கண் மருத்துவர் பணி தளம்',
    queueTitle: 'பரிசீலிக்க வேண்டிய கண் படங்கள்',
    btnSelectUrgency: 'சிகிச்சை அவசர நிலையை நிர்ணயிக்கவும்',
    btnConfirmReview: 'மருத்துவ அறிக்கையை உறுதிப்படுத்து',

    // Admin Dashboard
    adminPortalTitle: 'மாவட்ட கண் நல திட்ட நிர்வாகம்',
    statTotalPatients: 'பதிவு செய்த நோயாளிகள்',
    statPendingReviews: 'நிலுவையிலுள்ள பரிசோதனைகள்',
    statReviewedCases: 'பரிசீலிக்கப்பட்ட வழக்குகள்',
    statReferrals: 'வழங்கப்பட்ட பரிந்துரைகள்',
    tabPatients: 'நோயாளி பதிவேடு',
    tabDoctors: 'மருத்துவர்கள் பட்டியல்',
    tabCentres: 'சுகாதார மையங்கள் பராமரிப்பு',
    tabAuditLogs: 'கணினி தணிக்கை பதிவு (Audit Trail)',
    tabNotifications: 'செய்தி அறிவிப்பு அமைப்பு',
    btnAddHealthCentre: 'புதிய சுகாதார மையத்தைச் சேர்',

    // Notifications
    notificationConsentTitle: 'செய்தி அறிவிப்புகள்',
    notificationConsentDesc: 'அதிகாரப்பூர்வ SMS சேவை இணைக்கப்பட்டிருக்கும் போது மட்டுமே நோயாளிகளுக்கு குறுஞ்செய்தி அனுப்பப்படும்.',
    providerStatusUnconfigured: 'இணைக்கப்படவில்லை (SMS API சாவி தேவை)',
    btnRetryNotification: 'மீண்டும் அனுப்ப முயல்க',

    // Common
    loading: 'ஏற்றுகிறது...',
    save: 'சேமிக்க',
    cancel: 'ரத்து',
    close: 'மூடுக',
    back: 'பின்செல்க',
    verifiedBadge: 'அரசு அங்கீகரிக்கப்பட்ட மருத்துவ மையம்'
  }
};
