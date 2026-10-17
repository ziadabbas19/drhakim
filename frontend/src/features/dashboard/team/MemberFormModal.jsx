import { dashboardApi } from '../../../api/dashboard.js';
import { FormField } from '../../../components/FormField.jsx';
import { FormModal } from '../../../components/FormModal.jsx';
import { useI18n } from '../../../hooks/useI18n.js';
import { useOptions } from '../../../hooks/useOptions.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { pickValues } from '../../../utils/object.js';
import { createMemberSchema, updateMemberSchema } from '../../../validators/team.js';
import { TemporaryPasswordField } from './TemporaryPasswordField.jsx';

const EDITABLE_FIELDS = { fullName: '', role: 'staff' };
const NEW_MEMBER = { ...EDITABLE_FIELDS, email: '', password: '' };

export const MemberFormModal = ({ member, isSelf, onClose, onSaved }) => {
  const { t } = useI18n();
  const roleOptions = useOptions('role');
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
      title={member ? t('dashboard.team.form.editTitle', { name: member.fullName }) : t('dashboard.team.form.newTitle')}
      description={member ? undefined : t('dashboard.team.form.newDescription')}
      form={form}
      onClose={onClose}
    >
      {!member && (
        <FormField
          label={t('dashboard.team.form.email')}
          type="email"
          dir="ltr"
          autoComplete="off"
          required
          {...form.register('email')}
        />
      )}
      <FormField label={t('dashboard.team.form.fullName')} required {...form.register('fullName')} />
      <FormField
        label={t('dashboard.team.form.role')}
        as="select"
        options={roleOptions}
        disabled={isSelf}
        hint={isSelf ? t('dashboard.team.form.selfRoleHint') : t('dashboard.team.form.roleHint')}
        required
        {...form.register('role')}
      />
      {!member && <TemporaryPasswordField form={form} />}
    </FormModal>
  );
};
