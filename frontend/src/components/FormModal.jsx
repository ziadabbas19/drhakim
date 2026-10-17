import { useId } from 'react';
import { useI18n } from '../hooks/useI18n.js';
import { Button } from './Button.jsx';
import { Form } from './Form.jsx';
import { Modal } from './Modal.jsx';

export const FormModal = ({ title, description, form, submitLabel, size, onClose, children }) => {
  const { t } = useI18n();
  const formId = useId();

  return (
    <Modal
      title={title}
      description={description}
      size={size}
      onClose={onClose}
      footer={(dismiss) => (
        <>
          <Button variant="ghost" onClick={() => dismiss()}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form={formId} isLoading={form.isSubmitting}>
            {submitLabel ?? t('common.save')}
          </Button>
        </>
      )}
    >
      <Form form={form} id={formId}>
        {children}
      </Form>
    </Modal>
  );
};
