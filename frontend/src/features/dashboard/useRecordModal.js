import { useState } from 'react';

const NEW_RECORD = {};

export const useRecordModal = (onSaved) => {
  const [record, setRecord] = useState(null);

  return {
    isOpen: record !== null,
    record: record?.id ? record : null,
    open: (existing = NEW_RECORD) => setRecord(existing),
    close: () => setRecord(null),
    handleSaved: (response) => {
      setRecord(null);
      onSaved(response);
    },
  };
};
