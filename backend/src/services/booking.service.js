import { Op, UniqueConstraintError } from 'sequelize';
import { UNIQUE_CONSTRAINTS } from '../config/constants.js';
import { Booking } from '../models/index.js';
import { createReferenceCode } from '../utils/referenceCode.js';
import { containsText } from '../utils/search.js';
import { assertSlotAvailable } from './availability.service.js';
import { createCrudService } from './crud.service.js';

const MAX_REFERENCE_ATTEMPTS = 3;

const clinicSummary = {
  association: 'clinic',
  attributes: ['id', 'nameAr', 'nameEn', 'cityAr', 'cityEn', 'addressAr', 'addressEn', 'phone', 'mapUrl'],
};

const buildBookingFilters = ({ clinicId, date, status, search }) => {
  const contains = search && containsText(search);
  return {
    ...(clinicId && { clinicId }),
    ...(date && { date }),
    ...(status && { status }),
    ...(contains && {
      [Op.or]: [{ referenceCode: contains }, { patientName: contains }, { phone: contains }],
    }),
  };
};

const isReferenceCollision = (error) =>
  error instanceof UniqueConstraintError && error.parent?.constraint === UNIQUE_CONSTRAINTS.BOOKING_REFERENCE;

const insertWithUniqueReference = async (data, attempt = 1) => {
  try {
    return await Booking.create({ ...data, referenceCode: createReferenceCode() });
  } catch (error) {
    if (attempt < MAX_REFERENCE_ATTEMPTS && isReferenceCollision(error)) {
      return insertWithUniqueReference(data, attempt + 1);
    }
    throw error;
  }
};

const crud = createCrudService(Booking, {
  include: [clinicSummary],
  order: [
    ['date', 'DESC'],
    ['time', 'ASC'],
  ],
  buildWhere: buildBookingFilters,
});

export const bookingService = {
  ...crud,

  async create(data) {
    await assertSlotAvailable(data.clinicId, data.date, data.time);
    const booking = await insertWithUniqueReference(data);
    return crud.findById(booking.id);
  },
};
