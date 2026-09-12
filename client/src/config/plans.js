/**
 * Centralized Plan Configuration & Limitations for Urugendo.
 * All pricing, durations, and tier limits are managed here.
 */

export const plansConfig = {
  daily: {
    id: 'daily',
    name: '1 Day',
    nameRw: 'Umunsi 1',
    price: 500,
    currency: 'RWF',
    durationDays: 1,
    durationText: '24 hours',
    durationTextRw: 'Amasaha 24',
    badge: null,
    description: 'Quick preparation for last-minute revision before your test.',
    descriptionRw: 'Kwitegura byihuse mbere gato yuko ukora ikizamini.',
    features: [
      '24 hours full platform access',
      'Up to 3 full theory lessons',
      '1 official timed mock exam (20 questions)',
      '25 practice exercise questions',
      'Basic progress tracking',
    ],
    featuresRw: [
      'Kwinjira ku rubuga mu masaha 24',
      'Amasomo 3 y’ibanze y’amategeko',
      'Ikizamini 1 cy’igerageza cy’iminota 20',
      'Ibibazo 25 byo kwimenyereza',
      'Kureba amanota yawe',
    ],
    limits: {
      maxLessons: 3,
      maxMockExams: 1,
      maxExercises: 25,
      offlineAccess: false,
    },
    popular: false,
  },

  weekly: {
    id: 'weekly',
    name: '1 Week',
    nameRw: 'Icyumweru 1',
    price: 1500,
    currency: 'RWF',
    durationDays: 7,
    durationText: '7 days',
    durationTextRw: 'Iminsi 7',
    badge: null,
    description: 'Balanced week-long sprint to master key rules and road signs.',
    descriptionRw: 'Icyumweru cyo kwiga amategeko y’ingenzi n’ibyapa byose.',
    features: [
      '7 days continuous access',
      'Up to 12 structured video lessons',
      '5 official timed mock exams',
      '100 practice exercise questions',
      'Road sign visual library mastery',
      'Mistake analyzer & review mode',
    ],
    featuresRw: [
      'Kwinjira ku rubuga mu minsi 7',
      'Amasomo 12 arimo amashusho',
      'Ibizamini 5 by’igerageza bipimwe igihe',
      'Ibibazo 100 byo kwimenyereza',
      'Ibyapa byose byo mu muhanda',
      'Gusubiramo amakosa wakoze',
    ],
    limits: {
      maxLessons: 12,
      maxMockExams: 5,
      maxExercises: 100,
      offlineAccess: true,
    },
    popular: false,
  },

  monthly: {
    id: 'monthly',
    name: '1 Month',
    nameRw: 'Ukwezi 1',
    price: 3000,
    currency: 'RWF',
    durationDays: 30,
    durationText: '30 days',
    durationTextRw: 'Iminsi 30',
    badge: 'BEST VALUE',
    badgeRw: 'IHITAmo RYIZA',
    description: 'The complete, highest-rated package with unlimited access to pass on your first attempt.',
    descriptionRw: 'Uburyo bwuzuye buhawe agaciro kanini bwo kwiga utuje ugatsindira ku nshuro ya mbere.',
    features: [
      '30 days unlimited access',
      'ALL modules, lessons & video lectures',
      'UNLIMITED official 20-question mock exams',
      'UNLIMITED question bank access (650+ questions)',
      'Detailed exam readiness score',
      'Priority WhatsApp teacher assistance',
      'Guaranteed first-time pass preparation',
    ],
    featuresRw: [
      'Kwinjira ku rubuga nta mupaka mu minsi 30',
      'Amasomo n’amashusho yose y’umwarimu',
      'Ibizamini by’igerageza bitagira umupaka',
      'Ibibazo byose 650+ nta mupaka',
      'Kureba ikizere cyo gutsinda',
      'Ubufasha bw’umwarimu kuri WhatsApp',
      'Kwitegura gutsindira ku nshuro ya mbere',
    ],
    limits: {
      maxLessons: Infinity,
      maxMockExams: Infinity,
      maxExercises: Infinity,
      offlineAccess: true,
      prioritySupport: true,
    },
    popular: true,
  },
};

export const paymentInfo = {
  phone: '0784227283',
  formattedPhone: '0784 227 283',
  internationalPhone: '+250784227283',
  name: 'URUGENDO LTD',
  mtnUssd: '*182*1*1*0784227283#',
  airtelUssd: '*182*1*2*0784227283#',
  whatsappNumber: '250784227283',
  whatsappSupportNumber: '250784227283',
};

export const paymentInstructions = paymentInfo;


