import { Button } from '../../components/Button.jsx';
import { Form } from '../../components/Form.jsx';
import { FormField } from '../../components/FormField.jsx';

export const PatientStep = ({ form }) => (
  <Form form={form} className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        label="الاسم بالكامل"
        autoComplete="name"
        required
        className="sm:col-span-2"
        {...form.register('patientName')}
      />
      <FormField
        label="رقم الموبايل"
        type="tel"
        inputMode="tel"
        dir="ltr"
        autoComplete="tel"
        hint="ستتواصل معك العيادة على هذا الرقم لتأكيد الحجز"
        required
        {...form.register('phone')}
      />
      <FormField label="السن" type="number" inputMode="numeric" min="0" max="120" hint="اختياري" {...form.register('age')} />
      <FormField
        as="textarea"
        label="سبب الزيارة أو ملاحظات"
        rows={3}
        maxLength={500}
        hint="اختياري، مثل: انسداد في الأنف أو ألم في الأذن"
        className="sm:col-span-2"
        {...form.register('notes')}
      />
    </div>
    <Button type="submit" size="lg" icon="calendarCheck" isLoading={form.isSubmitting} className="w-full sm:w-auto">
      تأكيد الحجز
    </Button>
  </Form>
);
