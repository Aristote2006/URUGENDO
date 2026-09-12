/**
 * Learning Management Foundation Controller (Phase 1)
 * Provides curriculum summary and lesson metadata foundation for administrative overview.
 */

export const getLearningOverview = async (req, res, next) => {
  try {
    // Standard structured curriculum modules foundation
    const modules = [
      {
        id: 'mod-1',
        titleEn: 'Module 1: General Traffic Rules & Fundamentals',
        titleRw: 'Igice cya 1: Amategeko Rusange n’Iby’ibanze by’Umuhanda',
        category: 'Traffic Rules',
        lessonsCount: 3,
        instructor: 'Insp. Jean Claude Ndahiro',
        published: true,
        lessons: [
          {
            id: 'les-1',
            titleEn: 'Introduction to Rwandan Road Regulations & Hierarchy of Signs',
            duration: '14 min',
            published: true,
          },
          {
            id: 'les-2',
            titleEn: 'Vehicle Positioning, Lanes, and Road Markings',
            duration: '18 min',
            published: true,
          },
          {
            id: 'les-3',
            titleEn: 'Right of Way and Junction Priorities',
            duration: '22 min',
            published: true,
          },
        ],
      },
      {
        id: 'mod-2',
        titleEn: 'Module 2: Road Signs, Signals & Police Hand Signals',
        titleRw: 'Igice cya 2: Ibyapa, Ibimenyetso n’Amaboko ya Polisi',
        category: 'Road Signs',
        lessonsCount: 3,
        instructor: 'Aline Umutoni (Senior Driving Specialist)',
        published: true,
        lessons: [
          {
            id: 'les-4',
            titleEn: 'Danger Warning Signs (Ibyapa Biburira)',
            duration: '20 min',
            published: true,
          },
          {
            id: 'les-5',
            titleEn: 'Prohibitory & Mandatory Signs (Ibibuza n’Ibitegeka)',
            duration: '25 min',
            published: true,
          },
          {
            id: 'les-6',
            titleEn: 'Traffic Light Signals and Officer Directives',
            duration: '15 min',
            published: true,
          },
        ],
      },
      {
        id: 'mod-3',
        titleEn: 'Module 3: Speed Regulations, Overtaking & Legal Penalties',
        titleRw: 'Igice cya 3: Umuvuduko, Kunyuranaho n’Ibihano by’Amande',
        category: 'Safety & Penalties',
        lessonsCount: 2,
        instructor: 'Insp. Jean Claude Ndahiro',
        published: true,
        lessons: [
          {
            id: 'les-7',
            titleEn: 'Speed Limits in Built-up Areas & Highways',
            duration: '17 min',
            published: true,
          },
          {
            id: 'les-8',
            titleEn: 'Fines, Demerit Points, and Emergency Conduct',
            duration: '19 min',
            published: true,
          },
        ],
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        totalModules: modules.length,
        totalLessons: modules.reduce((acc, m) => acc + m.lessons.length, 0),
        publishedLessons: modules.reduce((acc, m) => acc + m.lessons.filter((l) => l.published).length, 0),
        modules,
      },
    });
  } catch (error) {
    next(error);
  }
};

