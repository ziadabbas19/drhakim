import { Button } from '../../components/Button.jsx';
import { Form } from '../../components/Form.jsx';
import { FormField } from '../../components/FormField.jsx';
import { useI18n } from '../../hooks/useI18n.js';

export const PatientStep = ({ form }) => {
  const { t } = useI18n();

  return (
    <Form form={form} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label={t('booking.patient.fullName')}
          autoComplete="name"
          required
          className="sm:col-span-2"
          {...form.register('patientName')}
        />
        <FormField
          label={t('booking.patient.mobile')}
          type="tel"
          inputMode="tel"
          dir="ltr"
          autoComplete="tel"
          hint={t('booking.patient.mobileHint')}
          required
          {...form.register('phone')}
        />
        <FormField
          label={t('booking.patient.age')}
          type="number"
          inputMode="numeric"
          min="0"
          max="120"
          hint={t('common.optional')}
          {...form.register('age')}
        />
        <FormField
          as="textarea"
          label={t('booking.patient.notes')}
          rows={3}
          maxLength={500}
          hint={t('booking.patient.notesHint')}
          className="sm:col-span-2"
          {...form.register('notes')}
        />
      </div>
      <Button type="submit" size="lg" icon="calendarCheck" isLoading={form.isSubmitting} className="w-full sm:w-auto">
        {t('booking.submit')}
      </Button>
    </Form>
  );
};
