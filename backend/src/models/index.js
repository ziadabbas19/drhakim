import { sequelize } from '../config/database.js';
import { AboutItem } from './aboutItem.model.js';
import { Booking } from './booking.model.js';
import { Clinic } from './clinic.model.js';
import { ClinicDayOff } from './clinicDayOff.model.js';
import { ClinicSchedule } from './clinicSchedule.model.js';
import { Media } from './media.model.js';
import { MediaLink } from './mediaLink.model.js';
import { Review } from './review.model.js';
import { Service } from './service.model.js';
import { SiteSetting } from './siteSetting.model.js';
import { User } from './user.model.js';

const clinicChildren = [
  [ClinicSchedule, 'schedules'],
  [ClinicDayOff, 'daysOff'],
  [Booking, 'bookings'],
];

for (const [ChildModel, alias] of clinicChildren) {
  Clinic.hasMany(ChildModel, { as: alias, foreignKey: 'clinicId' });
  ChildModel.belongsTo(Clinic, { as: 'clinic', foreignKey: 'clinicId' });
}

Media.hasMany(MediaLink, { as: 'links', foreignKey: 'mediaId' });
MediaLink.belongsTo(Media, { as: 'media', foreignKey: 'mediaId' });

Review.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewedBy' });

export {
  sequelize,
  AboutItem,
  Booking,
  Clinic,
  ClinicDayOff,
  ClinicSchedule,
  Media,
  MediaLink,
  Review,
  Service,
  SiteSetting,
  User,
};
