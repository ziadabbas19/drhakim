import { Button } from '../../components/Button.jsx';

export const RowActions = ({ children }) => <div className="flex flex-wrap items-center justify-end gap-1">{children}</div>;

export const EditButton = ({ onClick }) => (
  <Button variant="ghost" size="sm" icon="edit" onClick={onClick}>
    تعديل
  </Button>
);

export const DeleteButton = ({ onClick }) => (
  <Button variant="ghostDanger" size="sm" icon="trash" onClick={onClick}>
    حذف
  </Button>
);
