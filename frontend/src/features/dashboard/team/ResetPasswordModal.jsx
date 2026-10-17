import { dashboardApi } from '../../../api/dashboard.js';
import { FormModal } from '../../../components/FormModal.jsx';
import { useI18n } from '../../../hooks/useI18n.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { resetPasswordSchema } from '../../../validators/team.js';
import { TemporaryPasswordField } from './TemporaryPasswordField.jsx';

export const ResetPasswordModal = ({ member, onClose, onSaved }) => {
  const { t } = useI18n();
  const form = useSubmitForm({
    initialValues: { password: '' },
    schema: resetPasswordSchema,
    submit: ({ password }) => dashboardApi.team.resetPassword(member.id, password),
    onSaved,
  });

  return (
    <FormModal
      title={t('dashboard.team.reset.title', { name: member.fullName })}
      description={t('dashboard.team.reset.description')}
      submitLabel={t('dashboard.team.reset.submit')}
      form={form}
      onClose={onClose}
    >
      <TemporaryPasswordField form={form} />
    </FormModal>
  );
};
