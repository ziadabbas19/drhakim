import { useId } from 'react';
import { Button } from './Button.jsx';
import { Form } from './Form.jsx';
import { Modal } from './Modal.jsx';

export const FormModal = ({ title, description, form, submitLabel = 'حفظ', onClose, children }) => {
  const formId = useId();

  return (
    <Modal
      title={title}
      description={description}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" form={formId} isLoading={form.isSubmitting}>
            {submitLabel}
          </Button>
        </>
      }
    >
      <Form form={form} id={formId}>
        {children}
      </Form>
    </Modal>
  );
};
