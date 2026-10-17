import { buildColumnHelpers, createTableWith } from './helpers/columns.js';

const TABLES_IN_DROP_ORDER = [
  'users',
  'bookings',
  'site_settings',
  'services',
  'clinic_days_off',
  'clinic_schedules',
  'clinics',
];

const ENUM_TYPES = ['enum_users_role', 'enum_bookings_status', 'enum_clinic_days_off_reason'];

export async function up(queryInterface, Sequelize) {
  const column = buildColumnHelpers(Sequelize);
  const { Op } = Sequelize;

  await queryInterface.sequelize.transaction(async (transaction) => {
    const createTable = createTableWith(queryInterface, column, transaction);
    const runSql = (sql) => queryInterface.sequelize.query(sql, { transaction });

    await createTable('clinics', {
      name: column.text(100),
      city: column.text(60),
      address: column.text(255),
      phone: column.text(20),
      map_url: column.text(500, true),
      slot_duration_minutes: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 20 },
      is_active: column.flag(true),
      sort_order: column.sortOrder,
    });
    await runSql('ALTER TABLE clinics ADD CONSTRAINT clinics_slot_duration_check CHECK (slot_duration_minutes > 0)');

    await createTable('clinic_schedules', {
      clinic_id: column.clinicReference('CASCADE'),
      day_of_week: { type: Sequelize.SMALLINT, allowNull: false },
      start_time: column.time,
      end_time: column.time,
    });
    await runSql(
      'ALTER TABLE clinic_schedules ADD CONSTRAINT clinic_schedules_day_check CHECK (day_of_week BETWEEN 0 AND 6)',
    );
    await runSql(
      'ALTER TABLE clinic_schedules ADD CONSTRAINT clinic_schedules_time_order_check CHECK (start_time < end_time)',
    );
    await queryInterface.addIndex('clinic_schedules', ['clinic_id', 'day_of_week'], { transaction });

    await createTable('clinic_days_off', {
      clinic_id: column.clinicReference('CASCADE'),
      date: column.date,
      reason: { type: Sequelize.ENUM('vacation', 'surgery', 'holiday'), allowNull: false },
    });
    await queryInterface.addConstraint('clinic_days_off', {
      type: 'unique',
      name: 'clinic_days_off_date_unique',
      fields: ['clinic_id', 'date'],
      transaction,
    });

    await createTable('services', {
      title: column.text(100),
      description: { type: Sequelize.TEXT, allowNull: false },
      icon: column.text(40),
      is_featured: column.flag(false),
      is_active: column.flag(true),
      sort_order: column.sortOrder,
    });

    await createTable('site_settings', {
      key: column.text(60),
      value: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
    });
    await queryInterface.addConstraint('site_settings', {
      type: 'unique',
      name: 'site_settings_key_unique',
      fields: ['key'],
      transaction,
    });

    await createTable('bookings', {
      reference_code: column.text(12),
      clinic_id: column.clinicReference('RESTRICT'),
      date: column.date,
      time: column.time,
      patient_name: column.text(100),
      phone: column.text(20),
      age: { type: Sequelize.SMALLINT, allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
      },
    });
    await queryInterface.addConstraint('bookings', {
      type: 'unique',
      name: 'bookings_reference_code_unique',
      fields: ['reference_code'],
      transaction,
    });
    await queryInterface.addIndex('bookings', ['clinic_id', 'date', 'time'], {
      name: 'bookings_slot_unique',
      unique: true,
      where: { status: { [Op.ne]: 'cancelled' } },
      transaction,
    });
    await queryInterface.addIndex('bookings', ['date'], { transaction });
    await queryInterface.addIndex('bookings', ['status'], { transaction });

    await createTable('users', {
      email: column.text(255),
      full_name: column.text(100),
      password_hash: column.text(100),
      role: { type: Sequelize.ENUM('owner', 'staff'), allowNull: false, defaultValue: 'staff' },
      is_active: column.flag(true),
      must_change_password: column.flag(true),
      password_changed_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addConstraint('users', {
      type: 'unique',
      name: 'users_email_unique',
      fields: ['email'],
      transaction,
    });
  });
}

export async function down(queryInterface) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    for (const table of TABLES_IN_DROP_ORDER) {
      await queryInterface.dropTable(table, { transaction });
    }
    for (const enumType of ENUM_TYPES) {
      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${enumType}"`, { transaction });
    }
  });
}
