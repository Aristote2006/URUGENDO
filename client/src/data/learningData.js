/**
 * Learning curriculum data for Urugendo.
 * Structured by Courses -> Modules -> Lessons.
 * Lessons are prepared by certified road safety instructors.
 */

export const learningCurriculum = [
  {
    id: 'mod-1',
    moduleNumber: 1,
    title: 'General Provisions & Road Definitions',
    titleRw: 'Amategeko Rusange n’Ibisobanuro by’Imihanda',
    description: 'Master fundamental legal definitions, user categories, and road hierarchy under Rwandan traffic law.',
    descriptionRw: 'Sobanukirwa amategeko y’ibanze, ibyiciro by’abayikoresha, n’imiterere y’imihanda mu Rwanda.',
    totalDuration: '55 mins',
    lessons: [
      {
        id: 'les-1',
        lessonNumber: 1,
        title: 'Introduction to Rwandan Highway Code',
        titleRw: 'Intangiriro ku Mategeko y’Umuhanda mu Rwanda',
        teacher: 'Certified Road Safety Instructor',
        teacherRw: 'Umwarimu wemewe w’Amategeko y’Umuhanda',
        duration: '14 mins',
        durationMinutes: 14,
        videoUrl: 'https://player.vimeo.com/video/824804225',
        thumbnail: '/images/logo1.png',
        objectives: [
          'Understand the hierarchy of Rwandan traffic authorities',
          'Learn the legal definition of public roadway, roadway users, and vehicles',
          'Identify the general obligations of drivers toward pedestrians',
        ],
        objectivesRw: [
          'Gusobanukirwa inzego zishinzwe umutekano wo mu muhanda',
          'Kumenya ibisobanuro by’inzira nyabagendwa n’abayikoresha',
          'Kumenya inshingano z’umushoferi ku banyamaguru',
        ],
        notes:
          'Under Article 3 of the Presidential Decree, any person using a public road must behave in such a way as not to endanger or impede traffic. Traffic police signals take precedence over road signs and traffic lights.',
      },
      {
        id: 'les-2',
        lessonNumber: 2,
        title: 'Road Users, Lanes & Position on the Road',
        titleRw: 'Abakoresha Umuhanda, Ibyerekezo n’Aho Ugomba Kugendera',
        teacher: 'Certified Road Safety Instructor',
        teacherRw: 'Umwarimu wemewe w’Amategeko y’Umuhanda',
        duration: '18 mins',
        durationMinutes: 18,
        videoUrl: 'https://player.vimeo.com/video/824804225',
        thumbnail: '/images/logo1.png',
        objectives: [
          'Learn lane discipline and why vehicles must stay on the right side',
          'Understand special provisions for cycles, motorcycles, and animal-drawn transport',
          'Safely handle bus lanes and emergency vehicle corridors',
        ],
        objectivesRw: [
          'Kumenya kugendera mu ruhande rw’iburyo',
          'Amabwiriza agenga amagare, moto n’ibinyabiziga bitwara abagenzi',
          'Uko witwara iyo ubonye imbangukiragutabara cyangwa imodoka ya polisi',
        ],
        notes:
          'Drivers must keep as close as possible to the right edge of the roadway. When changing lanes or turning, signaling with indicators is mandatory at least 50 meters prior.',
      },
      {
        id: 'les-3',
        lessonNumber: 3,
        title: 'Pedestrian Crossings & Sidewalk Priorities',
        titleRw: 'Ahabanyamaguru n’Uburenganzira bwabo',
        teacher: 'Certified Road Safety Instructor',
        teacherRw: 'Umwarimu wemewe w’Amategeko y’Umuhanda',
        duration: '12 mins',
        durationMinutes: 12,
        videoUrl: 'https://player.vimeo.com/video/824804225',
        thumbnail: '/images/logo1.png',
        objectives: [
          'Understand pedestrian right of way at zebra crossings',
          'Approaching schools, hospitals, and busy commercial avenues',
          'Rules for blind pedestrians using white canes',
        ],
        objectivesRw: [
          'Uburenganzira bw’abanyamaguru mu mirongo y’umweru (zebra crossing)',
          'Uko ugenda ahari ibitaro, amashuri n’amasoko',
          'Kubahiriza abanyamaguru bafite ubumuga',
        ],
        notes:
          'Pedestrians on zebra crossings have absolute priority. Drivers must decelerate when approaching a pedestrian crossing even when no pedestrian is immediately visible.',
      },
    ],
  },
  {
    id: 'mod-2',
    moduleNumber: 2,
    title: 'Road Signs, Signals & Pavement Markings',
    titleRw: 'Ibyapa, Ibimenyetso n’Imirongo yo mu Muhanda',
    description: 'Comprehensive recognition of regulatory, danger warning, mandatory, and informative road signs.',
    descriptionRw: 'Kumenya ibyapa biburira, ibitegeka, ibibuza, n’ibimenyetso byose byo mu muhanda.',
    totalDuration: '1 hr 10 mins',
    lessons: [
      {
        id: 'les-4',
        lessonNumber: 4,
        title: 'Danger Warning Signs (Ibyapa Biburira)',
        titleRw: 'Ibyapa Biburira Ibiteje Akaga',
        teacher: 'Certified Road Safety Instructor',
        teacherRw: 'Umwarimu wemewe w’Amategeko y’Umuhanda',
        duration: '22 mins',
        durationMinutes: 22,
        videoUrl: 'https://player.vimeo.com/video/824804225',
        thumbnail: '/images/logo1.png',
        objectives: [
          'Identify triangular danger warning signs and their red borders',
          'Calculate warning distance: 150m outside urban areas vs 50m in towns',
          'Sharp bends, narrow bridges, slippery roads, and speed bumps',
        ],
        objectivesRw: [
          'Kumenya ibyapa by’imfuruka eshatu birimo umutuku',
          'Intera icyapa gishyirwaho: metero 150 hanze y’umugi, metero 50 mu mugi',
          'Amakona akomeye, ibiraro bifunganye, n’umuhanda unyerera',
        ],
        notes:
          'Warning signs give advance notice of dangerous sections ahead. Distance outside built-up areas is 150-200m; in built-up areas, 50m.',
      },
      {
        id: 'les-5',
        lessonNumber: 5,
        title: 'Prohibitory & Restrictive Signs (Ibyapa Bibuza)',
        titleRw: 'Ibyapa Bibuza n’Ibishingiye ku Mabwiriza',
        teacher: 'Certified Road Safety Instructor',
        teacherRw: 'Umwarimu wemewe w’Amategeko y’Umuhanda',
        duration: '25 mins',
        durationMinutes: 25,
        videoUrl: 'https://player.vimeo.com/video/824804225',
        thumbnail: '/images/logo1.png',
        objectives: [
          'Recognize circular red-bordered signs that prohibit specific actions',
          'No overtaking, speed limit prohibitions, and no entry signs',
          'End of prohibition signs and valid zones',
        ],
        objectivesRw: [
          'Kumenya ibyapa by’uruziga bifite umutuku bibuza ikintu',
          'Icyapa kibuza kunyuranaho, icy’umuvuduko fatizo n’icyo kutinjira',
          'Icyapa kirangiza ibyari bibujijwe',
        ],
        notes:
          'Circular signs with a red border impose prohibitions from the point where they are placed until the next intersection or an end-of-prohibition sign.',
      },
      {
        id: 'les-6',
        lessonNumber: 6,
        title: 'Mandatory & Priority Signs (Ibyapa Bitegeka n’Iby’Ubutambike)',
        titleRw: 'Ibyapa Bitegeka n’Iby’Uburenganzira bwo Gutambuka',
        teacher: 'Certified Road Safety Instructor',
        teacherRw: 'Umwarimu wemewe w’Amategeko y’Umuhanda',
        duration: '20 mins',
        durationMinutes: 20,
        videoUrl: 'https://player.vimeo.com/video/824804225',
        thumbnail: '/images/logo1.png',
        objectives: [
          'Circular blue signs indicating mandatory directions and speeds',
          'STOP sign regulations and full vehicle immobilization rules',
          'Yield (Give Way) upside-down triangle mechanics',
        ],
        objectivesRw: [
          'Ibyapa by’uruziga rw’ubururu bitegeka icyerekezo cyangwa umuvuduko',
          'Icyapa cya STOP no guhagarara burundu mbere yo gukomeza',
          'Icyapa cy’umutwe ucuritse cyo guha inzira abandi (Yield)',
        ],
        notes:
          'At a STOP sign, the driver MUST bring the vehicle to a complete standstill before the white stopping line, regardless of whether other vehicles are present.',
      },
    ],
  },
  {
    id: 'mod-3',
    moduleNumber: 3,
    title: 'Right of Way, Intersections & Roundabouts',
    titleRw: 'Uburenganzira bwo Gutambuka, Amasangano na Round-Points',
    description: 'Learn the golden rule of priority to the right, roundabout navigation, and traffic police gestures.',
    descriptionRw: 'Kumenya uburenganzira bw’iburyo, uko unyura muri round-point, n’ibimenyetso by’abapolisi.',
    totalDuration: '50 mins',
    lessons: [
      {
        id: 'les-7',
        lessonNumber: 7,
        title: 'Priority to the Right (Uburenganzira bw’Iburyo)',
        titleRw: 'Itegeko ry’Iburyo mu Masangano',
        teacher: 'Certified Road Safety Instructor',
        teacherRw: 'Umwarimu wemewe w’Amategeko y’Umuhanda',
        duration: '24 mins',
        durationMinutes: 24,
        videoUrl: 'https://player.vimeo.com/video/824804225',
        thumbnail: '/images/logo1.png',
        objectives: [
          'Apply the standard default rule when no traffic signals or signs are present',
          'Exceptions to priority to the right (paved roads vs unpaved dirt tracks)',
          'Emergency priority vehicles (Police, Firefighters, Ambulances)',
        ],
        objectivesRw: [
          'Gukurikiza itegeko ry’iburyo iyo nta cyapa kiharaye',
          'Ibitandukanye n’iri tegeko: umuhanda wa kaburimbo n’uw’ibitaka',
          'Ibinyabiziga bitambuka mbere (Imbangukiragutabara, Polisi, Kizimyamwoto)',
        ],
        notes:
          'In the absence of traffic signs, signals, or police officers, any driver approaching an intersection must give way to vehicles approaching from the right.',
      },
      {
        id: 'les-8',
        lessonNumber: 8,
        title: 'Roundabout Navigation & Lane Positioning',
        titleRw: 'Uko Unyura muri Round-Points',
        teacher: 'Certified Road Safety Instructor',
        teacherRw: 'Umwarimu wemewe w’Amategeko y’Umuhanda',
        duration: '26 mins',
        durationMinutes: 26,
        videoUrl: 'https://player.vimeo.com/video/824804225',
        thumbnail: '/images/logo1.png',
        objectives: [
          'Who has priority in a roundabout (traffic already circulating)',
          'Choosing the correct approach lane when turning right, going straight, or turning left',
          'Proper indicator usage upon entry and exit',
        ],
        objectivesRw: [
          'Ufite uburenganzira muri round-point (uri imbere muri round-point)',
          'Guhitamo umwanya mwiza ku muhanda bitewe n’aho ugiye',
          'Gukoresha ibyerekezo (clignotants) winjira n’usohoka',
        ],
        notes:
          'Vehicles already in the roundabout have priority over vehicles entering. Always indicate right just after passing the exit preceding the one you intend to take.',
      },
    ],
  },
];

