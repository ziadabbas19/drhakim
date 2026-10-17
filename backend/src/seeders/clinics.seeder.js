import { Clinic, ClinicSchedule } from '../models/index.js';
import { seedIfEmpty } from './seedHelpers.js';

const DAYS = Object.freeze({ SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, SATURDAY: 6 });

const mapSearchUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const weekly = (days, ranges) =>
  days.flatMap((dayOfWeek) => ranges.map(([startTime, endTime]) => ({ dayOfWeek, startTime, endTime })));

const clinics = [
  {
    name: 'عيادة السنطة',
    city: 'السنطة - الغربية',
    address: 'شارع المحطة، أعلى صيدلية الشفاء، الدور الأول، السنطة',
    phone: '0403461275',
    mapUrl: mapSearchUrl('السنطة، الغربية، مصر'),
    slotDurationMinutes: 20,
    sortOrder: 1,
    schedules: weekly([DAYS.SATURDAY, DAYS.MONDAY, DAYS.WEDNESDAY], [['16:00', '21:00']]),
  },
  {
    name: 'عيادة القاهرة',
    city: 'القاهرة',
    address: '24 شارع مكرم عبيد، مدينة نصر، الدور الثالث، القاهرة',
    phone: '0224017733',
    mapUrl: mapSearchUrl('شارع مكرم عبيد، مدينة نصر، القاهرة'),
    slotDurationMinutes: 30,
    sortOrder: 2,
    schedules: [
      ...weekly(
        [DAYS.SUNDAY, DAYS.TUESDAY],
        [
          ['12:00', '15:00'],
          ['18:00', '22:00'],
        ],
      ),
      ...weekly([DAYS.THURSDAY], [['13:00', '18:00']]),
    ],
  },
];

const createClinic = async ({ schedules, ...clinic }, transaction) => {
  const { id } = await Clinic.create(clinic, { transaction });
  await ClinicSchedule.bulkCreate(
    schedules.map((range) => ({ ...range, clinicId: id })),
    { transaction },
  );
};

export const seedClinics = () => seedIfEmpty(Clinic, clinics, createClinic);
