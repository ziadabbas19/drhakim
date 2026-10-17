import { useSearchParams } from 'react-router';
import { Tabs } from '../../../components/Tabs.jsx';
import { useI18n } from '../../../hooks/useI18n.js';
import { PanelHeader } from '../../dashboard/PanelHeader.jsx';
import { ABOUT_ITEM_TYPES } from '../aboutItemTypes.js';
import { AboutItemList } from './AboutItemList.jsx';
import { ProfileForm } from './ProfileForm.jsx';

const PROFILE_TAB = 'profile';

// The selected tab is kept in the address (?tab=surgery) so it survives a reload.
export const AboutPanel = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('tab');
  const tab = requested in ABOUT_ITEM_TYPES ? requested : PROFILE_TAB;

  const tabs = [
    { value: PROFILE_TAB, label: t('dashboard.about.profile.tab'), icon: 'user' },
    ...Object.entries(ABOUT_ITEM_TYPES).map(([type, { icon }]) => ({
      value: type,
      label: t(`dashboard.about.types.${type}.label`),
      icon,
    })),
  ];

  return (
    <>
      <PanelHeader title={t('dashboard.about.title')} description={t('dashboard.about.description')} />
      <Tabs
        label={t('dashboard.about.tabs')}
        tabs={tabs}
        value={tab}
        onChange={(next) => setSearchParams(next === PROFILE_TAB ? {} : { tab: next }, { replace: true })}
      >
        {tab === PROFILE_TAB ? <ProfileForm /> : <AboutItemList key={tab} type={tab} />}
      </Tabs>
    </>
  );
};
