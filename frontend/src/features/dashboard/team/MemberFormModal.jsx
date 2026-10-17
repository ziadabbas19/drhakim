import { dashboardApi } from '../../../api/dashboard.js';
import { FormField } from '../../../components/FormField.jsx';
import { FormModal } from '../../../components/FormModal.jsx';
import { ROLE_OPTIONS } from '../../../config/constants.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { pickValues } from '../../../utils/object.js';
import { createMemberSchema, updateMemberSchema } from '../../../validators/team.js';
import { TemporaryPasswordField } from './TemporaryPasswordField.jsx';

const EDITABLE_FIELDS = { fullName: '', role: 'staff' };
const NEW_MEMBER = { ...EDITABLE_FIELDS, email: '', password: '' };

export const MemberFormModal = ({ member, isSelf, onClose, onSaved }) => {
  const form = useSubmitForm({
    initialValues: member ? pickValues(member, EDITABLE_FIELDS) : NEW_MEMBER,
    schema: member ? updateMemberSchema : createMemberSchema,
    submit: (values) => {
      if (!member) return dashboardApi.team.create(values);
      return dashboardApi.team.update(member.id, isSelf ? { fullName: values.fullName } : values);
    },
    onSaved,
  });

  return (
    <FormModal
      title={member ? `تعديل بيانات ${member.fullName}` : 'إضافة عضو للفريق'}
      description={member ? undefined : 'يمكن للعضو الدخول بالبريد الإلكتروني وكلمة المرور المؤقتة من صفحة الدخول.'}
      form={form}
      onClose={onClose}
    >
      {!member && (
        <FormField label="البريد الإلكتروني" type="email" dir="ltr" autoComplete="off" required {...form.register('email')} />
      )}
      <FormField label="الاسم بالكامل" required {...form.register('fullName')} />
      <FormField
        label="الصلاحية"
        as="select"
        options={ROLE_OPTIONS}
        disabled={isSelf}
        hint={isSelf ? 'لا يمكنك تغيير صلاحية حسابك الشخصي' : 'المساعد يدير الحجوزات ويطّلع على مواعيد العيادات'}
        required
        {...form.register('role')}
      />
      {!member && <TemporaryPasswordField form={form} />}
    </FormModal>
  );
};
