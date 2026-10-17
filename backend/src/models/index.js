import { sequelize } from '../config/database.js';
import { Booking } from './booking.model.js';
import { Clinic } from './clinic.model.js';
import { ClinicDayOff } from './clinicDayOff.model.js';
import { ClinicSchedule } from './clinicSchedule.model.js';
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

export { sequelize, Booking, Clinic, ClinicDayOff, ClinicSchedule, Service, SiteSetting, User };
