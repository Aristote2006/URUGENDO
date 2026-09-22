import { Lesson } from '../models/Lesson.js';

export const seedLessons = async () => {
  try {
    const count = await Lesson.countDocuments();
    if (count > 0) {
      return; // Lessons already exist
    }

    const defaultLessons = [
      {
        lessonNumber: 1,
        title: {
          en: 'Introduction to Rwandan Highway Code',
          rw: 'Intangiriro ku Mategeko y’Umuhanda mu Rwanda',
        },
        summary: {
          en: 'Hierarchy of traffic authorities, legal definitions of roadways, and driver obligations.',
          rw: 'Inzego zishinzwe umutekano wo mu muhanda, ibisobanuro by’inzira nyabagendwa, n’inshingano z’umushoferi.',
        },
        vimeoUrl: 'https://vimeo.com/824804225',
        vimeoVideoId: '824804225',
        durationSeconds: 840, // 14 mins
        thumbnailUrl: '',
        moduleNumber: 1,
        moduleTitle: {
          en: 'General Provisions & Road Definitions',
          rw: 'Amategeko Rusange n’Ibisobanuro by’Imihanda',
        },
        objectives: {
          en: [
            'Understand the hierarchy of Rwandan traffic authorities',
            'Learn the legal definition of public roadway, roadway users, and vehicles',
            'Identify the general obligations of drivers toward pedestrians',
          ],
          rw: [
            'Gusobanukirwa inzego zishinzwe umutekano wo mu muhanda',
            'Kumenya ibisobanuro by’inzira nyabagendwa n’abayikoresha',
            'Kumenya inshingano z’umushoferi ku banyamaguru',
          ],
        },
        notes: {
          en: 'Under Article 3 of the Presidential Decree, any person using a public road must behave in such a way as not to endanger or impede traffic. Traffic police signals take precedence over road signs and traffic lights.',
          rw: 'Mu ngingo ya 3 y’Iteka rya Perezida, umuntu wese ukoresha inzira nyabagendwa agomba kwitwararika ku buryo adateza akaga cyangwa ngo abangamire urujya n’uruza.',
        },
        order: 1,
        isPublished: true,
      },
      {
        lessonNumber: 2,
        title: {
          en: 'Road Users, Lanes & Position on the Road',
          rw: 'Abakoresha Umuhanda, Ibyerekezo n’Aho Ugomba Kugendera',
        },
        summary: {
          en: 'Rules governing vehicle positioning on the right, lane discipline, and emergency corridors.',
          rw: 'Amabwiriza yo kugendera mu ruhande rw’iburyo, gukoresha ibisate by’umuhanda, no gutambuka kw’imbangukiragutabara.',
        },
        vimeoUrl: 'https://vimeo.com/824804225',
        vimeoVideoId: '824804225',
        durationSeconds: 1080, // 18 mins
        thumbnailUrl: '',
        moduleNumber: 1,
        moduleTitle: {
          en: 'General Provisions & Road Definitions',
          rw: 'Amategeko Rusange n’Ibisobanuro by’Imihanda',
        },
        objectives: {
          en: [
            'Learn lane discipline and why vehicles must stay on the right side',
            'Understand special provisions for cycles, motorcycles, and animal-drawn transport',
            'Safely handle bus lanes and emergency vehicle corridors',
          ],
          rw: [
            'Kumenya kugendera mu ruhande rw’iburyo',
            'Amabwiriza agenga amagare, moto n’ibinyabiziga bitwara abagenzi',
            'Uko witwara iyo ubonye imbangukiragutabara cyangwa imodoka ya polisi',
          ],
        },
        notes: {
          en: 'Drivers must keep as close as possible to the right edge of the roadway. When changing lanes or turning, signaling with indicators is mandatory at least 50 meters prior.',
          rw: 'Umushoferi agomba kugendera hafi bishoboka y’inkengero y’iburyo y’umuhanda. Guhindura icyerekezo bisaba gucana clignotant muri metero nibura 50 mbere.',
        },
        order: 2,
        isPublished: true,
      },
      {
        lessonNumber: 3,
        title: {
          en: 'Pedestrian Crossings & Sidewalk Priorities',
          rw: 'Ahabanyamaguru n’Uburenganzira bwabo',
        },
        summary: {
          en: 'Absolute pedestrian priority at zebra crossings, safety near schools, and vulnerable road users.',
          rw: 'Uburenganzira budasubirwaho bw’abanyamaguru mu mirongo y’umweru, ahegereye amashuri, n’abafite ubumuga.',
        },
        vimeoUrl: 'https://vimeo.com/824804225',
        vimeoVideoId: '824804225',
        durationSeconds: 720, // 12 mins
        thumbnailUrl: '',
        moduleNumber: 1,
        moduleTitle: {
          en: 'General Provisions & Road Definitions',
          rw: 'Amategeko Rusange n’Ibisobanuro by’Imihanda',
        },
        objectives: {
          en: [
            'Understand pedestrian right of way at zebra crossings',
            'Approaching schools, hospitals, and busy commercial avenues',
            'Rules for blind pedestrians using white canes',
          ],
          rw: [
            'Uburenganzira bw’abanyamaguru mu mirongo y’umweru (zebra crossing)',
            'Uko ugenda ahari ibitaro, amashuri n’amasoko',
            'Kubahiriza abanyamaguru bafite ubumuga',
          ],
        },
        notes: {
          en: 'Pedestrians on zebra crossings have absolute priority. Drivers must decelerate when approaching a pedestrian crossing even when no pedestrian is immediately visible.',
          rw: 'Abanyamaguru bari mu mirongo y’umweru bafite uburenganzira bwuzuye bwo gutambuka mbere.',
        },
        order: 3,
        isPublished: true,
      },
      {
        lessonNumber: 4,
        title: {
          en: 'Danger Warning Signs (Ibyapa Biburira)',
          rw: 'Ibyapa Biburira Ibiteje Akaga',
        },
        summary: {
          en: 'Identification, shape, color codes, and warning distances for triangular danger warning signs.',
          rw: 'Kumenya imiterere, amabara, n’intera y’aho ibyapa by’imfuruka eshatu biburira bishyirwa.',
        },
        vimeoUrl: 'https://vimeo.com/824804225',
        vimeoVideoId: '824804225',
        durationSeconds: 1320, // 22 mins
        thumbnailUrl: '',
        moduleNumber: 2,
        moduleTitle: {
          en: 'Road Signs, Signals & Pavement Markings',
          rw: 'Ibyapa, Ibimenyetso n’Imirongo yo mu Muhanda',
        },
        objectives: {
          en: [
            'Identify triangular danger warning signs and their red borders',
            'Calculate warning distance: 150m outside urban areas vs 50m in towns',
            'Sharp bends, narrow bridges, slippery roads, and speed bumps',
          ],
          rw: [
            'Kumenya ibyapa by’imfuruka eshatu birimo umutuku',
            'Intera icyapa gishyirwaho: metero 150 hanze y’umugi, metero 50 mu mugi',
            'Amakona akomeye, ibiraro bifunganye, n’umuhanda unyerera',
          ],
        },
        notes: {
          en: 'Warning signs give advance notice of dangerous sections ahead. Distance outside built-up areas is 150-200m; in built-up areas, 50m.',
          rw: 'Ibyapa biburira bitanga integuza y’aho akaga kari. Bishyirwa muri metero 150 kugeza kuri 200 hanze y’umujyi, na metero 50 mu mujyi.',
        },
        order: 4,
        isPublished: true,
      },
      {
        lessonNumber: 5,
        title: {
          en: 'Prohibitory & Restrictive Signs (Ibyapa Bibuza)',
          rw: 'Ibyapa Bibuza n’Ibishingiye ku Mabwiriza',
        },
        summary: {
          en: 'Circular red signs imposing legal prohibitions, speed limits, no overtaking, and end zones.',
          rw: 'Ibyapa by’uruziga rw’umutuku bibuza, imipaka y’umuvuduko, kubuza kunyuranaho, n’iherezo ryabyo.',
        },
        vimeoUrl: 'https://vimeo.com/824804225',
        vimeoVideoId: '824804225',
        durationSeconds: 1500, // 25 mins
        thumbnailUrl: '',
        moduleNumber: 2,
        moduleTitle: {
          en: 'Road Signs, Signals & Pavement Markings',
          rw: 'Ibyapa, Ibimenyetso n’Imirongo yo mu Muhanda',
        },
        objectives: {
          en: [
            'Recognize circular red-bordered signs that prohibit specific actions',
            'No overtaking, speed limit prohibitions, and no entry signs',
            'End of prohibition signs and valid zones',
          ],
          rw: [
            'Kumenya ibyapa by’uruziga bifite umutuku bibuza ikintu',
            'Icyapa kibuza kunyuranaho, icy’umuvuduko fatizo n’icyo kutinjira',
            'Icyapa kirangiza ibyari bibujijwe',
          ],
        },
        notes: {
          en: 'Circular signs with a red border impose prohibitions from the point where they are placed until the next intersection or an end-of-prohibition sign.',
          rw: 'Ibyapa by’uruziga bifite umutuku bitegeka guhagarika ibibuzwa guhera aho bishyizwe kugeza ku masangano akurikira cyangwa icyapa cy’iherezo.',
        },
        order: 5,
        isPublished: true,
      },
      {
        lessonNumber: 6,
        title: {
          en: 'Mandatory & Priority Signs (Ibyapa Bitegeka n’Iby’Ubutambike)',
          rw: 'Ibyapa Bitegeka n’Iby’Uburenganzira bwo Gutambuka',
        },
        summary: {
          en: 'Circular blue mandatory signs, complete vehicle stop procedures at STOP signs, and Yield mechanics.',
          rw: 'Ibyapa by’ubururu bitegeka, amategeko ya STOP yo guhagarara burundu, no guha inzira abandi.',
        },
        vimeoUrl: 'https://vimeo.com/824804225',
        vimeoVideoId: '824804225',
        durationSeconds: 1200, // 20 mins
        thumbnailUrl: '',
        moduleNumber: 2,
        moduleTitle: {
          en: 'Road Signs, Signals & Pavement Markings',
          rw: 'Ibyapa, Ibimenyetso n’Imirongo yo mu Muhanda',
        },
        objectives: {
          en: [
            'Circular blue signs indicating mandatory directions and speeds',
            'STOP sign regulations and full vehicle immobilization rules',
            'Yield (Give Way) upside-down triangle mechanics',
          ],
          rw: [
            'Ibyapa by’uruziga rw’ubururu bitegeka icyerekezo cyangwa umuvuduko',
            'Icyapa cya STOP no guhagarara burundu mbere yo gukomeza',
            'Icyapa cy’umutwe ucuritse cyo guha inzira abandi (Yield)',
          ],
        },
        notes: {
          en: 'At a STOP sign, the driver MUST bring the vehicle to a complete standstill before the white stopping line, regardless of whether other vehicles are present.',
          rw: 'Ku cyapa cya STOP, umushoferi agomba guhagarika ikinyabiziga burundu mbere y’umurongo w’umweru uhagarara niyo nta kindi kinyabiziga cyaba gihari.',
        },
        order: 6,
        isPublished: true,
      },
      {
        lessonNumber: 7,
        title: {
          en: 'Priority to the Right (Uburenganzira bw’Iburyo)',
          rw: 'Itegeko ry’Iburyo mu Masangano',
        },
        summary: {
          en: 'The universal priority to the right rule, intersection navigation, and legal exceptions.',
          rw: 'Itegeko ry’ibanze ryo gutambuka kw’iburyo mu masangano n’aho iri tegeko ritubahirizwa.',
        },
        vimeoUrl: 'https://vimeo.com/824804225',
        vimeoVideoId: '824804225',
        durationSeconds: 1440, // 24 mins
        thumbnailUrl: '',
        moduleNumber: 3,
        moduleTitle: {
          en: 'Right of Way, Intersections & Roundabouts',
          rw: 'Uburenganzira bwo Gutambuka, Amasangano na Round-Points',
        },
        objectives: {
          en: [
            'Apply the standard default rule when no traffic signals or signs are present',
            'Exceptions to priority to the right (paved roads vs unpaved dirt tracks)',
            'Emergency priority vehicles (Police, Firefighters, Ambulances)',
          ],
          rw: [
            'Gukurikiza itegeko ry’iburyo iyo nta cyapa kiharaye',
            'Ibitandukanye n’iri tegeko: umuhanda wa kaburimbo n’uw’ibitaka',
            'Ibinyabiziga bitambuka mbere (Imbangukiragutabara, Polisi, Kizimyamwoto)',
          ],
        },
        notes: {
          en: 'In the absence of traffic signs, signals, or police officers, any driver approaching an intersection must give way to vehicles approaching from the right.',
          rw: 'Iyo nta byapa, ibimenyetso by’amatara cyangwa umupolisi biri mu masangano, umushoferi wese agomba guha inzira ikinyabiziga giturutse iburyo bwe.',
        },
        order: 7,
        isPublished: true,
      },
      {
        lessonNumber: 8,
        title: {
          en: 'Roundabout Navigation & Lane Positioning',
          rw: 'Uko Unyura muri Round-Points',
        },
        summary: {
          en: 'Correct roundabout entry priority, inner vs outer lane positioning, and indicator protocols.',
          rw: 'Uburenganzira bwo kwinjira muri round-point, gukoresha ibisate by’imbere n’iby’inyuma, no gukoresha clignotants.',
        },
        vimeoUrl: 'https://vimeo.com/824804225',
        vimeoVideoId: '824804225',
        durationSeconds: 1560, // 26 mins
        thumbnailUrl: '',
        moduleNumber: 3,
        moduleTitle: {
          en: 'Right of Way, Intersections & Roundabouts',
          rw: 'Uburenganzira bwo Gutambuka, Amasangano na Round-Points',
        },
        objectives: {
          en: [
            'Who has priority in a roundabout (traffic already circulating)',
            'Choosing the correct approach lane when turning right, going straight, or turning left',
            'Proper indicator usage upon entry and exit',
          ],
          rw: [
            'Ufite uburenganzira muri round-point (uri imbere muri round-point)',
            'Guhitamo umwanya mwiza ku muhanda bitewe n’aho ugiye',
            'Gukoresha ibyerekezo (clignotants) winjira n’usohoka',
          ],
        },
        notes: {
          en: 'Vehicles already in the roundabout have priority over vehicles entering. Always indicate right just after passing the exit preceding the one you intend to take.',
          rw: 'Ibinyabiziga biri muri round-point bifite uburenganzira mbere y’ibinjira. Buri gihe cana clignotant y’iburyo hejuru yo kurenga icyerekezo kibanziriza icyo ushaka gusohokeramo.',
        },
        order: 8,
        isPublished: true,
      },
    ];

    await Lesson.insertMany(defaultLessons);
    console.log('[Lesson Seed] Successfully populated 8 Highway Code video lessons into MongoDB.');
  } catch (error) {
    console.error(`[Lesson Seed] Error: ${error.message}`);
  }
};

export default seedLessons;

