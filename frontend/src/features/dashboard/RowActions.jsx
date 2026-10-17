import { Button } from '../../components/Button.jsx';
import { Icon } from '../../components/Icon.jsx';
import { useI18n } from '../../hooks/useI18n.js';
import { cn } from '../../utils/cn.js';

export const RowActions = ({ className, children }) => (
  <div className={cn('flex flex-wrap items-center justify-end gap-1', className)}>{children}</div>
);

export const EditButton = (props) => {
  const { t } = useI18n();
  return (
    <Button variant="ghost" size="sm" icon="edit" {...props}>
      {t('common.edit')}
    </Button>
  );
};

export const DeleteButton = (props) => {
  const { t } = useI18n();
  return (
    <Button variant="ghostDanger" size="sm" icon="trash" {...props}>
      {t('common.delete')}
    </Button>
  );
};

// Up and down buttons for lists ordered with useReorder.
export const ReorderButtons = ({ index, count, onMove }) => {
  const { t } = useI18n();
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={t('common.moveUp')}
        disabled={index === 0}
        onClick={() => onMove(index, -1)}
      >
        <Icon name="arrowUp" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t('common.moveDown')}
        disabled={index === count - 1}
        onClick={() => onMove(index, 1)}
      >
        <Icon name="arrowDown" />
      </Button>
    </div>
  );
};
