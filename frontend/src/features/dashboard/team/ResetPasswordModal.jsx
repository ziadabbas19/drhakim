import { dashboardApi } from '../../../api/dashboard.js';
import { FormModal } from '../../../components/FormModal.jsx';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { resetPasswordSchema } from '../../../validators/team.js';
import { TemporaryPasswordField } from './TemporaryPasswordField.jsx';

export const ResetPasswordModal = ({ member, onClose, onSaved }) => {
  const form = useSubmitForm({
    initialValues: { password: '' },
    schema: resetPasswordSchema,
    submit: ({ password }) => dashboardApi.team.resetPassword(member.id, password),
    onSaved,
  });

  return (
    <FormModal
      title={`إعادة تعيين كلمة مرور ${member.fullName}`}
      description="ستتوقف كلمة المرور الحالية فورًا، وسيُطلب من العضو تعيين كلمة مرور جديدة عند الدخول."
      submitLabel="تعيين كلمة المرور"
      form={form}
      onClose={onClose}
    >
      <TemporaryPasswordField form={form} />
    </FormModal>
  );
};
