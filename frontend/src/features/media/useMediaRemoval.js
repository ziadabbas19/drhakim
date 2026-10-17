import { dashboardApi } from '../../api/dashboard.js';
import { useAction } from '../../hooks/useAction.js';
import { useConfirm } from '../../hooks/useConfirm.js';
import { useI18n } from '../../hooks/useI18n.js';
import { useToast } from '../../hooks/useToast.js';

const IN_USE = 409;

// "Clinic cover: El-Santa Clinic", "Doctor portrait", ...
export const useUsageLabel = () => {
  const { t, pick } = useI18n();
  return ({ ownerType, slot, owner }) => t(`media.usage.${ownerType}.${slot}`, { name: pick(owner, 'name') });
};

// Deleting asks once; an image still used on the site is only deleted after a second, explicit
// confirmation that lists where it appears.
export const useMediaRemoval = ({ onRemoved }) => {
  const { t } = useI18n();
  const confirm = useConfirm();
  const toast = useToast();
  const run = useAction();
  const usageLabel = useUsageLabel();

  return async (media) => {
    const confirmed = await confirm({
      title: t('media.deleteTitle'),
      message: t('media.deleteMessage'),
      confirmLabel: t('common.delete'),
    });
    if (!confirmed) return;

    try {
      const response = await dashboardApi.media.remove(media.id);
      toast.success(response.message);
      onRemoved();
    } catch (error) {
      if (error.status !== IN_USE) {
        toast.error(error.message);
        return;
      }
      const places = error.data.usages.map(usageLabel).join(' · ');
      await run(() => dashboardApi.media.remove(media.id, { force: true }), {
        confirmation: {
          title: t('media.inUseTitle'),
          message: t('media.inUseMessage', { places }),
          confirmLabel: t('media.deleteAnyway'),
        },
        onSuccess: onRemoved,
      });
    }
  };
};
