import { useMemo } from 'react';
import { dashboardApi } from '../../../api/dashboard.js';
import { Alert } from '../../../components/Alert.jsx';
import { AsyncContent } from '../../../components/AsyncContent.jsx';
import { Badge } from '../../../components/Badge.jsx';
import { Button } from '../../../components/Button.jsx';
import { useAction } from '../../../hooks/useAction.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { useOptionLabel } from '../../../hooks/useOptions.js';
import { ReorderableList } from '../../dashboard/ReorderableList.jsx';
import { DeleteButton, EditButton } from '../../dashboard/RowActions.jsx';
import { useRecordModal } from '../../dashboard/useRecordModal.js';
import { useReorder } from '../../dashboard/useReorder.js';
import { ABOUT_ITEM_TYPES } from '../aboutItemTypes.js';
import { AboutItemFormModal } from './AboutItemFormModal.jsx';

const ItemSummary = ({ type, item }) => {
  const { t, pick } = useI18n();
  const optionLabel = useOptionLabel();
  const detail = type === 'stat' ? item.value : pick(item, 'subtitle');

  return (
    <div className="space-y-1">
      <p className="font-bold text-ink-strong">{pick(item, 'title')}</p>
      {detail && <p className="text-sm text-ink-subtle">{detail}</p>}
      <div className="flex flex-wrap gap-1.5">
        {!item.isActive && <Badge>{t('common.hidden')}</Badge>}
        {type === 'surgery' && (
          <>
            {item.category && <Badge tone="brand">{optionLabel('surgeryCategory', item.category)}</Badge>}
            <Badge>
              {item.gallery.length
                ? t('about.surgeries.imageCount', { count: item.gallery.length })
                : t('dashboard.about.list.noImages')}
            </Badge>
          </>
        )}
      </div>
    </div>
  );
};

// One About list: add, edit, hide or show, reorder, and delete its items.
export const AboutItemList = ({ type }) => {
  const { t, pick } = useI18n();
  const run = useAction();
  const api = useMemo(() => dashboardApi.about.items(type), [type]);
  const items = useFetch(api.list, [api]);
  const itemModal = useRecordModal(items.reload);
  const move = useReorder({ items: items.data ?? [], reorder: api.reorder, onSuccess: items.reload });
  const { reminder } = ABOUT_ITEM_TYPES[type];

  const toggleVisibility = (item) =>
    run(() => api.update(item.id, { isActive: !item.isActive }), { onSuccess: items.reload });

  const remove = (item) =>
    run(() => api.remove(item.id), {
      confirmation: {
        title: t('dashboard.about.list.removeTitle'),
        message: t('dashboard.about.list.removeMessage', { name: pick(item, 'title') }),
        confirmLabel: t('common.delete'),
      },
      onSuccess: items.reload,
    });

  return (
    <div className="space-y-4">
      {reminder && <Alert tone="warning">{t(`dashboard.about.${reminder}`)}</Alert>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">{t('dashboard.about.list.hideHint')}</p>
        <Button icon="plus" onClick={() => itemModal.open()}>
          {t('dashboard.about.list.add')}
        </Button>
      </div>
      <AsyncContent {...items} onRetry={items.reload} emptyMessage={t('dashboard.about.list.empty')}>
        {(data) => (
          <ReorderableList
            items={data}
            onMove={move}
            renderItem={(item) => <ItemSummary type={type} item={item} />}
            renderActions={(item) => (
              <>
                <EditButton onClick={() => itemModal.open(item)} />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={item.isActive ? 'hide' : 'show'}
                  onClick={() => toggleVisibility(item)}
                >
                  {item.isActive ? t('common.hide') : t('common.show')}
                </Button>
                <DeleteButton onClick={() => remove(item)} />
              </>
            )}
          />
        )}
      </AsyncContent>
      {itemModal.isOpen && (
        <AboutItemFormModal
          type={type}
          item={itemModal.record}
          onClose={itemModal.close}
          onSaved={itemModal.handleSaved}
        />
      )}
    </div>
  );
};
